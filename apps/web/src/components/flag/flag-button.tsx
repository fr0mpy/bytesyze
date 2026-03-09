'use client'

import { useCallback, useState } from 'react'
import { Flag, Check } from 'lucide-react'
import { useTranslations, flag as flagKeys } from '@bytesyze/i18n'
import { Routes } from '@/lib/routes'
import { FlagButtonStyles as S } from './styles'
import type { FlagButtonProps } from './types'

export function FlagButton({ cardId }: FlagButtonProps) {
  const t = useTranslations()
  const [flagged, setFlagged] = useState(false)

  const handleFlag = useCallback(async () => {
    if (flagged) return

    // eslint-disable-next-line no-alert -- Simple confirmation before flagging; no custom dialog needed
    const confirmed = window.confirm(t(flagKeys.confirm))
    if (!confirmed) return

    try {
      await fetch(Routes.api.events, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          eventType: 'flag',
        }),
      })
      setFlagged(true)
    } catch {
      // Let error boundary handle unexpected errors
    }
  }, [cardId, flagged, t])

  if (flagged) {
    return (
      <span className={S.buttonFlagged}>
        <Check className={S.icon} />
        {t(flagKeys.thanks)}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={S.button}
      aria-label={t(flagKeys.button)}
      onClick={handleFlag}
    >
      <Flag className={S.icon} />
      {t(flagKeys.button)}
    </button>
  )
}
