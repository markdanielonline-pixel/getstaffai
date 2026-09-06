import Link from 'next/link';
import Header from '@/components/Header';
import { signUp } from '@/app/actions/auth';

export default async function Signup({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const confirm = params?.confirm;
  const confirmEmail = params?.email;
  const billing = params?.billing === 'annual' ? 'annual' : 'monthly';

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.1), transparent 50%)',
        padding: '5rem 1rem 2rem 1rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) minmax(300px, 400px)', gap: '4rem', alignItems: 'center', maxWidth: '1000px' }}>

          <div className="glass-panel" style={{ padding: '3.5rem', background: 'var(--bg-secondary)', borderTop: '3px solid var(--accent-secondary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Establish Your <span style={{ color: 'var(--accent-secondary)' }}>Company Office.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
              Create your secure CEO account, then establish your Company Office. Backed by a 30-day money-back guarantee.
            </p>

            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: 'var(--text-primary)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {decodeURIComponent(error)}
              </div>
            )}

            {confirm ? (
              <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: 'var(--text-primary)', borderRadius: '0.5rem', fontSize: '0.95rem' }}>
                Almost there — we sent a confirmation link to <strong>{confirmEmail}</strong>. Click it to activate your account, then come back and sign in.
              </div>
            ) : (
              <form action={signUp.bind(null, billing)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                    required
                    placeholder="Alex Smith"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Work Email</label>
                  <input
                    type="email"
                    name="email"
                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                    required
                    placeholder="alex@company.com"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
                  <input
                    type="password"
                    name="password"
                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-color))', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}
                >
                  Create Account
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <Link href="/portal/login" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    Login to your workspace here
                  </Link>
                </div>
              </form>
            )}
          </div>

          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Company Office
            </h2>

            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>$199/month · 30-day money-back guarantee</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Annual billing is $1,990: pay for 10 months and receive 12.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> Executive Assistant</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> General Manager</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> Company knowledge and memory</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> Approvals and employee management</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> Month-to-month flexibility</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
