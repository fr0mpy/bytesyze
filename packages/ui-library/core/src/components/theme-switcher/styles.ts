export const ThemeSwitcherStyles = {
  /** Toggle button - width animated via JS */
  button: 'relative h-8 rounded-full cursor-pointer bg-neu-base shadow-neu-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden',

  knob: 'absolute top-1 left-1 w-6 h-6 rounded-full cursor-pointer bg-neu-base shadow-neu-raised flex items-center justify-center',

  iconContainer: 'relative h-4 w-4 cursor-pointer',

  iconWrapper: 'absolute inset-0 flex items-center justify-center cursor-pointer',

  icon: {
    moon: 'h-4 w-4 text-indigo-400',
    sun: 'h-4 w-4 text-amber-500',
  },

  trackIndicators: 'absolute inset-0 flex items-center justify-between px-2 pointer-events-none',

  trackIcon: 'h-3 w-3 text-foreground',
} as const
