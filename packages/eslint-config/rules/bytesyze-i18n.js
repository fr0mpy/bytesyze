/**
 * Rule: bytesyze/i18n-imports
 *
 * Enforces importing i18n utilities from @bytesyze/i18n instead of next-intl directly.
 * This ensures consistent usage of the project's i18n wrapper with typed keys.
 *
 * @example
 * // ❌ Bad - direct next-intl import bypasses typed keys
 * import { getTranslations } from 'next-intl/server'
 * import { useTranslations } from 'next-intl'
 *
 * // ✅ Good - use project wrapper with typed keys
 * import { getTranslations, dashboard, aria } from '@bytesyze/i18n'
 */

const NEXT_INTL_PACKAGES = ['next-intl', 'next-intl/server']

const REEXPORTED_FUNCTIONS = new Set([
  'getTranslations',
  'useTranslations',
  'getLocale',
  'useLocale',
  'getMessages',
  'useMessages',
  'getTimeZone',
  'useTimeZone',
  'getFormatter',
  'useFormatter',
  'getNow',
  'useNow',
])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce i18n imports from @bytesyze/i18n instead of next-intl',
      recommended: true,
    },
    messages: {
      useBytesyzeI18n:
        'Import "{{ name }}" from "@bytesyze/i18n" instead of "{{ source }}". This provides typed translation keys.',
      directNextIntl:
        'Prefer importing from "@bytesyze/i18n" which re-exports next-intl with typed keys.',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value

        if (!NEXT_INTL_PACKAGES.includes(source)) {
          return
        }

        const specifiers = node.specifiers.filter((s) => s.type === 'ImportSpecifier')

        if (specifiers.length === 0) {
          // Namespace import
          context.report({
            node,
            messageId: 'directNextIntl',
          })
          return
        }

        // Check each named import
        for (const specifier of specifiers) {
          const name = specifier.imported.name

          if (REEXPORTED_FUNCTIONS.has(name)) {
            context.report({
              node: specifier,
              messageId: 'useBytesyzeI18n',
              data: {
                name,
                source,
              },
            })
          }
        }
      },
    }
  },
}
