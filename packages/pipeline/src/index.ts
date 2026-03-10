// ---------------------------------------------------------------------------
// Content Pipeline Orchestrator
// Fetch -> Filter existing -> Deduplicate -> Validate -> Summarize -> Score -> Publish
// ---------------------------------------------------------------------------

import { fetchAllSources } from './sources/index.js'
import { deduplicateArticles, filterExistingArticles } from './deduplicator.js'
import { validateArticles } from './validator.js'
import { summarizeArticles } from './summarizer.js'
import { scoreArticles, DEFAULT_WEIGHTS } from './scorer.js'
import { publishCards } from './publisher.js'
import { enrichWithOgImages } from './og-image.js'
import { enrichWithFullText } from './full-text.js'
import { notifyHighScoreCards } from './notify.js'
import { updateSourceHealth } from './source-health.js'
import type { PipelineConfig, PublishableCard } from './types.js'
import { DEFAULT_FEEDS } from './fetcher.js'

/** Default pipeline configuration */
const DEFAULT_CONFIG: PipelineConfig = {
  feeds: DEFAULT_FEEDS,
  sources: [],
  scoringWeights: DEFAULT_WEIGHTS,
  deduplicationThreshold: 0.7,
  maxArticlesPerRun: 50,
}

/**
 * Build pipeline config from environment variables with defaults.
 */
function buildConfig(): PipelineConfig {
  const config = { ...DEFAULT_CONFIG }

  const maxArticles = process.env['PIPELINE_MAX_ARTICLES']
  if (maxArticles) {
    config.maxArticlesPerRun = parseInt(maxArticles, 10)
  }

  const dedupThreshold = process.env['PIPELINE_DEDUP_THRESHOLD']
  if (dedupThreshold) {
    config.deduplicationThreshold = parseFloat(dedupThreshold)
  }

  return config
}

/**
 * Run the full content pipeline.
 *
 * Stages:
 * 1. Fetch articles from all sources (RSS, Hacker News, etc.)
 * 1b. Filter out already-published articles
 * 2. Deduplicate by URL and title similarity
 * 3. Validate for AI relevance
 * 4. Summarize with Claude Haiku API
 * 5. Score with weighted algorithm
 * 6. Publish to Supabase
 */
export async function runPipeline(
  overrides?: Partial<PipelineConfig>
): Promise<PublishableCard[]> {
  const config = { ...buildConfig(), ...overrides }

  console.log('='.repeat(60))
  console.log('[pipeline] Starting content pipeline')
  console.log(`[pipeline] Feeds: ${config.feeds.length}`)
  console.log(`[pipeline] Max articles: ${config.maxArticlesPerRun}`)
  console.log('='.repeat(60))

  // Stage 1: Fetch from all sources
  console.log('\n--- Stage 1: Fetching ---')
  const { articles: rawArticles, healthResults } = await fetchAllSources(config.feeds)
  console.log(`[pipeline] Fetched ${rawArticles.length} total articles`)

  // Track source health (non-blocking)
  updateSourceHealth(healthResults).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[pipeline] Source health update failed: ${msg}`)
  })

  if (rawArticles.length === 0) {
    console.log('[pipeline] No articles fetched. Exiting.')
    return []
  }

  // Stage 1b: Filter out already-published articles
  console.log('\n--- Stage 1b: Filtering existing ---')
  const newArticles = await filterExistingArticles(rawArticles)
  console.log(`[pipeline] After filtering existing: ${newArticles.length} articles`)

  if (newArticles.length === 0) {
    console.log('[pipeline] No new articles. Exiting.')
    return []
  }

  // Stage 2: Deduplicate
  console.log('\n--- Stage 2: Deduplication ---')
  const uniqueArticles = deduplicateArticles(
    newArticles,
    config.deduplicationThreshold
  )
  console.log(`[pipeline] After dedup: ${uniqueArticles.length} articles`)

  // Stage 3: Validate
  console.log('\n--- Stage 3: Validation ---')
  const validArticles = await validateArticles(uniqueArticles)
  console.log(`[pipeline] After validation: ${validArticles.length} articles`)

  if (validArticles.length === 0) {
    console.log('[pipeline] No valid articles. Exiting.')
    return []
  }

  // Limit to max articles per run
  const limitedArticles = validArticles.slice(0, config.maxArticlesPerRun)

  // Stage 3b: Enrich with full-text content
  console.log('\n--- Stage 3b: Full-Text Enrichment ---')
  const fullTextArticles = await enrichWithFullText(limitedArticles)

  // Stage 4: Summarize
  console.log('\n--- Stage 4: Summarization ---')
  const processedArticles = await summarizeArticles(fullTextArticles)

  // Stage 5: Score
  console.log('\n--- Stage 5: Scoring ---')
  const scoredArticles = scoreArticles(
    processedArticles,
    config.feeds,
    config.scoringWeights
  )

  // Stage 5b: Extract OG images
  console.log('\n--- Stage 5b: OG Image Extraction ---')
  const withImages = await enrichWithOgImages(scoredArticles)

  // Stage 6: Publish
  console.log('\n--- Stage 6: Publishing ---')
  const cards = await publishCards(withImages)

  // Stage 7: Push notifications for high-score cards (non-blocking)
  notifyHighScoreCards(cards).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[pipeline] Push notification failed: ${msg}`)
  })

  console.log('\n' + '='.repeat(60))
  console.log(`[pipeline] Complete! Published ${cards.length} cards`)
  console.log('='.repeat(60))

  return cards
}

// Run directly if called as script
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('index.ts') ||
    process.argv[1].endsWith('index.js'))

if (isDirectRun) {
  runPipeline().catch((error: unknown) => {
    console.error('[pipeline] Fatal error:', error)
    process.exit(1)
  })
}
