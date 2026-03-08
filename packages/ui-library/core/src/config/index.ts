/**
 * Central configuration exports.
 * Import from '@/config' or '../config' in components.
 */

// Motion configuration
export {
  SPRING,
  SPRING_CONFIG,
  DURATION,
  OFFSET,
  OPACITY,
  SCROLL,
  THEME_TIMING,
  LOADING,
  SPINNER,
  TOAST,
} from './motion'

// Text configuration
export { ARIA, LABEL, PLACEHOLDER, SR_ONLY } from './text'

// Responsive breakpoints
export { BREAKPOINTS, MEDIA_QUERIES } from './breakpoints'

// Motion variants
export {
  SLIDE,
  SLIDE_FADE,
  POPUP,
  POPUP_SNAPPY,
  POPUP_SLIDE,
  BACKDROP,
  type SlideDirection,
  type MotionVariant,
} from './variants'
