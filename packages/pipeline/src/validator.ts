// ---------------------------------------------------------------------------
// Article Validator
// Keyword filter + placeholder AI validation
// ---------------------------------------------------------------------------

import type { RawArticle } from './types.js'

/** AI-related keywords for content filtering */
const AI_KEYWORDS = [
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
]

/** Minimum description length to consider an article valid */
const MIN_DESCRIPTION_LENGTH = 50

/**
 * Check if text contains at least one AI-related keyword.
 */
function containsAiKeyword(text: string): boolean {
  const lower = text.toLowerCase()
  return AI_KEYWORDS.some((keyword) => lower.includes(keyword))
}

/**
 * Placeholder for AI-based validation (e.g., Claude Haiku).
 * In production, this would call the Claude API to verify relevance.
 * For now, returns true for all articles that pass keyword filtering.
 */
function aiValidation(_article: RawArticle): boolean {
  // Placeholder: would call Claude Haiku API here
  return true
}

/**
 * Validate articles for AI relevance and quality.
 *
 * Filters:
 * 1. Description must be at least 50 characters
 * 2. Title or description must contain an AI-related keyword
 * 3. Placeholder AI validation (currently passes all)
 *
 * @returns Array of validated articles
 */
export function validateArticles(articles: RawArticle[]): RawArticle[] {
  const validated: RawArticle[] = []
  let shortCount = 0
  let keywordFailCount = 0

  for (const article of articles) {
    // Check description length
    if (article.description.length < MIN_DESCRIPTION_LENGTH) {
      shortCount++
      continue
    }

    // Check for AI keywords in title + description
    const combinedText = `${article.title} ${article.description}`
    if (!containsAiKeyword(combinedText)) {
      keywordFailCount++
      continue
    }

    // Placeholder AI validation
    if (!aiValidation(article)) {
      continue
    }

    validated.push(article)
  }

  console.log(
    `[validator] ${articles.length} -> ${validated.length} articles ` +
      `(${shortCount} too short, ${keywordFailCount} no AI keywords)`
  )

  return validated
}
