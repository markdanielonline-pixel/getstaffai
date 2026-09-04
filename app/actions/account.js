'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';

function cleanText(value, fallback = '') {
  return String(value || fallback).trim();
}

export async function updatePassword(formData) {
  const password = cleanText(formData.get('password'));
  const confirmPassword = cleanText(formData.get('confirmPassword'));

  if (password.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' };
  if (password !== confirmPassword) return { ok: false, message: 'Passwords do not match.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Please sign in again before changing your password.' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: error.message || 'Password update failed.' };

  return { ok: true, message: 'Password updated.' };
}

export async function updateEmail(formData) {
  const email = cleanText(formData.get('email')).toLowerCase();

  if (!email || !email.includes('@')) return { ok: false, message: 'Enter a valid email address.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Please sign in again before changing your email.' };

  // Fallback must be the application host, not the marketing site (see
  // app/auth/callback/route.js) — the confirmation link targets /auth/callback.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.getstaffai.com';
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${siteUrl}/auth/callback?next=/portal/dashboard/settings` }
  );
  if (error) return { ok: false, message: error.message || 'Email update failed.' };

  const admin = await createAdminClient();
  await admin.from('support_tickets').insert({
    ceo_id: user.id,
    name: user.user_metadata?.name || user.email || 'StaffAI customer',
    email: user.email || email,
    category: 'account_access',
    priority: 'normal',
    subject: 'Account email change requested',
    message: `The account owner requested a change from ${user.email || 'unknown'} to ${email}. Supabase confirmation is required before the change completes.`,
    source: 'account_settings',
    metadata: { requested_email: email },
  });

  revalidatePath('/portal/dashboard/settings');
  return { ok: true, message: 'Confirmation links have been sent. The new email becomes active after verification.' };
}

export async function updateProfile(formData) {
  const name = cleanText(formData.get('name'));
  const companyName = cleanText(formData.get('companyName'));
  const preferredChannel = cleanText(formData.get('preferredChannel'), 'app');

  if (!name) return { ok: false, message: 'Name is required.' };
  if (!companyName) return { ok: false, message: 'Company name is required.' };
  if (!['app', 'email'].includes(preferredChannel)) return { ok: false, message: 'Invalid notification channel.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Please sign in again before updating your profile.' };

  const { error } = await supabase
    .from('ceos')
    .update({ name, company_name: companyName, preferred_channel: preferredChannel })
    .eq('id', user.id);
  if (error) return { ok: false, message: error.message || 'Profile update failed.' };

  revalidatePath('/portal/dashboard/settings');
  return { ok: true, message: 'Profile updated.' };
}
