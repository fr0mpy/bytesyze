import { StackedBarChartStyles as S } from './styles'
import type { ChartTooltipProps } from './types'

/**
 * Neumorphic tooltip for StackedBarChart
 */
export function ChartTooltip({ data, series }: ChartTooltipProps) {
  const { x, y, point, position } = data

  // Filter to only show series with non-zero values
  const nonZeroSeries = series.filter((s) => {
    const value = point[s.key]
    return typeof value === 'number' && value > 0
  })

  if (nonZeroSeries.length === 0) return null

  const total = nonZeroSeries.reduce((sum, s) => {
    const value = point[s.key]
    return sum + (typeof value === 'number' ? value : 0)
  }, 0)

  const transform =
    position === 'above'
      ? 'translate(-50%, -100%) translateY(-8px)'
      : 'translate(-50%, 0%) translateY(8px)'

  return (
    <div
      className={S.tooltip}
      style={{
        left: x,
        top: y,
        transform,
      }}
    >
      <p className={S.tooltipTitle}>{point.label}</p>
      {nonZeroSeries.map((s) => (
        <div key={s.key} className={S.tooltipRow}>
          <span className={S.tooltipDot} style={{ backgroundColor: s.color }} />
          <span className={S.tooltipLabel}>{s.label}:</span>
          <span className={S.tooltipValue}>{point[s.key]}</span>
        </div>
      ))}
      <div className={S.tooltipTotal}>
        <span>Total:</span>
        <span className={S.tooltipValue}>{total}</span>
      </div>
    </div>
  )
}
