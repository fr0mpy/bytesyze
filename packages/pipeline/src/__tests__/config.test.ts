import { describe, it, expect } from 'vitest'
import { containsAiKeyword } from '../config.js'

describe('containsAiKeyword', () => {
  it('detects "AI" keyword', () => {
    expect(containsAiKeyword('New AI breakthrough announced')).toBe(true)
  })

  it('detects "machine learning"', () => {
    expect(containsAiKeyword('Advances in machine learning')).toBe(true)
  })

  it('detects brand names', () => {
    expect(containsAiKeyword('OpenAI releases new model')).toBe(true)
    expect(containsAiKeyword('Anthropic Claude update')).toBe(true)
    expect(containsAiKeyword('Google Gemini 2.0 launched')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(containsAiKeyword('MACHINE LEARNING MODELS')).toBe(true)
    expect(containsAiKeyword('chatGPT is popular')).toBe(true)
  })

  it('returns false for non-AI content', () => {
    expect(containsAiKeyword('Best recipes for summer')).toBe(false)
    expect(containsAiKeyword('Stock market update today')).toBe(false)
  })

  it('detects LLM and related terms', () => {
    expect(containsAiKeyword('New LLM benchmark results')).toBe(true)
    expect(containsAiKeyword('Foundation model training')).toBe(true)
    expect(containsAiKeyword('Transformer architecture paper')).toBe(true)
  })

  it('handles empty string', () => {
    expect(containsAiKeyword('')).toBe(false)
  })
})
