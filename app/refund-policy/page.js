import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy | StaffAi',
  description: 'Refund and cancellation policy for StaffAi, a brand of Studio9 LLC. All subscription, setup, and service payment terms.',
};

const sections = [
  { id: 'general',      label: 'General Policy' },
  { id: 'monthly',      label: 'Monthly Plans' },
  { id: 'annual',       label: 'Annual Plans' },
  { id: 'seat-fees',    label: 'Seat Fees' },
  { id: 'setup',        label: 'Setup & Onboarding' },
  { id: 'usage',        label: 'Usage & Non-Use' },
  { id: 'addons',       label: 'Add-Ons' },
  { id: 'cancellation', label: 'Cancellation' },
  { id: 'disputes',     label: 'Billing Disputes' },
  { id: 'legal',        label: 'Governing Law' },
];

const panelBase = {
  background: 'var(--white)',
  border: '1px solid var(--line)',
  borderRadius: 20,
  padding: '3rem',
  marginBottom: '2rem',
  scrollMarginTop: 100,
};

const h2 = {
  fontSize: '1.65rem',
  fontWeight: 800,
  color: 'var(--ink)',
  marginBottom: '1.25rem',
  letterSpacing: '-0.03em',
  fontFamily: 'var(--font-heading)',
};

const p = { color: 'var(--ink-55)', lineHeight: 1.78, marginBottom: '1rem', fontSize: '0.93rem' };
const ul = { color: 'var(--ink-55)', lineHeight: 1.78, paddingLeft: '1.4rem', marginBottom: '1rem', fontSize: '0.93rem' };
const strong = { color: 'var(--ink)', fontWeight: 700 };

