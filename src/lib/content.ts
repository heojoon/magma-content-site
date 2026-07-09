import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type Collection = "posts" | "reports";
export const COLLECTIONS: Collection[] = ["posts", "reports"];

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface ContentMeta {
  collection: Collection;
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  thumbnail?: string;
  period?: string; // reports 전용 — 보고 기간 라벨
  draft: boolean;
}

export interface ContentDoc extends ContentMeta {
  content: string;
}

/** posts→/blog/{slug}, reports→/reports/{slug} */
export function contentHref(collection: Collection, slug: string): string {
  return `/${collection === "posts" ? "blog" : "reports"}/${slug}`;
}

/** 컬렉션 발행 항목 — draft 제외, 날짜 역순(동률이면 slug 역순). 깨진 파일은 스킵. */
export function getAll(collection: Collection): ContentMeta[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readDoc(collection, f))
    .filter((d): d is ContentDoc => d !== null && !d.draft)
    .sort((a, b) => (a.date === b.date ? (a.slug < b.slug ? 1 : -1) : a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}

/** slug 로 문서 1건. draft 도 반환하므로 호출부에서 걸러야 한다. 없으면 null. */
export function getOne(collection: Collection, slug: string): ContentDoc | null {
  return readDoc(collection, `${slug}.md`);
}

/** 마크다운 → HTML. GFM 지원, raw HTML 은 안전하게 제거. */
export async function renderMarkdown(md: string): Promise<string> {
  const out = await remark().use(remarkGfm).use(remarkHtml, { sanitize: true }).process(md);
  return String(out);
}

function readDoc(collection: Collection, filename: string): ContentDoc | null {
  const filePath = path.join(CONTENT_ROOT, collection, filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    if (!data.title || !data.description || !data.date) {
      console.warn(`[content] ${collection}/${filename} 스킵 — 필수 필드(title·description·date) 누락`);
      return null;
    }
    return {
      collection,
      slug: filename.replace(/\.md$/, ""),
      title: String(data.title),
      description: String(data.description),
      date: toDateString(data.date),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : undefined,
      period: typeof data.period === "string" ? data.period : undefined,
      draft: data.draft === true,
      content,
    };
  } catch (err) {
    console.warn(`[content] ${collection}/${filename} 스킵 — 파싱 실패:`, err);
    return null;
  }
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}
