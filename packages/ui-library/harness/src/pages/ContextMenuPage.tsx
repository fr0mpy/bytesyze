import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '@bytesyze-ui/core/context-menu'

export default function ContextMenuPage() {
  return (
    <ContextMenu
      trigger={(
        <div className="flex h-32 w-64 items-center justify-center rounded-theme-lg border-2 border-dashed border-border">
          <p className="text-sm text-muted-foreground">Right click here</p>
        </div>
      )}
    >
      <ContextMenuItem>Copy</ContextMenuItem>
      <ContextMenuItem>Paste</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Delete</ContextMenuItem>
    </ContextMenu>
  )
}
