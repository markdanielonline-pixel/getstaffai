import React, { useState } from 'react';

export default function Contact({ setRoute }) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'Email'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Get in Touch</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Let's Build A Stronger Business Together</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Have questions about Membership, profiles, verification, or growth add-ons? Our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Form & Details */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2">
          {/* Form */}
          <div style={{ padding: '2.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Submit Inquiry</h3>
            {submitted ? (
              <div style={{ padding: '2rem', backgroundColor: 'rgba(0,166,178,0.1)', color: 'var(--color-teal)', borderRadius: '8px', textAlign: 'center' }}>
                <h4>Thank You!</h4>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-navy)' }}>Your message was submitted. We will respond within 1-3 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Business Name</label>
                    <input type="text" required value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Phone</label>
                    <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Subject</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Message</label>
                  <textarea rows="4" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', fontFamily: 'inherit' }}></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Preferred Contact Method</label>
                  <select value={formData.contactMethod} onChange={(e) => setFormData({...formData, contactMethod: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }}>
                    <option>Email</option>
                    <option>WhatsApp</option>
                    <option>Phone Call</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>Submit Inquiry</button>
              </form>
            )}
          </div>

          {/* Details */}
          <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--color-teal)', marginBottom: '0.5rem' }}>General Enquiries</h4>
              <p style={{ margin: 0 }}><strong>Email:</strong> info@caribbeacon.com</p>
              <p style={{ margin: 0 }}>Contact us for account support, profile claims, onboarding questions, or billing assistance.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-teal)', marginBottom: '0.5rem' }}>Legal & Policy</h4>
              <p style={{ margin: 0 }}><strong>Email:</strong> legal@caribbeacon.com</p>
              <p style={{ margin: 0 }}>Contact us for trademark verification, policy audits, safety questions, or formal disputes.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-teal)', marginBottom: '0.5rem' }}>Partnerships</h4>
              <p style={{ margin: 0 }}>We welcome dialogs with local Chambers of Commerce, Trade Associations, and Caribbean business coalitions looking to expand systems access.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Response Standards</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-gray)' }}>We respond to all verified emails and inquiries within 1-3 business days.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
