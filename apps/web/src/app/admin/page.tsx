import Link from 'next/link'
import { Routes } from '@/lib/routes'
import { AdminDashboardStyles as S } from './styles'

const MOCK_STATS = [
  { label: 'Total Cards', value: 127 },
  { label: 'Total Views', value: 4_832 },
  { label: 'Total Shares', value: 312 },
] as const

export default function AdminDashboardPage() {
  return (
    <div className={S.container}>
      <h2 className={S.sectionTitle}>Dashboard</h2>
      <div className={S.statsGrid}>
        {MOCK_STATS.map((stat) => (
          <div key={stat.label} className={S.statCard}>
            <p className={S.statLabel}>{stat.label}</p>
            <p className={S.statValue}>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className={S.linkSection}>
        <Link href={Routes.adminFlagged} className={S.link}>
          View Flagged Cards
        </Link>
      </div>
    </div>
  )
}
