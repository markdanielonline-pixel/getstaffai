'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * The landing point for any authentication link that arrives from email.
 *
 * Supabase's verify endpoint redirects with the session in the URL fragment,
 * as "#access_token=...&refresh_token=...". A fragment is never sent to a
 * server, so /auth/callback, which is a server route looking for "?code=",
 * could not see it and answered auth_callback_failed for every confirmation
 * email. Signup was the worst case: a new customer confirmed their address and
 * was bounced to the login page with an error code, unable to reach the
 * product they had just tried to buy. Verified against a real signup link
 * before this page existed.
 *
 * Fragment tokens are self-contained, so unlike the PKCE code they work when
 * the mail is opened on a different device from the one that signed up. That
 * is the normal case, not the edge case.
 *
 * This page is deliberately a client page. It is the only kind that can read a
 * fragment at all.
 */
export default function AuthFinish() {
  const [state, setState] = useState('working');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      const supabase = createClient();
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const query = new URLSearchParams(window.location.search);

      const requestedNext = query.get('next') || '/portal/incorporate';
      // Only ever redirect within this application.
      const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//')
        ? requestedNext
        : '/portal/incorporate';

      const failure = hash.get('error_description') || hash.get('error') || query.get('error_description');
      if (failure) {
        if (!cancelled) {
          setState('failed');
          setDetail(decodeURIComponent(String(failure).replace(/\+/g, ' ')));
        }
        return;
      }

      try {
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        const code = query.get('code');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const existing = await supabase.auth.getSession();
          if (!existing.data?.session) {
            if (!cancelled) setState('failed');
            return;
          }
        }

        // Replace rather than push: the credential must not sit in history, and
        // Back must not return to a spent link.
        window.location.replace(next);
      } catch (error) {
        console.error('Auth link could not be completed:', error);
        if (!cancelled) {
          setState('failed');
          setDetail(error.message || null);
        }
      }
    }

    finish();
    return () => { cancelled = true; };
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '420px', textAlign: 'center', color: 'var(--text-primary)' }}>
        {state === 'working' ? (
          <>
            <h1 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem' }}>Signing you in</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>One moment.</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '1.4rem', margin: '0 0 0.75rem' }}>That link did not work</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.6 }}>
              Email links last one hour and can only be used once. If it has been
              sitting in your inbox for a while, ask for a new one.
            </p>
            {detail && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>{detail}</p>
            )}
            <a
              href="/portal/login"
              style={{ display: 'inline-block', padding: '0.8rem 1.4rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Go to sign in
            </a>
          </>
        )}
      </div>
    </main>
  );
}
