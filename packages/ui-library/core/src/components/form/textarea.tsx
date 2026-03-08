import { cn } from '@/utils/cn'
import { TextareaStyles as S } from './styles'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  ref?: React.Ref<HTMLTextAreaElement>
}

function Textarea({ className, error, ref, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        S.base,
        !error && S.interactive,
        error && S.error,
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Textarea }
