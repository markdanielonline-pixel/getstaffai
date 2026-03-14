import Link from 'next/link';

export default function Features() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* SECTION: WHAT YOU GET */}
      <section className="section container" style={{ paddingTop: '4rem' }}>
        <div className="section-header animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.2rem', marginBottom: '1.5rem' }}>
            Three Revenue Roles. <span className="text-gradient-vibrant">One Workforce.</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
            StaffAi deploys specialized agents that perform the critical revenue work most businesses fail to execute consistently.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
          <div className="glass-panel-vip animate-fade-in-up delay-100" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderTop: '2px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Lead Generation Agent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem' }}>
              Engages every opportunity instantly.
            </p>
          </div>
          <div className="glass-panel-vip animate-fade-in-up delay-200" style={{ padding: '2.5rem', background: 'rgba(0, 102, 255, 0.05)', borderTop: '2px solid var(--accent-color)', transform: 'translateY(-10px)' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Appointment Setter Agent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem' }}>
              Qualifies and books directly into your calendar.
            </p>
          </div>
          <div className="glass-panel-vip animate-fade-in-up delay-300" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderTop: '2px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Closing Agent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem' }}>
              Nurtures, persuades, follows up, and converts.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: THE PROBLEM */}
      <section className="container animate-fade-in-up delay-400" style={{ marginBottom: '8rem' }}>
        <div className="glass-panel-vip" style={{ padding: '5rem 4rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.15', color: 'var(--text-primary)' }}>
              Most Leads Never Convert Because Nobody Follows Up Properly.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Leads go cold fast. Humans get busy. CRMs do not sell. "Automation" usually means a few emails and silence.
            </p>
            <div style={{ padding: '1.5rem', background: 'rgba(0, 102, 255, 0.05)', borderLeft: '4px solid var(--accent-color)', borderRadius: '0 8px 8px 0' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                StaffAi is built to keep going until the prospect converts or opts out.
              </p>
            </div>
          </div>
          
          {/* Visual Nurture Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.2rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Day 1 / Minute 1</span>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>"Hi! Saw you were looking at our pricing. Any questions?"</div>
            </div>
            <div style={{ padding: '1.2rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Day 3</span>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>"Thought of you—here's a quick case study on how we helped someone similar."</div>
            </div>
            <div style={{ padding: '1.2rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ position: 'absolute', top: '-1px', left: '-1px', bottom: '-1px', width: '4px', background: 'var(--accent-color)', borderRadius: '12px 0 0 12px' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Day 14</span>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>"Still looking to solve that revenue leak? I have a 15 min slot tomorrow."</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS */}
      <section className="container animate-fade-in-up" style={{ marginBottom: '8rem' }}>
        <h2 style={{ fontSize: '2.8rem', textAlign: 'center', marginBottom: '4rem', color: 'var(--text-primary)' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { step: '1', title: 'Capture', desc: 'Widget, inbound messages, or imported lead lists.' },
            { step: '2', title: 'Engage', desc: 'Instant text-first conversation to qualify and build intent.' },
            { step: '3', title: 'Nurture', desc: 'Persistent follow-up over days and weeks, not minutes.' },
            { step: '4', title: 'Close', desc: 'Booking, proposals, payment links, and escalation.' }
          ].map((item, i) => (
            <div key={i} className="glass-panel-vip hover:transform-none" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
              <div style={{ width: '50px', height: '50px', background: '#000', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: WHY TEXT-FIRST WINS */}
      <section className="container animate-fade-in-up" style={{ marginBottom: '8rem' }}>
        <div className="glass-panel-vip" style={{ padding: '4rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 100%, rgba(0, 102, 255, 0.05), transparent 60%)' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Text First Removes Escape Routes.</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
            Text catches prospects fast and keeps them engaged where they already live. When escalation improves conversion probability, StaffAi can switch to voice support without losing the thread.
          </p>
        </div>
      </section>

      {/* SECTION: INDUSTRY FIT */}
      <section className="container animate-fade-in-up" style={{ marginBottom: '8rem' }}>
        <h2 style={{ fontSize: '2.8rem', textAlign: 'center', marginBottom: '4rem', color: 'var(--text-primary)' }}>Built for Real Businesses.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel-vip" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Local Service Businesses</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Turn inquiries into booked jobs.</p>
          </div>
          <div className="glass-panel-vip" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Consultants and Coaches</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Turn interest into paid sessions.</p>
          </div>
          <div className="glass-panel-vip" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Marketing Companies</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Convert inbound leads into clients.</p>
          </div>
          <div className="glass-panel-vip" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Ecommerce</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Recover buyers and convert hesitant visitors.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/industries" className="text-gradient-vibrant" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>View All Industries →</Link>
        </div>
      </section>

      {/* SECTION: FREE FOREVER */}
      <section className="container animate-fade-in-up" style={{ marginBottom: '8rem' }}>
        <div className="glass-panel-vip" style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Try StaffAi Yourself. No Demo Required.</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px' }}>
            Activate Launch Tier and see how an AI Revenue Workforce behaves with real prospects.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Widget + text conversations</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Appointments</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Voice minutes</div>
          </div>
          <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'var(--accent-color)', border: 'none', color: '#ffffff', fontWeight: '700' }}>
            Free Forever
          </Link>
        </div>
      </section>

      {/* SECTION: FINAL CLOSE */}
      <section className="container animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '4.5rem', fontWeight: '800', letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          StaffAi Is Not Software.
        </h2>
        <p style={{ fontSize: '2rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          StaffAi is your AI Revenue Workforce.
        </p>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '500', marginBottom: '3rem' }}>
          Join the Workforce Revolution.
        </p>
        <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', fontWeight: '800' }}>
          Start Free Forever
        </Link>
      </section>

    </div>
  );
}
