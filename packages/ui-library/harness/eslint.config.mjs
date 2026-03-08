import { configs } from '@bytesyze/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs.vite,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'],
  },
]
