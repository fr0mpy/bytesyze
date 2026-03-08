import { cn } from '@/utils/cn'
import { SeparatorStyles as S } from './styles'

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  ref?: React.Ref<HTMLDivElement>
}

function Separator({ orientation = 'horizontal', className, ref, ...props }: SeparatorProps) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(S.base, S.orientations[orientation], className)}
      {...props}
    />
  )
}

export { Separator }
