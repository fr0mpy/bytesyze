import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from '@bytesyze/i18n'
import { BottomNav } from '@/components/layout/bottom-nav'
import type { Metadata, Viewport } from 'next'
import './globals.css'

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=window.matchMedia('(prefers-color-scheme:dark)');document.documentElement.classList.toggle('dark',m.matches)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased pb-14">
        <NextIntlClientProvider messages={messages}>
          {children}
          <BottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
