// ---------------------------------------------------------------------------
// X/Twitter API Fetcher — DISABLED
// Requires X API v2 Basic tier ($100/month)
// Enable by setting X_BEARER_TOKEN env var
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import { TWITTER_CURATED_HANDLES, TWITTER_AI_SEARCH_QUERY } from '../config.js'

/** Fetch AI posts from X/Twitter. Currently disabled — returns empty array. */
export async function fetchTwitter(): Promise<RawArticle[]> {
  const bearerToken = process.env['X_BEARER_TOKEN']
  if (!bearerToken) {
    console.log('[twitter] Skipped — no X_BEARER_TOKEN configured')
    return []
  }

  // TODO: Implement X API v2 search when Basic tier API key is available
  // Handles to monitor: ${TWITTER_CURATED_HANDLES.join(', ')}
  // Search query: ${TWITTER_AI_SEARCH_QUERY}
  void TWITTER_CURATED_HANDLES
  void TWITTER_AI_SEARCH_QUERY
  return []
}
