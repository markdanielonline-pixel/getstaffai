import { createClient } from '@supabase/supabase-js';
import { checked } from './provisioning-operation';

// Staff AI operates as its own customer. The founder must reach the product
// through exactly the same onboarding, organization, provisioning, workforce and
// employee-execution paths a paying customer uses, without buying the product
// from himself and without a fabricated Stripe subscription existing anywhere.
//
// Entitlement therefore has two legitimate sources, and only two:
//   - a real Stripe subscription, which the webhook records as status 'active'
//   - an explicit internal founder grant on the CEO record
// Everything that used to test `ceo.status === 'provisional'` directly should
// ask this instead, so the two sources can never drift apart.
export function isEntitled(ceo) {
  if (!ceo) return false;
  return ceo.is_founder === true || ceo.status === 'active';
}

// What the customer is told about where their entitlement comes from. Founder
// access is labelled honestly rather than being disguised as a purchased plan.
export function entitlementLabel(ceo, subscriptionLevel) {
  if (!ceo) return 'No active plan';
  if (ceo.is_founder) return 'Founder access';
  if (!subscriptionLevel) return 'No active plan';
  return `${subscriptionLevel[0].toUpperCase()}${subscriptionLevel.slice(1)} plan`;
}

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

// The organizations a CEO may act as. ceos.org_id remains the *active* one, so
// every org-scoped code path in the product keeps working untouched; this is
// only the set they are allowed to switch between.
export async function listOrganizationsForCeo(ceoId) {
  const db = admin();
  const memberships = checked(await db.from('organization_members')
    .select('org_id, role, created_at').eq('ceo_id', ceoId).order('created_at'), 'Read organization memberships');
  if (!memberships.length) return [];
  const organizations = checked(await db.from('organizations')
    .select('id, name, industry, workforce_status, model_policy')
    .in('id', memberships.map(m => m.org_id)), 'Read member organizations');
  const byId = new Map(organizations.map(o => [o.id, o]));
  return memberships
    .map(m => ({ ...byId.get(m.org_id), role: m.role }))
    .filter(o => o.id);
}

// Membership is the authority for switching. A CEO can only ever activate an
// organization they are recorded as a member of, so a guessed or tampered id
// cannot move them into another tenant.
export async function setActiveOrganization(ceoId, orgId) {
  const db = admin();
  const membership = checked(await db.from('organization_members')
    .select('org_id').eq('ceo_id', ceoId).eq('org_id', orgId).maybeSingle(), 'Verify organization membership');
  if (!membership) throw new Error('You do not have access to that organization');
  checked(await db.from('ceos').update({ org_id: orgId }).eq('id', ceoId), 'Switch active organization');
  return orgId;
}

export async function recordMembership(orgId, ceoId, role = 'owner') {
  const db = admin();
  checked(await db.from('organization_members')
    .upsert({ org_id: orgId, ceo_id: ceoId, role }, { onConflict: 'org_id,ceo_id', ignoreDuplicates: true }),
    'Record organization membership');
}
