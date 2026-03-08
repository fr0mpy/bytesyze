/**
 * Text component styles following zero-inline-classnames pattern.
 * Headings (h1-h4) use responsive sizing by default.
 */
export const TextStyles = {
  variants: {
    // Responsive headings (auto-scale on breakpoints)
    h1: 'text-2xl md:text-3xl lg:text-4xl font-bold leading-tight font-heading',
    h2: 'text-xl md:text-2xl lg:text-3xl font-semibold leading-tight font-heading',
    h3: 'text-lg md:text-xl lg:text-2xl font-semibold leading-snug font-heading',
    h4: 'text-base md:text-lg lg:text-xl font-semibold leading-snug font-heading',

    // Fixed-size headings
    h5: 'text-lg font-medium leading-normal font-heading',
    h6: 'text-base font-medium leading-normal font-heading',

    // Body text
    lead: 'text-lg md:text-xl leading-relaxed font-body',
    body1: 'text-base leading-relaxed font-body',
    body2: 'text-sm leading-relaxed font-body',
    subtitle: 'text-sm font-medium leading-normal',
    caption: 'text-xs leading-normal',
    overline: 'text-xs font-medium tracking-wide uppercase',

    // Utility variants
    code: 'text-sm font-mono bg-muted px-1.5 py-0.5 rounded',
    kbd: 'text-xs font-mono font-medium px-1.5 py-0.5 bg-muted border border-border rounded shadow-sm',
  },

  colors: {
    foreground: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    destructive: 'text-destructive',
    success: 'text-success',
  },

  weights: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },

  aligns: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  },

  modifiers: {
    truncate: 'truncate',
    italic: 'italic',
    underline: 'underline',
  },

  lineClamps: {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
  },
} as const
