import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const admin = await createAdminClient();
    const ceoResult = await admin
      .from('ceos')
      .select('id, name, email, stripe_customer_id')
      .eq('id', user.id)
      .single();
    if (ceoResult.error) throw new Error(`Unable to load account: ${ceoResult.error.message}`);

    let customerId = ceoResult.data.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || ceoResult.data.email || undefined,
        name: ceoResult.data.name || undefined,
        metadata: { ceo_id: user.id },
      });
      customerId = customer.id;
      const updateResult = await admin.from('ceos').update({ stripe_customer_id: customerId }).eq('id', user.id);
      if (updateResult.error) throw new Error(`Unable to save Stripe customer: ${updateResult.error.message}`);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.getstaffai.com';
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/portal/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[/api/billing/portal]', error);
    return NextResponse.json({ error: 'Billing portal is unavailable right now.' }, { status: 500 });
  }
}
