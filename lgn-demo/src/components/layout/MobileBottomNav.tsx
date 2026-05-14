"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle, Newspaper, Bell, Users, Gift } from "lucide-react";

const navItems = [
  { label: "Watch", href: "/watch", icon: PlayCircle },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Community", href: "/community", icon: Users },
  { label: "Perks", href: "/perks", icon: Gift },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-brand-purple/10 dark:border-white/10 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-brand-pink" : "text-brand-dark/60 dark:text-white/60 hover:text-brand-purple"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "fill-brand-pink/10" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
