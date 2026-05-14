import Image from "next/image";
import { Award, Users, Radio, Globe, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";

const milestones = [
  { year: "2018", label: "LGN Founded", desc: "Mrs. Lisa Granger establishes the Lisa Granger Network with a bold vision to give South Trinidad a true media voice." },
  { year: "2020", label: "Digital Launch", desc: "LGN expands to digital platforms, reaching audiences across the Caribbean and the diaspora for the first time." },
  { year: "2022", label: "Community Programming", desc: "Launch of flagship community programming. 'Community Today' and 'The Lisa Granger Interview' became household names overnight." },
  { year: "2024", label: "Broadcast Expansion", desc: "Full broadcast infrastructure upgrade, bringing LGN to HD production standards and expanding to 18 hours of daily programming." },
  { year: "2026", label: "The LGN App", desc: "Launch of the LGN Premium Platform, with live streaming, news, and community tools all in one installable app for every device." },
];

const values = [
  { icon: Heart, title: "Community First", desc: "Every decision we make is filtered through one question: does this serve the people of Trinidad and Tobago?" },
  { icon: Award, title: "Excellence Always", desc: "We hold ourselves to the highest standard of journalism, production quality, and editorial integrity." },
  { icon: Users, title: "Every Voice Matters", desc: "From South Trinidad to Tobago, from the boardroom to the market, every story deserves to be told with dignity and care." },
  { icon: Globe, title: "Caribbean Pride", desc: "We celebrate the culture, spirit, and ambition of our people with depth, dignity, and pride." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-0 overflow-hidden border-b border-brand-purple/10 bg-[#171022]">
        {/* Full-bleed hero image */}
        <div className="relative h-[60vh] md:h-[75vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1598555365516-7fc32d1844b2?q=90&w=2000&auto=format&fit=crop"
            alt="LGN Broadcast Studio"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/20 to-brand-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/30 to-transparent mix-blend-overlay" />
          <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto max-w-6xl px-4 pb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              <Radio className="w-3.5 h-3.5" />
              Our Story
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-7xl font-medium text-white leading-tight mb-4">
              About LGN.
            </h1>
            <p className="text-white/70 text-lg md:text-2xl max-w-2xl font-light leading-relaxed">
              More than a television network. LGN is the voice, the platform, and the heartbeat of community media in Trinidad and Tobago.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission Statement ────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.3em] uppercase text-brand-pink mb-5">Our Mission</p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-brand-dark dark:text-white font-medium leading-tight mb-6">
              Telling the Stories That Define Who We Are.
            </h2>
            <p className="text-brand-dark/70 dark:text-white/60 text-lg leading-relaxed font-light mb-6">
              The Lisa Granger Network was founded on a simple but powerful belief: the people of Trinidad and Tobago deserve a media network that truly belongs to them. Not one that broadcasts about them, but one that broadcasts with them, for them, and because of them.
            </p>
            <p className="text-brand-dark/70 dark:text-white/60 text-lg leading-relaxed font-light">
              Headquartered on ManJack Street, Marabella, we are rooted in the South and committed to the entire nation. Every broadcast, every programme, every story is an act of service to the communities that make this country extraordinary.
            </p>
          </div>
          <div className="relative">
            <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=90&w=900&auto=format&fit=crop"
                alt="Mrs. Lisa Granger"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="font-[family-name:var(--font-cinzel)] text-white text-xl font-medium">Mrs. Lisa Granger</p>
                <p className="text-white/60 text-sm font-light">Founder &amp; CEO, Lisa Granger Network</p>
              </div>
            </div>
            {/* Floating stat */}
            <div className="absolute -top-5 -right-5 bg-brand-pink text-white rounded-2xl p-5 shadow-2xl">
              <div className="text-4xl font-bold leading-none">8+</div>
              <div className="text-xs font-semibold tracking-wide opacity-80 mt-1">Years of <br />Broadcasting</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-purple/5 dark:bg-white/[0.02] border-y border-brand-purple/10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.3em] uppercase text-brand-purple dark:text-purple-400 mb-4 text-center">What We Stand For</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-brand-dark dark:text-white font-medium text-center mb-14">
            Our Core Values.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="group bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-7 hover:border-brand-pink/30 hover:shadow-[0_8px_30px_rgba(233,30,128,0.08)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-pink/10 flex items-center justify-center mb-5 group-hover:bg-brand-pink/20 transition-colors">
                  <v.icon className="w-6 h-6 text-brand-pink" />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-brand-dark dark:text-white text-lg mb-3">{v.title}</h3>
                <p className="text-brand-dark/60 dark:text-white/50 text-sm leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-20">
        <p className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.3em] uppercase text-brand-pink mb-4 text-center">Our Journey</p>
        <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-brand-dark dark:text-white font-medium text-center mb-14">
          Building a Legacy.
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-brand-purple/10 dark:bg-white/10 -translate-x-1/2" />
          <div className="flex flex-col gap-12">
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative flex flex-col md:flex-row gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-pink border-4 border-background shadow-[0_0_0_3px_rgba(233,30,128,0.2)]" />
                {/* Content */}
                <div className={`flex-1 ml-14 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                  <span className="font-[family-name:var(--font-cinzel)] text-brand-pink text-4xl font-medium">{m.year}</span>
                  <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-brand-dark dark:text-white text-lg mt-1 mb-2">{m.label}</h3>
                  <p className="text-brand-dark/60 dark:text-white/50 text-sm leading-relaxed font-light max-w-sm">{m.desc}</p>
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-purple via-[#3d0e7a] to-brand-dark p-10 md:p-16 text-center">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, #E91E80, transparent 70%)" }}
          />
          <Radio className="w-12 h-12 text-white/40 mx-auto mb-5" />
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-white font-medium mb-4">
            Be Part of the Story.
          </h2>
          <p className="text-white/60 text-lg font-light max-w-xl mx-auto mb-8">
            Whether you want to advertise, submit a story, or simply tune in, there is a place for you in the LGN community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/watch" className="bg-white text-brand-purple px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform flex items-center gap-2">
              Watch Live <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="border border-white/20 text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
              Contact Us <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
