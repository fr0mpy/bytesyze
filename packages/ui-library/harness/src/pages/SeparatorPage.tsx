import { Separator } from '@bytesyze-ui/core/separator'

export default function SeparatorPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm">Content above</p>
        <Separator className="my-4" />
        <p className="text-sm">Content below</p>
      </div>
      <div className="flex gap-4 items-center">
        <p className="text-sm">Left</p>
        <Separator orientation="vertical" className="h-12" />
        <p className="text-sm">Right</p>
      </div>
    </div>
  )
}
