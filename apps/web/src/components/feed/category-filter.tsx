'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Routes } from '@/lib/routes'
import type { CardCategory } from '@/lib/supabase/types'
import { CategoryFilterStyles as S } from './category-filter-styles'

const CATEGORIES: CardCategory[] = [
  'OpenAI', 'Anthropic', 'Google', 'Meta', 'Open Source',
  'Research', 'Startups', 'Tools', 'Policy', 'Industry',
]

interface CategoryFilterProps {
  activeCategory: CardCategory | null
}

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = useCallback(
    (category: CardCategory | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (category) {
        params.set('category', category)
      } else {
        params.delete('category')
      }

      const query = params.toString()
      router.push(query ? `${Routes.home}?${query}` : Routes.home)
    },
    [router, searchParams],
  )

  return (
    <nav className={S.container} aria-label="Filter by category">
      <div className={S.scrollArea}>
        <button
          type="button"
          className={activeCategory === null ? S.chipActive : S.chip}
          onClick={() => handleSelect(null)}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={activeCategory === cat ? S.chipActive : S.chip}
            onClick={() => handleSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  )
}
