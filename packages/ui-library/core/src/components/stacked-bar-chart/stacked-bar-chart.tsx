'use client'

import { useState, useRef } from 'react'
import { ChartTooltip } from './chart-tooltip'
import { StackedBarChartStyles as S, SvgStyles } from './styles'
import { cn } from '../../utils'
import type { StackedBarChartProps, TooltipData, ChartDataPoint } from './types'

// Chart dimensions (viewBox coordinates)
const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 250
const MARGIN = { top: 20, right: 20, bottom: 10, left: 35 }
const CHART_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right
const CHART_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom

/**
 * Calculate nice Y-axis ticks
 */
function calculateYTicks(maxValue: number): number[] {
  if (maxValue <= 0) return [0]
  if (maxValue <= 4) return Array.from({ length: maxValue + 1 }, (_, i) => i)
  if (maxValue <= 10) return [0, Math.ceil(maxValue / 2), maxValue]
  const step = Math.ceil(maxValue / 4)
  return [0, step, step * 2, step * 3, maxValue]
}

/**
 * Get total value for a data point across all series
 */
function getTotal(point: ChartDataPoint, seriesKeys: string[]): number {
  return seriesKeys.reduce((sum, key) => {
    const value = point[key]
    return sum + (typeof value === 'number' ? value : 0)
  }, 0)
}

/**
 * A performant, responsive stacked bar chart using pure SVG.
 *
 * Uses viewBox for automatic scaling - no resize observers needed.
 * The chart scales smoothly with its container via CSS.
 */
export function StackedBarChart({
  data,
  series,
  height = 220,
  hoveredLabel,
  onHover,
  className,
}: StackedBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)

  const seriesKeys = series.map((s) => s.key)

  // Calculate max value for Y scale
  const maxValue = Math.ceil(Math.max(...data.map((d) => getTotal(d, seriesKeys)), 1))
  const yTicks = calculateYTicks(maxValue)

  // Scale functions
  const slotWidth = CHART_WIDTH / data.length
  const barWidth = Math.max(slotWidth * 0.6, 4) // 60% of slot, min 4px
  const barOffset = (slotWidth - barWidth) / 2

  const xScale = (index: number) => MARGIN.left + index * slotWidth
  const yScale = (value: number) => MARGIN.top + CHART_HEIGHT - (value / maxValue) * CHART_HEIGHT

  // Determine which X labels to show (avoid overlap)
  const labelInterval =
    data.length <= 10 ? 1 : data.length <= 20 ? 2 : data.length <= 40 ? 4 : Math.ceil(data.length / 10)

  // Handle bar hover
  const handleBarEnter = (point: ChartDataPoint, index: number) => {
    onHover?.(point.label)

    // Calculate tooltip position in pixel coordinates
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const svgX = xScale(index) + barOffset + barWidth / 2
    const pixelX = (svgX / VIEW_WIDTH) * containerRect.width

    // Position tooltip above the bar stack
    const total = getTotal(point, seriesKeys)
    const barTopY = yScale(total)
    const pixelY = (barTopY / VIEW_HEIGHT) * containerRect.height

    // Calculate absolute Y position in viewport to check if tooltip would clip
    const absoluteY = containerRect.top + pixelY
    const tooltipHeight = 120 // Approximate tooltip height
    const padding = 8

    // If not enough space above (in viewport), show below
    const position = absoluteY - tooltipHeight - padding < 0 ? 'below' : 'above'

    setTooltipData({
      x: pixelX,
      y: pixelY,
      point,
      position,
    })
  }

  const handleBarLeave = () => {
    onHover?.(null)
    setTooltipData(null)
  }

  return (
    <div ref={containerRef} className={cn(S.container, className)} style={{ height }}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        className={S.svg}
        style={{ height: height - 20 }}
        aria-hidden="true"
        role="presentation"
      >
        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={tick}
            x={MARGIN.left - 8}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            style={SvgStyles.axisText}
          >
            {tick}
          </text>
        ))}

        {/* Bars */}
        {data.map((point, index) => {
          const isHovered = hoveredLabel === point.label
          const x = xScale(index) + barOffset
          let currentY = yScale(0) // Start from bottom

          return (
            <g key={point.label}>
              {/* Stacked bars (rendered first, bottom layer) */}
              {series.map((s) => {
                const value = point[s.key]
                if (typeof value !== 'number' || value <= 0) return null

                const barHeight = (value / maxValue) * CHART_HEIGHT
                const barY = currentY - barHeight
                currentY = barY // Move up for next segment

                return (
                  <rect
                    key={s.key}
                    x={x}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={s.color}
                    opacity={isHovered ? 1 : 0.5}
                    style={{ ...SvgStyles.bar, pointerEvents: 'none' }}
                  />
                )
              })}

              {/* Invisible hit area (rendered last, top layer for event capture) */}
              <rect
                x={xScale(index)}
                y={MARGIN.top}
                width={slotWidth}
                height={CHART_HEIGHT}
                fill="transparent"
                onMouseEnter={() => handleBarEnter(point, index)}
                onMouseLeave={handleBarLeave}
              />
            </g>
          )
        })}

      </svg>

      {/* HTML X-axis labels - immune to SVG scaling */}
      <div className={S.xAxis}>
        {data.map((point, index) => {
          if (index % labelInterval !== 0) return null

          // Calculate percentage position matching bar center
          const centerX = MARGIN.left + (index + 0.5) * slotWidth
          const leftPercent = (centerX / VIEW_WIDTH) * 100

          return (
            <span
              key={point.label}
              className={S.xAxisLabel}
              style={{ left: `${leftPercent}%` }}
            >
              {point.label}
            </span>
          )
        })}
      </div>

      {/* Tooltip */}
      {tooltipData && <ChartTooltip data={tooltipData} series={series} />}
    </div>
  )
}
