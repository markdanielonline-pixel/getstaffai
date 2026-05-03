import Link from 'next/link';

const simulationFeatures = [
  { icon: '📊', title: 'The Board Report', desc: 'Every Friday your GM delivers a full company performance report. Outcomes, KPIs, department breakdowns, staff assessments, and the week ahead. No activity padding.' },
  { icon: '👥', title: 'Weekly Team Meeting', desc: 'Your team meets every week. Performance reviewed, targets set, elevations announced. Attend or just read the minutes. Your EA briefs you either way.' },
  { icon: '🏆', title: 'Elevation and Suspension', desc: 'Top performers earn promotion to Executive grade through a formal process. Underperformers go through a structured PIP. Your GM handles it. You approve.' },
  { icon: '🌐', title: 'Company Social Wall', desc: 'A live feed of your team interacting. When you appear on the wall, employees notice. The rarer the visit, the bigger the reaction. It mirrors real workplace dynamics.' },
  { icon: '💳', title: 'The Wallet', desc: 'A secure internal financial instrument. Your EA executes pre-approved payments. Marketing spend, vendor invoices, asset production costs. AI never touches your personal accounts.' },
  { icon: '🎓', title: 'The StaffAI Institute', desc: 'Every employee is certified before placement. Company-specific onboarding takes 1 to 2 hours after recruiting. Your team knows your business before touching a single task.' },
];

const departments = [
  { n: '01', icon: '📋', name: 'Admin Department',       desc: 'Calendar management, inbox control, document preparation, meeting notes, travel coordination, and process documentation.' },
  { n: '02', icon: '📣', name: 'Marketing Department',   desc: 'Full social media, branded video, AI image creation, email campaigns, SEO content, and ad copy. Agency output at a fraction of the cost.' },
  { n: '03', icon: '💬', name: 'Customer Service',       desc: 'Omnichannel coverage across email, live chat, WhatsApp, and social DMs. Every customer interaction handled in your brand voice.' },
  { n: '04', icon: '📈', name: 'Sales Department',       desc: 'Lead qualification, pipeline management, proposal creation, cold outreach, and closing. Your Sales team lives in the CRM and never lets a deal go cold.' },
  { n: '05', icon: '🔧', name: 'Tech Support',           desc: 'Internal tool management or external customer support. The only department where Claude Opus is available at every Intelligence Level.' },
];

const marketValues = [
  { service: 'Full-service social media management', market: '$3,000–$7,000/mo',  staffai: 'From $99/mo' },
  { service: 'SEO management and content',           market: '$1,500–$5,000/mo',  staffai: 'Included in Marketing' },
  { service: 'Customer service team (3 agents)',     market: '$2,000–$4,000/mo',  staffai: 'From $267/mo' },
  { service: 'AI voice receptionist',                market: '$400–$800/mo',      staffai: 'From $79/mo' },
  { service: 'Senior IT specialist',                 market: '$6,000–$10,000/mo', staffai: 'From $169/mo' },
  { service: 'Senior sales representative',          market: '$4,000–$15,000/mo', staffai: 'From $199/mo' },
];

