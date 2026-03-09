// ---------------------------------------------------------------------------
// GitHub Trending AI Repos Fetcher
// Fetches recently created AI/ML repositories sorted by stars
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import { USER_AGENT, REQUEST_TIMEOUT_MS, GITHUB_PER_PAGE } from '../config.js'

/** GitHub search API response shape */
interface GitHubSearchResponse {
  total_count: number
  items: GitHubRepo[]
}

interface GitHubRepo {
  full_name: string
  html_url: string
  description: string | null
  created_at: string
  stargazers_count: number
  language: string | null
  topics: string[]
}

/**
 * Fetch trending AI repositories created in the last 24 hours.
 *
 * Uses the GitHub Search API with AI/ML/LLM keywords,
 * sorted by star count descending.
 */
export async function fetchGitHub(): Promise<RawArticle[]> {
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString().split('T')[0]

    const query = encodeURIComponent(`AI machine learning LLM created:>${yesterdayISO}`)
    const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${GITHUB_PER_PAGE}`

    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': USER_AGENT,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.warn(`[github] Failed to fetch: HTTP ${response.status}`)
      return []
    }

    const data: GitHubSearchResponse = await response.json()

    const articles: RawArticle[] = data.items.map((repo) => ({
      title: repo.full_name,
      url: repo.html_url,
      description: repo.description ?? repo.full_name,
      publishedAt: repo.created_at,
      sourceName: 'GitHub',
      sourceType: 'github' as const,
      engagement: repo.stargazers_count,
    }))

    console.log(`[github] ${articles.length} trending AI repos`)
    return articles
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[github] Error: ${message}`)
    return []
  }
}
