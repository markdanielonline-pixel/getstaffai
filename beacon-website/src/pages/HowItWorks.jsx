import React from 'react';
import Card from '../components/Card';

export default function HowItWorks({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { num: "01", name: "Create or Claim Your Beacon Profile™", desc: "Your profile is your public business home inside Beacon. Fill in contact details, social links, and business hours." },
    { num: "02", name: "Help Customers Find You", desc: "Position your profile in relevant local directories, categories, and service areas to capture search inquiries." },
    { num: "03", name: "Build Visible Trust", desc: "Gain reviews, display badges, and establish your Beacon Trust Score to help customers decide." },
    { num: "04", name: "Become A Beacon Member", desc: "Upgrade when you are ready to implement deeper operational structures. Unlock the Command Center." },
    { num: "05", name: "Complete Business Onboarding", desc: "Tell us about your services, locations, scheduling requests, and team details to configure your space." },
    { num: "06", name: "Activate Your Command Center™", desc: "Organize the CRM, appointments calendar, money logs, and feedback panels based on your needs." },
    { num: "07", name: "Connect Existing Channels", desc: "Coordinate WhatsApp messages, emails, social profiles, and websites with your new dashboard." },
    { num: "08", name: "Collect Better Information", desc: "Log bookings, feedback details, and review metrics to gather operational statistics." },
    { num: "09", name: "Receive Health Reports™", desc: "Get structural summaries showing review counts, response latencies, and profile gaps." },
    { num: "10", name: "Receive Growth Recommendations™", desc: "Receive automated action items to strengthen trust levels, capture leads, and grow sales." }
  ];

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>The Journey</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Start With Visibility. Grow Into A Business System.</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            We don't overwhelm you with dozens of complex features from day one. You start where you are, and build what you need.
          </p>
        </div>
      </section>

      {/* Steps List */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>A Clear Path From Visibility to Structured Growth</h2>
            <p>Follow these steps to establish systems, prove credibility, and scale operations.</p>
          </div>

          {/* Centered Journey Map Image */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
            <img 
              src="/assets/customer journey.png" 
              alt="Beacon Customer Journey Map" 
              style={{ width: '100%', maxWidth: '850px', height: 'auto', display: 'block' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="glassmorphism"
                style={{
                  display: 'flex',
                  gap: '2rem',
                  padding: '2.5rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-sm)',
                  alignItems: 'flex-start',
                  borderLeft: '5px solid var(--color-teal)'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--color-teal)',
                  backgroundColor: 'rgba(0,166,178,0.08)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  lineHeight: '1'
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.5rem', fontFamily: 'var(--font-body)' }}>{step.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Most Platforms Give You Software. Beacon Gives You Direction.</h2>
            <p>Software alone rarely solves business challenges. You don't just need toolboxes; you need to know what to prioritize, what to fix first, and what creates the biggest impact.</p>
            <p>Beacon combines system desks with personalized reports and action plans, keeping you focused on results.</p>
          </div>
          <div>
            <Card title="Example Journeys" content="Contractors create profiles -> collect reviews -> gain verification -> activate CRM -> receive health feedback -> convert more clients. Tutors organize bookings -> collect parent feedback -> build repeat sessions." icon="🚀" />
          </div>
        </div>
      </section>
    </div>
  );
}
