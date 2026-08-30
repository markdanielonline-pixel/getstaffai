import Stripe from 'stripe';
import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { provisionInitialWorkforce } from '@/lib/workforce';
import { PLAN_TO_INTELLIGENCE_LEVEL } from '@/lib/billing/tierMap';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.deleted',
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

async function resolveBillingContext(event) {
  const object = event.data.object;

  let ceoId = event.type === 'checkout.session.completed' ? object.metadata?.ceo_id : null;

  if (!ceoId) {
    const subscriptionId = event.type === 'customer.subscription.deleted'
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

export async function POST(req) {
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
    const billingContext = await resolveBillingContext(event);
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
        const tier = session.metadata?.tier;
        const billingPeriod = session.metadata?.billing === 'annual' ? 'annual' : 'monthly';
        const intelligenceLevel = tier ? PLAN_TO_INTELLIGENCE_LEVEL[tier] : null;

        if (!ceoId || !intelligenceLevel) {
          console.error('[Stripe Webhook] Missing ceo_id or unrecognised tier on session', session.id, tier);
          throw new Error(`Missing or invalid checkout metadata for session ${session.id}`);
        }

        assertSupabase(await supabaseAdmin.from('ceos').update({
          status: 'active',
          intelligence_level: intelligenceLevel,
          billing_period: billingPeriod,
          stripe_subscription_id: session.subscription,
          incorporated_at: new Date().toISOString(),
        }).eq('id', ceoId), 'Activate CEO after checkout');

        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        assertSupabase(await supabaseAdmin.from('subscriptions').upsert({
          ceo_id: ceoId,
          stripe_subscription_id: session.subscription,
          intelligence_level: intelligenceLevel,
          billing_period: billingPeriod,
          status: 'active',
          access_fee_cents: subscription.items.data[0]?.price?.unit_amount ?? 0,
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
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
        assertSupabase(await supabaseAdmin.from('subscriptions').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('stripe_subscription_id', subscription.id), 'Cancel subscription');
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) break;
        assertSupabase(await supabaseAdmin.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', subId), 'Mark subscription past due');
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
