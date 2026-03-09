// ---------------------------------------------------------------------------
// Pipeline Configuration Constants
// Single source of truth for all tunable values across the pipeline
// ---------------------------------------------------------------------------

import type { CardCategory, VisualType, ScoringWeights } from './types.js'

// ==========================================================================
// General
// ==========================================================================

/** User-Agent string for external API requests */
export const USER_AGENT = 'bytesyze-pipeline/0.0.1'

/** Default request timeout in milliseconds */
export const REQUEST_TIMEOUT_MS = 10_000

/** RSS Accept header */
export const RSS_ACCEPT_HEADER =
  'application/rss+xml, application/atom+xml, application/xml, text/xml'

// ==========================================================================
// Claude Models
// ==========================================================================

/** Claude model IDs */
export const MODELS = {
  summarizer: 'claude-haiku-4-5-20251001',
  validator: 'claude-haiku-4-5-20251001',
} as const

// ==========================================================================
// Summarizer
// ==========================================================================

/** Summarizer batch size for concurrent API calls */
export const SUMMARIZER_BATCH_SIZE = 5

/** Summarizer API parameters */
export const SUMMARIZER_MAX_TOKENS = 800
export const SUMMARIZER_TEMPERATURE = 0.3

// ==========================================================================
// Content Limits (match DB CHECK constraints)
// ==========================================================================

/** Maximum title length (DB constraint: char_length(title) <= 47) */
export const TITLE_MAX_LENGTH = 47

/** Maximum teaser length (DB constraint: char_length(teaser) <= 81) */
export const TEASER_MAX_LENGTH = 81

/** Maximum key point text length */
export const KEY_POINTS_MAX_LENGTH = 120

/** Maximum number of key points per card */
export const KEY_POINTS_MAX_COUNT = 3

// ==========================================================================
// Validation
// ==========================================================================

/** Maximum article age in milliseconds (7 days) */
export const MAX_ARTICLE_AGE_MS = 7 * 24 * 60 * 60 * 1000

/** Minimum description length for article validation */
export const MIN_DESCRIPTION_LENGTH = 50

/** Tier-1 source names that skip LLM borderline validation */
export const TIER_1_SOURCES = new Set([
  'OpenAI Blog',
  'Anthropic Blog',
  'Google AI Blog',
  'DeepMind Blog',
  'arXiv',
])

// ==========================================================================
// Scoring
// ==========================================================================

/** Scoring half-life in ms (12 hours) — recency decay rate */
export const SCORING_HALF_LIFE_MS = 12 * 60 * 60 * 1000

/** Default engagement proxy score when no signal data available */
export const DEFAULT_ENGAGEMENT_PROXY = 0.5

/** Visual richness score for articles without visual data */
export const DEFAULT_VISUAL_SCORE = 0.2

/** Default scoring weights */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  recency: 0.35,
  sourceAuthority: 0.25,
  engagementProxy: 0.2,
  visualRichness: 0.1,
  novelty: 0.1,
}

// ==========================================================================
// Deduplication
// ==========================================================================

/** Default Jaccard similarity threshold for title dedup */
export const DEFAULT_DEDUP_THRESHOLD = 0.7

// ==========================================================================
// Publisher
// ==========================================================================

/** Publisher retry configuration */
export const PUBLISHER_RETRY = {
  maxAttempts: 3,
  baseDelayMs: 1_000,
} as const

// ==========================================================================
// Source Fetch Limits
// ==========================================================================

/** HN API: number of top stories to fetch */
export const HN_MAX_STORIES = 30

/** HN API base URL */
export const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0'

/** arXiv API: max results per query */
export const ARXIV_MAX_RESULTS = 20

/** arXiv API base URL */
export const ARXIV_API_BASE = 'http://export.arxiv.org/api/query'

/** arXiv categories to query */
export const ARXIV_CATEGORIES = ['cs.AI', 'cs.CL', 'cs.LG'] as const

/** GitHub API: repos per page */
export const GITHUB_PER_PAGE = 15

// ==========================================================================
// Source Stubs (disabled until API keys available)
// ==========================================================================

/** Reddit subreddits to monitor */
export const REDDIT_SUBREDDITS = ['MachineLearning', 'LocalLLaMA'] as const

/** X/Twitter curated handles to follow */
export const TWITTER_CURATED_HANDLES = [
  'kaboré', 'karpathy', 'ylecun', 'sama', 'AndrewYNg',
] as const

/** X/Twitter AI search query */
export const TWITTER_AI_SEARCH_QUERY =
  '(AI OR LLM OR "machine learning") -is:retweet lang:en'

// ==========================================================================
// Categories & Visual Types
// ==========================================================================

/** Valid card categories */
export const VALID_CATEGORIES: CardCategory[] = [
  'OpenAI', 'Anthropic', 'Google', 'Meta', 'Open Source',
  'Research', 'Startups', 'Tools', 'Policy', 'Industry',
]

/** Valid visual types (including null for qualitative content) */
export const VALID_VISUAL_TYPES: (VisualType | null)[] = [
  'bar', 'line', 'vs', 'stat', null,
]

/** Category detection keywords (fallback when LLM unavailable) */
export const CATEGORY_KEYWORDS: Array<{ category: CardCategory; keywords: string[] }> = [
  { category: 'OpenAI', keywords: ['openai', 'gpt', 'chatgpt', 'dall-e', 'sora'] },
  { category: 'Anthropic', keywords: ['anthropic', 'claude'] },
  { category: 'Google', keywords: ['google', 'gemini', 'deepmind', 'bard'] },
  { category: 'Meta', keywords: ['meta', 'llama', 'facebook'] },
  { category: 'Open Source', keywords: ['open source', 'open-source', 'hugging face', 'huggingface', 'mistral', 'deepseek'] },
  { category: 'Research', keywords: ['arxiv', 'paper', 'research', 'study', 'findings'] },
  { category: 'Startups', keywords: ['startup', 'funding', 'series', 'raised', 'valuation'] },
  { category: 'Tools', keywords: ['tool', 'ide', 'editor', 'plugin', 'extension', 'cursor', 'copilot'] },
  { category: 'Policy', keywords: ['regulation', 'policy', 'eu', 'act', 'law', 'govern', 'compliance'] },
  { category: 'Industry', keywords: ['enterprise', 'industry', 'market', 'revenue', 'billion', 'adoption'] },
]

// ==========================================================================
// AI Keywords
// ==========================================================================

/** AI-related keywords for content filtering (shared across fetchers and validator) */
export const AI_KEYWORDS = [
  'ai',
  'artificial intelligence',
  'machine learning',
  'deep learning',
  'neural network',
  'neural net',
  'llm',
  'large language model',
  'gpt',
  'claude',
  'gemini',
  'chatbot',
  'generative ai',
  'gen ai',
  'transformer',
  'diffusion model',
  'computer vision',
  'nlp',
  'natural language',
  'reinforcement learning',
  'foundation model',
  'openai',
  'anthropic',
  'deepmind',
  'hugging face',
  'huggingface',
  'stable diffusion',
  'midjourney',
  'copilot',
  'chatgpt',
  'llama',
  'mistral',
  'deepseek',
] as const

/** Check if text contains at least one AI-related keyword */
export function containsAiKeyword(text: string): boolean {
  const lower = text.toLowerCase()
  return AI_KEYWORDS.some((keyword) => lower.includes(keyword))
}
