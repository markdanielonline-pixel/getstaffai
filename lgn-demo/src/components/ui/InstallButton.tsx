"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface InstallButtonProps {
  variant?: "primary" | "secondary" | "hero" | "footer";
  text?: string;
  className?: string;
}

export function InstallButton({ variant = "primary", text = "Install App Now", className = "" }: InstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!deferredPrompt) {
      if (window.location.pathname !== '/app') {
        window.location.href = '/app#install';
      } else {
        document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const displayText = isInstalled ? "App Installed" : text;

  if (variant === "hero") {
    return (
      <button onClick={handleInstallClick} className={`group relative inline-flex ${className}`}>
        <div className="absolute inset-0 bg-brand-pink rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="relative bg-white text-black px-10 py-4 rounded-full flex items-center gap-3 hover:scale-105 transition-transform w-full justify-center">
          <Download className="w-5 h-5 fill-black flex-shrink-0" />
          <span className="font-[family-name:var(--font-montserrat)] font-bold tracking-[0.12em] uppercase text-sm">{displayText}</span>
        </div>
      </button>
    );
  }
  
  if (variant === "footer") {
    return (
      <button onClick={handleInstallClick} className={`inline-flex items-center gap-3 bg-white text-brand-purple px-12 py-5 rounded-full font-bold tracking-[0.15em] uppercase text-sm hover:scale-105 transition-transform shadow-2xl ${className}`}>
        <Download className="w-5 h-5" />
        {displayText}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button onClick={handleInstallClick} className={`bg-white text-brand-dark px-8 py-4 rounded-xl font-bold hover:bg-brand-pink hover:text-white transition-colors shadow-xl flex items-center justify-center gap-2 ${className}`}>
        <Download className="w-5 h-5" />
        {displayText}
      </button>
    );
  }

  // Primary
  return (
    <button onClick={handleInstallClick} className={`bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-brand-pink/20 hover:scale-105 transition-all flex items-center justify-center gap-2 ${className}`}>
      <Download className="w-5 h-5" />
      {displayText}
    </button>
  );
}
