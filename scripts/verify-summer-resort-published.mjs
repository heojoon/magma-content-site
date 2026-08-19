import { chromium } from "playwright";

const origin = process.env.REVIEW_ORIGIN ?? "http://127.0.0.1:3003";
const url = `${origin}/blog/summer-resort-top5`;
const response = await fetch(url);
if (response.status !== 200) throw new Error(`GET ${url} returned HTTP ${response.status}`);
const html = await response.text();
if (html.includes("draft: true")) throw new Error("draft:true marker found in response");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() =>
  Array.from(document.querySelectorAll("article img")).every(
    (image) => image.complete && image.naturalWidth > 0,
  ),
);
const result = await page.locator("article").evaluate((article) => {
  const images = Array.from(article.querySelectorAll("img")).map((image) => ({
    src: image.getAttribute("src"),
    complete: image.complete,
    width: image.naturalWidth,
    height: image.naturalHeight,
    visible: Boolean(image.getClientRects().length),
  }));
  return {
    articleTextLength: article.textContent?.trim().length ?? 0,
    requiredText: article.textContent?.includes("여행 가방은 적게, 장면은 충분하게") ?? false,
    imageCount: images.length,
    images,
  };
});
await page.screenshot({ path: "content-pipeline/reviews/summer-resort-top5-dev-site-rendered.png", fullPage: true });
await browser.close();

if (result.articleTextLength === 0 || !result.requiredText) throw new Error("article body was not rendered");
if (result.imageCount !== 6) throw new Error(`expected 6 article images, got ${result.imageCount}`);
if (result.images.some((image) => !image.complete || image.width <= 0 || image.height <= 0 || !image.visible)) {
  throw new Error(`one or more images failed: ${JSON.stringify(result.images)}`);
}
console.log(JSON.stringify({ status: response.status, ...result }, null, 2));
