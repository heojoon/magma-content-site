import type { Metadata } from "next";
import { Inter, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoSans = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-sans", display: "swap" });
const notoSerif = Noto_Serif_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-serif", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    template: `%s | ${siteConfig.company.name}`,
  },
  description: siteConfig.company.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSans.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="w-full max-w-3xl mx-auto flex-1 px-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
