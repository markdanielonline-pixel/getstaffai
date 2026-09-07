import { Playfair_Display, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import AIChatWidget from "@/components/AIChatWidget";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "--font-display"
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-heading"
});
const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600'],
  variable: "--font-body"
});

export const metadata = {
  title: "StaffAI | The World's First AI Company-as-a-Service",
  description: "Your company. Fully staffed. Fully running. StaffAI places a complete AI-powered organisation at your command, with named employees, real departments, a General Manager, and an Executive Assistant who never leaves your side.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable} ${inter.variable}`}>
        {children}
        <AIChatWidget />
        {/* Same reporter the marketing site carries, so a problem found inside
            the product reaches the same place as one found on the way in. */}
        <script defer src="/staffai-report.js" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var io = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                  if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                  }
                });
              }, { threshold: 0.1 });
              function init() {
                document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .photo-reveal').forEach(function(el) { io.observe(el); });
              }
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
              } else { init(); }
              var header = document.querySelector('.header');
              if (header) {
                window.addEventListener('scroll', function() {
                  header.classList.toggle('scrolled', window.scrollY > 50);
                }, { passive: true });
              }
            })();
          `
        }} />
      </body>
    </html>
  );
}
