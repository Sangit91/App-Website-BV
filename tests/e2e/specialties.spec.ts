import { test, expect } from '@playwright/test'

test.describe('Specialties Page', () => {
  test('should load specialties page', async ({ page }) => {
    await page.goto('/chuyen-khoa')

    await page.waitForLoadState('networkidle')

    await expect(page.locator('main, .min-h-screen').first()).toBeVisible({ timeout: 10000 })
  })

  test('should display specialty cards after data loads', async ({ page }) => {
    await page.goto('/chuyen-khoa')

    await page.waitForLoadState('networkidle')

    await page.waitForTimeout(3000)

    const cards = page.locator('[class*="card"], [class*="rounded"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })
})