'use client'

import { Copy, Check, ExternalLink } from 'lucide-react'
import { cn } from '@/utils/cn'
import { UrlBarStyles as S } from './styles'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { Text } from '../../text'

// ============================================================================
// Types
// ============================================================================

export interface UrlBarProps {
  /** URL to display */
  url: string
  /** Optional label (default: 'URL') */
  label?: string
  /** Show open in new tab button (default: false) */
  showOpenButton?: boolean
  /** Enable copy button (default: true) */
  copyable?: boolean
  /** Additional className */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * URL display bar with copy and optional open functionality
 *
 * Shows a URL in a monospace font with copy-to-clipboard button.
 * Optionally shows an "open in new tab" button.
 *
 * @example
 * ```tsx
 * <UrlBar
 *   url="https://api.example.com/v1/users"
 *   label="Endpoint"
 *   showOpenButton
 * />
 * ```
 */
export function UrlBar({
  url,
  label = 'URL',
  showOpenButton = false,
  copyable = true,
  className,
}: UrlBarProps) {
  const { copy, copied } = useCopyToClipboard()

  return (
    <div className={cn(S.container, className)}>
      <Text variant="body2" color="muted" className={S.label}>
        {label}
      </Text>
      <span className={S.value} title={url}>
        {url}
      </span>
      <div className={S.actions}>
        {showOpenButton && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={S.actionButton}
            aria-label="Open URL in new tab"
          >
            <ExternalLink className={S.icon} />
          </a>
        )}
        {copyable && (
          <button
            type="button"
            className={S.actionButton}
            onClick={() => copy(url)}
            aria-label="Copy URL to clipboard"
          >
            {copied
              ? <Check className={S.iconSuccess} />
              :               <Copy className={S.icon} />
            }
          </button>
        )}
      </div>
    </div>
  )
}
