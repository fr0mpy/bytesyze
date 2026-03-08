import type { HTMLAttributes, ButtonHTMLAttributes, Ref } from 'react'

export interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether only one item can be open at a time */
  type?: 'single' | 'multiple'
  /** Default open item(s) */
  defaultValue?: string | string[]
  /** Controlled open item(s) */
  value?: string | string[]
  /** Callback when open items change */
  onValueChange?: (value: string[]) => void
  ref?: Ref<HTMLDivElement>
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this item */
  value: string
  ref?: Ref<HTMLDivElement>
}

export interface AccordionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The value of the accordion item this trigger controls */
  value: string
  ref?: Ref<HTMLButtonElement>
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  /** The value of the accordion item this content belongs to */
  value: string
  ref?: Ref<HTMLDivElement>
}
