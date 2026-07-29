import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    const mainContent = page.locator('main, .min-h-screen, #root')
    await expect(mainContent.first()).toBeVisible()

    const bodyText = await page.textContent('body')
    expect(bodyText).toContain('BỆNH VIỆN')
  })

  test('should display navbar with navigation links', async ({ page }) => {
    await page.goto('/')

    const navLinks = page.locator('nav a, header a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to specialists page', async ({ page }) => {
    await page.goto('/')

    const specialistsLink = page.locator('a[href*="chuyen-khoa"], a[href*="chuyenkhoa"]').first()
    if (await specialistsLink.count() > 0) {
      await specialistsLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL(/chuyen-khoa|chuyenkhoa/)
    }
  })
})