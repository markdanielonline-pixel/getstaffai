import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Maps tier name → Stripe price ID
const PRICE_MAP = {
  Operator:    process.env.STRIPE_PRICE_OPERATOR,
  Accelerator: process.env.STRIPE_PRICE_ACCELERATOR,
  Authority:   process.env.STRIPE_PRICE_AUTHORITY,
  Dominance:   process.env.STRIPE_PRICE_DOMINANCE,
};

// Recurring add-on price IDs
const ADDON_RECURRING = {
  callRecording: process.env.STRIPE_PRICE_ADDON_CALL_RECORDING,
  extraNumber:   process.env.STRIPE_PRICE_ADDON_EXTRA_NUMBER,
};

export async function POST(req) {
  try {
    const { tierName, addons = {}, email } = await req.json();
    const siteUrl = process.env.APP_URL || 'https://www.getstaffai.com';

    // Free tier — no Stripe needed
    if (tierName === 'Launch') {
      return NextResponse.json({ url: `${siteUrl}/portal/signup?plan=launch` });
    }

    const basePriceId = PRICE_MAP[tierName];
    if (!basePriceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Build line items — base plan first
    const lineItems = [{ price: basePriceId, quantity: 1 }];

    // Add recurring add-ons
    if (addons.callRecording && ADDON_RECURRING.callRecording) {
      lineItems.push({ price: ADDON_RECURRING.callRecording, quantity: 1 });
    }
    if (addons.extraNumber > 0 && ADDON_RECURRING.extraNumber) {
      lineItems.push({ price: ADDON_RECURRING.extraNumber, quantity: addons.extraNumber });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email || undefined,
      success_url: `${siteUrl}/portal/signup?plan=${tierName.toLowerCase()}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: { tier: tierName },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[/api/checkout] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
