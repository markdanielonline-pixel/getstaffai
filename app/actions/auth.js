'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function signUp(selectedBilling, formData) {
  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('name')
  const billing = selectedBilling === 'annual' ? 'annual' : 'monthly'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/portal/signup?error=${encodeURIComponent(error.message)}`)
  }

  // Supabase does not error when the address is already registered — it returns
  // an obfuscated user with an empty identities array, to avoid leaking which
  // emails exist. Without this check the UI promised "we sent a confirmation
  // link" for an existing account and no email was ever sent, stranding the
  // customer waiting for mail that cannot arrive. Send them to login instead.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    redirect(`/portal/login?notice=${encodeURIComponent('That email already has an account. Please sign in — or use "Forgot password?" if you need a reset.')}&email=${encodeURIComponent(email)}`)
  }

  if (data.user) {
    // Update CEO name after auth user + ceos record created via the handle_new_user trigger
    const admin = await createAdminClient()
    await admin.from('ceos').update({ name }).eq('id', data.user.id)
  }

  // If Supabase email confirmation is enabled, data.session will be null.
  if (!data.session) {
    redirect(`/portal/signup?confirm=1&email=${encodeURIComponent(email)}`)
  }

  redirect(`/portal/incorporate?product=company_office&billing=${billing}`)
}

export async function signIn(formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/portal/login?error=${encodeURIComponent(error.message)}`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('ceos').update({ last_seen_at: new Date().toISOString() }).eq('id', user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/portal/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCEO() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('ceos').select('*').eq('id', user.id).single()
  return data
}


// Supabase rejects any redirect target that is not in its project allow-list and
// silently substitutes the Site URL instead. On this project that is still
// http://localhost:3000, so a recovery link carries its token to a dead page on
// the customer's own machine and the reset page never receives it. Promising
// "we sent you a link" in that state is a false promise.
//
// generateLink does not send mail, so it is a safe way to ask Supabase what it
// would actually do. When the allow-list is corrected this starts working on its
// own, with no further code or configuration change.
export async function requestPasswordReset(email) {
  const target = String(email || '').trim();
  if (!target) return { ok: false, message: 'Enter your email address above, then select Forgot password.' };

  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || '';
  const redirectTo = `${origin}/auth/confirm?next=/portal/reset-password`;
  const neutral = 'If that address has an account, a password reset link is on its way.';

  try {
    const admin = await createAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery', email: target, options: { redirectTo },
    });
    // An unknown address errors here. Stay neutral rather than confirming which
    // addresses have accounts.
    if (error || !data?.properties?.action_link) return { ok: true, message: neutral };

    const honoured = new URL(data.properties.action_link).searchParams.get('redirect_to') || '';
    if (origin && !honoured.startsWith(origin)) {
      console.error(`[auth.reset] Supabase substituted redirect_to=${honoured} for ${redirectTo}; password reset cannot complete.`);
      return {
        ok: false,
        message: 'Password reset is temporarily unavailable. Please contact support and we will restore your access.',
      };
    }
  } catch (probeFailure) {
    console.error('[auth.reset] Could not verify reset configuration:', probeFailure?.message || probeFailure);
    return { ok: true, message: neutral };
  }

  // The allow-list accepts our origin, so Supabase's own recovery mail will land
  // somewhere that can complete the reset.
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(target, { redirectTo });
  if (error) console.error('[auth.reset] resetPasswordForEmail failed:', error.message);
  return { ok: true, message: neutral };
}
