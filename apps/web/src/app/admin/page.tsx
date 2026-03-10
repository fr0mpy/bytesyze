import Link from 'next/link'
import { Routes } from '@/lib/routes'
import { getAdminStats, getCardsByCategory, getSourceHealth } from '@/lib/data/admin'
import { AdminDashboardStyles as S, getStatusBadgeClass } from './styles'

export default async function AdminDashboardPage() {
  const [stats, categories, sourceHealth] = await Promise.all([
    getAdminStats(),
    getCardsByCategory(),
    getSourceHealth(),
  ])

  const statItems = [
    { label: 'Total Cards', value: stats.totalCards },
    { label: 'Total Views', value: stats.totalViews },
    { label: 'Total Shares', value: stats.totalShares },
    { label: 'Flagged Cards', value: stats.totalFlags },
  ]

  return (
    <div className={S.container}>
      <h2 className={S.sectionTitle}>Dashboard</h2>

      <div className={S.statsGrid}>
        {statItems.map((stat) => (
          <div key={stat.label} className={S.statCard}>
            <p className={S.statLabel}>{stat.label}</p>
            <p className={S.statValue}>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {categories.length > 0 && (
        <div>
          <h3 className={S.sectionTitle}>Cards by Category</h3>
          <div className={S.statsGrid}>
            {categories.map((cat) => (
              <div key={cat.category} className={S.statCard}>
                <p className={S.statLabel}>{cat.category}</p>
                <p className={S.statValue}>{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sourceHealth.length > 0 && (
        <div>
          <h3 className={S.sectionTitle}>Source Health</h3>
          <div className={S.tableWrapper}>
            <table className={S.table}>
              <thead>
                <tr>
                  <th className={S.tableHeader}>Source</th>
                  <th className={S.tableHeader}>Status</th>
                  <th className={S.tableHeader}>Failures</th>
                  <th className={S.tableHeader}>Last Success</th>
                </tr>
              </thead>
              <tbody>
                {sourceHealth.map((source) => (
                  <tr key={source.source_id} className={S.tableRow}>
                    <td className={S.tableCell}>{source.source_name}</td>
                    <td className={S.tableCell}>
                      <span className={getStatusBadgeClass(source.status)}>
                        {source.status}
                      </span>
                    </td>
                    <td className={S.tableCell}>{source.consecutive_failures}</td>
                    <td className={S.tableCell}>
                      {source.last_success_at
                        ? new Date(source.last_success_at).toLocaleString()
                        : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={S.linkSection}>
        <Link href={Routes.adminFlagged} className={S.link}>
          View Flagged Cards
        </Link>
      </div>
    </div>
  )
}
