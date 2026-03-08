import { Button } from '@bytesyze-ui/core/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@bytesyze-ui/core/dropdown-menu'

export default function DropdownMenuPage() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Default (start aligned)</p>
        <DropdownMenu trigger={<Button variant="text">Open Menu</Button>}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Center aligned</p>
        <DropdownMenu trigger={<Button variant="secondary">Actions</Button>} align="center">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">End aligned</p>
        <DropdownMenu trigger={<Button variant="ghost">More</Button>} align="end">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Export</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  )
}
