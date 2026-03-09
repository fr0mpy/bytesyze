// ---------------------------------------------------------------------------
// Hacker News Fetcher
// Fetches top stories from HN Firebase API and filters for AI-related content
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import { containsAiKeyword, REQUEST_TIMEOUT_MS, HN_MAX_STORIES, HN_API_BASE } from '../config.js'

/** HN item shape from Firebase API */
interface HNItem {
  id: number
  title: string
  url?: string
  score: number
  time: number
  descendants?: number
  by: string
  type: string
}

/**
 * Fetch top AI-related stories from Hacker News.
 *
 * - Fetches top 30 story IDs
 * - Fetches each item in parallel
 * - Filters for items with URLs and AI keywords in the title
 */
export async function fetchHackerNews(): Promise<RawArticle[]> {
  try {
    const idsResponse = await fetch(`${HN_API_BASE}/topstories.json`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!idsResponse.ok) {
      console.warn(`[hackernews] Failed to fetch top stories: HTTP ${idsResponse.status}`)
      return []
    }

    const allIds: number[] = await idsResponse.json()
    const topIds = allIds.slice(0, HN_MAX_STORIES)

    const itemResults = await Promise.allSettled(
      topIds.map(async (id) => {
        const response = await fetch(`${HN_API_BASE}/item/${id}.json`, {
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        })
        if (!response.ok) return null
        return response.json() as Promise<HNItem>
      })
    )

    const articles: RawArticle[] = []

    for (const result of itemResults) {
      if (result.status !== 'fulfilled' || !result.value) continue

      const item = result.value

      // Skip items without external URLs (Ask HN, Show HN text posts)
      if (!item.url) continue

      // Filter for AI-related content
      if (!containsAiKeyword(item.title)) continue

      articles.push({
        title: item.title,
        url: item.url,
        description: item.title,
        publishedAt: new Date(item.time * 1000).toISOString(),
        sourceName: 'Hacker News',
        sourceType: 'hackernews',
        engagement: item.score,
      })
    }

    console.log(`[hackernews] ${articles.length} AI-related articles from top ${HN_MAX_STORIES}`)
    return articles
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[hackernews] Error: ${message}`)
    return []
  }
}
