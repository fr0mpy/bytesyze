import type { Side, Anchor } from '../../hooks'

export interface TooltipRootProps {
  children: React.ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean
  /** Delay before showing tooltip (ms) */
  delayDuration?: number
  /** Enable viewport collision detection (default: true) */
  collisionDetection?: boolean
  /** Padding from viewport edges in pixels (default: 8) */
  collisionPadding?: number
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as child element instead of div wrapper */
  asChild?: boolean
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export interface TooltipPortalProps {
  children: React.ReactNode
  /** Container element for the portal */
  container?: HTMLElement
}

export interface TooltipPositionerProps {
  children: React.ReactNode
  /** Which side to position the tooltip on */
  side?: Side
  /** Alignment along the side edge */
  anchor?: Anchor
  className?: string
}

export interface TooltipPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export interface TooltipArrowProps {
  className?: string
}

export interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  side: Side
  setSide: (side: Side) => void
  anchor: Anchor
  setAnchor: (anchor: Anchor) => void
  // Collision-aware positioning
  actualSide: Side
  actualAnchor: Anchor
  arrowRef: React.RefObject<HTMLElement | null>
  arrowData: { x?: number; y?: number } | null
  setReference: (node: HTMLElement | null) => void
  setFloating: (node: HTMLElement | null) => void
  floatingStyles: React.CSSProperties
}
