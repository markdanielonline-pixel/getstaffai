import React from 'react';
import Card from '../components/Card';

export default function Join({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Get Started</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Start Building A Better Business System</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Whether you are creating your first profile or unlocking the Command Center, you are taking a step toward organized growth.
          </p>
        </div>
      </section>

      {/* Select Cards */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ maxWidth: '900px' }}>
          {/* Start Free Card */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--color-gray)'
          }}>
            <div>
              <span style={{ color: 'var(--color-gray)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>Option 01</span>
              <h3 style={{ marginTop: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Start Free</h3>
              <p>Build your public business presence and start collecting client reviews.</p>
              <div style={{ margin: '1.5rem 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>$0</span>
                <span style={{ color: 'var(--color-gray)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
                <li>✓ Beacon Profile™ Page</li>
                <li>✓ WhatsApp link integration</li>
                <li>✓ Website & Social link hub</li>
                <li>✓ Public reviews board</li>
                <li>✓ Search category visibility</li>
              </ul>
            </div>
            <button 
              onClick={() => handleNavClick('freeplan')} 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '2.5rem' }}
            >
              Start Free Profile
            </button>
          </div>

          {/* Become a Member Card */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--color-teal)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '6px solid var(--color-teal)'
          }}>
            <div>
              <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>Option 02</span>
              <h3 style={{ marginTop: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Become a Member</h3>
              <p>Unlock the full Command Center, CRM database, reviews badging, and trust reports.</p>
              <div style={{ margin: '1.5rem 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-teal)' }}>$150</span>
                <span style={{ color: 'var(--color-gray)' }}>/month</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-teal)' }}>Setup fee: $199 waived</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
                <li>✓ <strong>All Free features</strong></li>
                <li>✓ <strong>Beacon Verified™ status</strong></li>
                <li>✓ <strong>Trust Score Desk</strong></li>
                <li>✓ Booking calendars & CRM desks</li>
                <li>✓ Money tracker & health reports</li>
              </ul>
            </div>
            <button 
              onClick={() => handleNavClick('membership')} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '2.5rem' }}
            >
              Become A Member
            </button>
          </div>
        </div>
      </section>

      {/* Onboarding steps summary */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2>Onboarding Journey</h2>
            <p>What happens after you sign up.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <Card title="Step 1" content="Create your account login credentials." />
            <Card title="Step 2" content="Claim or build your Profile details." />
            <Card title="Step 3" content="Complete onboarding inputs." />
            <Card title="Step 4" content="Activate directory search listings." />
          </div>
        </div>
      </section>
    </div>
  );
}
