import Link from 'next/link';

export default function Hero() {
  return (
    <section className="section hero-section flex-center" style={{ minHeight: '85vh', paddingTop: '6rem' }}>
      
      {/* Animated Glowing Orbs Background */}
      <div className="orb-glow orb-blue" style={{ top: '15%', left: '15%', width: '500px', height: '500px' }}></div>
      <div className="orb-glow orb-purple" style={{ top: '40%', right: '15%', width: '400px', height: '400px', animationDelay: '2s' }}></div>

      <div className="container hero-content animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        
        <div className="hero-text-area">
          <h1 className="hero-title animate-fade-in-up delay-100" style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '1.05', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Deploy Your AI <br/>
            <span className="text-gradient-vibrant">Revenue Workforce.</span>
          </h1>
          
          <p className="hero-subtitle animate-fade-in-up delay-200" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', fontWeight: '400', lineHeight: '1.6' }}>
            Lead generation, nurturing, appointment booking, and closing. Fully automated. Text-first with voice escalation when it matters.
          </p>
          
          <div className="flex justify-center gap-1.5 animate-fade-in-up delay-200" style={{ marginBottom: '4rem' }}>
            <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
              Start Free Forever
            </Link>
            <Link href="/pricing" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1rem', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
              View Pricing
            </Link>
          </div>
          
          <div className="trust-bar animate-fade-in-up delay-400" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: `1px solid var(--border-light)` }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Text-first revenue architecture</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Follow-up that does not stop</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Human escalation option</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Built on real-world sales systems</span>
          </div>
        </div>
        
        {/* Floating Glassmorphism UI Visualizer */}
        <div className="hero-visualizer glass-panel-vip animate-fade-in-up delay-500 animate-float-slow" style={{ padding: '2rem', position: 'relative' }}>
          
          <div className="activity-card glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div className="pulse-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-secondary)', boxShadow: '0 0 10px var(--accent-secondary)' }}></div>
            <span style={{ flex: 1, color: 'var(--text-primary)' }}>Lead Gen Agent: Capturing...</span>
            <span className="time" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Just now</span>
          </div>
          
          <div className="activity-card glass-panel" style={{ opacity: 0.9, transform: 'translateX(10px)', padding: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div className="pulse-dot active" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-color)', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ flex: 1, color: 'var(--text-primary)' }}>Appointment Setter: Qualifying...</span>
            <span className="time" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>12s ago</span>
          </div>
          
          <div className="activity-card glass-panel" style={{ opacity: 0.8, transform: 'translateX(20px)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div className="pulse-dot success" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
            <span style={{ flex: 1, color: 'var(--text-primary)' }}>Closing Agent: Meeting booked.</span>
            <span className="time" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>1m ago</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
