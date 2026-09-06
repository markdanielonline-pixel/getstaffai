'use client';

import { useState } from 'react';
import Header from '@/components/Header';

const OFFICE_PRICES = { monthly: 199, annual: 1990 };

export default function IncorporateForm({ ceo, product, billing }) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isDiscovered, setIsDiscovered] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  
  const [companyName, setCompanyName] = useState(ceo.company_name || '');
  const [industry, setIndustry] = useState(ceo.industry || '');
  const [businessDescription, setBusinessDescription] = useState(ceo.business_description || '');
  const [companyValues, setCompanyValues] = useState(ceo.company_values || '');
  const [cultureTone, setCultureTone] = useState(ceo.culture_tone || 'professional and direct');
  const [preferredChannel, setPreferredChannel] = useState(ceo.preferred_channel || 'app');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const price = OFFICE_PRICES[billing];

  const handleDiscover = async (e) => {
    e.preventDefault();
    if (!websiteUrl) return;
    setDiscovering(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/onboarding/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to discover company');
      
      const brain = data.data;
      if (brain) {
        setBusinessDescription(brain.overview || '');
        if (brain.products_and_services?.length) {
          setIndustry(brain.products_and_services[0]);
        }
        if (brain.key_policies?.length) {
          setCompanyValues(brain.key_policies.join(', '));
        }
      }
      setIsDiscovered(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Discovery failed. You can skip and enter manually.');
    } finally {
      setDiscovering(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKey: product,
          billing,
          companyName,
          industry,
          businessDescription,
          companyValues,
          cultureTone,
          preferredChannel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Incorporate error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08), transparent 50%)',
        padding: '7rem 1rem 3rem 1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <h1 style={{ fontSize: '2.3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            Establish your organisation
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Company Office — ${price}/{billing === 'annual' ? 'yr' : 'mo'}, with a 30-day money-back guarantee. Tell us about your business so your Executive Assistant and General Manager start with real context.
          </p>

          {errorMsg && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {errorMsg}
            </div>
          )}

          {!isDiscovered ? (
            <form onSubmit={handleDiscover} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Company Website</label>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Enter your URL, and we'll automatically scan it to build your initial AI Company Brain.</p>
                <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} required
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                  placeholder="https://example.com" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button type="submit" disabled={discovering || !websiteUrl} className="btn btn-primary"
                  style={{ padding: '1rem 1.5rem', flex: 1, background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#ffffff', border: 'none', cursor: discovering ? 'not-allowed' : 'pointer', opacity: discovering ? 0.7 : 1, borderRadius: '0.5rem', fontWeight: 'bold' }}>
                  {discovering ? 'Scanning website...' : 'Discover My Company'}
                </button>
                <button type="button" onClick={() => setIsDiscovered(true)} style={{ padding: '1rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                  Skip
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Verify Company Profile</h3>
                <button type="button" onClick={() => setIsDiscovered(false)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.9rem' }}>Back</button>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Company Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                  placeholder="Acme Consulting" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Industry</label>
                <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} required
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                  placeholder="Home services, coaching, agency..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>What does your business do?</label>
                <textarea value={businessDescription} onChange={e => setBusinessDescription(e.target.value)} required rows={4}
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none', resize: 'vertical' }}
                  placeholder="A couple sentences your AI workforce can use to represent you accurately." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Company values (optional)</label>
                <input type="text" value={companyValues} onChange={e => setCompanyValues(e.target.value)}
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}
                  placeholder="Honesty, speed, no-nonsense service..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Culture tone</label>
                <select value={cultureTone} onChange={e => setCultureTone(e.target.value)}
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}>
                  <option value="professional and direct">Professional and direct</option>
                  <option value="warm and friendly">Warm and friendly</option>
                  <option value="premium and polished">Premium and polished</option>
                  <option value="casual and approachable">Casual and approachable</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preferred first contact channel</label>
                <select value={preferredChannel} onChange={e => setPreferredChannel(e.target.value)}
                  style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }}>
                  <option value="app">In the Executive Suite (app)</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary"
                style={{ padding: '1.1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#ffffff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {loading ? 'Redirecting to secure checkout…' : `Continue to Payment — $${price}/${billing === 'annual' ? 'yr' : 'mo'}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
