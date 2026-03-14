import Header from '@/components/Header';
import Link from 'next/link';

export default function Compliance() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', paddingBottom: '8rem' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Legal & Compliance.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 4rem auto', lineHeight: '1.6' }}>
            To operate effectively, StaffAi strictly enforces compliance with all local telecommunication laws. Use of our service requires full adherence to these policies.
          </p>
        </section>

        <section className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div id="privacy" className="glass-panel-vip animate-fade-in-up delay-100" style={{ padding: '3rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>1. Privacy Policy</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Data retention: StaffAi retains lead conversation histories, metadata, and unified transcripts for the duration of the account lifecycle to enable LLM context retrieval. At account termination, data can be permanently destroyed.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Third parties: We do not sell prospect data to third-party marketing services. It is strictly utilized within the client's siloed environment.
            </p>
          </div>

          <div id="terms" className="glass-panel-vip animate-fade-in-up delay-200" style={{ padding: '3rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>2. Terms of Service</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Liability boundaries: StaffAi provides software acting as an autonomous agent. The business initiating the agent is solely responsible for determining the compliance of outbound campaigns and responding to opt-outs correctly. 
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Platform uptime: We guarantee 99.9% uptime for the core LLM routing layer. Telnyx carrier delivery rates are subject to standard telecom conditions.
            </p>
          </div>

          <div id="acceptable" className="glass-panel-vip animate-fade-in-up delay-300" style={{ padding: '3rem', marginBottom: '2rem', borderLeft: '4px solid #ef4444' }}>
             <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>3. Acceptable Use Policy</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>TCPA Strictly Enforced.</strong> You must have unambiguous, recorded consent before importing a prospect list into the StaffAi system.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Accounts uploading purchased "cold lists" or repeatedly triggering carrier SPAM flags will be suspended immediately without refund. StaffAi is a follow-up and closing engine, not a cold bulk SMS tool.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Our agents are configured to respect "STOP" or "UNSUBSCRIBE" commands instantly. Modification of this fail-safe is a violation of the AUP.
            </p>
          </div>

          <div id="reflex" className="glass-panel-vip animate-fade-in-up delay-400" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>4. Refund & Cancellation Policy</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Monthly subscriptions can be cancelled at any time through the dashboard. The current billing cycle will conclude without prorated refunds.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <strong>Usage / Segments:</strong> There are strict zero refunds for AI SMS segments or Voice minutes consumed, due to the direct API hard costs incurred by the LLM routing and telecom carrier.
            </p>
          </div>

        </section>

      </main>
    </>
  );
}
