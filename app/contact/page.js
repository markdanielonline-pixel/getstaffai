import Header from '@/components/Header';
import Link from 'next/link';

export default function Contact() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', paddingBottom: '8rem' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Connect with StaffAi.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Have a unique deployment requirement or need enterprise volume? Let's start a conversation.
          </p>
          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', display: 'inline-block', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Note: </span>
            <span style={{ color: 'var(--text-secondary)' }}>We prefer you try the Launch Tier first, but if you need to speak with sales, we're here.</span>
          </div>
        </section>

        <section className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr)', gap: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          <div className="glass-panel-vip animate-fade-in-up delay-100" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Direct Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Email</h4>
                <a href="mailto:sales@getstaffai.com" className="text-gradient-vibrant" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>sales@getstaffai.com</a>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Support Hours</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Monday - Friday<br/>9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
          </div>

          <div className="glass-panel-vip animate-fade-in-up delay-200" style={{ padding: '3rem', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>Sales Inquiry</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>First Name</label>
                  <input type="text" style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Last Name</label>
                  <input type="text" style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Work Email</label>
                <input type="email" style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Company Name</label>
                <input type="text" style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Estimated Lead Volume</label>
                <select style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <option value="1-50">1 - 50 leads/mo</option>
                  <option value="51-500">51 - 500 leads/mo</option>
                  <option value="501-2000">501 - 2,000 leads/mo</option>
                  <option value="2000+">2,000+ leads/mo</option>
                </select>
              </div>

              <button type="button" className="btn btn-primary btn-pulse" style={{ padding: '1.2rem', background: 'var(--accent-color)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1rem', cursor: 'pointer' }}>
                Submit Inquiry
              </button>
            </form>
          </div>

        </section>
      </main>
    </>
  );
}
