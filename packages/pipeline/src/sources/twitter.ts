// ---------------------------------------------------------------------------
// X/Twitter Fetcher via xAI Grok API
// Uses Grok's native X/Twitter search capability via OpenAI-compatible API.
// Disabled without XAI_API_KEY env var.
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import {
  TWITTER_CURATED_HANDLES,
  TWITTER_AI_SEARCH_QUERY,
  TWITTER_MAX_TITLE_LENGTH,
  GROK_API_BASE,
  GROK_MODEL,
  GROK_MAX_TOKENS,
  GROK_TEMPERATURE,
} from '../config.js'

interface GrokTweet {
  text: string
  author: string
  url: string
  posted_at: string
  engagement: number
}

interface GrokChoice {
  message: {
    content: string
  }
}

interface GrokResponse {
  choices: GrokChoice[]
}

const SYSTEM_PROMPT = `You are a research assistant that searches X/Twitter for notable AI news.

Search for the most significant AI-related posts from the last 24 hours.

Prioritize posts from these accounts: ${TWITTER_CURATED_HANDLES.join(', ')}
Also search for posts matching: ${TWITTER_AI_SEARCH_QUERY}

Return ONLY valid JSON — no markdown fences, no explanation.
Return an array of the top 10-15 most newsworthy posts:
[
  {
    "text": "the tweet text (max 280 chars)",
    "author": "handle without @",
    "url": "https://x.com/handle/status/id",
    "posted_at": "ISO 8601 timestamp",
    "engagement": 12345
  }
]

Rules:
- Only include posts with genuine AI/ML news value (launches, papers, announcements)
- Skip memes, jokes, engagement bait, and self-promotion
- Skip retweets/reposts — original posts only
- Engagement = likes + retweets combined
- If no notable posts found, return an empty array []`

/**
 * Call xAI Grok API to search X/Twitter for AI news.
 * Uses OpenAI-compatible chat completions endpoint.
 */
async function callGrok(apiKey: string): Promise<GrokTweet[]> {
  const response = await fetch(`${GROK_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      max_tokens: GROK_MAX_TOKENS,
      temperature: GROK_TEMPERATURE,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: 'Search X/Twitter for the most notable AI news posts from the last 24 hours. Return JSON array.',
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Grok API failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GrokResponse
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    console.warn('[twitter/grok] No content in Grok response')
    return []
  }

  // Strip markdown code fences if present
  let raw = content.trim()
  const fenceMatch = raw.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i)
  if (fenceMatch?.[1]) {
    raw = fenceMatch[1].trim()
  }

  try {
    const tweets = JSON.parse(raw) as GrokTweet[]
    if (!Array.isArray(tweets)) return []
    return tweets
  } catch {
    console.warn('[twitter/grok] Failed to parse Grok JSON response')
    return []
  }
}

/** Fetch AI posts from X/Twitter via Grok. Disabled without XAI_API_KEY. */
export async function fetchTwitter(): Promise<RawArticle[]> {
  const apiKey = process.env['XAI_API_KEY']

  if (!apiKey) {
    console.log('[twitter/grok] Skipped — no XAI_API_KEY configured')
    return []
  }

  try {
    const tweets = await callGrok(apiKey)

    const articles: RawArticle[] = tweets
      .filter((t) => t.text && t.author && t.url)
      .map((tweet) => ({
        title: tweet.text.length > TWITTER_MAX_TITLE_LENGTH
          ? tweet.text.slice(0, TWITTER_MAX_TITLE_LENGTH - 3) + '...'
          : tweet.text,
        url: tweet.url,
        description: tweet.text,
        sourceName: `X/@${tweet.author}`,
        publishedAt: tweet.posted_at || new Date().toISOString(),
      }))

    console.log(`[twitter/grok] Found ${articles.length} AI posts via Grok`)
    return articles
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.warn(`[twitter/grok] Failed: ${msg}`)
    return []
  }
}
