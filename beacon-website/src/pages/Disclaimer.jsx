import React from 'react';

export default function Disclaimer() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', animation: 'fadeInUp var(--transition-medium)' }}>
      <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Liability Limitations</span>
      <h1 style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Verification Disclaimer</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '2rem' }}>Last Updated: June 20, 2026 | Contact: legal@caribbeacon.com</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
        <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px', borderLeft: '4px solid var(--color-gold)' }}>
          <h4 style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '0.5rem' }}>IMPORTANT SUMMARY</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy)' }}>
            Beacon trust signals are informational tools. They are not guarantees. They do not remove the responsibility of customers to ask questions, confirm details, use written agreements where appropriate, protect themselves, and make careful decisions. They do not remove the responsibility of businesses to act honestly, legally, professionally, and safely.
          </p>
        </section>

        <section>
          <h3>1. What Beacon Verified™ Means</h3>
          <p>Beacon Verified™ means a business has submitted information for review and has completed Beacon verification requirements at the time of assessment. Verification may include identity review, business information review, contact verification, document review, profile quality review, activity review, or other checks Beacon considers appropriate.</p>
        </section>

        <section>
          <h3>2. What Beacon Verified™ Does Not Mean</h3>
          <p>Beacon Verified™ does not mean Beacon guarantees: Service quality, customer satisfaction, future behaviour, legal compliance, professional competence, business honesty, licensing status, insurance status, employee background status, safety of any service provider, outcome of any service, or accuracy of every public claim made by the business. Verification is a trust signal, not a warranty.</p>
        </section>

        <section>
          <h3>3. What Beacon Trust Score™ Means</h3>
          <p>Beacon Trust Score™ is a score designed to summarize selected trust signals into a simpler rating. Trust Score factors may include identity verification, business verification, profile completeness, customer reviews, review quality, responsiveness, platform activity, and complaint resolution. The score is designed to encourage professionalism, consistency, transparency, and customer experience.</p>
        </section>

        <section>
          <h3>4. Trust Score Limitations</h3>
          <p>Beacon Trust Score™ is not a complete measure of business quality, morality, legality, skill, financial stability, safety, or customer outcome. A higher score does not guarantee a better experience. A lower score does not automatically mean a business is unsafe or dishonest. Scores can change over time as new information, reviews, complaints, verification updates, activity changes, or platform rules change.</p>
        </section>

        <section>
          <h3>5. Beacon Home Access Certified™</h3>
          <p>Beacon Home Access Certified™ is an enhanced trust signal for eligible service providers who enter family homes, apartments, properties, or private environments. It does not guarantee personal safety or lawful conduct. Customers should take reasonable precautions, verify credentials, protect valuables, and use written agreements where appropriate.</p>
        </section>

        <section>
          <h3>6. Customer & Business Responsibility</h3>
          <p>Customers remain responsible for their own decisions when choosing, contacting, hiring, paying, or inviting a business. Businesses remain responsible for providing accurate information, keeping documents current, responding professionally, complying with applicable laws, and delivering services responsibly.</p>
        </section>
      </div>
    </div>
  );
}
