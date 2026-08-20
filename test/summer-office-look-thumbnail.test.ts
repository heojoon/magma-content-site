import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import matter from "gray-matter";
import { describe, expect, it } from "vitest";

describe("summer-office-look 썸네일", () => {
  it("교체한 사진 원본을 직접 로드해 이전 Next 이미지 캐시를 우회한다", () => {
    const source = readFileSync(resolve(process.cwd(), "content/posts/summer-office-look.md"), "utf8");
    const pageSource = readFileSync(resolve(process.cwd(), "src/app/blog/[slug]/page.tsx"), "utf8");
    const { data } = matter(source);

    expect(data.thumbnail).toBe(
      "/images/summer-office-look/summer-office-look-thumbnail.png",
    );
    expect(pageSource).toContain("unoptimized");
  });
});
