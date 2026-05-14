import { LivePlayerCard } from "@/components/ui/LivePlayerCard";
import { schedule } from "@/data/mockData";
import { PlayCircle } from "lucide-react";

export default function WatchLivePage() {
  return (
    <div className="pt-8 pb-20 px-4 bg-brand-dark min-h-screen text-white">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Watch Live</h1>
          <p className="text-white/70">Broadcasting from Marabella to the nation and beyond.</p>
        </div>

        {/* Live Player */}
        <div className="max-w-6xl mx-auto mb-16">
          <LivePlayerCard />
        </div>

        {/* Schedule */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            Today's Schedule
          </h2>
          
          <div className="glass-card bg-white/5 border-white/10 rounded-2xl overflow-hidden">
            {schedule.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center p-4 sm:p-6 border-b border-white/5 last:border-0 transition-colors
                  ${item.isLiveNow ? 'bg-brand-pink/10 border-l-4 border-l-brand-pink relative' : 'hover:bg-white/5'}
                `}
              >
                <div className="w-24 sm:w-32 shrink-0 font-bold text-brand-pink/90">
                  {item.time}
                </div>
                <div className="flex-1 font-semibold text-lg">
                  {item.title}
                </div>
                <div>
                  {item.isLiveNow ? (
                    <span className="bg-brand-pink text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <PlayCircle className="w-6 h-6 text-white/30 hover:text-brand-pink cursor-pointer transition-colors" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
