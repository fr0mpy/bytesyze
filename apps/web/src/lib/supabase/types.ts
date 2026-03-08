// ---------------------------------------------------------------------------
// Supabase database types for bytesyze.ai
// Mirrors the Postgres schema defined in the backend spec.
// ---------------------------------------------------------------------------

// --- Union types (match DB CHECK constraints) ------------------------------

export type CardStatus = 'draft' | 'published' | 'archived' | 'clustered'

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

export type EventType = 'view' | 'share' | 'click_source' | 'flag'

export type SourceHealthStatus = 'healthy' | 'degraded' | 'down' | 'disabled'

export type DiscoveredSourceStatus = 'active' | 'disabled' | 'rejected'

export type DiscoveredSourceType = 'rss' | 'scrape' | 'api'

export type DiscoveryMethod =
  | 'hn_domain'
  | 'github_awesome'
  | 'producthunt'
  | 'huggingface'
  | 'manual'

export type DiscoveredProfileStatus = 'discovered' | 'curated' | 'rejected'

// --- Table row types -------------------------------------------------------

export interface Card {
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

export interface CardEvent {
  id: string
  card_id: string
  event_type: EventType
  created_at: string
}

export interface SourceHealth {
  source_id: string
  last_success_at: string | null
  last_error_at: string | null
  consecutive_failures: number
  last_http_status: number | null
  avg_items_per_cycle: number | null
  status: SourceHealthStatus
  backoff_until: string | null
}

export interface DiscoveredSource {
  id: string
  name: string
  url: string
  source_type: DiscoveredSourceType
  tier: number
  validation_score: number
  cards_produced: number
  status: DiscoveredSourceStatus
  discovered_at: string
  discovery_method: DiscoveryMethod
}

export interface DiscoveredProfile {
  handle: string
  display_name: string | null
  bio: string | null
  follower_count: number | null
  discovered_at: string
  discovery_query: string | null
  times_surfaced: number
  cards_produced: number
  status: DiscoveredProfileStatus
  last_checked_at: string | null
}
