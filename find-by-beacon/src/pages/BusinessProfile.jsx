import React, { useState } from 'react';
import { businesses, professionals, reviews as initialReviews } from '../mockData';

export default function BusinessProfile({ bizId, setRoute, setProfessionalId, onUpgrade }) {
  const biz = businesses.find(b => b.id === bizId) || businesses[0];
  const isPaid = biz.profile_type === 'paid';

  // Linked Professional
  const linkedProf = professionals.find(p => p.business_id === biz.id);

  // States
  const [reviewsList, setReviewsList] = useState(initialReviews.filter(r => r.business_id === biz.id));
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [bookingModal, setBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [quoteModal, setQuoteModal] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReviewText && newReviewName) {
      const newReview = {
        id: `new-rev-${Date.now()}`,
        business_id: biz.id,
        reviewer_name: newReviewName,
        rating: Number(newRating),
        review_text: newReviewText,
        created_at: new Date().toISOString().split('T')[0]
      };
      setReviewsList([newReview, ...reviewsList]);
      setNewReviewText('');
      setNewReviewName('');
      setReviewSubmitted(true);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const handleQuote = (e) => {
    e.preventDefault();
    setQuoteSuccess(true);
  };

  const handleProfClick = (profId) => {
    setProfessionalId(profId);
    setRoute('professional-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '90vh' }}>
      <div className="container">
        {/* Back navigation */}
        <button 
          onClick={() => { setRoute('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ color: 'var(--color-teal)', fontWeight: 600, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          ← Back to Search
        </button>

        {/* PROFILE HEADER (Free vs Paid Premium Visual Design Difference) */}
        <div 
          className="glassmorphism"
          style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '24px',
            border: isPaid ? '2.5px solid var(--color-teal)' : '1px solid var(--color-light-gray)',
            overflow: 'hidden',
            marginBottom: '3rem',
            position: 'relative'
          }}
        >
          {/* Cover Area (Only for Paid Members) */}
          {isPaid ? (
            <div style={{
              height: '240px',
              background: `linear-gradient(to bottom, rgba(10,29,61,0.6), rgba(10,29,61,0.9)), url(${biz.gallery_images ? biz.gallery_images[0] : ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2rem',
              color: 'var(--color-white)'
            }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ fontSize: '3rem', width: '80px', height: '80px', borderRadius: '16px', backgroundColor: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-teal)' }}>
                  {biz.logo || '🏢'}
                </div>
                <div>
                  <h1 style={{ color: 'var(--color-white)', margin: '0 0 0.5rem 0', fontSize: '2.2rem' }}>{biz.business_name}</h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <span className="badge-verified">✓ Verified Member</span>
                    {biz.home_access_certified && (
                      <span className="badge-homeaccess">🛡️ Home Access Certified</span>
                    )}
                    <span>{biz.city}, Trinidad & Tobago</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '2.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', borderBottom: '1px solid var(--color-light-gray)' }}>
              <div style={{ fontSize: '3rem', width: '70px', height: '70px', borderRadius: '12px', backgroundColor: 'var(--color-offwhite)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {biz.logo || '🏢'}
              </div>
              <div>
                <h1 style={{ color: 'var(--color-navy)', margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>{biz.business_name}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                  <span>{biz.city}, {biz.country}</span>
                  <span>•</span>
                  <span>Unclaimed Listing</span>
                </div>
              </div>
              <button 
                onClick={() => onUpgrade(biz)}
                className="btn btn-primary" 
                style={{ marginLeft: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
              >
                Claim This Profile
              </button>
            </div>
          )}

          {/* Profile Quick Contact Buttons Strip */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: '1.5rem 2rem',
            backgroundColor: 'var(--color-offwhite)',
            borderTop: isPaid ? 'none' : '1px solid var(--color-light-gray)',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <a href={`tel:${biz.phone}`} className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>📞 Call: {biz.phone}</a>
            {biz.whatsapp && (
              <a href={biz.whatsapp} target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: 'var(--color-white)', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>💬 WhatsApp</a>
            )}
            {biz.website && (
              <a href={biz.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>🔗 Visit Website</a>
            )}

            {isPaid && (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                {biz.has_booking && (
                  <button onClick={() => setBookingModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>Book Online</button>
                )}
                {biz.has_quote_request && (
                  <button onClick={() => setQuoteModal(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>Request Quote</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TWO-COLUMN PROFILE CONTENT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          {/* Main Content Area */}
          <div>
            {/* Overview / Description */}
            <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--color-navy)', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Business Overview</h3>
              <p style={{ color: 'var(--color-navy)', lineHeight: '1.7', fontSize: '1rem' }}>{biz.description}</p>
            </div>

            {/* Updates Block (Paid only) */}
            {isPaid && biz.updates && (
              <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'rgba(0,166,178,0.03)', border: '1px solid rgba(0,166,178,0.2)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-teal)', marginBottom: '1rem' }}>📣 Member Announcement</h3>
                <p style={{ color: 'var(--color-navy)', margin: 0, fontWeight: 500, fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {biz.updates}
                </p>
              </div>
            )}

            {/* Services List (Paid only) */}
            {isPaid && biz.services && (
              <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-navy)', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Services Offered</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {biz.services.map((svc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--color-navy)' }}>
                      <span style={{ color: 'var(--color-teal)' }}>✓</span>
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Images (Paid only) */}
            {isPaid && biz.gallery_images && (
              <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-navy)', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Photo Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {biz.gallery_images.map((img, idx) => (
                    <img key={idx} src={img} alt="Gallery item" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordions (Paid only) */}
            {isPaid && biz.faqs && (
              <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-navy)', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Frequently Asked Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {biz.faqs.map((faq, idx) => (
                    <div key={idx} style={{ padding: '1rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: '0.5rem' }}>Q: {faq.q}</strong>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-gray)' }}>A: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="glassmorphism" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--color-navy)', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>Customer Reviews</h3>

              {/* Review Input */}
              {reviewSubmitted ? (
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(56,161,105,0.06)', border: '1px solid var(--color-green)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--color-green)', margin: 0 }}>Review Submitted Successfully!</h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Thank you for helping others make more informed choices.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--color-navy)', margin: 0 }}>Leave a Review</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <input 
                      required 
                      type="text" 
                      placeholder="Your Name" 
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      style={{ padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} 
                    />
                    <select 
                      value={newRating} 
                      onChange={(e) => setNewRating(e.target.value)}
                      style={{ padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }}
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                      <option value="2">★★☆☆☆ (2 Stars)</option>
                      <option value="1">★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>
                  <textarea 
                    required 
                    rows="3" 
                    placeholder="Describe your service experience with this business..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    style={{ padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px', width: '100%' }}
                  ></textarea>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>Submit Review</button>
                </form>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviewsList.length > 0 ? (
                  reviewsList.map(rev => (
                    <div key={rev.id} style={{ borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong>{rev.reviewer_name}</strong>
                        <span style={{ color: 'var(--color-gold)' }}>{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-navy)', margin: 0 }}>"{rev.review_text}"</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-gray)', display: 'block', marginTop: '0.5rem' }}>Posted on {rev.created_at}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--color-gray)', textAlign: 'center', padding: '2rem' }}>No reviews posted yet. Be the first to leave a review!</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info Panel */}
          <div>
            {/* Free Profile Conversion Upgrade alert banner */}
            {!isPaid && (
              <div className="glassmorphism" style={{
                padding: '2rem',
                backgroundColor: 'var(--color-navy)',
                color: 'var(--color-white)',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <span style={{ fontSize: '2rem' }}>🚀</span>
                <h4 style={{ color: 'var(--color-gold)', marginTop: '0.5rem' }}>Unlock Command Center</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Upgrade this profile to showcase verified badges, photo galleries, booking links, custom quote builders, and professional bios.
                </p>
                <button 
                  onClick={() => onUpgrade(biz)}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
                >
                  Upgrade Listing
                </button>
              </div>
            )}

            {/* Verification / Trust Indicators (Paid Only) */}
            {isPaid && (
              <div className="glassmorphism" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--color-navy)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>Trust Credentials</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Beacon Verified™</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-green)' }}>Manual Credentials Checked</span>
                    </div>
                  </div>
                  {biz.home_access_certified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>🏡</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>Home Access Certified™</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)' }}>Vetted for home entry</span>
                      </div>
                    </div>
                  )}
                  {biz.trust_score && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>📊</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>Trust Score: {biz.trust_score}%</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>Based on profile activities</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Linked Professional Block (Paid Only) */}
            {isPaid && linkedProf && (
              <div className="glassmorphism" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--color-navy)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: '0.5rem' }}>The Professional</h4>
                <div style={{ textAlign: 'center' }}>
                  <img src={linkedProf.photo} alt={linkedProf.name} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--color-teal)', marginBottom: '0.75rem' }} />
                  <h5 style={{ color: 'var(--color-navy)', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{linkedProf.name}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-teal)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>{linkedProf.role}</p>
                  <button 
                    onClick={() => handleProfClick(linkedProf.id)}
                    className="btn btn-outline"
                    style={{ width: '100%', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                  >
                    View Professional Bio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL (Simulated state) */}
      {bookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10,29,61,0.6)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glassmorphism" style={{
            backgroundColor: 'var(--color-white)',
            padding: '2.5rem',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '100%',
            position: 'relative'
          }}>
            <span onClick={() => { setBookingModal(false); setBookingSuccess(false); }} style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.25rem', cursor: 'pointer' }}>✕</span>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>📅</span>
                <h3 style={{ color: 'var(--color-navy)', marginTop: '1rem' }}>Booking Request Sent</h3>
                <p style={{ color: 'var(--color-gray)' }}>The business has been notified inside their Command Center. They will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ color: 'var(--color-navy)', margin: 0 }}>Schedule Appointment</h3>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Your Name</label>
                  <input required type="text" value={bookingName} onChange={(e) => setBookingName(e.target.value)} style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Requested Date</label>
                  <input required type="date" style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Request Booking Slot</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QUOTE MODAL (Simulated state) */}
      {quoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10,29,61,0.6)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glassmorphism" style={{
            backgroundColor: 'var(--color-white)',
            padding: '2.5rem',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            position: 'relative'
          }}>
            <span onClick={() => { setQuoteModal(false); setQuoteSuccess(false); }} style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.25rem', cursor: 'pointer' }}>✕</span>
            {quoteSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>📄</span>
                <h3 style={{ color: 'var(--color-navy)', marginTop: '1rem' }}>Quote Request Received</h3>
                <p style={{ color: 'var(--color-gray)' }}>Your project details have been piped to the member's Lead Desk. They will issue a formal proposal.</p>
              </div>
            ) : (
              <form onSubmit={handleQuote} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ color: 'var(--color-navy)', margin: 0 }}>Request Service Quote</h3>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Describe Project Scope & Service Needs</label>
                  <textarea required rows="4" value={quoteDetails} onChange={(e) => setQuoteDetails(e.target.value)} placeholder="E.g. Installing three wall lights, wiring a kitchen extractor fan, Chaguanas area..." style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--color-light-gray)', borderRadius: '6px' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Quote Request</button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
