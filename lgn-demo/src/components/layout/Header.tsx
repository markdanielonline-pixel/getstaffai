"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Watch Live", href: "/watch" },
  { label: "News", href: "/news" },
  { label: "Shows", href: "/shows" },
  { label: "Personalities", href: "/personalities" },
  { label: "Events", href: "/events" },
  { label: "Alerts", href: "/alerts" },
  { label: "Community", href: "/community" },
  { label: "Advertise", href: "/advertise" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Get the App", href: "/app" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-brand-purple/10 dark:border-white/10">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-48 h-16 sm:w-56 sm:h-20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image 
              src="/logo-primary.png" 
              alt="LGN Logo" 
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-brand-pink ${
                pathname === item.href
                  ? "text-brand-pink"
                  : "text-brand-dark/80 dark:text-white/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-brand-dark/80 dark:text-white/80 hover:text-brand-pink transition-colors rounded-full hover:bg-brand-purple/5">
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/watch"
            className="hidden sm:flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-lg shadow-brand-pink/20 hover:shadow-brand-pink/40"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Watch Live
          </Link>
          <button 
            className="md:hidden p-2 text-brand-dark/80 dark:text-white/80 hover:text-brand-pink transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-brand-dark border-b border-brand-purple/10 dark:border-white/10 shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-brand-dark dark:text-white hover:text-brand-pink px-2 py-1 rounded-md"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/watch"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-brand-pink text-white px-5 py-3 rounded-xl font-semibold text-base mt-2"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            Watch Live Now
          </Link>
        </div>
      )}
    </header>
  );
}
