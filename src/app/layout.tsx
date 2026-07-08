import type { Metadata } from "next";
import { Inter, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoSans = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-sans", display: "swap" });
const notoSerif = Noto_Serif_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-serif", display: "swap" });

export const metadata: Metadata = {
  title: "magma-content-site",
  description: "MAGMA 콘텐츠 사업부 스타터",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSans.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
