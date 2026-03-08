/**
 * Text configuration - single source of truth for all text content.
 * Includes aria-labels, button text, placeholders, and screen reader text.
 */

// =============================================================================
// ARIA Labels
// =============================================================================

export const ARIA = {
  /** Close button/action */
  close: 'Close',
  /** Loading state */
  loading: 'Loading...',
  /** Search input */
  search: 'Search',
  /** Filter by type */
  filterByType: 'Filter by type',
  /** Filter by time range */
  filterByTimeRange: 'Filter by time range',
  /** Filter by level */
  filterByLevel: 'Filter by level',
  /** Filter input */
  filterInput: 'Filter',
  /** Carousel previous */
  previousSlide: 'Previous slide',
  /** Carousel next */
  nextSlide: 'Next slide',
  /** Carousel go to slide - use with index: ARIA.goToSlide(1) */
  goToSlide: (index: number) => `Go to slide ${index}`,
  /** Pagination ellipsis */
  morePages: 'More pages',
  /** Pagination previous */
  previousPage: 'Go to previous page',
  /** Pagination next */
  nextPage: 'Go to next page',
  /** Number input decrease */
  decreaseValue: 'Decrease value',
  /** Number input increase */
  increaseValue: 'Increase value',
  /** Breadcrumb navigation */
  breadcrumb: 'breadcrumb',
  /** Theme switcher - to light */
  switchToLight: 'Switch to light mode',
  /** Theme switcher - to dark */
  switchToDark: 'Switch to dark mode',
  /** Pagination navigation */
  pagination: 'pagination',
} as const

// =============================================================================
// Visible Labels
// =============================================================================

export const LABEL = {
  /** Previous button text */
  previous: 'Previous',
  /** Next button text */
  next: 'Next',
  /** Loading button text */
  loading: 'LOADING',
} as const

// =============================================================================
// Placeholders
// =============================================================================

export const PLACEHOLDER = {
  /** Search input */
  search: 'Search...',
  /** Select component */
  select: 'Select...',
} as const

// =============================================================================
// Screen Reader Only Text
// =============================================================================

export const SR_ONLY = {
  /** Loading spinner */
  loading: 'Loading...',
  /** Close button */
  close: 'Close',
  /** More pages indicator */
  morePages: 'More pages',
} as const
