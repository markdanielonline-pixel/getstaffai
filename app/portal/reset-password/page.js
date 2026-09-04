'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccessMsg('Your password has been successfully updated.');
      setTimeout(() => {
        router.push('/portal/login');
      }, 2000);
    } catch (err) {
      console.error('Password update error:', err);
      setErrorMsg(err.message || 'Failed to update your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1), transparent 50%)',
        padding: '5rem 1rem 2rem 1rem'
      }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3.5rem', background: 'var(--bg-secondary)', borderTop: '3px solid var(--accent-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', textAlign: 'center' }}>
            Choose a new, secure password for your C-Suite executive account.
          </p>

          {errorMsg && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#a7f3d0', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} 
                required 
                placeholder="••••••••" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} 
                required 
                placeholder="••••••••" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#ffffff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}
            >
              {loading ? 'Updating Password...' : 'Save Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
