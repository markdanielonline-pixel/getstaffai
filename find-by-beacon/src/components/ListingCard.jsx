import React from 'react';

export default function ListingCard({ biz, onSelect, onUpgrade }) {
  const isPaid = biz.profile_type === 'paid';

  return (
    <div 
      className="glassmorphism"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'var(--color-white)',
        borderRadius: '16px',
        border: isPaid ? '2px solid var(--color-teal)' : '1px solid var(--color-light-gray)',
        boxShadow: isPaid ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        overflow: 'hidden',
        transition: 'all var(--transition-medium)',
        padding: '1.5rem'
      }}
    >
      {/* Paid Member Top Banner Tag */}
      {isPaid && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: 'var(--color-teal)',
          color: 'var(--color-white)',
          padding: '0.25rem 0.75rem',
          borderBottomLeftRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}>
          BEACON MEMBER
        </div>
      )}

      {/* Header Info (Logo, Name, Category, Badges) */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          backgroundColor: 'var(--color-offwhite)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          border: '1px solid var(--color-light-gray)'
        }}>
          {biz.logo || '🏢'}
        </div>
        <div style={{ flex: 1, paddingRight: isPaid ? '100px' : '0' }}>
          <h3 
            onClick={() => onSelect(biz.id)} 
            style={{ 
              fontSize: '1.25rem', 
              margin: '0 0 0.25rem 0', 
              cursor: 'pointer',
              color: 'var(--color-navy)',
              fontFamily: 'var(--font-headings)',
              fontWeight: 700
            }}
          >
            {biz.business_name}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-gray)' }}>
            <span>{biz.city}, {biz.country}</span>
            <span>•</span>
            <span style={{ fontWeight: 600, color: 'var(--color-teal)' }}>{biz.short_description.split(' in ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Badges and Ratings Block */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        {/* Verification Status */}
        {biz.verification_status === 'verified' && (
          <span className="badge-verified">✓ Verified</span>
        )}
        
        {/* Home Access Certified Status */}
        {biz.home_access_certified && (
          <span className="badge-homeaccess">🛡️ Home Access</span>
        )}

        {/* Claimed status */}
        {biz.claimed_status === 'claimed' ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-green)', fontWeight: 600 }}>✓ Claimed Profile</span>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray)', fontWeight: 500, fontStyle: 'italic' }}>Unclaimed Profile</span>
        )}

        {/* Trust Score */}
        {isPaid && biz.trust_score && (
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(218,175,55,0.1)', color: 'var(--color-gold)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
            Score: {biz.trust_score}%
          </span>
        )}

        {/* Review rating stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}>★</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy)' }}>{biz.review_average}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>({biz.review_count})</span>
        </div>
      </div>

      {/* Short Description */}
      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
        {biz.short_description}
      </p>

      {/* Paid Member Features (Service Highlights / Offer Tags) */}
      {isPaid && biz.services && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.35rem', 
          padding: '0.75rem', 
          backgroundColor: 'rgba(0,166,178,0.03)', 
          borderRadius: '8px', 
          marginBottom: '1.25rem' 
        }}>
          {biz.services.slice(0, 3).map((svc, sIdx) => (
            <span key={sIdx} style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-white)', color: 'var(--color-gray)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-light-gray)' }}>
              ✓ {svc}
            </span>
          ))}
          {biz.services.length > 3 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600, padding: '0.2rem' }}>+{biz.services.length - 3} more</span>
          )}
        </div>
      )}

      {/* Card Action CTAs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap',
        borderTop: '1px solid var(--color-light-gray)',
        paddingTop: '1rem',
        marginTop: 'auto'
      }}>
        <button 
          onClick={() => onSelect(biz.id)} 
          className="btn btn-outline" 
          style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          View Profile
        </button>

        {biz.whatsapp && (
          <a 
            href={biz.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn" 
            style={{ 
              backgroundColor: '#25D366', 
              color: 'var(--color-white)', 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem',
              borderRadius: '8px'
            }}
          >
            WhatsApp
          </a>
        )}

        {isPaid && biz.has_booking && (
          <button 
            onClick={() => onSelect(biz.id)} 
            className="btn btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Book
          </button>
        )}

        {isPaid && biz.has_quote_request && (
          <button 
            onClick={() => onSelect(biz.id)} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Quote
          </button>
        )}

        {/* Claim / Upgrade button for unclaimed/free listings */}
        {!isPaid && (
          <button 
            onClick={() => onUpgrade(biz)} 
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-teal)', 
              fontWeight: 700, 
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            {biz.claimed_status === 'claimed' ? 'Upgrade to Member' : 'Claim Listing'}
          </button>
        )}
      </div>
    </div>
  );
}
