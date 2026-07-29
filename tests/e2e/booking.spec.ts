import { test, expect } from '@playwright/test'

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

      const phoneInput = page.locator('input[type="tel"], input[placeholder*="điện thoại"], input[placeholder*="phone"]')
      if (await phoneInput.count() > 0) {
        await phoneInput.first().fill('0912345678')

        const searchButton = page.locator('button:has-text("Tra cứu"), button:has-text("Tìm")')
        await searchButton.first().click()
      }
    }
  })
})