import type { Card, VisualType } from '@/lib/supabase/types'

export interface CardProps {
  card: Card
  expanded?: boolean
  className?: string
}

export interface CardVisualProps {
  visualType: VisualType
  visualData: Record<string, unknown>
}
