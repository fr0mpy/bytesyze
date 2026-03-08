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
    ignores: ['dist/**', 'node_modules/**'],
  },
]
