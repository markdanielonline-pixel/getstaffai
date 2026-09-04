'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginExtras({ email }) {
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState(null);
  const [oauthError, setOauthError] = useState(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    try {
      setOauthError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/portal/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('OAuth error:', err);
      setOauthError(err.message || 'Failed to initialize Google sign-in.');
    }
  };

  const handleForgotPassword = async () => {
    const targetEmail = (email || '').trim();
    if (!targetEmail) {
      setResetMsg('Enter your email address above, then select Forgot password.');
      return;
    }
    setResetLoading(true);
    setResetMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/portal/reset-password`,
      });
      if (error) throw error;
      setResetMsg('Password reset link has been dispatched to your email.');
    } catch (err) {
      console.error('Reset error:', err);
      setResetMsg(err.message || 'Failed to dispatch reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      {oauthError && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {oauthError}
        </div>
      )}
      {resetMsg && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#a7f3d0', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {resetMsg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>or</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          background: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-light)',
          cursor: 'pointer',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.6z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26c-.8.54-1.85.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H1.02v2.33A9 9 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.97 10.7a5.4 5.4 0 0 1 0-3.4V4.97H1.02a9 9 0 0 0 0 8.06l2.95-2.33z"/>
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4A9 9 0 0 0 1.02 4.97l2.95 2.33c.7-2.12 2.69-3.72 5.03-3.72z"/>
        </svg>
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={handleForgotPassword}
        disabled={resetLoading}
        style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1rem', textAlign: 'center', width: '100%' }}
      >
        {resetLoading ? 'Requesting...' : 'Forgot password?'}
      </button>
    </>
  );
}
