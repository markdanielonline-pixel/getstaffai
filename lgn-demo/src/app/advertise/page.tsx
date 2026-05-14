import { adPackages } from "@/data/mockData";
import { CheckCircle2, TrendingUp, Users, Tv } from "lucide-react";

export default function AdvertisePage() {
  return (
    <div className="pt-8 pb-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full font-bold text-sm mb-6">
            <TrendingUp className="w-4 h-4" /> LGN FOR BUSINESS
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark dark:text-white mb-6 leading-tight">
            Reach the Audiences That Matter.
          </h1>
          <p className="text-xl text-brand-dark/70 dark:text-white/70 leading-relaxed">
            LGN helps local and regional businesses connect with viewers across television, digital, community programming, and app-based engagement.
          </p>
        </div>

        {/* Why LGN Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="glass-card p-8 text-center bg-white dark:bg-brand-dark">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6">
              <Tv className="w-8 h-8 text-brand-purple" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-dark dark:text-white">Multi-Platform Reach</h3>
            <p className="text-brand-dark/70 dark:text-white/70">Connect with audiences watching live TV, browsing the website, or engaging through the LGN App.</p>
          </div>
          <div className="glass-card p-8 text-center bg-white dark:bg-brand-dark">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-pink/10 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-brand-pink" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-dark dark:text-white">Hyper-Local Targeting</h3>
            <p className="text-brand-dark/70 dark:text-white/70">Reach specific communities in Trinidad and Tobago, or scale your message to the entire Caribbean.</p>
          </div>
          <div className="glass-card p-8 text-center bg-white dark:bg-brand-dark">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-dark dark:text-white">Measurable Impact</h3>
            <p className="text-brand-dark/70 dark:text-white/70">Our digital and app integrations allow you to track engagement and drive direct action to your business.</p>
          </div>
        </div>

        {/* Packages Section */}
        <h2 className="text-3xl font-bold text-center mb-10 text-brand-dark dark:text-white">Advertising Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {adPackages.map((pkg, idx) => (
            <div key={pkg.id} className={`glass-card p-8 flex flex-col ${idx === 2 ? 'ring-2 ring-brand-pink shadow-xl shadow-brand-pink/10 relative scale-105' : 'bg-white dark:bg-brand-dark'}`}>
              {idx === 2 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-pink text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-brand-dark dark:text-white">{pkg.name}</h3>
              <p className="text-sm text-brand-dark/60 dark:text-white/60 mb-6 flex-grow">{pkg.description}</p>
              
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-brand-dark/80 dark:text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-brand-pink shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <div className="text-2xl font-extrabold text-brand-dark dark:text-white mb-4">Custom Quote</div>
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${idx === 2 ? 'bg-brand-pink text-white hover:bg-brand-pink/90' : 'bg-brand-purple/5 dark:bg-white/5 text-brand-dark dark:text-white hover:bg-brand-purple/10 dark:hover:bg-white/10'}`}>
                  Request Rates
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-10 md:p-16 text-center bg-gradient-to-br from-brand-purple to-brand-dark text-white rounded-[2rem]">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to grow your business?</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">Get in touch with our sales team to build a custom advertising plan that fits your budget and goals.</p>
          <button className="bg-white text-brand-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-pink hover:text-white transition-all shadow-xl">
            Contact Sales Team
          </button>
        </div>
      </div>
    </div>
  );
}
