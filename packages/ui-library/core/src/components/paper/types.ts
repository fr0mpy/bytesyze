import type { HTMLAttributes, Ref } from 'react'

export interface PaperRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Depth of the inward press effect */
  depth?: 'sm' | 'md'
  ref?: Ref<HTMLDivElement>
}

export interface PaperHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface PaperTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>
}

export interface PaperDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>
}

export interface PaperContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface PaperFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}
