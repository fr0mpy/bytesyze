import { configs } from '@bytesyze/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // This package re-exports from next-intl, so disable the i18n import rule
    rules: {
      'bytesyze/i18n-imports': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
