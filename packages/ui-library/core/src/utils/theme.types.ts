/**
 * Theme Schema
 *
 * TypeScript interface defining all required CSS custom properties for a theme.
 * Used to validate theme definitions at compile time and generate CSS.
 *
 * @example
 * import type { BrandTheme } from './theme.types'
 *
 * export const myTheme: BrandTheme = {
 *   light: { primary: '#007AFF', ... },
 *   dark: { primary: '#0A84FF', ... },
 *   typography: { heading: 'Inter', body: 'Inter', code: 'Fira Code' },
 * }
 */

/**
 * Color tokens required for each mode (light/dark).
 * All colors should be valid CSS color values (hex, rgb, hsl, etc.)
 */
export interface BrandColors {
  // Primary
  primary: string
  primaryForeground: string
  primaryHover: string

  // Secondary
  secondary: string
  secondaryForeground: string
  secondaryHover: string

  // Background & Foreground
  background: string
  foreground: string
  surface: string

  // Muted
  muted: string
  mutedForeground: string

  // Border
  border: string

  // Destructive
  destructive: string
  destructiveForeground: string
  destructiveHover: string

  // Accent
  accent: string
  accentForeground: string

  // Status
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  info: string
  infoForeground: string

  // Neumorphic
  neuBase: string
  neuLight: string
  neuDark: string

  // Spinner
  spinnerFront: string
  spinnerBack: string
  spinnerLight: string
  spinnerLighter: string
  spinnerDark: string
  spinnerDarker: string

  // AI
  ai: string
  aiForeground: string
  aiHover: string
  aiFrom: string
  aiTo: string
}

/**
 * Typography tokens (same for light/dark).
 * Values should be font family names or CSS font stacks.
 */
export interface BrandTypography {
  /** Font for headings (h1-h6) */
  heading: string
  /** Font for body text */
  body: string
  /** Font for code/monospace */
  code: string
}

// =============================================================================
// Font Configuration
// =============================================================================

/**
 * Google Font configuration.
 * Used to generate next/font imports at build time.
 */
export interface GoogleFontConfig {
  type: 'google'
  /** Font family name as it appears in Google Fonts (e.g., 'Inter', 'Space Grotesk') */
  name: string
  /** Font weights to include */
  weights: number[]
  /** CSS variable suffix (e.g., 'sans' → '--font-sans') */
  variable: string
  /** Character subsets to include. Defaults to ['latin'] */
  subsets?: string[]
}

/**
 * Local font configuration (for self-hosted fonts).
 */
export interface LocalFontConfig {
  type: 'local'
  /** Font family name */
  name: string
  /** Font file sources */
  src: { path: string; weight: number; style?: 'normal' | 'italic' }[]
  /** CSS variable suffix (e.g., 'sans' → '--font-sans') */
  variable: string
}

/** Font configuration - either Google or local */
export type FontConfig = GoogleFontConfig | LocalFontConfig

/**
 * Font definitions for a brand theme.
 * Each theme can specify its own font families.
 */
export interface BrandFonts {
  /** Primary sans-serif font (used for body and headings) */
  sans: FontConfig
  /** Monospace font (used for code) */
  mono: FontConfig
}

/**
 * Complete theme definition.
 */
export interface BrandTheme {
  /** Light mode color tokens */
  light: BrandColors
  /** Dark mode color tokens */
  dark: BrandColors
  /** Font configurations for next/font generation */
  fonts: BrandFonts
  /** Typography tokens (shared across modes) */
  typography: BrandTypography
}

/**
 * All required color token keys.
 * Used by build script to generate CSS custom properties.
 */
export const COLOR_TOKEN_KEYS: (keyof BrandColors)[] = [
  'primary',
  'primaryForeground',
  'primaryHover',
  'secondary',
  'secondaryForeground',
  'secondaryHover',
  'background',
  'foreground',
  'surface',
  'muted',
  'mutedForeground',
  'border',
  'destructive',
  'destructiveForeground',
  'destructiveHover',
  'accent',
  'accentForeground',
  'success',
  'successForeground',
  'warning',
  'warningForeground',
  'info',
  'infoForeground',
  'neuBase',
  'neuLight',
  'neuDark',
  'spinnerFront',
  'spinnerBack',
  'spinnerLight',
  'spinnerLighter',
  'spinnerDark',
  'spinnerDarker',
  'ai',
  'aiForeground',
  'aiHover',
  'aiFrom',
  'aiTo',
]

/**
 * Maps camelCase token key to kebab-case CSS variable name.
 * e.g., 'primaryForeground' → '--color-primary-foreground'
 */
export function tokenToCssVar(key: keyof BrandColors): string {
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase()
  return `--color-${kebab}`
}
