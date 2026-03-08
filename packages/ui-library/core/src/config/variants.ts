/**
 * Motion variants - reusable Framer Motion animation presets.
 * Complements motion.ts (primitives) with composed variants.
 */

import { SPRING, DURATION } from './motion'

// =============================================================================
// Types
// =============================================================================

export type SlideDirection = 'left' | 'right' | 'top' | 'bottom'

export interface MotionVariant {
  initial: Record<string, string | number>
  animate: Record<string, string | number | object>
  exit: Record<string, string | number | object>
}

// =============================================================================
// Slide Variants (directional enter/exit)
// =============================================================================

export const SLIDE = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
} as const

// =============================================================================
// Slide + Fade Variants (for toasts)
// =============================================================================

export const SLIDE_FADE = {
  left: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  right: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  top: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  bottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
} as const

// =============================================================================
// Popup Variants (dropdowns, modals, popovers)
// =============================================================================

export const POPUP = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: SPRING.default },
  exit: { opacity: 0, scale: 0.95, transition: { duration: DURATION.fast } },
} as const

export const POPUP_SNAPPY = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: SPRING.snappy },
  exit: { opacity: 0, scale: 0.95, transition: { duration: DURATION.instant } },
} as const

export const POPUP_SLIDE = {
  initial: { opacity: 0, scale: 0.95, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING.default },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: DURATION.fast } },
} as const

// =============================================================================
// Backdrop Variants
// =============================================================================

export const BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.fast } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
} as const
