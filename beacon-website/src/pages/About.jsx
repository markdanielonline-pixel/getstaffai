import React from 'react';
import Card from '../components/Card';

export default function About({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Our Story</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Helping Caribbean Businesses Build Better Businesses</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Beacon exists to bring structure to hard-working local businesses, helping them become more visible, trusted, organized, and prepared for scaling.
          </p>
        </div>
      </section>

      {/* The Problem We Saw */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Hard Work Was Everywhere. Systems Were Not.</h2>
            <p>Across the Caribbean, business owners wake up early, work long hours, solve difficult client issues, and do everything possible to succeed. Yet they face the same persistent loops.</p>
            <p>Inquiries lost in old chats, schedules conflict in notebooks, reviews are never requested, and operational decisions are made on feelings. The issue has never been effort, it has been infrastructure.</p>
            <p>Beacon was created to level the playing field, making advanced business tools accessible without enterprise budgets.</p>
          </div>
          <div>
            <Card title="The Solopreneur Burden" content="Solopreneurs often act as receptionist, salesperson, service technician, billing collector, admin, and marketing department at the same time. Beacon replaces that clutter with structure." icon="⚖️" />
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>Our Core Principles</h2>
            <p>Everything we build inside the Beacon ecosystem is guided by three simple outcomes.</p>
          </div>
          <div className="grid-3">
            <Card title="Visibility" content="Customers cannot support businesses they cannot find. We build profiles to position you exactly where local clients search." icon="👁️" />
            <Card title="Trust" content="Customers choose businesses they feel confident hiring. We build verified review metrics to prove your standards." icon="🤝" />
            <Card title="Structure" content="Businesses grow more effectively when systems replace guesswork. We provide Command Centers to handle operations." icon="⚙️" />
          </div>
        </div>
      </section>

      {/* Built For The Caribbean */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img 
              src="/assets/customer journey.png" 
              alt="Caribbean Local Business Journey" 
              style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }} 
            />
          </div>
          <div>
            <h2>Designed Around How Caribbean Businesses Operate</h2>
            <p>Many business systems are designed for corporate structures in large foreign markets. Beacon is built for Caribbean realities. We focus on relationship-based sales, WhatsApp links, community reputation boards, and budgets that make sense for growing local teams.</p>
            <p>Start where you are, progress over perfection, and build what you need over time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
