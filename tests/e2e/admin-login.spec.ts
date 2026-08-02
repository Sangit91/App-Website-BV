import { test, expect } from '@playwright/test'

// Credentials mặc định từ seed (server/scripts/seed.ts + .env). Không hardcode mật khẩu real trong source
// vì đây chỉ là môi trường dev seed; production phải dùng env ADMIN_DEFAULT_PASSWORD khác.
const ADMIN_USERNAME = process.env.E2E_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'Admin@123'

test.describe('Admin Login (critical flow)', () => {
  test('hiện form đăng nhập khi chưa có session', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    await expect(page.getByPlaceholder('Nhập tên đăng nhập')).toBeVisible({ timeout: 10000 })
    await expect(page.getByPlaceholder('Nhập mật khẩu')).toBeVisible()
    await expect(page.getByRole('button', { name: /Xác nhận danh tính/ })).toBeVisible()
  })

  test('đăng nhập sai hiển thị thông báo lỗi', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    await page.getByPlaceholder('Nhập tên đăng nhập').fill(ADMIN_USERNAME)
    await page.getByPlaceholder('Nhập mật khẩu').fill('SaiMậtKhẩu@999')
    await page.getByRole('button', { name: /Xác nhận danh tính/ }).click()

    await expect(page.getByText(/mật khẩu không đúng|không đúng/i)).toBeVisible({ timeout: 10000 })
  })

  test('đăng nhập đúng vào dashboard admin', async ({ page }) => {
    test.skip(process.env.NODE_ENV === 'production' && !ADMIN_PASSWORD, 'Thiếu credential admin cho E2E')
    await page.context().clearCookies()
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    await page.getByPlaceholder('Nhập tên đăng nhập').fill(ADMIN_USERNAME)
    await page.getByPlaceholder('Nhập mật khẩu').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Xác nhận danh tính/ }).click()

    // Sau đăng nhập thành công chuyển tới dashboard — có sidebar + tiêu đề tab Tổng quan
    await expect(page.getByText('Cổng Quản trị Nội bộ').first()).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Chào buổi sáng|Chào buổi chiều|Chào buổi tối/)).toBeVisible({ timeout: 10000 })
  })
})