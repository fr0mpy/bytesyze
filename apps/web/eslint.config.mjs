import { configs } from '@bytesyze/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs.next,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  },
]
