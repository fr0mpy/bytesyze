'use client'

import { type ReactNode, useRef, useEffect } from 'react'
import Lenis from 'lenis'
import { SCROLL } from '../../config'

interface ScrollAreaProps {
  children: ReactNode
  className?: string
  /** Lenis configuration options */
  options?: {
    /** Scroll lerp (linear interpolation) - lower = smoother, higher = snappier. Default: 0.1 */
    lerp?: number
    /** Scroll duration in seconds. Default: 1.2 */
    duration?: number
    /** Scroll easing function */
    easing?: (t: number) => number
    /** Scroll orientation: 'vertical' | 'horizontal'. Default: 'vertical' */
    orientation?: 'vertical' | 'horizontal'
    /** Enable smooth scroll. Default: true */
    smoothWheel?: boolean
    /** Multiplier for wheel delta. Default: 1 */
    wheelMultiplier?: number
    /** Multiplier for touch delta. Default: 2 */
    touchMultiplier?: number
  }
}

/**
 * ScrollArea wrapper using Lenis for buttery smooth scrolling.
 * Creates a custom scrollable container (not window scroll).
 *
 * @example
 * ```tsx
 * <ScrollArea className="h-full overflow-y-auto">
 *   <nav>Long content...</nav>
 * </ScrollArea>
 * ```
 */
function ScrollArea({ children, className, options = {} }: ScrollAreaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      lerp: options.lerp ?? SCROLL.lerp,
      duration: options.duration ?? SCROLL.duration,
      smoothWheel: options.smoothWheel ?? true,
      wheelMultiplier: options.wheelMultiplier ?? SCROLL.wheelMultiplier,
      touchMultiplier: options.touchMultiplier ?? SCROLL.touchMultiplier,
      orientation: options.orientation ?? 'vertical',
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [options])

  return (
    <div ref={wrapperRef} className={className} style={{ overflow: 'hidden' }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

export { ScrollArea }
export type { ScrollAreaProps }
