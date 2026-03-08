import { cn } from '@/utils/cn'
import { ProgressStyles as S } from './styles'
import { DURATION } from '../../config'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  segments?: number
  indeterminate?: boolean
  size?: 'sm' | 'md'
  inverted?: boolean
  ref?: React.Ref<HTMLDivElement>
}

function Progress({ value = 0, max = 100, segments = 10, indeterminate = false, size = 'md', inverted = false, className, ref, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const filledSegments = Math.round((percentage / 100) * segments)

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      className={cn(S.container, S.sizes[size], className)}
      {...props}
    >
      {indeterminate ? (
        <>
          <style>
            {`
              @keyframes progress-wave {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
            `}
          </style>
          <div className={S.indeterminate.track}>
            <div
              className={S.indeterminate.indicator}
              style={{ animation: `progress-wave ${DURATION.progress}s ease-in-out infinite` }}
            />
          </div>
        </>
      )
        : Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              S.segment.base,
              inverted
                ? i < filledSegments ? S.segment.invertedFilled : S.segment.invertedEmpty
                : i < filledSegments ? S.segment.filled : S.segment.empty,
            )}
          />
        ))
      }
    </div>
  )
}

export { Progress }
