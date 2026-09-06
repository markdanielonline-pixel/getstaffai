import { NextResponse } from 'next/server';
import { resyncWorkforce } from '@/lib/workforce-sync';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * Push the current role briefs to an organization's existing employees.
 *
 * Needed because an employee is given its brief at install time and nothing
 * ever updated one afterwards, so improving a playbook only reached people
 * hired later. It is idempotent: Provision reinstalls an agent only when its
 * brief or its delegation permission actually changed.
 */
function authorized(req) {
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  const supplied = header.slice('Bearer '.length);
  return [process.env.CRON_SECRET, process.env.WORKER_SECRET_KEY]
    .filter(Boolean)
    .some(secret => secret === supplied);
}

export async function POST(req) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  let body = {};
  try { body = await req.json(); } catch { /* orgId can also come from the query */ }
  const orgId = body.orgId || new URL(req.url).searchParams.get('orgId');
  if (!orgId) return NextResponse.json({ error: 'orgId is required' }, { status: 400 });

  // A whole-workforce resync is dangerous and is refused without an explicit
  // acknowledgement. Running one against a live tenant reinstalls every agent
  // on a single runtime; doing it twice in quick succession left eight agents
  // in error and the runtime config in a shape the installer could no longer
  // add agents to. One employee at a time is the safe form, and the only one
  // that should be used until that failure is understood.
  if (!body.employeeId && body.confirmWholeWorkforce !== true) {
    return NextResponse.json({
      error: 'Refusing to resync a whole workforce. Pass employeeId to sync one employee, or confirmWholeWorkforce: true if you accept that every agent on this tenant reinstalls.',
    }, { status: 400 });
  }

  try {
    const result = await resyncWorkforce(orgId, { employeeId: body.employeeId || null });
    return NextResponse.json(result, { status: result.failed ? 207 : 200 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
