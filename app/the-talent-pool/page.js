'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

const DEPT_FILTERS = [
  { key: 'all',       label: 'All Roles' },
  { key: 'admin',     label: 'Admin' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'cs',        label: 'Customer Service' },
  { key: 'sales',     label: 'Sales' },
  { key: 'tech',      label: 'Tech Support' },
];

const EMPLOYEES = [
  // ── ADMIN ──
  {
    id: 'victoria-chen',
    initials: 'VC',
    name: 'Victoria Chen',
    dept: 'admin',
    deptLabel: 'Admin Department',
    role: 'Admin Associate',
    grade: 'Junior',
    credential: 'StaffAI Certified',
    avatarBg: 'linear-gradient(135deg, #1B3A6B 0%, #0D1F3C 100%)',
    avatarFg: '#C9A84C',
    bio: 'Victoria manages executive calendars, document workflows, and inbox operations with the precision of a seasoned corporate administrator. Scheduling conflicts resolve before they form. Her turnaround on CEO-flagged documents is consistently same-day.',
    ventureSeat: '$49',
    executiveSeat: '$119',
    prestigeSeat: '$249',
    delivers: [
      'Full calendar management: scheduling, rescheduling, and conflict resolution',
      'Email inbox management with drafted responses ready for CEO approval',
      'Document preparation, formatting, filing, and version control',
      'Meeting notes and minutes, captured and distributed same day',
      'Travel and appointment coordination',
      'Internal filing and document organisation via the company knowledge base',
    ],
    kpiLabel: 'Email drafts approved without revision',
    kpiValue: '70%+ (Venture) to 90%+ (Prestige)',
    market: 'An executive-level administrator costs $3,000–$5,500/month on the open market. Victoria joins your organisation from $49/month.',
  },
  {
    id: 'emmanuel-okafor',
    initials: 'EO',
    name: 'Emmanuel Okafor',
    dept: 'admin',
    deptLabel: 'Admin Department',
    role: 'Senior Administrator',
    grade: 'Senior',
    credential: 'StaffAI Accredited',
    avatarBg: 'linear-gradient(135deg, #0D2A5C 0%, #1B3A6B 100%)',
    avatarFg: '#C9A84C',
    bio: 'Emmanuel builds the operational infrastructure that keeps growing organisations from breaking. His process documentation becomes the operational rulebook. His multi-stakeholder coordination handles what most administrators decline to attempt.',
    ventureSeat: '$79',
    executiveSeat: '$179',
    prestigeSeat: '$349',
    delivers: [
      'Complex multi-stakeholder scheduling and cross-functional coordination',
      'Process documentation and standard operating procedures (SOPs)',
      'Supplier and vendor communication management',
      'Report compilation, data organisation, and executive briefings',
      'Oversight of Admin Associates when both are recruited to the same organisation',
    ],
    kpiLabel: 'Multi-party scheduling success rate',
    kpiValue: '85%+ (Venture) to 98%+ (Prestige)',
    market: 'A senior operations administrator costs $4,500–$8,000/month. Emmanuel joins your Admin department from $79/month.',
  },

  // ── MARKETING ──
  {
    id: 'sofia-lamas',
    initials: 'SL',
    name: 'Sofia Lamas',
    dept: 'marketing',
    deptLabel: 'Marketing Department',
    role: 'Marketing Specialist',
    grade: 'Senior',
    credential: 'StaffAI Accredited',
    avatarBg: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
    avatarFg: '#ffffff',
    bio: 'Sofia runs the full marketing operation. Social strategy, branded video, SEO, and email campaigns, each executed with the rigour of a retained agency and the brand consistency of a seasoned in-house director. Her campaigns compound. Her results are documented weekly.',
    ventureSeat: '$199',
    executiveSeat: '$399',
    prestigeSeat: '$699',
    delivers: [
      'Full social media strategy and management across all active platforms',
      'Branded video content (Reels, TikToks, Stories) produced using Wan 2.6',
      'Advanced image assets with full brand consistency',
      'SEO: keyword research, on-page optimisation, long-form content, monthly reporting',
      'Email marketing: full campaigns, audience segmentation, A/B testing via Mautic',
      'Paid social ad copy and campaign setup (media budget passed through at cost)',
    ],
    kpiLabel: 'Monthly organic traffic growth',
    kpiValue: '5%+ (Venture) to 18%+ (Prestige)',
    market: 'Full-service social media management costs $3,000–$7,000/month. SEO retainers cost $1,500–$5,000/month. Sofia delivers both from $199/month.',
  },
  {
    id: 'yuki-tanaka',
    initials: 'YT',
    name: 'Yuki Tanaka',
    dept: 'marketing',
    deptLabel: 'Marketing Department',
    role: 'Marketing Assistant',
    grade: 'Junior',
    credential: 'StaffAI Certified',
    avatarBg: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
    avatarFg: '#ffffff',
    bio: 'Yuki keeps your brand visible and consistent across every platform. On-time publishing, active community engagement, and email campaign support delivered with the discipline of a brand guardian who has never missed a deadline.',
    ventureSeat: '$99',
    executiveSeat: '$199',
    prestigeSeat: '$349',
    delivers: [
      'Social media content across all active platforms: Instagram, LinkedIn, Facebook, X, TikTok',
      'Basic branded image creation using Stable Diffusion',
      'Community engagement: responding to comments and DMs in your brand voice',
      'Email campaign support: list management, template execution, basic sends via Mautic',
      'Content scheduling and publishing calendar management via Postiz',
    ],
    kpiLabel: 'Content published on schedule',
    kpiValue: '90%+ (Venture) to 98%+ (Prestige)',
    market: 'Part-time social media management costs $1,500–$3,000/month. Yuki never takes a day off and joins from $99/month.',
  },

  // ── CUSTOMER SERVICE ──
  {
    id: 'amara-osei',
    initials: 'AO',
    name: 'Amara Osei',
    dept: 'cs',
    deptLabel: 'Customer Service',
    role: 'CS Agent',
    grade: 'Junior',
    credential: 'StaffAI Certified',
    avatarBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    avatarFg: '#ffffff',
    bio: 'Amara handles omnichannel customer communications with warmth, precision, and a satisfaction score that consistently outperforms human team benchmarks. Every customer leaves the interaction better informed than they arrived.',
    ventureSeat: '$89',
    executiveSeat: '$199',
    prestigeSeat: '$399',
    delivers: [
      'Full omnichannel coverage: email, live chat, WhatsApp, and social media DMs',
      'Issue resolution, complaint handling, and refund processing within pre-approved limits',
      'FAQ management and knowledge base maintenance',
      'Customer satisfaction tracking with improvement recommendations to the GM',
      'Escalation to Senior CS Agent or GM when beyond her authorised scope',
    ],
    kpiLabel: 'Customer Satisfaction Score (CSAT)',
    kpiValue: '80%+ (Venture) to 90%+ (Prestige)',
    market: 'A customer service team of three agents costs $2,000–$4,000/month. Amara handles comparable volume from $89/month.',
  },
  {
    id: 'isabela-ferreira',
    initials: 'IF',
    name: 'Isabela Ferreira',
    dept: 'cs',
    deptLabel: 'Customer Service',
    role: 'Senior CS Agent',
    grade: 'Senior',
    credential: 'StaffAI Accredited',
    avatarBg: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
    avatarFg: '#ffffff',
    bio: 'Isabela specialises in high-stakes escalations, VIP relationship management, and churn prevention. Complaints that arrive on her desk rarely reach the CEO and rarely result in cancellations. Her retention record defines her reputation.',
    ventureSeat: '$129',
    executiveSeat: '$279',
    prestigeSeat: '$549',
    delivers: [
      'Everything the CS Agent delivers, at elevated depth and authority',
      'Complex escalation handling and structured resolution strategy',
      'Retention conversations: win-back and proactive churn prevention',
      'VIP customer relationship management and concierge-level follow-through',
      'Weekly CS performance summary delivered directly to the GM',
    ],
    kpiLabel: 'First Contact Resolution rate',
    kpiValue: '78%+ (Venture) to 90%+ (Prestige)',
    market: 'A senior customer success manager costs $4,000–$7,500/month. Isabela joins your CS department from $129/month.',
  },

  // ── SALES ──
  {
    id: 'james-park',
    initials: 'JP',
    name: 'James Park',
    dept: 'sales',
    deptLabel: 'Sales Department',
    role: 'Sales Specialist',
    grade: 'Senior',
    credential: 'StaffAI Accredited',
    avatarBg: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)',
    avatarFg: '#ffffff',
    bio: 'James runs full sales cycles from qualified lead to closed deal. His proposals are always persuasive, his pipelines always clean, and his close rates consistently sit above market average. No deal goes cold. No follow-up is skipped.',
    ventureSeat: '$199',
    executiveSeat: '$449',
    prestigeSeat: '$799',
    delivers: [
      'Full sales cycle ownership: from qualified lead through negotiation to close',
      'Complex negotiation support and strategic closing',
      'High-value, customised proposal creation backed by data and insight',
      'Upselling and cross-selling strategy for existing accounts',
      'Sales pipeline health analysis and monthly revenue forecasting for the GM',
    ],
    kpiLabel: 'Win rate (qualified leads to closed)',
    kpiValue: '15%+ (Venture) to 30%+ (Prestige)',
    market: 'Senior sales representatives cost $4,000–$15,000/month. AI sales agents cost $417–$8,333/month. James joins from $199/month.',
  },
  {
    id: 'rania-al-farsi',
    initials: 'RA',
    name: 'Rania Al-Farsi',
    dept: 'sales',
    deptLabel: 'Sales Department',
    role: 'Sales Associate',
    grade: 'Junior',
    credential: 'StaffAI Certified',
    avatarBg: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    avatarFg: '#ffffff',
    bio: 'Rania lives in the CRM. No lead goes cold. Every follow-up is timed, personalised, and tracked against the pipeline with the discipline of a top-tier sales professional who has never accepted a missed opportunity.',
    ventureSeat: '$129',
    executiveSeat: '$299',
    prestigeSeat: '$499',
    delivers: [
      'Lead follow-up and qualification across all inbound and assigned leads',
      'Outbound outreach: email sequences, LinkedIn messages, and targeted cold outreach',
      'Full CRM management: pipeline tracking, contact records, and daily activity logging',
      'Quote and proposal preparation (template-based; complex deals escalated to Specialist)',
      'Appointment setting for the CEO or senior sales team',
    ],
    kpiLabel: 'Lead response time',
    kpiValue: 'Under 2 hours (Venture) to under 30 minutes (Prestige)',
    market: 'Responding to a lead within 5 minutes increases conversion 9x. Rania responds within shift hours, and within 30 minutes at Prestige level.',
  },

  // ── TECH ──
  {
    id: 'tariq-hassan',
    initials: 'TH',
    name: 'Tariq Hassan',
    dept: 'tech',
    deptLabel: 'Tech Support',
    role: 'Senior Tech Specialist',
    grade: 'Senior',
    credential: 'StaffAI Accredited',
    avatarBg: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
    avatarFg: '#ffffff',
    bio: 'Tariq diagnoses at architecture level, not symptom level. The problems he solves rarely recur, because his documentation is thorough enough to prevent the next one from forming. At Prestige level, he operates with the strategic thinking of a senior engineer.',
    ventureSeat: '$169',
    executiveSeat: '$349',
    prestigeSeat: '$649',
    delivers: [
      'Complex systems and integrations troubleshooting and full resolution',
      'Architecture-level analysis with actionable strategic recommendations',
      'Code review and debugging within the CEO\'s business systems',
      'Advanced automation build, configuration, and ongoing maintenance',
      'Security and access audit recommendations delivered to the GM',
      'Vendor and platform evaluation support for upcoming integrations',
    ],
    kpiLabel: 'Complex issue resolution rate',
    kpiValue: '75%+ (Venture) to 90%+ (Prestige)',
    market: 'Senior IT specialists cost $6,000–$10,000/month. Senior engineers cost $10,000–$18,000/month. Tariq joins from $169/month.',
  },
  {
    id: 'lena-kovac',
    initials: 'LK',
    name: 'Lena Kovac',
    dept: 'tech',
    deptLabel: 'Tech Support',
    role: 'Tech Support Agent',
    grade: 'Junior',
    credential: 'StaffAI Certified',
    avatarBg: 'linear-gradient(135deg, #3730A3 0%, #4338CA 100%)',
    avatarFg: '#ffffff',
    bio: 'Lena resolves technical issues with precision and patience. Her first-contact resolution rate benchmarks consistently above department average. Her documentation is clean enough that the same issue is rarely raised twice.',
    ventureSeat: '$99',
    executiveSeat: '$219',
    prestigeSeat: '$399',
    delivers: [
      'Software, integration, and technical issue troubleshooting',
      'Setup and configuration of business tools and third-party platforms',
      'User access management and permissions administration',
      'Basic automation setup and ongoing maintenance',
      'Technical documentation and internal how-to guides',
      'Inbound support ticket management via the company helpdesk',
    ],
    kpiLabel: 'Ticket resolution rate (first contact)',
    kpiValue: '65%+ (Venture) to 83%+ (Prestige)',
    market: 'IT support freelancers cost $1,500–$4,000/month. Premium IT support packages cost $4,000–$7,000/month. Lena joins from $99/month.',
  },
];

