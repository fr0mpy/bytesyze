/**
 * Simple application logger with browser toggle.
 *
 * @example
 * import { createLogger } from '@bytesyze/utils'
 *
 * const log = createLogger('MyFeature')
 * log.info('Started', { count: 5 })
 * log.error('Failed', { code: 500 })
 *
 * // In browser console:
 * __bytesyze.logs.enable()   // Enable logging (persists)
 * __bytesyze.logs.disable()  // Disable logging (persists)
 * __bytesyze.logs.status()   // Check current state
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface Logger {
  debug: (message: string, data?: object) => void
  info: (message: string, data?: object) => void
  warn: (message: string, data?: object) => void
  error: (message: string, data?: object) => void
}

const STORAGE_KEY = 'bytesyze:debug'

/** Check if we're in a browser environment */
const isBrowser =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined'

/** Initialize from localStorage, default to false (logs disabled) */
let enabled = isBrowser ? localStorage.getItem(STORAGE_KEY) === 'true' : false

/** Color styles for console output */
const COLORS = {
  namespace: 'color: #8B5CF6; font-weight: bold',
  debug: 'color: #6B7280',
  info: 'color: #3B82F6',
  warn: 'color: #F59E0B',
  error: 'color: #EF4444; font-weight: bold',
  reset: 'color: inherit',
} as const

export function configureLogger(opts: { enabled?: boolean }): void {
  if (opts.enabled !== undefined) {
    enabled = opts.enabled
    if (isBrowser) {
      if (enabled) {
        localStorage.setItem(STORAGE_KEY, 'true')
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }
}

/** Check if logging is currently enabled */
export function isLoggingEnabled(): boolean {
  return enabled
}

export function createLogger(namespace: string): Logger {
  const log = (level: LogLevel, msg: string, data?: object) => {
    if (!enabled) return
    const fn = console[level] || console.log
    if (isBrowser) {
      const args = [
        `%c[${namespace}]%c ${msg}`,
        COLORS.namespace,
        COLORS[level],
      ]
      data ? fn(...args, data) : fn(...args)
    } else {
      data ? fn(`[${namespace}] ${msg}`, data) : fn(`[${namespace}] ${msg}`)
    }
  }

  return {
    debug: (msg, data) => log('debug', msg, data),
    info: (msg, data) => log('info', msg, data),
    warn: (msg, data) => log('warn', msg, data),
    error: (msg, data) => log('error', msg, data),
  }
}

// Expose browser global for console access
if (isBrowser) {
  const bytesyze =
    ((window as unknown as Record<string, unknown>).__bytesyze as Record<
      string,
      unknown
    >) || {}
  bytesyze.logs = {
    enable: () => {
      configureLogger({ enabled: true })
      console.log(
        '%c[Bytesyze]%c Logging enabled',
        COLORS.namespace,
        'color: #10B981',
      )
    },
    disable: () => {
      configureLogger({ enabled: false })
      console.log(
        '%c[Bytesyze]%c Logging disabled',
        COLORS.namespace,
        'color: #6B7280',
      )
    },
    status: () => {
      const color = enabled ? 'color: #10B981' : 'color: #6B7280'
      console.log(
        `%c[Bytesyze]%c Logging is ${enabled ? 'enabled' : 'disabled'}`,
        COLORS.namespace,
        color,
      )
      return enabled
    },
  };
  (window as unknown as Record<string, unknown>).__bytesyze = bytesyze

  // Always show init messages
  console.log(
    '%cTo enable logging use:%c __bytesyze.logs.enable()',
    'color: #6B7280',
    'color: #8B5CF6; font-weight: bold',
  )
  console.log(
    "%cThank you for the opportunity to build this logs dashboard. I've enjoyed it.\n\nJay",
    'color: #10B981; font-style: italic',
  )
}
