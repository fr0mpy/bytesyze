// ---------------------------------------------------------------------------
// Reddit API Fetcher
// Uses OAuth2 client credentials flow to fetch hot posts from AI subreddits.
// Disabled without REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET env vars.
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import {
  REDDIT_SUBREDDITS,
  REDDIT_MAX_POSTS_PER_SUB,
  REDDIT_MAX_DESCRIPTION_LENGTH,
  REDDIT_API_BASE,
  REDDIT_TOKEN_URL,
  USER_AGENT,
  REQUEST_TIMEOUT_MS,
} from '../config.js'
import { containsAiKeyword } from '../config.js'

interface RedditToken {
  access_token: string
  token_type: string
  expires_in: number
}

interface RedditPost {
  data: {
    title: string
    selftext: string
    url: string
    permalink: string
    subreddit: string
    author: string
    created_utc: number
    score: number
    num_comments: number
    is_self: boolean
    link_flair_text?: string
  }
}

interface RedditListing {
  data: {
    children: RedditPost[]
  }
}

/**
 * Obtain an OAuth2 access token using client credentials.
 */
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(REDDIT_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Reddit auth failed: ${response.status} ${response.statusText}`)
  }

  const token = (await response.json()) as RedditToken
  return token.access_token
}

/**
 * Fetch hot posts from a single subreddit.
 */
async function fetchSubreddit(
  subreddit: string,
  accessToken: string
): Promise<RawArticle[]> {
  const url = `${REDDIT_API_BASE}/r/${subreddit}/hot?limit=${REDDIT_MAX_POSTS_PER_SUB}&raw_json=1`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Reddit /r/${subreddit} fetch failed: ${response.status}`)
  }

  const listing = (await response.json()) as RedditListing
  const articles: RawArticle[] = []

  for (const post of listing.data.children) {
    const { title, selftext, url: postUrl, permalink, subreddit: sub, created_utc, is_self } = post.data
    const combinedText = `${title} ${selftext}`

    // Skip non-AI posts
    if (!containsAiKeyword(combinedText)) continue

    // Use the external link URL for link posts, Reddit permalink for self posts
    const articleUrl = is_self
      ? `https://www.reddit.com${permalink}`
      : postUrl

    const description = selftext
      ? selftext.slice(0, REDDIT_MAX_DESCRIPTION_LENGTH)
      : `Discussion on r/${sub}: ${title}`

    articles.push({
      title,
      url: articleUrl,
      description,
      sourceName: `Reddit r/${sub}`,
      publishedAt: new Date(created_utc * 1000).toISOString(),
    })
  }

  return articles
}

/** Fetch AI posts from Reddit. Disabled without REDDIT_CLIENT_ID. */
export async function fetchReddit(): Promise<RawArticle[]> {
  const clientId = process.env['REDDIT_CLIENT_ID']
  const clientSecret = process.env['REDDIT_CLIENT_SECRET']

  if (!clientId || !clientSecret) {
    console.log('[reddit] Skipped — no REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET configured')
    return []
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret)

    const results = await Promise.allSettled(
      REDDIT_SUBREDDITS.map((sub) => fetchSubreddit(sub, accessToken))
    )

    const articles: RawArticle[] = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled') {
        console.log(`[reddit] r/${REDDIT_SUBREDDITS[i]}: ${result.value.length} AI posts`)
        articles.push(...result.value)
      } else {
        const msg = result.reason instanceof Error ? result.reason.message : String(result.reason)
        console.warn(`[reddit] r/${REDDIT_SUBREDDITS[i]} failed: ${msg}`)
      }
    }

    console.log(`[reddit] Total: ${articles.length} articles`)
    return articles
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.warn(`[reddit] Failed: ${msg}`)
    return []
  }
}
