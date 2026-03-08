/**
 * Speculation Rules API utilities for browser prefetch/prerender
 * @see https://developer.chrome.com/docs/web-platform/prerender-pages
 *
 * Browser support:
 * - Chrome 109+ / Edge 109+ (~75% of users)
 * - Safari/Firefox: Gracefully ignored (normal navigation)
 *
 * Used by: Google Search, Cloudflare, WordPress, Akamai, Astro
 */

export type SpeculationEagerness =
  | 'immediate' // Speculate as soon as rules are observed
  | 'eager' // Speculate on any slight indication
  | 'moderate' // Speculate on hover/focus (default for prefetch)
  | 'conservative' // Speculate on mousedown/touchstart (default for prerender)

export interface SpeculationRulesConfig {
  /** Paths to prefetch on hover (e.g., ['/agent-toolkit/*', '/docs/*']) */
  prefetchPaths: string[]
  /** Paths to prerender on mousedown (optional, defaults to prefetchPaths) */
  prerenderPaths?: string[]
  /** Eagerness for prefetch (default: 'moderate' = hover) */
  prefetchEagerness?: SpeculationEagerness
  /** Eagerness for prerender (default: 'conservative' = mousedown) */
  prerenderEagerness?: SpeculationEagerness
}

interface HrefMatch {
  href_matches: string
}

interface SpeculationRule {
  source: 'document'
  where: { or: HrefMatch[] }
  eagerness: SpeculationEagerness
}

interface SpeculationRulesJson {
  prefetch: SpeculationRule[]
  prerender: SpeculationRule[]
}

/**
 * Build Speculation Rules JSON for browser prefetch/prerender
 *
 * @example
 * const rules = buildSpeculationRules({
 *   prefetchPaths: ['/agent-toolkit/*', '/docs/*'],
 * })
 * // Returns JSON string for <script type="speculationrules">
 */
export function buildSpeculationRules(config: SpeculationRulesConfig): string {
  const {
    prefetchPaths,
    prerenderPaths = prefetchPaths,
    prefetchEagerness = 'moderate',
    prerenderEagerness = 'conservative',
  } = config

  const toHrefMatches = (paths: string[]): HrefMatch[] =>
    paths.map((path) => ({ href_matches: path }))

  const rules: SpeculationRulesJson = {
    prefetch: [
      {
        source: 'document',
        where: { or: toHrefMatches(prefetchPaths) },
        eagerness: prefetchEagerness,
      },
    ],
    prerender: [
      {
        source: 'document',
        where: { or: toHrefMatches(prerenderPaths) },
        eagerness: prerenderEagerness,
      },
    ],
  }

  return JSON.stringify(rules)
}
