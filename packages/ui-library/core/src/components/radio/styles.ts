export const RadioStyles = {
  group: {
    base: 'flex',
    vertical: 'flex-col gap-2',
    horizontal: 'flex-row gap-4',
  },
  item: {
    wrapper: 'flex items-center gap-3',
    inputWrapper: 'relative',
    input: 'sr-only peer',
    label: {
      base: [
        'relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full',
        'bg-neu-base shadow-neu-pressed-sm',
        'transition-shadow duration-200',
        'peer-focus-visible:shadow-[var(--shadow-pressed-sm),var(--shadow-focus)]',
      ].join(' '),
      disabled: 'cursor-not-allowed opacity-50',
    },
    textLabel: {
      base: 'text-sm font-medium text-foreground cursor-pointer select-none',
      disabled: 'cursor-not-allowed opacity-50',
    },
  },
  indicator: 'absolute h-3 w-3 rounded-full bg-primary shadow-neu-radio-indicator',
} as const
