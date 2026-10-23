import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('home page shows the shop', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Buy Sivakasi Crackers Online/)
    await expect(page.locator('h1').first()).toHaveText(/Sivakasi crackers/i)
  })

  test('price list adds items to the cart', async ({ page }) => {
    await page.goto('http://localhost:3000/price-list')

    const add = page.getByRole('button', { name: /^Add one / }).first()
    await add.click()
    await add.click()

    await expect(page.getByRole('link', { name: 'View estimate →' })).toBeVisible()
  })
})
