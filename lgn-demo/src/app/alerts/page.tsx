import { alerts } from "@/data/mockData";
import { CloudRain, AlertTriangle, Info, ShieldCheck, Wind, Thermometer, Eye, Droplets } from "lucide-react";

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", label: "Warning" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "Advisory" },
  normal: { icon: ShieldCheck, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", label: "Notice" },
};

const weatherData = [
  { label: "Temperature", value: "30°C", icon: Thermometer, sub: "Feels like 34°C" },
  { label: "Humidity", value: "78%", icon: Droplets, sub: "High humidity" },
  { label: "Wind", value: "18 km/h", icon: Wind, sub: "East-Northeast" },
  { label: "Visibility", value: "8 km", icon: Eye, sub: "Moderate haze" },
];

const forecast = [
  { day: "Mon", icon: "🌦", hi: 31, lo: 24 },
  { day: "Tue", icon: "⛅", hi: 33, lo: 25 },
  { day: "Wed", icon: "🌧", hi: 29, lo: 23 },
  { day: "Thu", icon: "🌤", hi: 32, lo: 25 },
  { day: "Fri", icon: "☀️", hi: 34, lo: 26 },
  { day: "Sat", icon: "🌤", hi: 33, lo: 25 },
  { day: "Sun", icon: "⛅", hi: 32, lo: 24 },
];

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-brand-purple/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-brand-purple/5 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            <CloudRain className="w-3.5 h-3.5" />
            Live Updates
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-medium text-brand-dark dark:text-white leading-tight mb-4">
            Weather &amp; Alerts.
          </h1>
          <p className="text-lg text-brand-dark/60 dark:text-white/60 max-w-2xl font-light leading-relaxed">
            Real-time weather conditions and official public advisories for Trinidad and Tobago, keeping communities safe, prepared, and informed.
          </p>
        </div>
      </section>

      {/* ── Current Weather Card ──────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1a3a] via-[#0d2550] to-[#0a1a3a] p-8 md:p-12">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504608524841-42584120d693?q=80&w=1200&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a3a] via-[#0a1a3a]/90 to-transparent" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
              <div>
                <p className="font-[family-name:var(--font-montserrat)] text-white/50 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
                  Trinidad &amp; Tobago, Updated just now
                </p>
                <div className="flex items-end gap-4">
                  <span className="text-8xl">🌦</span>
                  <div>
                    <div className="text-7xl font-light text-white leading-none">30°</div>
                    <div className="text-white/60 text-lg font-light mt-1">Partly Cloudy with Showers</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {weatherData.map((w) => (
                  <div key={w.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                    <w.icon className="w-5 h-5 text-blue-300 flex-shrink-0" />
                    <div>
                      <div className="text-white font-semibold text-lg leading-none">{w.value}</div>
                      <div className="text-white/40 text-xs mt-0.5">{w.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-day Forecast */}
            <div className="border-t border-white/10 pt-8">
              <p className="font-[family-name:var(--font-montserrat)] text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-5">7-Day Forecast</p>
              <div className="grid grid-cols-7 gap-2">
                {forecast.map((f) => (
                  <div key={f.day} className="flex flex-col items-center gap-2 bg-white/5 border border-white/5 rounded-xl py-3 px-1">
                    <span className="text-white/50 text-[11px] font-semibold tracking-wide">{f.day}</span>
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-white text-sm font-semibold">{f.hi}°</span>
                    <span className="text-white/30 text-xs">{f.lo}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alerts & Advisories ────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-montserrat)] text-sm font-bold tracking-[0.2em] uppercase text-brand-dark/40 dark:text-white/40 mb-8">
          Active Advisories
        </h2>
        <div className="flex flex-col gap-4 mb-12">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-5 p-6 rounded-2xl border ${config.bg} ${config.border}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${config.color}`}>{config.label}: {alert.type}</span>
                  </div>
                  <p className="text-brand-dark dark:text-white/80 font-medium">{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Advisory CTA */}
        <div className="rounded-2xl border border-brand-purple/10 bg-brand-purple/5 p-10 text-center">
          <ShieldCheck className="w-10 h-10 text-brand-purple dark:text-purple-400 mx-auto mb-4" />
          <h3 className="font-[family-name:var(--font-cinzel)] text-2xl text-brand-dark dark:text-white font-medium mb-3">
            Submit a Public Advisory
          </h3>
          <p className="text-brand-dark/60 dark:text-white/60 max-w-lg mx-auto mb-6 font-light">
            Government agencies, ODPM, and verified community organizations may submit official public notices for broadcast through LGN.
          </p>
          <a href="mailto:alerts@lgn.tt" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform">
            alerts@lgn.tt
          </a>
        </div>
      </section>

    </main>
  );
}
