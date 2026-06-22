import React from 'react';

export default function Terms() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', animation: 'fadeInUp var(--transition-medium)' }}>
      <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Legal Agreement</span>
      <h1 style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Terms of Service</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '2rem' }}>Last Updated: June 20, 2026 | Contact: legal@caribbeacon.com</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
        <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px', borderLeft: '4px solid var(--color-gold)' }}>
          <h4 style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '0.5rem' }}>IMPORTANT NOTICE</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy)' }}>
            Beacon provides business visibility, trust infrastructure, operational tools, reporting, resources, and growth support. Beacon does not guarantee customers, income, sales, search rankings, approvals, service quality, customer satisfaction, legal compliance, licensing status, insurance status, or business outcomes. Business owners remain responsible for the accuracy of their information, the quality of their services, their legal obligations, and their customer relationships.
          </p>
        </section>

        <section>
          <h3>1. Acceptance of Terms</h3>
          <p>When you access or use Beacon, you agree to follow these Terms and any additional policies referenced on the website. If you do not agree with these Terms, you should not use the platform, create a profile, submit business information, purchase services, or continue using Beacon.</p>
        </section>

        <section>
          <h3>2. Who May Use Beacon</h3>
          <p>Beacon is intended for businesses, customers, visitors, partners, and organizations seeking business information, visibility, trust signals, or business growth services. You must provide accurate information when creating an account, claiming a profile, submitting verification information, posting reviews, or purchasing services. Beacon may refuse, restrict, suspend, or terminate access where information appears inaccurate, misleading, abusive, unlawful, fraudulent, or harmful to the platform or its users.</p>
        </section>

        <section>
          <h3>3. What Beacon Provides</h3>
          <p>Beacon may provide access to: Beacon Profile™, Free Member Plan, Beacon Membership, Beacon Business Command Center™, Beacon Verified™, Beacon Trust Score™, Beacon Home Access Certified™, reviews and ratings, customer management tools, appointments and enquiry tools, marketing, reporting, and resource tools, websites and growth add-ons, other business support services. The exact features available may vary by plan, business type, eligibility, configuration, location, and service availability.</p>
        </section>

        <section>
          <h3>4. Free Member Plan</h3>
          <p>The Free Member Plan allows businesses to create or claim a Beacon Profile™ at no monthly cost. Beacon may change, improve, restrict, or discontinue free features at any time, but will aim to keep the free plan useful for basic business visibility. Free profiles must still follow platform rules, content standards, review policies, and acceptable use requirements.</p>
        </section>

        <section>
          <h3>5. Beacon Membership</h3>
          <p>Beacon Membership provides access to the Beacon Business Command Center™ and selected member features. Membership is currently listed at $150/month with a standard $199 setup fee that is currently waived until further notice. Prices, promotions, included features, and setup requirements may change. Any changes will be communicated through the website, account area, invoice, or other reasonable notice.</p>
        </section>

        <section>
          <h3>6. Payments, Billing, and Cancellation</h3>
          <p>Paid services may be billed monthly, annually, per project, by subscription, or according to a written agreement. You are responsible for keeping payment information current and paying all applicable fees when due. If payment fails or becomes overdue, Beacon may suspend or limit access to paid services until payment is resolved. Unless otherwise stated in writing, membership may be cancelled, but cancellation does not automatically erase unpaid balances or completed service charges.</p>
        </section>

        <section>
          <h3>7. Setup, Onboarding, and Implementation</h3>
          <p>Beacon may request business information, brand materials, service details, team information, verification documents, images, or other content during onboarding. Delays in providing accurate information may delay setup, verification, website work, add-ons, reporting, or platform configuration. Beacon may make reasonable implementation decisions based on the information available, but the business remains responsible for reviewing and approving its public information.</p>
        </section>

        <section>
          <h3>8. Business Information and Profile Accuracy</h3>
          <p>Businesses are responsible for ensuring that names, descriptions, services, prices, contact details, locations, business hours, images, claims, credentials, and other profile information are accurate and current. Beacon may edit, reject, remove, or request changes to content that appears inaccurate, misleading, inappropriate, unlawful, unsafe, or inconsistent with platform standards.</p>
        </section>

        <section>
          <h3>9. Verification, Trust Score, and Certification</h3>
          <p>Beacon Verified™, Beacon Trust Score™, and Beacon Home Access Certified™ are trust signals designed to help customers make more informed decisions. They are not guarantees of service quality, customer satisfaction, licensing, insurance, legal compliance, professional competence, honesty, safety, or future behaviour. Beacon may approve, deny, suspend, adjust, or remove verification, certification, badges, trust indicators, or Trust Scores where appropriate.</p>
        </section>

        <section>
          <h3>10. Reviews and User Content</h3>
          <p>Users may submit reviews, ratings, messages, forms, comments, images, business information, or other content where available. You must not submit false, abusive, defamatory, threatening, discriminatory, unlawful, spammy, misleading, or irrelevant content. Beacon may moderate, reject, remove, or restrict content that violates platform rules or creates risk for users, businesses, or Beacon.</p>
        </section>

        <section>
          <h3>11. Acceptable Use</h3>
          <p>You may not use Beacon to break the law or encourage unlawful activity, misrepresent your identity or business, harass, threaten, exploit, or abuse others, post false, fake, or manipulated reviews, upload malware or harmful code, scrape, copy, overload, or disrupt the platform, send spam or unauthorized marketing, interfere with another business profile, or use Beacon in a way that damages trust in the platform.</p>
        </section>

        <section>
          <h3>12. Governing Law</h3>
          <p>Unless otherwise stated in a written agreement, these Terms are intended to be governed by the laws of Trinidad and Tobago. If Beacon later operates through a different legal entity or jurisdiction, this section should be updated before launch or before that entity begins operating the platform.</p>
        </section>
      </div>
    </div>
  );
}
