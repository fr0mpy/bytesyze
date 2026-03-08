import { test, expect } from '@playwright/test'

test.describe('Sidebar scroll', () => {
  test('sidebar should be scrollable when content overflows', async ({ page }) => {
    await page.goto('/')

    // Wait for sidebar to be visible (desktop only)
    const sidebar = page.locator('aside').first()
    await expect(sidebar).toBeVisible()

    // Get the scroll area within sidebar
    const scrollArea = sidebar.locator('> div').first()

    // Check initial scroll position
    const initialScrollTop = await scrollArea.evaluate(el => el.scrollTop)

    // Get the nav with all component links
    const nav = sidebar.locator('nav')
    await expect(nav).toBeVisible()

    // Count component links - should be 38+
    const links = nav.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(30)

    // Scroll to the last item (Tooltip)
    const lastLink = links.last()
    await lastLink.scrollIntoViewIfNeeded()

    // Check that scroll position changed
    const newScrollTop = await scrollArea.evaluate(el => el.scrollTop)
    expect(newScrollTop).toBeGreaterThan(initialScrollTop)

    // Verify Tooltip link is visible
    await expect(lastLink).toBeVisible()
    await expect(lastLink).toContainText('Tooltip')
  })
})
