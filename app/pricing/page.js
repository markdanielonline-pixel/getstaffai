'use client';
import { useState } from 'react';
import Header from '@/components/Header';

// ── Tier definitions ────────────────────────────────────────────────────────
const TIERS = [
  {
    name: 'Launch',
    monthlyPrice: 0,
    annualPrice: 0,
    annualMonthly: 0,
    stripePriceMonthly: null,
    stripePriceAnnual: null,
    tagline: 'Free Forever',
    description: 'Best for: getting started and proving the system with real prospects.',
    includes: ['Website widget', '2 appointments', '50 AI text conversations', '10 AI voice minutes', 'Email support'],
    excludes: ['No live transfer', 'No call recording', 'No client lead upload'],
    cta: 'Start Free Forever',
    ctaStyle: 'outline',
    availableAddons: [],
  },
  {
    name: 'Operator',
    monthlyPrice: 97,
    annualPrice: 970,
    annualMonthly: 81,
    stripePriceMonthly: 'price_1T2bPQBe48ha5T2sNhZ7SFyK',
    stripePriceAnnual: 'price_1T2bXKBe48ha5T2s2yStjK8k',
    tagline: null,
    description: 'Best for: deploying your first serious revenue operator.',
    includes: ['Unlimited AI text chat', '60 AI voice minutes', '500 outreach emails/month', '30 SMS/month'],
    features: ['Lead Gen Agent', 'Appointment Setter Agent', 'Calendar booking', 'Basic reporting'],
    cta: 'Activate Operator',
    ctaStyle: 'outline',
    availableAddons: ['extraNumber', 'voiceMinutes'],
  },
  {
    name: 'Accelerator',
    monthlyPrice: 297,
    annualPrice: 2970,
    annualMonthly: 248,
    stripePriceMonthly: 'price_1T2bQYBe48ha5T2smxHcqhlX',
    stripePriceAnnual: 'price_1T2baiBe48ha5T2sKniW1y5B',
    tagline: 'RECOMMENDED',
    description: 'Best for: expanding your workforce and enabling automated closing.',
    includes: ['Unlimited AI text', '180 AI voice minutes', '2,000 outreach emails/month', '80 SMS/month'],
    features: ['Lead Gen Agent', 'Appointment Setter Agent', 'Closer Agent', 'Proposal sending', 'Client lead upload up to 1,000/month', 'Branded vanity URL', 'AI or Human Closer option'],
    cta: 'Activate Accelerator',
    ctaStyle: 'primary',
    availableAddons: ['callRecording', 'extraNumber', 'voiceMinutes'],
  },
  {
    name: 'Authority',
    monthlyPrice: 497,
    annualPrice: 4970,
    annualMonthly: 414,
    stripePriceMonthly: 'price_1T2bRgBe48ha5T2sPpaPvYGw',
    stripePriceAnnual: 'price_1T2bcDBe48ha5T2syGu5ndQV',
    tagline: null,
    description: 'Best for: a full revenue infrastructure with custom scripting and routing.',
    includes: ['Unlimited AI text', '350 AI voice minutes', '4,000 outreach emails/month', '200 SMS/month'],
    features: ['Lead Gen + Appointment + Closer Agents', 'Proposal sending', 'Custom scripts', 'Priority routing', 'Client lead upload up to 2,500/month', '1,000 email verifications', 'Branded vanity URL', 'AI or Human Closer option'],
    cta: 'Activate Authority',
    ctaStyle: 'outline',
    availableAddons: ['callRecording', 'extraNumber', 'voiceMinutes', 'escalation', 'leadVerification'],
  },
  {
    name: 'Dominance',
    monthlyPrice: 997,
    annualPrice: 9970,
    annualMonthly: 831,
    stripePriceMonthly: 'price_1T2bSfBe48ha5T2sIwk2aDMz',
    stripePriceAnnual: 'price_1T2bdaBe48ha5T2sWJfqGmlN',
    tagline: null,
    description: 'Best for: maximum scale, human takeover, and API access.',
    includes: ['Unlimited AI text', '700 AI voice minutes', '10,000 outreach emails/month', '500 SMS/month'],
    features: ['Everything in Authority', 'Advanced sales escalation criteria', 'Dedicated number', 'Human takeover option', 'Client lead upload up to 5,000/month', '5,000 email verifications', 'Branded vanity URL', '10 Warm Hand-Offs included', 'AI or Human Closer option', 'API access'],
    cta: 'Activate Dominance',
    ctaStyle: 'outline',
    availableAddons: ['callRecording', 'extraNumber', 'voiceMinutes', 'escalation', 'leadVerification'],
  },
];

