/**
 * StackedBarChart Styles
 *
 * Neumorphic chart styling matching the design system.
 */

export const StackedBarChartStyles = {
  // Container - flex-1 fills available space, min-w-0 allows shrinking
  container: 'relative flex-1 w-full min-w-0',

  // SVG - fills container completely, block removes inline spacing
  svg: 'w-full block',

  // X-axis labels (HTML, not SVG - immune to SVG scaling)
  xAxis: 'relative w-full h-5',
  xAxisLabel: 'absolute text-[11px] text-muted-foreground -translate-x-1/2',

  // Neumorphic Tooltip
  tooltip: 'absolute pointer-events-none z-10 bg-surface rounded-xl p-4 shadow-neu-raised border border-border/50',
  tooltipTitle: 'text-sm font-semibold mb-3 text-foreground',
  tooltipRow: 'flex items-center gap-2 text-sm mb-1',
  tooltipDot: 'w-3 h-3 rounded-full shadow-neu-pressed-sm',
  tooltipLabel: 'text-muted-foreground',
  tooltipValue: 'font-semibold text-foreground ml-auto',
  tooltipTotal: 'flex items-center gap-2 text-sm mt-2 pt-2 border-t border-border font-medium text-foreground',
} as const

/**
 * SVG-specific styles (inline, not Tailwind)
 */
export const SvgStyles = {
  axisText: {
    fontSize: 11,
    fill: 'var(--color-muted-foreground)',
    fontFamily: 'inherit',
  },
  bar: {},
} as const
