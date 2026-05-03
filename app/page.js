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

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.85)', marginBottom: '0.85rem' }}>
                StaffAI
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '240px', fontSize: '0.85rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                The world's first AI Company-as-a-Service. Your organisation, fully staffed and fully running.
              </p>
              <span style={{ display: 'inline-block', fontFamily: 'var(--font-heading)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', padding: '0.3rem 0.75rem', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 999 }}>
                getstaffai.com
              </span>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/the-talent-pool">The Talent Pool</Link>
              <Link href="/pricing">Intelligence Levels</Link>
              <Link href="/industries">Industries</Link>
              <Link href="/roadmap">Roadmap</Link>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Support</div>
              <Link href="/qa">Q&amp;A</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/portal/login">Login</Link>
              <Link href="/portal/signup">Incorporate Free</Link>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <Link href="/compliance#privacy">Privacy Policy</Link>
              <Link href="/compliance#terms">Terms of Service</Link>
              <Link href="/compliance#acceptable">Acceptable Use</Link>
              <Link href="/refund-policy">Refund Policy</Link>
              <Link href="/compliance#cookies">Cookie Policy</Link>
              <Link href="/compliance#disclaimer">Disclaimer</Link>
            </div>
          </div>

          {/* Studio9 LLC brand notice */}
          <div style={{
            padding: '1.5rem 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em', fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
              StaffAi is a registered brand of <strong style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>Studio9 LLC</strong>, registered in the State of New Mexico, United States.
            </span>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Studio9 LLC. All rights reserved. StaffAi is a brand of Studio9 LLC.</span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>
              Built for CEOs who demand more.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
