'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

/* ============================================================
   PRICING DATA — CLAUDE.md authoritative source
   ============================================================ */
const LEVELS = {
  venture: {
    id: 'venture',
    name: 'Venture',
    tagline: 'The engine of a growing business.',
    accessMonthly: 79,
    accessAnnual: 658,
    badgeClass: 'level-badge-venture',
    ctaLabel: 'Incorporate at Venture',
    ctaHref: '/portal/signup?level=venture',
    accentColor: '#4ade80',
    caliber: {
      headline: 'StaffAI Certified professionals.',
      body: 'Every Venture employee holds a StaffAI Certified credential from the StaffAI Institute. Think of them as the best graduates from a highly regarded technical college. Trained specifically for their role, disciplined in execution, consistent under pressure. They are not generalists filling seats. They are specialists built to perform.',
    },
    includes: [
      'Executive Assistant (full capability, text only)',
      'General Manager',
      'Full Executive Suite',
      'All 5 launch departments available',
      'Weekly and monthly Board Reports',
      'Employee training simulation',
      'Company social wall',
    ],
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    tagline: 'Strategy meets operational depth.',
    accessMonthly: 249,
    accessAnnual: 2074,
    badgeClass: 'level-badge-executive',
    ctaLabel: 'Incorporate at Executive',
    ctaHref: '/portal/signup?level=executive',
    accentColor: '#818cf8',
    caliber: {
      headline: 'StaffAI Accredited professionals.',
      body: 'Executive employees hold a StaffAI Accredited credential: the mark of professionals who trained at globally recognised institutes, sharpened their skills across multiple industries, and built genuine specialisation in their field. This is the level where work stops being reliable and starts being sharp. Campaigns are strategic. Sales conversations are persuasive. Reports read like they came from a firm, not a task.',
    },
    includes: [
      'Executive Assistant (voice enabled, deeper memory)',
      'General Manager (strategic depth)',
      'Full Executive Suite with customisation',
      'All 5 launch departments available',
      'Weekly and monthly Board Reports',
      'Priority routing via GPT-5',
      'Company social wall',
    ],
  },
  prestige: {
    id: 'prestige',
    name: 'Prestige',
    tagline: 'The standard of the world\'s best.',
    accessMonthly: 599,
    accessAnnual: 4990,
    badgeClass: 'level-badge-prestige',
    ctaLabel: 'Incorporate at Prestige',
    ctaHref: '/portal/signup?level=prestige',
    accentColor: '#C9A84C',
    caliber: {
      headline: 'StaffAI Distinguished professionals.',
      body: 'Prestige employees hold a StaffAI Distinguished credential, reserved for the exceptional. Picture a professional who trained at a top-tier institution, was mentored one-on-one by a senior figure in their field, and then spent 10 years or more operating at the highest levels of corporate life. They do not just execute. They advise. They anticipate. At Prestige, your EA is indistinguishable from a world-class human assistant. Your Marketing Specialist produces agency-level content. Your Sales Specialist closes at the rate of a seasoned VP.',
    },
    includes: [
      'Executive Assistant (premium voice, deepest memory)',
      'General Manager (COO-level depth)',
      'Full Executive Suite with white-label option',
      'All 5 launch departments available',
      'Weekly and monthly Board Reports',
      'Claude Opus 4.6 for character-critical tasks',
      'Priority support across all channels',
    ],
  },
};

