---
description: USE WHEN creating or editing behavioral rules in CLAUDE.md. Standard format for project-specific guidelines.
disable-model-invocation: true
---

# Rule Format — Standard Structure

Behavioral rules live in `CLAUDE.md` and are loaded once at session start.

## Enforcement

**When adding rules to CLAUDE.md, you MUST:**
1. Follow the template below
2. Keep content concise — no filler words
3. Use tables and bullets for scannability

---

## Template

```markdown
### Rule Name

Brief description of when this applies.

| Do | Don't |
|----|-------|
| Good example | Bad example |

**When [condition], you MUST:**
1. Step one
2. Step two
3. Step three
```

---

## Principles

1. **Concise** — No paragraphs explaining why. Just what to do.
2. **Actionable** — Every line should be a clear instruction.
3. **Scannable** — Use tables, bullets, code blocks. No walls of text.
4. **Self-contained** — Rule should work without reading other docs.
5. **Universal** — Only include rules that apply to most tasks. Context-specific guidance goes in skills.

---

## Anti-Patterns

- Long explanations of "why" this rule exists
- Multiple examples when one suffices
- Repeating the same instruction in different words
- Sections that don't add actionable value
- "Philosophy" or "Background" sections
- Context-specific rules (use skills instead)
