import type { HTMLAttributes, ButtonHTMLAttributes, Ref } from 'react'

export interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  layoutId: string
  registerTab: (value: string) => void
  unregisterTab: (value: string) => void
  getSpring: () => { type: 'spring'; stiffness: number; damping: number }
}

export interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Default active tab value */
  defaultValue: string
  /** Controlled active tab value */
  value?: string
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void
  ref?: Ref<HTMLDivElement>
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique identifier for this tab */
  value: string
  ref?: Ref<HTMLButtonElement>
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  /** The value of the tab this content belongs to */
  value: string
  /** Keep content mounted when tab is not active */
  forceMount?: boolean
  ref?: Ref<HTMLDivElement>
}

export interface TabsIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
}