/* All roles — prices indexed as [venture, executive, prestige] */
const DEPARTMENTS = [
  {
    name: 'Admin Department',
    icon: '📋',
    roles: [
      { name: 'Admin Associate', grade: 'Junior', prices: [49, 119, 249], billing: 'Seat' },
      { name: 'Senior Administrator', grade: 'Senior', prices: [79, 179, 349], billing: 'Seat' },
      { name: 'Admin Department Head', grade: 'Executive', prices: [129, 299, 549], billing: 'Seat', elevationOnly: true },
    ],
  },
  {
    name: 'Marketing Department',
    icon: '📣',
    roles: [
      { name: 'Marketing Assistant', grade: 'Junior', prices: [99, 199, 349], billing: 'Seat + Creative Production Costs' },
      { name: 'Marketing Specialist', grade: 'Senior', prices: [199, 399, 699], billing: 'Seat + Creative Production Costs' },
      { name: 'Marketing Department Head', grade: 'Executive', prices: [299, 599, 999], billing: 'Seat + Creative Production Costs', elevationOnly: true },
    ],
  },
  {
    name: 'Customer Service',
    icon: '💬',
    roles: [
      { name: 'Receptionist', grade: 'Junior', prices: [79, 179, 349], billing: 'Seat + Voice Minutes' },
      { name: 'CS Agent', grade: 'Junior', prices: [89, 199, 399], billing: 'Seat + Activity Billing' },
      { name: 'Senior CS Agent', grade: 'Senior', prices: [129, 279, 549], billing: 'Seat + Activity Billing' },
      { name: 'CS Department Head', grade: 'Executive', prices: [199, 449, 799], billing: 'Seat', elevationOnly: true },
    ],
  },
  {
    name: 'Sales Department',
    icon: '📈',
    roles: [
      { name: 'Sales Associate', grade: 'Junior', prices: [129, 299, 499], billing: 'Seat + Activity Billing' },
      { name: 'Sales Specialist', grade: 'Senior', prices: [199, 449, 799], billing: 'Seat + Activity Billing' },
      { name: 'Sales Department Head', grade: 'Executive', prices: [299, 649, 1099], billing: 'Seat', elevationOnly: true },
    ],
  },
  {
    name: 'Tech Support',
    icon: '🔧',
    roles: [
      { name: 'Tech Support Agent', grade: 'Junior', prices: [99, 219, 399], billing: 'Seat' },
      { name: 'Senior Tech Specialist', grade: 'Senior', prices: [169, 349, 649], billing: 'Seat' },
      { name: 'Tech Department Head', grade: 'Executive', prices: [249, 499, 899], billing: 'Seat', elevationOnly: true },
    ],
  },
];

const VOCAL_GM = { venture: 49, executive: 99, prestige: 199 };

const levelIndex = { venture: 0, executive: 1, prestige: 2 };

