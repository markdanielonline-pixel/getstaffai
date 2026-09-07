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

  // No code, or the exchange failed. Do not dead-end here.
  //
  // Supabase's verify endpoint hands the session back in a URL fragment, which
  // is never transmitted to a server, so this route genuinely cannot see it and
  // used to answer auth_callback_failed. That is what every signup confirmation
  // hit: a new customer confirmed their address and was bounced to login with an
  // error code. The PKCE exchange also fails whenever the mail is opened on a
  // different device from the one that signed up, which is the normal case.
  //
  // Redirect to the client page that can read a fragment. A redirect to a target
  // with no fragment of its own preserves the original one, so links already
  // sitting in inboxes keep working.
  const handoff = new URL(`${siteUrl}/auth/finish`);
  handoff.searchParams.set('next', next);
  return NextResponse.redirect(handoff.toString());
}
