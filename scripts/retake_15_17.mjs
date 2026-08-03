import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching browser to retake images 12, 15, and 17...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  // Fresh context without cookies/storage
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  // Log browser errors or console
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  console.log('--- Retaking 12: Trang Cho bệnh nhân (https://localhost:8443/danh-cho-benh-nhan) ---');
  await page.goto('https://localhost:8443/danh-cho-benh-nhan', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000); // Wait for animations & data
  await page.screenshot({ path: path.join(outputDir, '12_cho_benh_nhan_page.png'), fullPage: true });
  console.log('Saved 12_cho_benh_nhan_page.png');

  console.log('--- Retaking 15: Trang Thông tin Đấu thầu (https://localhost:8443/thong-tin-thau) ---');
  await page.goto('https://localhost:8443/thong-tin-thau', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500); // Wait for API fetch of 459 tenders
  await page.screenshot({ path: path.join(outputDir, '15_thong_tin_thau_page.png'), fullPage: true });
  console.log('Saved 15_thong_tin_thau_page.png');

  console.log('--- Retaking 17: Trang Đăng nhập Admin (https://localhost:8443/admin/login) ---');
  // Clear context cookies & storage to ensure not logged in
  await context.clearCookies();
  await page.goto('https://localhost:8443/admin/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000); // Wait for single-canvas dark theme animations
  await page.screenshot({ path: path.join(outputDir, '17_admin_login_page.png'), fullPage: true });
  console.log('Saved 17_admin_login_page.png');

  await browser.close();
  console.log('Retake complete!');
}

run().catch(err => {
  console.error('Error running retake script:', err);
  process.exit(1);
});
