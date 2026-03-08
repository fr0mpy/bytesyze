import { Button } from '@bytesyze-ui/core/button'
import { DropdownMenu } from '@bytesyze-ui/core/dropdown-menu'

export default function HoverCardPage() {
  return (
    <DropdownMenu
      trigger={<Button variant="text">Hover me</Button>}
      triggerMode="hover"
    >
      <div className="space-y-2 p-2">
        <h4 className="font-medium">User Profile</h4>
        <p className="text-sm text-muted-foreground">Additional information appears on hover.</p>
      </div>
    </DropdownMenu>
  )
}
