import { test, expect } from '@playwright/test'

async function openBookingModal(page) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('bvdk:open-booking'))
  })
  await expect(page.getByText('Cổng Đăng Ký Khám Bệnh Trực Tuyến')).toBeVisible({ timeout: 10000 })
}

test.describe('Booking Flow', () => {
  test('should open booking modal', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    const bookButton = page.locator('button:has-text("Đặt khám"), button:has-text("Đặt lịch"), a:has-text("Đặt khám")').first()
    if (await bookButton.count() > 0) {
      await bookButton.click()

      await page.waitForTimeout(500)

      const modal = page.locator('[role="dialog"], .fixed.inset-0.z-50, .modal')
      await expect(modal.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should have working appointment search', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    const bookButton = page.locator('button:has-text("Đặt khám"), a:has-text("Đặt khám")').first()
    if (await bookButton.count() > 0) {
      await bookButton.click()
      await page.waitForTimeout(500)

      const searchButton = page.locator('button:has-text("Tra cứu"), button:has-text("Tìm")')
      await searchButton.first().click()
    }
  })

  test('đặt lịch khám hợp lệ hiện phiếu thành công', async ({ page }) => {
    await openBookingModal(page)

    const uniquePhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 3)
    const dateStr = futureDate.toISOString().split('T')[0]

    await page.getByPlaceholder('Ví dụ: Nguyễn Văn An').fill('Nguyễn Văn An')
    await page.getByPlaceholder('Ví dụ: 0905123456').fill(uniquePhone)
    await page.locator('select:has-text("-- Chọn chuyên khoa --")').first().waitFor({ state: 'visible' })
    const specialtySelect = page.locator('select').filter({ hasText: 'Chuyên khoa' }).first()
    await specialtySelect.selectOption({ index: 1 })
    await page.getByPlaceholder(/triệu chứng|Mô tả ngắn gọn/).fill('Khám tổng quát định kỳ')

    // Chọn ngày + khung giờ
    const dateInput = page.locator('input[type="date"]').first()
    await dateInput.fill(dateStr)
    const timeSlotSelect = page.locator('select').nth(2)
    await timeSlotSelect.selectOption({ index: 1 })

    await page.getByRole('button', { name: 'Xác nhận đăng ký khám' }).click()

    await expect(page.getByText('Đặt Lịch Hẹn Khám Thành Công!')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Phiếu khám bệnh điện tử')).toBeVisible()
  })
})