export const PageSkeletonStyles = {
  container: [
    'flex flex-col gap-4',
    'w-full max-w-2xl mx-auto',
    'p-4',
  ].join(' '),
  titleBar: 'h-8 w-48 rounded-md bg-muted animate-pulse',
  contentBlock: 'h-32 w-full rounded-lg bg-muted animate-pulse',
  contentBlockSmall: 'h-20 w-full rounded-lg bg-muted animate-pulse',
  row: 'h-4 w-3/4 rounded bg-muted animate-pulse',
  rowShort: 'h-4 w-1/2 rounded bg-muted animate-pulse',
} as const
