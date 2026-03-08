import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-theme-md px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-neu-badge-primary',
        secondary: 'bg-secondary text-secondary-foreground shadow-neu-badge-secondary',
        destructive: 'bg-destructive text-destructive-foreground shadow-neu-badge-destructive',
        success: 'bg-success text-success-foreground shadow-neu-badge-success',
        warning: 'bg-warning text-warning-foreground shadow-neu-badge-warning',
        info: 'bg-info text-info-foreground shadow-neu-badge-info',
        outline: 'bg-neu-base text-foreground shadow-neu-raised-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  ref?: React.Ref<HTMLSpanElement>
}

function Badge({ variant, className, children, ref, ...props }: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
