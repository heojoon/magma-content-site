import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const sourcePath = 'content-pipeline/drafts/summer-resort-top5-final.md';
const outputPath = 'content-pipeline/reviews/summer-resort-top5-final-rendered.html';
const source = await fs.readFile(sourcePath, 'utf8');
const parsed = matter(source);
// The source uses HTML image slots. Convert them to Markdown image syntax so
// Remark emits real <img> elements in the standalone review document.
const markdownWithImages = parsed.content.replace(
  /<img\s+src="\/images\/([^"\s]+)"\s+alt="([^"]*)"\s*\/?>(?:<\/img>)?/g,
  (_match, filename, alt) => `![${alt}](../../public/images/${filename})`,
);
const rendered = String(
  await remark().use(remarkGfm).use(remarkHtml).process(markdownWithImages),
);

const document = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${parsed.data.title}</title>
<style>body{margin:24px;color:#1b2b2a;background:#fffdf8;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;line-height:1.75}h1,h2,h3{color:#173c3b;line-height:1.35}h1{font-size:2rem}h2{margin-top:2.4rem}h3{margin-top:1.4rem}img{display:block;max-width:100%;height:auto;margin:1.2rem 0;border:1px solid #e2dace}a{color:#69402f}li{margin:.3rem 0}</style>
</head><body>${rendered}</body></html>`;
await fs.writeFile(outputPath, document, 'utf8');
console.log(outputPath);
