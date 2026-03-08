'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings } from 'lucide-react'
import { useTranslations, navigation, aria } from '@bytesyze/i18n'
import { Routes } from '@/lib/routes'
import { BottomNavStyles as S } from './styles'

export function BottomNav() {
  const pathname = usePathname()
  const t = useTranslations()

  const isHome = pathname === Routes.home
  const isSettings = pathname === Routes.settings

  return (
    <nav className={S.nav} aria-label={t(aria.mainNavigation)}>
      <Link
        href={Routes.home}
        className={isHome ? S.linkActive : S.link}
        aria-label={t(aria.goToHomepage)}
        aria-current={isHome ? 'page' : undefined}
      >
        <Home className={S.icon} aria-hidden="true" />
        <span className={S.label}>{t(navigation.home)}</span>
      </Link>
      <Link
        href={Routes.settings}
        className={isSettings ? S.linkActive : S.link}
        aria-label={t(aria.settings)}
        aria-current={isSettings ? 'page' : undefined}
      >
        <Settings className={S.icon} aria-hidden="true" />
        <span className={S.label}>{t(navigation.settings)}</span>
      </Link>
    </nav>
  )
}
