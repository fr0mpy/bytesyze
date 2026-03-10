'use client'

import { useEffect } from 'react'
import { useTranslations, error as errorKeys } from '@bytesyze/i18n'
import { CardErrorStyles as S } from './error-styles'

export default function CardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div role="alert" className={S.container}>
      <h2 className={S.heading}>{t(errorKeys.title)}</h2>
      <p className={S.description}>{t(errorKeys.description)}</p>
      <button type="button" onClick={reset} className={S.button}>
        {t(errorKeys.tryAgain)}
      </button>
    </div>
  )
}
