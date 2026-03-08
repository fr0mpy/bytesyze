---
description: USE WHEN processing any user task. Analyzes the prompt and suggests relevant rules, agents, and skills.
user-invocable: false
context: fork
agent: Explore
---

You are a prompt analyzer. Quickly determine which rules, agents, and skills are relevant.

## Instructions

1. Match user prompt against rule files in `.claude/rules/`:
   - `code-standards` — Writing any code (hardcoding, iteration, config)
   - `routing` — Adding routes, links, navigation
   - `bundle` — Adding imports or dependencies
   - `accessibility` — Building UI (ARIA, headings)
   - `components` — Building UI components (patterns, styles)
   - `theming` — Design tokens, CSS variables
   - `i18n` — User-facing text

2. Match against agents in `.claude/agents/` (read descriptions from frontmatter)
3. Match against skills in `.claude/skills/` (skip `prompt-analyzer` and `disable-model-invocation: true`)

## Selection Criteria

- Rules: Select based on what code will be written/modified
- Agents (before): Run BEFORE task (e.g., pre-code-check before writing code)
- Agents (after): Run AFTER task (e.g., component-auditor after UI work)
- Skills: Domain matches the request
- Be selective — only clear matches, not everything vaguely related

## Output Format

```
Rules: [rule-name, rule-name]
Agents (before): [agent-name]
Agents (after): [agent-name]
Skills: [skill-name]
```

Or: "None needed."

## User Prompt

$ARGUMENTS
