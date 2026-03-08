/**
 * Theme Input Registry
 *
 * Source of truth for all theme definitions.
 * These TypeScript files are used to generate CSS output.
 *
 * Run: pnpm --filter @bytesyze-ui/core build:theme-css
 */

// Base theme (structural tokens: spacing, radius, shadows, motion, z-index)
export { baseTheme, type BaseTheme } from './base-theme'

// Brand themes (visual tokens: colors, typography)
export { bytesyzeGreen } from './bytesyze'

/**
 * Available brand names.
 * Update this array when adding new brands.
 */
export const BRAND_NAMES = ['bytesyze'] as const

/**
 * Type-safe brand name.
 */
export type BrandName = (typeof BRAND_NAMES)[number]