const GHOST_CARDS = [
  { initials: '••', label: 'Admin Department Head',    bg: 'linear-gradient(135deg, #1B3A6B, #0D1F3C)', fg: '#C9A84C' },
  { initials: '••', label: 'Marketing Department Head', bg: 'linear-gradient(135deg, #7C3AED, #6D28D9)', fg: '#fff'    },
  { initials: '••', label: 'Sales Department Head',     bg: 'linear-gradient(135deg, #B91C1C, #991B1B)', fg: '#fff'    },
];

function EmployeeCard({ emp, isExpanded, onToggle }) {
  return (
    <div className="employee-card reveal">
      {/* Avatar */}
      <div className="emp-monogram" style={{ background: emp.avatarBg, color: emp.avatarFg }}>
        {emp.initials}
      </div>

      {/* Identity */}
      <div className="emp-card-name">{emp.name}</div>
      <div className="emp-card-role">{emp.role}</div>
      <div className="emp-card-dept">{emp.deptLabel}</div>

      {/* Badges */}
      <div className="emp-badges">
        <span className={`emp-badge ${emp.grade === 'Senior' ? 'badge-accredited' : 'badge-certified'}`}>
          {emp.credential}
        </span>
        <span className="emp-badge badge-grade">{emp.grade}</span>
      </div>

      {/* Bio */}
      <p className="emp-bio">{emp.bio}</p>

      {/* Seat pricing */}
      <div className="emp-seat-row">
        <div>
          <div className="emp-seat-from">From</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span className="emp-seat-price">${emp.ventureSeat}</span>
            <span className="emp-seat-mo">/mo</span>
          </div>
        </div>
        <div className="emp-level-prices">
          Venture: ${emp.ventureSeat}/mo<br />
          Executive: ${emp.executiveSeat}/mo<br />
          Prestige: ${emp.prestigeSeat}/mo
        </div>
      </div>

      {/* Expand button */}
      <button
        className={`role-expand-btn ${isExpanded ? 'is-expanded' : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span>View Role Details</span>
        <span className="expand-chevron">↓</span>
      </button>

      {/* Accordion */}
      <div
        className="role-accordion"
        style={{ maxHeight: isExpanded ? '900px' : '0' }}
        aria-hidden={!isExpanded}
      >
        <div className="role-accordion-inner">

          <div className="accordion-label">What they deliver</div>
          <ul className="accordion-delivers">
            {emp.delivers.map(item => <li key={item}>{item}</li>)}
          </ul>

          <div className="accordion-label">Key performance indicator</div>
          <div className="accordion-kpi-block">
            <div className="accordion-kpi-label">{emp.kpiLabel}</div>
            <div className="accordion-kpi-value">{emp.kpiValue}</div>
          </div>

          <div className="accordion-label">Seat fee by Intelligence Level</div>
          <div className="seat-levels-row">
            {[['Venture', emp.ventureSeat], ['Executive', emp.executiveSeat], ['Prestige', emp.prestigeSeat]].map(([lvl, price]) => (
              <div key={lvl} className="seat-level-pill">
                <div className="seat-level-name">{lvl}</div>
                <div className="seat-level-price">${price}<span style={{ fontSize: '0.6rem', opacity: 0.6 }}>/mo</span></div>
              </div>
            ))}
          </div>

          <p className="accordion-market">{emp.market}</p>
        </div>
      </div>
    </div>
  );
}

export default function TalentPoolPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const visible = activeFilter === 'all'
    ? EMPLOYEES
    : EMPLOYEES.filter(e => e.dept === activeFilter);

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ── */}
        <section className="talent-hero">
          <div className="talent-hero-photo" />
          <div className="talent-hero-grid" />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 999,
              padding: '0.3rem 1rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.75rem',
            }}>
              The Talent Pool
            </div>

            <h1 className="display-lg" style={{
              color: '#ffffff',
              marginBottom: '1.25rem',
              maxWidth: 680,
              margin: '0 auto 1.25rem',
            }}>
              Recruit world-class talent.<br />
              <em className="text-gradient-gold">One seat at a time.</em>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '1.05rem',
              maxWidth: 540,
              margin: '0 auto 3.5rem',
              lineHeight: 1.72,
              fontFamily: 'var(--font-body)',
            }}>
              Every employee trained and certified at The StaffAI Institute before placement. Recruit individually or hire an entire department and save 15%.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '3.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { n: '40+', l: 'Active profiles' },
                { n: '5',   l: 'Departments' },
                { n: '3',   l: 'Intelligence Levels' },
                { n: '15%', l: 'Bundle discount' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.2rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                    marginBottom: '0.3rem',
                  }}>{s.n}</div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>{s.l}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="section" style={{ background: 'var(--paper)' }}>
          <div className="container">

            {/* Section heading + Level link */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <span className="kicker reveal">Browse the Pool</span>
                <h2 className="display-md reveal reveal-delay-1" style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  marginBottom: 0,
                  marginTop: '0.5rem',
                }}>
                  Your organisation.<br />
                  <em className="text-gradient-gold">Your people.</em>
                </h2>
              </div>
              <Link href="/pricing" className="btn btn-outline-navy btn-sm reveal">
                View Intelligence Levels
              </Link>
            </div>

            {/* Filter bar */}
            <div className="dept-filter-bar">
              {DEPT_FILTERS.map(d => (
                <button
                  key={d.key}
                  className={`dept-filter-btn ${activeFilter === d.key ? 'filter-active' : ''}`}
                  onClick={() => setActiveFilter(d.key)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Employee grid */}
            <div className="employee-grid">
              {visible.map(emp => (
                <EmployeeCard
                  key={emp.id}
                  emp={emp}
                  isExpanded={!!expanded[emp.id]}
                  onToggle={() => toggle(emp.id)}
                />
              ))}

              {/* Locked ghost cards — only in "All" view */}
              {activeFilter === 'all' && GHOST_CARDS.map((g, i) => (
                <div key={i} className="employee-card-locked">
                  {/* Ghost content */}
                  <div style={{ opacity: 0.25 }}>
                    <div className="emp-monogram" style={{ background: g.bg, color: g.fg, marginBottom: '1rem' }}>
                      {g.initials}
                    </div>
                    <div style={{
                      height: 12, background: 'var(--line)', borderRadius: 6,
                      width: '60%', marginBottom: '0.5rem',
                    }} />
                    <div style={{
                      height: 10, background: 'var(--line)', borderRadius: 6,
                      width: '45%', marginBottom: '1rem',
                    }} />
                    <div style={{
                      height: 8, background: 'var(--line)', borderRadius: 6,
                      width: '80%', marginBottom: '0.4rem',
                    }} />
                    <div style={{
                      height: 8, background: 'var(--line)', borderRadius: 6,
                      width: '70%',
                    }} />
                  </div>
                  {/* Lock overlay */}
                  <div className="lock-overlay">
                    <div className="lock-icon">🔒</div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color: 'var(--ink)',
                      textAlign: 'center',
                      marginBottom: '0.3rem',
                    }}>
                      {g.label}
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--ink-55)',
                      textAlign: 'center',
                      marginBottom: '1rem',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.55,
                    }}>
                      Incorporate free to unlock the full Talent Pool and access Department Head profiles.
                    </p>
                    <Link href="/portal/signup" className="btn btn-navy btn-sm">
                      Incorporate Free
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle banner */}
            <div className="bundle-banner">
              <div>
                <span className="kicker" style={{ color: 'rgba(201,168,76,0.7)', marginBottom: '0.65rem', display: 'block' }}>
                  Department Bundle
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  marginBottom: '0.75rem',
                  lineHeight: 1.2,
                }}>
                  Hire an entire department.<br />Save 15% automatically.
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.48)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: 480,
                  fontFamily: 'var(--font-body)',
                }}>
                  Recruit all roles in a department at once and the 15% bundle discount applies at checkout without any code. It mirrors how real companies staff up.
                </p>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div className="bundle-discount-num">15%</div>
                <div style={{
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.38)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  marginTop: '0.3rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>Off Full Department</div>
                <Link href="/portal/signup" className="btn btn-gold btn-lg btn-pulse" style={{ marginTop: '1.5rem', display: 'block' }}>
                  Incorporate Free
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── INTELLIGENCE LEVELS CTA ── */}
        <section className="section" style={{ background: 'var(--white)', textAlign: 'center' }}>
          <div className="container">
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
              <span className="kicker reveal">Intelligence Levels</span>
              <h2 className="display-md reveal reveal-delay-1" style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                marginBottom: '1.25rem',
                marginTop: '0.5rem',
              }}>
                The same talent.<br />
                <em className="text-gradient-gold">Three levels of depth.</em>
              </h2>
              <p className="reveal reveal-delay-2" style={{
                color: 'var(--ink-55)',
                fontSize: '1rem',
                lineHeight: 1.75,
                marginBottom: '2.5rem',
              }}>
                Every employee is available across all three Intelligence Levels: Venture, Executive, and Prestige. The same name. The same role. A fundamentally different depth of performance.
              </p>
              <div className="reveal reveal-delay-3" style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <Link href="/pricing" className="btn btn-navy btn-lg">
                  View Intelligence Levels
                </Link>
                <Link href="/portal/signup" className="btn btn-ghost btn-lg">
                  Incorporate Free
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
