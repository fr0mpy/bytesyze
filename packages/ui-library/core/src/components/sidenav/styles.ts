export const SideNavStyles = {
  root: {
    base: 'fixed left-0 top-0 h-full z-40 flex flex-col rounded-theme-xl bg-neu-base shadow-neu-pressed-sm rounded-l-none overflow-hidden',
  },
  header: {
    base: 'flex flex-col p-4 gap-1 border-b border-border/50',
    logo: 'flex items-center gap-3 min-h-[40px]',
    title: 'text-xl font-bold text-primary whitespace-nowrap overflow-hidden',
    subtitle: 'text-sm text-muted-foreground whitespace-nowrap overflow-hidden',
  },
  nav: {
    base: 'flex-1 flex flex-col p-2 gap-1 overflow-y-auto overflow-x-hidden',
  },
  item: {
    base: 'flex items-center justify-start gap-3 p-3 h-12 rounded-theme-md cursor-pointer transition-[background-color] duration-200 ease-neu text-foreground whitespace-nowrap overflow-hidden',
    icon: 'h-5 w-5 flex-shrink-0',
    label: 'flex-1 text-left',
    active: 'bg-primary text-primary-foreground',
    inactive: 'hover:bg-neu-base hover:shadow-neu-raised-sm hover:text-primary',
  },
  footer: {
    base: 'mt-auto p-4 border-t border-border/50',
  },
} as const

export const SIDENAV_DIMENSIONS = {
  collapsed: 64,
  expanded: 220,
} as const
