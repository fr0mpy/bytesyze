import type { Card } from '@/lib/supabase/types'

export interface CardFeedProps {
  initialCards: Card[]
  initialNextCursor: string | null
}
