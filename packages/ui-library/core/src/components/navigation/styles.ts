export const NavigationStyles = {
  root: 'relative z-10 flex items-center justify-center',
  list: 'flex items-center gap-1',
  item: 'relative',
  itemDropdownWrapper: 'flex items-center',
  trigger: 'inline-flex items-center justify-center gap-1 rounded-theme-md px-4 py-3 min-h-11 cursor-pointer text-sm font-medium transition-colors hover:text-primary focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  triggerIcon: 'h-4 w-4',
  content: 'absolute left-0 top-full mt-1 w-auto min-w-[12rem] rounded-theme-md border border-border bg-background shadow-theme-lg glass p-2 origin-top',
  link: 'block rounded-theme-md px-4 py-3 min-h-11 text-sm font-medium cursor-pointer transition-colors hover:text-primary active:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
} as const
