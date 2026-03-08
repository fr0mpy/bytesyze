import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/typescript',
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      projectService: true,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
  },
  rules: {
    // Disable base rules that conflict with TypeScript
    'no-unused-vars': 'off',
    'no-undef': 'off',

    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Type-aware rules (require parserOptions.project)
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // Consistency
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],

    // Disabled rules (too strict for this project)
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
