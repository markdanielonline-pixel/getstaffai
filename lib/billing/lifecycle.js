import { createClient } from '@supabase/supabase-js';

/**
 * The payment lifecycle, as the founder specified it.
 *
 *   three days before payment is due   a reminder
 *   on the day payment is due          a reminder
 *   the day after a failed payment     a notice that it did not go through
 *   three days after that              access is interrupted, and they are told
 *   monthly after that                 a way back, for months, not days
 *   when they cancel                   confirmation, and their end date
 *
 * The rule underneath all of it: nobody loses their workforce without warning,
 * and nobody who wants to come back has to work out how.
 *
 * Every notice is written down before it is considered sent, keyed by customer,
 * kind and billing period. That makes this safe to run as often as you like: a
 * notice already sent for this period is never sent again, and a run that was
 * missed catches up instead of skipping. Sending is idempotent by construction
 * rather than by timing.
 */

const DAY = 24 * 60 * 60 * 1000;

// How long the workforce keeps running after a payment fails.
export const GRACE_DAYS = 3;

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

const BILLING_URL = 'https://app.getstaffai.com/portal/dashboard/settings';

function money(cents) {
  return `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function shortDate(value) {
  if (!value) return 'shortly';
  return new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * The words. Written to be read by someone who is busy, or embarrassed, or
 * both. No shaming, no jargon, and never a threat where a fact will do.
 */
export function noticeCopy(kind, { name, company, amountCents, dueDate, endDate, staffCount }) {
  const first = (name || '').split(' ')[0] || 'there';
  const amount = money(amountCents);

  switch (kind) {
    case 'upcoming_3day':
      return {
        subject: `Your Staff AI payment is due ${shortDate(dueDate)}`,
        lines: [
          `Hi ${first},`,
          '',
          `Your next Staff AI payment of ${amount} is due on ${shortDate(dueDate)}.`,
          'Nothing for you to do if your card is current. This is just so it is not a surprise.',
          '',
          `To check or change your payment method: ${BILLING_URL}`,
          '',
          'Staff AI',
        ],
      };

    case 'due_today':
      return {
        subject: `Your Staff AI payment goes through today`,
        lines: [
          `Hi ${first},`,
          '',
          `Your Staff AI payment of ${amount} is due today. It will be taken automatically.`,
          `${company || 'Your company'} carries on as normal.`,
          '',
          `Billing details: ${BILLING_URL}`,
          '',
          'Staff AI',
        ],
      };

    case 'overdue_day1':
      return {
        subject: 'That payment did not go through',
        lines: [
          `Hi ${first},`,
          '',
          `Your Staff AI payment of ${amount} did not go through. It happens, usually an expired`,
          'card or a bank declining something unfamiliar.',
          '',
          `Your team is still working. ${staffCount ? `All ${staffCount} of them.` : ''}`,
          `Nothing changes for ${GRACE_DAYS} days.`,
          '',
          `You can fix it in a minute here: ${BILLING_URL}`,
          '',
          'Staff AI',
        ],
      };

    case 'interruption_warning':
      return {
        subject: 'Your team pauses tomorrow unless payment goes through',
        lines: [
          `Hi ${first},`,
          '',
          `We still have not been able to take the ${amount} payment for ${company || 'your company'}.`,
          '',
          'Tomorrow your employees stop working. They are not deleted and nothing is lost.',
          'They pause, and they start again the moment the payment goes through.',
          '',
          `Sort it here and they are back within minutes: ${BILLING_URL}`,
          '',
          'If something else is going on, reply to this email and tell us. We would rather',
          'hear from you than lose you.',
          '',
          'Staff AI',
        ],
      };

    case 'suspended':
      return {
        subject: 'Your Staff AI team is paused',
        lines: [
          `Hi ${first},`,
          '',
          `${company || 'Your company'} is paused because the ${amount} payment has not gone through.`,
          '',
          'Everything is kept: your employees, their briefs, their history and their work.',
          'Nothing has been deleted.',
          '',
          `Pay and they pick up where they left off: ${BILLING_URL}`,
          '',
          'Staff AI',
        ],
      };

    case 'winback':
      return {
        subject: `${company || 'Your team'} is still here when you want it`,
        lines: [
          `Hi ${first},`,
          '',
          `Your Staff AI workforce is still saved and still yours. Whenever you are ready,`,
          'one payment brings the whole team back exactly as you left it.',
          '',
          `${BILLING_URL}`,
          '',
          'If Staff AI was not right for you, tell us why. A short reply genuinely helps us',
          'build the thing you needed.',
          '',
          'Staff AI',
        ],
      };

    case 'cancellation_confirmed':
      return {
        subject: 'Your Staff AI cancellation is confirmed',
        lines: [
          `Hi ${first},`,
          '',
          'Your Staff AI subscription is cancelled, as you asked. You will not be charged again.',
          '',
          `Your team keeps working until ${shortDate(endDate)}, the end of the period you have`,
          'already paid for. Nothing stops before then.',
          '',
          'If you change your mind before that date, restarting takes one payment and your',
          `workforce comes back as it was: ${BILLING_URL}`,
          '',
          'Thank you for trying us.',
          '',
          'Staff AI',
        ],
      };

    default:
      return null;
  }
}

async function alreadySent(db, ceoId, kind, periodEnd) {
  const { data } = await db.from('billing_notices')
    .select('id')
    .eq('ceo_id', ceoId)
    .eq('kind', kind)
    .eq('period_end', periodEnd ?? null)
    .maybeSingle();
  return Boolean(data);
}

async function deliver(db, { ceo, kind, periodEnd, copy, detail = {} }) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'no email credential' };
  if (!ceo.email) return { sent: false, reason: 'no address' };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Staff AI <ai@getstaffai.com>',
      to: ceo.email,
      subject: copy.subject,
      text: copy.lines.join('\n'),
    }),
  }).catch(error => ({ ok: false, _error: error?.message }));

  if (!response.ok) {
    return { sent: false, reason: response._error || `HTTP ${response.status}` };
  }

  // Written only after the provider accepted it, so a failed send is retried
  // on the next run rather than being recorded as delivered.
  await db.from('billing_notices').insert({
    ceo_id: ceo.id,
    org_id: ceo.org_id || null,
    stripe_subscription_id: detail.subscriptionId || null,
    kind,
    period_end: periodEnd ?? null,
    sent_to: ceo.email,
    detail,
  });

  return { sent: true };
}

/**
 * Work out what each subscriber is owed today and send it.
 *
 * Deliberately does not suspend anything itself. Deciding what a customer may
 * still do is a separate concern from telling them about it, and mixing the two
 * is how a customer ends up locked out by an email job.
 */
export async function runBillingLifecycle({ now = new Date() } = {}) {
  const db = admin();
  const results = { checked: 0, sent: [], skipped: 0 };

  const { data: subscriptions, error } = await db.from('subscriptions')
    .select('ceo_id, stripe_subscription_id, status, access_fee_cents, current_period_end, past_due_since, cancel_at_period_end, cancelled_at')
    .in('status', ['active', 'trialing', 'past_due', 'cancelled']);
  if (error) return { ...results, error: error.message };

  for (const subscription of subscriptions || []) {
    results.checked += 1;

    const { data: ceo } = await db.from('ceos')
      .select('id, name, email, org_id, company_name')
      .eq('id', subscription.ceo_id)
      .maybeSingle();
    if (!ceo?.email) { results.skipped += 1; continue; }

    const { count: staffCount } = await db.from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', ceo.org_id)
      .neq('status', 'alumni');

    const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    const context = {
      name: ceo.name,
      company: ceo.company_name,
      amountCents: subscription.access_fee_cents,
      dueDate: periodEnd,
      endDate: periodEnd,
      staffCount: staffCount || 0,
    };
    const periodKey = subscription.current_period_end || null;
    const detail = { subscriptionId: subscription.stripe_subscription_id };

    const send = async (kind, key = periodKey) => {
      if (await alreadySent(db, ceo.id, kind, key)) return;
      const copy = noticeCopy(kind, context);
      if (!copy) return;
      const outcome = await deliver(db, { ceo, kind, periodEnd: key, copy, detail });
      if (outcome.sent) results.sent.push({ ceo: ceo.email, kind });
    };

    // Cancelled by the customer: confirm once, and say when their team stops.
    if (subscription.status === 'cancelled' || subscription.cancel_at_period_end) {
      await send('cancellation_confirmed');
      continue;
    }

    // Behind on payment.
    if (subscription.status === 'past_due') {
      const since = subscription.past_due_since ? new Date(subscription.past_due_since) : periodEnd;
      if (!since) continue;
      const daysBehind = Math.floor((now - since) / DAY);

      if (daysBehind >= 0) await send('overdue_day1');
      if (daysBehind >= GRACE_DAYS - 1) await send('interruption_warning');
      if (daysBehind >= GRACE_DAYS) await send('suspended');

      // Then keep a door open, once a month, for months. Keyed by the month so
      // each one is its own notice rather than a duplicate of the last.
      if (daysBehind >= GRACE_DAYS + 30) {
        const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        await send('winback', month);
      }
      continue;
    }

    // Paying and current: the two reminders before money moves.
    if (periodEnd) {
      const daysUntil = Math.ceil((periodEnd - now) / DAY);
      if (daysUntil === 3) await send('upcoming_3day');
      if (daysUntil <= 0 && daysUntil > -1) await send('due_today');
      else if (daysUntil === 0) await send('due_today');
    }
  }

  return results;
}
