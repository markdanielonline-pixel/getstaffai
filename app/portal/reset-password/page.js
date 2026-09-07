'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import { requestPasswordReset } from '@/app/actions/auth';

/**
 * Turning a recovery link into a session, which is the part that was missing.
 *
 * Supabase sends the recovery token in the URL fragment, as
 * "#access_token=...&refresh_token=...&type=recovery". The browser client runs
 * in PKCE mode and only looks for "?code=", so the fragment was ignored, no
 * session was ever stored, and this page rendered a complete and believable
 * password form that could not possibly save. Verified in production against a
 * real link: the token was present in the address bar and nothing consumed it.
 *
 * The fragment is now consumed explicitly. Both shapes are accepted, because
 * either can arrive depending on how the reset was requested, and a link that
 * carries neither is said out loud instead of being dressed up as a form.
 *
 * The token is stripped from the address bar once used. It is a live credential
 * and does not belong in browser history or in a screenshot sent to support.
 */
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  // Stays 'checking' until we know whether this link produced a session. The
  // form is never rendered before that is settled.
  const [linkState, setLinkState] = useState('checking');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(null);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function establishSession() {
      const supabase = createClient();

      // Already signed in, for example when arriving through /auth/confirm,
      // which verifies server side and sets a cookie.
      const existing = await supabase.auth.getSession();
      if (existing.data?.session) {
        if (!cancelled) setLinkState('ready');
        return;
      }

      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const query = new URLSearchParams(window.location.search);

      const hashError = hash.get('error_description') || hash.get('error');
      if (hashError) {
        if (!cancelled) {
          setLinkState('invalid');
          setErrorMsg(decodeURIComponent(hashError.replace(/\+/g, ' ')));
        }
        return;
      }

      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');
      const code = query.get('code');

      try {
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          if (!cancelled) setLinkState('invalid');
          return;
        }

        window.history.replaceState({}, '', '/portal/reset-password');
        if (!cancelled) setLinkState('ready');
      } catch (err) {
        console.error('Recovery link could not be used:', err);
        if (!cancelled) {
          setLinkState('invalid');
          setErrorMsg(err.message || 'That reset link is no longer valid.');
        }
      }
    }

    establishSession();
    return () => { cancelled = true; };
  }, []);

  const handleResend = async (e) => {
    e.preventDefault();
    setResending(true);
    setResent(null);
    const result = await requestPasswordReset(email);
    setResent(result.message);
    setResending(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccessMsg('Your password has been updated. Taking you to sign in.');
      setTimeout(() => {
        router.push('/portal/login?notice=' + encodeURIComponent('Password updated. Sign in with your new password.'));
      }, 1800);
    } catch (err) {
      console.error('Password update error:', err);
      // The exact case that used to be invisible: no session behind the form.
      const missingSession = /session/i.test(err.message || '');
      setErrorMsg(missingSession
        ? 'This reset link is no longer signed in. Request a new link below and open it on the same device.'
        : (err.message || 'Failed to update your password.'));
      if (missingSession) setLinkState('invalid');
    } finally {
      setLoading(false);
    }
  };

  const panelHeading = { fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--text-primary)', textAlign: 'center' };
  const panelSub = { color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.6 };
  const fieldStyle = { width: '100%', boxSizing: 'border-box', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none', fontSize: '1rem' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' };
  const buttonStyle = (busy) => ({ padding: '1rem', fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#ffffff', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1, borderRadius: '0.5rem', fontWeight: 'bold' });
  const noticeStyle = { padding: '1rem', background: 'rgba(59,130,246,0.12)', border: '1px solid #3b82f6', color: 'var(--text-primary)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' };
  const errorStyle = { padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: 'var(--text-primary)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' };
  const successStyle = { padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: 'var(--text-primary)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="glass-panel auth-panel auth-reset-panel">
          <h1 style={panelHeading}>Reset Password</h1>

          {linkState === 'checking' && (
            <p style={panelSub}>Checking your reset link.</p>
          )}

          {linkState === 'invalid' && (
            <>
              <p style={panelSub}>
                This link did not sign you in, so a new password cannot be saved yet.
                Reset links last one hour and can only be used once.
              </p>
              {errorMsg && <div style={errorStyle}>{errorMsg}</div>}
              {resent && <div style={noticeStyle}>{resent}</div>}
              <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="resend-email" style={labelStyle}>Your email</label>
                  <input
                    id="resend-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={fieldStyle}
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                  />
                </div>
                <button type="submit" disabled={resending} className="btn btn-primary" style={buttonStyle(resending)}>
                  {resending ? 'Sending...' : 'Send me a new link'}
                </button>
              </form>
            </>
          )}

          {linkState === 'ready' && (
            <>
              <p style={panelSub}>Choose a new password for your account.</p>

              {errorMsg && <div style={errorStyle}>{errorMsg}</div>}
              {successMsg && <div style={successStyle}>{successMsg}</div>}

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="new-password" style={labelStyle}>New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={fieldStyle}
                    required
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" style={labelStyle}>Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={fieldStyle}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat the password"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ ...buttonStyle(loading), fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  {loading ? 'Updating Password...' : 'Save Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
