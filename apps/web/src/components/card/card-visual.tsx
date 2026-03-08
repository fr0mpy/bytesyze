import { VisualStyles as S } from './styles'
import type { CardVisualProps } from './types'

interface BarItem {
  label: string
  value: number
}

interface VsData {
  left: { label: string; value: string }
  right: { label: string; value: string }
}

interface StatData {
  value: string
  label: string
}

function isBarItems(data: unknown): data is BarItem[] {
  return Array.isArray(data)
    && data.length > 0
    && typeof data[0] === 'object'
    && data[0] !== null
    && 'label' in data[0]
    && 'value' in data[0]
}

function isVsData(data: unknown): data is VsData {
  return typeof data === 'object'
    && data !== null
    && 'left' in data
    && 'right' in data
}

function isStatData(data: unknown): data is StatData {
  return typeof data === 'object'
    && data !== null
    && 'value' in data
    && 'label' in data
}

function BarVisual({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map((item) => item.value))

  return (
    <div className={S.barContainer}>
      {items.map((item) => {
        const widthPercent = max > 0 ? item.value / max * 100 : 0
        return (
          <div key={item.label} className={S.barRow}>
            <span className={S.barLabel}>{item.label}</span>
            <div className={S.barTrack}>
              <div
                className={S.barFill}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            <span className={S.barValue}>{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatVisual({ data }: { data: StatData }) {
  return (
    <div>
      <p className={S.statValue}>{data.value}</p>
      <p className={S.statLabel}>{data.label}</p>
    </div>
  )
}

function VsVisual({ data }: { data: VsData }) {
  return (
    <div className={S.vsContainer}>
      <div className={S.vsColumn}>
        <span className={S.vsLabel}>{data.left.label}</span>
        <span className={S.vsValue}>{data.left.value}</span>
      </div>
      <div className={S.vsColumn}>
        <span className={S.vsLabel}>{data.right.label}</span>
        <span className={S.vsValue}>{data.right.value}</span>
      </div>
    </div>
  )
}

function LineVisual() {
  return <div className={S.linePlaceholder} role="img" aria-hidden="true" />
}

export function CardVisual({ visualType, visualData }: CardVisualProps) {
  const items = visualData.items ?? visualData.data

  return (
    <div className={S.container}>
      {visualType === 'bar' && isBarItems(items) && <BarVisual items={items} />}
      {visualType === 'stat' && isStatData(visualData) && <StatVisual data={visualData as StatData} />}
      {visualType === 'vs' && isVsData(visualData) && <VsVisual data={visualData as VsData} />}
      {visualType === 'line' && <LineVisual />}
    </div>
  )
}
