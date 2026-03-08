import { useState } from 'react'
import { Button } from '@bytesyze-ui/core/button'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@bytesyze-ui/core/dialog'
import { Input } from '@bytesyze-ui/core/input'

export default function DialogPage() {
  const [blockingOpen, setBlockingOpen] = useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input label="Name" placeholder="John Doe" />
            <Input label="Email" type="email" placeholder="john@example.com" />
          </div>
          <DialogFooter>
            <Button variant="text">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="destructive" onClick={() => setBlockingOpen(true)}>
        Delete Item (Blocking)
      </Button>
      <Dialog blocking open={blockingOpen} onOpenChange={setBlockingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. You must confirm or cancel to close this dialog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="text" onClick={() => setBlockingOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setBlockingOpen(false)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
