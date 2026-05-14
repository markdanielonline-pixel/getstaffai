import { shows } from "@/data/mockData";
import { Clock, Tv, Mic, Play, ArrowRight } from "lucide-react";
import Link from "next/link";

const showImages = [
  "https://images.unsplash.com/photo-1598555365516-7fc32d1844b2?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478737270197-4b0b1b7b0d1f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508997449629-303059a039c0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524678714210-9917a6c619c2?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
];

const categories = ["All", "News & Current Affairs", "Culture & Lifestyle", "Talk & Interview", "Community"];

export default function ShowsPage() {
  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-brand-purple/10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-pink/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple dark:text-brand-pink px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            <Tv className="w-3.5 h-3.5" />
            LGN Programming
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-medium text-brand-dark dark:text-white leading-tight mb-6">
            Our Shows.
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/60 dark:text-white/60 max-w-2xl font-light leading-relaxed">
            From the morning brief to primetime interviews, every LGN programme is crafted with purpose, precision, and passion for the people of Trinidad and Tobago.
          </p>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────────────────────────────── */}
      <section className="border-b border-brand-purple/10 bg-background sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                i === 0
                  ? "bg-brand-purple text-white shadow-[0_4px_20px_rgba(45,11,104,0.3)]"
                  : "bg-brand-purple/5 text-brand-dark/70 dark:text-white/60 hover:bg-brand-purple/10 border border-brand-purple/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Show ─────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
          <div className="absolute inset-0">
            <img
              src={showImages[5]}
              alt="The Lisa Granger Interview"
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>
          <div className="relative z-10 p-10 md:p-16 max-w-2xl min-h-[400px] flex flex-col justify-end">
            <div className="inline-flex items-center gap-2 bg-brand-pink/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 w-fit">
              ★ Signature Show
            </div>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl text-white leading-tight mb-4">
              The Lisa Granger Interview
            </h2>
            <p className="text-white/70 text-lg mb-6 leading-relaxed font-light">
              A signature conversation series hosted by Mrs. Lisa Granger herself, featuring leaders, builders, artists, and changemakers shaping the future of Trinidad and the Caribbean.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                Sundays at 7:00 PM
              </div>
              <Link href="/watch" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-black" />
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shows Grid ────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold tracking-[0.2em] uppercase text-brand-dark/40 dark:text-white/40 mb-8">
          All Programming
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show, i) => (
            <div key={show.id} className="group relative bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl overflow-hidden hover:border-brand-pink/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(233,30,128,0.08)]">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={showImages[i % showImages.length]}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-brand-pink" />
                  {show.airTime}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-brand-dark dark:text-white text-lg mb-2 leading-tight group-hover:text-brand-pink dark:group-hover:text-brand-pink transition-colors">
                  {show.title}
                </h3>
                <p className="text-brand-dark/60 dark:text-white/50 text-sm leading-relaxed mb-4 font-light">
                  {show.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-brand-dark/50 dark:text-white/40">
                    <Mic className="w-3.5 h-3.5" />
                    {show.host}
                  </div>
                  <Link href="/watch" className="flex items-center gap-1 text-xs font-bold text-brand-pink hover:gap-2 transition-all">
                    Tune In <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
