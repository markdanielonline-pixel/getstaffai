import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { priceEnvVar } from './catalog';

/**
 * Charging for an employee.
 *
 * Hiring used to bill nothing at all. The employee row recorded a seat fee, the
 * hire screen showed "$249/mo" next to the button, and no Stripe call existed
 * anywhere in the codebase. A customer paying $199 for the Company Office could
 * hire every specialist in the catalogue and never be charged for one of them.
 *
 * A seat is now a line on the customer's existing subscription. Stripe prorates
 * the addition, so hiring mid-cycle costs the remainder of the month and the
 * full amount thereafter, which is what the price on the button implies.
 *
 * Two rules, both deliberate.
 *
 * The charge is created before the runtime is built, and a failure to charge
 * stops the hire. The opposite ordering gives away a working employee whenever
 * Stripe declines, which is exactly the failure that costs the most.
 *
 * Founder access is comped rather than billed, because Staff AI runs on its own
 * product and must not invoice itself. That is recorded on the seat as a comp,
 * not silently skipped, so the books say why the seat is free.
 */

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Billing is not configured');
  return new Stripe(key);
}

export async function activeSubscriptionFor(ceoId) {
  const db = admin();
  const { data } = await db.from('subscriptions')
    .select('stripe_subscription_id, status, billing_period')
    .eq('ceo_id', ceoId)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data || null;
}

/**
 * Add a seat to the customer's subscription. Returns what was recorded so the
 * caller can store it against the employee.
 */
export async function chargeForSeat({ ceo, roleKey, roleName, monthlyCents }) {
  // Staff AI is its own customer. The founder grant is honoured here rather
  // than by pretending a subscription exists.
  if (ceo.is_founder === true) {
    return { billed: false, comped: true, reason: 'founder access', subscriptionItemId: null };
  }

  const subscription = await activeSubscriptionFor(ceo.id);
  if (!subscription?.stripe_subscription_id) {
    throw new Error('Hiring needs an active subscription. Open Billing and start your Company Office first.');
  }

  const billing = subscription.billing_period === 'annual' ? 'annual' : 'monthly';
  const envVar = priceEnvVar(roleKey, billing);
  const priceId = process.env[envVar];
  if (!priceId) {
    // Never fall back to a different price. Charging the wrong amount is worse
    // than refusing the hire.
    console.error(`[billing.seats] missing ${envVar} for ${roleKey}`);
    throw new Error(`${roleName} cannot be hired right now. Billing for that role is not configured.`);
  }

  const item = await stripe().subscriptionItems.create({
    subscription: subscription.stripe_subscription_id,
    price: priceId,
    quantity: 1,
    proration_behavior: 'create_prorations',
    metadata: { staffai_role: roleKey, ceo_id: ceo.id, org_id: ceo.org_id || '' },
  });

  return {
    billed: true,
    comped: false,
    subscriptionItemId: item.id,
    priceId,
    billingPeriod: billing,
    monthlyCents,
  };
}

export async function recordSeatOpened({ ceo, employeeId, roleKey, roleName, monthlyCents, charge }) {
  const db = admin();
  await db.from('seat_billing_records').insert({
    ceo_id: ceo.id,
    org_id: ceo.org_id || null,
    employee_id: employeeId,
    role: roleName || roleKey,
    monthly_fee_cents: charge?.comped ? 0 : monthlyCents,
    billing_type: charge?.comped ? 'comped' : 'seat',
    active: true,
    started_at: new Date().toISOString(),
    stripe_subscription_item_id: charge?.subscriptionItemId || null,
  });

  if (charge?.subscriptionItemId) {
    await db.from('employees')
      .update({ stripe_subscription_item_id: charge.subscriptionItemId })
      .eq('id', employeeId);
  }
}

/**
 * Stop charging for a seat. Called when an employee is dismissed.
 *
 * A failure here must never block the dismissal: the customer asked for the
 * employee to be gone, and leaving them in place because Stripe was unreachable
 * would be the wrong way round. It is recorded loudly instead.
 */
export async function stopChargingForSeat({ employeeId }) {
  const db = admin();
  const { data: employee } = await db.from('employees')
    .select('id, ceo_id, stripe_subscription_item_id')
    .eq('id', employeeId)
    .maybeSingle();

  const itemId = employee?.stripe_subscription_item_id;

  await db.from('seat_billing_records')
    .update({ active: false, ended_at: new Date().toISOString() })
    .eq('employee_id', employeeId)
    .eq('active', true);

  if (!itemId) return { released: false, reason: 'no billed seat' };

  try {
    await stripe().subscriptionItems.del(itemId, { proration_behavior: 'create_prorations' });
    await db.from('employees').update({ stripe_subscription_item_id: null }).eq('id', employeeId);
    return { released: true, subscriptionItemId: itemId };
  } catch (error) {
    console.error('[billing.seats] could not remove subscription item', itemId, error?.message);
    await db.from('staffai_events').insert({
      event_type: 'billing.seat_release_failed',
      source: 'billing.seats',
      status: 'recorded',
      data: { employeeId, subscriptionItemId: itemId, error: error?.message || String(error) },
    }).then(() => null, () => null);
    return { released: false, reason: error?.message || 'stripe error', subscriptionItemId: itemId };
  }
}
