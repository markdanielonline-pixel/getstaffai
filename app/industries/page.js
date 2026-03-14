import Header from '@/components/Header';
import Link from 'next/link';

export default function Industries() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px' }}>
        <section className="section container text-center animate-fade-in-up">
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Built for Businesses That Need <br/><span className="text-gradient-vibrant">Consistent Conversion</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
            If leads come in and money leaks out, an AI Revenue Workforce fixes the system.
          </p>
          <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'var(--accent-color)', color: 'var(--text-primary)', fontWeight: '700' }}>
            Start Free Forever
          </Link>
        </section>

        <section className="container" style={{ marginBottom: '8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            
            {/* LOCAL SERVICE */}
            <div className="glass-panel-vip animate-fade-in-up delay-100" style={{ padding: '3rem', borderLeft: '3px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontWeight: 'bold' }}>Primary Fit</div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Local Service Businesses</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>Examples: contractors, med spas, dentists, home services, clinics</p>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>What StaffAi does:</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <li>• responds instantly to inquiries and missed calls (text-first)</li>
                <li>• qualifies by service type, urgency, location, budget</li>
                <li>• books appointments or estimates</li>
                <li>• follows up until the prospect commits or opts out</li>
              </ul>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--accent-secondary)' }}>Result:</strong> more booked jobs, fewer missed opportunities
              </div>
            </div>

            {/* CONSULTANTS */}
            <div className="glass-panel-vip animate-fade-in-up delay-200" style={{ padding: '3rem' }}>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Consultants and Coaches</h2>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>What StaffAi does:</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <li>• turns "I'm interested" into booked strategy calls</li>
                <li>• qualifies fit before the call</li>
                <li>• nurtures leads who are not ready today</li>
                <li>• sends proposals and payment links when appropriate</li>
              </ul>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--accent-secondary)' }}>Result:</strong> more booked calls and higher close rates
              </div>
            </div>

            {/* MARKETING */}
            <div className="glass-panel-vip animate-fade-in-up delay-300" style={{ padding: '3rem' }}>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Marketing Companies</h2>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>What StaffAi does:</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <li>• engages inbound leads instantly</li>
                <li>• qualifies needs, budget, and timeline</li>
                <li>• books discovery calls</li>
                <li>• nurtures long-cycle prospects so your pipeline stays alive</li>
              </ul>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--accent-secondary)' }}>Result:</strong> fewer lead leaks, more qualified calls
              </div>
            </div>

            {/* ECOMMERCE */}
            <div className="glass-panel-vip animate-fade-in-up delay-400" style={{ padding: '3rem' }}>
               <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Ecommerce</h2>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>Shopify and product-based businesses</p>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>What StaffAi does:</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <li>• answers product questions instantly (shipping, sizing, stock)</li>
                <li>• converts hesitation into purchase intent</li>
                <li>• recovers abandoned buyers through follow-up</li>
                <li>• routes high-intent prospects to voice support if needed</li>
              </ul>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--accent-secondary)' }}>Result:</strong> higher conversion rate, lower abandoned intent
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="container text-center" style={{ paddingBottom: '8rem' }}>
          <h2 style={{ fontSize: '3.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Deploy your AI Revenue Workforce today.</h2>
          <Link href="/portal/signup" className="btn btn-primary btn-pulse" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: '800' }}>
            Free Forever
          </Link>
        </section>
      </main>
    </>
  );
}
