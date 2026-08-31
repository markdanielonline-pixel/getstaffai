import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { getCEO } from '@/app/actions/auth';

export default async function IncorporateSuccess() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem 2rem 1rem' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', padding: '3.5rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--border-light)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            You're incorporated.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Your dashboard is available. Check workforce setup there; Sophia and Marcus become operational only after their runtime checks pass.
          </p>
          <Link href="/portal/dashboard" className="btn btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#fff', borderRadius: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Enter your Executive Suite
          </Link>
        </div>
      </div>
    </>
  );
}
