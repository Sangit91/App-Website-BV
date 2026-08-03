import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve(process.cwd(), 'screenshots_spec_v3_2', 'admin_tabs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const tabs = [
  { id: 'overview', name: '01_admin_overview.png', label: 'Tổng quan' },
  { id: 'home', name: '02_admin_cms_home.png', label: 'Trang chủ' },
  { id: 'about', name: '03_admin_cms_about.png', label: 'Giới thiệu' },
  { id: 'specialties', name: '04_admin_cms_specialties.png', label: 'Chuyên khoa' },
  { id: 'services', name: '05_admin_cms_services.png', label: 'Dịch vụ' },
  { id: 'patient', name: '06_admin_cms_patient.png', label: 'Cho bệnh nhân' },
  { id: 'news', name: '07_admin_cms_news.png', label: 'Tin tức' },
  { id: 'tender', name: '08_admin_cms_tender.png', label: 'Thông tin thầu' },
  { id: 'contact', name: '09_admin_cms_contact.png', label: 'Liên hệ / Footer' },
  { id: 'doctors', name: '10_admin_doctors.png', label: 'Bác sĩ' },
  { id: 'shifts', name: '11_admin_shifts.png', label: 'Phân ca' },
  { id: 'bookings', name: '12_admin_bookings.png', label: 'Đặt lịch khám' },
  { id: 'patients', name: '13_admin_patients.png', label: 'Bệnh nhân' },
  { id: 'logs', name: '14_admin_logs.png', label: 'Nhật ký' },
  { id: 'organization', name: '15_admin_organization.png', label: 'Sơ đồ tổ chức' },
  { id: 'feedback', name: '16_admin_feedback.png', label: 'Phản hồi' },
  { id: 'record-requests', name: '17_admin_record_requests.png', label: 'Trích sao hồ sơ' }
];

async function run() {
  console.log('Launching browser to capture all 17 Admin Tabs...');
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

  console.log('Logging into Admin Panel...');
  await page.goto('https://localhost:8443/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const userInput = await page.$('input[type="text"], input[name="username"]');
  const passInput = await page.$('input[type="password"], input[name="password"]');
  if (userInput && passInput) {
    await userInput.fill('admin');
    await passInput.fill('Admin@123');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  console.log('Logged in! Expanding all sidebar groups...');

  // Expand all sidebar groups by clicking headers if not expanded
  const groupHeaders = ['Quản lý Nội dung', 'Quản lý Nhân sự', 'Quản lý Hoạt động'];
  for (const groupLabel of groupHeaders) {
    const groupBtn = await page.evaluateHandle((text) => {
      return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes(text));
    }, groupLabel);
    if (groupBtn && groupBtn.asElement()) {
      await groupBtn.asElement().click();
      await page.waitForTimeout(300);
    }
  }

  console.log('Capturing each of the 17 tabs...');

  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    console.log(`[${i + 1}/17] Navigating to tab '${tab.id}' (${tab.label})...`);

    // Click tab button in sidebar
    const clicked = await page.evaluate((label) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => {
        const text = b.textContent ? b.textContent.trim() : '';
        return text === label || text.endsWith(label) || text.includes(label);
      });
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, tab.label);

    if (!clicked) {
      console.log(`Warning: Could not find button for label '${tab.label}' via text click`);
    }

    await page.waitForTimeout(1200);

    const screenshotPath = path.join(outputDir, tab.name);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved screenshot [${i + 1}/17]: ${tab.name}`);
  }

  await browser.close();
  console.log('ALL 17 ADMIN TABS CAPTURED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Error capturing admin tabs:', err);
  process.exit(1);
});
