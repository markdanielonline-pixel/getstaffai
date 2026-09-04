import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { COMPANY_OFFICE_KEY, getCatalogProduct, priceEnvVar } from '@/lib/billing/catalog';
import { provisionInitialWorkforce } from '@/lib/workforce';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const {
      productKey = COMPANY_OFFICE_KEY,
      billing = 'monthly',
      companyName,
      industry,
      businessDescription,
      country,
      companyValues,
      cultureTone,
      preferredChannel,
    } = await req.json();
    const siteUrl = new URL(req.url).origin;

    const product = getCatalogProduct(productKey);
    if (!product || productKey !== COMPANY_OFFICE_KEY || !['monthly', 'annual'].includes(billing)) {
      return NextResponse.json({ error: 'Invalid Company Office selection' }, { status: 400 });
    }

    if (!companyName?.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const ceoResult = await admin.from('ceos').select('org_id, stripe_customer_id, name, email').eq('id', user.id).single();
    if (ceoResult.error) throw new Error(`Unable to load CEO record: ${ceoResult.error.message}`);

    let orgId = ceoResult.data.org_id;
    const existingSubscription = await admin.from('subscriptions')
      .select('id, status, stripe_subscription_id')
      .eq('ceo_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .maybeSingle();
    if (existingSubscription.error) throw new Error(`Unable to verify subscription state: ${existingSubscription.error.message}`);
    if (existingSubscription.data) {
      return NextResponse.json({ error: 'Your Company Office already has a subscription. Manage it from Billing.' }, { status: 409 });
    }
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

    const envVar = priceEnvVar(productKey, billing);
    const priceId = process.env[envVar];
    if (!priceId) {
      console.error(`[checkout] Missing env var ${envVar}`);
      return NextResponse.json({ error: 'This plan is not currently available' }, { status: 400 });
    }

    const lineItems = [{ price: priceId, quantity: 1 }];

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
      metadata: { ceo_id: user.id, org_id: orgId, product_key: productKey, billing },
      subscription_data: {
        metadata: { ceo_id: user.id, org_id: orgId, product_key: productKey, billing },
        trial_period_days: 7,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[/api/checkout]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
