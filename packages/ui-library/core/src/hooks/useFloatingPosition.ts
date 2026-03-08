'use client'

import { useMemo, useRef, useCallback } from 'react'
import {
  useFloating,
  flip,
  shift,
  offset,
  arrow,
  autoUpdate,
  type Placement,
} from '@floating-ui/react-dom'
import type { Side, Anchor } from './usePositioning'

export interface UseFloatingPositionOptions {
  /** Preferred side (will flip if no space) */
  side?: Side
  /** Alignment along the side edge */
  anchor?: Anchor
  /** Gap between trigger and floating element (pixels) */
  gap?: number
  /** Enable collision detection and flipping */
  collisionDetection?: boolean
  /** Padding from viewport edges (pixels) */
  collisionPadding?: number
  /** Whether the floating element is open */
  open?: boolean
}

export interface UseFloatingPositionResult {
  /** Ref setter for the trigger/reference element */
  setReference: (node: HTMLElement | null) => void
  /** Ref setter for the floating element */
  setFloating: (node: HTMLElement | null) => void
  /** Ref for the arrow element */
  arrowRef: React.RefObject<HTMLElement | null>
  /** Styles to apply to floating element */
  floatingStyles: React.CSSProperties
  /** Actual side after collision detection (may differ from preferred) */
  actualSide: Side
  /** Actual alignment after shifting */
  actualAnchor: Anchor
  /** Arrow positioning data */
  arrowData: { x?: number; y?: number } | null
  /** Whether the tooltip was flipped from its preferred side */
  isFlipped: boolean
  /** Update position manually (for edge cases) */
  update: () => void
}

/**
 * Convert our Side/Anchor types to Floating UI Placement
 */
function toPlacement(side: Side, anchor: Anchor): Placement {
  if (anchor === 'center') return side
  return `${side}-${anchor}` as Placement
}

/**
 * Extract Side and Anchor from Floating UI Placement
 */
function fromPlacement(placement: Placement): { side: Side; anchor: Anchor } {
  const parts = placement.split('-')
  const side = parts[0] as Side
  const alignment = parts[1] as 'start' | 'end' | undefined
  const anchor: Anchor = alignment ?? 'center'
  return { side, anchor }
}

/**
 * Hook for viewport-aware positioning of floating elements (tooltips, popovers).
 * Uses @floating-ui/react-dom for collision detection, automatic flipping, and shifting.
 *
 * @param options - Configuration options
 * @returns Positioning state and ref setters
 *
 * @example
 * ```tsx
 * const { setReference, setFloating, floatingStyles, actualSide, arrowRef, arrowData } =
 *   useFloatingPosition({ side: 'top', anchor: 'center', gap: 8 })
 *
 * return (
 *   <>
 *     <button ref={setReference}>Trigger</button>
 *     <div ref={setFloating} style={floatingStyles}>
 *       Content
 *       <span ref={arrowRef} style={{ left: arrowData?.x, top: arrowData?.y }} />
 *     </div>
 *   </>
 * )
 * ```
 */
export function useFloatingPosition({
  side = 'top',
  anchor = 'center',
  gap = 8,
  collisionDetection = true,
  collisionPadding = 8,
  open = true,
}: UseFloatingPositionOptions = {}): UseFloatingPositionResult {
  const arrowRef = useRef<HTMLElement>(null)

  // Build middleware array based on options
  const middleware = useMemo(() => {
    const result = [offset(gap)]

    if (collisionDetection) {
      result.push(
        flip({
          fallbackAxisSideDirection: 'start',
          padding: collisionPadding,
        }),
        shift({
          padding: collisionPadding,
          crossAxis: true,
        }),
      )
    }

    // Arrow middleware always last
    result.push(
      arrow({
        element: arrowRef,
        padding: 8, // Keep arrow from edges
      }),
    )

    return result
  }, [gap, collisionDetection, collisionPadding])

  const { refs, floatingStyles, placement, middlewareData, update } = useFloating({
    placement: toPlacement(side, anchor),
    middleware,
    whileElementsMounted: autoUpdate,
    open,
  })

  // Store refs in a stable ref to avoid dependency on refs object identity
  // (floating-ui's refs object is not referentially stable across renders)
  const refsRef = useRef(refs)
  refsRef.current = refs

  // Extract actual side/anchor after potential flip/shift
  const { side: actualSide, anchor: actualAnchor } = useMemo(
    () => fromPlacement(placement),
    [placement],
  )

  // Check if we flipped from original side
  const isFlipped = actualSide !== side

  // Extract arrow data from middleware
  const arrowData = middlewareData.arrow ?? null

  // Create stable ref setters that don't depend on refs identity
  const setReference = useCallback((node: HTMLElement | null) => {
    refsRef.current.setReference(node)
  }, [])

  const setFloating = useCallback((node: HTMLElement | null) => {
    refsRef.current.setFloating(node)
  }, [])

  return {
    setReference,
    setFloating,
    arrowRef,
    floatingStyles,
    actualSide,
    actualAnchor,
    arrowData,
    isFlipped,
    update,
  }
}
