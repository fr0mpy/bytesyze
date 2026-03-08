import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

// Cache component names to avoid repeated file reads across test runs
let cachedComponentNames: string[] | null = null;

function getComponentNames(): string[] {
  if (cachedComponentNames) return cachedComponentNames;

  const galleryPath = path.resolve(__dirname, '..', 'Gallery.tsx');
  const galleryContent = fs.readFileSync(galleryPath, 'utf-8');
  cachedComponentNames = [...galleryContent.matchAll(/name:\s*"([^"]+)"/g)].map(
    (m) => m[1]
  );
  return cachedComponentNames;
}

const componentNames = getComponentNames();

// Helper to wait for component to be interactive (replaces arbitrary timeouts)
async function waitForComponentReady(page: Page): Promise<void> {
  await page.locator('main').waitFor({ state: 'visible' });
  await page.waitForLoadState('domcontentloaded');
}

// Helper to navigate to a specific component
async function navigateToComponent(page: Page, name: string): Promise<void> {
  const sidebarButton = page.locator('nav button', {
    hasText: new RegExp(`^${name}$`, 'i'),
  });
  await sidebarButton.click();
  await waitForComponentReady(page);
}

test.describe('Component Harness', () => {
  test('gallery loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  for (const name of componentNames) {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        // Set up console error listener before navigation
        const errors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        // Store errors on page context for later access
        (page as any).__consoleErrors = errors;

        await page.goto('/');
        await navigateToComponent(page, name);
      });

      test('renders without console errors', async ({ page }) => {
        // Verify preview area has content
        const previewArea = page.locator('main');
        await expect(previewArea).not.toBeEmpty();

        // Check no console errors (from beforeEach listener)
        const errors = (page as any).__consoleErrors || [];
        expect(errors).toHaveLength(0);
      });

      test('screenshot', async ({ page }) => {
        const previewArea = page.locator('main');
        await previewArea.screenshot({
          path: `test-results/screenshots/${name}.png`,
        });
      });

      test('accessibility', async ({ page }) => {
        const results = await new AxeBuilder({ page })
          .include('main')
          .disableRules([
            'color-contrast', // Often fails in component previews due to isolated context
          ])
          .analyze();

        const violations = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        }));

        // Fail on serious or critical violations
        const critical = violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious'
        );
        expect(
          critical,
          `${name} has ${critical.length} serious a11y violation(s): ${JSON.stringify(critical, null, 2)}`
        ).toHaveLength(0);
      });

      test('responsive - mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await navigateToComponent(page, name);

        // Check for horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasOverflow, `${name} overflows at mobile width (375px)`).toBe(false);
      });
    });
  }
});
