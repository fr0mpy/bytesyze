import type { HTMLAttributes, ButtonHTMLAttributes, AnchorHTMLAttributes, Ref } from 'react'

export type ToolbarOrientation = 'horizontal' | 'vertical'

export interface ToolbarRootProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ToolbarOrientation
  ref?: Ref<HTMLDivElement>
}

export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  ref?: Ref<HTMLButtonElement>
}

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface ToolbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>
}
