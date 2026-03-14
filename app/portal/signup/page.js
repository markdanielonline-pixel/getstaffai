'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function Signup() {
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
              Start <span style={{ color: 'var(--accent-secondary)' }}>Free Forever.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
              Deploy your AI Revenue Workforce in minutes. No credit card required.
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>First Name</label>
                  <input type="text" style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} required placeholder="Alex" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Last Name</label>
                  <input type="text" style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} required placeholder="Smith" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Work Email</label>
                <input type="email" style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} required placeholder="alex@company.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Business Phone</label>
                <input type="tel" style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} required placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
                <input type="password" style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} required placeholder="••••••••" />
              </div>
              
              <button type="button" onClick={() => window.location.href = '/portal/login'} className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-color))', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}>
                Create Account
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link href="/portal/login" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  Login to your workspace here
                </Link>
              </div>
            </form>
          </div>

          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              What you get today
            </h2>
            
            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Launch Tier ($0/mo)</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Build and test your workforce before committing to a paid plan.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> Website capture widget</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> 2 appointments</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> 50 AI text conversations</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> 10 AI voice minutes</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: '#10b981' }}>✓</span> Email support</li>
            </ul>
          </div>
          
        </div>
      </div>
    </>
  );
}
