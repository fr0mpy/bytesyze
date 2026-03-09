-- ==========================================================================
-- bytesyze.ai — Initial database schema
-- Run this in the Supabase SQL Editor to create all tables, indexes, and RLS
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. cards — Primary content table
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cards (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL CHECK (char_length(title) <= 47),
  teaser        text        NOT NULL CHECK (char_length(teaser) <= 81),
  key_points    text[]      NOT NULL,
  source_url    text        NOT NULL,
  source_name   text        NOT NULL,
  source_favicon text       ,
  category      text        NOT NULL CHECK (category IN (
    'OpenAI', 'Anthropic', 'Google', 'Meta', 'Open Source',
    'Research', 'Startups', 'Tools', 'Policy', 'Industry'
  )),
  visual_type   text        CHECK (visual_type IN ('bar', 'line', 'vs', 'stat')),
  visual_data   jsonb       ,
  image_url     text        ,
  locale        text        NOT NULL DEFAULT 'en',
  status        text        NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'published', 'archived', 'clustered'
  )),
  relevance_score float     ,
  source_hash   text        NOT NULL,
  published_at  timestamptz ,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Primary feed query index
CREATE INDEX IF NOT EXISTS idx_cards_feed
  ON cards (locale, status, published_at DESC);

-- Dedup enforcement
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_source_hash
  ON cards (source_hash);

-- Category filtering
CREATE INDEX IF NOT EXISTS idx_cards_category
  ON cards (category);

-- --------------------------------------------------------------------------
-- 2. card_events — Anonymous analytics
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS card_events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     uuid        NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  event_type  text        NOT NULL CHECK (event_type IN (
    'view', 'share', 'click_source', 'flag'
  )),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_card_events_card
  ON card_events (card_id, created_at DESC);

-- --------------------------------------------------------------------------
-- 3. source_health — Feed health monitoring
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS source_health (
  source_id           text        PRIMARY KEY,
  last_success_at     timestamptz ,
  last_error_at       timestamptz ,
  consecutive_failures int        NOT NULL DEFAULT 0,
  last_http_status    int         ,
  avg_items_per_cycle float       ,
  status              text        NOT NULL DEFAULT 'healthy' CHECK (status IN (
    'healthy', 'degraded', 'down', 'disabled'
  )),
  backoff_until       timestamptz
);

-- --------------------------------------------------------------------------
-- 4. discovered_sources — Auto-discovered content sources
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discovered_sources (
  id                text        PRIMARY KEY,
  name              text        NOT NULL,
  url               text        NOT NULL,
  source_type       text        NOT NULL CHECK (source_type IN ('rss', 'scrape', 'api')),
  tier              int         NOT NULL DEFAULT 3,
  validation_score  int         NOT NULL DEFAULT 0,
  cards_produced    int         NOT NULL DEFAULT 0,
  status            text        NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'disabled', 'rejected'
  )),
  discovered_at     timestamptz NOT NULL DEFAULT now(),
  discovery_method  text        NOT NULL CHECK (discovery_method IN (
    'hn_domain', 'github_awesome', 'producthunt', 'huggingface', 'manual'
  ))
);

-- --------------------------------------------------------------------------
-- 5. discovered_profiles — X profiles from discovery jobs
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discovered_profiles (
  handle          text        PRIMARY KEY,
  display_name    text        ,
  bio             text        ,
  follower_count  int         ,
  discovered_at   timestamptz NOT NULL DEFAULT now(),
  discovery_query text        ,
  times_surfaced  int         NOT NULL DEFAULT 1,
  cards_produced  int         NOT NULL DEFAULT 0,
  status          text        NOT NULL DEFAULT 'discovered' CHECK (status IN (
    'discovered', 'curated', 'rejected'
  )),
  last_checked_at timestamptz
);

-- ==========================================================================
-- Row Level Security
-- ==========================================================================

-- Enable RLS on all tables
ALTER TABLE cards              ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_health      ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_profiles ENABLE ROW LEVEL SECURITY;

-- cards: anon can read published only
CREATE POLICY "cards_public_read" ON cards
  FOR SELECT
  USING (status = 'published');

-- cards: service_role has full access (implicit via bypass RLS)
-- No explicit policy needed — service_role bypasses RLS by default

-- card_events: anon can insert (fire-and-forget analytics)
CREATE POLICY "card_events_public_insert" ON card_events
  FOR INSERT
  WITH CHECK (true);

-- card_events: only service_role can read (for admin dashboard)
CREATE POLICY "card_events_service_read" ON card_events
  FOR SELECT
  USING (auth.role() = 'service_role');

-- source_health: service_role only (no anon access)
CREATE POLICY "source_health_service_all" ON source_health
  FOR ALL
  USING (auth.role() = 'service_role');

-- discovered_sources: service_role only
CREATE POLICY "discovered_sources_service_all" ON discovered_sources
  FOR ALL
  USING (auth.role() = 'service_role');

-- discovered_profiles: service_role only
CREATE POLICY "discovered_profiles_service_all" ON discovered_profiles
  FOR ALL
  USING (auth.role() = 'service_role');
