import type { BrandTheme } from '../../utils/theme.types'

/**
 * Bytesyze Green Brand Theme
 *
 * Primary green brand with purple accents.
 * Used as the default theme for Bytesyze products.
 */
export const bytesyzeGreen: BrandTheme = {
  light: {
    // Primary
    primary: '#00af66',
    primaryForeground: '#ffffff',
    primaryHover: '#008a52',

    // Secondary
    secondary: '#6366f1',
    secondaryForeground: '#ffffff',
    secondaryHover: '#4338ca',

    // Background & Foreground
    background: '#f4f4f4',
    foreground: '#222222',
    surface: '#f4f4f4',

    // Muted
    muted: '#e9e9e9',
    mutedForeground: '#6b7280',

    // Border
    border: '#dedede',

    // Destructive
    destructive: '#ef3737',
    destructiveForeground: '#ffffff',
    destructiveHover: '#b91c1c',

    // Accent
    accent: '#6366f1',
    accentForeground: '#ffffff',

    // Status
    success: '#00af66',
    successForeground: '#ffffff',
    warning: '#ff6900',
    warningForeground: '#ffffff',
    info: '#3b82f6',
    infoForeground: '#ffffff',

    // Neumorphic
    neuBase: '#f4f4f4',
    neuLight: 'rgba(255, 255, 255, 0.88)',
    neuDark: 'rgba(175, 175, 175, 0.52)',

    // Spinner
    spinnerFront: '#00af66',
    spinnerBack: '#00935a',
    spinnerLight: '#dedede',
    spinnerLighter: '#ebebeb',
    spinnerDark: '#404040',
    spinnerDarker: '#525252',

    // AI
    ai: '#8B5CF6',
    aiForeground: '#ffffff',
    aiHover: '#7C3AED',
    aiFrom: '#8B5CF6',
    aiTo: '#6366F1',
  },

  dark: {
    // Primary
    primary: '#00af66',
    primaryForeground: '#ffffff',
    primaryHover: '#00c974',

    // Secondary
    secondary: '#6366f1',
    secondaryForeground: '#ffffff',
    secondaryHover: '#818cf8',

    // Background & Foreground
    background: '#212121',
    foreground: '#f5f5f5',
    surface: '#212121',

    // Muted
    muted: '#3a3a3a',
    mutedForeground: '#9e9e9e',

    // Border
    border: '#000000',

    // Destructive
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    destructiveHover: '#f87171',

    // Accent
    accent: '#818cf8',
    accentForeground: '#ffffff',

    // Status
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f97316',
    warningForeground: '#ffffff',
    info: '#60a5fa',
    infoForeground: '#ffffff',

    // Neumorphic
    neuBase: '#212121',
    neuLight: 'rgba(255, 255, 255, 0.06)',
    neuDark: 'rgba(0, 0, 0, 0.5)',

    // Spinner
    spinnerFront: '#00af66',
    spinnerBack: '#00b368',
    spinnerLight: '#3a3a3a',
    spinnerLighter: '#4a4a4a',
    spinnerDark: '#e0e0e0',
    spinnerDarker: '#c0c0c0',

    // AI
    ai: '#A78BFA',
    aiForeground: '#ffffff',
    aiHover: '#C4B5FD',
    aiFrom: '#A78BFA',
    aiTo: '#818CF8',
  },

  fonts: {
    sans: {
      type: 'google',
      name: 'Inter',
      weights: [400, 500, 600, 700],
      variable: 'sans',
    },
    mono: {
      type: 'google',
      name: 'IBM Plex Mono',
      weights: [400, 500],
      variable: 'mono',
    },
  },

  typography: {
    heading: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
    body: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
    code: 'var(--font-mono), ui-monospace, monospace',
  },
}
