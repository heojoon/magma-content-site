import Link from "next/link";
import type { ContentMeta } from "@/lib/content";

export default function PostCard({ post }: { post: ContentMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-card border border-line bg-card p-5 transition-colors hover:border-line-dark"
    >
      <div className="flex items-center gap-3 text-xs text-ink-muted">
        <time>{post.date}</time>
        {post.tags.length > 0 && <span className="text-accent">{post.tags[0]}</span>}
      </div>
      <h3 className="mt-2 font-display text-lg font-bold text-ink">{post.title}</h3>
      <p className="mt-1 text-sm text-ink-sub">{post.description}</p>
    </Link>
  );
}
