import { cn } from '@/utils/cn'
import { TableStyles as S } from './styles'
import { ScrollArea } from '../display/scroll-area'
import type {
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from './types'

function TableRoot({ className, ref, ...props }: TableRootProps) {
  return (
    <ScrollArea
      className={S.wrapper}
      options={{ orientation: 'horizontal' }}
    >
      <table
        ref={ref}
        className={cn(S.table, className)}
        {...props}
      />
    </ScrollArea>
  )
}

function TableHeader({ className, ref, ...props }: TableHeaderProps) {
  return (
    <thead ref={ref} className={cn(S.header, className)} {...props} />
  )
}

function TableBody({ className, ref, ...props }: TableBodyProps) {
  return (
    <tbody
      ref={ref}
      className={cn(S.body, className)}
      {...props}
    />
  )
}

function TableFooter({ className, ref, ...props }: TableFooterProps) {
  return (
    <tfoot
      ref={ref}
      className={cn(S.footer, className)}
      {...props}
    />
  )
}

function TableRow({ className, ref, ...props }: TableRowProps) {
  return (
    <tr
      ref={ref}
      className={cn(S.row, className)}
      {...props}
    />
  )
}

function TableHead({ className, ref, ...props }: TableHeadProps) {
  return (
    <th
      ref={ref}
      className={cn(S.head, className)}
      {...props}
    />
  )
}

function TableCell({ className, ref, ...props }: TableCellProps) {
  return (
    <td
      ref={ref}
      className={cn(S.cell, className)}
      {...props}
    />
  )
}

function TableCaption({ className, ref, ...props }: TableCaptionProps) {
  return (
    <caption
      ref={ref}
      className={cn(S.caption, className)}
      {...props}
    />
  )
}

// Namespace Export (callable as Root + namespace)
export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
})

// Individual exports for backward compatibility
export {
  TableRoot,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
