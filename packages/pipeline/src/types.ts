// ---------------------------------------------------------------------------
// Pipeline-specific types
// ---------------------------------------------------------------------------

/** Union types mirroring the web app's Supabase types */
export type CardCategory =
  | 'OpenAI'
  | 'Anthropic'
  | 'Google'
  | 'Meta'
  | 'Open Source'
  | 'Research'
  | 'Startups'
  | 'Tools'
  | 'Policy'
  | 'Industry'

export type VisualType = 'bar' | 'line' | 'vs' | 'stat'

export type CardStatus = 'draft' | 'published' | 'archived' | 'clustered'

/** Source types for multi-source pipeline */
export type SourceType = 'rss' | 'hackernews' | 'arxiv' | 'github' | 'reddit' | 'twitter'

/** Extended content source config (replaces FeedSource for new sources) */
export interface ContentSource {
  name: string
  url: string
  type: SourceType
  tier: 1 | 2 | 3
  authorityWeight: number
  enabled: boolean
}

/** Raw article as extracted from an RSS feed or other source */
export interface RawArticle {
  title: string
  url: string
  description: string
  publishedAt: string
  sourceName: string
  sourceType?: SourceType
  engagement?: number | null
  fullText?: string
}

/** Article after AI summarization, ready for scoring */
export interface ProcessedArticle {
  title: string
  teaser: string
  keyPoints: string[]
  sourceUrl: string
  sourceName: string
  category: CardCategory
  visualType: VisualType | null
  visualData: Record<string, unknown> | null
  publishedAt: string
  sourceHash: string
}

/** Final card ready for publishing (matches web app Card shape) */
export interface PublishableCard {
  id: string
  title: string
  teaser: string
  key_points: string[]
  source_url: string
  source_name: string
  source_favicon: string | null
  category: CardCategory
  visual_type: VisualType | null
  visual_data: Record<string, unknown> | null
  image_url: string | null
  locale: string
  status: CardStatus
  relevance_score: number | null
  source_hash: string
  published_at: string | null
  created_at: string
}

/** Feed source configuration */
export interface FeedSource {
  name: string
  url: string
  authorityWeight: number
}

/** Scoring weights configuration */
export interface ScoringWeights {
  recency: number
  sourceAuthority: number
  engagementProxy: number
  visualRichness: number
  novelty: number
}

/** Pipeline configuration */
export interface PipelineConfig {
  feeds: FeedSource[]
  sources: ContentSource[]
  scoringWeights: ScoringWeights
  deduplicationThreshold: number
  maxArticlesPerRun: number
}
