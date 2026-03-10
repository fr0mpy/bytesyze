import { Suspense } from 'react'
import { getCards } from '@/lib/data/cards'
import { CardFeed } from './card-feed'
import { CategoryFilter } from './category-filter'
import type { CardCategory } from '@/lib/supabase/types'

interface CardFeedServerProps {
  category?: CardCategory
}

export async function CardFeedServer({ category }: CardFeedServerProps) {
  const { cards, nextCursor } = await getCards({ category })

  return (
    <>
      <Suspense>
        <CategoryFilter activeCategory={category ?? null} />
      </Suspense>
      <CardFeed initialCards={cards} initialNextCursor={nextCursor} />
    </>
  )
}
