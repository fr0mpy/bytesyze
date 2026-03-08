/**
 * Rule: bytesyze/no-hardcoded-routes
 *
 * Warns against hardcoded route strings in Link href and anchor href attributes.
 * Routes should come from centralized config for maintainability.
 *
 * @example
 * // ⚠️ Warning - hardcoded route string
 * <Link href="/logs">Logs</Link>
 * <a href="/dashboard">Dashboard</a>
 *
 * // ✅ Good - use Routes config
 * import { Routes } from '@/routes'
 * <Link href={Routes.logs.index}>Logs</Link>
 */

// Routes that are commonly dynamic and should use config
const ROUTE_PATTERNS = [
  /^\/logs/,
  /^\/dashboard/,
  /^\/agent-toolkit/,
  /^\/component-library/,
  /^\/design-review/,
  /^\/settings/,
  /^\/api\//,
]

// Routes that are okay to hardcode (external, anchors, etc.)
const ALLOWED_PATTERNS = [
  /^https?:\/\//, // External URLs
  /^mailto:/, // Email links
  /^tel:/, // Phone links
  /^#/, // Anchor links
  /^\/api\//, // API routes (debatable, but often dynamic)
]

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn against hardcoded route strings',
      recommended: true,
    },
    messages: {
      hardcodedRoute:
        'Avoid hardcoded route "{{ route }}". Import Routes from "@/routes" or "@/lib/routes" and use Routes.* instead.',
    },
    schema: [],
  },
  create(context) {
    function checkHref(node, hrefValue) {
      // Only check string literals
      if (typeof hrefValue !== 'string') {
        return
      }

      // Allow certain patterns
      if (ALLOWED_PATTERNS.some((pattern) => pattern.test(hrefValue))) {
        return
      }

      // Check if it matches route patterns that should use config
      if (ROUTE_PATTERNS.some((pattern) => pattern.test(hrefValue))) {
        context.report({
          node,
          messageId: 'hardcodedRoute',
          data: {
            route: hrefValue,
          },
        })
        return
      }

      // Warn on any absolute path that starts with /
      // (except root "/" which might be intentional)
      if (hrefValue.startsWith('/') && hrefValue !== '/') {
        context.report({
          node,
          messageId: 'hardcodedRoute',
          data: {
            route: hrefValue,
          },
        })
      }
    }

    return {
      JSXAttribute(node) {
        // Check href attribute
        if (node.name.name !== 'href') {
          return
        }

        // Get the parent element name
        const parent = node.parent
        if (parent.type !== 'JSXOpeningElement') {
          return
        }

        const elementName = parent.name.name

        // Only check Link and a elements
        if (elementName !== 'Link' && elementName !== 'a') {
          return
        }

        // Get the href value
        const value = node.value

        if (!value) {
          return
        }

        // String literal: href="/logs"
        if (value.type === 'Literal' && typeof value.value === 'string') {
          checkHref(node, value.value)
        }

        // JSX expression with string: href={"/logs"}
        if (value.type === 'JSXExpressionContainer') {
          const expr = value.expression
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            checkHref(node, expr.value)
          }
          // Template literal: href={`/logs/${id}`}
          if (expr.type === 'TemplateLiteral' && expr.quasis.length > 0) {
            const firstPart = expr.quasis[0].value.raw
            if (firstPart.startsWith('/')) {
              checkHref(node, firstPart)
            }
          }
        }
      },
    }
  },
}
