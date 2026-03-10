import { describe, it, expect } from 'vitest'
import { generateSourceHash } from '../summarizer.js'

describe('generateSourceHash', () => {
  it('produces deterministic hash for same URL', () => {
    const hash1 = generateSourceHash('https://example.com/article')
    const hash2 = generateSourceHash('https://example.com/article')
    expect(hash1).toBe(hash2)
  })

  it('produces different hashes for different URLs', () => {
    const hash1 = generateSourceHash('https://example.com/article-1')
    const hash2 = generateSourceHash('https://example.com/article-2')
    expect(hash1).not.toBe(hash2)
  })

  it('starts with sha256- prefix', () => {
    const hash = generateSourceHash('https://example.com')
    expect(hash).toMatch(/^sha256-[0-9a-f]{12}$/)
  })

  it('has consistent length (sha256- + 12 hex chars)', () => {
    const hash = generateSourceHash('https://example.com/very/long/path/to/article')
    expect(hash).toHaveLength(19) // "sha256-" (7) + 12 hex chars
  })
})
