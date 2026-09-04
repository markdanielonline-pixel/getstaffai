import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/portal/incorporate'

  // Always use the public site URL — behind a proxy, request.url may resolve
  // to an internal IP instead of getstaffai.com
  // Fallback must be the application host. getstaffai.com serves the locked
  // static marketing site and has no /portal or /auth routes, so if the env var
  // were ever unset every auth redirect would land on a 404.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.getstaffai.com'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${siteUrl}${next}`)
    }
  }

  return NextResponse.redirect(`${siteUrl}/portal/login?error=auth_callback_failed`)
}
