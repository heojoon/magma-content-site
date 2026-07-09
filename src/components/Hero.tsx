import { siteConfig } from "@config";
import HeroMedia from "@/components/HeroMedia";
import CtaSlot from "@/components/CtaSlot";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <HeroMedia />
      {/* 가독성 오버레이 */}
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="container-page py-24">
        <p className="mb-4 text-sm font-bold tracking-[0.2em] text-accent-light">
          {siteConfig.company.name}
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-card sm:text-6xl">
          {siteConfig.company.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-card/85">
          {siteConfig.company.description}
        </p>
        <CtaSlot className="mt-10" />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-card/60">
        SCROLL
      </div>
    </section>
  );
}
