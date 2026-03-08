import type { HTMLAttributes, ButtonHTMLAttributes, AnchorHTMLAttributes, Ref } from 'react'

export interface NavigationRootProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export interface NavigationListProps extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>
}

export interface NavigationItemProps extends HTMLAttributes<HTMLLIElement> {
  hasDropdown?: boolean
  ref?: Ref<HTMLLIElement>
}

export interface NavigationTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export interface NavigationContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface NavigationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>
}
