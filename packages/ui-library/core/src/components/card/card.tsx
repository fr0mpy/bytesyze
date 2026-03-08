import { cn } from '@/utils/cn'
import { CardStyles as S } from './styles'
import type {
  CardRootProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CardWithSlotsProps,
} from './types'

function CardRoot({ className, children, ref, ...props }: CardRootProps) {
  return (
    <div ref={ref} className={cn(S.container, className)} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ className, children, ref, ...props }: CardHeaderProps) {
  return (
    <div ref={ref} className={cn(S.header, className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ref, ...props }: CardTitleProps) {
  return (
    <h3 ref={ref} className={cn(S.title, className)} {...props}>
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ref, ...props }: CardDescriptionProps) {
  return (
    <p ref={ref} className={cn(S.description, className)} {...props}>
      {children}
    </p>
  )
}

function CardContent({ className, children, ref, ...props }: CardContentProps) {
  return (
    <div ref={ref} className={cn(S.content, className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ref, ...props }: CardFooterProps) {
  return (
    <div ref={ref} className={cn(S.footer, className)} {...props}>
      {children}
    </div>
  )
}

function CardWithSlots({ slots, children, className, ref, ...props }: CardWithSlotsProps) {
  const hasHeader = slots?.header || slots?.title || slots?.description

  return (
    <div ref={ref} className={cn(S.container, className)} {...props}>
      {hasHeader && (
        <div className={S.header}>
          {slots?.header ?? (
            <>
              {slots?.title && <h3 className={S.title}>{slots.title}</h3>}
              {slots?.description && <p className={S.description}>{slots.description}</p>}
            </>
          )}
        </div>
      )}
      <div className={S.content}>{children}</div>
      {slots?.footer && <div className={S.footer}>{slots.footer}</div>}
    </div>
  )
}

// Namespace Export (callable as Root + namespace)
export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  WithSlots: CardWithSlots,
})

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardWithSlots }
