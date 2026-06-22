import React, { useState, useEffect } from 'react';
import { businesses, categories, locations } from '../mockData';
import ListingCard from '../components/ListingCard';

export default function SearchResults({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  locationFilter, 
  setLocationFilter, 
  handleViewProfile, 
  onUpgrade 
}) {
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterHomeAccess, setFilterHomeAccess] = useState(false);
  const [filterOffers, setFilterOffers] = useState(false);
  const [filterWhatsApp, setFilterWhatsApp] = useState(false);
  const [filterBooking, setFilterBooking] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Filter listings based on rules
  const filteredListings = businesses.filter(biz => {
    // 1. Text Search matching name, description, tags, city, or categories
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = biz.business_name.toLowerCase().includes(q);
      const matchDesc = biz.description.toLowerCase().includes(q) || biz.short_description.toLowerCase().includes(q);
      const matchServices = biz.services ? biz.services.some(s => s.toLowerCase().includes(q)) : false;
      const matchCategory = biz.category_id.toLowerCase().includes(q) || biz.subcategory_id.toLowerCase().includes(q);
      
      if (!matchName && !matchDesc && !matchServices && !matchCategory) {
        return false;
      }
    }

    // 2. Category Filter
    if (categoryFilter && biz.category_id !== categoryFilter) {
      return false;
    }

    // 3. Location Filter
    if (locationFilter && biz.location_id !== locationFilter) {
      return false;
    }

    // 4. Boolean Checkbox Filters
    if (filterVerified && biz.verification_status !== 'verified') return false;
    if (filterHomeAccess && !biz.home_access_certified) return false;
    if (filterOffers && !biz.has_offers) return false;
    if (filterWhatsApp && !biz.whatsapp) return false;
    if (filterBooking && !biz.has_booking) return false;

    return true;
  });

  // Sort listings based on choices
  const sortedListings = [...filteredListings].sort((a, b) => {
    // Sponsored and Paid Members bubble up first in 'recommended'
    if (sortBy === 'recommended') {
      const scoreA = (a.is_sponsored ? 10 : 0) + (a.profile_type === 'paid' ? 5 : 0);
      const scoreB = (b.is_sponsored ? 10 : 0) + (b.profile_type === 'paid' ? 5 : 0);
      return scoreB - scoreA;
    }
    if (sortBy === 'highest-rated') {
      return b.review_average - a.review_average;
    }
    if (sortBy === 'most-reviewed') {
      return b.review_count - a.review_count;
    }
    if (sortBy === 'verified-first') {
      const scoreA = a.verification_status === 'verified' ? 1 : 0;
      const scoreB = b.verification_status === 'verified' ? 1 : 0;
      return scoreB - scoreA;
    }
    return 0;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setLocationFilter('');
    setFilterVerified(false);
    setFilterHomeAccess(false);
    setFilterOffers(false);
    setFilterWhatsApp(false);
    setFilterBooking(false);
    setSortBy('recommended');
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'baseline', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', margin: 0 }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Caribbean Business Discovery'}
          </h1>
          <span style={{ color: 'var(--color-gray)', fontSize: '0.95rem' }}>
            Found {sortedListings.length} matching operations
          </span>
        </div>

        {/* Outer Layout Grid */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Filters Sidebar */}
          <aside className="glassmorphism" style={{
            flex: '1 0 280px',
            backgroundColor: 'var(--color-white)',
            padding: '2rem',
            borderRadius: '16px',
            alignSelf: 'flex-start'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-navy)' }}>Filters</h3>
              <span onClick={clearAllFilters} style={{ fontSize: '0.8rem', color: 'var(--color-teal)', cursor: 'pointer', fontWeight: 600 }}>Reset All</span>
            </div>

            {/* Keyword Search */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Keyword</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plumber, salon, etc..."
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', fontSize: '0.9rem' }} 
              />
            </div>

            {/* Category Select */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: 'transparent' }}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Location</label>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: 'transparent' }}
              >
                <option value="">All Locations</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Verification & Certification Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-light-gray)', paddingTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filterVerified} onChange={() => setFilterVerified(!filterVerified)} />
                ✓ Beacon Verified
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filterHomeAccess} onChange={() => setFilterHomeAccess(!filterHomeAccess)} />
                🛡️ Home Access Certified
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filterOffers} onChange={() => setFilterOffers(!filterOffers)} />
                🏷️ Has Active Offers
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filterWhatsApp} onChange={() => setFilterWhatsApp(!filterWhatsApp)} />
                💬 Connected WhatsApp
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filterBooking} onChange={() => setFilterBooking(!filterBooking)} />
                📅 Interactive Booking
              </label>
            </div>
          </aside>

          {/* Results Grid List */}
          <main style={{ flex: '3 0 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Sorting Selection Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-white)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: '1px solid var(--color-light-gray)',
              fontSize: '0.85rem'
            }}>
              <span>Sort Listings:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ border: 'none', backgroundColor: 'transparent', fontWeight: 700, color: 'var(--color-teal)', cursor: 'pointer', outline: 'none' }}
              >
                <option value="recommended">Recommended (Member First)</option>
                <option value="highest-rated">Highest Rated Stars</option>
                <option value="most-reviewed">Most Reviewed Count</option>
                <option value="verified-first">Verified Credentials First</option>
              </select>
            </div>

            {/* List Listings Cards */}
            {sortedListings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sortedListings.map(biz => (
                  <div key={biz.id} style={{ position: 'relative' }}>
                    {/* Sponsored Badge display */}
                    {biz.is_sponsored && (
                      <span style={{
                        position: 'absolute',
                        left: '1.5rem',
                        top: '-10px',
                        backgroundColor: 'var(--color-gold)',
                        color: 'var(--color-navy)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        boxShadow: 'var(--shadow-sm)',
                        zIndex: 10
                      }}>
                        SPONSORED
                      </span>
                    )}
                    <ListingCard biz={biz} onSelect={handleViewProfile} onUpgrade={onUpgrade} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="glassmorphism text-center" style={{ padding: '4rem 2rem', backgroundColor: 'var(--color-white)', borderRadius: '16px' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h3 style={{ color: 'var(--color-navy)', marginTop: '1rem' }}>No Listings Found</h3>
                <p style={{ color: 'var(--color-gray)', maxWidth: '400px', margin: '0.5rem auto 1.5rem auto' }}>
                  We couldn't find matches for your active filters. Try resetting keyword or selection rules.
                </p>
                <button onClick={clearAllFilters} className="btn btn-primary">Reset Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
