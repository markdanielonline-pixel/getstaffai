"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// ─── Slide Data ──────────────────────────────────────────────────────────────
const slides = [
  {
    id: 0,
    eyebrow: "Lisa Granger Network",
    headline: ["The Voice", "of the Nation."],
    sub: "Where every story matters, every voice is heard, and every broadcast serves the people of Trinidad and Tobago.",
    accent: "#E91E80",
    bgImage: "https://images.unsplash.com/photo-1598555365516-7fc32d1844b2?q=90&w=2400&auto=format&fit=crop",
    bgTint: "from-[#0A0010] via-[#1a003a]/60 to-[#0A0010]",
  },
  {
    id: 1,
    eyebrow: "Our Purpose",
    headline: ["Uplifting", "the Caribbean Spirit."],
    sub: "Dedicated to amplifying the culture, pride, and ambition of Trinidad and Tobago. One story, one broadcast, one community at a time.",
    accent: "#2D0B68",
    bgImage: "https://images.unsplash.com/photo-1508997449629-303059a039c0?q=90&w=2400&auto=format&fit=crop",
    bgTint: "from-[#050018] via-[#15002a]/70 to-[#050018]",
  },
  {
    id: 2,
    eyebrow: "Our Standard",
    headline: ["Excellence", "in Every Frame."],
    sub: "Award-winning journalism. Fearless programming. Premium media production that sets the standard for Caribbean broadcasting.",
    accent: "#ffffff",
    bgImage: "https://images.unsplash.com/photo-1478737270197-4b0b1b7b0d1f?q=90&w=2400&auto=format&fit=crop",
    bgTint: "from-[#080010] via-[#200040]/50 to-[#080010]",
  },
];

// ─── Animated Word Reveal ─────────────────────────────────────────────────────
function AnimatedHeadline({ lines, accent }: { lines: string[]; accent: string }) {
  return (
    <h1 className="font-[family-name:var(--font-cinzel)] text-left leading-[1.05] tracking-tight">
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block overflow-hidden">
            {words.map((word, wi) => (
              <motion.span
                key={wi}
                className="inline-block mr-[0.25em]"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{
                  duration: 0.9,
                  delay: li * 0.15 + wi * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={
                  li === lines.length - 1 && wi === words.length - 1
                    ? {
                        color: "transparent",
                        backgroundImage: `linear-gradient(90deg, white 30%, ${accent})`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }
                    : { color: "#fff" }
                }
              >
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CinematicHero() {
  const [current, setCurrent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Brief intro hold, then start auto-rotation
  useEffect(() => {
    const intro = setTimeout(() => setIsReady(true), 400);
    return () => clearTimeout(intro);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [isReady, next]);

  const slide = slides[current];

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-black select-none">

      {/* ── Background Images (crossfade) ───────────────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <Image
            src={slide.bgImage}
            alt=""
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
          {/* Cinematic vignette overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${slide.bgTint}`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,black_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* ── Ambient glow that shifts per slide ──────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={`glow-${current}`}
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          style={{
            background: `radial-gradient(ellipse 60% 50% at 15% 60%, ${slide.accent}18 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* ── Subtle film-grain / scanline texture ────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
        }}
      />

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Top spacer for header */}
        <div className="flex-none h-20 md:h-24" />

        {/* Content Area */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
            <div className="max-w-4xl">

              {/* Eyebrow / Live Badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`eye-${current}`}
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {/* Live dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                  </span>
                  <span
                    className="font-[family-name:var(--font-montserrat)] text-[10px] md:text-xs font-semibold tracking-[0.35em] uppercase"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {slide.eyebrow}
                  </span>
                  {/* Horizontal rule */}
                  <div className="flex-1 max-w-[80px] h-px bg-white/10" />
                </motion.div>
              </AnimatePresence>

              {/* Animated Headline */}
              <div className="mb-8 text-[2.8rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[6.5rem]">
                <AnimatePresence mode="wait">
                  <motion.div key={`headline-${current}`}>
                    <AnimatedHeadline lines={slide.headline} accent={slide.accent} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Subtext */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${current}`}
                  className="font-[family-name:var(--font-montserrat)] text-base md:text-xl text-white/50 max-w-xl leading-relaxed font-light tracking-wide mb-14"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                >
                  {slide.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row items-start gap-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Link href="/watch" className="group relative inline-flex">
                  <div
                    className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                    style={{ backgroundColor: slide.accent }}
                  />
                  <div className="relative bg-white text-black px-10 py-4 rounded-full flex items-center gap-3 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                    <Play className="w-4 h-4 fill-black flex-shrink-0" />
                    <span className="font-[family-name:var(--font-montserrat)] font-bold tracking-[0.18em] uppercase text-xs">
                      Watch Live
                    </span>
                  </div>
                </Link>

                <Link href="/community" className="group inline-flex">
                  <div className="relative text-white border border-white/20 px-10 py-4 rounded-full flex items-center gap-3 transition-all duration-500 hover:bg-white/8 hover:border-white/40">
                    <FileText className="w-4 h-4 flex-shrink-0 text-white/60 group-hover:text-white transition-colors duration-300" />
                    <span className="font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.18em] uppercase text-xs text-white/60 group-hover:text-white transition-colors duration-300">
                      Submit a Story
                    </span>
                  </div>
                </Link>
              </motion.div>

            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Slide indicators + Scroll cue ─────────────────────── */}
        <div className="flex-none py-10 px-6 md:px-12 lg:px-20">
          <div className="container mx-auto max-w-7xl flex items-center justify-between">

            {/* Slide Progress Indicators */}
            <div className="flex items-center gap-3">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="group relative flex items-center"
                  aria-label={`Slide ${i + 1}`}
                >
                  <motion.div
                    className="h-[2px] rounded-full overflow-hidden bg-white/20"
                    animate={{ width: i === current ? 48 : 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {i === current && (
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 7, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                </button>
              ))}
            </div>

            {/* Slide count */}
            <div className="font-[family-name:var(--font-montserrat)] text-[10px] tracking-[0.2em] text-white/30 uppercase tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>

            {/* Scroll cue */}
            <motion.div
              className="hidden md:flex items-center gap-3 text-white/30 cursor-pointer"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] tracking-[0.25em] uppercase">
                Scroll
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>

          </div>
        </div>
      </div>

    </div>
  );
}
