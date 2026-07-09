import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAll } from "@/lib/content";

export const metadata: Metadata = { title: "블로그" };

export default function BlogPage() {
  const posts = getAll("posts");
  return (
    <section className="py-14">
      <h1 className="mb-8 font-display text-2xl font-bold text-primary">블로그</h1>
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
        ) : (
          posts.map((p) => <PostCard key={p.slug} post={p} />)
        )}
      </div>
    </section>
  );
}
