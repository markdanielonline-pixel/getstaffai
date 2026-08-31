'use server';

import { getCEO } from './auth';
import { provisionInitialWorkforce } from '@/lib/workforce';
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
