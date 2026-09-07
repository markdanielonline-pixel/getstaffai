import Link from 'next/link';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';

export default async function Login({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const notice = params?.notice;

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-layout">

          <div className="auth-intro">
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Welcome back.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
              Access your C-Suite Executive Assistant command center.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> View transcripts and revenue outcomes</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Live dashboard telemetry</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Adjust workforce routing</li>
            </ul>
          </div>

          <div className="glass-panel auth-panel">
            {notice && (
              <div style={{ padding: '1rem', background: 'rgba(59,130,246,0.12)', border: '1px solid #3b82f6', color: 'var(--text-primary)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {decodeURIComponent(notice)}
              </div>
            )}

            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: 'var(--text-primary)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {error === 'auth_callback_failed'
                  ? 'This sign-in or reset link is invalid or has expired. Request a new password reset link below.'
                  : decodeURIComponent(error)}
              </div>
            )}

            <LoginForm />

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Ready to establish your Company Office?{' '}
              <Link href="/portal/signup" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                Establish your Company Office
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
