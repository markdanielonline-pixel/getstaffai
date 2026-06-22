import React, { useState } from 'react';

export default function Navbar({ currentPath, setRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'Membership', path: 'membership' },
    { name: 'Pricing', path: 'pricing' },
    { name: 'Trust & Verification', path: 'trust' },
    { name: 'Add-Ons', path: 'addons' },
    { name: 'Command Center', path: 'commandcenter' },
    { name: 'How It Works', path: 'howitworks' },
    { name: 'About', path: 'about' },
    { name: 'Who It\'s For', path: 'whoitsfor' },
    { name: 'FAQ', path: 'faq' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleNavClick = (path) => {
    setRoute(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="glassmorphism" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      padding: '0.8rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        {/* Logo */}
        <div onClick={() => handleNavClick('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src="/assets/header_logo.png" 
            alt="Beacon Logo" 
            style={{ height: '40px', width: 'auto', display: 'block' }}
          />
        </div>

        {/* Desktop Links */}
        <div className="desktop-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {navLinks.map((link) => {
            const isCC = link.path === 'commandcenter';
            return (
              <span
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  cursor: 'pointer',
                  fontWeight: currentPath === link.path ? '700' : '500',
                  color: isCC 
                    ? 'var(--color-white)' 
                    : (currentPath === link.path ? 'var(--color-teal)' : 'var(--color-navy)'),
                  fontSize: '0.85rem',
                  letterSpacing: '0.2px',
                  padding: isCC ? '0.45rem 0.9rem' : '0.3rem 0.5rem',
                  borderRadius: isCC ? '50px' : '4px',
                  background: isCC 
                    ? (currentPath === link.path ? 'var(--color-navy)' : 'var(--color-teal)') 
                    : 'transparent',
                  boxShadow: isCC ? '0 4px 10px rgba(0, 166, 178, 0.15)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if (isCC) {
                    e.target.style.background = 'var(--color-navy)';
                  } else if (currentPath !== link.path) {
                    e.target.style.color = 'var(--color-teal)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCC) {
                    e.target.style.background = currentPath === link.path ? 'var(--color-navy)' : 'var(--color-teal)';
                  } else if (currentPath !== link.path) {
                    e.target.style.color = 'var(--color-navy)';
                  }
                }}
              >
                {link.name}
              </span>
            );
          })}
          <button 
            className="btn btn-primary" 
            onClick={() => handleNavClick('join')}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}
          >
            Join Beacon
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-navy)',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glassmorphism" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '1rem',
          borderBottom: '2px solid var(--color-teal)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {navLinks.map((link) => (
            <span
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              style={{
                cursor: 'pointer',
                fontWeight: currentPath === link.path ? '700' : '500',
                color: currentPath === link.path ? 'var(--color-teal)' : 'var(--color-navy)',
                fontSize: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(10, 29, 61, 0.05)'
              }}
            >
              {link.name}
            </span>
          ))}
          <button 
            className="btn btn-primary" 
            onClick={() => handleNavClick('join')}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            Join Beacon
          </button>
        </div>
      )}

      {/* Inject Style for Navbar Breakpoints */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
