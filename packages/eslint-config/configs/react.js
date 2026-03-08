import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/react',
  files: ['**/*.tsx', '**/*.jsx', '**/use-*.ts', '**/use*.ts'],
  plugins: {
    react,
    'react-hooks': reactHooks,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React 19 compatible rules
    'react/no-string-refs': 'error',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-useless-fragment': 'warn',
    'react/self-closing-comp': 'warn',
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],

    // Performance
    'react/jsx-no-constructed-context-values': 'warn',

    // Hooks rules - critical (using plugin's recommended rules)
    ...reactHooks.configs['recommended-latest'].rules,

    // Disabled rules for React 19 + Next.js App Router
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
  },
}