function PricingLevel({ levelKey, billing }) {
  const level = LEVELS[levelKey];
  const idx = levelIndex[levelKey];
  const accessPrice = billing === 'annual'
    ? Math.round(level.accessAnnual / 12)
    : level.accessMonthly;
  const accentColor = level.accentColor;

  return (
    <section className="pricing-level-section" id={levelKey}>
      <div className="container">
        {/* Level header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
          <div>
            <div className={`level-badge ${level.badgeClass}`} style={{ marginBottom: '1.25rem' }}>
              {level.name} Intelligence
            </div>
            <h2 className="display-md" style={{ marginBottom: '1rem' }}>
              {level.caliber.headline}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.75' }}>
              {level.caliber.body}
            </p>
          </div>
          <div>
            {/* Access fee card */}
            <div style={{
              background: 'var(--bg-card)',
              border: `1px solid ${accentColor}30`,
              borderTop: `3px solid ${accentColor}`,
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Access Fee: Includes EA, GM, and Executive Suite
              </div>
              <div className="price-display" style={{ marginBottom: '0.5rem' }}>
                <span className="price-number" style={{ color: accentColor }}>
                  ${accessPrice}
                </span>
                <span className="price-period">/month</span>
              </div>
              {billing === 'annual' && (
                <div className="price-annual">
                  ${level.accessAnnual}/year. 2 months free.
                </div>
              )}
              <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {level.includes.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: accentColor, flexShrink: 0, marginTop: '0.05rem' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Vocal GM add-on
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  +${VOCAL_GM[levelKey]}/mo
                </div>
              </div>
              <a href={level.ctaHref} className="btn btn-gold" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', background: levelKey === 'prestige' ? 'linear-gradient(135deg, #E2C96E, #C9A84C)' : undefined }}>
                {level.ctaLabel}
              </a>
            </div>
          </div>
        </div>

        {/* Role catalog */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Seat Fees: Recruit from the Talent Pool
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            EA and GM are included in your Access Fee. All other employees are recruited individually or as complete department bundles (15% discount).
          </p>
        </div>

        {DEPARTMENTS.map(dept => (
          <div key={dept.name} style={{ marginBottom: '2.5rem' }}>
            <div className="dept-section-header">
              <span style={{ fontSize: '1rem' }}>{dept.icon}</span>
              <span className="dept-section-name">{dept.name}</span>
            </div>
            <div className="roles-grid">
              {dept.roles.map(role => (
                <div key={role.name} className={`role-card ${role.elevationOnly ? 'elevation-only' : ''}`}>
                  <div>
                    <div className="role-name">{role.name}</div>
                    <div className="role-grade">
                      {role.grade}
                      {role.elevationOnly && (
                        <span className="elevation-tag" style={{ marginLeft: '0.5rem' }}>Via Elevation Only</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {role.billing}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="role-price" style={{ color: role.elevationOnly ? 'var(--gold)' : 'var(--text-primary)' }}>
                      ${role.prices[idx].toLocaleString()}
                    </div>
                    <div className="role-price-sub">/mo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');

  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', background: 'var(--bg-primary)', minHeight: '100vh' }}>

        {/* PAGE HERO */}
        <section style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-bg-orb orb-1" style={{ opacity: 0.3 }} />
          <div className="hero-bg-orb orb-2" style={{ opacity: 0.2 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-eyebrow" style={{ margin: '0 auto 1.5rem auto', display: 'inline-flex' }}>
              Intelligence Levels
            </div>
            <h1 className="display-lg" style={{ marginBottom: '1.25rem', maxWidth: '720px', margin: '0 auto 1.25rem auto' }}>
              Select the intelligence<br />
              <span className="text-gradient-gold">your organisation deserves.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '1.25rem auto 2.5rem auto', lineHeight: '1.7' }}>
              Three levels. Three calibres of talent. One organisation, built around you.
              Your Access Fee covers your EA, GM, and Executive Suite. Recruit your team from the Talent Pool at the seat fees below.
            </p>

            {/* Billing toggle */}
            <div className="billing-toggle">
              <button
                className={`billing-btn ${billing === 'monthly' ? 'active' : ''}`}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                className={`billing-btn ${billing === 'annual' ? 'active' : ''}`}
                onClick={() => setBilling('annual')}
              >
                Annual
                <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', fontWeight: 700, background: '#4ade8020', color: '#4ade80', padding: '2px 7px', borderRadius: '999px' }}>
                  2 MONTHS FREE
                </span>
              </button>
            </div>

            {/* Level nav anchors */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
              {Object.values(LEVELS).map(level => (
                <a
                  key={level.id}
                  href={`#${level.id}`}
                  className={`level-badge ${level.badgeClass}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {level.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* THREE LEVEL SECTIONS */}
        {['venture', 'executive', 'prestige'].map(key => (
          <PricingLevel key={key} levelKey={key} billing={billing} />
        ))}

        {/* NOTES SECTION */}
        <section style={{ padding: '5rem 0 8rem' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem',
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)' }}>
                How billing works
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {[
                  {
                    title: 'Access Fee',
                    body: 'Covers your EA, GM, and Executive Suite. Billed monthly or annually. Annual billing = 2 months free.',
                  },
                  {
                    title: 'Seat Fees',
                    body: 'Each recruited employee adds a monthly seat fee. Department Head grades are earned via Elevation, not recruited directly.',
                  },
                  {
                    title: 'Activity Billing',
                    body: 'Applies to Receptionist, CS, and Sales roles above their daily shift threshold. Your GM notifies you before any threshold is approached.',
                  },
                  {
                    title: 'Creative Production Costs',
                    body: 'Marketing roles generate branded assets. GPU compute is billed per asset at transparent rates. Exactly like a real media budget.',
                  },
                  {
                    title: 'The Wallet',
                    body: 'Load funds to your Wallet for operational payments. AI never touches your personal accounts. Full transaction history always visible.',
                  },
                  {
                    title: 'Department Bundle Discount',
                    body: 'Recruiting all roles in a department at once earns a 15% discount versus recruiting seat by seat.',
                  },
                ].map(note => (
                  <div key={note.title}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                      {note.title}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>{note.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
