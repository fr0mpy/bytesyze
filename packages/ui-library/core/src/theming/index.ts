/**
 * Theming system for Bytesyze UI.
 *
 * Two-tier architecture:
 * - Base theme: Structural tokens (spacing, shadows, motion, z-index)
 * - Brand theme: Visual tokens (colors, fonts)
 *
 * Source files in `input/` generate CSS + fonts in `output/`.
 * Run: pnpm --filter @bytesyze-ui/core build:theme
 *
 * @example
 * // In layout.tsx
 * import '@bytesyze-ui/core/theming/output/base.css'
 * import '@bytesyze-ui/core/theming/output/bytesyze.css'
 * import { FontSetup } from '@bytesyze-ui/core/theming'
 *
 * <html className={FontSetup.htmlClassName}>
 *   <body className={FontSetup.bodyClassName}>
 */

// Re-export from input (TypeScript source of truth)
export {
  baseTheme,
  type BaseTheme,
  bytesyzeGreen,
  BRAND_NAMES,
  type BrandName,
} from './input'

// Re-export generated font setup
export {
  FontSetup,
  fontSans,
  fontMono,
  fontVariables,
} from './output/fonts.generated'

// Re-export ThemeMode type from providers for convenience
export type { ThemeMode } from '../providers/theme-cookie'
