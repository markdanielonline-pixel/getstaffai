import React from 'react';

export default function Footer({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-bg-navy" style={{ padding: '5rem 0 3rem 0', marginTop: 'auto', borderTop: '4px solid var(--color-teal)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Logo and About */}
          <div style={{ gridColumn: 'span 2' }}>
            <img 
              src="/assets/footer_logo.png" 
              alt="Beacon Premium Logo" 
              style={{ height: '48px', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '1.5rem' }} 
            />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: '350px', lineHeight: '1.7' }}>
              Beacon is a business growth membership designed to help Caribbean businesses operate with more structure and grow with more confidence. One Membership. One Login. One Business System.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><span onClick={() => handleNavClick('home')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Home</span></li>
              <li><span onClick={() => handleNavClick('membership')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Membership</span></li>
              <li><span onClick={() => handleNavClick('pricing')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Pricing</span></li>
              <li><span onClick={() => handleNavClick('trust')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Trust & Verification</span></li>
              <li><span onClick={() => handleNavClick('addons')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Growth Add-Ons</span></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><span onClick={() => handleNavClick('commandcenter')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Command Center</span></li>
              <li><span onClick={() => handleNavClick('howitworks')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>How It Works</span></li>
              <li><span onClick={() => handleNavClick('whoitsfor')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Who It's For</span></li>
              <li><span onClick={() => handleNavClick('faq')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>FAQ</span></li>
              <li><span onClick={() => handleNavClick('contact')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Contact Support</span></li>
            </ul>
          </div>

          {/* Legal / Policy Links */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Policies & Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><span onClick={() => handleNavClick('terms')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Terms of Service</span></li>
              <li><span onClick={() => handleNavClick('privacy')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Privacy Policy</span></li>
              <li><span onClick={() => handleNavClick('disclaimer')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Verification Disclaimer</span></li>
              <li><span onClick={() => handleNavClick('emailpolicy')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-teal-light)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Email & Usage Policy</span></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }} />

        {/* Bottom Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <div>
            &copy; {currentYear} Beacon Network. All Rights Reserved. Designed in the Caribbean.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>info@caribbeacon.com</span>
            <span>legal@caribbeacon.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
