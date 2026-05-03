import Link from 'next/link';

const employees = [
  { initials: 'NA', name: 'Nadia Ashworth',  role: 'Executive Assistant',   status: 'Briefing CEO',   cls: 's-typing', bg: '#1B3A6B', fg: '#C9A84C' },
  { initials: 'MR', name: 'Marcus Reid',     role: 'General Manager',        status: 'Board Report',   cls: 's-report', bg: '#0D1F3C', fg: '#818cf8' },
  { initials: 'SL', name: 'Sofia Lamas',     role: 'Marketing Specialist',   status: 'Active',         cls: 's-active', bg: '#0D2B1A', fg: '#4ade80' },
  { initials: 'JP', name: 'James Park',      role: 'Sales Specialist',       status: 'Active',         cls: 's-active', bg: '#2B0D0D', fg: '#f87171' },
  { initials: 'AO', name: 'Amara Osei',      role: 'CS Agent',               status: 'Responding',     cls: 's-typing', bg: '#1E0D2B', fg: '#c084fc' },
];

export default function Hero() {
  return (
    <section className="hero-section">

      {/* LEFT: white, typography-led */}
      <div className="hero-left">
        <div className="animate-fade-in-up">

          <div className="hero-eyebrow kicker">
            The World's First AI Company-as-a-Service
          </div>

          <h1 className="display-xl" style={{ marginBottom: '1.75rem', color: 'var(--ink)' }}>
            <span style={{ display: 'block' }}>Your company.</span>
            <span style={{ display: 'block' }}>Fully staffed.</span>
            <span className="display-italic text-gradient-gold" style={{ display: 'block' }}>
              Fully running.
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--ink-55)',
            maxWidth: '500px',
            lineHeight: '1.75',
            fontFamily: 'var(--font-body)',
          }}>
            StaffAI places a complete AI-powered organisation at your command. Named employees. Real departments. A General Manager who runs the company. An Executive Assistant who never leaves your side.
          </p>

          <div className="hero-cta-row">
            <Link href="/portal/signup" className="btn btn-navy btn-lg btn-pulse">
              Incorporate Free
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">
              View Intelligence Levels
            </Link>
          </div>

          <div className="hero-trust">
            {[
              'Named employees with distinct personalities',
              'EA contacts you within 60 seconds of incorporation',
              'Weekly Board Report delivered every Friday',
              'No contracts. Cancel anytime.',
            ].map(item => (
              <span key={item} className="hero-trust-item">{item}</span>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT: navy, live org preview */}
      <div className="hero-right">

        {/* Ambient photo layer — city through glass */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.28,
          zIndex: 0,
          pointerEvents: 'none',
        }} />
        {/* Gradient overlay — depth and legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(13,31,60,0.72) 0%, rgba(27,58,107,0.38) 60%, rgba(13,31,60,0.55) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* Floating stat: lead conversion */}
        <div className="hero-float" style={{ top: '12%', right: '-1.5rem', animation: 'float-slow 6s ease-in-out infinite' }}>
          <div className="hero-float-label">This Week</div>
          <div className="hero-float-value" style={{ color: 'var(--navy)' }}>+38%</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--ink-35)', marginTop: '0.15rem', fontFamily: 'var(--font-heading)' }}>
            Lead conversion
          </div>
        </div>

        {/* Floating stat: EA online */}
        <div className="hero-float" style={{ bottom: '14%', left: '-1.5rem', animation: 'float-slow 8s ease-in-out infinite 1s' }}>
          <div className="hero-float-label">EA Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'dot-pulse 1.5s infinite' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.82rem', color: '#18a34a' }}>
              Online. Ready.
            </span>
          </div>
        </div>

        {/* Main org card */}
        <div className="exec-suite-card animate-fade-in-up delay-300">
          <div className="exec-card-header">
            <div>
              <div className="exec-card-title">Your Executive Suite</div>
              <div className="exec-card-name">Active Organisation</div>
            </div>
            <div className="live-badge">
              <span className="live-dot" /> Live
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {employees.map(emp => (
              <div key={emp.name} className="emp-row">
                <div className="emp-avatar" style={{ background: emp.bg, color: emp.fg }}>
                  {emp.initials}
                </div>
                <div className="emp-info">
                  <div className="emp-name">{emp.name}</div>
                  <div className="emp-role">{emp.role}</div>
                </div>
                <span className={`emp-status ${emp.cls}`}>{emp.status}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1.2rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-heading)' }}>
              Weekly team meeting in
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
              2d 14h
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
