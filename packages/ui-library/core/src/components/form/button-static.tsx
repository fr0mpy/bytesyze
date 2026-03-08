'use client'

import { isValidElement, cloneElement } from 'react'
import { cn } from '@/utils/cn'
import { ButtonStyles as S } from './styles'
import type {
  ButtonVariant,
  ButtonSize,
  ButtonBaseProps,
} from './button-types'

export type { ButtonVariant, ButtonSize }

export function ButtonStatic({
  variant = 'primary',
  size = 'md',
  iconOnly,
  disabled,
  className,
  children,
  asChild,
  ref,
  ...props
}: ButtonBaseProps) {
  const sizeStyles = iconOnly ? S.iconOnly[size] : S.sizes[size]
  const buttonClassName = cn(
    S.base,
    sizeStyles,
    S.variants[variant],
    className,
  )

  // When asChild is true, clone the child element with button styles and accessibility attrs
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        className: cn(
          buttonClassName,
          (children as React.ReactElement<{ className?: string }>).props
            .className,
        ),
        'aria-disabled': disabled,
      },
    )
  }

  return (
    <button
      type="button"
      ref={ref}
      className={buttonClassName}
      disabled={disabled}
      {...props}
    >
      <span className={S.content}>{children}</span>
    </button>
  )
}
