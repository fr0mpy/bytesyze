import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from '@bytesyze/i18n'
import { Inter } from 'next/font/google'

import { PushPrompt } from '@/components/push/push-prompt'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('title'),
    description: t('description'),
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'bytesyze',
    },
    other: {
      'mobile-web-app-capable': 'yes',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=window.matchMedia('(prefers-color-scheme:dark)');document.documentElement.classList.toggle('dark',m.matches)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <PushPrompt />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
