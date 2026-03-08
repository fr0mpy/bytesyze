/**
 * Form component styles - zero inline classnames pattern.
 * All form components import from this central styles file.
 */

// ============================================================================
// BUTTON STYLES
// ============================================================================

export const ButtonStyles = {
  /** Base styles for all buttons */
  base: 'inline-flex items-center justify-center gap-1 font-medium cursor-pointer transition-[background-color] duration-200 ease-neu outline-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',

  /** Loading state modifier */
  loading: 'flex-col py-1.5 disabled:opacity-100',

  /** Loading content wrapper */
  loadingContent: 'flex flex-col items-center gap-1 w-full px-2',

  /** Loading text */
  loadingText: 'text-xs font-semibold tracking-wide',

  /** Content wrapper for children */
  content: 'inline-flex items-center justify-center gap-1',

  /** Size variants - sleek modern heights with subtle rounding */
  sizes: {
    sm: 'h-8 px-3 text-sm rounded-theme-md',
    md: 'h-9 px-4 text-sm rounded-theme-md',
    lg: 'h-10 px-5 text-sm rounded-theme-md',
  },

  /** Icon-only button sizes (circular) */
  iconOnly: {
    sm: 'h-8 w-8 p-0 rounded-full',
    md: 'h-9 w-9 p-0 rounded-full',
    lg: 'h-10 w-10 p-0 rounded-full',
  },

  /** Icon sizing within buttons */
  icon: {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  },

  /** Variant styles */
  variants: {
    primary: 'bg-primary text-primary-foreground shadow-neu-variant-primary hover:bg-primary-hover hover:shadow-neu-raised-lg active:shadow-neu-pressed-sm focus-visible:shadow-[var(--shadow-variant-primary),var(--shadow-focus)]',
    secondary: 'bg-secondary text-secondary-foreground shadow-neu-variant-secondary hover:bg-secondary-hover hover:shadow-neu-raised-lg active:shadow-neu-pressed-sm focus-visible:shadow-[var(--shadow-variant-secondary),var(--shadow-focus)]',
    text: 'bg-transparent text-foreground hover:text-primary active:opacity-80 focus-visible:shadow-neu-focus',
    ghost: 'bg-transparent text-foreground hover:bg-neu-base hover:shadow-neu-raised-sm hover:text-primary active:shadow-neu-pressed-sm focus-visible:shadow-neu-focus',
    outline: 'bg-neu-base text-foreground shadow-neu-raised hover:shadow-neu-raised-lg active:shadow-neu-pressed-sm focus-visible:shadow-[var(--shadow-raised),var(--shadow-focus)]',
    destructive: 'bg-destructive text-destructive-foreground shadow-neu-variant-destructive hover:bg-destructive-hover hover:shadow-neu-raised-lg active:shadow-neu-pressed-sm focus-visible:shadow-[var(--shadow-variant-destructive),var(--shadow-focus)]',
    inset: 'bg-neu-base text-foreground shadow-neu-pressed-sm rounded-full hover:shadow-neu-raised active:shadow-neu-pressed-sm focus-visible:shadow-[var(--shadow-raised),var(--shadow-focus)]',
  },
} as const

// ============================================================================
// CHECKBOX STYLES
// ============================================================================

export const CheckboxStyles = {
  /** Container wrapper */
  container: 'flex items-center gap-2',

  /** Checkbox input - 16px visual size with expanded touch area for WCAG 2.5.8 compliance */
  input: 'h-4 w-4 relative before:absolute before:-inset-3.5 before:content-[""] rounded-theme-sm cursor-pointer appearance-none bg-neu-base border border-border transition-all duration-200 shadow-neu-control-unchecked focus-visible:outline-none focus-visible:shadow-[var(--shadow-pressed-sm),var(--shadow-focus)] checked:bg-primary checked:shadow-neu-control-checked disabled:cursor-not-allowed disabled:opacity-50',

  /** Label text */
  label: 'text-sm font-medium text-foreground cursor-pointer select-none',
} as const

// ============================================================================
// SWITCH STYLES
// ============================================================================

export const SwitchStyles = {
  /** Container wrapper */
  container: 'flex items-center gap-2',

  /** Track base */
  track: {
    base: 'relative inline-flex group h-5 w-10 cursor-pointer items-center rounded-full transition-all duration-200',
    uncheckedBorder: 'border border-border hover:border-primary hover:shadow-[inset_-2px_-2px_4px_rgba(0,175,102,0.15),inset_2px_2px_5px_rgba(0,100,60,0.25)]',
    disabled: 'cursor-not-allowed opacity-50',
  },

  /** Hidden input */
  input: 'sr-only peer',

  /** Thumb (knob) */
  thumb: {
    base: 'inline-block h-4 w-4 transform rounded-full shadow-neu-raised-sm transition-all duration-200',
    checked: 'translate-x-5 bg-white',
    unchecked: 'translate-x-0.5 bg-foreground dark:bg-white group-hover:bg-primary',
  },

  /** Track states */
  checked: 'bg-primary shadow-neu-control-checked',
  unchecked: 'shadow-neu-control-unchecked',

  /** Label text */
  label: 'text-sm font-medium text-foreground cursor-pointer select-none',
} as const

// ============================================================================
// SLIDER STYLES
// ============================================================================

export const SliderStyles = {
  /** Container wrapper */
  container: 'relative w-full py-2',

  /** Track background */
  trackBg: 'relative h-2 w-full overflow-hidden rounded-full bg-neu-base shadow-neu-pressed-sm',

  /** Fill indicator */
  fill: 'absolute h-full w-full origin-left bg-primary',

  /** Range input */
  input: 'absolute left-0 right-0 top-1/2 -translate-y-1/2 h-5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:w-0 [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:border-0 focus-visible:outline-none',
} as const

// ============================================================================
// INPUT STYLES (for CVA integration)
// ============================================================================

export const InputStyles = {
  /** Container wrapper */
  container: 'w-full',

  /** Input wrapper (relative for icons, group for hover states) */
  wrapper: 'relative w-full group',

  /** Disabled compound variants */
  disabledErrorBorder: 'border-destructive/50',
  disabledSuccessBorder: 'border-success/50',
} as const

// ============================================================================
// TEXTAREA STYLES
// ============================================================================

export const TextareaStyles = {
  base: 'flex w-full rounded-theme-lg px-3 py-2 bg-neu-base shadow-neu-pressed-sm text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 ease-neu border border-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y',
  interactive: 'hover:shadow-neu-pressed hover:border-primary focus:shadow-neu-pressed focus:border-primary',
  error: 'border-destructive',
  success: 'border-success',
} as const

// ============================================================================
// NUMBER INPUT STYLES
// ============================================================================

export const NumberInputStyles = {
  /** Container wrapper */
  container: 'w-full',

  /** Input wrapper with flexbox */
  wrapper: 'relative flex items-center',
} as const
