export const AccordionStyles = {
  root: 'w-full',
  item: 'mb-2 rounded-theme-lg bg-neu-base shadow-neu-raised-sm',
  header: 'flex',
  trigger: 'flex items-center justify-between w-full px-4 py-4 font-medium cursor-pointer rounded-theme-lg hover:text-primary transition-colors duration-neu ease-neu focus-visible:outline-none focus-visible:shadow-neu-focus',
  iconWrapper: 'flex items-center justify-center',
  icon: 'h-4 w-4 shrink-0',
  contentWrapper: 'overflow-hidden',
  content: 'px-4 pb-4 pt-0 text-sm text-muted-foreground',
} as const
