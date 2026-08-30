import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Legal & Compliance | StaffAi',
  description: 'Privacy Policy, Terms of Service, Acceptable Use Policy, Cookie Policy, and Disclaimer for StaffAi, a brand of Studio9 LLC.',
};

const NAV = [
  { id: 'privacy',     label: 'Privacy Policy' },
  { id: 'terms',       label: 'Terms of Service' },
  { id: 'acceptable',  label: 'Acceptable Use' },
  { id: 'cookies',     label: 'Cookie Policy' },
  { id: 'disclaimer',  label: 'Disclaimer' },
  { id: 'ip',          label: 'Intellectual Property' },
  { id: 'disputes',    label: 'Disputes' },
  { id: 'refund',      label: 'Refund Policy' },
];

const panelStyle = {
  background: 'var(--white)',
  border: '1px solid var(--line)',
  borderRadius: 20,
  padding: '3rem',
  marginBottom: '2rem',
  scrollMarginTop: 100,
};

const h2Style = {
  fontSize: '1.75rem',
  fontWeight: 800,
  color: 'var(--ink)',
  marginBottom: '1.5rem',
  letterSpacing: '-0.03em',
  fontFamily: 'var(--font-heading)',
};

const h3Style = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--ink)',
  margin: '1.5rem 0 0.6rem',
  fontFamily: 'var(--font-heading)',
};

const pStyle = {
  color: 'var(--ink-55)',
  lineHeight: 1.78,
  marginBottom: '1rem',
  fontSize: '0.93rem',
};

const ulStyle = {
  color: 'var(--ink-55)',
  lineHeight: 1.78,
  paddingLeft: '1.4rem',
  marginBottom: '1rem',
  fontSize: '0.93rem',
};

const strongStyle = { color: 'var(--ink)', fontWeight: 700 };

const alertPanel = {
  ...panelStyle,
  borderLeft: '4px solid var(--navy)',
  background: 'rgba(27,58,107,0.03)',
};

