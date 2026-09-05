'use server';

import { getCEO } from './auth';
import { provisionInitialWorkforce } from '@/lib/workforce';
import { hireAdditionalEmployee, dismissEmployee } from '@/lib/hiring';
import { revalidatePath } from 'next/cache';

export async function retryInitialWorkforce() {
  const ceo = await getCEO();
  if (!ceo?.org_id) throw new Error('An authenticated organization is required');
  try {
    await provisionInitialWorkforce(ceo.id, ceo.intelligence_level || 'free');
  } catch {
    // Durable operation stores the failure; the UI stays non-ready and offers retry.
  }
  revalidatePath('/portal/dashboard');
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
