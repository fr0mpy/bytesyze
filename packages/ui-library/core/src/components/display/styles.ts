/**
 * Display component styles using namespace pattern.
 * All inline classes from display components are centralized here.
 */

// ============================================================================
// AVATAR STYLES
// ============================================================================

export const AvatarStyles = {
  root: 'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-neu-base shadow-neu-pressed border border-black/5 dark:border-white/10',
  image: 'h-full w-full object-cover',
  fallback: 'font-medium text-muted-foreground',
  fallbackIcon: 'h-1/2 w-1/2 text-muted-foreground',
  sizes: {
    sm: 'h-8 w-8 text-xs shadow-neu-pressed-sm',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  },
} as const

// ============================================================================
// SKELETON STYLES
// ============================================================================

export const SkeletonStyles = {
  base: 'animate-pulse bg-muted shadow-neu-pressed',
  variants: {
    text: 'rounded-theme-md',
    circle: 'rounded-full aspect-square',
    rectangular: 'rounded-theme-lg',
  },
} as const

// ============================================================================
// SEPARATOR STYLES
// ============================================================================

export const SeparatorStyles = {
  base: 'bg-transparent',
  orientations: {
    horizontal: 'h-[2px] w-full shadow-neu-groove-h',
    vertical: 'h-full w-[2px] shadow-neu-groove-v',
  },
} as const

// ============================================================================
// SPINNER STYLES
// ============================================================================

export const SpinnerStyles = {
  container: 'inline-flex items-center justify-center',
  srOnly: 'sr-only',
} as const

// ============================================================================
// PROGRESS STYLES
// ============================================================================

export const ProgressStyles = {
  container: 'flex w-full',
  sizes: {
    sm: 'h-1 gap-0.5',
    md: 'h-2 gap-1',
  },
  indeterminate: {
    track: 'relative flex-1 bg-neu-base shadow-neu-pressed-sm rounded-full overflow-hidden',
    indicator: 'absolute inset-y-0 w-1/3 bg-primary rounded-full shadow-neu-raised-sm',
  },
  segment: {
    base: 'flex-1 rounded-full transition-all duration-200 ease-out',
    filled: 'bg-primary shadow-neu-raised-sm',
    empty: 'bg-neu-base shadow-neu-pressed-sm',
    invertedFilled: 'bg-white',
    invertedEmpty: 'bg-white/30',
  },
} as const

// ============================================================================
// CAROUSEL STYLES
// ============================================================================

export const CarouselStyles = {
  root: 'relative w-full',
  viewport: 'overflow-hidden rounded-theme-lg',
  track: 'flex transition-transform duration-300 ease-in-out',
  slide: 'min-w-full',
  navButton: {
    base: 'absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer min-h-11 min-w-11 rounded-full bg-background/80 p-2 shadow-theme-md backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    prev: 'left-2',
    next: 'right-2',
  },
  navButtonIcon: 'h-5 w-5',
  indicators: {
    container: 'absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10',
    dot: {
      base: 'h-2 w-2 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      active: 'bg-primary w-4',
      inactive: 'bg-background/60 hover:bg-background/80',
    },
  },
} as const

// ============================================================================
// NAMESPACE EXPORT
// ============================================================================

export const DisplayStyles = {
  Avatar: AvatarStyles,
  Skeleton: SkeletonStyles,
  Separator: SeparatorStyles,
  Spinner: SpinnerStyles,
  Progress: ProgressStyles,
  Carousel: CarouselStyles,
} as const
