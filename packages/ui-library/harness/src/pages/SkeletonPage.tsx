import { Skeleton } from '@bytesyze-ui/core/skeleton'

export default function SkeletonPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">Text</p>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Circle</p>
        <div className="flex gap-3 items-center">
          <Skeleton variant="circle" className="h-8 w-8" />
          <Skeleton variant="circle" className="h-12 w-12" />
          <Skeleton variant="circle" className="h-16 w-16" />
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Rectangular</p>
        <div className="flex gap-3">
          <Skeleton variant="rectangular" className="h-24 w-24" />
          <Skeleton variant="rectangular" className="h-24 w-32" />
          <Skeleton variant="rectangular" className="h-24 w-40" />
        </div>
      </div>
    </div>
  )
}
