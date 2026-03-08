import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes, Ref } from 'react'

// ============================================================================
// Shared Types
// ============================================================================

export type MenuAlign = 'start' | 'center' | 'end'

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Menu item content */
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Label text */
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

// ============================================================================
// Menu (Dropdown) Types
// ============================================================================

export interface MenuRootProps {
  /** Menu content (Trigger, Portal, etc.) */
  children: ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean
}

export interface MenuTriggerProps {
  /** Trigger element (button or custom) */
  children: ReactNode
  /** Additional className */
  className?: string
}

export interface MenuPortalProps {
  /** Portal content */
  children: ReactNode
}

export interface MenuPositionerProps {
  /** Alignment of dropdown relative to trigger */
  align?: MenuAlign
  /** Positioner content */
  children: ReactNode
  /** Additional className */
  className?: string
}

export interface MenuPopupProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu items */
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

// ============================================================================
// ContextMenu Types
// ============================================================================

export interface ContextMenuRootProps {
  /** Context menu content (Trigger, Portal, etc.) */
  children: ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

export interface ContextMenuTriggerProps {
  /** Element that triggers context menu on right-click */
  children: ReactNode
  /** Additional className */
  className?: string
}

export interface ContextMenuPortalProps {
  /** Portal content */
  children: ReactNode
}

export interface ContextMenuPositionerProps {
  /** Positioner content */
  children: ReactNode
  /** Additional className */
  className?: string
}

export interface ContextMenuPopupProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu items */
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}
