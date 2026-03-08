import { getTranslations, card as cardKeys } from '@bytesyze/i18n'
import { CardVisual } from './card-visual'
import { CardStyles as S, CategoryColors } from './styles'
import type { CardProps } from './types'

function getTimeAgo(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then

  const minutes = Math.floor(diffMs / 60_000)
  const hours = Math.floor(diffMs / 3_600_000)
  const days = Math.floor(diffMs / 86_400_000)

  if (minutes < 1) return '<1m'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

export async function NewsCard({ card, expanded = false, className }: CardProps) {
  const t = await getTranslations()
  const publishedDate = card.published_at ?? card.created_at
  const timeAgo = getTimeAgo(publishedDate)
  const badgeColor = CategoryColors[card.category]

  return (
    <article className={className ? `${S.container} ${className}` : S.container}>
      <div className={S.header}>
        <span className={`${S.badge} ${badgeColor}`}>
          {card.category}
        </span>
        <time className={S.time} dateTime={publishedDate}>
          {t(cardKeys.publishedAt, { time: timeAgo })}
        </time>
      </div>

      <div className={S.titleContainer}>
        <h2 className={S.title}>{card.title}</h2>
      </div>

      <div className={S.sourceRow}>
        <span className={S.sourceLabel}>{t(cardKeys.source)}:</span>
        <span className={S.sourceName}>{card.source_name}</span>
      </div>

      {expanded && (
        <div className={S.expandedSection}>
          <p className={S.teaser}>{card.teaser}</p>

          {card.key_points.length > 0 && (
            <div>
              <h3 className={S.keyPointsHeading}>{t(cardKeys.keyPoints)}</h3>
              <ul className={S.keyPointsList}>
                {card.key_points.map((point) => (
                  <li key={point} className={S.keyPoint}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {card.visual_type && card.visual_data && (
            <div className={S.visualContainer}>
              <CardVisual
                visualType={card.visual_type}
                visualData={card.visual_data}
              />
            </div>
          )}

          <a
            href={card.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className={S.readMoreLink}
          >
            {t(cardKeys.readMore)}
          </a>
        </div>
      )}
    </article>
  )
}
