import React, { useState } from 'react';
import { categories, subcategories, businesses, offers, spotlights, locations } from '../mockData';

export default function Home({ setRoute, setCategoryFilter, setLocationFilter, setSearchQuery, handleViewProfile }) {
  const [query, setQuery] = useState('');
  const [locVal, setLocVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(query);
    setLocationFilter(locVal);
    setRoute('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickChip = (catId) => {
    setCategoryFilter(catId);
    setRoute('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredBiz = businesses.filter(b => b.is_featured);
  const trendingOffers = offers.slice(0, 3);
  const meetFounders = spotlights.slice(0, 2);

  return (
    <div>
      {/* Hero Search Section */}
      <section style={{ 
        padding: '7rem 0 5rem 0', 
        backgroundColor: 'var(--color-navy)', 
        color: 'var(--color-white)', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glowing radial background */}
        <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,178,0.25) 0%, transparent 70%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="text-center" style={{ maxWidth: '850px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3.2rem', marginBottom: '1.25rem', fontFamily: 'var(--font-headings)' }}>
              Find the right Caribbean business faster.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: '1.6' }}>
              Search by service, location, category, reviews, business details, and verification signals.
            </p>

            {/* Giant Search Bar Grid */}
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              flexWrap: 'wrap',
              backgroundColor: 'var(--color-white)',
              padding: '0.5rem',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              gap: '0.5rem',
              marginBottom: '2rem',
              alignItems: 'center'
            }}>
              <div style={{ flex: 2, minWidth: '220px', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
                <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="What service are you looking for?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', color: 'var(--color-navy)', fontSize: '1rem' }} 
                />
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-light-gray)' }} className="search-divider"></div>
              <div style={{ flex: 1.2, minWidth: '180px', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
                <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>📍</span>
                <select 
                  value={locVal} 
                  onChange={(e) => setLocVal(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', color: 'var(--color-navy)', fontSize: '1rem', cursor: 'pointer' }}
                >
                  <option value="">Where do you need it?</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', borderRadius: '8px' }}>
                Find Businesses
              </button>
            </form>

            {/* Quick Search Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginRight: '0.5rem' }}>Quick Search:</span>
              <span onClick={() => handleQuickChip('home-services')} style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-white)', padding: '0.35rem 0.85rem', borderRadius: '20px', cursor: 'pointer' }}>Home Services</span>
              <span onClick={() => handleQuickChip('beauty-care')} style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-white)', padding: '0.35rem 0.85rem', borderRadius: '20px', cursor: 'pointer' }}>Beauty & Care</span>
              <span onClick={() => handleQuickChip('food-hospitality')} style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-white)', padding: '0.35rem 0.85rem', borderRadius: '20px', cursor: 'pointer' }}>Hospitality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Search Smarter</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-navy)' }}>Not Every Search Should Feel Like A Guess</h2>
            <p>Customers often search for businesses through social media, old posts, forwarded numbers, and random recommendations. That can work. But it can also be confusing.</p>
            <p>Is the business active? Are the contact details correct? Do they respond? Do customers recommend them? Is their information verified?</p>
            <p><strong>Find by Beacon</strong> helps customers make more informed choices by bringing business information, reviews, contact options, service details, profile updates, and verification signals into one organized place.</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-offwhite)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-light-gray)' }}>
            <h4 style={{ color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Make Confident Choices</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                <div>
                  <strong>Beacon Verified™ status</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Indicates verified registration status and credentials check.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🏡</span>
                <div>
                  <strong>Home Access Certified™</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Enhanced vetting for businesses working inside private spaces.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Browse Directory</span>
            <h2 style={{ marginTop: '0.5rem' }}>Explore Popular Categories</h2>
          </div>
          <div className="grid-3">
            {categories.slice(0, 6).map(cat => (
              <div 
                key={cat.id} 
                className="glassmorphism" 
                style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => handleQuickChip(cat.id)}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', margin: '0' }}>{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses & Offers Sticky Sections */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--color-navy)', margin: 0 }}>Featured Members This Week</h2>
            <span onClick={() => { setRoute('verified'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--color-teal)', fontWeight: 600, cursor: 'pointer' }}>View All Verified →</span>
          </div>
          <div className="grid-2">
            {featuredBiz.slice(0, 4).map(biz => (
              <div 
                key={biz.id}
                className="glassmorphism"
                style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', backgroundColor: 'var(--color-white)', borderRadius: '16px', cursor: 'pointer' }}
                onClick={() => handleViewProfile(biz.id)}
              >
                <div style={{ fontSize: '2.5rem', width: '64px', height: '64px', borderRadius: '12px', backgroundColor: 'var(--color-offwhite)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                  {biz.logo || '🏢'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', margin: '0 0 0.25rem 0' }}>{biz.business_name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600 }}>{biz.city} • Verified Member</span>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-gray)' }}>{biz.short_description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Offers Slider/Grid */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--color-navy)', margin: 0 }}>Active Offers & Promotions</h2>
            <span onClick={() => { setRoute('offers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--color-teal)', fontWeight: 600, cursor: 'pointer' }}>View All Coupons →</span>
          </div>
          <div className="grid-3">
            {trendingOffers.map(off => (
              <div 
                key={off.id}
                className="glassmorphism"
                style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => handleViewProfile(off.business_id)}
              >
                <img src={off.image} alt={off.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <h4 style={{ color: 'var(--color-navy)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{off.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', margin: 0 }}>{off.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Spotlight Stories */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Local Stories</span>
            <h2 style={{ marginTop: '0.5rem' }}>Founder Spotlights</h2>
          </div>
          <div className="grid-2">
            {meetFounders.map(spot => (
              <div 
                key={spot.id} 
                className="glassmorphism grid-2" 
                style={{ backgroundColor: 'var(--color-offwhite)', borderRadius: '16px', overflow: 'hidden', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleViewProfile(spot.business_id)}
              >
                <img src={spot.image} alt={spot.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)' }}>{spot.category}</span>
                  <h4 style={{ color: 'var(--color-navy)', margin: '0.25rem 0 0.5rem 0', fontSize: '1.1rem' }}>{spot.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-gray)', lineHeight: '1.5' }}>{spot.story.slice(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claim / Start Free Conversion */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ color: 'var(--color-gold)', fontSize: '2.2rem', marginBottom: '1.25rem' }}>Is Your Business Already Listed?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Claim your profile to manage your information, update your contact details, collect reviews, and improve how customers see your business.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setRoute('claim'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Claim Your Business</button>
            <button onClick={() => { setRoute('join'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-outline" style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'var(--color-white)', background: 'transparent' }}>Start Free Listing</button>
          </div>
        </div>
      </section>
    </div>
  );
}
