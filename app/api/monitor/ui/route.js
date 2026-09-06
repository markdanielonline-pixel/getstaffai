import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * Where the synthetic customer reports in.
 *
 * Playwright cannot run on Vercel, so it runs on the VPS against production and
 * posts its result here. That keeps one alerting path for everything: an API
 * that returns 200 while the interface it serves is unusable is a failure the
 * backend sweep cannot see, and this is what sees it.
 */
function authorized(req) {
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  const supplied = header.slice('Bearer '.length);
  return [process.env.CRON_SECRET, process.env.WORKER_SECRET_KEY]
    .filter(Boolean)
    .some(secret => secret === supplied);
}

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(req) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  let report;
  try {
    report = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const passed = Number(report.passed || 0);
  const failed = Number(report.failed || 0);
  const skipped = Number(report.skipped || 0);
  const failures = Array.isArray(report.failures) ? report.failures.slice(0, 20) : [];
  // A check Vercel challenged did not run. That is worth recording and worth
  // fixing with a plan upgrade, but it is not the interface being broken, and
  // treating it as one would make this alert on every single run.
  const blocked = Number(report.blocked || 0);
  const ok = failed === 0;

  const db = admin();
  // Same change-detection rule as the backend sweep: alert when the picture
  // changes, not on every run, or the mail becomes noise and gets filtered.
  const signature = ok ? 'clean' : failures.map(f => f.title || f).sort().join(' | ');
  const { data: previous } = await db.from('staffai_events')
    .select('data').eq('event_type', 'monitor.ui')
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  const changed = (previous?.data?.signature ?? null) !== signature;

  const { error: recordError } = await db.from('staffai_events').insert({
    event_type: 'monitor.ui',
    source: 'playwright',
    status: ok ? 'ok' : 'failing',
    data: { signature, passed, failed, skipped, blocked, failures, blockedTests: report.blockedTests || [], duration_ms: report.durationMs ?? null },
  });
  if (recordError) console.error('[monitor.ui] could not record:', recordError.message);

  if (changed && process.env.RESEND_API_KEY && process.env.STAFFAI_SUPPORT_EMAIL) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'StaffAI <ai@getstaffai.com>',
        to: process.env.STAFFAI_SUPPORT_EMAIL,
        subject: ok ? 'Staff AI interface recovered' : `Staff AI interface: ${failed} failing`,
        text: [
          `passed ${passed}, failed ${failed}, skipped ${skipped}, blocked by bot challenge ${blocked}`,
          '',
          ...(failures.length ? failures.map(f => `- ${f.title || f}${f.error ? `\n    ${String(f.error).slice(0, 300)}` : ''}`) : ['no failures']),
        ].join('\n'),
      }),
    }).catch(() => { /* the event row is the durable record */ });
  }

  return NextResponse.json({ recorded: true, ok, changed }, { status: ok ? 200 : 503 });
}
