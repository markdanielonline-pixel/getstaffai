import Stripe from 'stripe';
import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { provisionInitialWorkforce } from '@/lib/workforce';
import { PLAN_TO_INTELLIGENCE_LEVEL } from '@/lib/billing/tierMap';

// Provisioning waits on real runtime installs (~1 min per agent, ~2 min for a
// fresh tenant container). The operation is leased and resumable, so an
// overrun is safe, but this budget lets a normal run finish in one pass.
export const maxDuration = 300;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

function eventUuid(stripeEventId) {
  const hex = createHash('sha256').update(`stripe:${stripeEventId}`).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20)}`;
}

function assertSupabase(result, operation) {
  if (result.error) throw new Error(`${operation}: ${result.error.message}`);
  return result.data;
}

async function resolveBillingContext(event, supabaseAdmin) {
  const object = event.data.object;

  let ceoId = event.type === 'checkout.session.completed' ? object.metadata?.ceo_id : null;

  if (!ceoId) {
    const subscriptionId = event.type.startsWith('customer.subscription.')
      ? object.id
      : (typeof object.subscription === 'string' ? object.subscription : object.subscription?.id);

    if (!subscriptionId) return null;
    const result = await supabaseAdmin
      .from('subscriptions')
      .select('ceo_id')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle();
    ceoId = assertSupabase(result, 'Resolve Stripe subscription owner')?.ceo_id || null;
  }

  if (!ceoId) return null;
  const ceoResult = await supabaseAdmin.from('ceos').select('id, org_id').eq('id', ceoId).maybeSingle();
  const ceo = assertSupabase(ceoResult, 'Resolve CEO organization');
  return ceo?.org_id ? { ceoId: ceo.id, orgId: ceo.org_id } : null;
}

/**
 * When the current billing period starts and ends.
 *
 * Stripe moved current_period_start and current_period_end off the subscription
 * and onto its items in a recent API version, and the SDK here pins a version
 * where they are gone from the top level. Reading only the old location wrote
 * null for both dates on every subscription, which is invisible until something
 * needs to know when the next payment is due. Payment reminders need exactly
 * that. Verified against a live subscription: Stripe held the dates, the
 * database held nulls.
 */
function billingPeriodOf(subscription) {
  const item = subscription?.items?.data?.[0];
  const start = subscription?.current_period_start ?? item?.current_period_start ?? null;
  const end = subscription?.current_period_end ?? item?.current_period_end ?? null;
  return {
    start: start ? new Date(start * 1000).toISOString() : null,
    end: end ? new Date(end * 1000).toISOString() : null,
  };
}

export async function POST(req) {
  const supabaseAdmin = getSupabaseAdmin();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe Webhook] Signature validation failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    const billingContext = await resolveBillingContext(event, supabaseAdmin);
    if (!billingContext) throw new Error(`Unable to resolve CEO organization for ${event.type}`);
    const { ceoId, orgId } = billingContext;

    const storedEventId = eventUuid(event.id);
    const existingResult = await supabaseAdmin
      .from('staffai_events')
      .select('id, status')
      .eq('id', storedEventId)
      .maybeSingle();
    const existingEvent = assertSupabase(existingResult, 'Read Stripe event idempotency record');

    if (existingEvent?.status === 'completed') {
      console.log(`[Stripe Webhook] Event ${event.id} already completed. Skipping.`);
      return NextResponse.json({ received: true });
    }

    if (!existingEvent) {
      const insertResult = await supabaseAdmin.from('staffai_events').insert({
        id: storedEventId,
        event_type: event.type,
        org_id: orgId,
        source: 'stripe_webhook',
        data: { stripe_event_id: event.id, object_id: event.data.object.id },
        status: 'processing'
      });

      if (insertResult.error?.code === '23505') {
        return NextResponse.json({ received: true });
      }
      assertSupabase(insertResult, 'Create Stripe event idempotency record');
    } else {
      assertSupabase(
        await supabaseAdmin.from('staffai_events').update({ status: 'processing' }).eq('id', storedEventId),
        'Retry Stripe event'
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const productKey = session.metadata?.product_key;
        const billingPeriod = session.metadata?.billing === 'annual' ? 'annual' : 'monthly';
        const intelligenceLevel = productKey ? PLAN_TO_INTELLIGENCE_LEVEL[productKey] : null;

        if (!ceoId || !intelligenceLevel) {
          console.error('[Stripe Webhook] Missing ceo_id or unrecognised product on session', session.id, productKey);
          throw new Error(`Missing or invalid checkout metadata for session ${session.id}`);
        }

        const subscription = typeof session.subscription === 'object'
          ? session.subscription
          : await stripe.subscriptions.retrieve(session.subscription);
        const subscriptionId = subscription.id;
        const subscriptionStatus = subscription.status === 'trialing' ? 'trialing' : 'active';

        assertSupabase(await supabaseAdmin.from('ceos').update({
          status: 'active',
          intelligence_level: intelligenceLevel,
          billing_period: billingPeriod,
          stripe_subscription_id: subscriptionId,
          incorporated_at: new Date().toISOString(),
        }).eq('id', ceoId), 'Activate CEO after checkout');

        assertSupabase(await supabaseAdmin.from('subscriptions').upsert({
          ceo_id: ceoId,
          stripe_subscription_id: subscriptionId,
          intelligence_level: intelligenceLevel,
          billing_period: billingPeriod,
          status: subscriptionStatus,
          access_fee_cents: subscription.items.data[0]?.price?.unit_amount ?? 0,
          current_period_start: billingPeriodOf(subscription).start,
          current_period_end: billingPeriodOf(subscription).end,
        }, { onConflict: 'stripe_subscription_id' }), 'Synchronize subscription after checkout');

        assertSupabase(await supabaseAdmin.from('wallets').upsert(
          { ceo_id: ceoId, balance_cents: 0 },
          { onConflict: 'ceo_id', ignoreDuplicates: true }
        ), 'Create CEO wallet');

        await provisionInitialWorkforce(ceoId, intelligenceLevel);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        assertSupabase(await supabaseAdmin.from('ceos').update({ status: 'dissolved' }).eq('id', ceoId), 'Dissolve CEO after cancellation');
        assertSupabase(await supabaseAdmin.from('subscriptions').update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancel_at_period_end: true,
          current_period_end: billingPeriodOf(subscription).end,
        }).eq('stripe_subscription_id', subscription.id), 'Cancel subscription');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = ['active', 'trialing', 'past_due', 'cancelled'].includes(subscription.status)
          ? subscription.status
          : (subscription.status === 'canceled' ? 'cancelled' : 'past_due');
        assertSupabase(await supabaseAdmin.from('subscriptions').update({
          status,
          current_period_start: billingPeriodOf(subscription).start,
          current_period_end: billingPeriodOf(subscription).end,
          cancelled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        }).eq('stripe_subscription_id', subscription.id), 'Synchronize subscription update');
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) break;
        // Clearing past_due_since matters as much as the status: it is what the
        // grace period counts from, and a customer who pays should not carry a
        // stale clock into their next cycle.
        assertSupabase(await supabaseAdmin.from('subscriptions')
          .update({ status: 'active', past_due_since: null, access_suspended_at: null })
          .eq('stripe_subscription_id', subId), 'Mark subscription active');
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) break;
        // Stamped only on the first failure, so retries do not keep pushing the
        // grace period forward and a customer never gets an endless reprieve.
        const existing = await supabaseAdmin.from('subscriptions')
          .select('past_due_since').eq('stripe_subscription_id', subId).maybeSingle();
        assertSupabase(await supabaseAdmin.from('subscriptions').update({
          status: 'past_due',
          past_due_since: existing.data?.past_due_since || new Date().toISOString(),
        }).eq('stripe_subscription_id', subId), 'Mark subscription past due');
        break;
      }
    }

    assertSupabase(
      await supabaseAdmin.from('staffai_events').update({ status: 'completed', processed_at: new Date().toISOString() }).eq('id', storedEventId),
      'Complete Stripe event'
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook Endpoint Error]:', error);
    const storedEventId = eventUuid(event.id);
    await supabaseAdmin
      .from('staffai_events')
      .update({ status: 'failed' })
      .eq('id', storedEventId);
    return NextResponse.json({ error: 'Internal Webhook Error' }, { status: 500 });
  }
}
