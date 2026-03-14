'use client';
import { useState } from 'react';
import Header from '@/components/Header';

export default function Pricing() {
  // Default selected tier is Operator ($97)
  const [selectedTier, setSelectedTier] = useState({ name: 'Operator', price: 97 });
  
  // Addon quantities
  const [addons, setAddons] = useState({
    callRecording: false, // $19/mo flat
    extraNumber: 0,       // $4/mo each
    voiceMinutes: 0,      // $29 per 100 pack
    escalation: 0,        // $249 per 10 pack
    leadVerification: 0   // $5 per 1,000 pack
  });

  const handleQuantityChange = (key, delta, min = 0) => {
    setAddons(prev => {
      const newVal = prev[key] + delta;
      return { ...prev, [key]: newVal < min ? min : newVal };
    });
  };

  const calculateTotal = () => {
    return selectedTier.price +
      (addons.callRecording ? 19 : 0) +
      (addons.extraNumber * 4) +
      (addons.voiceMinutes * 29) +
      (addons.escalation * 249) +
      (addons.leadVerification * 5);
  };

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const isTierSelected = (tierName) => selectedTier.name === tierName;

  const selectTier = (name, price) => {
    setSelectedTier({ name, price });
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierName: selectedTier.name, addons }),
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
      <main style={{ paddingTop: '100px', paddingBottom: '120px' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Pricing for Your <br/><span className="text-gradient-vibrant">AI Revenue Workforce.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
            Replace three revenue roles for less than the salary of one. Select a base plan below, then customize your add-ons.
          </p>
        </section>

        {/* PRICING GRID */}
        <section className="container" style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* TIER 1 */}
            <div 
              onClick={() => selectTier('Launch', 0)}
              className={`glass-panel-vip flex-column ${isTierSelected('Launch') ? 'selected-tier' : ''}`} 
              style={{ 
                padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                border: isTierSelected('Launch') ? '2px solid var(--accent-color)' : '1px solid var(--border-light)',
                transition: 'all 0.3s ease',
                boxShadow: isTierSelected('Launch') ? '0 0 30px rgba(59,130,246,0.15)' : 'none'
              }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Launch Tier <br/><span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>(Free Forever)</span></h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>$0<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span></div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>Best for: getting started and proving the system with real prospects.</p>
              
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Includes</strong></li>
                <li>• Website widget</li>
                <li>• 2 appointments</li>
                <li>• 50 AI text conversations</li>
                <li>• 10 AI voice minutes</li>
                <li>• Email support</li>
              </ul>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flexGrow: '1' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Not included</strong></li>
                <li>• No live transfer</li>
                <li>• No call recording</li>
                <li>• No client lead upload</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', borderColor: isTierSelected('Launch') ? 'var(--accent-color)' : 'rgba(0,0,0,0.2)', backgroundColor: isTierSelected('Launch') ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                {isTierSelected('Launch') ? 'Selected' : 'Select Launch'}
              </button>
            </div>

            {/* TIER 2 */}
            <div 
              onClick={() => selectTier('Operator', 97)}
              className={`glass-panel-vip flex-column ${isTierSelected('Operator') ? 'selected-tier' : ''}`} 
              style={{ 
                padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                border: isTierSelected('Operator') ? '2px solid var(--accent-color)' : '1px solid var(--border-light)',
                borderTop: !isTierSelected('Operator') ? '4px solid var(--accent-secondary)' : '4px solid var(--accent-color)',
                transition: 'all 0.3s ease',
                boxShadow: isTierSelected('Operator') ? '0 0 30px rgba(59,130,246,0.15)' : 'none'
              }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Operator Tier</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>$97<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span></div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>Best for: deploying your first serious revenue operator.</p>
              
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Resources</strong></li>
                <li>• Unlimited AI text chat</li>
                <li>• 60 Ai voice minutes</li>
                <li>• 500 outreach emails per month</li>
                <li>• 30 SMS per month</li>
              </ul>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flexGrow: '1' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Features</strong></li>
                <li>• Lead Gen Agent</li>
                <li>• Appointment Setter Agent</li>
                <li>• Calendar booking</li>
                <li>• Basic reporting</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', borderColor: isTierSelected('Operator') ? 'var(--accent-color)' : 'rgba(0,0,0,0.2)', backgroundColor: isTierSelected('Operator') ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                {isTierSelected('Operator') ? 'Selected' : 'Select Operator'}
              </button>
            </div>

            {/* TIER 3 POPULAR */}
            <div 
              onClick={() => selectTier('Accelerator', 297)}
              className={`glass-panel-vip flex-column ${isTierSelected('Accelerator') ? 'selected-tier' : ''}`} 
              style={{ 
                padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                border: isTierSelected('Accelerator') ? '2px solid var(--accent-color)' : '2px solid var(--border-light)',
                transform: isTierSelected('Accelerator') ? 'scale(1.05)' : 'scale(1.02)', 
                zIndex: 10,
                transition: 'all 0.3s ease',
                boxShadow: isTierSelected('Accelerator') ? '0 0 40px rgba(59,130,246,0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
              }}>
              <div style={{ position: 'absolute', top: '-15px', right: '30px', background: 'var(--accent-color)', color: '#ffffff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>RECOMMENDED</div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Accelerator Tier</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>$297<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span></div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>Best for: expanding your workforce and enabling automated closing.</p>
              
              <ul style={{ listStyle: 'none', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <li><strong>Resources</strong></li>
                <li>• Unlimited Ai text</li>
                <li>• 180 Ai voice minutes</li>
                <li>• 2,000 outreach emails per month</li>
                <li>• 80 SMS per month</li>
              </ul>
              <ul style={{ listStyle: 'none', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flexGrow: '1' }}>
                <li><strong>Features</strong></li>
                <li>• Lead Gen Agent</li>
                <li>• Appointment Setter Agent</li>
                <li>• Closer Agent</li>
                <li>• Proposal sending</li>
                <li>• Client lead upload up to 1,000 per month</li>
                <li>• Branded vanity URL</li>
                <li>• AI Closer or Human Closer option</li>
              </ul>
              <button className="btn btn-primary" style={{ width: '100%', background: isTierSelected('Accelerator') ? 'var(--accent-color)' : 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {isTierSelected('Accelerator') ? 'Selected ✓' : 'Select Accelerator'}
              </button>
            </div>

            {/* TIER 4 */}
            <div 
              onClick={() => selectTier('Authority', 497)}
              className={`glass-panel-vip flex-column ${isTierSelected('Authority') ? 'selected-tier' : ''}`} 
              style={{ 
                padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                border: isTierSelected('Authority') ? '2px solid var(--accent-color)' : '1px solid var(--border-light)',
                transition: 'all 0.3s ease',
                boxShadow: isTierSelected('Authority') ? '0 0 30px rgba(59,130,246,0.15)' : 'none'
              }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Authority Tier</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>$497<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span></div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>Best for: a full revenue infrastructure with custom scripting and routing.</p>
              
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Resources</strong></li>
                <li>• Unlimited AI text</li>
                <li>• 350 AI voice minutes</li>
                <li>• 4,000 outreach emails per month</li>
                <li>• 200 SMS per month</li>
              </ul>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flexGrow: '1' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Features</strong></li>
                <li>• Lead Generation Agent</li>
                <li>• Appointment Setter Agent</li>
                <li>• Closer Agent</li>
                <li>• Proposal sending</li>
                <li>• Custom scripts</li>
                <li>• Priority routing</li>
                <li>• Client lead upload up to 2,500 per month</li>
                <li>• 1,000 email verifications</li>
                <li>• Branded vanity URL</li>
                <li>• Warm Sales Escalation Hand-Off (paid add-on)</li>
                <li>• AI Closer or Human Closer option</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', borderColor: isTierSelected('Authority') ? 'var(--accent-color)' : 'rgba(0,0,0,0.2)', backgroundColor: isTierSelected('Authority') ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                 {isTierSelected('Authority') ? 'Selected' : 'Select Authority'}
              </button>
            </div>

            {/* TIER 5 */}
            <div 
              onClick={() => selectTier('Dominance', 997)}
              className={`glass-panel-vip flex-column ${isTierSelected('Dominance') ? 'selected-tier' : ''}`} 
              style={{ 
                padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                border: isTierSelected('Dominance') ? '2px solid var(--accent-color)' : '1px solid var(--border-light)',
                transition: 'all 0.3s ease',
                boxShadow: isTierSelected('Dominance') ? '0 0 30px rgba(59,130,246,0.15)' : 'none'
              }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Dominance Tier</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>$997<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span></div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>Best for: maximum scale, human takeover, and API access.</p>
              
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Resources</strong></li>
                <li>• Unlimited AI text</li>
                <li>• 700 AI voice minutes</li>
                <li>• 10,000 outreach emails per month</li>
                <li>• 500 SMS per month</li>
              </ul>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flexGrow: '1' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Features</strong></li>
                <li>• Everything in Authority</li>
                <li>• Advanced sales escalation criteria</li>
                <li>• Dedicated number</li>
                <li>• Human takeover option</li>
                <li>• Client lead upload up to 5,000 per month</li>
                <li>• 5,000 email verifications</li>
                <li>• Branded vanity URL</li>
                <li>• 10 Warm Sales Escalation Hand-Off included</li>
                <li>• AI Closer or Human Closer option</li>
                <li>• API access</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', borderColor: isTierSelected('Dominance') ? 'var(--accent-color)' : 'rgba(0,0,0,0.2)', backgroundColor: isTierSelected('Dominance') ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                {isTierSelected('Dominance') ? 'Selected' : 'Select Dominance'}
              </button>
            </div>

          </div>
        </section>

        {/* INTERACTIVE ADD-ONS SECTION */}
        <section className="container" style={{ paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
          <div className="glass-panel-vip" style={{ padding: '3rem', maxWidth: '800px', width: '100%', borderTop: '4px solid var(--accent-secondary)' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Customize Your Workforce</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Need more runtime or specialized features? Scale your add-ons dynamically below to build your perfect package.</p>
            
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Call Recording Toggle */}
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Call Recording</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$19/month flat rate</div>
                </div>
                <div 
                  onClick={() => setAddons(p => ({...p, callRecording: !p.callRecording}))}
                  style={{ 
                    width: '60px', height: '30px', borderRadius: '30px', cursor: 'pointer', position: 'relative',
                    background: addons.callRecording ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                    transition: 'background 0.3s'
                 }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', background: '#ffffff', position: 'absolute', top: '1px',
                    left: addons.callRecording ? '31px' : '1px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}></div>
                </div>
              </li>

              {/* Extra Numbers */}
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Extra Numbers</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$4/month per number</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => handleQuantityChange('extraNumber', -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--accent-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>{addons.extraNumber}</span>
                  <button onClick={() => handleQuantityChange('extraNumber', 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-color)', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </li>

              {/* Voice Minutes Pack */}
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Extra Voice Minutes</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$29 per 100-minute pack</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => handleQuantityChange('voiceMinutes', -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--accent-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center', color: 'var(--text-primary)' }}>{addons.voiceMinutes * 100} <span style={{fontSize:'0.8rem', fontWeight:'normal'}}>mins</span></span>
                  <button onClick={() => handleQuantityChange('voiceMinutes', 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-color)', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </li>

              {/* Sales Escalation Hand-Off */}
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Sales Escalation Hand-Off</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$249 per 10-pack</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => handleQuantityChange('escalation', -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--accent-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center', color: 'var(--text-primary)' }}>{addons.escalation * 10} <span style={{fontSize:'0.8rem', fontWeight:'normal'}}>handoffs</span></span>
                  <button onClick={() => handleQuantityChange('escalation', 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-color)', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </li>

              {/* Lead Verification */}
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Lead Verification</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$5 per 1,000 verifications</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => handleQuantityChange('leadVerification', -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--accent-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center', color: 'var(--text-primary)' }}>{addons.leadVerification * 1000} <span style={{fontSize:'0.8rem', fontWeight:'normal'}}>leads</span></span>
                  <button onClick={() => handleQuantityChange('leadVerification', 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-color)', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </li>

            </ul>
          </div>
        </section>

      </main>

      {/* STICKY BOTTOM CHECKOUT BAR */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-light)', padding: '1.5rem 2rem', zIndex: 100,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div>
             <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Total Monthly Investment</div>
             <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                ${calculateTotal()}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/month</span>
             </div>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', color: 'var(--text-secondary)', fontSize: '0.9rem', borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '2rem' }}>
              <div><strong style={{color:'var(--text-primary)'}}>Base Plan:</strong> {selectedTier.name} (${selectedTier.price})</div>
              {addons.callRecording && <div><strong style={{color:'var(--text-primary)'}}>+</strong> Call Recording</div>}
              {addons.extraNumber > 0 && <div><strong style={{color:'var(--text-primary)'}}>+</strong> {addons.extraNumber} Extra Number(s)</div>}
              {addons.voiceMinutes > 0 && <div><strong style={{color:'var(--text-primary)'}}>+</strong> {addons.voiceMinutes * 100} Extra Voice Mins</div>}
              {addons.escalation > 0 && <div><strong style={{color:'var(--text-primary)'}}>+</strong> {addons.escalation * 10} Sales Hand-offs</div>}
              {addons.leadVerification > 0 && <div><strong style={{color:'var(--text-primary)'}}>+</strong> {addons.leadVerification * 1000} Lead Verifications</div>}
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
