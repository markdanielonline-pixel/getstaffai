import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * How a Staff AI employee is allowed to reach the outside world.
 *
 * Until now an employee had a shell, a browser and nothing else. lib/tools
 * defined send_email and send_sms, but the only module that registered them
 * (lib/engine.js) was imported by no live path, so four advertised roles could
 * not do the thing they were sold for no matter which credentials were set.
 *
 * The agent runs inside the tenant's container with a shell and internet
 * access, so the bridge is an HTTP endpoint it calls with curl. Its credential
 * is an HMAC of its own employee id under a server secret: nothing to store,
 * nothing to revoke individually, and rotating AGENT_TOOLS_SECRET invalidates
 * every token at once. A token identifies exactly one employee in exactly one
 * organization, so a tenant can never act as another tenant.
 */
export function agentToken(employeeId) {
  const secret = process.env.AGENT_TOOLS_SECRET;
  if (!secret) throw new Error('AGENT_TOOLS_SECRET is not configured');
  const signature = createHmac('sha256', secret).update(String(employeeId)).digest('hex');
  return `${employeeId}.${signature}`;
}

function verify(token) {
  const secret = process.env.AGENT_TOOLS_SECRET;
  if (!secret || typeof token !== 'string') return null;
  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;
  const employeeId = token.slice(0, separator);
  const supplied = token.slice(separator + 1);
  const expected = createHmac('sha256', secret).update(employeeId).digest('hex');
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return employeeId;
}

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

/**
 * Resolves the caller to a live employee. A dismissed employee keeps its token
 * shape but loses its access here, which is the only place that matters.
 */
export async function authenticateAgent(request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return { error: 'Missing bearer token' };

  const employeeId = verify(header.slice('Bearer '.length));
  if (!employeeId) return { error: 'Invalid token' };

  const db = admin();
  const { data: employee, error } = await db.from('employees')
    .select('id, org_id, ceo_id, name, role, status')
    .eq('id', employeeId)
    .maybeSingle();
  if (error) return { error: `Could not resolve employee: ${error.message}` };
  if (!employee) return { error: 'Unknown employee' };
  if (employee.status === 'alumni') return { error: 'This employee has been dismissed' };

  const { data: organization } = await db.from('organizations')
    .select('id, name').eq('id', employee.org_id).maybeSingle();

  return { employee, organization, db };
}

/**
 * Every call is recorded, successful or not. An employee that claims to have
 * posted something must be checkable against this.
 */
export async function recordToolCall(db, { employee, tool, input, result, ok }) {
  await db.from('staffai_events').insert({
    org_id: employee.org_id,
    event_type: `agent.tool.${tool}`,
    source: 'agent-tools',
    status: ok ? 'ok' : 'failed',
    data: { employee_id: employee.id, employee_role: employee.role, input, result },
  });
}
