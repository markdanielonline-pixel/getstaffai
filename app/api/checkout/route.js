import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { resolvePriceEnvVar } from '@/lib/billing/tierMap';
import { provisionInitialWorkforce } from '@/lib/workforce';

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

    if (!companyName?.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const ceoResult = await admin.from('ceos').select('org_id, stripe_customer_id, name, email').eq('id', user.id).single();
    if (ceoResult.error) throw new Error(`Unable to load CEO record: ${ceoResult.error.message}`);

    let orgId = ceoResult.data.org_id;
    if (!orgId) {
      const orgResult = await admin.from('organizations').insert({
        name: companyName.trim(),
        industry: industry || null,
        status: 'active',
        settings: {},
      }).select('id').single();
      if (orgResult.error) throw new Error(`Unable to create organization: ${orgResult.error.message}`);
      orgId = orgResult.data.id;
    } else {
      const orgResult = await admin.from('organizations').update({
        name: companyName.trim(),
        industry: industry || null,
        updated_at: new Date().toISOString(),
      }).eq('id', orgId);
      if (orgResult.error) throw new Error(`Unable to update organization: ${orgResult.error.message}`);
    }

    const ceoUpdate = await admin.from('ceos').update({
        org_id: orgId,
        company_name: companyName,
        industry,
        business_description: businessDescription,
        country,
        company_values: companyValues,
        culture_tone: cultureTone,
        preferred_channel: preferredChannel || 'app',
      }).eq('id', user.id);
    if (ceoUpdate.error) throw new Error(`Unable to save incorporation details: ${ceoUpdate.error.message}`);

    // If Launch tier, bypass Stripe checkout entirely and instantly provision.
    if (tierName === 'Launch') {
      const activateResult = await admin.from('ceos').update({
        status: 'active',
        intelligence_level: 'free',
        billing_period: billing,
        incorporated_at: new Date().toISOString(),
      }).eq('id', user.id);
      if (activateResult.error) throw new Error(`Unable to activate CEO: ${activateResult.error.message}`);

      const subscriptionResult = await admin.from('subscriptions').upsert({
        ceo_id: user.id,
        intelligence_level: 'free',
        billing_period: billing,
        status: 'active',
        access_fee_cents: 0,
      }, { onConflict: 'ceo_id' });
      if (subscriptionResult.error) throw new Error(`Unable to create subscription: ${subscriptionResult.error.message}`);

      const walletResult = await admin.from('wallets').upsert(
        { ceo_id: user.id, balance_cents: 0 },
        { onConflict: 'ceo_id', ignoreDuplicates: true }
      );
      if (walletResult.error) throw new Error(`Unable to create wallet: ${walletResult.error.message}`);

      await provisionInitialWorkforce(user.id, 'free');

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
    const ceo = ceoResult.data;
    let customerId = ceo?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: ceo?.name || undefined,
        metadata: { ceo_id: user.id },
      });
      customerId = customer.id;
      const customerResult = await admin.from('ceos').update({ stripe_customer_id: customerId }).eq('id', user.id);
      if (customerResult.error) throw new Error(`Unable to save Stripe customer: ${customerResult.error.message}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${siteUrl}/portal/incorporate/success`,
      cancel_url: `${siteUrl}/portal/incorporate`,
      allow_promotion_codes: true,
      metadata: { ceo_id: user.id, org_id: orgId, tier: tierName, billing },
      subscription_data: {
        metadata: { ceo_id: user.id, org_id: orgId, tier: tierName, billing },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[/api/checkout]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
