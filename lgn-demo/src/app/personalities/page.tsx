import { personalities } from "@/data/mockData";
import { Award, Mic, Star, Mail } from "lucide-react";

const avatarImages = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=600&auto=format&fit=crop",
];

const personalitiesEnriched = [
  {
    id: "1",
    name: "Mrs. Lisa Granger",
    role: "Chief Executive Officer & Host",
    bio: "Founder and visionary of LGN, Mrs. Granger brings decades of media experience, community leadership, and an unwavering passion for elevating the voices of Trinidad and Tobago. Her flagship interview programme is one of the most-watched broadcasts on the network.",
    shows: ["The Lisa Granger Interview"],
    tag: "Founder",
    img: avatarImages[0],
  },
  {
    id: "2",
    name: "Kezia Matthews",
    role: "Senior News Anchor",
    bio: "Award-winning journalist and broadcaster with roots in South Trinidad. Kezia delivers the day's top headlines with clarity, credibility and a commanding on-screen presence that has earned her a loyal national audience.",
    shows: ["LGN Morning Brief", "Evening Report"],
    tag: "News",
    img: avatarImages[1],
  },
  {
    id: "3",
    name: "Marcus Phillip",
    role: "Community Affairs Host",
    bio: "A storyteller at heart, Marcus has dedicated his career to amplifying voices that are often overlooked. His programme, Community Today, travels to neighbourhoods across T&T to bring their stories to the nation.",
    shows: ["Community Today"],
    tag: "Community",
    img: avatarImages[2],
  },
  {
    id: "4",
    name: "Natasha Williams",
    role: "Culture & Lifestyle Presenter",
    bio: "Natasha covers the vibrant creative pulse of Trinidad and Tobago, from Carnival stages to art galleries to family kitchens. Her warmth and authenticity have made Culture Connect the go-to lifestyle show in the region.",
    shows: ["Culture Connect"],
    tag: "Culture",
    img: avatarImages[3],
  },
  {
    id: "5",
    name: "Darius Joseph",
    role: "Digital Content Producer",
    bio: "The technology and storytelling force behind LGN's digital expansion. Darius bridges traditional broadcast excellence with modern audience engagement across platforms, keeping LGN connected with a new generation of viewers.",
    shows: ["Caribbean Conversations"],
    tag: "Digital",
    img: avatarImages[4],
  },
];

const tagColors: Record<string, string> = {
  Founder: "bg-brand-pink/10 text-brand-pink border-brand-pink/20",
  News: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Community: "bg-green-500/10 text-green-400 border-green-500/20",
  Culture: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Digital: "bg-brand-purple/10 text-brand-purple dark:text-purple-400 border-brand-purple/20",
};

export default function PersonalitiesPage() {
  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-brand-purple/10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 via-transparent to-brand-purple/5 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            <Mic className="w-3.5 h-3.5" />
            The Faces of LGN
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-medium text-brand-dark dark:text-white leading-tight mb-6">
            Our Personalities.
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/60 dark:text-white/60 max-w-2xl font-light leading-relaxed">
            The voices, faces, and stories behind the broadcast. Meet the team that brings LGN to life every day, every programme, every word delivered with purpose.
          </p>
        </div>
      </section>

      {/* ── CEO Feature ───────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-purple via-[#4a1080] to-[#1a0040] p-8 md:p-14 flex flex-col md:flex-row gap-10 items-center">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #E91E80 0%, transparent 60%)" }}
          />
          <div className="relative flex-shrink-0">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src={personalitiesEnriched[0].img}
                alt={personalitiesEnriched[0].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-brand-pink text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star className="w-3 h-3 fill-white" />
              Founder & CEO
            </div>
          </div>
          <div className="relative">
            <p className="font-[family-name:var(--font-montserrat)] text-white/50 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Leading the Vision</p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-white font-medium mb-4">{personalitiesEnriched[0].name}</h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-light mb-6 max-w-xl">{personalitiesEnriched[0].bio}</p>
            <div className="flex flex-wrap gap-2">
              {personalitiesEnriched[0].shows.map(s => (
                <span key={s} className="bg-white/10 text-white/80 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Grid ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold tracking-[0.2em] uppercase text-brand-dark/40 dark:text-white/40 mb-8">
          The Full Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalitiesEnriched.slice(1).map((person) => (
            <div key={person.id} className="group bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl overflow-hidden hover:border-brand-pink/30 hover:shadow-[0_8px_30px_rgba(233,30,128,0.08)] transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${tagColors[person.tag] || ""}`}>
                    {person.tag}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-brand-dark dark:text-white text-base mb-0.5 group-hover:text-brand-pink transition-colors">
                  {person.name}
                </h3>
                <p className="text-brand-pink text-xs font-semibold mb-3 tracking-wide">{person.role}</p>
                <p className="text-brand-dark/60 dark:text-white/50 text-xs leading-relaxed font-light mb-4 line-clamp-3">{person.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {person.shows.map(s => (
                    <span key={s} className="bg-brand-purple/5 border border-brand-purple/10 text-brand-dark/60 dark:text-white/50 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Join CTA ──────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-brand-purple/10 dark:border-white/10 bg-brand-purple/5 p-10 text-center">
          <Award className="w-10 h-10 text-brand-pink mx-auto mb-4" />
          <h3 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-brand-dark dark:text-white font-medium mb-3">
            Interested in Joining the LGN Family?
          </h3>
          <p className="text-brand-dark/60 dark:text-white/60 max-w-xl mx-auto mb-6 font-light">
            We are always looking for passionate, talented media professionals to help us tell the stories that matter most to the people of Trinidad and Tobago.
          </p>
          <a href="mailto:careers@lgn.tt" className="inline-flex items-center gap-2 bg-brand-pink text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(233,30,128,0.3)]">
            <Mail className="w-4 h-4" />
            careers@lgn.tt
          </a>
        </div>
      </section>

    </main>
  );
}
