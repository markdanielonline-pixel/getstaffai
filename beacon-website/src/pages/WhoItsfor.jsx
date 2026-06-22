import React, { useState } from 'react';
import Card from '../components/Card';

export default function WhoItsfor({ setRoute }) {
  const [activeTab, setActiveTab] = useState('services');

  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Who It's For</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Built For Caribbean Businesses That Want To Grow</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Different industries face identical challenges: visibility, trust, and organization. See how Beacon supports your sector.
          </p>
        </div>
      </section>

      {/* Tabs / Filters */}
      <section style={{ padding: '3rem 0 1rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container text-center" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('services')} 
            className="btn" 
            style={{ 
              backgroundColor: activeTab === 'services' ? 'var(--color-teal)' : 'var(--color-offwhite)', 
              color: activeTab === 'services' ? 'var(--color-white)' : 'var(--color-navy)',
              padding: '0.5rem 1.5rem'
            }}
          >
            Services & Trades
          </button>
          <button 
            onClick={() => setActiveTab('professionals')} 
            className="btn" 
            style={{ 
              backgroundColor: activeTab === 'professionals' ? 'var(--color-teal)' : 'var(--color-offwhite)', 
              color: activeTab === 'professionals' ? 'var(--color-white)' : 'var(--color-navy)',
              padding: '0.5rem 1.5rem'
            }}
          >
            Professionals & Retail
          </button>
          <button 
            onClick={() => setActiveTab('growth')} 
            className="btn" 
            style={{ 
              backgroundColor: activeTab === 'growth' ? 'var(--color-teal)' : 'var(--color-offwhite)', 
              color: activeTab === 'growth' ? 'var(--color-white)' : 'var(--color-navy)',
              padding: '0.5rem 1.5rem'
            }}
          >
            Business Stages
          </button>
        </div>
      </section>

      {/* Content Sections based on Tabs */}
      <section style={{ padding: '3rem 0 6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          {activeTab === 'services' && (
            <div className="grid-3">
              <Card 
                title="Contractors" 
                content="Look professional before arriving. Capture quote inquiries, compile reviews, show home certifications, and keep track of job details." 
                icon="🛠️" 
                badge="Construction"
              />
              <Card 
                title="Home Service Providers" 
                content="Plumbers, electricians, and HVAC techs. When entering private homes, trust is the product. Stand out with verification and responsiveness." 
                icon="🚰" 
                badge="Trades"
              />
              <Card 
                title="Cleaning Services" 
                content="Help customers feel comfortable hiring you. Show reviews, verified badges, and structured bookings to stand out from unverified competitors." 
                icon="🧹" 
                badge="Cleaners"
              />
            </div>
          )}

          {activeTab === 'professionals' && (
            <div className="grid-3">
              <Card 
                title="Tutors & Education" 
                content="Parents want trust. Manage student enrollments, booking requests, parent contact cards, and feedback loops in one desk." 
                icon="✏️" 
                badge="Tutors"
              />
              <Card 
                title="Consultants" 
                content="Turn expertise into opportunities. Strengthen public authority, capture advisory leads, and document history records." 
                icon="💡" 
                badge="Consulting"
              />
              <Card 
                title="Beauty & Wellness" 
                content="Hair stylists, spas, and wellness coaches. Simplify scheduling, capture feedback, and fill cancellations using marketing desks." 
                icon="💄" 
                badge="Beauty"
              />
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="grid-3">
              <Card 
                title="New Businesses" 
                content="Start with strong systems. Get found via Free profile, start collecting client reviews, and establish your credibility early." 
                icon="🌱" 
                badge="New"
              />
              <Card 
                title="Growing Businesses" 
                content="Operations need to catch up. Bring scattered records into CRM databases, tasks tracks, calendars, and report structures." 
                icon="🚀" 
                badge="Growing"
              />
              <Card 
                title="Not For Everyone" 
                content="Beacon is NOT for businesses unwilling to maintain accurate information, ignore reviews, or seek magic success." 
                icon="🚫" 
                badge="Clarification"
              />
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0', color: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2>Find Out What Beacon Can Do For You</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
            No matter your industry, the outcomes are clear: get found, build trust, and operate better.
          </p>
          <button onClick={() => handleNavClick('join')} className="btn btn-gold">Become A Beacon Member</button>
        </div>
      </section>
    </div>
  );
}
