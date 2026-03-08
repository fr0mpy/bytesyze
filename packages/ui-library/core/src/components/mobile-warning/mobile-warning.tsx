'use client'

import { useState, useEffect } from 'react'
import { useIsMobile } from '../../hooks'
import { Dialog } from '../dialog'
import { Button } from '../form'

const STORAGE_KEY = 'bytesyze-mobile-warning-dismissed'

export interface MobileWarningProps {
  /** Dialog title */
  title: string
  /** Warning description */
  description: string
  /** Dismiss button label */
  dismissLabel: string
  /** Show close button in dialog (default: true) */
  showClose?: boolean
}

export function MobileWarning({
  title,
  description,
  dismissLabel,
  showClose = true,
}: MobileWarningProps) {
  const isMobile = useIsMobile()
  const [isDismissed, setIsDismissed] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsDismissed(sessionStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setIsDismissed(true)
  }

  if (!isMobile || isDismissed) return null

  return (
    <Dialog open onOpenChange={(open) => !open && handleDismiss()}>
      <Dialog.Content showClose={showClose}>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button onClick={handleDismiss} variant="primary">
            {dismissLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
