# Project Map

Central index for rules, skills, and agents. Hook reads this every 3 prompts for classification.

## Rules

| Rule | Triggers |
|------|----------|
| `rules/code-standards.md` | hardcode, magic number, config, pattern, iterate, discover, assume |
| `rules/routing.md` | route, Link, href, navigate, url, path, navigation, redirect |
| `rules/bundle.md` | import, dependency, barrel, tree-shake, package, granular, export |
| `rules/accessibility.md` | aria, a11y, label, focus, keyboard, heading, screen reader, wcag, tab, role, semantic |
| `rules/components.md` | component, ui, style, className, ref, compound, pattern, forwardRef, props, children, slot |
| `rules/theming.md` | theme, token, css var, color, design, variable, dark mode, light mode |
| `rules/i18n.md` | text, translation, t(), locale, string, getTranslations, language, i18n, hardcode string, string literal, message |
| `rules/error-handling.md` | error, catch, boundary, fallback, try, throw, exception, error state |
| `rules/data-fetching.md` | fetch, query, cache, revalidate, server action, SWR, loading, suspense |
| `rules/testing.md` | test, spec, mock, fixture, describe, it, expect, vitest, playwright |
| `rules/security.md` | sanitize, escape, xss, inject, validate, auth, csrf, secret, env |
| `rules/git.md` | commit, branch, merge, pr, rebase, squash, push, git |
| `rules/performance.md` | memo, useMemo, useCallback, virtualize, lazy, optimize, re-render, debounce, lighthouse, LCP, TBT, CLS, core web vitals, ssr: false, FOUC, bundle size |

## Skills

| Skill | Triggers |
|-------|----------|
| `skills/styling.md` | tailwind, className, Text component, style pattern, variant, cn() |
| `skills/react-patterns.md` | hook, useState, useEffect, useRef, context, memo, callback, reducer |
| `skills/mermaid.md` | diagram, flowchart, sequence, architecture, graph, chart, visualize |
| `skills/prompt-analyzer.md` | analyze prompt, classify, categorize |
| `skills/agent-format.md` | create agent, new agent, agent template |
| `skills/command-format.md` | create command, slash command, new command |
| `skills/rule-format.md` | create rule, new rule, rule template |

## Commands

| Command | Triggers |
|---------|----------|
| `/audit` | audit, compliance check, rule check, codebase audit, comprehensive audit |

## Agents

### Pre-Work (Run BEFORE)

| Agent | Triggers |
|-------|----------|
| `pre-code-check` | BEFORE creating component, hook, util, service |
| `package-checker` | BEFORE npm install, yarn add, pnpm add, add dependency |
| `dependency-detective` | BEFORE adding new package, evaluate dependency |
| `api-contract-guardian` | BEFORE modifying API, endpoint, response shape, interface |
| `breaking-change-predictor` | BEFORE refactor, modify shared code, rename export |
| `challenge-thinking` | BEFORE architecture decision, complex implementation |
| `clarify-intent` | WHEN task ambiguous, multiple interpretations, unclear requirements |
| `migration-planner` | FOR schema change, API versioning, data migration, database change |

### Post-Work (Run AFTER)

| Agent | Triggers |
|-------|----------|
| `component-auditor` | AFTER creating/modifying UI component |
| `accessibility-auditor` | AFTER any UI work, before completing UI task |
| `design-token-validator` | AFTER generating UI, styling changes |
| `server-component-validator` | AFTER creating React component, RSC, client boundary |
| `structure-validator` | AFTER creating files, directories, reorganizing code |
| `bundle-size-tracker` | AFTER adding dependency, before shipping, build |
| `security-auditor` | AFTER user input handling, forms, dangerouslySetInnerHTML, dynamic content |
| `test-writer` | AFTER creating functions, hooks, utils, components |

### On-Demand

| Agent | Triggers |
|-------|----------|
| `context-loader` | context stale, refresh context, load context, CONTEXT.md |
| `harness-scaffolder` | /component-harness, preview component, visual harness |
| `skeleton-builder` | skeleton, loading.tsx, CLS, layout shift, loading state, Suspense fallback |
| `style-inspector` | extract styles from URL, copy design, reverse engineer |
| `playwright-tester` | test component, verify rendering, e2e test, playwright |
| `pr-narrator` | create PR, pull request, write PR description |
| `scope-guard` | long session, scope drift, rabbit hole, refocus |
| `session-manager` | session end, handoff, summarize progress, context limit |
| `dead-code-finder` | unused exports, orphaned files, dead code, cleanup |
| `type-narrower` | TypeScript error, type issue, type narrowing, as any |
| `performance-profiler` | lighthouse, performance score, LCP, TBT, slow page, optimize performance, core web vitals |
| `code-standards-auditor` | hardcode audit, magic number check, anti-pattern scan, code standards |
| `routing-auditor` | route audit, Link check, navigation audit, Routes config |
| `i18n-auditor` | translation audit, hardcoded string check, i18n compliance |
| `error-handling-auditor` | error boundary audit, catch check, error state audit |
| `data-fetching-auditor` | fetch audit, caching check, waterfall detection |
| `git-auditor` | git audit, commit format, branch naming, sensitive files |
| `test-auditor` | test audit, coverage check, test quality, testing patterns |

## Behavior

- **Announce:** `🔧 ACTION:` before, `✅ DONE:` after, `❌ FAILED:` on error
- **Subagents:** `🤖 SPAWNING: [agent-name]`
- **Dedupe:** Each agent max ONCE per prompt. `⏭️ SKIP: [agent] (cached)`
- **Pushback:** Challenge incorrect assumptions with evidence
