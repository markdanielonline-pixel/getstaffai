import React, { useState } from 'react';
import { businesses as initialBusinesses, reviews as initialReviews } from '../mockData';

export default function AdminDashboard({ businessesList, setBusinessesList, claimRequests, setClaimRequests }) {
  const [activeTab, setActiveTab] = useState('listings');
  const [reviewsList, setReviewsList] = useState(initialReviews);

  const toggleVerification = (id) => {
    setBusinessesList(businessesList.map(b => {
      if (b.id === id) {
        return { 
          ...b, 
          verification_status: b.verification_status === 'verified' ? 'unverified' : 'verified',
          trust_score: b.verification_status === 'verified' ? null : 95
        };
      }
      return b;
    }));
  };

  const toggleHomeAccess = (id) => {
    setBusinessesList(businessesList.map(b => {
      if (b.id === id) {
        return { ...b, home_access_certified: !b.home_access_certified };
      }
      return b;
    }));
  };

  const toggleMembership = (id) => {
    setBusinessesList(businessesList.map(b => {
      if (b.id === id) {
        const isPaid = b.profile_type === 'paid';
        return { 
          ...b, 
          profile_type: isPaid ? 'free' : 'paid',
          membership_status: isPaid ? 'free' : 'member',
          has_booking: !isPaid,
          has_quote_request: !isPaid,
          has_offers: !isPaid,
          services: isPaid ? [] : ["Consultation Services", "Customer Support Desk"]
        };
      }
      return b;
    }));
  };

  const toggleFeatured = (id) => {
    setBusinessesList(businessesList.map(b => {
      if (b.id === id) {
        return { ...b, is_featured: !b.is_featured };
      }
      return b;
    }));
  };

  const toggleSponsored = (id) => {
    setBusinessesList(businessesList.map(b => {
      if (b.id === id) {
        return { ...b, is_sponsored: !b.is_sponsored };
      }
      return b;
    }));
  };

  const handleApproveClaim = (claimId, bizId) => {
    setBusinessesList(businessesList.map(b => {
      if (b.id === bizId) {
        return { ...b, claimed_status: 'claimed' };
      }
      return b;
    }));
    setClaimRequests(claimRequests.map(c => {
      if (c.id === claimId) {
        return { ...c, status: 'approved' };
      }
      return c;
    }));
  };

  const handleDeleteReview = (id) => {
    setReviewsList(reviewsList.filter(r => r.id !== id));
  };

  // Stats calculation
  const totalBiz = businessesList.length;
  const totalPaid = businessesList.filter(b => b.profile_type === 'paid').length;
  const totalVerified = businessesList.filter(b => b.verification_status === 'verified').length;
  const totalHomeAccess = businessesList.filter(b => b.home_access_certified).length;

  return (
    <div style={{ padding: '4rem 0', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>Admin Command Center</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '3rem' }}>
          Manage listings, toggle verification badges, approve owner claims, and moderate reviews.
        </p>

        {/* Overview Stats Cards Row */}
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <div className="glassmorphism" style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray)', textTransform: 'uppercase' }}>Total Listings</span>
            <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-navy)' }}>{totalBiz}</span>
          </div>
          <div className="glassmorphism" style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px', borderLeft: '4px solid var(--color-teal)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray)', textTransform: 'uppercase' }}>Beacon Members (Paid)</span>
            <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-teal)' }}>{totalPaid}</span>
          </div>
          <div className="glassmorphism" style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px', borderLeft: '4px solid var(--color-gold)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray)', textTransform: 'uppercase' }}>Verified Badges</span>
            <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-gold)' }}>{totalVerified}</span>
          </div>
          <div className="glassmorphism" style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray)', textTransform: 'uppercase' }}>Home Access Certified</span>
            <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-navy)' }}>{totalHomeAccess}</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-light-gray)', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('listings')}
            style={{ padding: '0.75rem 1.5rem', borderBottom: activeTab === 'listings' ? '3px solid var(--color-teal)' : 'none', fontWeight: 700, color: activeTab === 'listings' ? 'var(--color-teal)' : 'var(--color-navy)' }}
          >
            Directory Listings ({businessesList.length})
          </button>
          <button 
            onClick={() => setActiveTab('claims')}
            style={{ padding: '0.75rem 1.5rem', borderBottom: activeTab === 'claims' ? '3px solid var(--color-teal)' : 'none', fontWeight: 700, color: activeTab === 'claims' ? 'var(--color-teal)' : 'var(--color-navy)' }}
          >
            Claim Requests ({claimRequests.filter(c => c.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{ padding: '0.75rem 1.5rem', borderBottom: activeTab === 'reviews' ? '3px solid var(--color-teal)' : 'none', fontWeight: 700, color: activeTab === 'reviews' ? 'var(--color-teal)' : 'var(--color-navy)' }}
          >
            Moderate Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'listings' && (
          <div className="glassmorphism" style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', overflowX: 'auto', padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-light-gray)' }}>
                  <th style={{ padding: '1rem' }}>Business Name</th>
                  <th style={{ padding: '1rem' }}>Tier</th>
                  <th style={{ padding: '1rem' }}>Verified Status</th>
                  <th style={{ padding: '1rem' }}>Home Access</th>
                  <th style={{ padding: '1rem' }}>Placements</th>
                  <th style={{ padding: '1rem' }}>Operations</th>
                </tr>
              </thead>
              <tbody>
                {businessesList.map(biz => (
                  <tr key={biz.id} style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{biz.business_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{biz.city} • {biz.claimed_status === 'claimed' ? 'Claimed' : 'Unclaimed'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700, color: biz.profile_type === 'paid' ? 'var(--color-teal)' : 'var(--color-gray)' }}>
                        {biz.profile_type === 'paid' ? 'Paid Member' : 'Free Listing'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: biz.verification_status === 'verified' ? 'var(--color-gold)' : 'var(--color-gray)', fontWeight: 700 }}>
                        {biz.verification_status === 'verified' ? '✓ Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: biz.home_access_certified ? 'var(--color-teal)' : 'var(--color-gray)', fontWeight: 700 }}>
                        {biz.home_access_certified ? '🛡️ Certified' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem' }}>
                        <span>Featured: {biz.is_featured ? 'Yes' : 'No'}</span>
                        <span>Sponsored: {biz.is_sponsored ? 'Yes' : 'No'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button onClick={() => toggleMembership(biz.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                          Toggle Tier
                        </button>
                        <button onClick={() => toggleVerification(biz.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                          Toggle Verified
                        </button>
                        <button onClick={() => toggleHomeAccess(biz.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                          Toggle Safety
                        </button>
                        <button onClick={() => toggleFeatured(biz.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                          Toggle Featured
                        </button>
                        <button onClick={() => toggleSponsored(biz.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                          Toggle Sponsored
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="glassmorphism" style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-navy)', marginBottom: '1.5rem' }}>Owner Claim Requests</h3>
            {claimRequests.filter(c => c.status === 'pending').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {claimRequests.filter(c => c.status === 'pending').map(req => {
                  const biz = businessesList.find(b => b.id === req.business_id);
                  return (
                    <div 
                      key={req.id}
                      style={{ 
                        padding: '1.5rem', 
                        backgroundColor: 'var(--color-offwhite)', 
                        border: '1px solid var(--color-light-gray)', 
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Claim request for:</span>
                        <h4 style={{ color: 'var(--color-navy)', margin: '0.25rem 0' }}>{biz ? biz.business_name : 'Unknown Business'}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                          Requester: <strong>{req.requester_name}</strong> ({req.requester_email})
                        </div>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-navy)', fontStyle: 'italic' }}>
                          Proof Provided: "{req.proof_notes}"
                        </p>
                      </div>
                      <div>
                        <button 
                          onClick={() => handleApproveClaim(req.id, req.business_id)}
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                        >
                          Approve Claim
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray)' }}>No pending claim requests.</div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="glassmorphism" style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-navy)', marginBottom: '1.5rem' }}>Manage Customer Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviewsList.map(rev => {
                const biz = businessesList.find(b => b.id === rev.business_id);
                return (
                  <div 
                    key={rev.id}
                    style={{ 
                      padding: '1.5rem', 
                      backgroundColor: 'var(--color-offwhite)', 
                      border: '1px solid var(--color-light-gray)', 
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '2rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                        <strong>{rev.reviewer_name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>on {biz ? biz.business_name : 'Listing'}</span>
                        <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy)' }}>"{rev.review_text}"</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteReview(rev.id)}
                      className="btn btn-outline"
                      style={{ color: 'var(--color-red)', borderColor: 'var(--color-red)', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                      Delete Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
