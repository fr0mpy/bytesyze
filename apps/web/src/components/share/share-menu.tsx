'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy, Linkedin, MessageCircle } from 'lucide-react'
import { useTranslations, share as shareKeys } from '@bytesyze/i18n'
import { COPY_FEEDBACK_DURATION_MS } from '@/lib/config'
import { ShareMenuStyles as S } from './styles'
import type { ShareMenuProps } from './types'

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function ShareMenu({ title, url, open, onClose }: ShareMenuProps) {
  const t = useTranslations()
  const menuRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, handleEscape, handleClickOutside])

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      onClose()
    }, COPY_FEEDBACK_DURATION_MS)
  }, [url, onClose])

  if (!open) return null

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const platforms = [
    {
      name: 'X',
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <XIcon className={S.itemIcon} />,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className={S.itemIcon} />,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <MessageCircle className={S.itemIcon} />,
    },
  ]

  return (
    <div ref={menuRef} className={S.container} role="menu">
      {copied ? (
        <div className={S.copiedText}>
          <Check className={S.itemIcon} />
          {t(shareKeys.copied)}
        </div>
      ) : (
        <button
          type="button"
          className={S.item}
          role="menuitem"
          onClick={handleCopyLink}
        >
          <Copy className={S.itemIcon} />
          {t(shareKeys.copyLink)}
        </button>
      )}
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          className={S.item}
          role="menuitem"
          aria-label={t(shareKeys.shareOn, { platform: platform.name })}
        >
          {platform.icon}
          {t(shareKeys.shareOn, { platform: platform.name })}
        </a>
      ))}
    </div>
  )
}
