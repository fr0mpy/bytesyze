import { AdminLoadingStyles as S } from './styles'

export default function AdminLoading() {
  return (
    <div className={S.container}>
      <div className={S.statsGrid}>
        <div className={S.skeleton} />
        <div className={S.skeleton} />
        <div className={S.skeleton} />
      </div>
      <div className={S.skeletonWide} />
    </div>
  )
}
