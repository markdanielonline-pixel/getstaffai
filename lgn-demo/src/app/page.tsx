import { LivePlayerCard } from "@/components/ui/LivePlayerCard";
import { NewsCard } from "@/components/ui/NewsCard";
import { ShowCard } from "@/components/ui/ShowCard";
import { news, shows } from "@/data/mockData";
import { ArrowRight, ChevronRight, Video, FileText, Calendar, Building2, Download, Users, Play } from "lucide-react";
import Link from "next/link";
import { CinematicHero } from "@/components/ui/CinematicHero";
import { InstallButton } from "@/components/ui/InstallButton";

export default function Home() {
  const featuredNews = news[0];
  const regularNews = news.slice(1, 4);
  const featuredShows = shows.slice(0, 3);

  return (
    <div className="flex flex-col pb-20">
      <CinematicHero />

      {/* Floating Player Section (Overlaps the Hero slightly) */}
      <section className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-20 mb-24">
        <div className="max-w-5xl mx-auto rounded-[2rem] p-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20">
          <div className="rounded-[1.5rem] overflow-hidden">
            <LivePlayerCard />
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white mb-2">Latest News</h2>
            <p className="text-brand-dark/60 dark:text-white/60">Stories that matter to Trinidad and Tobago.</p>
          </div>
          <Link href="/news" className="hidden sm:flex items-center gap-1 text-brand-pink font-semibold hover:text-brand-purple transition-colors">
            All News <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <NewsCard news={featuredNews} featured={true} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            {regularNews.map(item => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
        
        <Link href="/news" className="sm:hidden mt-6 w-full flex items-center justify-center gap-2 bg-brand-purple/5 dark:bg-white/5 py-4 rounded-xl text-brand-dark dark:text-white font-semibold">
          View All News <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Featured Shows Section */}
      <section className="bg-brand-purple text-white py-20 px-4 border-y border-brand-pink/20">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Shows</h2>
              <p className="text-white/70">Original programming connecting the Caribbean.</p>
            </div>
            <Link href="/shows" className="hidden sm:flex items-center gap-1 text-brand-pink hover:text-white font-semibold transition-colors">
              View Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShows.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </section>

      {/* Community & Business Highlights */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community Pulse */}
          <div className="glass-card p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-brand-pink/5 dark:from-brand-dark dark:to-brand-pink/10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-pink/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-brand-pink" />
              </div>
              <h2 className="text-3xl font-bold text-brand-dark dark:text-white mb-4">Your Community Belongs on LGN.</h2>
              <p className="text-brand-dark/70 dark:text-white/70 text-lg mb-8 leading-relaxed">
                Submit stories, events, public notices, achievements, and issues that matter to your community. Let your voice be heard across the nation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/community" className="bg-brand-pink text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-brand-pink/20 hover:scale-105 transition-transform">
                Submit a Story
              </Link>
              <Link href="/community" className="bg-white dark:bg-white/10 text-brand-dark dark:text-white border border-brand-purple/10 dark:border-white/10 px-6 py-3 rounded-lg font-bold hover:bg-brand-purple/5 transition-colors">
                Share an Event
              </Link>
            </div>
          </div>

          {/* Business Spotlight */}
          <div className="glass-card p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-brand-purple/5 dark:from-brand-dark dark:to-brand-purple/10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-brand-purple dark:text-brand-purple-light" />
              </div>
              <h2 className="text-3xl font-bold text-brand-dark dark:text-white mb-4">Put Your Business in the Spotlight.</h2>
              <p className="text-brand-dark/70 dark:text-white/70 text-lg mb-8 leading-relaxed">
                Reach the audiences that matter. LGN helps local and regional businesses connect with viewers across television, digital, and app-based engagement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/advertise" className="bg-brand-purple text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-brand-purple/20 hover:scale-105 transition-transform">
                Advertise With Us
              </Link>
              <Link href="/business" className="bg-white dark:bg-white/10 text-brand-dark dark:text-white border border-brand-purple/10 dark:border-white/10 px-6 py-3 rounded-lg font-bold hover:bg-brand-purple/5 transition-colors flex items-center gap-2">
                View Spotlight
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Promo */}
      <section className="container mx-auto px-4">
        <div className="rounded-[2rem] overflow-hidden bg-[#171022] text-white relative shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-pink/20 blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
            <div className="z-10">
              <div className="bg-brand-pink/20 text-brand-pink px-4 py-1.5 rounded-full text-sm font-bold w-fit mb-6 inline-flex items-center gap-2 border border-brand-pink/30">
                <Download className="w-4 h-4" /> APP AVAILABLE NOW
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Take LGN with you wherever you go.</h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Install the LGN app to watch live, receive breaking alerts, submit community stories, and access exclusive local business perks directly from your phone.
              </p>
              
              <ul className="space-y-4 mb-10">
                {['Watch Live TV Anywhere', 'Instant Breaking News Alerts', 'Local Business Perks & Discounts', 'Easy Community Submissions'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-pink/20 flex items-center justify-center shrink-0">
                      <ChevronRight className="w-4 h-4 text-brand-pink" />
                    </div>
                    <span className="font-medium text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <InstallButton variant="secondary" />
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center relative z-10">
              {/* Mockup of mobile app */}
              <div className="w-[280px] h-[580px] bg-black rounded-[2.5rem] border-8 border-brand-purple shadow-2xl p-2 relative overflow-hidden ring-4 ring-white/10">
                <div className="w-full h-full bg-[#171022] rounded-[2rem] overflow-hidden relative flex flex-col">
                  {/* Status bar */}
                  <div className="h-6 w-full flex justify-between px-4 items-center bg-[#171022]">
                    <span className="text-[10px] text-white/90">9:41</span>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                    </div>
                  </div>
                  {/* Content Mock */}
                  <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
                    <div className="w-full aspect-video bg-gradient-to-br from-brand-pink to-brand-purple rounded-xl flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/5 rounded" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-20 bg-white/10 rounded-lg shrink-0" />
                      <div className="w-16 h-20 bg-white/10 rounded-lg shrink-0" />
                      <div className="w-16 h-20 bg-white/10 rounded-lg shrink-0" />
                    </div>
                    <div className="space-y-3 mt-2">
                      <div className="h-16 w-full bg-white/5 rounded-lg" />
                      <div className="h-16 w-full bg-white/5 rounded-lg" />
                    </div>
                  </div>
                  {/* Bottom Nav Mock */}
                  <div className="h-14 w-full bg-[#171022] border-t border-white/10 flex justify-around items-center px-2">
                    <div className="w-6 h-6 rounded bg-brand-pink" />
                    <div className="w-6 h-6 rounded bg-white/20" />
                    <div className="w-6 h-6 rounded bg-white/20" />
                    <div className="w-6 h-6 rounded bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
