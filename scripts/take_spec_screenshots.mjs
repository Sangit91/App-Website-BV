import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching browser to capture screenshots with exact App.tsx routes...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  console.log('--- 1. Trang chủ (https://localhost:8443/) ---');
  await page.goto('https://localhost:8443/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 01: Hero & Header
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '01_homepage_hero_header.png') });
  console.log('Saved 01_homepage_hero_header.png');

  // 02: Quick Actions
  await page.evaluate(() => {
    const el = document.querySelectorAll('section')[1] || document.body;
    el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '02_homepage_quick_actions.png') });
  console.log('Saved 02_homepage_quick_actions.png');

  // 03: Featured Specialties
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Chuyên khoa'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '03_homepage_specialties.png') });
  console.log('Saved 03_homepage_specialties.png');

  // 04: Featured Services
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Dịch vụ'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '04_homepage_services.png') });
  console.log('Saved 04_homepage_services.png');

  // 05: Why Choose Us
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Vì sao chọn'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '05_homepage_why_us.png') });
  console.log('Saved 05_homepage_why_us.png');

  // 06: Doctors Showcase
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('bác sĩ') || h.textContent.includes('Bác sĩ'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '06_homepage_doctors.png') });
  console.log('Saved 06_homepage_doctors.png');

  // 07: Testimonials & News
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Tin tức') || h.textContent.includes('Đánh giá'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '07_homepage_testimonials_news.png') });
  console.log('Saved 07_homepage_testimonials_news.png');

  // 08: CTA & Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '08_homepage_cta_footer.png') });
  console.log('Saved 08_homepage_cta_footer.png');

  console.log('--- 2. Trang Giới thiệu (/gioi-thieu) ---');
  await page.goto('https://localhost:8443/gioi-thieu');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '09_gioi_thieu_page.png'), fullPage: true });
  console.log('Saved 09_gioi_thieu_page.png');

  console.log('--- 3. Trang Chuyên khoa (/chuyen-khoa) ---');
  await page.goto('https://localhost:8443/chuyen-khoa');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '10_chuyen_khoa_page.png'), fullPage: true });
  console.log('Saved 10_chuyen_khoa_page.png');

  console.log('--- 4. Trang Dịch vụ (/dich-vu) ---');
  await page.goto('https://localhost:8443/dich-vu');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '11_dich_vu_page.png'), fullPage: true });
  console.log('Saved 11_dich_vu_page.png');

  console.log('--- 5. Trang Cho bệnh nhân (/cho-benh-nhan) ---');
  await page.goto('https://localhost:8443/cho-benh-nhan');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '12_cho_benh_nhan_page.png'), fullPage: true });
  console.log('Saved 12_cho_benh_nhan_page.png');

  console.log('--- 6. Trang Sơ đồ tổ chức (/so-do-to-chuc) ---');
  await page.goto('https://localhost:8443/so-do-to-chuc');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '13_so_do_to_chuc_page.png'), fullPage: true });
  console.log('Saved 13_so_do_to_chuc_page.png');

  console.log('--- 7. Trang Tin tức (/tin-tuc) ---');
  await page.goto('https://localhost:8443/tin-tuc');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '14_tin_tuc_page.png'), fullPage: true });
  console.log('Saved 14_tin_tuc_page.png');

  console.log('--- 8. Trang Thông tin Đấu thầu (/thong-tin-thau) ---');
  await page.goto('https://localhost:8443/thong-tin-thau');
  await page.waitForTimeout(3000); // Wait for API fetch of tenders
  await page.screenshot({ path: path.join(outputDir, '15_thong_tin_thau_page.png'), fullPage: true });
  console.log('Saved 15_thong_tin_thau_page.png');

  console.log('--- 9. Trang Liên hệ (/lien-he) ---');
  await page.goto('https://localhost:8443/lien-he');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '16_lien_he_page.png'), fullPage: true });
  console.log('Saved 16_lien_he_page.png');

  console.log('--- 10. Trang Đăng nhập Admin (/admin unauthenticated) ---');
  await context.clearCookies();
  await page.goto('https://localhost:8443/admin');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '17_admin_login_page.png'), fullPage: true });
  console.log('Saved 17_admin_login_page.png');

  console.log('--- 11. Trang Dashboard Admin (/admin authenticated) ---');
  const usernameInput = await page.$('input[type="text"], input[name="username"]');
  const passwordInput = await page.$('input[type="password"], input[name="password"]');
  if (usernameInput && passwordInput) {
    await usernameInput.fill('admin');
    await passwordInput.fill('Admin@123');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(2500);
    }
  }
  await page.screenshot({ path: path.join(outputDir, '18_admin_dashboard_page.png'), fullPage: true });
  console.log('Saved 18_admin_dashboard_page.png');

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Error running screenshot script:', err);
  process.exit(1);
});
