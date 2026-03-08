export const ToolbarStyles = {
  root: {
    base: 'flex items-center gap-1 p-1 rounded-theme-lg bg-neu-base shadow-neu-raised',
    vertical: 'flex-col',
  },
  button: {
    base: 'inline-flex items-center justify-center h-9 w-9 rounded-theme-md text-sm font-medium text-foreground cursor-pointer transition-shadow duration-200 focus-visible:outline-none focus-visible:shadow-neu-focus disabled:pointer-events-none disabled:opacity-50',
    active: 'bg-primary/10 shadow-neu-pressed-sm text-primary',
    inactive: 'bg-transparent hover:bg-neu-base hover:shadow-neu-raised-sm hover:text-primary active:shadow-neu-pressed-sm',
  },
  separator: {
    base: 'bg-border',
    horizontal: 'mx-1 h-5 w-px',
    vertical: 'my-1 h-px w-5',
  },
  group: {
    base: 'flex items-center gap-0.5',
    vertical: 'flex-col',
  },
  link: 'inline-flex items-center justify-center h-9 px-3 rounded-theme-md text-sm font-medium text-foreground cursor-pointer transition-shadow duration-200 hover:bg-neu-base hover:shadow-neu-raised-sm hover:text-primary focus-visible:outline-none focus-visible:shadow-neu-focus',
} as const
