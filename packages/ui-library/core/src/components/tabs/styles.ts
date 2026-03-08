export const TabsStyles = {
  root: 'w-full',
  list: 'relative inline-flex items-center justify-center h-10 rounded-theme-lg bg-neu-base shadow-neu-pressed-sm p-1 text-muted-foreground',
  trigger: {
    base: 'relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-theme-md px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors duration-neu ease-neu focus-visible:outline-none focus-visible:shadow-neu-focus disabled:pointer-events-none disabled:opacity-50',
    active: 'text-primary',
    inactive: 'text-muted-foreground hover:text-foreground',
  },
  indicator: 'absolute inset-0 rounded-theme-md bg-neu-base shadow-neu-raised-sm',
  triggerLabel: 'relative z-10',
  content: {
    base: 'mt-2 focus-visible:outline-none',
    hidden: 'hidden',
  },
} as const