export default function CompliancePage() {
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
            Legal &amp; Compliance
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: 'var(--ink)',
            margin: '0 0 1.25rem',
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-heading)',
          }}>
            Legal Documents
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--ink-55)', maxWidth: 640, margin: '0 auto 0.75rem auto', lineHeight: 1.72 }}>
            These documents govern your use of StaffAi and the services provided by Studio9 LLC. Please read them carefully before incorporating or using the platform.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-35)', marginBottom: '2.5rem' }}>
            Last updated: March 2026. Questions: <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>compliance@getstaffai.com</a>
          </p>
        </section>

        {/* Quick nav */}
        <div style={{ maxWidth: 860, margin: '0 auto 3.5rem', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {NAV.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.4rem 1rem',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1.5px solid var(--line)',
                  color: 'var(--ink-55)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* ─ PRIVACY POLICY ─ */}
          <div id="privacy" style={panelStyle}>
            <h2 style={h2Style}>1. Privacy Policy</h2>
            <p style={pStyle}>
              Studio9 LLC, operating as StaffAi ("we," "us," "our"), is committed to protecting the privacy and security of the personal data entrusted to us by Chief Executive Officers and their organisations ("you," "CEO," "Client"). This Privacy Policy explains how we collect, use, store, and protect personal data in connection with the StaffAi platform and all related services accessible at getstaffai.com.
            </p>

            <h3 style={h3Style}>1.1 Data Controller</h3>
            <p style={pStyle}>
              The data controller responsible for your personal data is: <strong style={strongStyle}>Studio9 LLC</strong>, operating as StaffAi, contactable at <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>compliance@getstaffai.com</a>.
            </p>

            <h3 style={h3Style}>1.2 What Data We Collect</h3>
            <p style={pStyle}>We collect the following categories of personal data:</p>
            <ul style={ulStyle}>
              <li><strong style={strongStyle}>Identity data:</strong> Full name, username, company name, job title.</li>
              <li><strong style={strongStyle}>Contact data:</strong> Email address, phone number, billing address.</li>
              <li><strong style={strongStyle}>Financial data:</strong> Payment card details and billing information processed securely via Stripe. We do not store full card numbers on our servers.</li>
              <li><strong style={strongStyle}>Account and usage data:</strong> Login history, session activity, feature usage, AI employee interactions, Board Reports, Wallet transactions, and activity logs.</li>
              <li><strong style={strongStyle}>Communication data:</strong> Messages exchanged with your Executive Assistant, General Manager, and department staff within the platform.</li>
              <li><strong style={strongStyle}>Technical data:</strong> IP address, browser type and version, device identifiers, operating system, time zone, and referral source.</li>
              <li><strong style={strongStyle}>Business data:</strong> Information you input about your business, company culture, operational preferences, customers, and commercial activities in order to configure and operate the simulation.</li>
            </ul>

            <h3 style={h3Style}>1.3 How We Use Your Data</h3>
            <ul style={ulStyle}>
              <li>To provide, operate, and maintain the StaffAi platform and all associated AI services.</li>
              <li>To process payments, manage billing, and prevent fraud.</li>
              <li>To personalise your Executive Suite, AI employee behaviour, and Board Reports.</li>
              <li>To deliver platform communications: service updates, billing notices, and policy changes.</li>
              <li>To maintain security, detect abuse, and protect the platform from unauthorised access.</li>
              <li>To improve platform performance, reliability, and AI output quality.</li>
              <li>To comply with applicable legal obligations.</li>
            </ul>

            <h3 style={h3Style}>1.4 Legal Basis for Processing (GDPR)</h3>
            <p style={pStyle}>Where applicable, we process your data under the following legal bases:</p>
            <ul style={ulStyle}>
              <li><strong style={strongStyle}>Performance of a contract:</strong> Processing necessary to deliver the services you have subscribed to.</li>
              <li><strong style={strongStyle}>Legitimate interests:</strong> Security monitoring, fraud prevention, and platform improvement.</li>
              <li><strong style={strongStyle}>Legal obligation:</strong> Compliance with applicable laws and regulations.</li>
              <li><strong style={strongStyle}>Consent:</strong> Where we have obtained your explicit consent, such as for marketing communications.</li>
            </ul>

            <h3 style={h3Style}>1.5 CEO Financial Privacy</h3>
            <p style={pStyle}>
              Any personal financial information shared by a CEO with their Executive Assistant for the purpose of configuring Wallet alert thresholds and pre-approved payment parameters is classified as strictly private. This information is accessible only by the EA system and the CEO. No other AI employees, including the General Manager, have access to this data. Studio9 LLC staff may access this data solely for the purpose of resolving a verified billing dispute raised by the CEO.
            </p>

            <h3 style={h3Style}>1.6 Data Sharing and Third Parties</h3>
            <p style={pStyle}>
              We do not sell, rent, or trade your personal data to third parties for marketing purposes. We share data only with:
            </p>
            <ul style={ulStyle}>
              <li><strong style={strongStyle}>Stripe Inc.:</strong> Payment processing and fraud prevention. Governed by Stripe's Privacy Policy.</li>
              <li><strong style={strongStyle}>Infrastructure providers:</strong> Hetzner Online GmbH for server hosting. Data processed within GDPR-compliant environments.</li>
              <li><strong style={strongStyle}>AI model providers:</strong> Where prompts are processed by third-party LLM providers (xAI, OpenAI) at Executive and Prestige levels, only the minimum necessary data is transmitted. Your data is never used to train third-party models. Data processing agreements are in place with all providers.</li>
              <li><strong style={strongStyle}>Legal and regulatory authorities:</strong> Where required by law, court order, or to protect our legal rights.</li>
            </ul>
            <p style={pStyle}>
              <strong style={strongStyle}>Your business data is never used to train any AI model.</strong> This is an absolute, non-negotiable commitment.
            </p>

            <h3 style={h3Style}>1.7 Data Retention</h3>
            <p style={pStyle}>
              We retain your personal and account data for the duration of your active subscription and for a period of 30 days following account closure or dissolution, during which reactivation is possible without data loss. After 30 days, personal data is deleted or anonymised unless we are required to retain it by law (such as financial records, which are retained for seven years in accordance with applicable tax regulations).
            </p>

            <h3 style={h3Style}>1.8 Your Rights</h3>
            <p style={pStyle}>Depending on your jurisdiction, you may have the right to:</p>
            <ul style={ulStyle}>
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate or incomplete personal data.</li>
              <li>Request deletion of your personal data ("right to be forgotten").</li>
              <li>Restrict or object to certain processing activities.</li>
              <li>Request portability of your data in a structured, machine-readable format.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p style={pStyle}>
              To exercise any of these rights, contact us at <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>compliance@getstaffai.com</a>. We will respond within 30 days.
            </p>

            <h3 style={h3Style}>1.9 Security</h3>
            <p style={pStyle}>
              We implement financial-grade security measures including encryption in transit (TLS), encryption at rest, role-based access controls, regular security audits, and isolated data environments per CEO organisation. No method of transmission or storage is completely secure, but we maintain industry-leading standards appropriate to the sensitivity of the data we process.
            </p>

            <h3 style={h3Style}>1.10 Children's Privacy</h3>
            <p style={pStyle}>
              StaffAi is a business platform intended for use by individuals aged 18 years or older. We do not knowingly collect personal data from individuals under 18. If you believe a minor has provided data to us, contact us at compliance@getstaffai.com and we will delete it promptly.
            </p>
          </div>

          {/* ─ TERMS OF SERVICE ─ */}
          <div id="terms" style={panelStyle}>
            <h2 style={h2Style}>2. Terms of Service</h2>
            <p style={pStyle}>
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("CEO," "Client," "you") and <strong style={strongStyle}>Studio9 LLC</strong>, a limited liability company organised under the laws of the State of New Mexico, United States, operating the StaffAi platform under the brand name StaffAi at getstaffai.com ("Studio9 LLC," "StaffAi," "we," "us"). By accessing or using the StaffAi platform, creating an account, or completing any purchase, you confirm that you have read, understood, and agreed to be bound by these Terms in full.
            </p>
            <p style={pStyle}>
              If you do not agree to these Terms, you may not access or use the platform.
            </p>

            <h3 style={h3Style}>2.1 Service Description</h3>
            <p style={pStyle}>
              StaffAi is an AI-powered business simulation platform that provides CEOs with a fully simulated, fully operational organisation staffed by named artificial intelligence employees with distinct personalities, roles, and performance records. Services include, but are not limited to: an Executive Assistant, a General Manager, department employees across Administration, Marketing, Customer Service, Sales, and Tech Support, a weekly Board Report, team meeting simulations, employee performance management, and the Wallet, a secure internal financial instrument.
            </p>
            <p style={pStyle}>
              All AI employees and outputs are powered by artificial intelligence language models. Outputs are not the work of human employees and do not constitute professional advice. See Section 2.9 (AI Disclaimer) below.
            </p>

            <h3 style={h3Style}>2.2 Account Eligibility and Registration</h3>
            <p style={pStyle}>
              You must be at least 18 years of age and have the legal authority to enter into binding contracts to use StaffAi. By creating an account, you represent and warrant that all information you provide is accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
            </p>

            <h3 style={h3Style}>2.3 Subscriptions, Billing, and Payment</h3>
            <p style={pStyle}>
              StaffAi operates on a subscription model. Access Fees are billed in advance on a monthly or annual cycle from the date of incorporation. Seat Fees for additional AI employees and applicable usage-based charges (Operational Activity Billing, Creative Production Costs, Voice Minutes) are billed as incurred, detailed on your invoice.
            </p>
            <p style={pStyle}>
              All payments are processed by Stripe Inc. By providing payment information, you authorise Studio9 LLC to charge all fees to your payment method. You agree that by completing any purchase, you have received and accepted our Refund Policy (Section 6) and understand that payments are generally non-refundable.
            </p>
            <p style={pStyle}>
              <strong style={strongStyle}>Service Commencement:</strong> Service is deemed to have commenced upon account activation, payment processing, or access to any platform feature, whichever occurs first.
            </p>

            <h3 style={h3Style}>2.4 Cancellation and Account Termination</h3>
            <p style={pStyle}>
              You may cancel your subscription at any time through your client portal. Cancellation takes effect at the end of your current billing period. Access continues through the paid period. No refunds or prorations are issued for unused time. See Section 6 (Refund Policy) for full details.
            </p>
            <p style={pStyle}>
              Studio9 LLC may suspend or terminate your account immediately and without prior notice if you breach these Terms, engage in prohibited use, fail to pay any amount due, or engage in conduct that we determine, in our sole discretion, is harmful to other users or to the platform.
            </p>

            <h3 style={h3Style}>2.5 Dissolution and Data Retention Window</h3>
            <p style={pStyle}>
              Upon account closure ("Dissolution"), all account data is retained for 30 days at no additional charge, during which you may reactivate and resume service without data loss. After 30 days, data is permanently deleted and cannot be recovered. A tiered archive fee applies for retention beyond 30 days upon request.
            </p>

            <h3 style={h3Style}>2.6 Acceptable Use</h3>
            <p style={pStyle}>
              You agree to use StaffAi solely for lawful business purposes and in accordance with these Terms and our Acceptable Use Policy (Section 3). You must not use StaffAi or its AI employees to:
            </p>
            <ul style={ulStyle}>
              <li>Engage in any activity that violates applicable laws or regulations.</li>
              <li>Harass, threaten, or harm any individual or organisation.</li>
              <li>Generate, distribute, or store content that is defamatory, fraudulent, obscene, or otherwise objectionable.</li>
              <li>Attempt to reverse-engineer, decompile, or extract proprietary AI models or routing architecture.</li>
              <li>Circumvent or attempt to circumvent any platform security measures.</li>
              <li>Use the platform in a manner that places excessive or unreasonable load on the infrastructure.</li>
            </ul>

            <h3 style={h3Style}>2.7 Wallet Terms</h3>
            <p style={pStyle}>
              The Wallet is a secure internal financial instrument within the StaffAi platform. The Wallet is used solely for business-related payments pre-approved by the CEO. The Wallet is never connected to your personal bank accounts. All Wallet transactions require explicit CEO pre-approval. Studio9 LLC is not a regulated financial institution and the Wallet does not constitute a bank account, payment account, or deposit account under any financial services regulation.
            </p>

            <h3 style={h3Style}>2.8 Payment Disputes and Chargebacks</h3>
            <p style={pStyle}>
              <strong style={strongStyle}>Before initiating any chargeback, payment reversal, or dispute with your bank, card issuer, or payment processor, you are required to contact Studio9 LLC at <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)' }}>compliance@getstaffai.com</a> and allow a minimum of five (5) business days for investigation and resolution.</strong>
            </p>
            <p style={pStyle}>
              Studio9 LLC maintains comprehensive records for every account, including: access logs with timestamps, billing records, usage metrics, AI interaction histories, feature access records, and all communications. This documentation constitutes evidence that service was provided and may be submitted in full to your financial institution to contest any dispute.
            </p>
            <p style={pStyle}>
              Initiating a chargeback or payment dispute without first following the mandatory dispute resolution process set out in these Terms constitutes a material breach of this Agreement. In such cases, Studio9 LLC reserves the right to:
            </p>
            <ul style={ulStyle}>
              <li>Suspend or permanently terminate your account and all associated access immediately.</li>
              <li>Submit all available account evidence, usage logs, billing records, and communications to the relevant financial institution to contest the dispute in full.</li>
              <li>Pursue recovery of the disputed amount plus any chargeback fees imposed on Studio9 LLC by the payment processor.</li>
              <li>Report the account to fraud prevention databases where warranted.</li>
            </ul>
            <p style={pStyle}>
              Studio9 LLC's Refund Policy is incorporated by reference into these Terms and is available in full at <Link href="/refund-policy" style={{ color: 'var(--navy)', fontWeight: 600 }}>/refund-policy</Link> and in Section 6 of this document.
            </p>

            <h3 style={h3Style}>2.9 AI-Generated Content Disclaimer</h3>
            <p style={pStyle}>
              All content, communications, recommendations, documents, proposals, reports, responses, and outputs generated by StaffAi employees and agents are produced by artificial intelligence systems. They are provided for informational and operational purposes only. They do not constitute professional advice of any kind, including but not limited to:
            </p>
            <ul style={ulStyle}>
              <li>Legal advice or legal representation.</li>
              <li>Financial, investment, or accounting advice.</li>
              <li>Medical or health advice.</li>
              <li>Regulatory or compliance advice specific to your jurisdiction or industry.</li>
              <li>Tax advice of any kind.</li>
            </ul>
            <p style={pStyle}>
              Studio9 LLC makes no warranty, express or implied, regarding the accuracy, completeness, fitness for purpose, or commercial applicability of any AI-generated output. Results, including but not limited to sales conversions, marketing performance, customer satisfaction outcomes, and technical resolutions, may vary based on factors outside our control, including market conditions, audience behaviour, platform algorithm changes, and your specific configuration and use of the service.
            </p>
            <p style={pStyle}>
              You are solely responsible for reviewing AI-generated outputs before acting on them, for any decisions made based on AI outputs, and for ensuring that your use of AI-generated content complies with applicable laws and regulations in your jurisdiction.
            </p>

            <h3 style={h3Style}>2.10 Limitation of Liability</h3>
            <p style={{ ...pStyle, textTransform: 'uppercase', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-80)' }}>
              To the maximum extent permitted by applicable law, Studio9 LLC and its officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to: loss of profits, loss of revenue, loss of data, loss of goodwill, loss of business opportunities, or business interruption, arising out of or in connection with your use of or inability to use the service, regardless of whether Studio9 LLC was advised of the possibility of such damages.
            </p>
            <p style={pStyle}>
              In no event shall Studio9 LLC's total aggregate liability to you for all claims arising out of or related to these Terms or the service exceed the total amount of fees paid by you to Studio9 LLC in the three (3) calendar months immediately preceding the event giving rise to the claim.
            </p>
            <p style={pStyle}>
              Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
            </p>

            <h3 style={h3Style}>2.11 Indemnification</h3>
            <p style={pStyle}>
              You agree to indemnify, defend, and hold harmless Studio9 LLC and its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to: (a) your use of the service; (b) your violation of these Terms; (c) your violation of any applicable law or regulation; (d) any content or instructions you provide to AI employees; or (e) any third-party claim arising from your use of AI-generated outputs.
            </p>

            <h3 style={h3Style}>2.12 Dispute Resolution</h3>
            <p style={pStyle}>
              In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the service, the parties agree to first attempt resolution through good-faith negotiation. Written notice of the dispute must be sent to <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>compliance@getstaffai.com</a>. If the dispute is not resolved within 30 days of such notice, either party may pursue resolution through binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules. Arbitration shall be conducted in the State of New Mexico.
            </p>
            <p style={pStyle}>
              <strong style={strongStyle}>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not as a class, consolidated, or representative action. You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>

            <h3 style={h3Style}>2.13 Governing Law</h3>
            <p style={pStyle}>
              These Terms and all matters arising out of or relating to them shall be governed by and construed in accordance with the laws of the State of New Mexico, United States, without regard to its conflict of law principles.
            </p>

            <h3 style={h3Style}>2.14 Changes to These Terms</h3>
            <p style={pStyle}>
              Studio9 LLC reserves the right to modify these Terms at any time. When we make changes, we will update the "Last updated" date at the top of this page and, for material changes, notify you by email to your registered address. Continued use of the platform after the effective date of any changes constitutes your acceptance of the revised Terms.
            </p>
          </div>

          {/* ─ ACCEPTABLE USE POLICY ─ */}
          <div id="acceptable" style={{ ...panelStyle, borderLeft: '4px solid #ef4444' }}>
            <h2 style={h2Style}>3. Acceptable Use Policy</h2>
            <p style={pStyle}>
              This Acceptable Use Policy ("AUP") governs the use of all services, tools, features, and AI employees provided by Studio9 LLC through the StaffAi platform. Violation of this AUP constitutes a breach of the Terms of Service and may result in immediate account suspension without refund.
            </p>

            <h3 style={h3Style}>3.1 Permitted Uses</h3>
            <p style={pStyle}>StaffAi may be used solely for:</p>
            <ul style={ulStyle}>
              <li>Legitimate business operations within your own company or organisation.</li>
              <li>Managing business workflows, communications, marketing, sales, customer service, and technical support within the scope of your active Intelligence Level and recruited AI employees.</li>
              <li>Authorised outreach to your own customers, prospects, and business contacts who have given consent to be contacted.</li>
            </ul>

            <h3 style={h3Style}>3.2 Prohibited Uses</h3>
            <p style={pStyle}>You may not use StaffAi or direct AI employees to:</p>
            <ul style={ulStyle}>
              <li>Conduct unsolicited bulk outreach, spam, or cold contact campaigns without verified recipient consent.</li>
              <li>Harass, threaten, intimidate, or engage in abusive communication with any individual.</li>
              <li>Generate or distribute defamatory, fraudulent, deceptive, obscene, or illegal content.</li>
              <li>Impersonate any individual, business, or entity in a manner that is misleading or harmful.</li>
              <li>Violate any applicable anti-spam law, including but not limited to the CAN-SPAM Act, CASL, or GDPR.</li>
              <li>Upload or process data belonging to individuals who have not consented to such processing.</li>
              <li>Attempt to reverse-engineer, copy, extract, or reproduce StaffAi's AI models, routing architecture, or proprietary systems.</li>
              <li>Use the platform to conduct any illegal activity or to facilitate any third party in conducting illegal activity.</li>
              <li>Use AI employees to generate content that violates any third party's intellectual property rights.</li>
              <li>Attempt to manipulate or circumvent the Wallet security controls.</li>
              <li>Resell, sublicense, or provide access to the platform to third parties without explicit written authorisation from Studio9 LLC.</li>
            </ul>

            <h3 style={h3Style}>3.3 AI Output Responsibility</h3>
            <p style={pStyle}>
              You are solely responsible for reviewing all AI-generated content before it is used, published, sent, or acted upon. You are responsible for ensuring that AI employee outputs comply with all applicable laws in your jurisdiction, including but not limited to advertising standards, financial promotion rules, data protection regulations, and employment law.
            </p>

            <h3 style={h3Style}>3.4 Enforcement</h3>
            <p style={pStyle}>
              Studio9 LLC reserves the right to investigate any suspected AUP violation and to take any action we deem appropriate, including immediate account suspension or termination without refund, removal of content, and reporting to law enforcement authorities. We are not obligated to provide prior notice before taking enforcement action where the breach poses a risk to the platform, other users, or third parties.
            </p>
          </div>

          {/* ─ COOKIE POLICY ─ */}
          <div id="cookies" style={panelStyle}>
            <h2 style={h2Style}>4. Cookie Policy</h2>
            <p style={pStyle}>
              Studio9 LLC uses cookies and similar tracking technologies on getstaffai.com to provide, operate, and improve the StaffAi platform and website.
            </p>

            <h3 style={h3Style}>4.1 What Are Cookies</h3>
            <p style={pStyle}>
              Cookies are small text files stored on your device by your browser when you visit a website. They allow websites to remember your preferences, maintain sessions, and analyse usage patterns.
            </p>

            <h3 style={h3Style}>4.2 Cookies We Use</h3>
            <ul style={ulStyle}>
              <li><strong style={strongStyle}>Strictly necessary cookies:</strong> Required for the platform to function. These include authentication tokens, session identifiers, and security cookies. These cannot be disabled without breaking the service.</li>
              <li><strong style={strongStyle}>Functional cookies:</strong> Remember your preferences such as language, theme, and session state within the Executive Suite.</li>
              <li><strong style={strongStyle}>Analytics cookies:</strong> We use self-hosted Plausible or Umami analytics (privacy-preserving, no personal data transmitted to third parties) to understand how users interact with the platform and improve it. No advertising cookies are used.</li>
              <li><strong style={strongStyle}>Payment cookies:</strong> Stripe may set cookies for fraud prevention and payment processing purposes. These are governed by Stripe's Cookie Policy.</li>
            </ul>

            <h3 style={h3Style}>4.3 Managing Cookies</h3>
            <p style={pStyle}>
              You can control cookies through your browser settings. Disabling strictly necessary cookies will prevent you from using the platform. To opt out of analytics cookies, you may use browser extensions such as uBlock Origin or enable the Do Not Track signal in your browser. Our analytics tools respect the Do Not Track signal.
            </p>

            <h3 style={h3Style}>4.4 Third-Party Cookies</h3>
            <p style={pStyle}>
              We do not use third-party advertising cookies, tracking pixels, or social media cookies. We do not allow third-party advertisers to set cookies on our platform.
            </p>
          </div>

          {/* ─ DISCLAIMER ─ */}
          <div id="disclaimer" style={panelStyle}>
            <h2 style={h2Style}>5. Disclaimer</h2>

            <h3 style={h3Style}>5.1 "As Is" Service</h3>
            <p style={pStyle}>
              The StaffAi platform and all services are provided "as is" and "as available" without warranty of any kind, express or implied. Studio9 LLC expressly disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and any warranties arising from course of dealing or usage of trade.
            </p>
            <p style={pStyle}>
              We do not warrant that the service will be uninterrupted, error-free, secure, or free from viruses or other harmful components. We do not warrant that any AI-generated output will be accurate, complete, timely, or suitable for your specific use case.
            </p>

            <h3 style={h3Style}>5.2 Performance Disclaimer</h3>
            <p style={pStyle}>
              Key Performance Indicators (KPIs) and performance benchmarks published on the StaffAi platform, website, and in Board Reports represent targets and aspirational standards for AI employees at each Intelligence Level and grade. They do not constitute guarantees of specific outcomes. Actual results will vary based on your industry, market, customer behaviour, content quality, competitive environment, and other factors outside our control.
            </p>

            <h3 style={h3Style}>5.3 No Professional Advice</h3>
            <p style={pStyle}>
              Nothing generated by StaffAi employees or present on getstaffai.com constitutes legal, financial, tax, investment, medical, regulatory, or any other form of professional advice. Any information that appears to constitute such advice is informational only. You should always seek qualified professional counsel before making decisions of a legal, financial, medical, or regulatory nature.
            </p>

            <h3 style={h3Style}>5.4 Third-Party Integrations</h3>
            <p style={pStyle}>
              StaffAi integrates with or provides access to third-party tools and platforms including but not limited to Google Workspace, WhatsApp Business, social media platforms, CRM tools, and email marketing services. Studio9 LLC is not responsible for the availability, performance, content, policies, or data practices of any third-party platform. Your use of third-party integrations is governed by the respective terms and policies of those third parties.
            </p>

            <h3 style={h3Style}>5.5 Force Majeure</h3>
            <p style={pStyle}>
              Studio9 LLC shall not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including but not limited to: acts of God, natural disasters, pandemic, war, terrorism, government action, telecommunications failures, third-party platform outages (including cloud providers, LLM API providers, or payment processors), or cyberattacks.
            </p>
          </div>

          {/* ─ INTELLECTUAL PROPERTY ─ */}
          <div id="ip" style={panelStyle}>
            <h2 style={h2Style}>6. Intellectual Property</h2>

            <h3 style={h3Style}>6.1 Studio9 LLC Ownership</h3>
            <p style={pStyle}>
              All elements of the StaffAi platform, including but not limited to: the brand, trade name, logo, website design, user interface, source code, AI employee names, personalities, and profiles, the StaffAI Institute concept, the simulation architecture, corporate language system, Board Report formats, and all proprietary content are the exclusive intellectual property of Studio9 LLC. These are protected by copyright, trademark, and other applicable intellectual property laws. You may not copy, reproduce, modify, distribute, transmit, or create derivative works from any StaffAi intellectual property without prior written consent.
            </p>

            <h3 style={h3Style}>6.2 Your Content</h3>
            <p style={pStyle}>
              You retain ownership of all business data, content, instructions, and information you input into the StaffAi platform ("Your Content"). By using the platform, you grant Studio9 LLC a limited, non-exclusive licence to use Your Content solely for the purpose of operating and delivering the services to you. This licence does not extend to using Your Content for AI model training, marketing, or any purpose beyond direct service delivery.
            </p>

            <h3 style={h3Style}>6.3 AI-Generated Outputs</h3>
            <p style={pStyle}>
              Content generated by StaffAi employees in the course of service delivery is produced for your business use. You are responsible for any use of such outputs, for ensuring they do not infringe third-party intellectual property rights, and for any legal or regulatory compliance obligations attached to the use of such outputs in your jurisdiction.
            </p>

            <h3 style={h3Style}>6.4 Feedback</h3>
            <p style={pStyle}>
              If you submit feedback, suggestions, or ideas regarding the platform, you grant Studio9 LLC a royalty-free, irrevocable, perpetual licence to use, develop, and implement such feedback without restriction and without any obligation to you.
            </p>
          </div>

          {/* ─ DISPUTES & CONTACT ─ */}
          <div id="disputes" style={{ ...panelStyle, borderLeft: '4px solid var(--navy)' }}>
            <h2 style={h2Style}>7. Billing Disputes and Contact</h2>
            <p style={pStyle}>
              If you believe there has been a billing error or have a question about any charge on your account, you must contact Studio9 LLC before initiating any dispute with your financial institution. This is a condition of your continued use of the service.
            </p>
            <div style={{
              background: 'rgba(27,58,107,0.05)',
              border: '1px solid rgba(27,58,107,0.15)',
              borderRadius: 12,
              padding: '1.5rem',
              margin: '1.5rem 0',
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.88rem' }}>Dispute Resolution Contact</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-55)', lineHeight: 1.7 }}>
                Studio9 LLC — StaffAi Compliance<br />
                Email: <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 700 }}>compliance@getstaffai.com</a><br />
                Response time: 3–5 business days (required before escalation)
              </div>
            </div>
            <p style={pStyle}>
              We will investigate all billing queries thoroughly and respond within five (5) business days. If we determine that an error occurred, we will issue a correction promptly. If you are not satisfied with our resolution, you may then escalate to your financial institution, at which point we will provide full account documentation to support the resolution.
            </p>
            <p style={pStyle}>
              For all other legal, compliance, or policy enquiries, contact us at the same address. For billing account questions specifically, contact <a href="mailto:accounts@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>accounts@getstaffai.com</a>.
            </p>
          </div>

          {/* ─ REFUND POLICY REFERENCE ─ */}
          <div id="refund" style={panelStyle}>
            <h2 style={h2Style}>8. Refund and Cancellation Policy</h2>
            <p style={pStyle}>
              StaffAi provides access to AI-powered systems, simulation infrastructure, and recurring business services. All payments are generally non-refundable once processed or once service has commenced. A summary of key provisions is set out below. The full policy governs and is available at the link below.
            </p>
            <ul style={ulStyle}>
              <li><strong style={strongStyle}>Monthly subscriptions:</strong> Billed in advance. No refunds or prorations for partial months. Access continues through end of paid period.</li>
              <li><strong style={strongStyle}>Annual subscriptions:</strong> Billed in full in advance. Non-refundable once billed or renewed. No prorated refunds for unused time.</li>
              <li><strong style={strongStyle}>Seat Fees:</strong> Non-refundable once an employee has been recruited and training has commenced.</li>
              <li><strong style={strongStyle}>Setup and onboarding:</strong> Non-refundable once commenced.</li>
              <li><strong style={strongStyle}>Credits and add-ons:</strong> Non-refundable once delivered or activated.</li>
              <li><strong style={strongStyle}>Cancellation responsibility:</strong> You are responsible for cancelling prior to your renewal date. Studio9 LLC does not issue refunds for charges resulting from failure to cancel in time.</li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/refund-policy" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--navy)',
                fontWeight: 700,
                fontSize: '0.95rem',
                fontFamily: 'var(--font-heading)',
                textDecoration: 'none',
              }}>
                Read the full Refund Policy →
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--ink-35)', lineHeight: 1.65, marginTop: '1rem', paddingBottom: '2rem' }}>
            These documents govern all services provided by <strong style={{ color: 'var(--ink-55)' }}>Studio9 LLC</strong> operating as StaffAi.<br />
            Registered in the State of New Mexico, United States.<br />
            All enquiries: <a href="mailto:compliance@getstaffai.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>compliance@getstaffai.com</a>
          </p>

        </div>
      </main>
    </>
  );
}
