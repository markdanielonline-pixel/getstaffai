import React, { useState } from 'react';

export default function Navbar({ currentRoute, setRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route) => {
    setRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Search', route: 'search' },
    { label: 'Categories', route: 'categories' },
    { label: 'Locations', route: 'locations' },
    { label: 'Offers', route: 'offers' },
    { label: 'Spotlights', route: 'spotlights' },
    { label: 'Events', route: 'events' },
    { label: 'Safety Guide', route: 'safety' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-light-gray)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Brand Lockup */}
        <div onClick={() => handleNav('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/find_logo.png" 
            alt="Find by Beacon" 
            style={{ height: '38px', objectFit: 'contain' }} 
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-headings)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-navy)', letterSpacing: '-0.5px' }}>Find</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>by Beacon</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.5rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNav(link.route)}
              className={`navbar-link ${currentRoute === link.route ? 'active' : ''}`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => handleNav('claim')} 
            style={{ 
              fontWeight: 600, 
              color: 'var(--color-navy)', 
              fontSize: '0.85rem',
              padding: '0.5rem 0.75rem',
              cursor: 'pointer'
            }}
          >
            Claim Business
          </button>
          <button 
            onClick={() => handleNav('advertise')} 
            style={{ 
              fontWeight: 600, 
              color: 'var(--color-navy)', 
              fontSize: '0.85rem',
              padding: '0.5rem 0.75rem',
              cursor: 'pointer'
            }}
          >
            Advertise
          </button>
          <button 
            onClick={() => handleNav('join')} 
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderRadius: '6px' }}
          >
            Join Beacon
          </button>
          <button 
            onClick={() => handleNav('admin')} 
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '6px', marginLeft: '0.5rem' }}
          >
            Admin
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0.5rem' }}
          className="mobile-toggle"
        >
          <span style={{ width: '22px', height: '2px', backgroundColor: 'var(--color-navy)', transition: '0.3s' }}></span>
          <span style={{ width: '22px', height: '2px', backgroundColor: 'var(--color-navy)', transition: '0.3s' }}></span>
          <span style={{ width: '22px', height: '2px', backgroundColor: 'var(--color-navy)', transition: '0.3s' }}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderBottom: '1px solid var(--color-light-gray)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-md)'
        }} className="mobile-nav">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNav(link.route)}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0',
                fontSize: '1rem',
                fontWeight: currentRoute === link.route ? 700 : 500,
                color: currentRoute === link.route ? 'var(--color-teal)' : 'var(--color-navy)'
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ height: '1px', backgroundColor: 'var(--color-light-gray)', margin: '0.5rem 0' }}></div>
          <button onClick={() => handleNav('claim')} style={{ textAlign: 'left', fontWeight: 600 }}>Claim Business</button>
          <button onClick={() => handleNav('advertise')} style={{ textAlign: 'left', fontWeight: 600 }}>Advertise</button>
          <button onClick={() => handleNav('join')} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Join Beacon</button>
          <button onClick={() => handleNav('admin')} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Admin Dashboard</button>
        </div>
      )}

      {/* Injected style block for navbar display rules */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
