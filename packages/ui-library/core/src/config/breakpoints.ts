/**
 * Responsive breakpoint configuration.
 * Aligned with Tailwind's default breakpoints.
 */

export const BREAKPOINTS = {
  /** Small devices (phones) - below 640px */
  sm: 640,
  /** Medium devices (tablets) - 768px+ */
  md: 768,
  /** Large devices (desktops) - 1024px+ */
  lg: 1024,
  /** Extra large devices - 1280px+ */
  xl: 1280,
  /** 2XL devices - 1536px+ */
  '2xl': 1536,
} as const

/**
 * Media query strings for use with matchMedia/useMediaQuery.
 * Uses max-width - 1px pattern for "below breakpoint" queries.
 */
export const MEDIA_QUERIES = {
  /** Mobile: below md breakpoint (< 768px) */
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  /** Tablet: md to lg breakpoint (768px - 1023px) */
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  /** Desktop: lg breakpoint and above (1024px+) */
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  /** Touch device detection */
  touch: '(pointer: coarse)',
} as const
