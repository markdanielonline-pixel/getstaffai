import React from 'react';

export default function EmailPolicy() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', animation: 'fadeInUp var(--transition-medium)' }}>
      <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Usage Rules</span>
      <h1 style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Email & Usage Policy</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '2rem' }}>Last Updated: June 20, 2026 | Contact: legal@caribbeacon.com</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
        <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px', borderLeft: '4px solid var(--color-teal)' }}>
          <h4 style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '0.5rem' }}>COMMUNICATION SHOULD BUILD TRUST</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy)' }}>
            Beacon exists to help businesses become more visible, more trusted, more organized, and more prepared for growth. Responsible communication and fair platform usage are essential parts of maintaining that trust.
          </p>
        </section>

        <section>
          <h3>1. Types of Emails Beacon May Send</h3>
          <p>We send account setup verifications, login safety notifications, onboarding instructions, billing receipt notifications, platform maintenance notifications, review notices, and promotional newsletters where permitted. Transactional emails are required for service delivery and will be sent regardless of newsletter subscription status.</p>
        </section>

        <section>
          <h3>2. Prohibited Messaging Use</h3>
          <p>You may not use Beacon email forms, lead desks, or messaging systems to: send spam or bulk unsolicited messages, send misleading or fraudulent notifications, impersonate another brand or user, harass or threaten others, distribute malware or harmful scripts, bypass unsubscribe actions, or collect customer data without direct approval.</p>
        </section>

        <section>
          <h3>3. Acceptable Platform Use</h3>
          <p>Beacon must be used for legitimate business visibility, trust building, review collection, lead tracking, and internal database organization. Users must provide accurate profile details, respect other members, keep account login credentials secure, and use tools in a way that respects client privacy.</p>
        </section>

        <section>
          <h3>4. Prohibited Platform Use</h3>
          <p>Creating fake review profiles, fabricating test scores, attacking competitors, reselling or scraping platform data, overload attacks, and unauthorized system access are strictly prohibited. Beacon reserves the right to suspend, adjust, or remove profile claims where violations occur.</p>
        </section>
      </div>
    </div>
  );
}
