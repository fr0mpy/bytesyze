'use client'

import { lazy, Suspense } from 'react'
import { ButtonStatic } from './button-static'
import type { ButtonVariant, ButtonSize, ButtonProps } from './button-types'

// Lazy load animated version only when loading prop is used
const ButtonAnimated = lazy(() =>
  import('./button-animated').then((mod) => ({ default: mod.ButtonAnimated })),
)

/**
 * Smart Button component that lazy loads motion/react only when needed.
 * - Without `loading` prop: Uses ButtonStatic (no motion dependency)
 * - With `loading` prop: Lazy loads ButtonAnimated with motion animations
 */
function Button({ loading, loadingText, ...props }: ButtonProps) {
  // Only load motion when loading feature is actually used
  if (loading !== undefined) {
    return (
      <Suspense fallback={<ButtonStatic {...props} />}>
        <ButtonAnimated loading={loading} loadingText={loadingText} {...props} />
      </Suspense>
    )
  }
  return <ButtonStatic {...props} />
}

export { Button }
export { ButtonStyles } from './styles'
export type { ButtonVariant, ButtonSize, ButtonProps }
