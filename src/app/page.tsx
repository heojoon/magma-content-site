import Link from "next/link";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import { getAll } from "@/lib/content";

export default function Home() {
  const posts = getAll("posts").slice(0, 3);
  return (
    <>
      <Hero />
      <section className="pb-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold text-primary">최신 글</h2>
          <Link href="/blog" className="text-sm text-ink-sub hover:text-primary">전체 보기</Link>
        </div>
        <div className="grid gap-4">
          {posts.length === 0 ? (
            <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
          ) : (
            posts.map((p) => <PostCard key={p.slug} post={p} />)
          )}
        </div>
      </section>
    </>
  );
}
