import { test, expect } from '@playwright/test'

test.describe('Doctors Section (Homepage)', () => {
  test('should display doctors section on homepage', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    const doctorsSection = page.locator('#bac-si, section[id="bac-si"]')
    await expect(doctorsSection.first()).toBeVisible({ timeout: 10000 })
  })

  test('should show doctor images on homepage', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await page.waitForTimeout(2000)

    const doctorImages = page.locator('#bac-si img, section[id="bac-si"] img')
    const count = await doctorImages.count()
    expect(count).toBeGreaterThan(0)
  })
})