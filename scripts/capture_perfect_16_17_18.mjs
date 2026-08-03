import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2');

async function run() {
  console.log('Launching browser to capture 16, 17, and 18 cleanly...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  // 16. Lien He
  const ctx16 = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const page16 = await ctx16.newPage();
  console.log('Capturing 16: /lien-he...');
  await page16.goto('https://localhost:8443/lien-he', { waitUntil: 'networkidle' });
  await page16.waitForTimeout(1500);
  await page16.screenshot({ path: path.join(outputDir, '16_lien_he_page.png'), fullPage: true });
  console.log('Saved 16_lien_he_page.png');
  await ctx16.close();

  // 17. Admin Login (Unauthenticated /admin)
  const ctx17 = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const page17 = await ctx17.newPage();
  console.log('Capturing 17: Admin Login...');
  await page17.goto('https://localhost:8443/admin', { waitUntil: 'domcontentloaded' });
  await page17.waitForTimeout(2000);
  // Viewport screenshot (no fullPage) for fixed inset-0 login container
  await page17.screenshot({ path: path.join(outputDir, '17_admin_login_page.png') });
  console.log('Saved 17_admin_login_page.png');
  await ctx17.close();

  // 18. Admin Dashboard (Authenticated /admin)
  const ctx18 = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const page18 = await ctx18.newPage();
  console.log('Capturing 18: Admin Dashboard...');
  await page18.goto('https://localhost:8443/admin', { waitUntil: 'domcontentloaded' });
  await page18.waitForTimeout(1500);
  
  const userInput = await page18.$('input[type="text"], input[name="username"]');
  const passInput = await page18.$('input[type="password"], input[name="password"]');
  if (userInput && passInput) {
    await userInput.fill('admin');
    await passInput.fill('Admin@123');
    const submitBtn = await page18.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page18.waitForTimeout(2500);
    }
  }
  await page18.screenshot({ path: path.join(outputDir, '18_admin_dashboard_page.png'), fullPage: true });
  console.log('Saved 18_admin_dashboard_page.png');
  await ctx18.close();

  await browser.close();
  console.log('DONE!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
