import { createClient } from '@supabase/supabase-js';
import { BILLING_CATALOG, COMPANY_OFFICE_KEY } from './billing/catalog';
import { buildRolePrompt } from './roles/playbooks';
import { provisionAgentRuntime } from './provision';

/**
 * Push the current brief to employees that already exist.
 *
 * Until now there was no way to. An employee kept whatever prompt it was born
 * with, so improving a role playbook only ever affected people hired after the
 * change, and an existing Executive Assistant could not be told it may now
 * delegate. That made the role definitions write-once, which is not a thing
 * anyone would choose.
 *
 * Provision reconciles the brief and the delegation flag on upsert and
 * redeploys the agent when either moves, so this is idempotent: an employee
 * already carrying the current brief is left alone rather than reinstalled.
 */

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

// Employees carry a role name; playbooks are keyed by catalog key.
const KEY_BY_NAME = new Map(Object.entries(BILLING_CATALOG).map(([key, product]) => [product.name, key]));

export function playbookKeyFor(employee) {
  if (employee.employee_type === 'ea') return 'executive_assistant';
  if (employee.employee_type === 'gm') return 'general_manager';
  return KEY_BY_NAME.get(employee.role) || KEY_BY_NAME.get(employee.title) || COMPANY_OFFICE_KEY;
}

export async function resyncWorkforce(orgId, { employeeId = null } = {}) {
  const db = admin();

  const organization = (await db.from('organizations')
    .select('id, name, provision_team_id, provision_connection_status').eq('id', orgId).single()).data;
  if (!organization?.provision_team_id) return { synced: 0, skipped: 0, reason: 'no runtime for this organization' };

  const ceo = (await db.from('ceos')
    .select('id, company_name, business_description').eq('org_id', orgId).maybeSingle()).data;

  let query = db.from('employees')
    .select('id, name, role, title, employee_type, status')
    .eq('org_id', orgId).neq('status', 'alumni');
  if (employeeId) query = query.eq('id', employeeId);
  const { data: employees, error } = await query;
  if (error) throw new Error(`Could not read employees: ${error.message}`);

  const results = [];
  for (const employee of employees || []) {
    const roleKey = playbookKeyFor(employee);
    try {
      await provisionAgentRuntime(orgId, employee.id, {
        title_default: employee.title || employee.role,
        required_tools: [],
        default_kpis: [],
        base_prompt_template: buildRolePrompt(roleKey, {
          employeeName: employee.name,
          companyName: ceo?.company_name || organization.name,
          businessDescription: ceo?.business_description,
        }),
        withToolToken: true,
        roleKey,
      });
      results.push({ employee: employee.name, role: employee.role, roleKey, ok: true });
    } catch (syncError) {
      // One employee failing must not stop the rest. A workforce half-updated is
      // worse than one that reports exactly which member did not take.
      results.push({ employee: employee.name, role: employee.role, roleKey, ok: false, error: syncError.message });
    }
  }

  return {
    synced: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    results,
  };
}
