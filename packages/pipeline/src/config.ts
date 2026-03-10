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

/** Minimum sentence length for mock key point generation */
export const MOCK_MIN_SENTENCE_LENGTH = 15

// ==========================================================================
// Push Notifications
// ==========================================================================

/** Minimum relevance score (0-1) to trigger a push notification */
export const PUSH_SCORE_THRESHOLD = 0.8

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

/** Minimum word length for tokenization (words <= this are filtered) */
export const DEDUP_MIN_WORD_LENGTH = 1

// ==========================================================================
// Publisher
// ==========================================================================

/** Publisher retry configuration */
export const PUBLISHER_RETRY = {
  maxAttempts: 3,
  baseDelayMs: 1_000,
} as const

// ==========================================================================
// OG Image Extraction
// ==========================================================================

/** OG image fetch timeout in milliseconds */
export const OG_IMAGE_TIMEOUT_MS = 5_000

/** Maximum OG image URL length */
export const OG_IMAGE_MAX_URL_LENGTH = 2_048

/** OG image extraction batch size */
export const OG_IMAGE_BATCH_SIZE = 5

/** Maximum HTML length to scan for OG meta tags (bytes) */
export const OG_IMAGE_MAX_HTML_LENGTH = 10_000

// ==========================================================================
// Full-Text Content Fetching
// ==========================================================================

/** Full-text fetch timeout in milliseconds */
export const FULL_TEXT_TIMEOUT_MS = 8_000

/** Maximum full-text content length (chars) */
export const FULL_TEXT_MAX_LENGTH = 5_000

/** Full-text extraction batch size */
export const FULL_TEXT_BATCH_SIZE = 5

/** Minimum description length to skip full-text (RSS already has full content) */
export const FULL_TEXT_SKIP_THRESHOLD = 1_000

/** Minimum extracted text length to be considered valid content */
export const FULL_TEXT_MIN_CONTENT_LENGTH = 200

// ==========================================================================
// Source Health Tracking
// ==========================================================================

/** Consecutive failures before marking source as degraded */
export const SOURCE_HEALTH_DEGRADED_THRESHOLD = 3

/** Consecutive failures before marking source as down */
export const SOURCE_HEALTH_DOWN_THRESHOLD = 5

/** Base backoff time for down sources (30 minutes) */
export const SOURCE_HEALTH_BACKOFF_BASE_MS = 30 * 60 * 1_000

/** Maximum backoff time for down sources (24 hours) */
export const SOURCE_HEALTH_BACKOFF_MAX_MS = 24 * 60 * 60 * 1_000

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

/** arXiv: max authors to display in description */
export const ARXIV_MAX_AUTHORS = 3

/** GitHub API: repos per page */
export const GITHUB_PER_PAGE = 15

// ==========================================================================
// Source Stubs (disabled until API keys available)
// ==========================================================================

/** Reddit subreddits to monitor */
export const REDDIT_SUBREDDITS = ['MachineLearning', 'LocalLLaMA'] as const

/** Reddit API: max posts to fetch per subreddit */
export const REDDIT_MAX_POSTS_PER_SUB = 25

/** Reddit OAuth2 API base URL */
export const REDDIT_API_BASE = 'https://oauth.reddit.com'

/** Reddit OAuth2 token URL */
export const REDDIT_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token'

/** X/Twitter curated handles to follow */
export const TWITTER_CURATED_HANDLES = [
  'karpathy', 'ylecun', 'sama', 'AndrewYNg',
] as const

/** X/Twitter AI search query */
export const TWITTER_AI_SEARCH_QUERY =
  '(AI OR LLM OR "machine learning") -is:retweet lang:en'

/** xAI Grok API base URL (OpenAI-compatible) */
export const GROK_API_BASE = 'https://api.x.ai/v1'

/** Grok model ID */
export const GROK_MODEL = 'grok-3'

/** Grok max tokens for response */
export const GROK_MAX_TOKENS = 2_000

/** Grok API temperature */
export const GROK_TEMPERATURE = 0.1

/** Maximum title length for tweets converted to articles */
export const TWITTER_MAX_TITLE_LENGTH = 100

/** Maximum Reddit post description length */
export const REDDIT_MAX_DESCRIPTION_LENGTH = 500

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
