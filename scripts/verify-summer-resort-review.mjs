import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
  });
  const reviewOrigin = process.env.REVIEW_ORIGIN ?? 'http://127.0.0.1:4173';
  const reviewFile = `${reviewOrigin}/content-pipeline/reviews/summer-resort-top5-review.html`;
  await page.goto(reviewFile, { waitUntil: 'load' });
  await page.waitForTimeout(2_000);

  const result = await page.evaluate(() => {
    const images = [...document.images].map((image) => ({
      src: image.getAttribute('src'),
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      visible: Boolean(image.offsetWidth && image.offsetHeight),
    }));
    const frame = document.querySelector('iframe');
    return {
      title: document.title,
      imgCount: images.length,
      images,
      iframe: {
        src: frame?.getAttribute('src'),
        loaded: Boolean(frame?.contentDocument),
        bodyTextLength: frame?.contentDocument?.body?.innerText?.length ?? 0,
      },
    };
  });

  const failedImages = result.images.filter((image) => !image.complete || !image.naturalWidth || !image.naturalHeight || !image.visible);
  if (result.imgCount !== 6 || failedImages.length || !result.iframe.loaded || result.iframe.bodyTextLength === 0) {
    throw new Error(`Review rendering verification failed: ${JSON.stringify({ imgCount: result.imgCount, failedImages, iframe: result.iframe })}`);
  }

  await page.screenshot({
    path: 'content-pipeline/reviews/summer-resort-top5-review-rendered.png',
    fullPage: true,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} finally {
  await browser.close();
}
