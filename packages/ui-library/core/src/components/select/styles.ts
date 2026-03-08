export const SelectStyles = {
  trigger: {
    base: [
      'relative flex h-11 items-center justify-between gap-3 rounded-theme-lg', // h-11 = 44px WCAG touch target
      'bg-neu-base shadow-neu-raised px-4 py-2 text-sm text-foreground cursor-pointer',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-raised),var(--shadow-focus)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' '),
    ghost: [
      'relative flex h-11 items-center gap-1 rounded-theme-lg', // h-11 = 44px WCAG touch target
      'bg-transparent px-2 py-2 text-sm font-medium text-foreground cursor-pointer',
      'hover:bg-muted/20 transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' '),
    open: 'z-popover',
    width: {
      full: 'w-full',
      auto: 'w-auto',
    },
  },
  value: {
    placeholder: 'text-muted-foreground',
  },
  icon: {
    base: 'h-4 w-4 opacity-50',
    primary: 'h-4 w-4 text-primary',
  },
  positioner: {
    base: 'z-dropdown',
    inModal: 'z-popover',
  },
  popup: 'rounded-theme-md bg-neu-base shadow-neu-raised-lg',
  search: {
    wrapper: 'p-2 pt-4 border-b border-border/30',
    input: 'h-9',
  },
  optionsWrapper: 'flex flex-col gap-2 p-2',
  option: {
    base: [
      'relative flex w-full cursor-pointer select-none items-center rounded-theme-sm',
      'px-3 py-3 min-h-11', // Touch-friendly: 44px minimum height for WCAG 2.5.8
      'text-sm outline-none transition-colors',
      'hover:bg-muted focus-visible:bg-muted',
      'active:bg-muted/80', // Touch feedback
    ].join(' '),
    selected: 'bg-primary text-primary-foreground hover:bg-primary',
    disabled: 'opacity-50 cursor-not-allowed hover:bg-transparent',
  },
} as const
