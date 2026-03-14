import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ADDON_RECURRING = {
  callRecording: 'price_1T2bh1Be48ha5T2sLcSvvXtz',
  extraNumber:   'price_1T2biqBe48ha5T2s9BYAaSJK',
};

export async function POST(req) {
  try {
    const { priceId, tierName, billing = 'monthly', addons = {}, email } = await req.json();
    const siteUrl = process.env.APP_URL || 'https://www.getstaffai.com';

    // Free tier — skip Stripe
    if (tierName === 'Launch') {
      return NextResponse.json({ url: `${siteUrl}/portal/signup?plan=launch` });
    }

    if (!priceId) {
      return NextResponse.json({ error: 'No price ID for selected plan' }, { status: 400 });
    }

    // Base subscription line item
    const lineItems = [{ price: priceId, quantity: 1 }];

    // Recurring add-ons (only valid on monthly billing — annual subscriptions don't support mixed intervals)
    if (billing === 'monthly') {
      if (addons.callRecording) {
        lineItems.push({ price: ADDON_RECURRING.callRecording, quantity: 1 });
      }
      if (addons.extraNumber > 0) {
        lineItems.push({ price: ADDON_RECURRING.extraNumber, quantity: addons.extraNumber });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email || undefined,
      success_url: `${siteUrl}/portal/signup?plan=${tierName.toLowerCase()}&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: { tier: tierName, billing },
      subscription_data: {
        metadata: { tier: tierName, billing },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[/api/checkout]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
