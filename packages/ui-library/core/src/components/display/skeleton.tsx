import { cn } from '@/utils/cn'
import { SkeletonStyles as S } from './styles'

type SkeletonVariant = 'text' | 'circle' | 'rectangular'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  ref?: React.Ref<HTMLDivElement>
}

function Skeleton({ className, variant = 'text', ref, ...props }: SkeletonProps) {
  return (
    <div
      ref={ref}
      className={cn(S.base, S.variants[variant], className)}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps, SkeletonVariant }
