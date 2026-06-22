import React from 'react';

export default function Privacy() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', animation: 'fadeInUp var(--transition-medium)' }}>
      <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Your Rights</span>
      <h1 style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '2rem' }}>Last Updated: June 20, 2026 | Contact: legal@caribbeacon.com</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
        <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px', borderLeft: '4px solid var(--color-teal)' }}>
          <h4 style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '0.5rem' }}>IMPORTANT PRIVACY POSITION</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy)' }}>
            Beacon is designed to support business visibility, trust, organization, and growth. To provide these services, Beacon may collect information from businesses, customers, visitors, members, reviewers, and service users. Beacon aims to collect only what is needed, use information responsibly, protect sensitive information, and give users reasonable ways to contact us about privacy concerns.
          </p>
        </section>

        <section>
          <h3>1. Information We May Collect</h3>
          <p>Beacon may collect information you provide directly, information created through platform use, and information from third-party services connected to Beacon. This may include: Name, business name, email address, phone number, WhatsApp number, business address or service area, business category and services, business descriptions and images, account login information, payment and billing details handled through payment providers, messages, forms, support logs, and reviews.</p>
        </section>

        <section>
          <h3>2. Business Profile Information</h3>
          <p>Information submitted for a public Beacon Profile™ will be displayed publicly. This can include business name, description, category, location, service areas, contact options, links, images, reviews, trust signals, and badges. Businesses should not submit private, confidential, or sensitive information for public display unless they are comfortable with that information being visible.</p>
        </section>

        <section>
          <h3>3. Verification Information</h3>
          <p>Verification may require additional information such as identity details, business details, contact confirmation, documents, licenses, insurance details, certificates, or other supporting materials where applicable. Beacon uses this information to assess eligibility for trust indicators such as Beacon Verified™, Beacon Trust Score™, and Beacon Home Access Certified™. Verification information is handled with additional care and is not publicly displayed unless clearly presented as a public trust signal.</p>
        </section>

        <section>
          <h3>4. How We Use Information</h3>
          <p>We use details to create, manage, and display profiles, process onboarding inputs, calculate Trust Score values, collect customer reviews, email transactional support notifications, analyze usage logs, prevent fraud and spam accounts, and comply with safety or legal requirements.</p>
        </section>

        <section>
          <h3>5. Data Storage and Security</h3>
          <p>Beacon aims to use reasonable administrative, technical, and organizational safeguards to protect information. No website, platform, server, database, or internet transmission can be guaranteed to be perfectly secure. Users and businesses are responsible for protecting account credentials, using strong passwords, and notifying Beacon about suspected unauthorized access.</p>
        </section>

        <section>
          <h3>6. Choices and Requests</h3>
          <p>Depending on your location and the nature of the information, you may request access, correction, update, deletion, restriction, or review of certain personal information. Privacy requests can be sent to legal@caribbeacon.com.</p>
        </section>
      </div>
    </div>
  );
}
