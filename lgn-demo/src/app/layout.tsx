import type { Metadata } from "next";
import { Inter, Outfit, Montserrat, Cinzel } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BreakingNewsTicker } from "@/components/ui/BreakingNewsTicker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LGN | Lisa Granger Network",
  description: "Trinidad and Tobago’s New Home for Live Television, Local Stories, and Community Voice.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LGN App",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${montserrat.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-[70px] md:pb-0">
        <BreakingNewsTicker />
        <Header />
        <main className="flex-grow flex flex-col relative">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
