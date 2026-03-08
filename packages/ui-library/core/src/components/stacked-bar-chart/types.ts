/**
 * StackedBarChart Types
 */

export interface ChartSeries {
  /** Unique key matching data property */
  key: string
  /** CSS color value or variable (e.g., 'var(--color-success)') */
  color: string
  /** Display label for tooltip */
  label: string
}

export interface ChartDataPoint {
  /** X-axis label */
  label: string
  /** Dynamic values keyed by series key */
  [key: string]: string | number
}

export interface TooltipData {
  /** X position for tooltip */
  x: number
  /** Y position for tooltip */
  y: number
  /** Data point being hovered */
  point: ChartDataPoint
  /** Whether tooltip should appear above or below the anchor */
  position: 'above' | 'below'
}

export interface StackedBarChartProps {
  /** Chart data - each point has a label and values for each series */
  data: ChartDataPoint[]
  /** Series configuration - defines colors and labels for each stack */
  series: ChartSeries[]
  /** Chart height in pixels (default: 220) */
  height?: number
  /** Currently hovered label (for external sync) */
  hoveredLabel?: string | null
  /** Callback when hovering a bar */
  onHover?: (label: string | null) => void
  /** Additional CSS classes */
  className?: string
}

export interface ChartTooltipProps {
  /** Tooltip position and data */
  data: TooltipData
  /** Series configuration for labels and colors */
  series: ChartSeries[]
}
