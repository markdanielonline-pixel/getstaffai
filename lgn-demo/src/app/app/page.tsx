"use client";

import { motion } from "framer-motion";
import { Smartphone, Wifi, Bell, Download, Play, Newspaper, Users, CloudRain, Star, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InstallButton } from "@/components/ui/InstallButton";

const features = [
  {
    icon: Play,
    title: "Live TV, Anywhere",
    desc: "Watch LGN's full broadcast live on your phone, tablet, or desktop. No cable. No hardware. Just tap and watch.",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    icon: Newspaper,
    title: "Breaking News First",
    desc: "Get the latest news the moment it breaks. LGN pushes national and community updates before anyone else.",
    color: "text-brand-pink",
    bg: "bg-brand-pink/10",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    desc: "Weather warnings, traffic advisories, and public notices delivered directly to your device in real time.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Users,
    title: "Community Hub",
    desc: "Submit news tips, birthday shoutouts, events, and local stories straight from your phone. Your voice, amplified.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: CloudRain,
    title: "Live Weather",
    desc: "Hyper-local Trinidad and Tobago weather, updated every 30 minutes. Plan your day with confidence.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Zap,
    title: "Works Offline",
    desc: "Already viewed a story? Read it again without signal. The LGN app is built to keep you informed even in low-coverage areas.",
    color: "text-brand-purple",
    bg: "bg-brand-purple/10",
  },
];

const steps = [
  { platform: "iPhone", icon: "🍎", step1: "Open Safari and visit lgn-demo.vercel.app", step2: "Tap the Share icon at the bottom", step3: "Tap \"Add to Home Screen\" then \"Add\"" },
  { platform: "Android", icon: "🤖", step1: "Open Chrome and visit lgn-demo.vercel.app", step2: "Tap the three-dot menu at the top right", step3: "Tap \"Add to Home Screen\" or \"Install App\"" },
];

const reviews = [
  { name: "Kezia M.", location: "San Fernando", text: "Finally a local channel with an app that actually works. I watch the morning news every day on my way to work.", rating: 5 },
  { name: "Marcus T.", location: "Marabella", text: "The alerts alone are worth it. I knew about the flooding before my neighbours did. This app is essential.", rating: 5 },
  { name: "Sandra P.", location: "Tobago", text: "I submitted a community event and they featured it on the evening broadcast. Incredible reach for a local platform.", rating: 5 },
];

