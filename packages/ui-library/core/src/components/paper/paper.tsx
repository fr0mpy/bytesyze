import { cn } from '@/utils/cn'
import { PaperStyles as S } from './styles'
import type {
  PaperRootProps,
  PaperHeaderProps,
  PaperTitleProps,
  PaperDescriptionProps,
  PaperContentProps,
  PaperFooterProps,
} from './types'

function PaperRoot({ className, children, depth = 'md', ref, ...props }: PaperRootProps) {
  return (
    <div
      ref={ref}
      className={cn(
        depth === 'sm' ? S.root.inset : S.root.base,
        S.root.effects,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function PaperHeader({ className, children, ref, ...props }: PaperHeaderProps) {
  return (
    <div
      ref={ref}
      className={cn(S.header, className)}
      {...props}
    >
      {children}
    </div>
  )
}

function PaperTitle({ className, children, ref, ...props }: PaperTitleProps) {
  return (
    <h3
      ref={ref}
      className={cn(S.title, className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function PaperDescription({ className, children, ref, ...props }: PaperDescriptionProps) {
  return (
    <p
      ref={ref}
      className={cn(S.description, className)}
      {...props}
    >
      {children}
    </p>
  )
}

function PaperContent({ className, children, ref, ...props }: PaperContentProps) {
  return (
    <div
      ref={ref}
      className={cn(S.content, className)}
      {...props}
    >
      {children}
    </div>
  )
}

function PaperFooter({ className, children, ref, ...props }: PaperFooterProps) {
  return (
    <div
      ref={ref}
      className={cn(S.footer, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Namespace Export (callable as Root + namespace)
export const Paper = Object.assign(PaperRoot, {
  Root: PaperRoot,
  Header: PaperHeader,
  Title: PaperTitle,
  Description: PaperDescription,
  Content: PaperContent,
  Footer: PaperFooter,
})

// Individual exports for backward compatibility
export { PaperHeader, PaperTitle, PaperDescription, PaperContent, PaperFooter }
