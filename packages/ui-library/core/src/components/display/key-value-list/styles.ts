/**
 * KeyValueList Styles
 *
 * Left-aligned layout with fixed-width keys for consistent alignment
 */

export const KeyValueListStyles = {
  /** List container */
  container: 'space-y-0',

  /** Individual row */
  row: [
    'flex items-start gap-4',
    'py-2 px-2',
    'border-b border-dashed border-border/30 last:border-b-0',
    'hover:bg-muted/5',
    'transition-colors duration-150',
  ].join(' '),

  /** Row with hover - enables copy button visibility */
  rowHover: 'group',

  /** Key text - shrink-0 prevents wrapping */
  key: 'shrink-0',

  /** Value container - takes remaining space */
  valueContainer: 'flex items-center gap-2 flex-1 min-w-0',

  /** Value text */
  value: 'font-mono truncate',

  /** Copy button (appears on hover) */
  copyButton: [
    'p-1 rounded opacity-0 group-hover:opacity-100',
    'hover:bg-muted/20',
    'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
    'transition-opacity duration-150',
  ].join(' '),

  /** Copy icon */
  copyIcon: 'w-3 h-3 text-muted-foreground',

  /** Copy icon success state */
  copyIconSuccess: 'w-3 h-3 text-success',
} as const
