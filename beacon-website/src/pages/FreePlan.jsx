import React from 'react';
import Card from '../components/Card';

export default function FreePlan({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Free Member Plan</span>
          <h1 style={{ fontSize: '3.25rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Every Business Deserves To Be Found</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', marginBottom: '2rem' }}>
            Get your business online with a professional presence, reviews board, and direct contact options. Absolutely $0/month.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => handleNavClick('join')} className="btn btn-primary">Start Free Now</button>
            <button onClick={() => handleNavClick('pricing')} className="btn btn-secondary" style={{ borderColor: 'var(--color-teal-light)', color: 'var(--color-teal-light)' }}>View Membership</button>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Many Good Businesses Are Difficult To Find</h2>
            <p>The problem is rarely quality, it is visibility. A customer hears about your service. A friend recommends you. A social media post is shared. Then they search for details.</p>
            <p>They cannot find your phone number, WhatsApp contact link, location, opening hours, list of services, or reviews. They get frustrated, move on, and you lose the business.</p>
            <p>The Free Member Plan provides one organized business profile that holds all your information in one professional hub.</p>
          </div>
          <div>
            <Card title="Missing Coordinates?" content="Do customers struggle to find your hours or correct numbers? A profile links everything: social pages, websites, reviews, and a direct WhatsApp messaging route." icon="🎯" />
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>What's Included in the $0 Plan</h2>
            <p>A solid foundation for local visibility and basic trust building.</p>
          </div>
          <div className="grid-3">
            <Card title="Beacon Profile™" content="A clean page to show who you are, what you offer, where you operate, and how to contact you." icon="📄" />
            <Card title="WhatsApp Integration" content="A direct WhatsApp link on your profile, letting Caribbean clients message you instantly." icon="💬" />
            <Card title="Customer Reviews" content="Start collecting client feedback and displaying verified reviews to show credibility." icon="⭐" />
            <Card title="Claimed Status" content="Show clients that your information is actively managed and updated." icon="✓" />
            <Card title="Category Search" content="Appear under relevant service categories (e.g. plumber, tutor, electrician) in searches." icon="🔍" />
            <Card title="Web & Social Links" content="Connect your Facebook, Instagram, website, or email in one central discovery hub." icon="🔗" />
          </div>
        </div>
      </section>

      {/* Free vs Membership */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2">
          <div>
            <h3>Free Plan Focuses on Visibility</h3>
            <p>Perfect for new or small operations that want to get found. Helps establish an online presence, show customer reviews, and make it easy to contact the owner directly.</p>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>$0/mo</span>
          </div>
          <div>
            <h3>Membership Focuses on Growth</h3>
            <p>Designed for businesses ready to operate better. Unlocks verification badges, Trust Score calculations, Home Access certificates, calendar bookings, CRM databases, reports, and growth recommendations.</p>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-teal)' }}>$150/mo</span>
          </div>
        </div>
      </section>

      {/* Why Free */}
      <section className="gradient-bg-teal" style={{ padding: '5rem 0', color: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: '1.5rem' }}>Every Business Deserves A Fair Starting Point</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem' }}>
            We believe better businesses create stronger communities, and stronger communities create stronger economies. The Free Member Plan removes barriers, letting you build online visibility without immediate financial commitments.
          </p>
        </div>
      </section>
    </div>
  );
}
