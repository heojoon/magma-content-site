import Link from "next/link";
import { siteConfig } from "@config";

export default function Header() {
  return (
    <header className="sticky top-0 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
        <Link href="/" className="font-display text-lg font-bold tracking-[0.18em] text-primary">
          {siteConfig.company.name}
        </Link>
        <nav className="flex gap-5 text-sm text-ink-sub">
          <Link href="/blog" className="hover:text-primary">블로그</Link>
          <Link href="/about" className="hover:text-primary">소개</Link>
        </nav>
      </div>
    </header>
  );
}
