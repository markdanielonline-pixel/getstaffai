"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { breakingNewsTicker } from "@/data/mockData";

export function BreakingNewsTicker() {
  return (
    <div className="w-full bg-brand-dark border-b border-brand-purple/30 flex items-center overflow-hidden">
      <div className="bg-brand-pink text-white px-4 py-2 flex items-center gap-2 font-bold text-sm z-10 shadow-[4px_0_12px_rgba(0,0,0,0.5)] shrink-0">
        <AlertCircle className="w-4 h-4 animate-pulse" />
        <span className="hidden sm:inline">BREAKING NEWS</span>
        <span className="sm:hidden">LATEST</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center bg-brand-dark/90 text-white/90 text-sm whitespace-nowrap mask-edges">
        <motion.div
          className="flex gap-12 shrink-0 items-center px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* Double the array for seamless looping */}
          {[...breakingNewsTicker, ...breakingNewsTicker].map((news, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
              {news}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
