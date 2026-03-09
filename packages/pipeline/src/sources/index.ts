// ---------------------------------------------------------------------------
// Unified Source Orchestrator
// Fetches from all configured content sources in parallel
// ---------------------------------------------------------------------------

import { fetchArticles } from '../fetcher.js'
import type { FeedSource, RawArticle } from '../types.js'
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

/** Fetch from all configured content sources in parallel */
export async function fetchAllSources(feeds: FeedSource[]): Promise<RawArticle[]> {
  const sources = buildSourceRegistry(feeds)
  const results = await Promise.allSettled(
    sources.map((source) => source.fetch())
  )

  const articles: RawArticle[] = []

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const sourceName = sources[i].name
    if (result.status === 'fulfilled') {
      console.log(`[sources] ${sourceName}: ${result.value.length} articles`)
      articles.push(...result.value)
    } else {
      console.warn(`[sources] ${sourceName} failed: ${result.reason}`)
    }
  }

  console.log(`[sources] Total: ${articles.length} articles from all sources`)
  return articles
}
