export const TableStyles = {
  wrapper: 'relative w-full overflow-auto',
  table: 'w-full caption-bottom text-sm',
  header: '[&_tr]:border-b',
  body: '[&_tr:last-child]:border-0',
  footer: 'bg-muted/50 font-medium [&>tr]:last:border-b-0',
  row: 'border-b border-border transition-colors hover:bg-muted/50',
  head: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
  cell: 'p-4 align-middle',
  caption: 'mt-4 text-sm text-muted-foreground',
} as const
