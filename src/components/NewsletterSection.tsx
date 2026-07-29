import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterSection() {
  return (
    <section className="container-page py-16">
      <div className="rounded-card border border-line bg-card p-6 sm:p-8">
        <p className="eyebrow mb-3">뉴스레터</p>
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">콘텐츠 업데이트</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-sub">
          새로운 글과 브랜드 소식을 이메일로 알려드립니다.
        </p>
        <NewsletterForm />
        <p className="mt-4 text-xs text-ink-muted">언제든 수신 거부</p>
      </div>
    </section>
  );
}
