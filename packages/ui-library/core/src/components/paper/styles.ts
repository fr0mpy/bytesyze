export const PaperStyles = {
  root: {
    base: 'rounded-theme-xl bg-neu-base',
    inset: 'rounded-theme-xl bg-neu-base shadow-neu-pressed-sm',
    effects: 'shadow-neu-pressed transition-shadow duration-200 ease-neu',
  },
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'font-heading text-lg font-semibold text-foreground',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0',
} as const
