import { Badge } from '@bytesyze-ui/core/badge'

export default function BadgePage() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
