'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

const TIERS = [
  {
    id: 'Launch',
    name: 'Launch (Free Forever)',
    monthly: 0,
    annual: 0,
    tag: 'START HERE',
    blurb: 'Getting started and proving the system with real prospects.',
    features: ['Website widget', '2 appointments', '50 AI text conversations', '10 AI voice minutes', 'Email support'],
    cta: 'Start Free Forever',
    href: '/portal/signup',
  },
  {
    id: 'Operator',
    name: 'Operator',
    monthly: 97,
    annual: 970,
    blurb: 'Deploying your first serious revenue operator.',
    features: ['Unlimited AI text chat', '60 AI voice minutes', '500 outreach emails', 'Lead Gen & Appointment Setter', 'Calendar booking'],
    cta: 'Activate Operator',
  },
  {
    id: 'Accelerator',
    name: 'Accelerator',
    monthly: 297,
    annual: 2970,
    highlight: true,
    blurb: 'Expanding your workforce and enabling automated closing.',
    features: ['The Closer Agent', '180 AI voice minutes', '2,000 outreach emails', 'Proposal sending', 'Branded URL', 'AI Closer or human option'],
    cta: 'Activate Accelerator',
  },
  {
    id: 'Authority',
    name: 'Authority',
    monthly: 497,
    annual: 4970,
    blurb: 'Established brands with defined voice and complex sales.',
    features: ['Custom scripts', 'Priority routing', '2,500 lead uploads/mo', '1,000 email verifications', 'Everything in Accelerator'],
    cta: 'Activate Authority',
  },
  {
    id: 'Dominance',
    name: 'Dominance',
    monthly: 997,
    annual: 9970,
    blurb: 'Agencies, enterprise, max scale.',
    features: ['API access', 'White-label', 'Human takeover', '5,000 lead uploads/mo', '10 handoffs included'],
    cta: 'Activate Dominance',
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');

  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
        <section style={{ padding: '6rem 0 3rem', textAlign: 'center' }}>
          <div className="container">
            <h1 className="display-lg" style={{ marginBottom: '1.25rem', maxWidth: '720px', margin: '0 auto 1.25rem auto' }}>
              Pricing for your AI <span className="text-gradient-gold">Revenue Workforce</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '1.25rem auto 2.5rem auto', lineHeight: '1.7' }}>
              Replace three revenue roles for less than the salary of one. Start free, then scale capability as your volume grows.
            </p>

            <div className="billing-toggle" style={{ margin: '0 auto' }}>
              <button className={`billing-btn ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>Monthly</button>
              <button className={`billing-btn ${billing === 'annual' ? 'active' : ''}`} onClick={() => setBilling('annual')}>
                Annual
                <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', fontWeight: 700, background: '#4ade8020', color: '#4ade80', padding: '2px 7px', borderRadius: '999px' }}>2 MONTHS FREE</span>
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: '2rem 0 6rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              {TIERS.map(tier => {
                const price = billing === 'annual' ? Math.round(tier.annual / 12) : tier.monthly;
                const href = tier.id === 'Launch'
                  ? tier.href
                  : `/portal/incorporate?tier=${tier.id}&billing=${billing}`;

                return (
                  <div
                    key={tier.id}
                    className="glass-panel-vip flex flex-col"
                    style={{
                      padding: '2.5rem 2rem',
                      position: 'relative',
                      borderTop: `4px solid var(--accent-color)`,
                      transform: tier.highlight ? 'scale(1.04)' : 'none',
                      boxShadow: tier.highlight ? '0 0 40px rgba(139,92,246,0.35)' : 'none',
                      zIndex: tier.highlight ? 10 : 1,
                    }}
                  >
                    {tier.tag && (
                      <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-color)', color: '#fff', fontSize: '0.75rem', padding: '0.35rem 1rem', borderBottomLeftRadius: '0.75rem', fontWeight: 'bold' }}>
                        {tier.tag}
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{tier.name}</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                      ${price}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/{billing === 'annual' ? 'mo, billed yearly' : 'mo'}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem', fontSize: '0.95rem' }}>{tier.blurb}</p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, marginBottom: '2rem' }}>
                      {tier.features.map(f => (
                        <li key={f} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--accent-color)' }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={href}
                      className={tier.highlight ? 'btn btn-primary' : 'btn btn-outline'}
                      style={{
                        width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1rem',
                        ...(tier.highlight ? { background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', border: 'none' } : {}),
                      }}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
