import Link from "next/link";
import { Play } from "lucide-react";

interface NewsCardProps {
  news: {
    id: string;
    category: string;
    title: string;
    summary: string;
    date: string;
    hasVideo: boolean;
  };
  featured?: boolean;
}

export function NewsCard({ news, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <Link href={`/news/${news.id}`} className="group block h-full">
        <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-2xl glass-card border-none">
          {/* Background Image */}
          <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/10 transition-colors z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-pink text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                {news.category}
              </span>
              {news.hasVideo && (
                <span className="bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white" />
                  VIDEO
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-brand-pink transition-colors">
              {news.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base line-clamp-2 max-w-2xl mb-4">
              {news.summary}
            </p>
            <div className="text-white/50 text-xs font-medium tracking-widest uppercase">
              {news.date}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.id}`} className="group block h-full">
      <div className="glass-card flex flex-col h-full bg-white dark:bg-brand-dark hover:-translate-y-1 transition-all duration-300 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-brand-purple dark:text-brand-pink uppercase tracking-widest bg-brand-purple/5 dark:bg-brand-pink/10 px-2 py-1 rounded-md">
            {news.category}
          </span>
          {news.hasVideo && (
            <span className="text-brand-pink">
              <Play className="w-5 h-5 fill-brand-pink" />
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-brand-dark dark:text-white leading-snug mb-2 group-hover:text-brand-pink transition-colors line-clamp-3">
          {news.title}
        </h3>
        
        <p className="text-sm text-brand-dark/70 dark:text-white/70 line-clamp-2 mb-4 flex-grow">
          {news.summary}
        </p>
        
        <div className="text-xs font-medium text-brand-dark/40 dark:text-white/40 uppercase tracking-widest mt-auto">
          {news.date}
        </div>
      </div>
    </Link>
  );
}
