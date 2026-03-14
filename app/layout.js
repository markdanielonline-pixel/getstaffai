import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import AIChatWidget from "@/components/AIChatWidget";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800'], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], weight: ['300', '400', '500', '600'], variable: "--font-body" });

export const metadata = {
  title: "StaffAi | AI Revenue Workforce",
  description: "Deploy your AI Revenue Workforce. Lead generation, appointment setting, and closing. Text-first with voice escalation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${inter.variable}`}>
        {children}
        <AIChatWidget />
      </body>
    </html>
  );
}
