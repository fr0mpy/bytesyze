import Link from 'next/link'
import { getFlaggedCards } from '@/lib/data/admin'
import { Routes } from '@/lib/routes'
import { AdminFlaggedStyles as S } from '../styles'

export default async function AdminFlaggedPage() {
  const flaggedCards = await getFlaggedCards()

  return (
    <div className={S.container}>
      <h2 className={S.title}>Flagged Cards</h2>

      {flaggedCards.length === 0 ? (
        <div className={S.emptyState}>
          <p className={S.emptyText}>No flagged cards at this time.</p>
        </div>
      ) : (
        <div className={S.cardList}>
          {flaggedCards.map((card) => (
            <div key={card.id} className={S.card}>
              <div className={S.cardHeader}>
                <h3 className={S.cardTitle}>{card.title}</h3>
                <span className={S.flagBadge}>
                  {card.flagCount} {card.flagCount === 1 ? 'flag' : 'flags'}
                </span>
              </div>
              <div className={S.cardMeta}>
                <span>{card.source_name}</span>
                <span>{card.category}</span>
                <span>{new Date(card.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href={Routes.admin} className={S.backLink}>
        Back to Dashboard
      </Link>
    </div>
  )
}
