export const FlagButtonStyles = {
  button: [
    'inline-flex items-center gap-1.5',
    'rounded-full px-3 py-2',
    'text-sm font-medium',
    'text-zinc-500 dark:text-zinc-400',
    'hover:text-red-600 dark:hover:text-red-400',
    'hover:bg-zinc-100 dark:hover:bg-zinc-800',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
    'dark:focus-visible:ring-offset-zinc-900',
  ].join(' '),
  buttonFlagged: [
    'inline-flex items-center gap-1.5',
    'rounded-full px-3 py-2',
    'text-sm font-medium',
    'text-green-600 dark:text-green-400',
    'cursor-default',
  ].join(' '),
  icon: 'h-4 w-4',
} as const
