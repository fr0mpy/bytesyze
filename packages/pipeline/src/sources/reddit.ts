// ---------------------------------------------------------------------------
// Reddit API Fetcher — DISABLED
// Requires commercial API approval and OAuth credentials
// Enable by setting REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET env vars
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import { REDDIT_SUBREDDITS } from '../config.js'

/** Fetch AI posts from Reddit. Currently disabled — returns empty array. */
export async function fetchReddit(): Promise<RawArticle[]> {
  const clientId = process.env['REDDIT_CLIENT_ID']
  if (!clientId) {
    console.log('[reddit] Skipped — no REDDIT_CLIENT_ID configured')
    return []
  }

  // TODO: Implement OAuth flow + subreddit fetching when API access is available
  // Subreddits to monitor: ${REDDIT_SUBREDDITS.join(', ')}
  void REDDIT_SUBREDDITS
  return []
}
