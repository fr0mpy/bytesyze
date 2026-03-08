/**
 * Server-side theme utilities
 *
 * These utilities use next/headers and must only be imported in Server Components.
 * Import from '@bytesyze-ui/core/providers/server' in layout.tsx or page.tsx.
 *
 * @example
 * import { getThemeFromCookies, ThemeInitScript } from '@bytesyze-ui/core/providers/server'
 *
 * export default async function RootLayout({ children }) {
 *   const theme = await getThemeFromCookies()
 *   return (
 *     <html>
 *       <head>
 *         <ThemeInitScript />
 *       </head>
 *       <body>
 *         <Providers initialTheme={theme}>{children}</Providers>
 *       </body>
 *     </html>
 *   )
 * }
 */

export { getThemeFromCookies, THEME_COOKIE_NAME } from './theme-cookie'
export type { ThemeMode } from './theme-cookie'
export { ThemeInitScript, ThemeScript } from './ThemeScript'
