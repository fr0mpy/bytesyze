Stage and commit current changes with clean, atomic commits.

## Rules

### No AI Attribution
- NEVER include "Claude", "AI", "generated", "assisted by", or similar in commit messages
- Commits should read as if written by a human developer

### Conventional Commits Format
Use `type(scope): message` format:
- `feat(component)` — New feature
- `fix(api)` — Bug fix
- `refactor(utils)` — Code restructure without behavior change
- `docs(readme)` — Documentation only
- `style(lint)` — Formatting, no code change
- `test(unit)` — Adding/updating tests
- `chore(deps)` — Maintenance tasks

### Atomic Commits
Each commit should be a single logical unit of work:
- ✅ One feature, one commit
- ✅ One bug fix, one commit
- ❌ Multiple unrelated changes in one commit

## Workflow

### 1. Understand Changes
Run `git status` and `git diff` to understand all changes.

### 2. Pre-Commit Validation (REQUIRED)
Before committing, run these checks based on what changed:

**For UI/Component changes** — Run in parallel:
- `accessibility-auditor` — WCAG compliance, ARIA labels
- `component-auditor` — Recipe compliance, zero-inline-classnames
- `design-token-validator` — Token compliance, no hardcoded values

**For Server Components / Next.js changes:**
- `server-component-validator` — Client/server boundary validation

**For any code changes:**
- `pnpm turbo typecheck` — TypeScript validation
- `pnpm turbo test` — Run affected tests

**For bundle-impacting changes:**
- `bundle-size-tracker` — Monitor First Load JS impact

**Fix all issues before proceeding to commit.**

### 3. Group Changes
Analyze changes and group by logical purpose (features, fixes, refactors).

### 4. Atomic Commits
**If mixed changes exist:**
- Stage and commit each logical group separately
- Example: First `refactor: extract helper`, then `feat: add validation`

For each commit group:
- Stage only related files: `git add <specific-files>`
- Write conventional commit message (imperative mood, no AI mentions)
- Commit

### 5. Verify
Run `git log --oneline -5` to confirm clean history.

## Examples

```bash
# ✅ Good commit messages
feat(button): add loading state with spinner
fix(auth): handle expired token refresh
refactor(hooks): extract useDebounce from useSearch
chore(deps): update framer-motion to 11.x

# ❌ Bad commit messages
Updated files (too vague)
AI-generated button component (mentions AI)
feat: add button, fix auth, update deps (multiple concerns)
```

$ARGUMENTS
