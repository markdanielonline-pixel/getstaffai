import { NextResponse } from 'next/server';
import { runHealthSweep, recordAndAlert } from '@/lib/monitor';

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

  // 503 so an external uptime check treats a failing sweep as an outage without
  // needing to parse the body.
  return NextResponse.json({ ...sweep, alert }, { status: sweep.ok ? 200 : 503 });
}

export async function GET(req) {
  return handle(req);
}

export async function POST(req) {
  return handle(req);
}
