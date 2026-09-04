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
          <a href="https://getstaffai.com/how-it-works.html">How It Works</a>
          <a href="https://getstaffai.com/employees.html">AI Employees</a>
          <a href="https://getstaffai.com/teams.html">Teams</a>
          <Link href="/pricing">Pricing</Link>
          <a href="https://getstaffai.com/about.html">About</a>
        </nav>

        <div className="nav-actions">
          <Link href="/portal/login" className="login-link">Login</Link>
          <Link href="/portal/signup" className="btn btn-gold btn-sm">
            Establish Your Office
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
        <a href="https://getstaffai.com/how-it-works.html" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a href="https://getstaffai.com/employees.html" onClick={() => setMenuOpen(false)}>AI Employees</a>
        <a href="https://getstaffai.com/teams.html" onClick={() => setMenuOpen(false)}>Teams</a>
        <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
        <a href="https://getstaffai.com/about.html" onClick={() => setMenuOpen(false)}>About</a>
        <Link href="/portal/login" onClick={() => setMenuOpen(false)}>Login</Link>
      </nav>
    </header>
  );
}
