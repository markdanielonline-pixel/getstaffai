import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/portal/incorporate'

  // Always use the public site URL — behind a proxy, request.url may resolve
  // to an internal IP instead of getstaffai.com
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getstaffai.com'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${siteUrl}${next}`)
    }
  }

  return NextResponse.redirect(`${siteUrl}/portal/login?error=auth_callback_failed`)
}
