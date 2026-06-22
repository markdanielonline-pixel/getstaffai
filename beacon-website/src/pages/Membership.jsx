import React from 'react';
import Card from '../components/Card';

export default function Membership({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero Section */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0', position: 'relative' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Beacon Membership</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            The Business Command Center™ For Serious Caribbean Businesses
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Most businesses do not fail because they lack talent. They struggle because important parts of the business are disconnected. WhatsApp messages, paper notebooks, inconsistent follow-up. Beacon brings it together.
          </p>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'inline-block', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gold)' }}>$150/month</span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginLeft: '1rem' }}>Setup Fee: <del>$199</del> Waived Until Further Notice</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => handleNavClick('join')} className="btn btn-gold">Become A Beacon Member</button>
            <button onClick={() => handleNavClick('freeplan')} className="btn btn-secondary" style={{ borderColor: 'var(--color-teal-light)', color: 'var(--color-teal-light)' }}>Start Free</button>
          </div>
        </div>
      </section>

      {/* The Real Problem */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>The Disconnect</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Most Businesses Do Not Need More Hustle, They Need Better Systems</h2>
            <p>Many business owners are already working hard. They answer messages, serve customers, solve problems, and put in long hours. Yet growth still feels harder than it should. Because effort alone cannot replace systems.</p>
            <div style={{ borderLeft: '4px solid var(--color-teal)', paddingLeft: '1.5rem', margin: '2rem 0' }}>
              <p style={{ fontStyle: 'italic', margin: 0 }}>
                "Without structure: enquiries get missed, follow-up becomes inconsistent, reviews never get collected, customers disappear, important information gets buried, the owner becomes the system, and that eventually becomes the bottleneck."
              </p>
            </div>
            <p>Beacon Membership helps businesses move from reactive operations to structured growth.</p>
          </div>
          <div>
            <Card title="Without Beacon" content="You carry the business. You are the scheduler, the CRM, the database, and the follow-up system. If you take a day off, the business stops." badge="The Bottleneck" style={{ borderLeft: '4px solid #EF4444', marginBottom: '1.5rem' }} />
            <Card title="With Beacon" content="System structures carry the work. Scheduled appointments flow automatically, inquiries are routed safely, follow-up tasks are tracked." badge="The Solution" style={{ borderLeft: '4px solid var(--color-teal)' }} />
          </div>
        </div>
      </section>

      {/* Transformation comparison */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2>What Changes When A Business Becomes A Member?</h2>
            <p>A direct side-by-side view of the operational transformation.</p>
          </div>
          
          {/* Centered before and after image */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
            <img 
              src="/assets/before and after 2.png" 
              alt="Before vs After Beacon Workflow" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }} 
            />
          </div>

          <div className="grid-2">
            <div style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #DC2626' }}>
              <h3 style={{ color: '#DC2626', marginBottom: '1.5rem' }}>Before Beacon</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
                <li>❌ Customer information is scattered across phone lists and old texts.</li>
                <li>❌ Trust is difficult to prove without static review boards.</li>
                <li>❌ Follow-up depends entirely on owner's memory.</li>
                <li>❌ Tasks are easily forgotten under busy schedules.</li>
                <li>❌ Leads and quotes get lost in old threads.</li>
                <li>❌ The owner carries everything on their shoulders.</li>
              </ul>
            </div>
            <div style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid var(--color-teal)' }}>
              <h3 style={{ color: 'var(--color-teal)', marginBottom: '1.5rem' }}>After Beacon</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
                <li>✅ Customer information is organized in a unified database.</li>
                <li>✅ Trust becomes visible with verified badges and Trust Score.</li>
                <li>✅ Follow-up becomes structured and scheduled.</li>
                <li>✅ Tasks become trackable on an operational dashboard.</li>
                <li>✅ Opportunities are documented and systematically followed up.</li>
                <li>✅ The business becomes easier to run and ready to scale.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>Beacon Membership Values & Tools</h2>
            <p>Every membership plan unlocks the full operating system designed for business acceleration.</p>
          </div>
          <div className="grid-3">
            <Card title="Trust Infrastructure" content="Get access to Beacon Verified badge, Trust Score calculation, and Home Access Certification." icon="🛡️" />
            <Card title="Appointment Desk" content="Enable client booking requests, intake questions, confirmation notifications, and calendar sync." icon="📅" />
            <Card title="CRM & Lead Desks" content="Never lose track of enquiries or customers. Track histories, record notes, and follow up." icon="👥" />
            <Card title="Money Desk" content="Organize invoices, track expenses, record transaction metadata, and keep accounts clear." icon="💰" />
            <Card title="Reports & Guidance" content="Receive Business Health Reports and personalized Growth Recommendations to fix structural gaps." icon="📊" />
            <Card title="No Per-Seat Fees" content="Add your entire team without paying extra for users. Manage permissions without penalties." icon="🚫" />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0', color: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2>Your Business Deserves Better Systems</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem' }}>
            If you are ready to move beyond scattered files, missed booking requests, and silent follow-ups, Beacon Membership is the solution.
          </p>
          <button onClick={() => handleNavClick('join')} className="btn btn-gold">Become A Beacon Member</button>
        </div>
      </section>
    </div>
  );
}
