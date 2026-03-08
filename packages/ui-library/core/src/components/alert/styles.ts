export const AlertStyles = {
  base: 'relative w-full rounded-theme-lg border p-4 flex items-start gap-3',
  variants: {
    info: 'bg-info text-info-foreground shadow-neu-badge-info border-transparent',
    success: 'bg-success text-success-foreground shadow-neu-badge-success border-transparent',
    warning: 'bg-warning text-warning-foreground shadow-neu-badge-warning border-transparent',
    destructive: 'bg-destructive text-destructive-foreground shadow-neu-badge-destructive border-transparent',
  },
  icon: 'h-5 w-5 flex-shrink-0',
  title: 'mb-1 font-medium leading-none tracking-tight',
  description: 'text-sm opacity-90',
} as const