export default function Features() {
  return (
    <>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-bar-inner reveal">
            {[
              { value: '5',   label: 'Departments at launch' },
              { value: '60s', label: 'EA contacts you in' },
              { value: '8hr', label: 'Staffed shifts, 7 days' },
              { value: '3',   label: 'Intelligence Levels' },
            ].map(s => (
              <div key={s.label} className="stat-cell">
                <span className="stat-num">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CINEMATIC PHOTO BAND */}
      <div
        className="photo-band photo-reveal"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(13,31,60,0.88) 0%, rgba(13,31,60,0.60) 50%, rgba(13,31,60,0.75) 100%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(1.65rem, 3.5vw, 2.6rem)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.35,
              marginBottom: '1.75rem',
            }}>
              "For the first time in their life, they feel like a true CEO backed by a world-class team."
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: 40,
                height: 2,
                background: 'var(--gold)',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>
                The One Emotion. Every CEO. Every Week.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* THE SIMULATION */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: '4.5rem' }}>
            <span className="kicker reveal">The Simulation</span>
            <h2 className="display-lg reveal reveal-delay-1" style={{ marginBottom: '1.25rem' }}>
              This is not software.<br />
              <span className="display-italic text-gradient-gold">This is your company.</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: '1.05rem', color: 'var(--ink-55)', lineHeight: '1.75' }}>
              StaffAI places a fully simulated, fully functional organisation at your command. Named employees with real personalities and real careers. A General Manager who runs operations. An Executive Assistant who runs you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {simulationFeatures.map((f, i) => (
              <div key={f.title} className={`feature-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--ink-55)', lineHeight: '1.65', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EA SPOTLIGHT — dark navy section */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

            <div className="reveal">
              <span className="kicker" style={{ color: 'rgba(201,168,76,0.8)' }}>The Executive Assistant</span>
              <h2 className="display-md reveal reveal-delay-1" style={{ color: 'var(--white)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
                She contacts you<br />
                <em className="text-gradient-gold">within 60 seconds.</em>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '1rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
                The moment your organisation incorporates, your EA reaches out. She does not welcome you. You are the CEO. She thanks you for the opportunity and gets to work.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '1rem', lineHeight: '1.75', marginBottom: '2rem' }}>
                She briefs you every morning. Relays your instructions to the GM. Executes pre-approved payments. Briefs you after every team meeting. She is always on. She never forgets. She never has a bad day.
              </p>
              <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1.5rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.80)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0, lineHeight: '1.55' }}>
                  At Prestige level, she is indistinguishable from a world-class human EA. She knows what you need before you ask.
                </p>
              </div>
            </div>

            <div className="reveal reveal-delay-2">
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '2rem',
                boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
              }}>
                {/* EA card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--navy-deep)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)' }}>NA</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', color: 'rgba(255,255,255,0.92)' }}>Nadia Ashworth</div>
                    <div style={{ fontSize: '0.68rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                      Your Executive Assistant
                    </div>
                  </div>
                </div>
                {/* Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div className="chat-bubble-ea" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.82)' }}>
                      Good morning. Your Board Report is ready. Three items need your attention before Thursday's team meeting. Shall I run through them?
                    </div>
                    <div className="chat-time chat-time-white" style={{ paddingLeft: '0.25rem' }}>0:58</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="chat-bubble-ceo" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(255,255,255,0.88)', marginLeft: 'auto' }}>
                      Yes, go ahead.
                    </div>
                    <div className="chat-time chat-time-white" style={{ paddingRight: '0.25rem', textAlign: 'right' }}>1:02</div>
                  </div>
                  <div>
                    <div className="chat-bubble-ea" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.82)' }}>
                      Marketing hit 7.2% engagement this week, up from 4.1%. Marcus is recommending we move the paid campaign forward. I have his full recommendation ready when you are.
                    </div>
                    <div className="chat-time chat-time-white" style={{ paddingLeft: '0.25rem' }}>1:03</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 4.5rem auto' }}>
            <span className="kicker reveal">The Talent Pool</span>
            <h2 className="display-md reveal reveal-delay-1" style={{ marginBottom: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
              Five departments.<br />
              <em className="text-gradient-gold">One organisation.</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: 'var(--ink-55)', fontSize: '1rem', lineHeight: '1.75' }}>
              Recruit individually or hire entire departments at once. Every employee trained in your company culture before they touch a single task.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {departments.map((d, i) => (
              <div key={d.name} className={`dept-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="dept-number">{d.n}</div>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.65rem' }}>{d.icon}</div>
                <h3 style={{ fontSize: '0.98rem', marginBottom: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{d.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-55)', lineHeight: '1.65', margin: 0 }}>{d.desc}</p>
              </div>
            ))}
            {/* Coming soon card */}
            <div className="dept-card reveal" style={{ borderColor: 'rgba(201,168,76,0.25)', background: 'linear-gradient(135deg, rgba(201,168,76,0.04), rgba(201,168,76,0.01))' }}>
              <div className="dept-number" style={{ color: 'rgba(201,168,76,0.25)' }}>06</div>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.65rem' }}>⚖️</div>
              <h3 style={{ fontSize: '0.98rem', marginBottom: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--gold)' }}>Legal and Accounting</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-35)', lineHeight: '1.65', margin: '0 0 1rem' }}>
                Contracts, compliance, invoicing, and financial reporting. Coming in the next release.
              </p>
              <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', padding: '0.25rem 0.7rem', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 999 }}>
                Coming Soon
              </span>
            </div>
          </div>

          {/* Talent Pool CTA */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }} className="reveal">
            <p style={{ color: 'var(--ink-55)', fontSize: '0.95rem', marginBottom: '1.25rem', fontFamily: 'var(--font-body)' }}>
              View individual employee profiles, role details, and seat pricing.
            </p>
            <Link href="/the-talent-pool" className="btn btn-navy">
              Browse the Talent Pool
            </Link>
          </div>

        </div>
      </section>

      {/* PHOTO SPLIT — editorial moment */}
      <div className="photo-split">
        <div className="photo-split-photo photo-reveal">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
            alt="Executive team in operation"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(13,31,60,0.12) 0%, rgba(13,31,60,0.55) 100%)',
          }} />
        </div>
        <div className="photo-split-copy reveal" style={{ background: 'var(--navy)', padding: '5rem 4rem' }}>
          <span className="kicker" style={{ color: 'rgba(201,168,76,0.8)' }}>Built Different</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(1.75rem, 3vw, 2.6rem)',
            color: 'var(--white)',
            lineHeight: 1.25,
            margin: '1rem 0 1.5rem',
          }}>
            Every employee.<br />
            <em className="text-gradient-gold">Named. Trained. Running.</em>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.60)',
            fontSize: '1rem',
            lineHeight: 1.75,
            marginBottom: '2rem',
          }}>
            Your team does not sit idle waiting for instructions. They show up, trained in your company culture, and get to work. The Board Report lands every Friday whether you asked for it or not.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              'Employees trained in your culture within 1–2 hours',
              'GM manages performance — you only approve decisions',
              'Weekly Board Report. Monthly deep-dive. Always on time.',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: '0.45rem' }} />
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MARKET VALUE — white section with value table */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="reveal">
              <span className="kicker">Real Market Value</span>
              <h2 className="display-md reveal reveal-delay-1" style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
                What this replaces<br />
                <em className="text-gradient-gold">in the real world.</em>
              </h2>
              <p style={{ color: 'var(--ink-55)', fontSize: '1rem', lineHeight: '1.75', marginBottom: '2rem' }}>
                StaffAI is not a cheaper version of something you already have. It is a full organisation delivering outcomes that would otherwise require a six-figure monthly payroll.
              </p>
              <Link href="/pricing" className="btn btn-navy">
                View Intelligence Levels
              </Link>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="card" style={{ padding: '0' }}>
                {marketValues.map((row, i) => (
                  <div key={row.service} className="value-row" style={{ padding: '1.1rem 2rem' }}>
                    <span className="value-service">{row.service}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span className="value-market">{row.market}</span>
                      <span className="value-staffai">{row.staffai}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — navy section with ambient photo */}
      <section className="section" style={{
        background: 'var(--navy-deep)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient photo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          pointerEvents: 'none',
        }} />
        {/* Dark gradient for legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(13,31,60,0.55) 0%, rgba(13,31,60,0.40) 50%, rgba(13,31,60,0.65) 100%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <span className="kicker reveal" style={{ color: 'rgba(201,168,76,0.7)' }}>Ready?</span>
            <h2 className="display-lg reveal reveal-delay-1" style={{ color: 'var(--white)', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
              Your organisation is<br />
              <em className="text-gradient-gold">waiting to be built.</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '2.5rem' }}>
              Incorporate for free. Your EA reaches out within 60 seconds. No payment required to begin.
            </p>
            <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/portal/signup" className="btn btn-gold btn-lg btn-pulse">
                Establish Your Organisation
              </Link>
              <Link href="/pricing" className="btn btn-outline-white btn-lg">
                View Intelligence Levels
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
