import { Button } from '@bytesyze-ui/core/button'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@bytesyze-ui/core/collapsible'

export default function CollapsiblePage() {
  return (
    <Collapsible defaultOpen className="w-full space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Click to expand</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">Toggle</Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-theme-md border border-border px-4 py-3 text-sm">
          Hello world
        </div>
        <div className="rounded-theme-md border border-border px-4 py-3 text-sm">
          More content here
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
