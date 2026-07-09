import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24 text-center">
      <p className="font-display text-5xl font-bold text-primary">404</p>
      <p className="mt-4 text-ink-sub">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="mt-8 inline-block text-sm text-primary underline underline-offset-2">
        홈으로 돌아가기
      </Link>
    </section>
  );
}
