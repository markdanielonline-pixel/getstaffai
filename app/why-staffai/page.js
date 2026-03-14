import Header from '@/components/Header';
import Link from 'next/link';

export default function WhyStaffAi() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            We Do Not Sell Software.<br/><span className="text-gradient-vibrant">We Deploy Workforces.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
            The difference between a tool and an agent is execution. You don't need another dashboard. You need the work done.
          </p>
        </section>

        <section className="container" style={{ marginBottom: '8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
          
          <div className="glass-panel-vip animate-fade-in-up delay-100" style={{ padding: '3.5rem', borderTop: '2px solid rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>The Tool Trap</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Most SaaS requires you to log in, configure settings, click buttons, and stare at analytics. It's a tool waiting for an operator. If you get busy, the tool stops working.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7' }}>
              Every time a human gets busy, leads go cold. Every time a lead goes cold, revenue leaks.
            </p>
          </div>

          <div className="glass-panel-vip animate-fade-in-up delay-200" style={{ padding: '3.5rem', borderTop: '2px solid var(--accent-color)' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>The Agent Advantage</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              StaffAi agents operate independently. They don't need you to push "send". They capture, qualify, book, and close on their own. 
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.7', fontWeight: 'bold' }}>
              We don't sell you a shovel. We bring the excavation crew.
            </p>
          </div>

        </section>

        <section className="container" style={{ marginBottom: '8rem', maxWidth: '900px' }}>
          <h2 style={{ fontSize: '3rem', textAlign: 'center', color: 'var(--text-primary)', marginBottom: '4rem' }}>Core Philosophy</h2>
          
          <div className="glass-panel-vip animate-fade-in-up delay-300" style={{ padding: '4rem', textAlign: 'center', background: 'rgba(59,130,246,0.05)', marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '1rem', fontStyle: 'italic' }}>Volume without decay.</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
              Humans are incredible at relationship building, but they fail at scale. An AI Revenue Workforce maintains 100% urgency, 100% accuracy, and 100% conversion behavior whether it is handling 10 leads or 10,000 leads.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div className="glass-panel-vip" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Speed is revenue.</h4>
              <p style={{ color: 'var(--text-secondary)' }}>The first to respond wins the deal.</p>
            </div>
            <div className="glass-panel-vip" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Conversation is conversion.</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Interactive dialogue beats static landing pages.</p>
            </div>
            <div className="glass-panel-vip" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Automation must feel human.</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Robotic texts get ignored. We optimize for natural cadence.</p>
            </div>
          </div>
        </section>

        <section className="container text-center" style={{ paddingBottom: '8rem' }}>
          <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: '800' }}>
            Deploy Your Workforce
          </Link>
        </section>

      </main>
    </>
  );
}
