import React from 'react';

export default function Footer({ setRoute }) {
  const handleNav = (route) => {
    setRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--color-navy)',
      color: 'var(--color-white)',
      padding: '5rem 0 3rem 0',
      marginTop: 'auto',
      borderTop: '5px solid var(--color-teal)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Brand Info */}
          <div>
            <div onClick={() => handleNav('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img 
                src="/assets/find_logo_white.png" 
                alt="Find by Beacon" 
                style={{ height: '38px', objectFit: 'contain' }} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-headings)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-white)' }}>Find</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>by Beacon</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Find the right Caribbean business faster. Search by service, category, location, reviews, and verified information.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => handleNav('home')}>🌐</span>
              <span style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => handleNav('contact')}>✉️</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>Discover</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <li><span onClick={() => handleNav('search')} style={{ cursor: 'pointer' }}>Search Businesses</span></li>
              <li><span onClick={() => handleNav('categories')} style={{ cursor: 'pointer' }}>Browse Categories</span></li>
              <li><span onClick={() => handleNav('locations')} style={{ cursor: 'pointer' }}>Search Locations</span></li>
              <li><span onClick={() => handleNav('verified')} style={{ cursor: 'pointer' }}>Verified Businesses</span></li>
              <li><span onClick={() => handleNav('home-access')} style={{ cursor: 'pointer' }}>Home Access Certified</span></li>
            </ul>
          </div>

          {/* Core Resources */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>Community</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <li><span onClick={() => handleNav('offers')} style={{ cursor: 'pointer' }}>Offers & Promos</span></li>
              <li><span onClick={() => handleNav('spotlights')} style={{ cursor: 'pointer' }}>Business Spotlights</span></li>
              <li><span onClick={() => handleNav('events')} style={{ cursor: 'pointer' }}>Webinars & Training</span></li>
              <li><span onClick={() => handleNav('safety')} style={{ cursor: 'pointer' }}>Safety & Hiring Guide</span></li>
              <li><span onClick={() => handleNav('help')} style={{ cursor: 'pointer' }}>Help / FAQ</span></li>
            </ul>
          </div>

          {/* Business Owner Actions */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>For Businesses</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <li><span onClick={() => handleNav('claim')} style={{ cursor: 'pointer', fontWeight: 600 }}>Claim Your Listing</span></li>
              <li><span onClick={() => handleNav('advertise')} style={{ cursor: 'pointer' }}>Advertise With Us</span></li>
              <li><span onClick={() => handleNav('join')} style={{ cursor: 'pointer', color: 'var(--color-teal-light)', fontWeight: 600 }}>Start Free Listing</span></li>
              <li><span onClick={() => handleNav('admin')} style={{ cursor: 'pointer' }}>Admin Dashboard</span></li>
            </ul>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '3rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: '1.6'
        }}>
          <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>⚠️ Safety / Booking Disclaimer</strong>
          Find by Beacon provides business information, reviews, profile details, and verification indicators to help customers make more informed decisions. Beacon does not guarantee service quality, customer satisfaction, legal compliance, licensing, insurance, professional competence, or future conduct. Customers should still ask questions, confirm pricing, verify expectations, use written agreements where appropriate, and exercise good judgment.
        </div>

        {/* Copyright */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>
            &copy; {new Date().getFullYear()} Find by Beacon. A product of the Beacon Business Opportunity Network. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('help')}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('help')}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