// ── Add-on definitions ───────────────────────────────────────────────────────
const ADDON_DEFS = {
  callRecording: {
    label: 'Call Recording',
    sub: '$19/month flat rate',
    type: 'toggle',
    stripePriceId: 'price_1T2bh1Be48ha5T2sLcSvvXtz',
  },
  extraNumber: {
    label: 'Extra Numbers',
    sub: '$4/month per number',
    type: 'counter',
    unit: '',
    stripePriceId: 'price_1T2biqBe48ha5T2s9BYAaSJK',
  },
  voiceMinutes: {
    label: 'Extra Voice Minutes',
    sub: '$29 per 100-minute pack',
    type: 'counter',
    unit: ' mins',
    multiplier: 100,
    stripePriceId: 'price_1T2bkLBe48ha5T2shGRHHuBm',
  },
  escalation: {
    label: 'Sales Escalation Hand-Off',
    sub: '$249 per 10-pack',
    type: 'counter',
    unit: ' handoffs',
    multiplier: 10,
    stripePriceId: 'price_1T2bmKBe48ha5T2sspP1kilM',
  },
  leadVerification: {
    label: 'Lead Verification',
    sub: '$5 per 1,000 verifications',
    type: 'counter',
    unit: ' leads',
    multiplier: 1000,
    stripePriceId: 'price_1T2bo3Be48ha5T2saA5iQ0YX',
  },
};

