'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container flex-between header-inner">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/logo.png" alt="StaffAI" width={160} height={32} priority style={{ height: '32px', width: 'auto' }} />
        </Link>

        <nav className="nav-links">
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/the-talent-pool">The Talent Pool</Link>
          <Link href="/pricing">Intelligence Levels</Link>
          <Link href="/why-staffai">Why StaffAI</Link>
          <Link href="/qa">Q&A</Link>
        </nav>

        <div className="nav-actions">
          <Link href="/portal/login" className="login-link">Login</Link>
          <Link href="/portal/signup" className="btn btn-gold btn-sm">
            Incorporate Free
          </Link>
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </div>

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
        <Link href="/the-talent-pool" onClick={() => setMenuOpen(false)}>The Talent Pool</Link>
        <Link href="/pricing" onClick={() => setMenuOpen(false)}>Intelligence Levels</Link>
        <Link href="/industries" onClick={() => setMenuOpen(false)}>Industries</Link>
        <Link href="/why-staffai" onClick={() => setMenuOpen(false)}>Why StaffAI</Link>
        <Link href="/qa" onClick={() => setMenuOpen(false)}>Q&A</Link>
        <Link href="/portal/login" onClick={() => setMenuOpen(false)}>Login</Link>
      </nav>
    </header>
  );
}
