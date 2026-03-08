import base from './configs/base.js'
import formatting from './configs/formatting.js'
import imports from './configs/imports.js'
import jsxA11y from './configs/jsx-a11y.js'
import next from './configs/next.js'
import react from './configs/react.js'
import typescript from './configs/typescript.js'
import { rules as bytesyzeRules } from './rules/index.js'

/**
 * Custom Bytesyze ESLint plugin with project-specific rules
 */
export const bytesyzePlugin = {
  rules: bytesyzeRules,
}

/**
 * Bytesyze custom rules configuration
 * @type {import('eslint').Linter.Config}
 */
const bytesyzeConfig = {
  name: 'bytesyze/custom',
  plugins: {
    bytesyze: bytesyzePlugin,
  },
  rules: {
    // Enforce granular imports from @bytesyze-ui/core
    'bytesyze/granular-imports': 'error',
    // Enforce i18n imports from @bytesyze/i18n
    'bytesyze/i18n-imports': 'warn',
    // Warn on hardcoded route strings
    'bytesyze/no-hardcoded-routes': 'warn',
  },
}

/**
 * Pre-composed configurations for common use cases
 */
export const configs = {
  /**
   * For pure TypeScript packages (utils, i18n)
   * No React, no browser globals
   */
  typescript: [base, typescript, imports, formatting],

  /**
   * For React libraries (ui-library/core)
   * React + hooks + a11y, no Next.js
   */
  react: [base, typescript, react, jsxA11y, imports, formatting, bytesyzeConfig],

  /**
   * For Next.js apps (shell, mfe/*)
   * Full stack: React + Next.js + a11y + custom rules
   */
  next: [base, typescript, react, jsxA11y, imports, next, formatting, bytesyzeConfig],

  /**
   * For Vite apps (harness)
   * React without Next.js specifics
   */
  vite: [base, typescript, react, jsxA11y, imports, formatting, bytesyzeConfig],
}

// Individual configs for granular composition
export { base, typescript, react, jsxA11y, imports, next, formatting }

// Default export for simple usage
export default configs.next
