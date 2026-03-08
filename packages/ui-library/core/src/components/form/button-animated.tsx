'use client'

import { useState, useEffect, isValidElement, cloneElement } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils/cn'
import { ButtonStyles as S } from './styles'
import { LOADING, DURATION, LABEL } from '../../config'
import { Progress } from '../display/progress'
import type { ButtonProps } from './button-types'

/**
 * Animated button with loading state support.
 * Includes motion/react dependency (~30KB).
 * Use ButtonStatic when loading is not needed.
 */
export function ButtonAnimated({
  variant = 'primary',
  size = 'md',
  iconOnly,
  loading,
  loadingText = LABEL.loading,
  disabled,
  className,
  children,
  asChild,
  ref,
  ...props
}: ButtonProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!loading) {
      setLoadingProgress(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingProgress((prev) => (prev >= LOADING.segments ? 0 : prev + 1))
    }, LOADING.intervalMs)
    return () => clearInterval(interval)
  }, [loading])

  const sizeStyles = iconOnly ? S.iconOnly[size] : S.sizes[size]
  const buttonClassName = cn(
    S.base,
    sizeStyles,
    S.variants[variant],
    loading && S.loading,
    className,
  )

  // When asChild is true, clone the child element with button styles and accessibility attrs
  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      className: cn(buttonClassName, (children as React.ReactElement<{ className?: string }>).props.className),
      'aria-busy': loading,
      'aria-disabled': disabled || loading,
    })
  }

  return (
    <button
      type="button"
      ref={ref}
      className={buttonClassName}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className={S.loadingContent}
          >
            <span className={S.loadingText}>{loadingText}</span>
            <Progress value={loadingProgress} max={LOADING.segments} segments={LOADING.segments} size="sm" inverted />
          </motion.div>
        ) : (
          <motion.span
            key="content"
            className={S.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
