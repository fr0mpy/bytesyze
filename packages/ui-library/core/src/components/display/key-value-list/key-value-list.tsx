'use client'

import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { KeyValueListStyles as S } from './styles'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { Text } from '../../text'

// ============================================================================
// Types
// ============================================================================

export interface KeyValueListProps {
  /** Key-value pairs to display */
  items: Record<string, string | number | boolean>
  /** Enable copy buttons for values (default: false) */
  copyable?: boolean
  /** Fixed width for keys (default: '160px') */
  keyWidth?: string
  /** Additional className for container */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * Displays a list of key-value pairs with optional copy functionality
 *
 * Used for HTTP headers, query parameters, metadata display, etc.
 *
 * @example
 * ```tsx
 * <KeyValueList
 *   items={{
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer token...',
 *   }}
 *   copyable
 * />
 * ```
 */
export function KeyValueList({
  items,
  copyable = false,
  keyWidth = '160px',
  className,
}: KeyValueListProps) {
  const { copy, copied } = useCopyToClipboard()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const entries = Object.entries(items)

  // Reset copiedKey when copy state expires
  useEffect(() => {
    if (!copied) {
      setCopiedKey(null)
    }
  }, [copied])

  const handleCopy = (key: string, value: string) => {
    void copy(value)
    setCopiedKey(key)
  }

  if (entries.length === 0) {
    return null
  }

  return (
    <div className={cn(S.container, className)}>
      {entries.map(([key, value]) => (
        <div key={key} className={cn(S.row, copyable && S.rowHover)}>
          <Text
            variant="body2"
            color="muted"
            className={S.key}
            style={{ width: keyWidth }}
          >
            {key}
          </Text>
          <div className={S.valueContainer}>
            <Text variant="body2" className={S.value} title={String(value)}>
              {String(value)}
            </Text>
            {copyable && (
              <button
                type="button"
                className={S.copyButton}
                onClick={() => handleCopy(key, String(value))}
                aria-label={`Copy ${key} value`}
              >
                {copied && copiedKey === key
                  ? <Check className={S.copyIconSuccess} />
                  :                   <Copy className={S.copyIcon} />
                }
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
