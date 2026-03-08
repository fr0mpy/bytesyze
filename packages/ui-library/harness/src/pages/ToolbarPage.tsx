import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react'
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup, ToolbarLink } from '@bytesyze-ui/core/toolbar'

export default function ToolbarPage() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground mb-2">Horizontal toolbar</p>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton aria-label="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Underline">
            <Underline className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton active aria-label="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Align right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarLink href="#">
          <Link className="h-4 w-4 mr-1" />
          Link
        </ToolbarLink>
      </Toolbar>
      <p className="text-xs text-muted-foreground mb-2">Vertical toolbar</p>
      <Toolbar orientation="vertical" className="w-fit">
        <ToolbarButton aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton active aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
      </Toolbar>
    </div>
  )
}
