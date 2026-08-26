import Link from 'next/link';
import Header from '@/components/Header';
import LoginExtras from '@/components/LoginExtras';
import { signIn } from '@/app/actions/auth';

export default async function Login({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) minmax(300px, 450px)', gap: '4rem', alignItems: 'center', maxWidth: '1000px' }}>

          <div style={{ padding: '2rem' }}>
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

          <div className="glass-panel" style={{ padding: '3.5rem', background: 'var(--bg-secondary)', borderTop: '3px solid var(--accent-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {decodeURIComponent(error)}
              </div>
            )}

            <form action={signIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                  required
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}
              >
                Sign In
              </button>
            </form>

            <LoginExtras />

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Don't have an AI workforce yet?{' '}
              <Link href="/portal/signup" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                Start Free Forever
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
