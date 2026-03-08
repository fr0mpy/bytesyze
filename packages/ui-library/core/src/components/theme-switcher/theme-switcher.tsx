'use client'

import { useRef, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { ThemeSwitcherStyles as S } from './styles'
import { THEME_TIMING, OFFSET, SPRING, OPACITY, ARIA, DURATION } from '../../config'
import { cn } from '../../utils'
import type { ThemeSwitcherProps } from './types'

/** Width: compact fits knob + padding, full allows knob to slide */
const SWITCHER_WIDTH = { compact: 32, full: 56 } as const

/** Smooth transition for layout-driven changes (no bounce) */
const LAYOUT_TRANSITION = { type: 'tween', duration: DURATION.fast, ease: 'easeOut' } as const

export function ThemeSwitcher({
  isDark,
  onToggle,
  compact = false,
  className,
  // Destructure conflicting Framer Motion props
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: ThemeSwitcherProps) {
  // Track if toggle was user-initiated (should bounce) vs layout change (no bounce)
  const wasUserToggle = useRef(false)
  const prevIsDark = useRef(isDark)

  // Detect theme changes (user toggle) vs compact changes (layout)
  useEffect(() => {
    if (prevIsDark.current !== isDark) {
      wasUserToggle.current = true
      prevIsDark.current = isDark
    }
  }, [isDark])

  // Reset after animation completes
  const handleAnimationComplete = () => {
    wasUserToggle.current = false
  }

  // Knob position: centered when compact, left/right based on theme when expanded
  const knobX = compact ? 0 : isDark ? OFFSET.knob : 0

  // Bounce only on user toggle, smooth transition on layout changes
  const knobTransition = wasUserToggle.current ? SPRING.snappy : LAYOUT_TRANSITION

  // Initial width matches animate to prevent mount animation (no "grow into position")
  const targetWidth = compact ? SWITCHER_WIDTH.compact : SWITCHER_WIDTH.full

  return (
    <motion.button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? ARIA.switchToLight : ARIA.switchToDark}
      onClick={onToggle}
      className={cn(S.button, className)}
      initial={{ width: targetWidth }}
      animate={{ width: targetWidth }}
      transition={SPRING.default}
      {...props}
    >
      {/* Knob with icon - always visible, animates to center when compact */}
      <motion.span
        className={S.knob}
        animate={{ x: knobX }}
        transition={knobTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        <span className={S.iconContainer}>
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span
                key="moon"
                className={S.iconWrapper}
                initial={{ y: -OFFSET.icon, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    y: {
                      duration: THEME_TIMING.iconEntry,
                      delay: THEME_TIMING.iconEntryDelay,
                      ease: 'easeOut',
                    },
                    opacity: {
                      duration: THEME_TIMING.iconEntry * 0.6,
                      delay: THEME_TIMING.iconEntryDelay + 0.05,
                    },
                  },
                }}
                exit={{
                  y: -OFFSET.icon,
                  opacity: 0,
                  transition: {
                    y: { duration: THEME_TIMING.iconExit, ease: 'easeIn' },
                    opacity: { duration: THEME_TIMING.iconExit * 0.8 },
                  },
                }}
              >
                <Moon className={S.icon.moon} />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                className={S.iconWrapper}
                initial={{ y: OFFSET.icon, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    y: {
                      duration: THEME_TIMING.iconEntry,
                      delay: THEME_TIMING.iconEntryDelay,
                      ease: 'easeOut',
                    },
                    opacity: {
                      duration: THEME_TIMING.iconEntry * 0.6,
                      delay: THEME_TIMING.iconEntryDelay + 0.05,
                    },
                  },
                }}
                exit={{
                  y: OFFSET.icon,
                  opacity: 0,
                  transition: {
                    y: { duration: THEME_TIMING.iconExit, ease: 'easeIn' },
                    opacity: { duration: THEME_TIMING.iconExit * 0.8 },
                  },
                }}
              >
                <Sun className={S.icon.sun} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.span>

      {/* Track indicators - fade based on compact prop */}
      <motion.span
        className={S.trackIndicators}
        animate={{ opacity: compact ? 0 : 1 }}
        transition={{ duration: DURATION.fast }}
      >
        <motion.span
          animate={{ opacity: isDark ? OPACITY.highlight : 0 }}
          transition={{ duration: DURATION.slow }}
        >
          <Sun className={S.trackIcon} />
        </motion.span>
        <motion.span
          animate={{ opacity: isDark ? 0 : OPACITY.highlight }}
          transition={{ duration: DURATION.slow }}
        >
          <Moon className={S.trackIcon} />
        </motion.span>
      </motion.span>
    </motion.button>
  )
}
