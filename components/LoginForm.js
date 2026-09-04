'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import LoginExtras from '@/components/LoginExtras';

const inputStyle = {
  width: '100%',
  padding: '1rem',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-light)',
  color: 'var(--text-primary)',
  borderRadius: '0.5rem',
  outline: 'none',
};

export default function LoginForm() {
  const supabase = useMemo(() => createClient(), []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.assign('/portal/dashboard');
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {error && (
        <div role="alert" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: 'var(--text-primary)', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      <div>
        <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
        <input id="login-email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required placeholder="name@company.com" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="login-password" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
        <input id="login-password" type="password" name="password" style={inputStyle} required placeholder="••••••••" autoComplete="current-password" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#ffffff', border: 'none', cursor: loading ? 'wait' : 'pointer', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
      </form>
      <LoginExtras email={email} />
    </>
  );
}