export default function Pricing() {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedTier, setSelectedTier] = useState(TIERS[1]); // Operator default
  const [addons, setAddons] = useState({
    callRecording: false,
    extraNumber: 0,
    voiceMinutes: 0,
    escalation: 0,
    leadVerification: 0,
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Reset add-ons that aren't available on the newly selected tier
  const selectTier = (tier) => {
    setSelectedTier(tier);
    setAddons(prev => {
      const next = { ...prev };
      Object.keys(ADDON_DEFS).forEach(key => {
        if (!tier.availableAddons.includes(key)) {
          next[key] = ADDON_DEFS[key].type === 'toggle' ? false : 0;
        }
      });
      return next;
    });
  };

  const handleQuantityChange = (key, delta) => {
    setAddons(prev => {
      const val = prev[key] + delta;
      return { ...prev, [key]: val < 0 ? 0 : val };
    });
  };

  const calculateAddonCost = () => {
    return (addons.callRecording ? 19 : 0) +
      (addons.extraNumber * 4) +
      (addons.voiceMinutes * 29) +
      (addons.escalation * 249) +
      (addons.leadVerification * 5);
  };

  const calculateTotal = () => {
    const base = billing === 'annual' ? selectedTier.annualMonthly : selectedTier.monthlyPrice;
    return base + calculateAddonCost();
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const priceId = billing === 'annual'
        ? selectedTier.stripePriceAnnual
        : selectedTier.stripePriceMonthly;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          tierName: selectedTier.name,
          billing,
          addons,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
        setCheckoutLoading(false);
      }
    } catch {
      alert('Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', paddingBottom: '160px' }}>

        {/* HERO */}
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Pricing for Your <br /><span className="text-gradient-vibrant">AI Revenue Workforce.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
            Replace three revenue roles for less than the salary of one.
          </p>

          {/* BILLING TOGGLE */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)', borderRadius: '50px', padding: '6px', border: '1px solid var(--border-light)', marginBottom: '3rem' }}>
            <button
              onClick={() => setBilling('monthly')}
              style={{
                padding: '0.6rem 1.8rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.2s',
                background: billing === 'monthly' ? 'var(--accent-color)' : 'transparent',
                color: billing === 'monthly' ? '#fff' : 'var(--text-secondary)',
              }}>
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              style={{
                padding: '0.6rem 1.8rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: billing === 'annual' ? 'var(--accent-color)' : 'transparent',
                color: billing === 'annual' ? '#fff' : 'var(--text-secondary)',
              }}>
              Annual
              <span style={{ background: '#22c55e', color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                2 MONTHS FREE
              </span>
            </button>
          </div>
        </section>

        {/* PRICING GRID */}
        <section className="container" style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {TIERS.map((tier) => {
              const isSelected = selectedTier.name === tier.name;
              const displayPrice = billing === 'annual' ? tier.annualMonthly : tier.monthlyPrice;
              return (
                <div
                  key={tier.name}
                  onClick={() => selectTier(tier)}
                  className={`glass-panel-vip flex-column ${isSelected ? 'selected-tier' : ''}`}
                  style={{
                    padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                    border: isSelected ? '2px solid var(--accent-color)' : tier.name === 'Accelerator' ? '2px solid var(--border-light)' : '1px solid var(--border-light)',
                    transform: tier.name === 'Accelerator' && !isSelected ? 'scale(1.02)' : isSelected ? 'scale(1.02)' : 'scale(1)',
                    zIndex: tier.name === 'Accelerator' ? 10 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? '0 0 30px rgba(59,130,246,0.15)' : tier.name === 'Accelerator' ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
                  }}>

                  {tier.tagline && tier.tagline !== 'Free Forever' && (
                    <div style={{ position: 'absolute', top: '-15px', right: '30px', background: 'var(--accent-color)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {tier.tagline}
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {tier.name} Tier
                    {tier.tagline === 'Free Forever' && <><br /><span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>(Free Forever)</span></>}
                  </h3>

                  <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    ${displayPrice}
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span>
                  </div>

                  {billing === 'annual' && tier.annualPrice > 0 && (
                    <div style={{ fontSize: '0.9rem', color: '#22c55e', fontWeight: '600', marginBottom: '1rem' }}>
                      Billed ${tier.annualPrice}/year · 2 months free
                    </div>
                  )}
                  {(billing === 'monthly' || tier.annualPrice === 0) && <div style={{ marginBottom: '1rem' }} />}

                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>{tier.description}</p>

                  <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    <li><strong style={{ color: 'var(--text-primary)' }}>{tier.excludes ? 'Includes' : 'Resources'}</strong></li>
                    {tier.includes.map(item => <li key={item}>• {item}</li>)}
                  </ul>

                  {tier.features && (
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flexGrow: 1 }}>
                      <li><strong style={{ color: 'var(--text-primary)' }}>Features</strong></li>
                      {tier.features.map(item => <li key={item}>• {item}</li>)}
                    </ul>
                  )}

                  {tier.excludes && (
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flexGrow: 1 }}>
                      <li><strong style={{ color: 'var(--text-primary)' }}>Not included</strong></li>
                      {tier.excludes.map(item => <li key={item}>• {item}</li>)}
                    </ul>
                  )}

                  <button
                    className={`btn ${tier.ctaStyle === 'primary' ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      width: '100%',
                      borderColor: isSelected ? 'var(--accent-color)' : 'rgba(0,0,0,0.2)',
                      backgroundColor: isSelected ? 'rgba(59,130,246,0.1)' : tier.ctaStyle === 'primary' ? 'var(--accent-color)' : 'transparent',
                      color: tier.ctaStyle === 'primary' && !isSelected ? '#fff' : 'var(--text-primary)',
                    }}>
                    {isSelected ? 'Selected ✓' : tier.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ADD-ONS — only shown when a paid tier with add-ons is selected */}
        {selectedTier.availableAddons.length > 0 && (
          <section className="container" style={{ paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel-vip" style={{ padding: '3rem', maxWidth: '800px', width: '100%', borderTop: '4px solid var(--accent-secondary)' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Customize Your Workforce</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                Available add-ons for the <strong>{selectedTier.name}</strong> tier. Scale dynamically below.
              </p>

              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {selectedTier.availableAddons.map((key) => {
                  const addon = ADDON_DEFS[key];
                  return (
                    <li key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{addon.label}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{addon.sub}</div>
                      </div>

                      {addon.type === 'toggle' ? (
                        <div
                          onClick={() => setAddons(p => ({ ...p, [key]: !p[key] }))}
                          style={{
                            width: '60px', height: '30px', borderRadius: '30px', cursor: 'pointer', position: 'relative',
                            background: addons[key] ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                            border: '1px solid var(--border-light)', transition: 'background 0.3s',
                          }}>
                          <div style={{
                            width: '26px', height: '26px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '1px',
                            left: addons[key] ? '31px' : '1px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }} />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button onClick={() => handleQuantityChange(key, -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--accent-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            {addon.multiplier ? addons[key] * addon.multiplier : addons[key]}
                            {addon.unit && <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>{addon.unit}</span>}
                          </span>
                          <button onClick={() => handleQuantityChange(key, 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-color)', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

      </main>

      {/* STICKY CHECKOUT BAR */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-light)', padding: '1.5rem 2rem', zIndex: 100,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
              Total {billing === 'annual' ? 'Annual' : 'Monthly'} Investment
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              ${calculateTotal()}
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span>
            </div>
            {billing === 'annual' && selectedTier.annualPrice > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '600' }}>
                Billed ${(calculateTotal() * 10).toLocaleString()}/year
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', color: 'var(--text-secondary)', fontSize: '0.9rem', borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '2rem' }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>Plan:</strong> {selectedTier.name} · {billing === 'annual' ? 'Annual' : 'Monthly'}</div>
            {addons.callRecording && <div>+ Call Recording ($19)</div>}
            {addons.extraNumber > 0 && <div>+ {addons.extraNumber} Extra Number(s) (${addons.extraNumber * 4})</div>}
            {addons.voiceMinutes > 0 && <div>+ {addons.voiceMinutes * 100} Voice Mins (${addons.voiceMinutes * 29})</div>}
            {addons.escalation > 0 && <div>+ {addons.escalation * 10} Hand-offs (${addons.escalation * 249})</div>}
            {addons.leadVerification > 0 && <div>+ {addons.leadVerification * 1000} Verifications (${addons.leadVerification * 5})</div>}
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="btn btn-primary btn-pulse"
          style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', background: 'var(--accent-color)', color: '#ffffff', border: 'none', fontWeight: '700', borderRadius: '50px', cursor: checkoutLoading ? 'wait' : 'pointer', opacity: checkoutLoading ? 0.8 : 1 }}>
          {checkoutLoading ? 'Redirecting to Stripe...' : 'Checkout Securely →'}
        </button>
      </div>
    </>
  );
}
