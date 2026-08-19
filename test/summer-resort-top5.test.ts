import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import { renderMarkdown } from "@/lib/content";

describe("summer-resort-top5 게시물", () => {
  it("본문 코디 이미지 5장과 헤더 썸네일을 article 안에 렌더할 수 있다", async () => {
    const source = readFileSync(resolve(process.cwd(), "content/posts/summer-resort-top5.md"), "utf8");
    const post = matter(source);
    const html = await renderMarkdown(post.content);
    const pageSource = readFileSync(resolve(process.cwd(), "src/app/blog/[slug]/page.tsx"), "utf8");

    expect((html.match(/<img /g) ?? [])).toHaveLength(5);
    expect(pageSource).toContain("post.thumbnail");
  });
});
