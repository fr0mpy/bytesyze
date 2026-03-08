import type { HTMLAttributes, Ref } from 'react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'destructive'

export interface AlertRootProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  ref?: Ref<HTMLDivElement>
}

export interface AlertIconProps {
  variant?: AlertVariant
  className?: string
}

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>
}
