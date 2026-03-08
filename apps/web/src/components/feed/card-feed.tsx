'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { useTranslations, feed, aria, card as cardKeys } from '@bytesyze/i18n'
import { Routes } from '@/lib/routes'
import { FeedStyles as S, CategoryColors } from './styles'
import type { CardFeedProps } from './types'

const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000 // 6 hours

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

export function CardFeed({ initialCards, initialNextCursor: _initialNextCursor }: CardFeedProps) {
  const t = useTranslations()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  })

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const allStale = useMemo(() => {
    if (initialCards.length === 0) return false
    const now = Date.now()
    return initialCards.every((c) => {
      const publishedDate = c.published_at ?? c.created_at
      return now - new Date(publishedDate).getTime() > STALE_THRESHOLD_MS
    })
  }, [initialCards])

  const handleRefresh = useCallback(() => {
    window.location.reload()
  }, [])

  if (initialCards.length === 0) {
    return (
      <div className={S.emptyState}>
        <p className={S.emptyText}>{t(feed.empty)}</p>
      </div>
    )
  }

  return (
    <div className={S.container}>
      {allStale && (
        <div className={S.staleBanner} role="status">
          <span>{t(feed.stale)}</span>
          <button
            type="button"
            className={S.staleRefreshButton}
            onClick={handleRefresh}
          >
            {t(feed.refresh)}
          </button>
        </div>
      )}

      <div
        className={S.viewport}
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t(feed.title)}
      >
        <div className={S.slideContainer}>
          {initialCards.map((cardItem, index) => {
            const publishedDate = cardItem.published_at ?? cardItem.created_at
            const timeAgo = getTimeAgo(publishedDate)
            const badgeColor = CategoryColors[cardItem.category]

            return (
              <div
                key={cardItem.id}
                className={S.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${initialCards.length}`}
              >
                <Link
                  href={Routes.card(cardItem.id)}
                  className={S.card}
                >
                  <div className={S.cardHeader}>
                    <span className={`${S.cardBadge} ${badgeColor}`}>
                      {cardItem.category}
                    </span>
                    <time className={S.cardTime} dateTime={publishedDate}>
                      {t(cardKeys.publishedAt, { time: timeAgo })}
                    </time>
                  </div>

                  <div className={S.cardTitleContainer}>
                    <h2 className={S.cardTitle}>{cardItem.title}</h2>
                  </div>

                  <p className={S.cardTeaser}>{cardItem.teaser}</p>

                  <div className={S.cardSourceRow}>
                    <span className={S.cardSourceLabel}>{t(cardKeys.source)}:</span>
                    <span className={S.cardSourceName}>{cardItem.source_name}</span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className={`${S.navButton} ${S.navButtonPrev}`}
        onClick={scrollPrev}
        aria-label={t(aria.previousPage)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        className={`${S.navButton} ${S.navButtonNext}`}
        onClick={scrollNext}
        aria-label={t(aria.nextPage)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
