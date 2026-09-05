'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { getCEO } from './auth';
import { isEntitled, listOrganizationsForCeo, setActiveOrganization, recordMembership } from '@/lib/entitlement';
import { provisionInitialWorkforce } from '@/lib/workforce';

// Founder organizations route to a different model than customer organizations.
// The policy is stored on the organization row, so provisioning, reprovisioning
// and any later runtime replacement all resolve it the same way.
const FOUNDER_MODEL_POLICY = 'openai/gpt-5-nano';

export async function listMyOrganizations() {
  const ceo = await getCEO();
  if (!ceo) return [];
  return listOrganizationsForCeo(ceo.id);
}

export async function switchOrganizationAction(formData) {
  const ceo = await getCEO();
  if (!ceo) return { error: 'Not authenticated' };
  try {
    await setActiveOrganization(ceo.id, String(formData.get('orgId') || ''));
    revalidatePath('/portal/dashboard');
    revalidatePath('/portal/dashboard/agents');
    revalidatePath('/portal/dashboard/conversations');
    return { ok: true };
  } catch (error) {
    console.error('[organizations.switch]', error?.message || error);
    return { error: error?.message || 'Could not switch organization' };
  }
}

// A second, third, nth company for the founder. It deliberately reuses the same
// organization creation and workforce provisioning the paying customer path
// uses; the only thing it skips is the Stripe checkout, because the founder does
// not buy Staff AI from himself. No Stripe object is created or simulated.
export async function createOrganizationAction(formData) {
  const ceo = await getCEO();
  if (!ceo) return { error: 'Not authenticated' };
  if (!ceo.is_founder) return { error: 'Creating additional organizations is a founder capability.' };

  const name = String(formData.get('companyName') || '').trim();
  if (!name) return { error: 'Company name is required' };
  const industry = String(formData.get('industry') || '').trim() || null;
  const description = String(formData.get('businessDescription') || '').trim() || null;

  try {
    const admin = await createAdminClient();
    const { data: organization, error: orgError } = await admin.from('organizations').insert({
      name,
      industry,
      status: 'active',
      settings: {},
      model_policy: FOUNDER_MODEL_POLICY,
    }).select('id').single();
    if (orgError) throw new Error(`Unable to create organization: ${orgError.message}`);

    await recordMembership(organization.id, ceo.id, 'owner');

    // Switching before provisioning means the workforce is built against the
    // organization the founder is now operating as, exactly as a customer's is.
    const { error: ceoError } = await admin.from('ceos').update({
      org_id: organization.id,
      company_name: name,
      industry,
      business_description: description,
    }).eq('id', ceo.id);
    if (ceoError) throw new Error(`Unable to activate organization: ${ceoError.message}`);

    await admin.from('staffai_events').insert({
      org_id: organization.id,
      event_type: 'founder.organization.created',
      source: 'createOrganizationAction',
      status: 'recorded',
      data: { ceo_id: ceo.id, name, model_policy: FOUNDER_MODEL_POLICY },
    });

    revalidatePath('/portal/dashboard');
    return { ok: true, orgId: organization.id, name };
  } catch (error) {
    console.error('[organizations.create]', error?.message || error);
    return { error: error?.message || 'Could not create the organization' };
  }
}

// Provisioning is separated from creation so the UI can create quickly and then
// let the dashboard's existing resume loop drive the workforce to ready, which
// is the same behaviour a paying customer gets after checkout.
export async function provisionActiveOrganizationAction() {
  const ceo = await getCEO();
  if (!ceo?.org_id) return { error: 'An active organization is required' };
  if (!isEntitled(ceo)) return { error: 'This organization is not entitled yet.' };
  try {
    await provisionInitialWorkforce(ceo.id, ceo.intelligence_level || 'executive');
    revalidatePath('/portal/dashboard');
    return { ok: true };
  } catch (error) {
    console.error('[organizations.provision]', error?.message || error);
    return { error: error?.message || 'Provisioning could not start' };
  }
}
