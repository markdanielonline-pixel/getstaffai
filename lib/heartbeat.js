import { createClient } from '@supabase/supabase-js';
import { runHealthSweep, recordAndAlert } from './monitor';
import { sendPendingAcknowledgements } from './reports';
/**
 * NOT WIRED IN. Nothing imports this module.
 *
 * It was written to carry the sweep on ordinary traffic, but no route ever
 * called `heartbeat()`, so it has never run in production. The thing that
 * actually runs every few minutes is `/api/monitor`, and the delayed
 * acknowledgements now ride that instead. This file is kept only so the
 * approach is not reinvented from scratch; if you wire it up, remove the
 * duplicate call from the monitor route first.
 */

/**
 * A sweep that rides on ordinary traffic.
 *
 * The five-minute cadence was a cron on the VPS calling the monitor endpoint.
 * That broke the moment the same address ran a headless browser suite against
 * production: Vercel's Security Checkpoint flagged the address and started
 * answering 403 to everything from it, including the monitor. The account is on
 * Hobby, where neither an IP bypass rule nor an automation bypass secret is
 * available, so the address cannot simply be allowlisted.
 *
 * This runs the sweep from inside the application instead, triggered by a real
 * request, at most once every interval. It cannot be blocked by an edge rule
 * because it never crosses the edge. It is not a replacement for an external
 * checker - it cannot tell you the site is down, because if the site were down
 * nothing would trigger it - so it complements the daily Vercel cron rather
 * than standing alone.
 */
const INTERVAL_MS = Number(process.env.HEARTBEAT_INTERVAL_MS || 5 * 60 * 1000);

// Serverless instances are short-lived and plural, so the interval is enforced
// in the database rather than in memory. An in-process timestamp would let each
// cold start run its own sweep.
let inFlight = false;

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function heartbeat() {
  if (inFlight) return { ran: false, reason: 'already running in this instance' };
  if (process.env.HEARTBEAT === 'off') return { ran: false, reason: 'disabled' };

  const db = admin();
  const { data: last } = await db.from('staffai_events')
    .select('created_at')
    .eq('event_type', 'monitor.sweep')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (last && Date.now() - new Date(last.created_at).getTime() < INTERVAL_MS) {
    return { ran: false, reason: 'swept recently' };
  }

  inFlight = true;
  try {
    // Thank-yous ride the same traffic the sweep does, so a delayed
    // acknowledgement needs no scheduler. A failure here must never stop the
    // sweep: the person waiting on a thank-you can wait, an outage cannot.
    await sendPendingAcknowledgements().catch(() => null);

    const sweep = await runHealthSweep();
    await recordAndAlert(sweep).catch(() => { /* the sweep row is the record */ });
    return { ran: true, ok: sweep.ok, failing: sweep.failing };
  } catch (error) {
    return { ran: false, reason: error?.message || String(error) };
  } finally {
    inFlight = false;
  }
}
