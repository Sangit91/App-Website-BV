import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching browser with reducedMotion to ensure all Framer Motion components render instantly at opacity 1...');
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

  // Retake #12: /cho-benh-nhan
  console.log('--- 12. Trang Cho bệnh nhân (/cho-benh-nhan) ---');
  await page.goto('https://localhost:8443/cho-benh-nhan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '12_cho_benh_nhan_page.png'), fullPage: true });
  console.log('Saved 12_cho_benh_nhan_page.png');

  // Retake #15: /thong-tin-thau
  console.log('--- 15. Trang Thông tin Đấu thầu (/thong-tin-thau) ---');
  await page.goto('https://localhost:8443/thong-tin-thau', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '15_thong_tin_thau_page.png'), fullPage: true });
  console.log('Saved 15_thong_tin_thau_page.png');

  // Retake #17: Admin Login (/admin unauthenticated)
  console.log('--- 17. Trang Đăng nhập Admin (/admin unauthenticated) ---');
  await context.clearCookies();
  await page.goto('https://localhost:8443/admin');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '17_admin_login_page.png'), fullPage: true });
  console.log('Saved 17_admin_login_page.png');

  // Retake #18: Admin Dashboard (/admin authenticated)
  console.log('--- 18. Trang Dashboard Admin (/admin authenticated) ---');
  const usernameInput = await page.$('input[type="text"], input[name="username"]');
  const passwordInput = await page.$('input[type="password"], input[name="password"]');
  if (usernameInput && passwordInput) {
    await usernameInput.fill('admin');
    await passwordInput.fill('Admin@123');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }
  }
  await page.screenshot({ path: path.join(outputDir, '18_admin_dashboard_page.png'), fullPage: true });
  console.log('Saved 18_admin_dashboard_page.png');

  await browser.close();
  console.log('ALL RETAKEN SCREENSHOTS SAVED PERFECTLY!');
}

run().catch(err => {
  console.error('Error running retake script:', err);
  process.exit(1);
});
