import nextPlugin from '@next/eslint-plugin-next'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/next',
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    // Core Web Vitals rules
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-sync-scripts': 'error',
    '@next/next/no-head-import-in-document': 'error',
    '@next/next/no-duplicate-head': 'error',
    '@next/next/google-font-display': 'warn',
    '@next/next/google-font-preconnect': 'warn',
    '@next/next/no-page-custom-font': 'warn',
    '@next/next/no-title-in-document-head': 'error',
    '@next/next/no-unwanted-polyfillio': 'warn',
  },
}
