import Header from '@/components/Header';
import SupportForm from '@/components/SupportForm';

export default function Contact() {
  return (
    <>
      <Header />
      <main className="contact-main">
        <section className="section container text-center animate-fade-in-up">
          <h1 className="contact-title">
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

        <section className="container contact-grid">
          
          <div className="glass-panel-vip contact-panel animate-fade-in-up delay-100">
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

          <div className="glass-panel-vip contact-panel contact-form-panel animate-fade-in-up delay-200">
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>Sales Inquiry</h2>
            <SupportForm source="contact" defaults={{ category: 'sales' }} />
          </div>

        </section>
      </main>
    </>
  );
}
