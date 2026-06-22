import React from 'react';
import Card from '../components/Card';

export default function Trust({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Trust Infrastructure</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Trust Should Be Earned. Trust Should Also Be Visible.</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Most customers make trust decisions before they make buying decisions. Before they call, quote, book, or invite you in. Beacon makes trust visible.
          </p>
        </div>
      </section>

      {/* Why Trust Matters */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Trust Is The Difference Between Being Contacted & Ignored</h2>
            <p>Imagine two businesses offering the same service. Same price, same location, same experience. One has verified credentials, visible reviews, and a Trust Score badge. The other does not. Which one gets selected first?</p>
            <p>Most customers choose the business that feels safer. That is why trust is not simply a marketing issue, it is a core business asset.</p>
          </div>
          <div>
            <img 
              src="/assets/home access handshake.png" 
              alt="Trust and Verification Handshake" 
              style={{ width: '100%', display: 'block' }} 
            />
          </div>
        </div>
      </section>

      {/* Beacon Verified & Badging */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img 
              src="/assets/beacon badges.png" 
              alt="Beacon Badging System" 
              style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'block' }} 
            />
          </div>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Verified Status</span>
            <h2 style={{ marginTop: '0.5rem' }}>What Is Beacon Verified™?</h2>
            <p>Beacon Verified™ is a badge awarded to businesses that have completed our verified review steps. We verify identity registration, contact coordinates, business status, and profile completeness.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', borderLeft: '3px solid var(--color-gold)', paddingLeft: '1rem', fontStyle: 'italic' }}>
              Important clarification: Verification is a trust indicator designed to assist customer decisions. It is not a legal guarantee of service quality, satisfaction, or competency. Customers must always use good judgment.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Steps */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>How Verification Works</h2>
            <p>A simple, structured, and transparent process for qualifying members.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--color-offwhite)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '0.5rem' }}>01</div>
              <strong>Application</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>Submit documents inside panel.</p>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--color-offwhite)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '0.5rem' }}>02</div>
              <strong>Identity Review</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>Owner identity confirmed.</p>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--color-offwhite)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '0.5rem' }}>03</div>
              <strong>Business Review</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>Operations information checked.</p>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--color-offwhite)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '0.5rem' }}>04</div>
              <strong>Assessment</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>Information is validated.</p>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--color-offwhite)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '0.5rem' }}>05</div>
              <strong>Approval</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>Verified status is unlocked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Components */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>Introducing Beacon Trust Score™</h2>
            <p>A transparent trust rating system to evaluate businesses at a glance.</p>
          </div>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h3>Trust Score Components (Max 100)</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>👤 Identity Verification</span><strong>20 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>🏢 Business Verification</span><strong>15 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>📋 Profile Completeness</span><strong>10 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>⭐ Customer Reviews</span><strong>20 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>📈 Review Quality</span><strong>10 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>⚡ Responsiveness</span><strong>10 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>🔌 Platform Activity</span><strong>5 Points</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>
                  <span>🤝 Complaint Resolution</span><strong>10 Points</strong>
                </li>
              </ul>
            </div>
            <div>
              <div style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
                <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Trust Levels</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderLeft: '4px solid var(--color-teal)', paddingLeft: '1rem' }}>
                    <div><strong>Platinum Trust</strong><p style={{ margin: 0, fontSize: '0.8rem' }}>Exceptional standard</p></div>
                    <span style={{ fontWeight: 700, color: 'var(--color-teal)' }}>90 - 100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderLeft: '4px solid var(--color-gold)', paddingLeft: '1rem' }}>
                    <div><strong>Gold Trust</strong><p style={{ margin: 0, fontSize: '0.8rem' }}>Strong indicator</p></div>
                    <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>75 - 89</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderLeft: '4px solid var(--color-gray)', paddingLeft: '1rem' }}>
                    <div><strong>Verified Trust</strong><p style={{ margin: 0, fontSize: '0.8rem' }}>Core requirements met</p></div>
                    <span style={{ fontWeight: 700, color: 'var(--color-gray)' }}>60 - 74</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Access Certification */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Enhanced Safety</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Beacon Home Access Certified™</h2>
            <p>Some businesses enter places that matter most, homes, family areas, and private property. Customers deserve more confidence when making those decisions. This enhanced trust certification checks identities, operational status, proof of service operations, and complaint participation history.</p>
            <p>Essential for Plumbers, Electricians, Installers, Cleaners, and Caregivers entering private spaces.</p>
          </div>
          <div>
            <Card title="Required Documentation" content="Identity verification checks, business structure details, category assessment reviews, and periodic re-verification criteria." icon="📄" />
          </div>
        </div>
      </section>
    </div>
  );
}
