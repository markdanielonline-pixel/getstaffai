import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { triggerSophiaFirstContact } from '@/lib/sophia/first-contact';
import { PLAN_TO_INTELLIGENCE_LEVEL } from '@/lib/billing/tierMap';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const ceoId = session.metadata?.ceo_id;
        const tier = session.metadata?.tier;
        const billingPeriod = session.metadata?.billing === 'annual' ? 'annual' : 'monthly';
        const intelligenceLevel = tier ? PLAN_TO_INTELLIGENCE_LEVEL[tier] : null;

        if (!ceoId || !intelligenceLevel) {
          console.error('[Stripe Webhook] Missing ceo_id or unrecognised tier on session', session.id, tier);
          break;
        }

        await supabaseAdmin.from('ceos').update({
          status: 'active',
          intelligence_level: intelligenceLevel,
          billing_period: billingPeriod,
          stripe_subscription_id: session.subscription,
          incorporated_at: new Date().toISOString(),
        }).eq('id', ceoId);

        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await supabaseAdmin.from('subscriptions').upsert({
          ceo_id: ceoId,
          stripe_subscription_id: session.subscription,
          intelligence_level: intelligenceLevel,
          billing_period: billingPeriod,
          status: 'active',
          access_fee_cents: subscription.items.data[0]?.price?.unit_amount ?? 0,
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
        }, { onConflict: 'stripe_subscription_id' });

        await supabaseAdmin.from('wallets').upsert(
          { ceo_id: ceoId, balance_cents: 0 },
          { onConflict: 'ceo_id', ignoreDuplicates: true }
        );

        // Fire and forget — webhook must return 200 quickly.
        triggerSophiaFirstContact(ceoId, intelligenceLevel).catch(err => {
          console.error('[Stripe Webhook] triggerSophiaFirstContact failed for CEO', ceoId, err);
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        let ceoId = subscription.metadata?.ceo_id;
        if (!ceoId) {
          const { data: ceosRow } = await supabaseAdmin.from('ceos').select('id').eq('stripe_subscription_id', subscription.id).single();
          ceoId = ceosRow?.id;
        }
        if (!ceoId) break;

        await supabaseAdmin.from('ceos').update({ status: 'dissolved' }).eq('id', ceoId);
        await supabaseAdmin.from('subscriptions').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) break;
        await supabaseAdmin.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', subId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook Endpoint Error]:', error);
    return NextResponse.json({ error: 'Internal Webhook Error' }, { status: 500 });
  }
}
