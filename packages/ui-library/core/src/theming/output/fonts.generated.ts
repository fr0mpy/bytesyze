/**
 * Font Loader (Auto-generated)
 *
 * Auto-generated from: packages/ui-library/core/src/theming/input/bytesyze.ts
 * Generated at: 2026-02-25T21:58:17.666Z
 *
 * DO NOT EDIT DIRECTLY — edit the theme fonts section and run:
 * pnpm --filter @bytesyze-ui/core build:fonts
 */

import { Inter, IBM_Plex_Mono } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
  preload: true,
})

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
  adjustFontFallback: true,
  preload: true,
})

/**
 * Combined CSS variable classes for all fonts.
 * Apply to <html> element to make CSS variables available.
 */
export const fontVariables = `${fontSans.variable} ${fontMono.variable}`

/**
 * Font setup for app layouts.
 * Simplifies font application in layout.tsx files.
 *
 * @example
 * import { FontSetup } from '@bytesyze-ui/core/theming'
 *
 * <html className={FontSetup.htmlClassName}>
 *   <body className={FontSetup.bodyClassName}>
 */
export const FontSetup = {
  /** Apply to <html> className */
  htmlClassName: fontVariables,
  /** Apply to <body> className */
  bodyClassName: fontSans.className,
} as const
