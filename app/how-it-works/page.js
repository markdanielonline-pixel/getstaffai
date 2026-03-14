import Header from '@/components/Header';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            How StaffAi Deploys Your <br/><span className="text-gradient-vibrant">AI Revenue Workforce</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
            A clear, engineered system designed to capture, nurture, book, and close without human bottlenecks.
          </p>
          <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'var(--accent-color)', color: 'var(--text-primary)', fontWeight: '700' }}>
            Start Free Forever
          </Link>
        </section>

        {/* OVERVIEW */}
        <section className="container" style={{ margin: '4rem auto 8rem auto', maxWidth: '800px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            StaffAi is built around one idea: revenue requires consistent behavior at speed, at scale.
            <br/><span style={{ color: 'var(--text-secondary)' }}>Your workforce executes that behavior 24/7 across the full prospect lifecycle.</span>
          </p>
        </section>

        {/* WORKFORCE LAYERS */}
        <section className="container" style={{ marginBottom: '8rem' }}>
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', color: 'var(--text-primary)' }}>The Workforce Layers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel-vip" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>1) Lead Generation Agent</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>Purpose: capture and initiate conversations immediately.</p>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> responds to website inquiries in seconds</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> qualifies basic intent and details</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> routes the prospect into next steps</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> runs outreach workflows where enabled</li>
              </ul>
            </div>
            
            <div className="glass-panel-vip" style={{ padding: '2.5rem', transform: 'translateY(-15px)', borderTop: '2px solid var(--accent-color)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>2) Appointment Setter Agent</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>Purpose: convert interest into calendar commitments.</p>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> asks the right questions to qualify</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> offers time slots and books appointments</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> confirms, reschedules, and follows up</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> reduces no-shows through reminders</li>
              </ul>
            </div>

            <div className="glass-panel-vip" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>3) Closing Agent</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>Purpose: convert qualified prospects into paid customers.</p>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> persistent follow-up beyond "not now"</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> answers objections with structured logic</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> sends proposals & payment links</li>
                <li><span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>✓</span> escalates to human closer when appropriate</li>
              </ul>
            </div>
          </div>
        </section>

        {/* NURTURE & ESCALATION */}
        <section className="container" style={{ marginBottom: '8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          <div className="glass-panel-vip" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Nurture Engine</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Most money is made in follow-up.</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>StaffAi is designed to keep engaging the prospect through timing windows humans typically miss.</p>
          </div>
          <div className="glass-panel-vip" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Human Escalation & Takeover</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Depending on your plan:</p>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              <li>• Warm escalation to a human closer</li>
              <li>• Full human takeover option</li>
            </ul>
            <p style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Key promise: no lost context. One unified transcript.</p>
          </div>
        </section>

        {/* TEXT FIRST + INTEGRATIONS */}
        <section className="container" style={{ marginBottom: '8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          <div className="glass-panel-vip" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Text-First + Voice Escalation</h2>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Text-first:</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li>• fastest response cycles</li>
              <li>• highest continuity</li>
              <li>• lowest friction</li>
            </ul>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Voice escalation:</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
              <li>• used when escalation improves conversion probability</li>
              <li>• keeps the same context and transcript</li>
            </ul>
          </div>
          
          <div className="glass-panel-vip" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Integrations</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>StaffAi connects to your tools through secure API connections. Common examples:</p>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>• CRM updates, lead records, pipeline stages</li>
              <li>• calendar booking and confirmations</li>
              <li>• proposals and documents</li>
              <li>• Stripe payment links</li>
              <li>• email and SMS follow-ups</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="container text-center" style={{ paddingBottom: '8rem' }}>
          <h2 style={{ fontSize: '3.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Ready to see it in action?</h2>
          <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: '800' }}>
            Start Free Forever
          </Link>
        </section>
      </main>
    </>
  );
}
