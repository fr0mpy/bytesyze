import type { HTMLAttributes, AnchorHTMLAttributes, Ref } from 'react'

export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export interface BreadcrumbListProps extends HTMLAttributes<HTMLOListElement> {
  ref?: Ref<HTMLOListElement>
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>
}

export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
}
