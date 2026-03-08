import { THEME_COOKIE_NAME } from './theme-cookie'

/**
 * Server component that sets the initial theme class in <head>.
 *
 * Reads the theme cookie and sets .dark class before React hydrates,
 * preventing flash of wrong theme.
 *
 * Brand colors are now handled via CSS imports (bytesyze.css).
 *
 * Must be rendered in <head> of every layout.tsx.
 *
 * @example
 * <head>
 *   <ThemeInitScript />
 * </head>
 */
export function ThemeInitScript() {
  // Inline script for theme mode (runs before React hydrates)
  const modeScript = `(function(){try{var c=document.cookie.match(/${THEME_COOKIE_NAME}=([^;]+)/);var t=c?c[1]:null;if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: modeScript }} />
}

/**
 * @deprecated Use ThemeInitScript instead. Brand colors are now CSS imports.
 */
export const ThemeScript = ThemeInitScript
