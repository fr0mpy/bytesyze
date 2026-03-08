import { Button } from '@bytesyze-ui/core/button'
import { Tooltip } from '@bytesyze-ui/core/tooltip'

export default function TooltipPage() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-4 items-center">
        <Tooltip content="Top tooltip" side="top">
          <Button variant="text" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" side="right">
          <Button variant="text" size="sm">Right</Button>
        </Tooltip>
        <Tooltip content="Bottom tooltip" side="bottom">
          <Button variant="text" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="Left tooltip" side="left">
          <Button variant="text" size="sm">Left</Button>
        </Tooltip>
      </div>
      <div className="flex gap-4 items-center">
        <Tooltip content="Anchored start" side="top" anchor="start">
          <Button variant="ghost" size="sm">Start</Button>
        </Tooltip>
        <Tooltip content="Anchored center" side="top" anchor="center">
          <Button variant="ghost" size="sm">Center</Button>
        </Tooltip>
        <Tooltip content="Anchored end" side="top" anchor="end">
          <Button variant="ghost" size="sm">End</Button>
        </Tooltip>
      </div>
      <Tooltip content="No arrow pointer" side="bottom" showArrow={false}>
        <Button variant="secondary" size="sm">No Arrow</Button>
      </Tooltip>
    </div>
  )
}
