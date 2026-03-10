'use client'

import { useState, useEffect, useCallback } from 'react'
import { PUSH_PROMPT_DELAY_MS } from '@/lib/config'
import { isPushSupported, getPermissionState, subscribeToPush } from '@/lib/push'
import { PushPromptStyles as S } from './styles'

export function PushPrompt() {
  const [visible, setVisible] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    // Only show prompt if push is supported and permission not yet decided
    if (!isPushSupported()) return

    const permission = getPermissionState()
    if (permission === 'default') {
      // Delay showing prompt to avoid interrupting first experience
      const timer = setTimeout(() => setVisible(true), PUSH_PROMPT_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubscribe = useCallback(async () => {
    setSubscribing(true)
    const success = await subscribeToPush()
    setSubscribing(false)

    if (success) {
      setVisible(false)
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div className={S.container} role="alert">
      <div className={S.content}>
        <p className={S.text}>
          Get notified when big AI news drops
        </p>
        <div className={S.actions}>
          <button
            type="button"
            className={S.subscribeButton}
            onClick={handleSubscribe}
            disabled={subscribing}
          >
            {subscribing ? 'Subscribing...' : 'Enable'}
          </button>
          <button
            type="button"
            className={S.dismissButton}
            onClick={handleDismiss}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
