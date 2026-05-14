import { MapPin, Phone, Mail, Clock, Send, Building2, Users, Tv, Globe } from "lucide-react";

const contactDetails = [
  { icon: MapPin, label: "Address", value: "ManJack Street, Marabella, Trinidad and Tobago" },
  { icon: Phone, label: "Main Line", value: "+1 (868) 000-0000" },
  { icon: Mail, label: "General Enquiries", value: "info@lgn.tt" },
  { icon: Clock, label: "Office Hours", value: "Monday – Friday, 8:00 AM – 5:00 PM" },
];

const departments = [
  { icon: Tv, label: "News & Editorial", email: "news@lgn.tt", desc: "Submit news tips, press releases, and story pitches." },
  { icon: Users, label: "Community & Events", email: "community@lgn.tt", desc: "Event submissions, shoutouts, and public notices." },
  { icon: Building2, label: "Advertising & Partnerships", email: "advertise@lgn.tt", desc: "Sponsorships, ad packages, and media partnerships." },
  { icon: Globe, label: "Digital & App Support", email: "digital@lgn.tt", desc: "Technical support for the LGN app and web platform." },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-brand-purple/10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-pink/5 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            <Mail className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-medium text-brand-dark dark:text-white leading-tight mb-4">
            Contact LGN.
          </h1>
          <p className="text-lg text-brand-dark/60 dark:text-white/60 max-w-2xl font-light leading-relaxed">
            We are a community network. Your voice matters to us. Reach out for any reason and a member of our team will respond promptly.
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Contact Details */}
            <div className="bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-7">
              <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-brand-dark dark:text-white font-medium mb-6">
                LGN Headquarters
              </h2>
              <div className="flex flex-col gap-5">
                {contactDetails.map((d) => (
                  <div key={d.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-purple/10 dark:bg-brand-purple/20 flex items-center justify-center">
                      <d.icon className="w-4.5 h-4.5 text-brand-purple dark:text-purple-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-dark/40 dark:text-white/40 mb-0.5">{d.label}</p>
                      <p className="text-brand-dark dark:text-white/80 text-sm font-medium leading-snug">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-7">
              <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-brand-dark dark:text-white font-medium mb-6">
                Departments
              </h2>
              <div className="flex flex-col gap-4">
                {departments.map((d) => (
                  <div key={d.label} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-pink/10 flex items-center justify-center">
                      <d.icon className="w-4 h-4 text-brand-pink" />
                    </div>
                    <div>
                      <p className="text-brand-dark dark:text-white text-sm font-semibold mb-0.5">{d.label}</p>
                      <p className="text-brand-dark/50 dark:text-white/40 text-xs mb-1 font-light">{d.desc}</p>
                      <a href={`mailto:${d.email}`} className="text-brand-pink text-xs font-semibold hover:underline">{d.email}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-white/5 border border-brand-purple/10 dark:border-white/10 rounded-2xl p-8 md:p-10">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-brand-dark dark:text-white font-medium mb-2">
                Send Us a Message
              </h2>
              <p className="text-brand-dark/50 dark:text-white/50 text-sm font-light mb-8">
                Fill in the form below and a member of our team will respond within one business day.
              </p>
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-brand-dark/70 dark:text-white/60 uppercase mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus"
                      className="w-full bg-transparent border border-brand-purple/20 dark:border-white/10 rounded-xl px-4 py-3 text-brand-dark dark:text-white placeholder:text-brand-dark/30 dark:placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-brand-dark/70 dark:text-white/60 uppercase mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Thomas"
                      className="w-full bg-transparent border border-brand-purple/20 dark:border-white/10 rounded-xl px-4 py-3 text-brand-dark dark:text-white placeholder:text-brand-dark/30 dark:placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-brand-dark/70 dark:text-white/60 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-transparent border border-brand-purple/20 dark:border-white/10 rounded-xl px-4 py-3 text-brand-dark dark:text-white placeholder:text-brand-dark/30 dark:placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-brand-dark/70 dark:text-white/60 uppercase mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (868) 000-0000"
                    className="w-full bg-transparent border border-brand-purple/20 dark:border-white/10 rounded-xl px-4 py-3 text-brand-dark dark:text-white placeholder:text-brand-dark/30 dark:placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-brand-dark/70 dark:text-white/60 uppercase mb-2">Subject</label>
                  <select defaultValue="" className="w-full bg-white dark:bg-brand-dark border border-brand-purple/20 dark:border-white/10 rounded-xl px-4 py-3 text-brand-dark dark:text-white focus:outline-none focus:border-brand-pink transition-colors text-sm appearance-none">
                    <option value="" disabled>Select a subject...</option>
                    <option>News Tip or Story Pitch</option>
                    <option>Advertising Enquiry</option>
                    <option>Community Event Submission</option>
                    <option>Technical Support</option>
                    <option>Partnership Opportunity</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-brand-dark/70 dark:text-white/60 uppercase mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-transparent border border-brand-purple/20 dark:border-white/10 rounded-xl px-4 py-3 text-brand-dark dark:text-white placeholder:text-brand-dark/30 dark:placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-brand-pink hover:bg-brand-purple text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(233,30,128,0.3)] hover:shadow-[0_4px_30px_rgba(45,11,104,0.4)]"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Placeholder ───────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl overflow-hidden border border-brand-purple/10 h-72 relative bg-brand-purple/5 flex items-center justify-center">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="relative z-10 text-center">
            <MapPin className="w-10 h-10 text-brand-purple dark:text-purple-400 mx-auto mb-3" />
            <p className="font-[family-name:var(--font-cinzel)] text-xl text-brand-dark dark:text-white font-medium">ManJack Street, Marabella</p>
            <p className="text-brand-dark/50 dark:text-white/50 text-sm mt-1 font-light">Trinidad and Tobago</p>
          </div>
        </div>
      </section>

    </main>
  );
}
