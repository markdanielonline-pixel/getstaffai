'use client';
import { useState } from 'react';
import Header from '@/components/Header';

const TIERS = [
  {
    name: 'Launch', monthlyPrice: 0, annualMonthly: 0, annualPrice: 0,
    stripePriceMonthly: null, stripePriceAnnual: null,
    badge: 'Free Forever',
    description: 'Get started and prove the system.',
    resources: ['Website widget', '2 appointments', '50 AI text conversations', '10 AI voice minutes', 'Email support'],
    features: [],
    locked: ['Live transfer', 'Call recording', 'Client lead upload'],
    cta: 'Start Free Forever', ctaHref: '/portal/signup',
    availableAddons: [],
  },
  {
    name: 'Operator', monthlyPrice: 97, annualMonthly: 81, annualPrice: 970,
    stripePriceMonthly: 'price_1T2bPQBe48ha5T2sNhZ7SFyK',
    stripePriceAnnual: 'price_1T2bXKBe48ha5T2s2yStjK8k',
    badge: null,
    description: 'Deploy your first serious revenue operator.',
    resources: ['Unlimited AI text chat', '60 AI voice minutes', '500 emails/month', '30 SMS/month'],
    features: ['Lead Gen Agent', 'Appointment Setter Agent', 'Calendar booking', 'Basic reporting'],
    locked: [],
    cta: 'Activate Operator', ctaHref: null,
    availableAddons: ['extraNumber', 'voiceMinutes'],
  },
  {
    name: 'Accelerator', monthlyPrice: 297, annualMonthly: 248, annualPrice: 2970,
    stripePriceMonthly: 'price_1T2bQYBe48ha5T2smxHcqhlX',
    stripePriceAnnual: 'price_1T2baiBe48ha5T2sKniW1y5B',
    badge: 'Most Popular',
    description: 'Expand your workforce with automated closing.',
    resources: ['Unlimited AI text', '180 AI voice minutes', '2,000 emails/month', '80 SMS/month'],
    features: ['Lead Gen + Setter + Closer Agents', 'Proposal sending', 'Client lead upload (1,000/mo)', 'Branded vanity URL', 'AI or Human Closer'],
    locked: [],
    cta: 'Activate Accelerator', ctaHref: null,
    availableAddons: ['callRecording', 'extraNumber', 'voiceMinutes'],
  },
  {
    name: 'Authority', monthlyPrice: 497, annualMonthly: 414, annualPrice: 4970,
    stripePriceMonthly: 'price_1T2bRgBe48ha5T2sPpaPvYGw',
    stripePriceAnnual: 'price_1T2bcDBe48ha5T2syGu5ndQV',
    badge: null,
    description: 'Full revenue infrastructure with custom scripting.',
    resources: ['Unlimited AI text', '350 AI voice minutes', '4,000 emails/month', '200 SMS/month'],
    features: ['All 3 Agents', 'Custom scripts', 'Priority routing', 'Client lead upload (2,500/mo)', '1,000 email verifications', 'Branded vanity URL', 'AI or Human Closer'],
    locked: [],
    cta: 'Activate Authority', ctaHref: null,
    availableAddons: ['callRecording', 'extraNumber', 'voiceMinutes', 'escalation', 'leadVerification'],
  },
  {
    name: 'Dominance', monthlyPrice: 997, annualMonthly: 831, annualPrice: 9970,
    stripePriceMonthly: 'price_1T2bSfBe48ha5T2sIwk2aDMz',
    stripePriceAnnual: 'price_1T2bdaBe48ha5T2sWJfqGmlN',
    badge: 'Max Scale',
    description: 'Maximum scale with human takeover and API access.',
    resources: ['Unlimited AI text', '700 AI voice minutes', '10,000 emails/month', '500 SMS/month'],
    features: ['Everything in Authority', 'Dedicated number', 'Human takeover', 'Client lead upload (5,000/mo)', '5,000 email verifications', '10 Hand-Offs included', 'API access'],
    locked: [],
    cta: 'Activate Dominance', ctaHref: null,
    availableAddons: ['callRecording', 'extraNumber', 'voiceMinutes', 'escalation', 'leadVerification'],
  },
];

