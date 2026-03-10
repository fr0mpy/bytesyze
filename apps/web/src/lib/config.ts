// ---------------------------------------------------------------------------
// Web App Configuration Constants
// Single source of truth for all tunable values across the web app
// ---------------------------------------------------------------------------

// ==========================================================================
// Rate Limiting
// ==========================================================================

export const RATE_LIMITS = {
  /** Events API: 100 requests per 10 seconds per IP */
  events: { maxRequests: 100, windowMs: 10_000 },
  /** Pipeline API: 1 request per 60 seconds per IP */
  pipeline: { maxRequests: 1, windowMs: 60_000 },
  /** Push subscribe API: 10 requests per 60 seconds per IP */
  pushSubscribe: { maxRequests: 10, windowMs: 60_000 },
  /** Rate limiter store cleanup interval */
  cleanupIntervalMs: 60_000,
} as const

// ==========================================================================
// API
// ==========================================================================

/** Pipeline function max duration in seconds */
export const PIPELINE_MAX_DURATION = 300

/** Pagination defaults */
export const PAGINATION = {
  minLimit: 1,
  maxLimit: 100,
  defaultLimit: 20,
} as const

// ==========================================================================
// Cache Control
// ==========================================================================

export const CACHE_CONTROL = {
  /** Cards list: 1 minute cache, 5 minute stale revalidation */
  cards: 's-maxage=60, stale-while-revalidate=300',
  /** Single card: 1 hour cache, 24 hour stale revalidation */
  cardDetail: 's-maxage=3600, stale-while-revalidate=86400',
  /** OG images: 24 hour cache */
  ogImage: 'public, s-maxage=86400',
} as const

// ==========================================================================
// Freshness Thresholds
// ==========================================================================

/** Cards newer than this are "fresh" (2 hours) */
export const FRESH_THRESHOLD_MS = 2 * 60 * 60 * 1000

/** Cards older than this are "stale" (6 hours) */
export const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000

// ==========================================================================
// Auth
// ==========================================================================

/** Admin session cookie max age (24 hours) */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24

// ==========================================================================
// UI Timing
// ==========================================================================

/** Delay before showing push notification prompt (ms) */
export const PUSH_PROMPT_DELAY_MS = 5_000

/** Duration to show "Copied!" feedback (ms) */
export const COPY_FEEDBACK_DURATION_MS = 1_500
