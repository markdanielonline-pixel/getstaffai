"use client";

import { PlayCircle } from "lucide-react";
import Link from "next/link";

interface ShowCardProps {
  show: {
    id: string;
    title: string;
    description: string;
    airTime: string;
    host: string;
  };
}

export function ShowCard({ show }: ShowCardProps) {
  return (
    <div className="glass-card overflow-hidden group flex flex-col h-full bg-white dark:bg-brand-dark hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-purple/5">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        
        {/* Placeholder Image using CSS gradient and patterns */}
        <div className="absolute inset-0 bg-brand-purple mix-blend-multiply opacity-50 group-hover:opacity-30 transition-opacity" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598555365516-7fc32d1844b2?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
        
        {/* Overlay Content */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="bg-brand-pink text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg">
            {show.airTime}
          </div>
          <button className="text-white hover:text-brand-pink transition-colors">
            <PlayCircle className="w-8 h-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-brand-dark dark:text-white mb-2 line-clamp-1 group-hover:text-brand-pink transition-colors">{show.title}</h3>
        <p className="text-sm text-brand-dark/70 dark:text-white/70 line-clamp-2 flex-grow mb-4">
          {show.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-purple/10 dark:border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-brand-dark/50 dark:text-white/50 font-semibold">Hosted By</span>
            <span className="text-sm font-medium text-brand-dark dark:text-white">{show.host}</span>
          </div>
          <Link href={`/shows/${show.id}`} className="text-xs font-semibold text-brand-pink hover:text-brand-purple transition-colors uppercase tracking-wider">
            Episodes &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
