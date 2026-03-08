import { ScrollArea } from '@bytesyze-ui/core/scroll-area'

export default function ScrollAreaPage() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground mb-2">Vertical scroll with smooth momentum</p>
      <ScrollArea className="h-48 w-full rounded-theme-lg border border-border p-4 overflow-auto">
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-3 rounded-theme-md bg-muted/50">
              <p className="text-sm">Scrollable item {i + 1}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-xs text-muted-foreground mb-2">Horizontal scroll</p>
      <ScrollArea
        className="w-full rounded-theme-lg border border-border p-4 overflow-auto"
        options={{ orientation: 'horizontal' }}
      >
        <div className="flex gap-4 w-max">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-24 rounded-theme-md bg-muted/50 flex items-center justify-center">
              <p className="text-sm">Item {i + 1}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
