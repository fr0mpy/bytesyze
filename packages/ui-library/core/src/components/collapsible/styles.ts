export const CollapsibleStyles = {
  root: 'w-full',
  trigger: 'relative flex items-center justify-between w-full group cursor-pointer rounded-theme-md px-2 py-1 bg-transparent transition-all duration-200 hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  /** Indicator bar - neumorphic raised style like Tabs */
  indicator: 'absolute inset-0 rounded-theme-md bg-neu-base shadow-neu-raised-sm',
  /** Trigger content wrapper - sits above indicator */
  triggerContent: 'relative z-10 flex items-center justify-between w-full',
  iconWrapper: 'flex items-center shrink-0 text-muted-foreground group-hover:text-primary transition-[background-color] duration-200 ease-neu',
  icon: 'h-4 w-4',
  contentWrapper: 'overflow-hidden',
  content: 'pt-2',
} as const
