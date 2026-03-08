'use client'

import { useMemo } from 'react'

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Anchor = 'start' | 'center' | 'end'

interface PositioningResult {
  /** Tailwind classes for positioning the floating element */
  positionClasses: string
  /** Tailwind class for transform origin */
  originClass: string
  /** Initial offset for animations (Framer Motion) */
  initialOffset: { x?: number; y?: number }
  /** Arrow rotation in degrees */
  arrowRotation: number
  /** Arrow position classes */
  arrowClasses: string
}

const POSITION_MAP: Record<Side, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
}

const ORIGIN_MAP: Record<Side, string> = {
  top: 'origin-bottom',
  right: 'origin-left',
  bottom: 'origin-top',
  left: 'origin-right',
}

const OFFSET_MAP: Record<Side, { x?: number; y?: number }> = {
  top: { y: 4 },
  right: { x: -4 },
  bottom: { y: -4 },
  left: { x: 4 },
}

const ARROW_ROTATION_MAP: Record<Side, number> = {
  top: 180,
  right: -90,
  bottom: 0,
  left: 90,
}

const ARROW_POSITION_MAP: Record<Side, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-[1px]',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-[1px]',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px]',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-[1px]',
}

/**
 * Hook for side-based positioning of floating elements (tooltips, popovers, etc.)
 *
 * @param side - Which side to position the element on
 * @returns Position classes, transform origin, animation offset, and arrow data
 */
export function usePositioning(side: Side): PositioningResult {
  return useMemo(
    () => ({
      positionClasses: POSITION_MAP[side],
      originClass: ORIGIN_MAP[side],
      initialOffset: OFFSET_MAP[side],
      arrowRotation: ARROW_ROTATION_MAP[side],
      arrowClasses: ARROW_POSITION_MAP[side],
    }),
    [side],
  )
}

// Re-export SPRING_CONFIG from centralized config for backward compatibility
export { SPRING_CONFIG } from '../config/motion'