export default function RefundPolicy() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 100, paddingBottom: '8rem', background: 'var(--white)' }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '4rem 1.5rem 2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(27,58,107,0.07)',
            border: '1px solid rgba(27,58,107,0.15)',
            borderRadius: 999,
            padding: '0.3rem 1rem',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--navy)',
            marginBottom: '1.5rem',
          }}>
            Studio9 LLC · StaffAi
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            color: 'var(--ink)',
            margin: '0 0 1.25rem',
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-heading)',
          }}>
            Refund Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--ink-55)', maxWidth: 680, margin: '0 auto 1rem auto', lineHeight: 1.72 }}>
            StaffAi provides access to AI-powered systems, simulation infrastructure, and recurring business services.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--ink-55)', maxWidth: 620, margin: '0 auto 2rem auto', lineHeight: 1.72 }}>
            Because services are provisioned immediately and involve active infrastructure,{' '}
            <strong style={strong}>all payments are generally non-refundable once billed or once service has begun</strong>,
            except where required by applicable law.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-35)' }}>Last updated: March 2026</p>
        </section>

        {/* Quick nav */}
        <div style={{ maxWidth: 820, margin: '0 auto 3.5rem', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.38rem 1rem',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1.5px solid var(--line)',
                  color: 'var(--ink-55)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Policy sections */}
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 1.5rem' }}>

          <div id="general" style={panelBase}>
            <h2 style={h2}>1. General Policy</h2>
            <ul style={ul}>
              <li>All payments are final once processed by Studio9 LLC.</li>
              <li>No refunds are issued for any active or elapsed billing period.</li>
              <li>Access to the platform, any setup activity, or usage of any feature constitutes service commencement.</li>
              <li>Service commencement occurs upon the earliest of: account activation, payment processing, or access to any platform feature.</li>
              <li>These terms apply to all services provided by Studio9 LLC operating as StaffAi.</li>
            </ul>
          </div>

          <div id="monthly" style={panelBase}>
            <h2 style={h2}>2. Monthly Subscriptions</h2>
            <p style={p}>
              Monthly Intelligence Level Access Fees are billed in advance at the start of each billing cycle. You may cancel at any time from your client portal. Cancellation stops future billing only.
            </p>
            <p style={p}>
              <strong style={strong}>No refunds or prorations are issued for partial months.</strong> Your access and all AI employee services continue through the end of the paid billing period, regardless of the cancellation date within that period.
            </p>
          </div>

          <div id="annual" style={panelBase}>
            <h2 style={h2}>3. Annual Subscriptions</h2>
            <p style={p}>
              Annual Intelligence Level Access Fees are billed in full in advance. The annual plan is presented as an annual employment contract. Cancellation prevents future renewal only and takes effect at the end of the current annual term.
            </p>
            <ul style={ul}>
              <li><strong style={strong}>Non-refundable once billed or renewed.</strong></li>
              <li>No prorated refunds for unused time remaining in the annual term.</li>
              <li>The 2-months-free discount applied on annual plans is not eligible for cash equivalency or conversion to credit.</li>
            </ul>
          </div>

          <div id="seat-fees" style={panelBase}>
            <h2 style={h2}>4. Seat Fees</h2>
            <p style={p}>
              Seat Fees are charged for each AI employee recruited to your organisation. A Seat Fee becomes non-refundable once the employee's company-specific onboarding and training has commenced (typically within 1–2 hours of recruitment).
            </p>
            <p style={p}>
              If you remove an employee from your organisation mid-billing period, no refund or proration is issued for the remainder of that month. The seat closes at the end of the current billing cycle.
            </p>
            <p style={p}>
              <strong style={strong}>Department Head seats (Executive grade, via Elevation):</strong> Elevation Seat Fees are non-refundable once the Elevation is approved by the CEO, as the upgrade involves irreversible profile and system changes.
            </p>
          </div>

          <div id="setup" style={panelBase}>
            <h2 style={h2}>5. Setup and Implementation</h2>
            <p style={p}>
              Any setup, onboarding, or configuration work is non-refundable once commenced. This includes but is not limited to: AI employee configuration, company culture setup, Executive Assistant voice cloning, EA contact channel configuration, Wallet initialisation, booking page setup, and any custom implementation performed on your account. Commencement of the Incorporation Process constitutes commencement of setup.
            </p>
          </div>

          <div id="usage" style={panelBase}>
            <h2 style={h2}>6. Usage and Non-Use</h2>
            <p style={p}>No refunds are issued due to:</p>
            <ul style={ul}>
              <li>Lack of usage, inactivity, or failure to engage with the platform after incorporation.</li>
              <li>Failure to complete the Incorporation Process after payment.</li>
              <li>Change in your business needs, direction, or priorities.</li>
              <li>Dissatisfaction with AI-generated outputs that do not reflect a verified technical failure of the platform.</li>
              <li>Third-party platform changes (social media algorithm updates, API deprecations, carrier restrictions) that affect service delivery.</li>
              <li>Market conditions or competitive factors affecting business outcomes attributable to AI employee activity.</li>
            </ul>
          </div>

          <div id="addons" style={panelBase}>
            <h2 style={h2}>7. Add-Ons, Credits, and Custom Work</h2>
            <p style={p}>
              All additional services, purchased Wallet credits, usage-based charges, and custom work are non-refundable once delivered, activated, or commenced. This includes:
            </p>
            <ul style={ul}>
              <li>Creative Production Costs (AI video and image asset generation).</li>
              <li>Operational Activity Billing overages.</li>
              <li>Voice Minute overages (Receptionist).</li>
              <li>WhatsApp message pass-through costs.</li>
              <li>Vocal GM add-on fees.</li>
              <li>Extended Operations (overtime) charges.</li>
              <li>Memory Preservation Fees following the 30-day retention window.</li>
              <li>Any bespoke configuration, integration work, or custom implementation.</li>
            </ul>
          </div>

          <div id="cancellation" style={panelBase}>
            <h2 style={h2}>8. Cancellation Responsibility</h2>
            <p style={p}>
              You are solely responsible for cancelling your subscription prior to your next billing renewal date to avoid renewal charges. Studio9 LLC does not issue refunds for renewal charges that result from failure to cancel in time, regardless of whether the renewal was inadvertent.
            </p>
            <p style={p}>
              Cancellation can be managed at any time directly from your client portal. You will receive email confirmation upon cancellation. Retain this confirmation for your records.
            </p>
            <p style={p}>
              <strong style={strong}>Dissolution Window:</strong> Upon cancellation, all account data is held for 30 days at no charge. You may reactivate within this window and continue exactly where you left off. After 30 days, data is permanently deleted. A tiered archive fee applies for retention beyond 30 days upon request.
            </p>
          </div>

          <div id="disputes" style={{ ...panelBase, borderLeft: '4px solid var(--navy)' }}>
            <h2 style={h2}>9. Billing Disputes</h2>
            <p style={p}>
              If you believe there has been a billing error, you must contact Studio9 LLC before initiating any chargeback, payment reversal, or dispute with your financial institution or payment processor. Contact us at{' '}
              <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 700 }}>compliance@getstaffai.com</a> with your account details and a description of the issue.
            </p>
            <p style={p}>
              You must allow <strong style={strong}>five (5) business days</strong> for Studio9 LLC to investigate and respond before escalating to your financial institution.
            </p>
            <p style={p}>
              <strong style={strong}>Chargebacks initiated before contacting Studio9 LLC and allowing this response window are considered a material breach of these terms and of the Terms of Service.</strong> Studio9 LLC maintains comprehensive access logs, billing records, usage data, and account activity documentation for all accounts. This evidence will be submitted in full to the relevant financial institution to contest any payment dispute.
            </p>
            <p style={p}>
              Refund requests may be reviewed at our sole discretion in exceptional circumstances (for example, documented technical failures that prevented service delivery entirely) but are not guaranteed outside the express terms of this policy.
            </p>
          </div>

          <div id="legal" style={panelBase}>
            <h2 style={h2}>10. Governing Law</h2>
            <p style={p}>
              This Refund Policy is issued by <strong style={strong}>Studio9 LLC</strong>, operating as StaffAi. Nothing in this policy overrides rights you may have under applicable consumer protection or statutory law in your jurisdiction.
            </p>
            <p style={p}>
              This policy is governed by the laws of the State of New Mexico, United States. Any disputes arising from this policy shall be resolved in accordance with the dispute resolution provisions set out in the StaffAi Terms of Service.
            </p>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
            <p style={{ color: 'var(--ink-55)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Have a billing question? We respond within 3–5 business days.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="mailto:compliance@getstaffai.com"
                className="btn btn-navy"
                style={{ padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.95rem' }}
              >
                Contact Billing
              </a>
              <Link
                href="/compliance"
                className="btn btn-ghost"
                style={{ padding: '0.75rem 2rem', fontWeight: 600, fontSize: '0.95rem' }}
              >
                All Legal Documents
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--ink-35)', marginTop: '3rem', lineHeight: 1.65 }}>
            This policy is issued by <strong style={{ color: 'var(--ink-55)' }}>Studio9 LLC</strong>, the registered company operating StaffAi.<br />
            Registered in the State of New Mexico, United States.
          </p>

        </div>
      </main>
    </>
  );
}
