import Link from 'next/link'
import { Routes } from '@/lib/routes'
import { AdminFlaggedStyles as S } from '../styles'

export default function AdminFlaggedPage() {
  return (
    <div className={S.container}>
      <h2 className={S.title}>Flagged Cards</h2>
      <div className={S.emptyState}>
        <p className={S.emptyText}>No flagged cards at this time.</p>
      </div>
      <Link href={Routes.admin} className={S.backLink}>
        Back to Dashboard
      </Link>
    </div>
  )
}
