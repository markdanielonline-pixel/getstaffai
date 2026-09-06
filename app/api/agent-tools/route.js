import { NextResponse } from 'next/server';
import { authenticateAgent, recordToolCall } from '@/lib/agent-tools/auth';
import { TOOLS, canUse, toolsForRole } from '@/lib/agent-tools/registry';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * The only way a Staff AI employee reaches the outside world.
 *
 * The agent runs in the tenant's container with a shell, so it calls this with
 * curl using the token in its brief. Everything is scoped to the one employee
 * that token identifies, every call is recorded, and a role that is not
 * authorised for a tool is refused rather than quietly given a stub.
 */

// GET tells an employee what it can actually do, so its brief never has to
// promise a tool this deployment has not been given credentials for.
export async function GET(req) {
  const auth = await authenticateAgent(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });
  return NextResponse.json({
    employee: { name: auth.employee.name, role: auth.employee.role },
    organization: auth.organization?.name || null,
    tools: toolsForRole(auth.employee.role),
  });
}

export async function POST(req) {
  const auth = await authenticateAgent(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });
  const { employee, organization, db } = auth;

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const name = payload?.tool;
  const input = payload?.input || {};
  const permission = canUse(employee.role, name);
  if (!permission.ok) {
    await recordToolCall(db, { employee, tool: name || 'unknown', input, result: permission.reason, ok: false });
    return NextResponse.json({ error: permission.reason, tools: toolsForRole(employee.role) }, { status: 403 });
  }

  try {
    const result = await TOOLS[name].run(input, { employee, organization, db });
    await recordToolCall(db, { employee, tool: name, input, result, ok: true });
    return NextResponse.json({ ok: true, tool: name, result });
  } catch (error) {
    const detail = error?.message || String(error);
    await recordToolCall(db, { employee, tool: name, input, result: detail, ok: false });
    // The employee is told plainly that it failed, so it cannot report the
    // action as done. That is the whole point of returning this shape.
    return NextResponse.json({ ok: false, tool: name, error: detail }, { status: 502 });
  }
}
