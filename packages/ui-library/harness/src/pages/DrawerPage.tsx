import { useState } from 'react'
import { Button } from '@bytesyze-ui/core/button'
import { Drawer } from '@bytesyze-ui/core/drawer'

export default function DrawerPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} title="Drawer Title">
        <p className="text-sm text-muted-foreground">This is the drawer content.</p>
      </Drawer>
    </>
  )
}
