import type { HTMLAttributes, ButtonHTMLAttributes, Ref } from 'react'

export interface PaginationRootProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export interface PaginationContentProps extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>
}

export interface PaginationItemProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>
}

export interface PaginationLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  ref?: Ref<HTMLButtonElement>
}

export interface PaginationPreviousProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export interface PaginationNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
}
