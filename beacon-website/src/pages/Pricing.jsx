import React from 'react';
import Card from '../components/Card';

export default function Pricing({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Pricing Plans</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Simple Pricing For Businesses That Want To Grow</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            No user fees, no hidden limits, no software games. Choose the level that matches your current business stage.
          </p>
        </div>
      </section>

      {/* Pricing Table Cards */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ maxWidth: '1000px' }}>
          {/* Free Plan */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '20px',
            padding: '3rem 2.5rem',
            boxShadow: 'var(--shadow-md)',
            borderTop: '4px solid var(--color-gray)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>Free Member Plan</h3>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>Perfect for businesses getting started with online presence.</p>
              <div style={{ margin: '2rem 0' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-navy)' }}>$0</span>
                <span style={{ color: 'var(--color-gray)', marginLeft: '0.5rem' }}>/month</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-light-gray)', marginBottom: '2rem' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                <li>✅ Beacon Profile™ Page</li>
                <li>✅ Business Description</li>
                <li>✅ Category & Location Visibility</li>
                <li>✅ WhatsApp Link</li>
                <li>✅ Website & Social Media Links</li>
                <li>✅ Customer Reviews Board</li>
                <li>✅ Claimed Business status</li>
                <li>✅ Basic Search visibility</li>
              </ul>
            </div>
            <button 
              onClick={() => handleNavClick('freeplan')} 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '3rem' }}
            >
              Start Free
            </button>
          </div>

          {/* Membership Plan */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '20px',
            padding: '3rem 2.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--color-teal)',
            borderTop: '6px solid var(--color-teal)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-teal)',
              color: 'var(--color-white)',
              padding: '0.35rem 1.25rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              Most Popular
            </span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>Beacon Membership</h3>
              <p style={{ color: 'var(--color-teal)', fontSize: '0.9rem', fontWeight: 600 }}>Perfect for businesses ready to operate better.</p>
              <div style={{ margin: '2rem 0' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-navy)' }}>$150</span>
                <span style={{ color: 'var(--color-gray)', marginLeft: '0.5rem' }}>/month</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-teal)', margin: '0.5rem 0 0 0' }}>Setup fee: <del>$199</del> Waived promotionally</p>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-light-gray)', marginBottom: '2rem' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                <li>✅ <strong>Everything in Free +</strong></li>
                <li>✅ Enhanced Profile Page</li>
                <li>✅ <strong>Beacon Verified™ status</strong></li>
                <li>✅ <strong>Beacon Trust Score™ display</strong></li>
                <li>✅ Home Access Certification</li>
                <li>✅ Appointment Management system</li>
                <li>✅ Lead Desk & CRM Desk</li>
                <li>✅ Money Desk & Expense tracking</li>
                <li>✅ Business Health Reports</li>
                <li>✅ Growth Recommendations</li>
                <li>✅ Unlimited Team Users (No seat fees)</li>
              </ul>
            </div>
            <button 
              onClick={() => handleNavClick('join')} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '3rem' }}
            >
              Become A Member
            </button>
          </div>
        </div>
      </section>

      {/* Setup fee explanation & Cost of scattered */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h3 style={{ marginBottom: '1.25rem' }}>Why Is There A Setup Fee?</h3>
            <p>Beacon is not simply software access. Every membership includes hands-on onboarding, profile configuration, local optimization, and direct business setup assistance by our support team.</p>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(218,175,55,0.08)', borderLeft: '4px solid var(--color-gold)', borderRadius: '0 8px 8px 0', margin: '1.5rem 0' }}>
              <span style={{ fontWeight: 600 }}>Standard setup: $199</span><br />
              <span style={{ color: 'var(--color-teal)', fontWeight: 700 }}>Current Promotion: Waived until further notice.</span>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: '1.25rem' }}>The Cost of Staying Scattered</h3>
            <p>The real expense is not the membership. The real expense is operating without systems. Missed inquiries, lost customer details, forgotten follow-up emails, and weak trust signals cost money.</p>
            <p>The question is not: <strong>"Can I afford Beacon?"</strong> The question is: <strong>"How much is disorganization already costing my business?"</strong></p>
          </div>
        </div>
      </section>

      {/* Software Stack Comparison Table */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2>What You Pay to Assemble Similar Capabilities</h2>
            <p>Building this environment with multiple subscriptions vs. one Beacon membership.</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Subscription Category</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Separate Platforms (Est)</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Beacon System</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                <tr style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>CRM & Contact Management</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#DC2626' }}>$150 - $450 /mo</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-teal)', fontWeight: 600 }}>Included</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>Online Booking & Calendars</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#DC2626' }}>$30 - $120 /mo</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-teal)', fontWeight: 600 }}>Included</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>Form Builders & Feedback</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#DC2626' }}>$40 - $150 /mo</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-teal)', fontWeight: 600 }}>Included</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>Broadcast Marketing Systems</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#DC2626' }}>$100 - $350 /mo</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-teal)', fontWeight: 600 }}>Included</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>Task & Expense Managers</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#DC2626' }}>$50 - $180 /mo</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-teal)', fontWeight: 600 }}>Included</td>
                </tr>
                <tr style={{ borderBottom: '2px solid var(--color-navy)', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>Total Cost</td>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#DC2626', fontWeight: 700 }}>$370 - $1,250+ /mo</td>
                  <td style={{ padding: '1.2rem 1.5rem', color: 'var(--color-teal)', fontWeight: 700 }}>$150 /mo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)', display: 'block', marginTop: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>
            Disclaimer: Competitor estimates represent basic, entry-level plans that typically lack advanced capabilities and impose severe user caps or contact limits. To access features comparable to Beacon's built-in advanced system, actual combined competitor costs are significantly higher.
          </span>
        </div>
      </section>

      {/* Who Should Choose What */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2">
          <div>
            <h4 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: '1rem' }}>Choose Free Member Plan If:</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.2rem', color: 'var(--color-gray)' }}>
              <li>You want a basic public business profile.</li>
              <li>You want to display reviews and contact info.</li>
              <li>You want to build category visibility.</li>
              <li>You are not ready for operational software desks.</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-teal)', fontSize: '1.2rem', marginBottom: '1rem' }}>Choose Beacon Membership If:</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.2rem', color: 'var(--color-gray)' }}>
              <li>You want deep trust signals (Verified badge, Trust Score).</li>
              <li>You need calendar systems and client bookings.</li>
              <li>You want a database to organize inquiries and histories.</li>
              <li>You want to work with team members without user penalties.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
