import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Capturing https://localhost:8443/thong-tin-thau...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('https://localhost:8443/thong-tin-thau', { waitUntil: 'networkidle' });
  
  // Wait for React components and tenders list to fetch and render
  await page.waitForTimeout(3500);

  // Smooth scroll down to ensure images/cards load, then scroll back top
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= Math.min(scrollHeight, 3000)) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });

  await page.waitForTimeout(1000);

  // 1. Full page screenshot
  const fullPath = path.join(outputDir, '15_thong_tin_thau_page.png');
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log('Saved full page screenshot:', fullPath);

  // 2. Header viewport screenshot
  const viewportPath = path.join(outputDir, '15_thong_tin_thau_viewport.png');
  await page.screenshot({ path: viewportPath });
  console.log('Saved viewport screenshot:', viewportPath);

  await browser.close();
  console.log('Capture of thong-tin-thau completed successfully!');
}

run().catch(err => {
  console.error('Error capturing thong-tin-thau:', err);
  process.exit(1);
});
