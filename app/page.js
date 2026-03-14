import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <footer className="footer border-t border-glass" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4rem' }}>
          
          <div>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              StaffAi.
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
              Your AI Revenue Workforce. Lead generation, appointment booking, and closing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Product</h4>
              <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
              <Link href="/industries" className="hover:text-white transition">Industries</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <Link href="/why-staffai" className="hover:text-white transition">Why StaffAi</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Support</h4>
              <Link href="/qa" className="hover:text-white transition">Q&A</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
              <Link href="/portal/login" className="hover:text-white transition">Login</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Legal</h4>
              <Link href="/compliance#privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/compliance#terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/compliance#acceptable" className="hover:text-white transition">Acceptable Use</Link>
              <Link href="/compliance#reflex" className="hover:text-white transition">Refunds</Link>
            </div>
          </div>

        </div>
        <div className="container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span>&copy; {new Date().getFullYear()} Studio9 LLC. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
