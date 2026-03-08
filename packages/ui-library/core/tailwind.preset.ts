/**
 * Tailwind Preset for Bytesyze UI
 *
 * Shared Tailwind configuration for all apps using the UI library.
 * Edit this file directly to add/modify theme values.
 */


import type { Config } from 'tailwindcss'
import containerQueries from '@tailwindcss/container-queries'

const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      // =======================================================================
      // Colors — mapped to --color-* CSS variables
      // =======================================================================
      colors: {
        'primary': 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        'primary-hover': 'var(--color-primary-hover)',
        'secondary': 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        'secondary-hover': 'var(--color-secondary-hover)',
        'background': 'var(--color-background)',
        'foreground': 'var(--color-foreground)',
        'surface': 'var(--color-surface)',
        'muted': 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        'border': 'var(--color-border)',
        'destructive': 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        'destructive-hover': 'var(--color-destructive-hover)',
        'accent': 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        'success': 'var(--color-success)',
        'success-foreground': 'var(--color-success-foreground)',
        'warning': 'var(--color-warning)',
        'warning-foreground': 'var(--color-warning-foreground)',
        'info': 'var(--color-info)',
        'info-foreground': 'var(--color-info-foreground)',
        'ai': 'var(--color-ai)',
        'ai-foreground': 'var(--color-ai-foreground)',
        'ai-hover': 'var(--color-ai-hover)',
        'ai-from': 'var(--color-ai-from)',
        'ai-to': 'var(--color-ai-to)',
        'primary-muted': 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
        'secondary-muted': 'color-mix(in srgb, var(--color-secondary) 30%, transparent)',
        'accent-muted': 'color-mix(in srgb, var(--color-accent) 30%, transparent)',
        'destructive-muted': 'color-mix(in srgb, var(--color-destructive) 30%, transparent)',
        'success-muted': 'color-mix(in srgb, var(--color-success) 30%, transparent)',
        'warning-muted': 'color-mix(in srgb, var(--color-warning) 30%, transparent)',
        'info-muted': 'color-mix(in srgb, var(--color-info) 30%, transparent)',
        'ai-muted': 'color-mix(in srgb, var(--color-ai) 20%, transparent)',
        neu: {
          base: 'var(--color-neu-base)',
          light: 'var(--color-neu-light)',
          dark: 'var(--color-neu-dark)',
        },
        spinner: {
          front: 'var(--color-spinner-front)',
          back: 'var(--color-spinner-back)',
          light: 'var(--color-spinner-light)',
          lighter: 'var(--color-spinner-lighter)',
          dark: 'var(--color-spinner-dark)',
          darker: 'var(--color-spinner-darker)',
        },
      },

      // =======================================================================
      // Typography — mapped to --font-* CSS variables
      // =======================================================================
      fontFamily: {
        sans: 'var(--font-body)',
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-code)',
      },

      // =======================================================================
      // Border Radius — mapped to --radius-* CSS variables
      // =======================================================================
      borderRadius: {
        'theme-sm': 'var(--radius-sm)',
        'theme-md': 'var(--radius-md)',
        'theme-lg': 'var(--radius-lg)',
        'theme-xl': 'var(--radius-xl)',
        'theme-2xl': 'var(--radius-2xl)',
      },

      // =======================================================================
      // Box Shadow — mapped to --shadow-* CSS variables
      // =======================================================================
      boxShadow: {
        // Core neumorphic shadows (from theme)
        'neu-raised': 'var(--shadow-raised)',
        'neu-raised-sm': 'var(--shadow-raised-sm)',
        'neu-raised-lg': 'var(--shadow-raised-lg)',
        // Raised with top highlight (for cards/panels)
        'neu-raised-highlight': 'var(--shadow-inset-highlight), var(--shadow-raised)',
        'neu-pressed': 'var(--shadow-pressed)',
        'neu-pressed-sm': 'var(--shadow-pressed-sm)',
        'neu-flat': 'var(--shadow-flat)',
        'neu-focus': 'var(--shadow-focus)',
        'neu-inset-highlight': 'var(--shadow-inset-highlight)',

        // Variant shadows (from theme)
        'neu-variant-primary': 'var(--shadow-variant-primary)',
        'neu-variant-secondary': 'var(--shadow-variant-secondary)',
        'neu-variant-destructive': 'var(--shadow-variant-destructive)',
        'neu-variant-success': 'var(--shadow-variant-success)',
        'neu-variant-warning': 'var(--shadow-variant-warning)',

        // Control state shadows (from theme)
        'neu-control-unchecked': 'var(--shadow-control-unchecked)',
        'neu-control-checked': 'var(--shadow-control-checked)',

        // Static shadows (not theme-dependent)
        'neu-groove-h': 'inset 0 1px 1px rgba(174, 174, 174, 0.5), inset 0 -1px 1px rgba(255, 255, 255, 0.7)',
        'neu-groove-v': 'inset 1px 0 1px rgba(174, 174, 174, 0.5), inset -1px 0 1px rgba(255, 255, 255, 0.7)',
        'neu-badge-primary': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(0,100,60,0.2)',
        'neu-badge-secondary': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(60,60,140,0.2)',
        'neu-badge-destructive': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(180,40,40,0.2)',
        'neu-badge-success': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(0,100,60,0.2)',
        'neu-badge-warning': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(180,80,0,0.2)',
        'neu-badge-info': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(59,130,246,0.3)',
        'neu-badge-ai': 'inset 0 1px 0 rgba(255,255,255,0.2), -2px -2px 4px rgba(255,255,255,0.2), 2px 2px 4px rgba(139,92,246,0.3)',
        'neu-control-unchecked-inline': 'inset 2px 2px 4px rgba(0,60,40,0.25), inset -1px -1px 2px rgba(255,255,255,0.4)',
        'neu-control-checked-inline': 'inset -2px -2px 5px rgba(255,255,255,0.2), inset 2px 2px 5px rgba(0,80,50,0.3)',
        'neu-radio-indicator': 'inset -1px -1px 2px rgba(255,255,255,0.3), inset 1px 1px 2px rgba(0,80,50,0.3)',
      },

      // =======================================================================
      // Transitions
      // =======================================================================
      transitionTimingFunction: {
        neu: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'neu-fast': 'var(--motion-duration-fast)',
        neu: 'var(--motion-duration-normal)',
        'neu-slow': 'var(--motion-duration-slow)',
      },

      // =======================================================================
      // Z-Index — mapped to --z-* CSS variables
      // =======================================================================
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },

      // =======================================================================
      // Keyframes & Animations
      // =======================================================================
      keyframes: {
        'accordion-expand': {
          from: { gridTemplateRows: '0fr' },
          to: { gridTemplateRows: '1fr' },
        },
        'accordion-collapse': {
          from: { gridTemplateRows: '1fr' },
          to: { gridTemplateRows: '0fr' },
        },
        'content-fade-in': {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'content-fade-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(-4px)' },
        },
        'backdrop-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'backdrop-fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'slide-in-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-out-top': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-100%)' },
        },
        'slide-in-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-out-bottom': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'accordion-expand': 'accordion-expand 300ms ease-neu forwards',
        'accordion-collapse': 'accordion-collapse 300ms ease-neu forwards',
        'content-fade-in': 'content-fade-in 200ms ease-neu 100ms forwards',
        'content-fade-out': 'content-fade-out 150ms ease-neu forwards',
        'backdrop-in': 'backdrop-fade-in 300ms ease-neu forwards',
        'backdrop-out': 'backdrop-fade-out 200ms ease-neu forwards',
        'drawer-in-right': 'slide-in-right 300ms ease-neu forwards',
        'drawer-out-right': 'slide-out-right 200ms ease-neu forwards',
        'drawer-in-left': 'slide-in-left 300ms ease-neu forwards',
        'drawer-out-left': 'slide-out-left 200ms ease-neu forwards',
        'drawer-in-top': 'slide-in-top 300ms ease-neu forwards',
        'drawer-out-top': 'slide-out-top 200ms ease-neu forwards',
        'drawer-in-bottom': 'slide-in-bottom 300ms ease-neu forwards',
        'drawer-out-bottom': 'slide-out-bottom 200ms ease-neu forwards',
      },
    },
  },
  plugins: [containerQueries],
}

export default preset
