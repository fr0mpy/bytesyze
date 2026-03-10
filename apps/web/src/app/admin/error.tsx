'use client'

import { AdminErrorStyles as S } from './styles'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className={S.container} role="alert">
      <h2 className={S.heading}>Something went wrong</h2>
      <p className={S.message}>{error.message}</p>
      <button type="button" onClick={reset} className={S.button}>
        Try again
      </button>
    </div>
  )
}