export default function AppPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="min-h-screen bg-background pb-20 overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 overflow-hidden bg-black min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1598555365516-7fc32d1844b2?q=80&w=2000&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(233,30,128,0.08),transparent)]" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 bg-brand-pink/15 border border-brand-pink/25 text-brand-pink px-4 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Now Available as a Free App
              </motion.div>

              <motion.h1
                className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.1] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                LGN in Your Pocket.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-400">
                  Always On.
                </span>
              </motion.h1>

              <motion.p
                className="font-[family-name:var(--font-montserrat)] text-white/60 text-lg leading-relaxed font-light mb-10 max-w-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                The LGN app brings live television, breaking news, community alerts, and local stories to your phone. Free. Fast. Made for Trinidad and Tobago.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <InstallButton variant="hero" text="Get the App Free" />
                <Link href="/watch" className="border border-white/15 text-white/80 px-10 py-4 rounded-full flex items-center gap-3 hover:bg-white/5 transition-colors">
                  <Play className="w-4 h-4 fill-white/80" />
                  <span className="font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.12em] uppercase text-sm">Watch Live Now</span>
                </Link>
              </motion.div>

              {/* Trust Signals */}
              <motion.div
                className="flex items-center gap-6 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-white/50 text-xs ml-1 font-medium">5.0 Rating</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  No App Store Required
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                  <Wifi className="w-4 h-4 text-blue-400" />
                  Works Offline
                </div>
              </motion.div>
            </div>

            {/* Right: Phone Mockup */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-brand-pink/20 blur-[80px] rounded-full scale-75" />
                {/* Phone shell */}
                <div className="relative w-[280px] md:w-[320px] rounded-[3rem] border-[6px] border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-black">
                  {/* Status bar */}
                  <div className="bg-black px-6 pt-3 pb-2 flex justify-between items-center">
                    <span className="text-white text-[11px] font-semibold">9:41</span>
                    <div className="w-20 h-6 bg-black rounded-full border border-white/10 mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2.5 rounded-sm border border-white/40 relative">
                        <div className="absolute inset-0.5 right-0.5 bg-white/60 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  {/* App content */}
                  <div className="bg-[#0A0010] min-h-[580px] relative overflow-hidden">
                    {/* App Header */}
                    <div className="bg-black/80 backdrop-blur px-5 py-3 flex justify-between items-center border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                          <Image src="/logo.png" alt="LGN" fill className="object-contain" />
                        </div>
                        <span className="text-white font-bold text-sm">LGN</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 text-[10px] font-bold">LIVE</span>
                      </div>
                    </div>
                    {/* Live Player */}
                    <div className="relative h-44 bg-gradient-to-br from-brand-purple/30 to-brand-pink/20 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-40">
                        <Image
                          src="https://images.unsplash.com/photo-1478737270197-4b0b1b7b0d1f?q=80&w=400&auto=format&fit=crop"
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <span className="text-white text-[10px] font-semibold bg-black/40 px-2 py-0.5 rounded">The Lisa Granger Interview</span>
                        <span className="text-white text-[10px] bg-red-500 px-2 py-0.5 rounded font-bold">LIVE</span>
                      </div>
                    </div>
                    {/* News feed */}
                    <div className="px-4 py-3 space-y-3">
                      {[
                        { cat: "Breaking", title: "Community Leaders Meet in South Trinidad", time: "2m ago" },
                        { cat: "Weather", title: "Showers Expected Across T&T Today", time: "15m ago" },
                        { cat: "Culture", title: "National Youth Talent Showcase This Weekend", time: "1h ago" },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-12 h-12 rounded-xl bg-brand-purple/20 border border-white/5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-brand-pink text-[9px] font-bold uppercase tracking-wider">{item.cat}</span>
                              <span className="text-white/20 text-[9px]">{item.time}</span>
                            </div>
                            <p className="text-white/80 text-[11px] font-medium leading-tight line-clamp-2">{item.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Bottom Nav */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-white/5 flex justify-around py-3 px-2">
                      {[
                        { icon: Play, label: "Watch" },
                        { icon: Newspaper, label: "News" },
                        { icon: Bell, label: "Alerts" },
                        { icon: Users, label: "Community" },
                      ].map((n) => (
                        <div key={n.label} className="flex flex-col items-center gap-0.5">
                          <n.icon className={`w-4 h-4 ${n.label === "Watch" ? "text-brand-pink" : "text-white/30"}`} />
                          <span className={`text-[8px] font-semibold ${n.label === "Watch" ? "text-brand-pink" : "text-white/30"}`}>{n.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-16">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.3em] uppercase text-brand-pink mb-4">Why Download</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-medium text-brand-dark dark:text-white leading-tight">
            Everything You Need.<br />Nothing You Don't.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-7 hover:border-brand-pink/30 hover:shadow-[0_8px_30px_rgba(233,30,128,0.07)] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-brand-dark dark:text-white text-lg mb-3">{f.title}</h3>
              <p className="text-brand-dark/60 dark:text-white/50 text-sm leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Install Steps ─────────────────────────────────────────────────── */}
      <section id="install" className="bg-black py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.3em] uppercase text-brand-pink mb-4">Install in 30 Seconds</p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-medium text-white leading-tight mb-4">
              Get the App Now.
            </h2>
            <p className="text-white/50 font-light max-w-lg mx-auto">
              No app store. No waiting. Install the LGN app directly from your browser on any device. It is completely free.
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="flex justify-center gap-3 mb-10">
            {steps.map((s, i) => (
              <button
                key={s.platform}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm tracking-wide transition-all ${
                  activeStep === i
                    ? "bg-white text-black shadow-lg"
                    : "border border-white/15 text-white/60 hover:border-white/30"
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                {s.platform}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[steps[activeStep].step1, steps[activeStep].step2, steps[activeStep].step3].map((step, i) => (
              <motion.div
                key={`${activeStep}-${i}`}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="font-[family-name:var(--font-cinzel)] text-4xl font-medium text-white/10 mb-4 leading-none">0{i + 1}</div>
                <p className="text-white/80 font-medium leading-snug text-sm">{step}</p>
                {i < 2 && <ChevronRight className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 hidden md:block" />}
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://lgn-demo.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-brand-pink hover:bg-brand-pink/90 text-white px-12 py-5 rounded-full font-bold tracking-[0.15em] uppercase text-sm transition-all hover:scale-105 shadow-[0_8px_40px_rgba(233,30,128,0.4)]"
            >
              <Smartphone className="w-5 h-5" />
              Open lgn-demo.vercel.app
            </a>
          </div>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-14">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.3em] uppercase text-brand-pink mb-4">What People Are Saying</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-medium text-brand-dark dark:text-white">
            The Community Loves It.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex gap-0.5 mb-5">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-brand-dark/80 dark:text-white/70 text-base leading-relaxed font-light mb-6 italic">
                &ldquo;{r.text}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-brand-dark dark:text-white text-sm">{r.name}</p>
                <p className="text-brand-dark/40 dark:text-white/40 text-xs">{r.location}, Trinidad &amp; Tobago</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-purple via-[#3d0e7a] to-brand-dark p-10 md:p-20 text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, #E91E80, transparent 70%)" }} />
          <Smartphone className="w-14 h-14 text-white/30 mx-auto mb-6" />
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl text-white font-medium mb-5 leading-tight">
            Trinidad and Tobago<br />Deserves This.
          </h2>
          <p className="text-white/50 text-lg font-light max-w-xl mx-auto mb-10">
            Install the LGN app today and stay connected to the news, culture, and community that defines our nation.
          </p>
          <InstallButton variant="footer" text="Install for Free" />
        </div>
      </section>

    </main>
  );
}
