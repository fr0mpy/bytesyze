// ---------------------------------------------------------------------------
// Content Pipeline Orchestrator
// Fetch -> Deduplicate -> Validate -> Summarize -> Score -> Publish
// ---------------------------------------------------------------------------

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchArticles, DEFAULT_FEEDS } from './fetcher.js'
import { deduplicateArticles } from './deduplicator.js'
import { validateArticles } from './validator.js'
import { summarizeArticles } from './summarizer.js'
import { scoreArticles, DEFAULT_WEIGHTS } from './scorer.js'
import { publishCards } from './publisher.js'
import type { PipelineConfig, PublishableCard } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Default pipeline configuration */
const DEFAULT_CONFIG: PipelineConfig = {
  feeds: DEFAULT_FEEDS,
  scoringWeights: DEFAULT_WEIGHTS,
  deduplicationThreshold: 0.7,
  maxArticlesPerRun: 50,
  outputDir: join(__dirname, '..', 'output'),
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

  const outputDir = process.env['PIPELINE_OUTPUT_DIR']
  if (outputDir) {
    config.outputDir = outputDir
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
 * 1. Fetch articles from RSS feeds
 * 2. Deduplicate by URL and title similarity
 * 3. Validate for AI relevance
 * 4. Summarize with AI (mock implementation)
 * 5. Score with weighted algorithm
 * 6. Publish to output
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

  // Stage 1: Fetch
  console.log('\n--- Stage 1: Fetching ---')
  const rawArticles = await fetchArticles(config.feeds)
  console.log(`[pipeline] Fetched ${rawArticles.length} total articles`)

  if (rawArticles.length === 0) {
    console.log('[pipeline] No articles fetched. Exiting.')
    return []
  }

  // Stage 2: Deduplicate
  console.log('\n--- Stage 2: Deduplication ---')
  const uniqueArticles = deduplicateArticles(
    rawArticles,
    config.deduplicationThreshold
  )
  console.log(`[pipeline] After dedup: ${uniqueArticles.length} articles`)

  // Stage 3: Validate
  console.log('\n--- Stage 3: Validation ---')
  const validArticles = validateArticles(uniqueArticles)
  console.log(`[pipeline] After validation: ${validArticles.length} articles`)

  if (validArticles.length === 0) {
    console.log('[pipeline] No valid articles. Exiting.')
    return []
  }

  // Limit to max articles per run
  const limitedArticles = validArticles.slice(0, config.maxArticlesPerRun)

  // Stage 4: Summarize
  console.log('\n--- Stage 4: Summarization ---')
  const processedArticles = summarizeArticles(limitedArticles)

  // Stage 5: Score
  console.log('\n--- Stage 5: Scoring ---')
  const scoredArticles = scoreArticles(
    processedArticles,
    config.feeds,
    config.scoringWeights
  )

  // Stage 6: Publish
  console.log('\n--- Stage 6: Publishing ---')
  const cards = await publishCards(scoredArticles, config.outputDir)

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
