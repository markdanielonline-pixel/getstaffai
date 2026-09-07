'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { issuePasswordReset } from '@/lib/password-reset'

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


// The reset email is sent by us through Resend, not by Supabase's built-in
// mailer. Supabase would send it from noreply@mail.app.supabase.io, on a shared
// domain we do not control, for the single most security-sensitive message the
// product sends. See lib/password-reset.js for why the link shape differs too.
//
// This makes exactly one call to Supabase. An earlier version probed the
// configuration with generateLink first, which cost an email-rate-limit slot,
// got the real send refused with 429, and still told the customer a link was on
// its way. A send failure is now reported as a send failure.
//
// The reply never reveals whether an address has an account.
export async function requestPasswordReset(email) {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://app.getstaffai.com';
  return issuePasswordReset(email, { origin });
}
