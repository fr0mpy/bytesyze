import type { HTMLAttributes, Ref, ReactNode } from 'react'

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

// ============================================================================
// SLOT PATTERN TYPES
// ============================================================================

export interface CardSlots {
  header?: ReactNode
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
}

export interface CardWithSlotsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  slots?: CardSlots
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}
