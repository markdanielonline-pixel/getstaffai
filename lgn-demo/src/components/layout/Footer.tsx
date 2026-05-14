import Link from "next/link";
import { Globe, MessageCircle, Camera, PlaySquare } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-24 md:pb-8 border-t border-brand-purple/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center group w-fit">
              <div className="relative w-56 h-20 md:w-64 md:h-24 flex items-center justify-center">
                <Image 
                  src="/logo-white.png" 
                  alt="LGN Logo" 
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mt-2">
              Trinidad and Tobago’s New Home for Live Television, Local Stories, and Community Voice.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink transition-colors">
                <Globe className="w-5 h-5 text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink transition-colors">
                <Camera className="w-5 h-5 text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink transition-colors">
                <PlaySquare className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/watch" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Watch Live</Link></li>
              <li><Link href="/news" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Latest News</Link></li>
              <li><Link href="/shows" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Our Shows</Link></li>
              <li><Link href="/events" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Local Events</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Community</h4>
            <ul className="space-y-4">
              <li><Link href="/community" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Submit a Story</Link></li>
              <li><Link href="/alerts" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Public Notices</Link></li>
              <li><Link href="/business" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Business Spotlight</Link></li>
              <li><Link href="/advertise" className="text-white/70 hover:text-brand-pink transition-colors text-sm">Advertise With Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>ManJack Street, Marabella</li>
              <li>Trinidad and Tobago</li>
              <li><a href="mailto:info@lgn.example" className="hover:text-brand-pink transition-colors">info@lgn.example</a></li>
              <li><a href="tel:+18685550199" className="hover:text-brand-pink transition-colors">+1 868 555 0199</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} Lisa Granger Network. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
