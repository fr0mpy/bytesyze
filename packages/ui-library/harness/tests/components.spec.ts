import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

test.describe('Component Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the gallery page', async ({ page }) => {
    await expect(page.locator('text=Component Gallery')).toBeVisible()
  })

  test('should navigate between components', async ({ page }) => {
    // Wait for gallery to load
    await page.waitForSelector('[data-testid^="component-preview-"]')

    // Get the next button and click it
    const nextButton = page.locator('button:has-text("Next")')
    if (await nextButton.isVisible()) {
      const currentPreview = page.locator('[data-testid^="component-preview-"]')
      const currentTestId = await currentPreview.getAttribute('data-testid')

      await nextButton.click()

      // Wait for component to change instead of arbitrary timeout
      await expect(currentPreview).not.toHaveAttribute('data-testid', currentTestId!)
    }
  })

  test('should not have accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should handle component errors gracefully', async ({ page }) => {
    // Check if any error boundaries are visible
    const errorBoundary = page.locator('[data-testid="component-error"]')

    // If an error occurred, it should be displayed properly
    if (await errorBoundary.isVisible()) {
      await expect(errorBoundary).toContainText('Component Error')
      // Verify retry button exists
      await expect(errorBoundary.locator('button:has-text("Retry")')).toBeVisible()
    }
  })

  test('should change shadow levels', async ({ page }) => {
    const shadowSelector = page.locator('select[aria-label*="shadow"], select:has-text("Shadow")')

    if (await shadowSelector.isVisible()) {
      await shadowSelector.selectOption({ label: 'Large' })
      // Use expect with built-in retry instead of arbitrary timeout
      await expect(shadowSelector).toHaveValue('lg')
    }
  })
})
