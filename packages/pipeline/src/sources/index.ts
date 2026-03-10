// ---------------------------------------------------------------------------
// Unified Source Orchestrator
// Fetches from all configured content sources in parallel
// ---------------------------------------------------------------------------

import { fetchArticles } from '../fetcher.js'
import type { FeedSource, RawArticle } from '../types.js'
import type { FetchResult } from '../source-health.js'
import { generateSourceId } from '../source-health.js'
import { fetchHackerNews } from './hackernews.js'
import { fetchArxiv } from './arxiv.js'
import { fetchGitHub } from './github.js'
import { fetchReddit } from './reddit.js'
import { fetchTwitter } from './twitter.js'

/** Source registry: name + fetcher function */
interface SourceEntry {
  name: string
  fetch: () => Promise<RawArticle[]>
}

/** Build source registry with RSS feeds injected */
function buildSourceRegistry(feeds: FeedSource[]): SourceEntry[] {
  return [
    { name: 'RSS', fetch: () => fetchArticles(feeds) },
    { name: 'HackerNews', fetch: fetchHackerNews },
    { name: 'arXiv', fetch: fetchArxiv },
    { name: 'GitHub', fetch: fetchGitHub },
    { name: 'Reddit', fetch: fetchReddit },
    { name: 'Twitter', fetch: fetchTwitter },
  ]
}

export interface FetchAllResult {
  articles: RawArticle[]
  healthResults: FetchResult[]
}

/** Fetch from all configured content sources in parallel */
export async function fetchAllSources(feeds: FeedSource[]): Promise<FetchAllResult> {
  const sources = buildSourceRegistry(feeds)
  const results = await Promise.allSettled(
    sources.map((source) => source.fetch())
  )

  const articles: RawArticle[] = []
  const healthResults: FetchResult[] = []
  const now = new Date().toISOString()

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const sourceName = sources[i].name
    if (result.status === 'fulfilled') {
      console.log(`[sources] ${sourceName}: ${result.value.length} articles`)
      articles.push(...result.value)
      healthResults.push({
        sourceName,
        sourceId: generateSourceId(sourceName),
        articleCount: result.value.length,
        httpStatus: 200,
        error: null,
        fetchedAt: now,
      })
    } else {
      const errorMsg = result.reason instanceof Error ? result.reason.message : String(result.reason)
      console.warn(`[sources] ${sourceName} failed: ${errorMsg}`)
      healthResults.push({
        sourceName,
        sourceId: generateSourceId(sourceName),
        articleCount: 0,
        httpStatus: null,
        error: errorMsg,
        fetchedAt: now,
      })
    }
  }

  console.log(`[sources] Total: ${articles.length} articles from all sources`)
  return { articles, healthResults }
}
