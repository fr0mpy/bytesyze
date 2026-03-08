import { getCards } from '@/lib/data/cards'
import { CardFeed } from './card-feed'

export async function CardFeedServer() {
  const { cards, nextCursor } = await getCards()

  return <CardFeed initialCards={cards} initialNextCursor={nextCursor} />
}
