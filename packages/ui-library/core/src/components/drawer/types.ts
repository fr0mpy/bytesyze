import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes, Ref } from 'react'

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  side: DrawerSide
}

export interface DrawerRootProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Side from which the drawer slides in */
  side?: DrawerSide
  children: ReactNode
}

export interface DrawerPortalProps {
  children: ReactNode
}

export interface DrawerBackdropProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>
}

export interface DrawerCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as child element instead of button */
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}
