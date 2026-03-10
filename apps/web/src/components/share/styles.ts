export const ShareButtonStyles = {
  button: [
    'inline-flex items-center gap-1.5',
    'rounded-full px-4 py-2',
    'text-sm font-medium',
    'bg-blue-600 text-white',
    'hover:bg-blue-700 active:bg-blue-800',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus-visible:ring-offset-zinc-900',
  ].join(' '),
  icon: 'h-4 w-4',
} as const

export const ShareMenuStyles = {
  overlay: 'fixed inset-0 z-40',
  container: [
    'absolute right-0 bottom-full mb-2 z-50',
    'w-56 rounded-xl py-1',
    'bg-white dark:bg-zinc-800',
    'border border-zinc-200 dark:border-zinc-700',
    'shadow-lg',
  ].join(' '),
  wrapper: 'relative inline-block',
  item: [
    'flex w-full items-center gap-3 px-4 py-2.5',
    'text-sm text-zinc-700 dark:text-zinc-200',
    'hover:bg-zinc-100 dark:hover:bg-zinc-700',
    'transition-colors duration-100',
  ].join(' '),
  itemIcon: 'h-4 w-4 shrink-0',
  copiedText: [
    'flex w-full items-center gap-3 px-4 py-2.5',
    'text-sm font-medium text-green-600 dark:text-green-400',
  ].join(' '),
} as const
