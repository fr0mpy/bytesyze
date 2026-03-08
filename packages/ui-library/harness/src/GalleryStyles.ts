/**
 * Gallery layout styles - responsive patterns for the component harness.
 * Uses raw Tailwind classes for IntelliSense support.
 */

export const GalleryStyles = {
  /** Main container - full viewport height with modern units */
  container: 'min-h-[100dvh] flex bg-background overflow-hidden',

  /** Sidebar - hidden on mobile, visible on md+ */
  sidebar: {
    /** Desktop sidebar container */
    desktop: 'hidden md:flex w-64 md:flex-col border-r border-border bg-neu-base flex-shrink-0 overflow-hidden',

    /** Mobile menu trigger button */
    mobileTrigger: 'fixed bottom-4 right-4 z-50 md:hidden',

    /** Sidebar scroll area - Lenis handles overflow */
    scrollArea: 'h-full p-4',

    /** Sidebar header row */
    headerRow: 'flex items-center justify-between mb-4',

    /** Sidebar title */
    title: 'font-heading text-lg font-semibold text-foreground',

    /** Drawer header row (different padding) */
    drawerHeaderRow: 'flex items-center justify-between mb-4 px-2',
  },

  /** Main content area */
  main: 'flex-1 min-w-0 overflow-y-auto bg-background',

  /** Scrollable content wrapper - responsive padding */
  scrollArea: 'h-full p-4 md:p-6 lg:p-8',

  /** Header section */
  header: {
    /** Responsive section margin */
    wrapper: 'mb-4 md:mb-6 lg:mb-8',
    /** Row that contains title and mobile theme toggle */
    row: 'flex items-start justify-between',
    /** Responsive heading size */
    title: 'text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 text-foreground',
    subtitle: 'text-muted-foreground',
    /** Mobile-only container for theme toggle */
    mobileOnly: 'md:hidden',
  },

  /** Navigation controls - stack on mobile, row on tablet+ */
  navControls: {
    /** Adaptive stack + responsive margin */
    wrapper: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6 lg:mb-8',
    /** Previous/Next buttons with hidden text on mobile */
    buttonText: 'sr-only md:not-sr-only',
    /** Responsive component title */
    title: 'text-xl md:text-2xl font-heading font-semibold text-foreground',
  },

  /** Sidebar navigation - vertical spacing */
  nav: 'space-y-1',

  /** Component preview panel - responsive padding */
  preview: 'rounded-theme-2xl bg-neu-base shadow-neu-raised p-4 md:p-6 lg:p-8',

  /** Component info footer */
  info: {
    wrapper: [
      'mt-4 md:mt-6',
      'p-3 md:p-4',
      'rounded-theme-lg bg-neu-base shadow-neu-raised-sm',
    ].join(' '),
    text: 'text-sm text-muted-foreground',
  },

  /** Skeleton loading state */
  skeleton: {
    container: 'animate-pulse space-y-4',
    title: 'h-8 bg-muted rounded-theme-md w-1/3',
    content: 'h-32 bg-muted rounded-theme-lg',
  },

  /** Sidebar navigation link - touch-friendly */
  navLink: {
    base: [
      'block w-full text-left',
      'px-3 py-3 min-h-11', // 44px touch target
      'rounded-theme-md text-sm font-medium transition-colors',
    ].join(' '),
    active: 'bg-primary text-primary-foreground shadow-neu-raised-sm',
    inactive: 'text-foreground hover:bg-muted',
  },
} as const
