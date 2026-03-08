/**
 * DatePicker component styles following zero-inline-classnames pattern.
 * All Tailwind classes are defined here and imported into components.
 */

export const DatePickerStyles = {
  // ==========================================================================
  // Trigger (similar to Select trigger)
  // ==========================================================================
  trigger: {
    base: 'relative flex h-11 items-center justify-between gap-3 rounded-theme-lg bg-neu-base shadow-neu-raised px-4 py-2 text-sm text-foreground cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--shadow-raised),var(--shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50',
    open: 'z-popover',
    width: {
      full: 'w-full',
      auto: 'w-auto',
    },
  },

  // ==========================================================================
  // Value display
  // ==========================================================================
  value: {
    base: 'flex items-center gap-2 truncate',
    placeholder: 'text-muted-foreground',
    icon: 'h-4 w-4 opacity-50 flex-shrink-0',
  },

  // ==========================================================================
  // Backdrop (for modal behavior)
  // ==========================================================================
  backdrop: 'fixed inset-0 z-modal bg-foreground/80 backdrop-blur-sm cursor-pointer',

  // ==========================================================================
  // Popup container (dialog-like)
  // ==========================================================================
  popup: {
    base: 'fixed z-popover rounded-theme-lg border border-border bg-background shadow-theme-xl overflow-hidden',
    positioning: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },

  // ==========================================================================
  // Content layout (with optional presets sidebar)
  // ==========================================================================
  content: {
    base: 'flex flex-col',
    withPresets: 'flex-row',
    main: 'flex flex-col flex-1',
  },

  // ==========================================================================
  // Header
  // ==========================================================================
  header: {
    base: 'flex items-center justify-between px-4 py-3 border-b border-border',
    centered: 'flex items-center justify-center px-4 py-3 border-b border-border',
    title: 'text-sm font-medium',
    closeButton: 'absolute right-4 top-4 h-8 w-8 min-h-8 min-w-8 p-0',
    closeIcon: 'h-4 w-4',
  },

  // ==========================================================================
  // Presets sidebar
  // ==========================================================================
  presets: {
    container: 'w-40 border-r border-border bg-muted/30 p-2 flex flex-col gap-1',
    item: {
      base: 'w-full px-3 py-2 text-sm text-left rounded-theme-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors cursor-pointer',
      active: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
  },

  // ==========================================================================
  // Calendar container
  // ==========================================================================
  calendar: {
    container: 'p-4',
    header: 'flex items-center justify-between mb-4',
    title: {
      base: 'text-sm font-medium cursor-pointer hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary',
    },
    nav: {
      container: 'flex items-center gap-1',
      button: 'h-8 w-8 flex items-center justify-center rounded-theme-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
      icon: 'h-4 w-4',
    },
  },

  // ==========================================================================
  // Calendar grid
  // ==========================================================================
  grid: {
    table: 'w-full border-collapse',
    headerRow: '',
    headerCell: 'h-8 w-8 text-xs font-medium text-muted-foreground text-center',
    bodyRow: '',
    bodyCell: 'p-0',
    // Cell backgrounds for range (creates solid bar)
    // No rounding on cells - the buttons provide the rounded edges visually
    cellRangeMiddle: 'bg-[color-mix(in_srgb,var(--color-primary)_25%,transparent)]',
    cellRangeHover: 'bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]',
  },

  // ==========================================================================
  // Day cell
  // ==========================================================================
  day: {
    base: 'h-8 w-full p-0 text-sm flex items-center justify-center rounded-theme-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer',
    today: 'ring-1 ring-inset ring-primary font-semibold',
    selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outsideMonth: 'text-muted-foreground/50',
    disabled: 'opacity-30 cursor-not-allowed hover:bg-transparent',
    // Range selection states (button styles - cell provides continuous background)
    rangeStart: 'bg-primary text-primary-foreground !rounded-r-none !rounded-l-theme-sm',
    rangeEnd: 'bg-primary text-primary-foreground !rounded-l-none !rounded-r-theme-sm',
    rangeMiddle: '!rounded-none hover:bg-[color-mix(in_srgb,var(--color-primary)_40%,transparent)]',
    rangeHover: '!rounded-none',
  },

  // ==========================================================================
  // Month/Year grid (for view switching)
  // ==========================================================================
  monthYear: {
    grid: 'grid grid-cols-3 gap-2 p-4',
    cell: {
      base: 'h-10 px-2 text-sm flex items-center justify-center rounded-theme-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors cursor-pointer',
      selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
      current: 'border border-primary',
      disabled: 'opacity-30 cursor-not-allowed hover:bg-transparent',
    },
  },

  // ==========================================================================
  // Date input fields
  // ==========================================================================
  input: {
    container: 'flex items-center justify-center gap-2 px-4 py-3 border-t border-border',
    row: 'flex items-center gap-2',
    group: 'flex flex-col gap-1',
    field: 'flex w-full rounded-theme-lg px-3 py-2 bg-neu-base shadow-neu-pressed-sm text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 ease-neu border border-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 w-32 text-center text-sm',
    separator: 'text-muted-foreground text-sm',
    label: 'text-xs text-muted-foreground',
  },

  // ==========================================================================
  // Footer with actions
  // ==========================================================================
  footer: {
    container: 'flex items-center justify-end gap-2 px-4 py-3 border-t border-border',
  },

  // ==========================================================================
  // Screen reader only text
  // ==========================================================================
  srOnly: 'sr-only',

  // ==========================================================================
  // Live region for announcements
  // ==========================================================================
  liveRegion: 'sr-only',
} as const
