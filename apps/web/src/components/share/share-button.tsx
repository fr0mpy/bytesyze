'use client'

import { useCallback, useState } from 'react'
import { Share2 } from 'lucide-react'
import { useTranslations, share as shareKeys } from '@bytesyze/i18n'
import { Routes } from '@/lib/routes'
import { ShareMenu } from './share-menu'
import { ShareButtonStyles as S, ShareMenuStyles as MenuS } from './styles'
import type { ShareButtonProps } from './types'

export function ShareButton({ card }: ShareButtonProps) {
  const t = useTranslations()
  const [menuOpen, setMenuOpen] = useState(false)

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return window.location.origin + Routes.card(card.id)
  }, [card.id])

  const handleShare = useCallback(async () => {
    const url = getShareUrl()

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: card.teaser,
          url,
        })

        await fetch(Routes.api.events, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: card.id,
            eventType: 'share',
          }),
        })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setMenuOpen(true)
        }
      }
      return
    }

    setMenuOpen((prev) => !prev)
  }, [card, getShareUrl])

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <div className={MenuS.wrapper}>
      <button
        type="button"
        className={S.button}
        aria-label={t(shareKeys.button)}
        onClick={handleShare}
      >
        <Share2 className={S.icon} />
        {t(shareKeys.button)}
      </button>
      <ShareMenu
        title={card.title}
        url={getShareUrl()}
        open={menuOpen}
        onClose={handleMenuClose}
      />
    </div>
  )
}
