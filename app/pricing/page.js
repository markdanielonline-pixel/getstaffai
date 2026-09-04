import Link from 'next/link';
import Header from '@/components/Header';
import { BILLING_CATALOG } from '@/lib/billing/catalog';

const usd = cents => `$${(cents / 100).toLocaleString('en-US')}`;

export default function Pricing() {
  const office = BILLING_CATALOG.company_office;
  const workforce = Object.entries(BILLING_CATALOG).filter(([key]) => key !== 'company_office');

  return (
    <>
      <Header />
      <main style={{ padding: '8rem 1.25rem 5rem', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <section className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3rem' }}>
            <p style={{ color: 'var(--accent-secondary)', fontWeight: 800, letterSpacing: '.08em' }}>SIMPLE, TRANSPARENT PRICING</p>
            <h1 className="display-lg">Start with your Company Office.</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Every Company Office includes your Executive Assistant and General Manager. Start with a 7-day trial.</p>
          </div>
          <div className="glass-panel-vip" style={{ maxWidth: 720, margin: '0 auto 4rem', padding: '2.5rem' }}>
            <h2>{office.name}</h2>
            <div style={{ fontSize: '2.75rem', fontWeight: 900 }}>{usd(office.monthly)}<small style={{ fontSize: '1rem' }}>/month</small></div>
            <p>Annual: {usd(office.annual)}. Pay for 10 months and receive 12.</p>
            <ul>{office.includes.map(item => <li key={item}>{item}</li>)}</ul>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link className="btn btn-primary" href="/portal/signup?billing=monthly">Start monthly trial</Link>
              <Link className="btn btn-outline" href="/portal/signup?billing=annual">Start annual trial</Link>
            </div>
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add employees and teams as your company grows</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem' }}>
            {workforce.map(([key, item]) => (
              <article key={key} className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3>{item.name}</h3>
                <strong style={{ fontSize: '1.5rem' }}>{usd(item.monthly)}/month</strong>
                <p style={{ color: 'var(--text-secondary)' }}>Annual {usd(item.annual)}.</p>
                {item.includes && <p>{item.includes.join(' + ')}</p>}
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
