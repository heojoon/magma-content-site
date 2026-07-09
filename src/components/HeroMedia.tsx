/**
 * 히어로 배경 미디어 레이어 — "모션그래픽 자리".
 * 6.7 「디자인 마감」에서 이 파일 하나만 고쳐 배경 영상을 넣습니다:
 *
 *   <video autoPlay muted loop playsInline poster="/images/hero-poster.jpg"
 *          className="h-full w-full object-cover">
 *     <source src="/hero.mp4" type="video/mp4" />
 *   </video>
 *
 * 영상이 없어도 아래 브랜드 그라디언트로 완전히 동작합니다.
 */
export default function HeroMedia() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-dark to-primary-dark" />
    </div>
  );
}
