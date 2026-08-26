import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolvePriceEnvVar } from '@/lib/billing/tierMap';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const VALID_TIERS = ['Launch', 'Operator', 'Accelerator', 'Authority', 'Dominance'];

const ADDON_RECURRING = {
  callRecording: 'price_1T2bh1Be48ha5T2sLcSvvXtz',
  extraNumber: 'price_1T2biqBe48ha5T2s9BYAaSJK',
};

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const {
      tierName,
      billing = 'monthly',
      addons = {},
      companyName,
      industry,
      businessDescription,
      country,
      companyValues,
      cultureTone,
      preferredChannel,
    } = await req.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.getstaffai.com';

    if (!VALID_TIERS.includes(tierName)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Save incorporation details before checkout — survives abandonment.
    if (companyName) {
      await supabase.from('ceos').update({
        company_name: companyName,
        industry,
        business_description: businessDescription,
        country,
        company_values: companyValues,
        culture_tone: cultureTone,
        preferred_channel: preferredChannel || 'app',
      }).eq('id', user.id);
    }

    // If Launch tier, bypass Stripe checkout entirely and instantly provision.
    if (tierName === 'Launch') {
      await supabase.from('ceos').update({
        status: 'active',
        intelligence_level: 'free',
        billing_period: billing,
        incorporated_at: new Date().toISOString(),
      }).eq('id', user.id);

      await supabase.from('subscriptions').upsert({
        ceo_id: user.id,
        intelligence_level: 'free',
        billing_period: billing,
        status: 'active',
        access_fee_cents: 0,
      }, { onConflict: 'ceo_id' });

      await supabase.from('wallets').upsert(
        { ceo_id: user.id, balance_cents: 0 },
        { onConflict: 'ceo_id', ignoreDuplicates: true }
      );

      return NextResponse.json({ url: `${siteUrl}/portal/incorporate/success` });
    }

    // Resolve the real Stripe Price ID server-side — never trust a client-supplied price ID.
    const envVar = resolvePriceEnvVar(tierName, billing);
    const priceId = process.env[envVar];
    if (!priceId) {
      console.error(`[checkout] Missing env var ${envVar}`);
      return NextResponse.json({ error: 'This plan is not currently available' }, { status: 400 });
    }

    const lineItems = [{ price: priceId, quantity: 1 }];
    if (billing === 'monthly') {
      if (addons.callRecording) lineItems.push({ price: ADDON_RECURRING.callRecording, quantity: 1 });
      if (addons.extraNumber > 0) lineItems.push({ price: ADDON_RECURRING.extraNumber, quantity: addons.extraNumber });
    }

    // Get or create the Stripe customer for this CEO
    const { data: ceo } = await supabase.from('ceos').select('stripe_customer_id, name, email').eq('id', user.id).single();
    let customerId = ceo?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: ceo?.name || undefined,
        metadata: { ceo_id: user.id },
      });
      customerId = customer.id;
      await supabase.from('ceos').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${siteUrl}/portal/incorporate/success`,
      cancel_url: `${siteUrl}/portal/incorporate`,
      allow_promotion_codes: true,
      metadata: { ceo_id: user.id, tier: tierName, billing },
      subscription_data: {
        metadata: { ceo_id: user.id, tier: tierName, billing },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[/api/checkout]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
