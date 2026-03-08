import { PageSkeletonStyles as S } from './styles'

export function PageSkeleton() {
  return (
    <div className={S.container}>
      <div className={S.titleBar} />
      <div className={S.contentBlock} />
      <div className={S.row} />
      <div className={S.rowShort} />
      <div className={S.contentBlockSmall} />
    </div>
  )
}
