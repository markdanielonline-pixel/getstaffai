import Header from '@/components/Header';
import Link from 'next/link';

export default function QA() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', paddingBottom: '8rem' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Questions & Answers.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 4rem auto', lineHeight: '1.6' }}>
            How the AI Revenue Workforce operates.
          </p>
        </section>

        <section className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-panel-vip animate-fade-in-up delay-100" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Is this just a ChatGPT wrapper?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                No. It's an engineered agent architecture with strict guardrails. We don't just pass your leads to an LLM; we route them through deterministic workflows, safety checks, logic branches, and customized prompting environments so they stay strictly on task.
              </p>
            </div>

            <div className="glass-panel-vip animate-fade-in-up delay-200" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>How does it connect to my current CRM?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                StaffAi integrates via outbound webhooks, secure REST APIs, and middleware like Zapier and Make.com. If your CRM has an open API, StaffAi can securely push and pull data from it perfectly.
              </p>
            </div>

            <div className="glass-panel-vip animate-fade-in-up delay-300" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>How human does it sound?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Extremely human. We use latency buffers (it doesn't reply instantly if a human wouldn't), natural conversational phrasing, typo simulation (optional), and contextual understanding to make interactions seamless.
              </p>
            </div>

            <div className="glass-panel-vip animate-fade-in-up delay-400" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Can it actually close?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Yes. The Closing Agent is trained to handle common industry objections, build value, request commitments, and securely send booking links or Stripe payment links directly natively in the text thread.
              </p>
            </div>

            <div className="glass-panel-vip animate-fade-in-up delay-500" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>What if it gets confused?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                If a completely unexpected or sensitive situation arises, the agent has strict instructions to pause the automation, tag the conversational thread, and instantly trigger a human escalation workflow. You never lose control.
              </p>
            </div>

          </div>
        </section>

        <section className="container text-center" style={{ marginTop: '5rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>Still have questions?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <Link href="/contact" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderColor: 'var(--border-light)' }}>
              Contact Sales
            </Link>
            <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'var(--accent-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}>
              Start Free Forever
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
