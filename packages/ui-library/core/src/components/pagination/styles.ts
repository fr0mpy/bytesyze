export const PaginationStyles = {
  root: 'mx-auto flex w-full justify-center',
  content: 'flex items-center gap-1',
  item: '',
  link: {
    base: 'inline-flex items-center justify-center min-h-11 min-w-11 h-9 w-9 rounded-theme-lg text-sm font-medium transition-shadow duration-200 cursor-pointer focus-visible:outline-none focus-visible:shadow-neu-focus disabled:pointer-events-none disabled:opacity-50',
    active: 'bg-primary text-primary-foreground shadow-neu-badge-primary',
    inactive: 'bg-transparent text-foreground hover:bg-neu-base hover:shadow-neu-raised-sm hover:text-primary active:shadow-neu-pressed-sm',
  },
  navButton: 'inline-flex items-center justify-center gap-1 h-9 px-3 rounded-theme-lg text-sm font-medium cursor-pointer whitespace-nowrap bg-transparent text-foreground transition-all duration-200 hover:bg-neu-base hover:shadow-neu-raised-sm active:shadow-neu-pressed-sm active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-neu-focus disabled:pointer-events-none disabled:opacity-50',
  ellipsis: 'flex items-center justify-center h-9 w-9',
  ellipsisIcon: 'h-4 w-4',
  srOnly: 'sr-only',
} as const
