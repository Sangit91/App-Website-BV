import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2');

async function run() {
  console.log('Launching browser to retake 15 and 17...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  // Fresh context for 17 (unauthenticated)
  const context1 = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const page1 = await context1.newPage();

  console.log('--- Retaking 17: Admin Login Interface ---');
  await page1.goto('https://localhost:8443/admin', { waitUntil: 'networkidle' });
  // Ensure logged out
  await page1.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page1.goto('https://localhost:8443/admin', { waitUntil: 'domcontentloaded' });
  await page1.waitForTimeout(3000);
  
  const title17 = await page1.title();
  console.log('Page 17 title:', title17);
  const bodyText17 = await page1.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Page 17 body text:', bodyText17);

  await page1.screenshot({ path: path.join(outputDir, '17_admin_login_page.png'), fullPage: true });
  console.log('Saved 17_admin_login_page.png');
  await context1.close();

  // Fresh context for 15 (Thông tin đấu thầu)
  const context2 = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const page2 = await context2.newPage();

  console.log('--- Retaking 15: Thông tin Đấu thầu ---');
  await page2.goto('https://localhost:8443/thong-tin-thau', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(3000);
  
  const title15 = await page2.title();
  console.log('Page 15 title:', title15);
  const bodyText15 = await page2.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Page 15 body text:', bodyText15);

  await page2.screenshot({ path: path.join(outputDir, '15_thong_tin_thau_page.png'), fullPage: true });
  console.log('Saved 15_thong_tin_thau_page.png');
  await context2.close();

  await browser.close();
  console.log('DONE retaking 15 and 17!');
}

run().catch(err => {
  console.error('Error running retake script:', err);
  process.exit(1);
});
