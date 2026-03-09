// ---------------------------------------------------------------------------
// Card Publisher
// Console log + JSON file output (Supabase placeholder)
// ---------------------------------------------------------------------------

import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { PublishableCard } from './types.js'
import type { ScoredArticle } from './scorer.js'

/**
 * Convert a scored article into a publishable card matching the web app's Card type.
 */
function toPublishableCard(scored: ScoredArticle): PublishableCard {
  const { article, score } = scored

  return {
    id: randomUUID(),
    title: article.title,
    teaser: article.teaser,
    key_points: article.keyPoints,
    source_url: article.sourceUrl,
    source_name: article.sourceName,
    source_favicon: null,
    category: article.category,
    visual_type: article.visualType,
    visual_data: article.visualData,
    image_url: null,
    locale: 'en',
    status: 'draft',
    relevance_score: score / 100,
    source_hash: article.sourceHash,
    published_at: article.publishedAt,
    created_at: new Date().toISOString(),
  }
}

/**
 * Ensure the output directory exists.
 */
async function ensureOutputDir(outputDir: string): Promise<void> {
  await mkdir(outputDir, { recursive: true })
}

/**
 * Publish scored articles: log to console and save to JSON file.
 * In production, this would insert into Supabase.
 *
 * @param scored - Scored articles sorted by relevance
 * @param outputDir - Directory for JSON output
 * @returns Array of published cards
 */
export async function publishCards(
  scored: ScoredArticle[],
  outputDir: string
): Promise<PublishableCard[]> {
  const cards = scored.map(toPublishableCard)

  // Log each card
  for (const card of cards) {
    console.log(
      `[publisher] Card: "${card.title}" ` +
        `| score: ${card.relevance_score} ` +
        `| category: ${card.category} ` +
        `| source: ${card.source_name}`
    )
  }

  // Write to JSON file
  await ensureOutputDir(outputDir)
  const outputPath = join(outputDir, 'cards.json')

  await writeFile(outputPath, JSON.stringify(cards, null, 2), 'utf-8')
  console.log(`[publisher] Saved ${cards.length} cards to ${outputPath}`)

  // Placeholder: Supabase insert would go here
  // const { error } = await supabase.from('cards').upsert(cards, {
  //   onConflict: 'source_hash',
  // })

  return cards
}
