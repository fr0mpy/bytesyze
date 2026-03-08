import type { Side } from '../../hooks'

export interface PopoverRootProps {
  children: React.ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean
  /** Enable viewport collision detection (default: true) */
  collisionDetection?: boolean
  /** Padding from viewport edges in pixels (default: 8) */
  collisionPadding?: number
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as child element instead of button */
  asChild?: boolean
  children: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

export interface PopoverPortalProps {
  children: React.ReactNode
  /** Container element for the portal */
  container?: HTMLElement
}

export interface PopoverPositionerProps {
  children: React.ReactNode
  /** Which side to position the popover on */
  side?: Side
  className?: string
}

export interface PopoverPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export interface PopoverArrowProps {
  className?: string
}

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as child element instead of button */
  asChild?: boolean
  children?: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

export interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  side: Side
  setSide: (side: Side) => void
  // Collision-aware positioning
  actualSide: Side
  arrowRef: React.RefObject<HTMLElement | null>
  arrowData: { x?: number; y?: number } | null
  setReference: (node: HTMLElement | null) => void
  setFloating: (node: HTMLElement | null) => void
  floatingStyles: React.CSSProperties
}
