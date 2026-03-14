import Header from '@/components/Header';
import Link from 'next/link';

const PHASES = [
  {
    phase: 'Phase 1',
    label: 'Live Now',
    status: 'done',
    color: '#10b981',
    items: [
      { title: 'AI Chat Widget', desc: 'Live on-site agents for Lead Gen, Appointment Setting, and Closing.' },
      { title: 'Stripe Subscriptions', desc: '5 tiers (Launch → Dominance) with monthly & annual billing, 2 months free on annual plans.' },
      { title: 'Lead Capture & Email Enrollment', desc: 'AI automatically captures name & email and enrolls the lead into a nurture campaign instantly.' },
      { title: 'Targeted Lead Import', desc: 'Pull targeted business leads from Google Maps by niche and city — ready for outreach.' },
      { title: 'SMS Outreach', desc: 'Send AI-drafted SMS messages to leads directly from the dashboard.' },
      { title: 'Live Dashboard', desc: 'Live lead feed, conversation history, and usage tracking per billing period.' },
    ],
  },
  {
    phase: 'Phase 2',
    label: 'Q2 2026',
    status: 'next',
    color: '#6366f1',
    items: [
      { title: 'Client Portal', desc: 'Full dashboard for clients to view leads, conversations, usage, and billing — no code needed.' },
      { title: 'CRM & Calendar Sync', desc: 'Two-way sync with your calendar: book appointments, update contact stages, and log AI activity automatically.' },
      { title: 'Voice Calling Agent', desc: 'AI agents that call leads, qualify them, and book appointments over the phone.' },
      { title: 'Call Recording & Transcripts', desc: 'Every call recorded, transcribed, and scored for conversion coaching.' },
      { title: 'Multi-Number Routing', desc: 'Assign dedicated local numbers per campaign or market for higher pickup rates.' },
    ],
  },
  {
    phase: 'Phase 3',
    label: 'Q3 2026',
    status: 'planned',
    color: '#f59e0b',
    items: [
      { title: 'AI Sales Escalation', desc: 'When a lead signals high intent, the AI alerts a human closer in real time via Slack or SMS.' },
      { title: 'Lead Verification Engine', desc: 'Validate emails and phone numbers before outreach to protect sender reputation.' },
      { title: 'Industry-Specific Agent Packs', desc: 'Pre-trained agent personas for HVAC, Roofing, Law Firms, Med Spas, and more.' },
      { title: 'A/B Prompt Testing', desc: 'Test two agent scripts against each other and auto-promote the higher-converting version.' },
      { title: 'Analytics & Revenue Attribution', desc: 'Track the full funnel: lead source → conversation → booking → payment closed.' },
    ],
  },
  {
    phase: 'Phase 4',
    label: 'Q4 2026',
    status: 'vision',
    color: '#ec4899',
    items: [
      { title: 'White-Label Partner Program', desc: 'Agencies can resell StaffAi under their own brand with full margin control.' },
      { title: 'AI Email Sequences', desc: 'Multi-step drip campaigns written and sent autonomously based on lead behavior.' },
      { title: 'Predictive Lead Scoring', desc: 'ML model ranks leads by close probability so agents prioritize the hottest opportunities.' },
      { title: 'API & Webhook Access', desc: 'Full REST API so partners can push leads, trigger agents, and pull data into any stack.' },
      { title: 'Mobile App', desc: 'Monitor your AI workforce, review live conversations, and approve bookings from your phone.' },
    ],
  },
];

const STATUS_BADGE = {
  done:    { label: 'Live Now',  bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  next:    { label: 'In Progress', bg: 'rgba(99,102,241,0.15)', color: '#6366f1' },
  planned: { label: 'Planned',   bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  vision:  { label: 'Vision',    bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
};

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '80px' }}>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '4rem 1.5rem 2rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '0.3rem 1rem', fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            Product Roadmap
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 1rem', lineHeight: '1.1' }}>
            Building the Future of<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Revenue Operations</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            A transparent look at what we've shipped, what's next, and where we're taking StaffAi. Updated quarterly.
          </p>
          <Link href="/pricing" style={{ display: 'inline-block', background: 'var(--accent-color)', color: '#fff', padding: '0.85rem 2.2rem', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', textDecoration: 'none' }}>
            Get Started Free →
          </Link>
        </section>

        {/* TIMELINE */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '19px', top: '8px', bottom: '8px', width: '2px', background: 'linear-gradient(to bottom, #10b981, #6366f1, #f59e0b, #ec4899)', opacity: 0.3 }} />

            {PHASES.map((phase, pi) => {
              const badge = STATUS_BADGE[phase.status];
              return (
                <div key={pi} style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: phase.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${phase.color}55`, zIndex: 1 }}>
                      {phase.status === 'done' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <span style={{ color: '#fff', fontWeight: '800', fontSize: '0.75rem' }}>{pi + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{phase.phase}</h2>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: badge.color, background: badge.bg, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>{badge.label}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{phase.label}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                      {phase.items.map((item, ii) => (
                        <div key={ii} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${phase.color}33`, borderRadius: '10px', padding: '1rem 1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            {phase.status === 'done' && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={phase.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.title}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA FOOTER */}
        <section style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'rgba(99,102,241,0.05)', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.75rem' }}>Have a feature request?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We build with our customers. Reach out and help shape the roadmap.</p>
          <a href="mailto:hello@getstaffai.com" style={{ display: 'inline-block', background: 'transparent', color: 'var(--accent-color)', border: '2px solid var(--accent-color)', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}>
            hello@getstaffai.com
          </a>
        </section>
      </main>
    </>
  );
}
