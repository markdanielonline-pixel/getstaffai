import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const allowedTypes = new Set(['signup', 'invite', 'magiclink', 'recovery', 'email_change']);

export async function GET(request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const requestedNext = url.searchParams.get('next') || '/portal/dashboard';
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/portal/dashboard';

  if (!tokenHash || !allowedTypes.has(type)) {
    return NextResponse.redirect(new URL('/portal/login?error=Invalid%20or%20expired%20authentication%20link', url.origin));
  }

  const destination = new URL(next, url.origin);
  const response = NextResponse.redirect(destination);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  if (error) {
    return NextResponse.redirect(new URL(`/portal/login?error=${encodeURIComponent(error.message)}`, url.origin));
  }

  return response;
}
