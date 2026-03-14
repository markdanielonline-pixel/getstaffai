import Link from 'next/link';

export default function Pricing() {
  return (
    <section id="pricing" className="section container" style={{ paddingTop: '8rem', paddingBottom: '8rem', position: 'relative' }}>
      
      {/* Background Glow */}
      <div className="orb-glow orb-purple" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', opacity: '0.15' }}></div>

      <div className="section-header animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
          Pricing for Your AI <span className="text-gradient-vibrant">Revenue Workforce</span>
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Replace three revenue roles for less than the salary of one. Start free, then scale capability as your volume grows.
        </p>
      </div>

      <div className="animate-fade-in-up delay-100" style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
        <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', borderRadius: '100px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(139,92,246,0.5)', display: 'inline-block', boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}>
          <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Every tier is a capability unlock, not a feature checklist.</span>
        </div>
      </div>

      <div className="pricing-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Launch / Free Tier */}
        <div className="pricing-card glass-panel-vip animate-fade-in-up delay-200 flex flex-col" style={{ padding: '3rem 2.5rem', borderTop: '4px solid var(--accent-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-color)', color: 'var(--text-primary)', fontSize: '0.8rem', padding: '0.4rem 1.2rem', borderBottomLeftRadius: '1rem', fontWeight: 'bold', boxShadow: '-5px 5px 15px rgba(0,0,0,0.3)' }}>
            START HERE
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Launch (Free Forever)</h3>
          <div className="price" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            $0<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/mo</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '3rem' }}>
            Getting started and proving the system with real prospects.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, marginBottom: '2.5rem' }}>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Website widget</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> 2 appointments</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> 50 AI text conversations</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> 10 AI voice minutes</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-color)' }}>✓</span> Email support</li>
          </ul>
          <Link href="/portal/signup" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1.1rem' }}>
            Start Free Forever
          </Link>
        </div>

        {/* Operator Tier */}
        <div className="pricing-card glass-panel-vip animate-fade-in-up delay-300 flex flex-col" style={{ padding: '3rem 2.5rem' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Operator</h3>
          <div className="price" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            $97<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/mo</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '3rem' }}>
            Deploying your first serious revenue operator.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, marginBottom: '2.5rem' }}>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><span style={{ color: 'var(--accent-color)' }}>+</span> Unlimited AI text chat</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> 60 AI voice minutes</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> 500 outreach emails</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> Lead Gen & Appointment Setter</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> Calendar booking</li>
          </ul>
          <Link href="/portal/signup?plan=operator" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1.1rem' }}>
            Activate Operator
          </Link>
        </div>

        {/* Accelerator Tier (Highlighted) */}
        <div className="pricing-card glass-panel-vip animate-fade-in-up delay-400 flex flex-col highlight" style={{ 
          padding: '3rem 2.5rem',
          transform: 'scale(1.05)', 
          zIndex: 20, 
          boxShadow: '0 0 50px rgba(139,92,246,0.4)', 
          borderColor: 'var(--accent-secondary)',
          background: 'linear-gradient(180deg, rgba(30,27,75,0.8) 0%, rgba(15,23,42,0.9) 100%)'
        }}>
          
          <div className="orb-glow orb-purple" style={{ top: '-20%', right: '-20%', width: '150px', height: '150px', filter: 'blur(40px)', opacity: '0.8' }}></div>
          
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)', position: 'relative', zIndex: 2 }}>Accelerator</h3>
          <div className="price" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
            $297<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/mo</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '3rem', position: 'relative', zIndex: 2 }}>
            Expanding your workforce and enabling automated closing.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><span style={{ color: 'var(--accent-secondary)' }}>+</span> The Closer Agent</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> 180 AI voice minutes</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> 2,000 outreach emails</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> Proposal sending</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> Branded URL</li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--text-primary)' }}>✓</span> AI Closer or Human option</li>
          </ul>
          <Link href="/portal/signup?plan=accelerator" className="btn btn-primary btn-pulse" style={{ width: '100%', textAlign: 'center', padding: '1.1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', border: 'none', position: 'relative', zIndex: 2 }}>
            Activate Accelerator
          </Link>
        </div>

      </div>
      
      {/* Higher Tiers Mention */}
      <div className="animate-fade-in-up delay-500" style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-secondary)' }}>
        <p>Enterprise volume? We also offer <strong style={{ color: 'var(--text-primary)' }}>Authority ($497)</strong> and <strong style={{ color: 'var(--text-primary)' }}>Dominance ($997)</strong> tiers for massive scale, custom routing, and deep integrations.</p>
        <Link href="#contact" style={{ color: 'var(--accent-secondary)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block', fontWeight: 'bold' }}>Contact us for Enterprise needs.</Link>
      </div>

    </section>
  );
}
