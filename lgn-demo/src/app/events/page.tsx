import { events } from "@/data/mockData";
import { Calendar, MapPin, ArrowRight, Plus, Mic } from "lucide-react";
import Link from "next/link";

const typeColors: Record<string, string> = {
  "Community Meetings": "bg-green-500/10 text-green-400 border-green-500/20",
  "Cultural Events": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Business Events": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Public Notices": "bg-brand-pink/10 text-brand-pink border-brand-pink/20",
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-brand-purple/10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-brand-purple/5 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <Calendar className="w-3.5 h-3.5" />
              What&apos;s Happening
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-medium text-brand-dark dark:text-white leading-tight mb-4">
              Events &amp; Community.
            </h1>
            <p className="text-lg text-brand-dark/60 dark:text-white/60 max-w-xl font-light leading-relaxed">
              Stay connected with everything happening across Trinidad and Tobago. From cultural celebrations to local business events, LGN has your community covered.
            </p>
          </div>
          <Link
            href="/community"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-purple text-white px-7 py-4 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(45,11,104,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Submit an Event
          </Link>
        </div>
      </section>

      {/* ── Featured Event ────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0050] to-[#2D0B68] p-8 md:p-14">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0050] via-[#1a0050]/80 to-transparent" />
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5">
              ⭐ Featured Event
            </span>
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-4xl text-white font-medium mb-4">
              Marabella Community Market Weekend
            </h2>
            <p className="text-white/70 text-base leading-relaxed font-light mb-6">
              Two days of vibrant local culture, fresh produce, arts, crafts, and live entertainment. Join hundreds of community members celebrating the spirit of South Trinidad.
            </p>
            <div className="flex flex-wrap gap-5 mb-8">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4 text-brand-pink" />
                May 15–16, 2026
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-brand-pink" />
                Marabella Market Grounds
              </div>
            </div>
            <button className="bg-white text-brand-purple px-8 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition-transform">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Events List ───────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold tracking-[0.2em] uppercase text-brand-dark/40 dark:text-white/40 mb-8">
          Upcoming Events
        </h2>
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div key={event.id} className="group flex flex-col sm:flex-row sm:items-center gap-6 bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-6 hover:border-brand-pink/30 hover:shadow-[0_4px_20px_rgba(233,30,128,0.07)] transition-all duration-300">
              {/* Date Block */}
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 flex flex-col items-center justify-center border border-brand-purple/10">
                <span className="font-[family-name:var(--font-cinzel)] text-2xl font-medium text-brand-purple dark:text-white leading-none">
                  {event.date.split(",")[0].split(" ")[1]}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-pink mt-1">
                  {event.date.split(",")[0].split(" ")[0]}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${typeColors[event.type] || "bg-brand-purple/10 text-brand-purple border-brand-purple/20"}`}>
                    {event.type}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-brand-dark dark:text-white text-lg mb-1 group-hover:text-brand-pink transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-brand-dark/50 dark:text-white/40 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-dark/20 dark:text-white/20 group-hover:text-brand-pink group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Submit CTA ────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-brand-purple/10 bg-brand-purple/5 p-10 text-center">
          <Mic className="w-10 h-10 text-brand-purple dark:text-purple-400 mx-auto mb-4" />
          <h3 className="font-[family-name:var(--font-cinzel)] text-2xl text-brand-dark dark:text-white font-medium mb-3">
            Have a Community Event?
          </h3>
          <p className="text-brand-dark/60 dark:text-white/60 max-w-lg mx-auto mb-6 font-light">
            Submit your event to LGN and let us help you spread the word across Trinidad and Tobago.
          </p>
          <Link href="/community" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
            Submit Your Event
          </Link>
        </div>
      </section>

    </main>
  );
}
