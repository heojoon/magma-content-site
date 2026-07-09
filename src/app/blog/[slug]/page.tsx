import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAll, getOne, renderMarkdown } from "@/lib/content";

// 새 글은 커밋 → 재배포로 반영되므로 목록 밖 slug 는 404 로 고정한다
export const dynamicParams = false;

export function generateStaticParams() {
  return getAll("posts").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getOne("posts", slug);
  if (!post || post.draft) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getOne("posts", slug);
  if (!post || post.draft) notFound();
  const html = await renderMarkdown(post.content);
  return (
    <article className="py-14">
      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <time>{post.date}</time>
          {post.tags.map((t, i) => (
            <span key={`${t}-${i}`} className="text-accent">{t}</span>
          ))}
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold leading-snug text-primary">{post.title}</h1>
        <p className="mt-3 text-ink-sub">{post.description}</p>
      </header>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
