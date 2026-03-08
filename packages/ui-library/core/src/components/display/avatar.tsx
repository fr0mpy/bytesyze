import { User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { AvatarStyles as S } from './styles'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  ref?: React.Ref<HTMLDivElement>
}

function Avatar({ src, alt, fallback, size = 'md', className, ref, ...props }: AvatarProps) {
  return (
    <div
      ref={ref}
      className={cn(S.root, S.sizes[size], className)}
      {...props}
    >
      {src
        ? <img src={src} alt={alt || 'Avatar'} className={S.image} />
        : fallback
          ? <span className={S.fallback}>{fallback}</span>
          :         <User className={S.fallbackIcon} />
      }
    </div>
  )
}

export { Avatar }
