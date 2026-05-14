"use client";

import { Play, Users, Maximize, Volume2, Settings } from "lucide-react";
import { useState } from "react";
import { schedule } from "@/data/mockData";

export function LivePlayerCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentShow = schedule.find(s => s.isLiveNow) || schedule[0];
  const nextShow = schedule[schedule.indexOf(currentShow) + 1] || schedule[0];

  return (
    <div className="w-full glass-card overflow-hidden flex flex-col relative group">
      {/* Video Area (Placeholder) */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        {/* Placeholder background representing a live studio shot */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/40 to-brand-pink/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598555365516-7fc32d1844b2?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        
        {/* Play Button */}
        {!isPlaying ? (
          <button 
            onClick={() => setIsPlaying(true)}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-pink hover:scale-110 transition-all duration-300 z-10 shadow-[0_0_40px_rgba(233,30,128,0.5)]"
          >
            <Play className="w-8 h-8 ml-1 fill-white" />
          </button>
        ) : (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 bg-black/40 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsPlaying(false)}>
              <Play className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-4 text-white">
              <Volume2 className="w-5 h-5 cursor-pointer hover:text-brand-pink transition-colors" />
              <Settings className="w-5 h-5 cursor-pointer hover:text-brand-pink transition-colors" />
              <Maximize className="w-5 h-5 cursor-pointer hover:text-brand-pink transition-colors" />
            </div>
          </div>
        )}

        {/* Live Badge & Viewer Count */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <div className="bg-brand-pink text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
          <div className="bg-black/50 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/10">
            <Users className="w-3.5 h-3.5" />
            14.2K
          </div>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-6 bg-white dark:bg-brand-dark flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-brand-pink uppercase tracking-widest mb-1">Now Playing</h3>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-dark dark:text-white leading-tight">{currentShow.title}</h2>
          <p className="text-sm text-brand-dark/60 dark:text-white/60 mt-1">Breaking local stories, culture, and community updates.</p>
        </div>
        <div className="sm:text-right flex flex-col gap-1 sm:items-end w-full sm:w-auto p-4 sm:p-0 bg-brand-purple/5 sm:bg-transparent rounded-xl">
          <span className="text-xs font-semibold text-brand-dark/50 dark:text-white/50 uppercase tracking-widest">Up Next</span>
          <span className="font-semibold text-brand-dark dark:text-white">{nextShow.title}</span>
          <span className="text-xs text-brand-pink font-medium">{nextShow.time}</span>
        </div>
      </div>
    </div>
  );
}
