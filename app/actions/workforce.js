'use server';

import { getCEO } from './auth';
import { provisionInitialWorkforce, inspectInitialWorkforce } from '@/lib/workforce';
import { hireAdditionalEmployee, dismissEmployee } from '@/lib/hiring';
import { revalidatePath } from 'next/cache';

export async function retryInitialWorkforce() {
  const ceo = await getCEO();
  if (!ceo?.org_id) throw new Error('An authenticated organization is required');
  // Claiming the provisioning operation resets the organization to
  // 'provisioning', so re-running one that already succeeded makes the
  // dashboard non-ready, which makes the automatic resume fire again: an open
  // dashboard re-provisioned a healthy tenant every 30 seconds, flapping its
  // employees between active and training. A resume must first establish that
  // there is actually something to resume.
  const current = await inspectInitialWorkforce(ceo.org_id);
  if (current.ready) {
    revalidatePath('/portal/dashboard');
    return { ready: true, resumed: false };
  }
  try {
    await provisionInitialWorkforce(ceo.id, ceo.intelligence_level || 'free');
  } catch {
    // Durable operation stores the failure; the UI stays non-ready and offers retry.
  }
  revalidatePath('/portal/dashboard');
  return { ready: false, resumed: true };
}


export async function hireEmployeeAction(formData) {
  const ceo = await getCEO();
  if (!ceo?.org_id) return { error: 'An authenticated organization is required' };
  // The same entitlement gate Conversations uses: a provisional CEO has not
  // completed checkout, so there is nothing to bill an extra seat against.
  if (ceo.status === 'provisional') return { error: 'Complete your Company Office subscription before hiring.' };
  try {
    const employee = await hireAdditionalEmployee({
      ceo,
      roleKey: String(formData.get('roleKey') || ''),
      idempotencyKey: String(formData.get('idempotencyKey') || ''),
    });
    revalidatePath('/portal/dashboard/agents');
    return { ok: true, employeeId: employee.id, name: employee.name };
  } catch (error) {
    console.error('[workforce.hire]', error?.message || error);
    return { error: error?.message || 'Hiring failed' };
  }
}

export async function dismissEmployeeAction(formData) {
  const ceo = await getCEO();
  if (!ceo?.org_id) return { error: 'An authenticated organization is required' };
  try {
    await dismissEmployee({
      ceo,
      employeeId: String(formData.get('employeeId') || ''),
      reason: formData.get('reason') ? String(formData.get('reason')) : null,
    });
    revalidatePath('/portal/dashboard/agents');
    return { ok: true };
  } catch (error) {
    console.error('[workforce.dismiss]', error?.message || error);
    return { error: error?.message || 'Dismissal failed' };
  }
}