const ADDONS = {
  callRecording:   { label: 'Call Recording',           sub: '$19/mo',           type: 'toggle',  price: 19,  priceId: 'price_1T2bh1Be48ha5T2sLcSvvXtz' },
  extraNumber:     { label: 'Extra Numbers',             sub: '$4/mo each',       type: 'counter', price: 4,   priceId: 'price_1T2biqBe48ha5T2s9BYAaSJK' },
  voiceMinutes:    { label: '100 Voice Min Pack',        sub: '$29/pack',         type: 'counter', price: 29,  priceId: 'price_1T2bkLBe48ha5T2shGRHHuBm', multiplier: 100, unit: ' mins' },
  escalation:      { label: 'Sales Hand-Off (10-pack)',  sub: '$249/pack',        type: 'counter', price: 249, priceId: 'price_1T2bmKBe48ha5T2sspP1kilM', multiplier: 10,  unit: ' handoffs' },
  leadVerification:{ label: 'Lead Verification',        sub: '$5/1,000 leads',   type: 'counter', price: 5,   priceId: 'price_1T2bo3Be48ha5T2saA5iQ0YX', multiplier: 1000, unit: ' leads' },
};

export default function Pricing() {
  const [billing, setBilling]         = useState('monthly');
  const [selectedTier, setSelectedTier] = useState(TIERS[2]); // Accelerator default
  const [addons, setAddons]           = useState({ callRecording: false, extraNumber: 0, voiceMinutes: 0, escalation: 0, leadVerification: 0 });
  const [loading, setLoading]         = useState(false);

  const selectTier = (tier) => {
    setSelectedTier(tier);
    setAddons(prev => {
      const next = { ...prev };
      Object.keys(ADDONS).forEach(k => {
        if (!tier.availableAddons.includes(k)) next[k] = ADDONS[k].type === 'toggle' ? false : 0;
      });
      return next;
    });
  };

  const addonCost = () =>
    (addons.callRecording ? 19 : 0) + addons.extraNumber * 4 + addons.voiceMinutes * 29 + addons.escalation * 249 + addons.leadVerification * 5;

  const basePrice = billing === 'annual' ? selectedTier.annualMonthly : selectedTier.monthlyPrice;
  const total     = basePrice + addonCost();

  const handleCheckout = async () => {
    if (selectedTier.ctaHref) { window.location.href = selectedTier.ctaHref; return; }
    setLoading(true);
    try {
      const priceId = billing === 'annual' ? selectedTier.stripePriceAnnual : selectedTier.stripePriceMonthly;
      const res  = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId, tierName: selectedTier.name, billing, addons }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert('Something went wrong. Please try again.'); setLoading(false); }
    } catch { alert('Something went wrong. Please try again.'); setLoading(false); }
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>

        {/* PAGE TITLE */}
        <section style={{ textAlign: 'center', padding: '2.5rem 1rem 1.5rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            Your <span className="text-gradient-vibrant">AI Revenue Workforce</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Replace three revenue roles for less than the cost of one.
          </p>

          {/* BILLING TOGGLE */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', borderRadius: '50px', padding: '4px', border: '1px solid var(--border-light)' }}>
            {['monthly', 'annual'].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '0.5rem 1.6rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s',
                background: billing === b ? 'var(--accent-color)' : 'transparent',
                color: billing === b ? '#fff' : 'var(--text-secondary)',
              }}>
                {b === 'monthly' ? 'Monthly' : <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Annual <span style={{ background: '#22c55e', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' }}>2 MONTHS FREE</span></span>}
              </button>
            ))}
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT */}
        <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2rem', alignItems: 'start', paddingBottom: '120px' }}>

          {/* LEFT — TIER SELECTOR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {TIERS.map(tier => {
              const isSelected = selectedTier.name === tier.name;
              const price = billing === 'annual' ? tier.annualMonthly : tier.monthlyPrice;
              return (
                <div key={tier.name} onClick={() => selectTier(tier)} style={{
                  padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-light)',
                  background: isSelected ? 'rgba(59,130,246,0.05)' : 'var(--bg-secondary)',
                  boxShadow: isSelected ? '0 0 20px rgba(59,130,246,0.12)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-light)'}`,
                      background: isSelected ? 'var(--accent-color)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {tier.name}
                        {tier.badge && <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: tier.badge === 'Most Popular' ? 'var(--accent-color)' : tier.badge === 'Free Forever' ? '#6b7280' : '#8b5cf6', color: '#fff' }}>{tier.badge}</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tier.description}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)' }}>${price}<span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/mo</span></div>
                    {billing === 'annual' && tier.annualPrice > 0 && <div style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: '600' }}>${tier.annualPrice}/yr</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — DETAILS + ADDONS + SUMMARY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* TIER DETAILS */}
            <div className="glass-panel-vip" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{selectedTier.name} Tier</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{selectedTier.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>${basePrice}<span style={{ fontSize: '0.9rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/mo</span></div>
                  {billing === 'annual' && selectedTier.annualPrice > 0 && <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '600' }}>Billed ${selectedTier.annualPrice}/yr · 2 months free</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: selectedTier.features.length > 0 ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Resources</div>
                  {selectedTier.resources.map(r => <div key={r} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>✓ {r}</div>)}
                </div>
                {selectedTier.features.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Features</div>
                    {selectedTier.features.map(f => <div key={f} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>✓ {f}</div>)}
                  </div>
                )}
              </div>

              {selectedTier.locked.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                  {selectedTier.locked.map(l => <span key={l} style={{ fontSize: '0.8rem', color: '#9ca3af', marginRight: '1rem' }}>✗ {l}</span>)}
                </div>
              )}
            </div>

            {/* ADD-ONS */}
            {selectedTier.availableAddons.length > 0 && (
              <div className="glass-panel-vip" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Optional Add-Ons</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedTier.availableAddons.map(key => {
                    const a = ADDONS[key];
                    return (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{a.label}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{a.sub}</span>
                        </div>
                        {a.type === 'toggle' ? (
                          <div onClick={() => setAddons(p => ({ ...p, [key]: !p[key] }))} style={{ width: '48px', height: '26px', borderRadius: '30px', cursor: 'pointer', position: 'relative', background: addons[key] ? 'var(--accent-color)' : '#d1d5db', transition: 'background 0.2s', flexShrink: 0 }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: addons[key] ? '24px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                            <button onClick={() => setAddons(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--accent-color)', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-primary)' }}>-</button>
                            <span style={{ minWidth: '50px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              {a.multiplier ? addons[key] * a.multiplier : addons[key]}{a.unit || ''}
                            </span>
                            <button onClick={() => setAddons(p => ({ ...p, [key]: p[key] + 1 }))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'var(--accent-color)', cursor: 'pointer', fontSize: '1rem', color: '#fff' }}>+</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ORDER SUMMARY */}
            <div className="glass-panel-vip" style={{ padding: '1.5rem', borderTop: '3px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Order Summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedTier.name} ({billing})</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${basePrice}/mo</span>
              </div>
              {addons.callRecording && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Call Recording</span><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+$19/mo</span></div>}
              {addons.extraNumber > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{addons.extraNumber} Extra Number(s)</span><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+${addons.extraNumber * 4}/mo</span></div>}
              {addons.voiceMinutes > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{addons.voiceMinutes * 100} Voice Mins</span><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+${addons.voiceMinutes * 29}</span></div>}
              {addons.escalation > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{addons.escalation * 10} Hand-Offs</span><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+${addons.escalation * 249}</span></div>}
              {addons.leadVerification > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{addons.leadVerification * 1000} Lead Verifications</span><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+${addons.leadVerification * 5}</span></div>}
              <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Total</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>${total}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>/mo</span>
                  {billing === 'annual' && selectedTier.annualPrice > 0 && <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: '600' }}>Billed ${(total * 10).toLocaleString()}/year</div>}
                </div>
              </div>
              <button onClick={handleCheckout} disabled={loading} className="btn btn-primary btn-pulse" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: '700', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '50px', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.8 : 1 }}>
                {loading ? 'Redirecting to Stripe...' : selectedTier.name === 'Launch' ? 'Start Free Forever →' : 'Checkout Securely →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.75rem', marginBottom: 0 }}>
                🔒 Secure checkout · Cancel anytime · No contracts
              </p>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
