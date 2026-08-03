import { chromium } from 'playwright';
import path from 'path';

const outputDir = 'd:/Coding/App Website BV/screenshots_spec_v3_2/admin_tabs';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Login
  await page.goto('https://localhost:8443/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const u = await page.$('input[type="text"]');
  const p = await page.$('input[type="password"]');
  if (u && p) {
    await u.fill('admin');
    await p.fill('Admin@123');
    const s = await page.$('button[type="submit"]');
    if (s) { await s.click(); await page.waitForTimeout(2000); }
  }

  // Click "Tổ chức" button in sidebar
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent && x.textContent.trim() === 'Tổ chức');
    if (b) b.click();
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outputDir, '15_admin_organization.png'), fullPage: true });
  console.log('Saved 15_admin_organization.png');

  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
