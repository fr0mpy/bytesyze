import {
  buildSpeculationRules,
  type SpeculationRulesConfig,
} from '@bytesyze/utils/speculation-rules'

export interface SpeculationRulesProps extends SpeculationRulesConfig {}

/**
 * Injects Speculation Rules for browser prefetch/prerender.
 *
 * Browser support:
 * - Chrome 109+ / Edge 109+ (~75% of users)
 * - Safari/Firefox: Gracefully ignored (normal navigation)
 *
 * @see https://developer.chrome.com/docs/web-platform/prerender-pages
 *
 * @example
 * // In layout.tsx <head>:
 * <SpeculationRules
 *   prefetchPaths={['/agent-toolkit/*', '/component-library/*']}
 * />
 */
export function SpeculationRules(props: SpeculationRulesProps) {
  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: buildSpeculationRules(props) }}
    />
  )
}
