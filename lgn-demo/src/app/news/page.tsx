import { NewsCard } from "@/components/ui/NewsCard";
import { news } from "@/data/mockData";

export default function NewsPage() {
  const categories = ["All", "National", "Community", "Business", "Culture", "Sports", "Caribbean"];

  return (
    <div className="pt-8 pb-20 px-4">
      <div className="container mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-dark dark:text-white">Latest News</h1>
          <p className="text-brand-dark/70 dark:text-white/70 text-lg">
            Stay informed with the stories that matter to Trinidad and Tobago and the wider Caribbean.
          </p>
        </div>

        {/* Category Filter Mockup */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors
                ${idx === 0 
                  ? 'bg-brand-pink text-white' 
                  : 'bg-white dark:bg-brand-dark border border-brand-purple/10 dark:border-white/10 text-brand-dark/70 dark:text-white/70 hover:border-brand-pink hover:text-brand-pink'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured News takes up 2 cols on tablet/desktop */}
          <div className="md:col-span-2 lg:col-span-2">
            <NewsCard news={news[0]} featured={true} />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <NewsCard news={news[1]} />
          </div>
          {news.slice(2).map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
