import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const tagVariants = cva(
  'inline-flex items-center rounded-theme-md px-2 py-0.5 text-xs font-semibold border',
  {
    variants: {
      variant: {
        success: 'bg-success-muted text-success border-success',
        warning: 'bg-warning-muted text-warning border-warning',
        destructive: 'bg-destructive-muted text-destructive border-destructive',
        info: 'bg-info-muted text-info border-info',
        primary: 'bg-primary-muted text-primary border-primary',
        secondary: 'bg-secondary-muted text-secondary border-secondary',
        accent: 'bg-accent-muted text-accent border-accent',
        muted: 'bg-muted text-muted-foreground border-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'muted',
    },
  },
)

export type TagVariant = VariantProps<typeof tagVariants>['variant']

interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof tagVariants> {
  ref?: React.Ref<HTMLSpanElement>
}

function Tag({ variant, className, children, ref, ...props }: TagProps) {
  return (
    <span
      ref={ref}
      className={cn(tagVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Tag, tagVariants }
