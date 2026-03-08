Run comprehensive codebase audit against all project rules.

Scope: Scans ENTIRE codebase (not just current changes). Use $ARGUMENTS to target specific path.

1. Determine target: $ARGUMENTS path or entire codebase (apps/, packages/)
2. Spawn all auditors in parallel using Glob/Grep to scan ALL files:
   - component-auditor, accessibility-auditor, design-token-validator
   - server-component-validator, bundle-size-tracker, performance-profiler
   - code-standards-auditor, routing-auditor, i18n-auditor
   - error-handling-auditor, data-fetching-auditor, security-auditor
   - test-auditor, git-auditor, dead-code-finder
3. Each auditor checks specific rule categories from .claude/rules/
4. Aggregate findings by severity (🔴 Critical > 🟡 Warning > 🟢 Minor)
5. Output unified report with file:line references and fix recommendations

Usage:
- `/audit` — audit entire codebase
- `/audit apps/shell` — audit only shell app
- `/audit packages/ui-library` — audit only ui-library package

$ARGUMENTS
