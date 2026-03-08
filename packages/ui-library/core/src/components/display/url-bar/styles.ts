/**
 * UrlBar Styles
 *
 * Horizontal bar displaying a URL with copy/open actions
 */

export const UrlBarStyles = {
  /** Container - neumorphic style with hover visibility for children */
  container: [
    'group',
    'flex items-center gap-3',
    'px-4 py-3',
    'bg-neu-base shadow-neu-raised-sm rounded-lg',
  ].join(' '),

  /** Label text */
  label: 'shrink-0',

  /** URL value - monospace, truncated, copy icon follows immediately */
  value: 'font-mono text-sm truncate',

  /** Actions container */
  actions: 'flex items-center gap-1 shrink-0',

  /** Action button (copy, open) - hidden until hover */
  actionButton: [
    'p-1.5 rounded',
    'opacity-0 group-hover:opacity-100',
    'hover:bg-muted/20',
    'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    'transition-opacity duration-150',
  ].join(' '),

  /** Icon */
  icon: 'w-4 h-4 text-muted-foreground',

  /** Icon success state */
  iconSuccess: 'w-4 h-4 text-success',
} as const
