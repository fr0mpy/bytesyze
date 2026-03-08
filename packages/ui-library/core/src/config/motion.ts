/**
 * Motion configuration - single source of truth for all animation values.
 * Values match styling-config.json and are used by Framer Motion.
 */

// =============================================================================
// Spring Configurations (for Framer Motion)
// =============================================================================

export const SPRING = {
  /** Default spring - balanced feel */
  default: { type: 'spring' as const, stiffness: 300, damping: 30 },
  /** Bouncy spring - more energetic */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  /** Gentle spring - slower, softer */
  gentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
  /** Snappy spring - quick response */
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
  /** Smooth spring - reduced bounce for layout animations */
  smooth: { type: 'spring' as const, stiffness: 400, damping: 40 },
  /** Tooltip spring - lighter feel */
  tooltip: { type: 'spring' as const, stiffness: 400, damping: 15, mass: 0.8 },
} as const

// =============================================================================
// Duration Values (in seconds)
// =============================================================================

export const DURATION = {
  /** Instant feedback - 100ms */
  instant: 0.1,
  /** Fast transitions - 150ms */
  fast: 0.15,
  /** Normal transitions - 200ms */
  normal: 0.2,
  /** Slow transitions - 300ms */
  slow: 0.3,
  /** Spinner animation cycle */
  spinner: 3,
  /** Progress bar wave animation */
  progress: 1.2,
  /** Smooth scroll duration */
  scroll: 1.2,
} as const

// =============================================================================
// Offset Values (in pixels)
// =============================================================================

export const OFFSET = {
  /** Popover gap from trigger */
  popover: 4,
  /** Dropdown gap from trigger */
  dropdown: 4,
  /** Tooltip gap from trigger */
  tooltip: 4,
  /** Slide animation distance */
  slide: 8,
  /** Icon animation offset (theme switcher) */
  icon: 16,
  /** Knob translation (theme switcher) */
  knob: 24,
} as const

// =============================================================================
// Opacity Values
// =============================================================================

export const OPACITY = {
  /** Highlights and accents */
  highlight: 0.2,
} as const

// =============================================================================
// Scroll Configuration
// =============================================================================

export const SCROLL = {
  /** Linear interpolation factor */
  lerp: 0.1,
  /** Duration for smooth scroll */
  duration: DURATION.scroll,
  /** Mouse wheel multiplier */
  wheelMultiplier: 1,
  /** Touch scroll multiplier */
  touchMultiplier: 2,
} as const

// =============================================================================
// Theme Switcher Timing
// =============================================================================

export const THEME_TIMING = {
  /** Icon exit animation duration */
  iconExit: 0.12,
  /** Icon entry delay */
  iconEntryDelay: 0.28,
  /** Icon entry duration */
  iconEntry: 0.2,
} as const

// =============================================================================
// Loading Configuration
// =============================================================================

export const LOADING = {
  /** Number of segments in loading indicator */
  segments: 5,
  /** Interval between segment updates (ms) */
  intervalMs: 200,
} as const

// =============================================================================
// Spinner Configuration
// =============================================================================

export const SPINNER = {
  /** Border radius for spinner cubes */
  borderRadius: 3,
  /** Overlap fill value */
  cornerFill: 1,
  /** Perspective for 3D effect */
  perspective: '800px',
  /** Size presets */
  sizes: {
    sm: { cube: 24, translate: 12 },
    md: { cube: 40, translate: 20 },
    lg: { cube: 56, translate: 28 },
  },
} as const

// =============================================================================
// Default Toast Duration
// =============================================================================

export const TOAST = {
  /** Default display duration (ms) */
  defaultDuration: 5000,
} as const

// =============================================================================
// Convenience Re-export
// =============================================================================

/** Alias for backward compatibility with existing SPRING_CONFIG usage */
export const SPRING_CONFIG = SPRING
