import React, { useState } from 'react';
import { categories, subcategories, locations, businesses, offers, spotlights, events, professionals } from '../mockData';
import ListingCard from '../components/ListingCard';

// 1. CATEGORIES PAGE
export function CategoriesPage({ setRoute, setCategoryFilter }) {
  const handleSelectCategory = (catId) => {
    setCategoryFilter(catId);
    setRoute('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>Explore Business Categories</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Explore popular sectors across Trinidad & Tobago to find exactly what you need.
        </p>

        <div className="grid-3" style={{ gap: '2rem' }}>
          {categories.map(cat => {
            const subs = subcategories.filter(s => s.categoryId === cat.id);
            return (
              <div 
                key={cat.id} 
                className="glassmorphism" 
                style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '16px' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
                <h3 
                  onClick={() => handleSelectCategory(cat.id)}
                  style={{ color: 'var(--color-navy)', cursor: 'pointer', marginBottom: '1rem' }}
                >
                  {cat.name}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
                  {subs.map(s => (
                    <li 
                      key={s.id} 
                      style={{ cursor: 'pointer', hoverColor: 'var(--color-teal)' }}
                      onClick={() => handleSelectCategory(cat.id)}
                    >
                      • {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 2. LOCATIONS PAGE
export function LocationsPage({ setRoute, setLocationFilter }) {
  const handleSelectLocation = (locId) => {
    setLocationFilter(locId);
    setRoute('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>Browse Locations</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Find trusted professionals and businesses near you, sorted by Caribbean cities and municipalities.
        </p>

        <div className="grid-3">
          {locations.map(loc => {
            const bizCount = businesses.filter(b => b.location_id === loc.id).length;
            return (
              <div 
                key={loc.id} 
                className="glassmorphism" 
                style={{ 
                  padding: '2rem', 
                  backgroundColor: 'var(--color-white)', 
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => handleSelectLocation(loc.id)}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>📍</div>
                <h3 style={{ color: 'var(--color-navy)', margin: '0 0 0.5rem 0' }}>{loc.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{loc.region}</span>
                <div style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                  {bizCount} Listings Available
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 3. OFFERS PAGE
export function OffersPage({ setRoute, handleViewProfile }) {
  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Offers & Promotions</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Save on services, dining, and retail specials from verified Beacon members.
        </p>

        <div className="grid-3">
          {offers.map(off => {
            const biz = businesses.find(b => b.id === off.business_id);
            return (
              <div 
                key={off.id}
                className="glassmorphism"
                style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', borderRadius: '16px', overflow: 'hidden' }}
              >
                <img src={off.image} alt={off.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {biz ? biz.business_name : 'Featured Promo'}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.75rem', lineHeight: '1.4' }}>{off.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '1.25rem', flex: 1 }}>{off.description}</p>
                  
                  <div style={{ backgroundColor: 'var(--color-offwhite)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
                    <strong>Terms:</strong> {off.terms}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button 
                      onClick={() => handleViewProfile(off.business_id)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {off.cta_label}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 4. SPOTLIGHTS PAGE
export function SpotlightsPage({ handleViewProfile }) {
  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Business Spotlights</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Go behind the brand. Hear the stories, visions, and missions of Caribbean founders.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {spotlights.map(spot => {
            const biz = businesses.find(b => b.id === spot.business_id);
            return (
              <div 
                key={spot.id}
                className="glassmorphism grid-2"
                style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', overflow: 'hidden', alignItems: 'center' }}
              >
                <img src={spot.image} alt={spot.title} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                <div style={{ padding: '3rem' }}>
                  <span style={{ color: 'var(--color-teal)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {spot.category}
                  </span>
                  <h2 style={{ color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '1.8rem' }}>{spot.title}</h2>
                  <p style={{ color: 'var(--color-gray)', lineHeight: '1.7', marginBottom: '2rem' }}>{spot.story}</p>
                  
                  <button 
                    onClick={() => handleViewProfile(spot.business_id)}
                    className="btn btn-secondary"
                  >
                    Read Profile & Contact {biz ? biz.business_name : 'Founder'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 5. EVENTS PAGE
export function EventsPage() {
  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Webinars & Business Events</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Participate in monthly growth webinars and training sessions designed to elevate your Caribbean operation.
        </p>

        <div className="grid-2">
          {events.map(evt => (
            <div 
              key={evt.id}
              className="glassmorphism"
              style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', borderTop: '4px solid var(--color-teal)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(0,166,178,0.1)', color: 'var(--color-teal)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  {evt.is_member_only ? 'Beacon Member Only' : 'Open to Public'}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600 }}>{evt.date} • {evt.time}</span>
              </div>
              <h3 style={{ color: 'var(--color-navy)', fontSize: '1.35rem', marginBottom: '0.5rem' }}>{evt.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                Led by: {evt.speaker}
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-navy)', marginBottom: '2rem' }}>{evt.description}</p>
              
              <a 
                href={evt.registration_url} 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Register For Event
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. PROFESSIONAL PROFILE PAGE
export function ProfessionalProfilePage({ profId, setRoute, handleViewProfile }) {
  const prof = professionals.find(p => p.id === profId) || professionals[0];
  const linkedBiz = businesses.find(b => b.id === prof.business_id);

  return (
    <div style={{ padding: '5rem 0', minHeight: '70vh' }}>
      <div className="container">
        <button 
          onClick={() => setRoute('search')}
          style={{ color: 'var(--color-teal)', fontWeight: 600, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          ← Back to Discovery
        </button>

        <div className="glassmorphism grid-2" style={{ padding: '3.5rem', backgroundColor: 'var(--color-white)', borderRadius: '24px', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src={prof.photo} 
              alt={prof.name} 
              style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--color-teal)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }} 
            />
            <h2 style={{ color: 'var(--color-navy)', marginBottom: '0.25rem' }}>{prof.name}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-teal)', fontWeight: 600, margin: 0 }}>{prof.role}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', fontStyle: 'italic' }}>{prof.location}</p>

            {linkedBiz && (
              <div 
                style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  backgroundColor: 'var(--color-offwhite)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--color-light-gray)' 
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gray)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Connected Business
                </span>
                <h4 style={{ color: 'var(--color-navy)', margin: '0 0 0.5rem 0' }}>{linkedBiz.business_name}</h4>
                <button 
                  onClick={() => handleViewProfile(linkedBiz.id)}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                >
                  View Business Profile
                </button>
              </div>
            )}
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Professional Blueprint</span>
            <h2 style={{ color: 'var(--color-navy)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>Meet The Professional Behind The Business</h2>
            
            <h4 style={{ color: 'var(--color-navy)', marginBottom: '0.5rem' }}>About</h4>
            <p style={{ color: 'var(--color-gray)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{prof.bio}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h5 style={{ color: 'var(--color-navy)', marginBottom: '0.25rem' }}>Experience</h5>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-gray)' }}>{prof.experience}</span>
              </div>
              <div>
                <h5 style={{ color: 'var(--color-navy)', marginBottom: '0.25rem' }}>Credentials</h5>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-gray)' }}>{prof.credentials}</span>
              </div>
            </div>

            <h4 style={{ color: 'var(--color-navy)', marginBottom: '0.75rem' }}>Specialties</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
              {prof.specialties.map((spec, idx) => (
                <span key={idx} style={{ fontSize: '0.8rem', backgroundColor: 'rgba(0,166,178,0.06)', color: 'var(--color-teal)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 600 }}>
                  {spec}
                </span>
              ))}
            </div>

            {prof.booking_link_optional && (
              <a 
                href={prof.booking_link_optional} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                📅 Schedule Booking
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. VERIFIED BUSINESSES PAGE
export function VerifiedBusinessesPage({ handleViewProfile, onUpgrade }) {
  const verifiedList = businesses.filter(b => b.verification_status === 'verified');
  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Verified Businesses</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Explore businesses that have verified their registration status, identity checks, and location coordinates.
        </p>

        <div className="grid-2">
          {verifiedList.map(biz => (
            <ListingCard key={biz.id} biz={biz} onSelect={handleViewProfile} onUpgrade={onUpgrade} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 8. HOME ACCESS CERTIFIED PAGE
export function HomeAccessCertifiedPage({ handleViewProfile, onUpgrade }) {
  const safetyList = businesses.filter(b => b.home_access_certified);
  return (
    <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Home Access Certified™</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Plumbers, electricians, cleaners, and tutors certified for safe home access.
        </p>

        <div className="grid-2">
          {safetyList.map(biz => (
            <ListingCard key={biz.id} biz={biz} onSelect={handleViewProfile} onUpgrade={onUpgrade} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. ADVERTISE PAGE
export function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);
  const handleForm = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '5rem 0', minHeight: '60vh' }}>
      <div className="container grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
        <div>
          <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Advertising Placements</span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Promote Your Business Inside Find</h1>
          <p style={{ color: 'var(--color-gray)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Increase search visibility, sponsor targeted categories, or feature your promotion directly on the homepage banner.
          </p>
          <ul style={{ display: 'grid', gap: '0.75rem', listStyle: 'none', color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.95rem' }}>
            <li>✓ Homepage Featured Banners</li>
            <li>✓ Category & Location Sponsorships</li>
            <li>✓ Promoted Search Results</li>
            <li>✓ Business of the Week Articles</li>
          </ul>
        </div>

        <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span style={{ fontSize: '3rem' }}>🎉</span>
              <h3 style={{ color: 'var(--color-navy)', marginTop: '1rem' }}>Request Submitted</h3>
              <p style={{ color: 'var(--color-gray)' }}>Our partnerships team will reach out to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ color: 'var(--color-navy)', margin: 0 }}>Request Advertising Deck</h3>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Contact Name</label>
                <input required type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Business Name</label>
                <input required type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                <input required type="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Target Placement</label>
                <select style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }}>
                  <option>Category Sponsorship</option>
                  <option>Homepage Banner</option>
                  <option>Promoted Listing</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Request</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// 10. CLAIM BUSINESS PAGE
export function ClaimPage({ onClaimSubmit }) {
  const [searchWord, setSearchWord] = useState('');
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  const unclaimedList = businesses.filter(b => 
    b.claimed_status === 'unclaimed' && 
    b.business_name.toLowerCase().includes(searchWord.toLowerCase())
  );

  const handleClaim = (e) => {
    e.preventDefault();
    if (selectedBiz) {
      onClaimSubmit(selectedBiz.id);
      setClaimedSuccess(true);
    }
  };

  return (
    <div style={{ padding: '5rem 0', minHeight: '65vh' }}>
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="glassmorphism" style={{ padding: '3rem', backgroundColor: 'var(--color-white)', borderRadius: '20px' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🏢</span>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Claim Your Business Profile</h1>
            <p style={{ color: 'var(--color-gray)' }}>Update your contact information, reply to reviews, and manage how you are discovered.</p>
          </div>

          {claimedSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span style={{ fontSize: '3rem' }}>✓</span>
              <h3 style={{ color: 'var(--color-navy)', marginTop: '1rem' }}>Claim Request Submitted</h3>
              <p style={{ color: 'var(--color-gray)' }}>Our support team will verify your credentials and link the profile to your dashboard.</p>
            </div>
          ) : (
            <div>
              {!selectedBiz ? (
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Search for your business listing</label>
                  <input 
                    type="text" 
                    placeholder="Type name (e.g. Green Coast Cleaners)" 
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', marginBottom: '1.5rem' }} 
                  />
                  
                  {searchWord && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', maxHeight: '180px', overflowY: 'auto', padding: '0.5rem' }}>
                      {unclaimedList.length > 0 ? (
                        unclaimedList.map(b => (
                          <div 
                            key={b.id} 
                            onClick={() => setSelectedBiz(b)}
                            style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--color-offwhite)' }}
                          >
                            <strong>{b.business_name}</strong>
                            <span style={{ color: 'var(--color-teal)', fontSize: '0.85rem' }}>Select →</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '1rem', color: 'var(--color-gray)', textAlign: 'center' }}>No unclaimed matches found.</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ backgroundColor: 'var(--color-offwhite)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-light-gray)' }}>
                    <span>Selected listing:</span>
                    <h4 style={{ margin: '0.25rem 0', color: 'var(--color-navy)' }}>{selectedBiz.business_name}</h4>
                    <span onClick={() => setSelectedBiz(null)} style={{ color: 'var(--color-red)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Change Listing</span>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Your Full Name</label>
                    <input required type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Business Email</label>
                    <input required type="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Proof of ownership notes (e.g. Utility bill, Business ID)</label>
                    <textarea required rows="3" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Claim Request</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. JOIN BEACON PAGE
export function JoinPage() {
  return (
    <div style={{ padding: '5rem 0', minHeight: '60vh', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Ready For Growth?</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Claim Your Business Engine</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--color-gray)', lineHeight: '1.7', marginBottom: '3rem' }}>
          Get listed on Find to capture opportunities. Upgrade to a full membership to unlock automated enquiries, appointment calendars, review prompts, and the **Beacon Business Command Center™**.
        </p>

        <div className="grid-2" style={{ gap: '2.5rem', textAlign: 'left' }}>
          <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px' }}>
            <h3 style={{ color: 'var(--color-navy)' }}>Beacon Profile</h3>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', display: 'block', margin: '0.5rem 0' }}>$0 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-gray)' }}>/ month</span></span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '2rem' }}>Help customers find your basic contact details online.</p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              <li>Listing with category & location</li>
              <li>Phone, email, social links</li>
              <li>WhatsApp connection button</li>
              <li>Standard search result listing</li>
            </ul>
            <button className="btn btn-outline" style={{ width: '100%' }}>Create Free Profile</button>
          </div>

          <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', border: '2px solid var(--color-teal)' }}>
            <h3 style={{ color: 'var(--color-navy)' }}>Beacon Membership</h3>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-teal)', display: 'block', margin: '0.5rem 0' }}>$150 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-gray)' }}>/ month</span></span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '2rem' }}>Deeper trust, higher conversions, 14 growth desks.</p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              <li><strong>Beacon Verified Badge</strong> eligibility</li>
              <li><strong>Home Access Badge</strong> eligibility</li>
              <li>Interactive Booking & Quote buttons</li>
              <li>Photo galleries & full service menus</li>
              <li>Full <strong>Business Command Center</strong> access</li>
            </ul>
            <a href="https://caribbeacon.com/join" className="btn btn-primary" style={{ width: '100%' }}>Get Command Center</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 12. SAFETY GUIDE PAGE
export function SafetyPage() {
  return (
    <div style={{ padding: '5rem 0', minHeight: '65vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>Safety & Hiring Guide</h1>
        <p style={{ color: 'var(--color-gray)', fontSize: '1.1rem', marginBottom: '3rem' }}>
          Important guidance on selecting, comparing, and hiring professionals to work in your private property or business space.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glassmorphism" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--color-navy)' }}>1. Look for Verification Signals</h3>
            <p style={{ margin: 0 }}>
              Profiles holding a <strong>Verified Badge</strong> have submitted registration checks, structural documentation, and identity records. For home services (cleaners, electricians), favor listings that hold the **Home Access Certification** safety status.
            </p>
          </div>

          <div className="glassmorphism" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--color-navy)' }}>2. Review Past Ratings & History</h3>
            <p style={{ margin: 0 }}>
              Look at recent customer feedback. Pay attention to how the business responds to inquiries and reviews. Stronger response indicators on profiles show the business values customer communication.
            </p>
          </div>

          <div className="glassmorphism" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--color-navy)' }}>3. Request Quotes & Scope in Writing</h3>
            <p style={{ margin: 0 }}>
              Use the **Request Quote** button on member profiles to gather formal project estimates. Always lock down scopes, payment milestones, and delivery expectations in writing before starting work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 13. HELP / FAQ PAGE
export function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "What is the difference between Verified and Claimed?", a: "A Claimed profile means the owner has taken control of the listing. A Verified profile means they have submitted formal documents (business registration, IDs) which have been manually checked by the Beacon administration." },
    { q: "How is the Trust Score calculated?", a: "Trust Score is based on profile completeness, response latency, complaint history resolution rates, and verified customer review counts." },
    { q: "What is the Home Access Certification?", a: "It is an enhanced check for operators entering private residences (e.g. cleaners, plumbers). It confirms active trade licenses, clean background declarations, and consistent customer resolution logs." }
  ];

  return (
    <div style={{ padding: '5rem 0', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: '750px' }}>
        <h1 className="text-center" style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginBottom: '3rem' }}>Help Center & FAQ</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="glassmorphism"
              style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '10px', cursor: 'pointer' }}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ color: 'var(--color-navy)', margin: 0 }}>{faq.q}</h4>
                <span>{openIndex === idx ? '▲' : '▼'}</span>
              </div>
              {openIndex === idx && (
                <p style={{ marginTop: '1rem', color: 'var(--color-gray)', margin: '1rem 0 0 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 14. CONTACT PAGE
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '5rem 0', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glassmorphism" style={{ padding: '3rem', backgroundColor: 'var(--color-white)', borderRadius: '20px' }}>
          <h2 style={{ color: 'var(--color-navy)', marginBottom: '1.5rem' }}>Contact Find Support</h2>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span style={{ fontSize: '3rem' }}>✉️</span>
              <h3 style={{ color: 'var(--color-navy)', marginTop: '1rem' }}>Message Sent Successfully</h3>
              <p style={{ color: 'var(--color-gray)' }}>Our support team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input required type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input required type="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Message</label>
                <textarea required rows="4" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
