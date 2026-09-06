import { NextResponse } from 'next/server';
import { runHealthSweep, recordAndAlert } from '@/lib/monitor';
import { handleIncident } from '@/lib/reliability/engineer';

// The sweep hits several live endpoints, one of which is a real model call.
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. The worker secret is
// accepted too so the sweep can be triggered from the box or by hand during an
// incident without waiting for the schedule.
function authorized(req) {
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  const supplied = header.slice('Bearer '.length);
  const accepted = [process.env.CRON_SECRET, process.env.WORKER_SECRET_KEY].filter(Boolean);
  return accepted.some(secret => secret === supplied);
}

async function handle(req) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const sweep = await runHealthSweep();
  // Alerting must never be able to suppress the result. If Resend is the thing
  // that is broken, the sweep still has to report what it found.
  const alert = await recordAndAlert(sweep).catch(error => ({
    alerted: false,
    detail: error?.message || String(error),
  }));

  // A failing sweep goes to the reliability engineer, which diagnoses it and
  // may apply one of a small set of reversible, organization-scoped fixes. It
  // runs only on failure, so a healthy system costs nothing, and it is skipped
  // entirely unless RELIABILITY_ENGINEER is on - an autonomous remediator is
  // something you switch on deliberately, not something that appears with a
  // deploy.
  // The engineer is not awaited into the response. The sweep already spends
  // real time on a live model call and a Provision round trip per customer,
  // and adding a diagnosis on top pushed the whole request past its execution
  // budget, so a failing sweep started returning a platform error instead of
  // the failure it had just detected. Detection must never be taken down by
  // the thing that reacts to it.
  let incident = null;
  if (!sweep.ok && process.env.RELIABILITY_ENGINEER === 'on') {
    const investigation = handleIncident(sweep, {
      dryRun: process.env.RELIABILITY_ENGINEER_DRY_RUN === 'on',
    }).catch(error => ({ error: error?.message || String(error) }));

    // Give it a bounded slice of the remaining budget rather than the whole of
    // it. Whatever it finishes is reported here; whatever it does not is still
    // written to staffai_events as a reliability.incident when it lands.
    incident = await Promise.race([
      investigation,
      new Promise(resolve => setTimeout(() => resolve({ started: true, note: 'still running; read staffai_events for the outcome' }), 25_000)),
    ]);
  }

  // 503 so an external uptime check treats a failing sweep as an outage without
  // needing to parse the body.
  return NextResponse.json({ ...sweep, alert, incident }, { status: sweep.ok ? 200 : 503 });
}

export async function GET(req) {
  return handle(req);
}

export async function POST(req) {
  return handle(req);
}
