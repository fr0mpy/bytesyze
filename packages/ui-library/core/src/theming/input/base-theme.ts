/**
 * Base Theme Data
 *
 * TypeScript representation of base.css for programmatic access.
 * Used by documentation pages and tooling.
 *
 * NOTE: The source of truth for runtime is src/styles/base.css
 * Keep this file in sync with base.css values.
 */

export const baseTheme = {
  spacing: {
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
  },

  radius: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
  },

  motion: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      spinner: '3s',
    },
    spring: {
      stiffness: '300',
      damping: '30',
      stiffnessBouncy: '400',
    },
  },

  zIndex: {
    dropdown: '100',
    sticky: '200',
    modal: '300',
    popover: '400',
    tooltip: '600',
    toast: '9900',
  },

  shadow: {
    light: {
      raised: '-6px -6px 14px rgba(255, 255, 255, 0.88), 6px 6px 14px rgba(175, 175, 175, 0.52)',
      'raised-sm': '-3px -3px 8px rgba(255, 255, 255, 0.88), 3px 3px 8px rgba(175, 175, 175, 0.52)',
      'raised-lg': '-8px -8px 20px rgba(255, 255, 255, 0.9), 8px 8px 20px rgba(175, 175, 175, 0.58)',
      pressed: 'inset -4px -4px 8px rgba(255, 255, 255, 0.88), inset 4px 4px 8px rgba(175, 175, 175, 0.52)',
      'pressed-sm': 'inset -2px -2px 5px rgba(255, 255, 255, 0.75), inset 2px 2px 5px rgba(175, 175, 175, 0.44)',
      flat: 'inset 1px 1px 2px rgba(175, 175, 175, 0.32), inset -1px -1px 2px rgba(255, 255, 255, 0.55)',
      focus: '0 0 0 3px rgba(0, 175, 102, 0.6)',
      'inset-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      'variant-primary': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.3), 4px 4px 10px rgba(0, 100, 60, 0.3)',
      'variant-secondary': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.3), 4px 4px 10px rgba(60, 60, 140, 0.3)',
      'variant-destructive': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.3), 4px 4px 10px rgba(180, 40, 40, 0.3)',
      'variant-success': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.3), 4px 4px 10px rgba(0, 100, 60, 0.2)',
      'variant-warning': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.3), 4px 4px 10px rgba(180, 80, 0, 0.2)',
      'control-unchecked': 'inset -2px -2px 4px rgba(255, 255, 255, 0.7), inset 2px 2px 5px rgba(0, 60, 40, 0.35)',
      'control-checked': 'inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 2px 2px 5px rgba(0, 80, 50, 0.35)',
    },
    dark: {
      raised: '-6px -6px 14px rgba(255, 255, 255, 0.06), 6px 6px 14px rgba(0, 0, 0, 0.5)',
      'raised-sm': '-3px -3px 8px rgba(255, 255, 255, 0.06), 3px 3px 8px rgba(0, 0, 0, 0.5)',
      'raised-lg': '-8px -8px 20px rgba(255, 255, 255, 0.07), 8px 8px 20px rgba(0, 0, 0, 0.55)',
      pressed: 'inset -4px -4px 8px rgba(255, 255, 255, 0.06), inset 4px 4px 8px rgba(0, 0, 0, 0.5)',
      'pressed-sm': 'inset -2px -2px 5px rgba(255, 255, 255, 0.04), inset 2px 2px 5px rgba(0, 0, 0, 0.35)',
      flat: 'inset 1px 1px 2px rgba(0, 0, 0, 0.25), inset -1px -1px 2px rgba(255, 255, 255, 0.04)',
      focus: '0 0 0 3px rgba(0, 175, 102, 0.6)',
      'inset-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      'variant-primary': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.1), 3px 3px 8px rgba(0, 0, 0, 0.4)',
      'variant-secondary': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.1), 3px 3px 8px rgba(0, 0, 0, 0.4)',
      'variant-destructive': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.1), 3px 3px 8px rgba(0, 0, 0, 0.4)',
      'variant-success': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.1), 3px 3px 8px rgba(0, 0, 0, 0.4)',
      'variant-warning': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.1), 3px 3px 8px rgba(0, 0, 0, 0.4)',
      'control-unchecked': 'inset -2px -2px 4px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
      'control-checked': 'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 2px 2px 5px rgba(0, 0, 0, 0.4)',
    },
  },
} as const

export type BaseTheme = typeof baseTheme
