import Link from 'next/link';

export default function Header() {
  return (
    <header className="header glass-panel-vip" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'fixed', width: '100%', top: '0', zIndex: '1000' }}>
      <div className="container flex-between header-inner">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="StaffAi Logo" style={{ height: '36px', width: 'auto' }} />
        </Link>
        <nav className="nav-links">
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/why-staffai">Why StaffAi</Link>
          <Link href="/qa">Q&A</Link>
          <Link href="/roadmap">Roadmap</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/portal/login" className="login-link hover:text-white transition">Login</Link>
          <Link href="/portal/signup" className="btn btn-primary" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '0.6rem 1.5rem', fontWeight: '700' }}>Start Free Forever</Link>
        </div>
      </div>
    </header>
  );
}
