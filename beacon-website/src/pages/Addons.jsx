import React from 'react';
import Card from '../components/Card';

export default function Addons({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Growth Add-Ons</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Build The Digital System Your Business Actually Needs</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Not every business needs the same tools. Choose what helps your business now, and add more when you are ready.
          </p>
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'inline-block' }}>
            <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>Notice: Members receive preferred subscription pricing on all add-ons.</span>
          </div>
        </div>
      </section>

      {/* Managed Business Websites */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Growth Add-On 01</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Managed Business Website</h2>
            <p>Your business needs more than a social media page. When customers search, they want details: services, locations, prices, contact methods, and reviews. A professional website coordinates your message in one permanent home.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ padding: '1rem', background: 'var(--color-offwhite)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Member Subscription:</span>
                <h4 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>$25 - $75/mo</h4>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-offwhite)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Non-Member setup:</span>
                <h4 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Starting from $1,500</h4>
              </div>
            </div>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Responsive mobile layouts.</li>
              <li>Lead forms, domain registry, and hosting.</li>
              <li>Beacon Assistant integration and monthly reporting.</li>
            </ul>
          </div>
          <div>
            <Card title="Example Case" content="A plumbing company uses its website to capture quote requests, list active service regions, showcase reviews, and build trust before calls are made." badge="Service Case" style={{ borderLeft: '4px solid var(--color-teal)' }} />
          </div>
        </div>
      </section>

      {/* Ecommerce Store */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <Card title="Example Case" content="A local beauty brand displays its product line, accepts online orders, captures customer emails, and promotes repeat purchases through notifications." badge="Retail Case" style={{ borderLeft: '4px solid var(--color-teal)' }} />
          </div>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Growth Add-On 02</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Ecommerce Store</h2>
            <p>Sell products online without building everything yourself. An ecommerce setup provides a checkout experience, inventory controls, categorized product catalogs, and order tracking dashboards that customer trust.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Member Subscription:</span>
                <h4 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>$79 - $149/mo</h4>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Non-Member setup:</span>
                <h4 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Starting from $3,500</h4>
              </div>
            </div>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Inventory management and categories.</li>
              <li>Secure checkouts and customer accounts.</li>
              <li>Analytics dashboard integrations.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mobile App */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img 
              src="/assets/beacon app image.png" 
              alt="Mobile Application Mockup" 
              style={{ width: '100%', maxWidth: '350px', margin: '0 auto', display: 'block' }} 
            />
          </div>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Growth Add-On 03</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Mobile App Development</h2>
            <p>Some businesses need a direct connection on their customers' devices. A custom mobile app offers client portals, repeat booking pathways, push notifications, and loyalty account integrations.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Member Subscription:</span>
                <h4 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>$49 - $299/mo</h4>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Non-Member setup:</span>
                <h4 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Starting from $7,500</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
