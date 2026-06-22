import React from 'react';
import Card from '../components/Card';

export default function Home({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero Section */}
      <section className="gradient-bg-navy" style={{ padding: '8rem 0 6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,166,178,0.15) 0%, rgba(10,29,61,0) 70%)',
          borderRadius: '50%'
        }}></div>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.15' }}>
              The Business Growth Membership Built For <span style={{ color: 'var(--color-teal-light)' }}>Caribbean Businesses</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              Beacon helps businesses get found, build trust, capture enquiries, book appointments, follow up with customers, organize operations, and grow from one connected Business Command Center™.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => handleNavClick('join')} className="btn btn-gold animate-pulse-gold">
                Become A Beacon Member
              </button>
              <button onClick={() => handleNavClick('freeplan')} className="btn btn-secondary" style={{ borderColor: 'var(--color-teal-light)', color: 'var(--color-teal-light)' }}>
                Start Free
              </button>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <div>
                <h3 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.5rem' }}>One</h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Membership</span>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
                <h3 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.5rem' }}>One</h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Login</span>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
                <h3 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.5rem' }}>One</h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Business System</span>
              </div>
            </div>
          </div>
          <div className="animate-float" style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/assets/beacon app image.png" 
              alt="Beacon Business Command Center" 
              style={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block' }} 
            />
          </div>
        </div>
      </section>

      {/* Visual Section: Before vs After */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>The Transformation</span>
            <h2 style={{ marginTop: '0.5rem' }}>Before & After Beacon</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>See how Beacon moves your business away from scattered chaos and into organized, professional operations.</p>
          </div>
          <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <img 
                src="/assets/before and after 2.png" 
                alt="Before and After Beacon Workflow" 
                style={{ width: '100%', display: 'block' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444', backgroundColor: '#FEF2F2', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ color: '#DC2626', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Before Beacon</h4>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Scattered customer data across WhatsApp, spreadsheets, notebooks, and memory. Leading to missed opportunities, weak follow-up, and constant operational stress.</p>
              </div>
              <div style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-teal)', backgroundColor: 'rgba(0,166,178,0.05)', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ color: 'var(--color-teal)', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>After Beacon</h4>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>All files, reviews, schedules, tasks, and money records organized under the Beacon Business Command Center™. Instantly visible trust signals and structured follow-up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>The Real Problem</span>
              <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Hard Work Should Not Be The Business Strategy</h2>
              <p>Many Caribbean businesses are built on effort. The owner remembers everything. Customer information lives in WhatsApp. Appointments are tracked in notebooks. Quotes are buried in old messages. Reviews are never requested. Follow-up happens when there is time.</p>
              <p>Important business decisions are made with incomplete information. The business stays busy, but growth stays inconsistent. The problem is not effort. The problem is structure. Beacon helps solve that.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Card title="Customer Data" content="Lives inside memory or messages." badge="Warning" style={{ borderLeft: '4px solid #E2E8F0' }} />
              <Card title="Appointment Tracking" content="Scattered across paper notebooks." badge="Warning" style={{ borderLeft: '4px solid #E2E8F0' }} />
              <Card title="Growth decisions" content="Made with incomplete information." badge="Warning" style={{ borderLeft: '4px solid #E2E8F0' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="gradient-bg-teal" style={{ padding: '5rem 0', color: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: '1.5rem' }}>Why Beacon Exists</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: '1.8' }}>
            "Caribbean businesses are some of the hardest-working businesses in the world. Yet many still operate without the systems larger companies take for granted. Beacon was created to change that. Our mission is simple: Help Caribbean businesses become more visible, more trusted, more organized, and more prepared for growth. Because serious business systems should not require enterprise budgets."
          </p>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>Everything Beacon Does Supports Three Goals</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>Every tool, report, recommendation, and resource inside Beacon is built to drive these core outcomes.</p>
          </div>
          <div className="grid-3">
            <Card 
              title="Get Found" 
              subtitle="Pillar 01"
              content="Help customers discover your business more easily across categories, search terms, and local Caribbean regions."
              icon="🔍"
            />
            <Card 
              title="Build Trust" 
              subtitle="Pillar 02"
              content="Help customers feel confident choosing your business through verification tags, verified reviews, and a transparent Trust Score."
              icon="⭐"
            />
            <Card 
              title="Operate Better" 
              subtitle="Pillar 03"
              content="Help your business run with more structure, consistency, and operational visibility using the Business Command Center."
              icon="💼"
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Trust Infrastructure</span>
              <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Trust Is Not Marketing, It Is Infrastructure</h2>
              <p>Most customers make trust decisions before they make buying decisions, before they call, book, visit, or pay. They ask: Is this business real? Can I trust them? Will they respond? Do other customers recommend them?</p>
              <p>Beacon helps businesses answer those questions through a structured trust system. We introduce:</p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <li><strong>Beacon Verified™:</strong> Confirming identity, business details, and active status.</li>
                <li><strong>Beacon Trust Score™:</strong> A score out of 100 representing platform activity, responsiveness, and review quality.</li>
                <li><strong>Beacon Home Access Certified™:</strong> For businesses that enter private homes.</li>
              </ul>
              <button onClick={() => handleNavClick('trust')} className="btn btn-primary">Learn More About Trust</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
              <img 
                src="/assets/beacon trust score.png" 
                alt="Beacon Trust Score Dashboard" 
                style={{ width: '100%', maxWidth: '400px', display: 'block' }} 
              />
              <img 
                src="/assets/beacon badges.png" 
                alt="Beacon Trust Badges" 
                style={{ width: '100%', maxWidth: '350px', display: 'block' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Command Center Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Command Center</span>
            <h2 style={{ marginTop: '0.5rem' }}>One Membership. One Login. One Business Command Center™</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>Stop using scattered software. Bring the major parts of your operation under one clean dashboard.</p>
          </div>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)' }}>
                <h5>CRM & Customer Management</h5>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)' }}>
                <h5>Appointment Scheduling</h5>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)' }}>
                <h5>Money & Transaction Records</h5>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)' }}>
                <h5>Business Health Reports</h5>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)' }}>
                <h5>Marketing & Broadcasts</h5>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)' }}>
                <h5>Task & Job Management</h5>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '2rem' }}>
              <p>Beacon brings customer management, lead tracking, calendar coordination, transaction history, and custom marketing broadcasts together under one unified platform. Fewer software bills, more operational sanity.</p>
              <button onClick={() => handleNavClick('commandcenter')} className="btn btn-secondary">Explore The Command Center</button>
            </div>
          </div>
        </div>
      </section>

      {/* Built For Real Businesses */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>Built For Real Caribbean Businesses</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>See how different industries use Beacon to capture opportunities and stay structured.</p>
          </div>
          <div className="grid-3">
            <Card title="Contractors" content="Capture quote requests, collect reviews, display home certifications, and keep track of job details." icon="🛠️" />
            <Card title="Tutors" content="Manage appointments, collect student inquiries, organize client details, and coordinate with parents." icon="📚" />
            <Card title="Guesthouses" content="Capture direct reservations, strengthen credibility with badges, and follow up automatically." icon="🏡" />
            <Card title="Consultants" content="Organize leads, track conversations, document client histories, and build authority." icon="📈" />
            <Card title="Beauty Professionals" content="Simplify scheduling, collect reviews, post announcements, and reduce empty time slots." icon="💇" />
            <Card title="Home Services" content="Plumbers, electricians, and cleaners stand out with Home Access Certification and responsive CRM." icon="🧼" />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0', color: 'var(--color-white)', position: 'relative' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Stop Running Your Business From Memory</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Your business deserves more than scattered information, weak follow-up, and disconnected tools. It deserves system. It deserves trust. It deserves structure.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleNavClick('join')} className="btn btn-gold">Become A Beacon Member</button>
            <button onClick={() => handleNavClick('freeplan')} className="btn btn-secondary" style={{ borderColor: 'var(--color-teal)', color: 'var(--color-teal)' }}>Start Free</button>
          </div>
        </div>
      </section>
    </div>
  );
}
