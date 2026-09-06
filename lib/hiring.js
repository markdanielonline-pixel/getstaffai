import { createClient } from '@supabase/supabase-js';
import { BILLING_CATALOG, COMPANY_OFFICE_KEY } from './billing/catalog';
import { instantiateEmployee } from './factory';
import { decommissionAgentRuntime } from './provision';
import { checked } from './provisioning-operation';
import { buildRolePrompt, isRoleReadyForSale, roleLaunchStatus } from './roles/playbooks';
import { agentToken } from './agent-tools/auth';

// The Company Office plan ships the EA and GM; everything else in the catalog
// that is a single role (not a bundle) can be hired on top of it. Bundles are
// excluded here because hiring one means hiring several employees, which is a
// different transaction from adding a seat.
export const HIREABLE_ROLES = Object.entries(BILLING_CATALOG)
  .filter(([key, product]) => key !== COMPANY_OFFICE_KEY && !product.includes)
  .map(([key, product]) => ({ key, name: product.name, monthly: product.monthly, annual: product.annual, ...roleLaunchStatus(key) }));

export function getHireableRole(key) {
  return HIREABLE_ROLES.find(role => role.key === key) || null;
}

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function hireAdditionalEmployee({ ceo, roleKey, idempotencyKey }) {
  const role = getHireableRole(roleKey);
  if (!role) throw new Error('That role is not available to hire');
  // A role whose advertised outcome needs a system the runtime cannot reach
  // is not sold. Selling it would take the money and deliver a chat window.
  if (!isRoleReadyForSale(roleKey)) throw new Error(`${role.name} is coming soon and cannot be hired yet`);
  if (!ceo.org_id) throw new Error('An organization is required before hiring');
  if (!idempotencyKey) throw new Error('An idempotency key is required');

  const db = admin();
  const organization = checked(await db.from('organizations').select('id, name, provision_team_id, provision_connection_status')
    .eq('id', ceo.org_id).single(), 'Load organization for hiring');
  if (!organization.provision_team_id) {
    throw new Error('Your workforce runtime is not set up yet. Finish initial setup first.');
  }

  // The same supplied-template path the initial EA/GM use: the role_templates
  // table currently holds duplicated per-org seed rows for two roles only, so
  // resolving a template by id there would tie hiring to that seed data.
  const employee = await instantiateEmployee({
    orgId: ceo.org_id,
    idempotencyKey: `additional:${roleKey}:${idempotencyKey}`,
    persona: { ceo_id: ceo.id, seat_fee_cents: role.monthly, billing_type: 'seat' },
    roleTemplate: {
      title_default: role.name,
      required_tools: [],
      default_kpis: [],
      // The brief is the only thing that distinguishes one role from another:
      // capabilities sent to Provision are recorded but never provision tools,
      // so a specialist with two generic lines was a generic assistant wearing
      // a job title.
      base_prompt_template: buildRolePrompt(roleKey, {
        companyName: ceo.company_name || organization.name,
        businessDescription: ceo.business_description,
      }),
      // Filled in by instantiateEmployee once the employee row exists, because
      // the credential is derived from the employee id.
      withToolToken: true,
      roleKey,
    },
    onboardingAnswers: { company_name: ceo.company_name },
  });

  // An employee nobody can talk to is not an employee. The Executive Assistant
  // got a conversation from the initial workforce run; every other hire needs
  // one too, or the customer pays for a specialist they cannot reach.
  checked(await db.from('conversations').upsert({
    ceo_id: ceo.id, employee_id: employee.id, channel: 'app', is_private: false,
  }, { onConflict: 'ceo_id,employee_id,channel', ignoreDuplicates: true }), 'Open conversation with new employee');

  return employee;
}

export async function dismissEmployee({ ceo, employeeId, reason }) {
  if (!ceo.org_id) throw new Error('An organization is required');
  const db = admin();
  const employee = checked(await db.from('employees').select('id, org_id, name, status, employee_type')
    .eq('id', employeeId).eq('org_id', ceo.org_id).single(), 'Load employee for dismissal');
  if (employee.status === 'alumni') return employee;

  // The EA and GM are what the Company Office subscription pays for. Removing
  // one would leave a paid-for workforce that cannot be rebuilt from the UI,
  // so the initial two are not dismissable.
  if (['ea', 'gm'].includes(employee.employee_type)) {
    throw new Error(`${employee.name} is part of your Company Office and cannot be dismissed`);
  }

  // Runtime teardown first: marking someone alumni while their agent is still
  // installed and answering would be the dishonest ordering.
  await decommissionAgentRuntime(employeeId, ceo.org_id);

  return checked(await db.from('employees').update({
    status: 'alumni',
    departed_at: new Date().toISOString(),
    departure_reason: reason?.trim() || 'Dismissed by the CEO',
  }).eq('id', employeeId).eq('org_id', ceo.org_id).select().single(), 'Record employee departure');
}
