# Git Conventions

## Branch Naming

```bash
# Format: <type>/<ticket-id>-<short-description>

# ✅ CORRECT
feature/STACK-123-add-log-filters
fix/STACK-456-pagination-offset
refactor/STACK-789-extract-hooks
chore/update-dependencies

# ❌ NEVER
my-branch
fix-stuff
STACK-123
feature/add_log_filters_and_also_refactor_the_sidebar_component
```

| Prefix | Use Case |
|--------|----------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `refactor/` | Code restructuring (no behavior change) |
| `chore/` | Dependencies, config, tooling |
| `docs/` | Documentation only |
| `test/` | Test additions/fixes |

## Commit Messages

**Format: `<type>(<scope>): <description>`**

```bash
# ✅ CORRECT - clear, scoped commits
feat(logs): add time range filter
fix(sidebar): correct collapsed state persistence
refactor(hooks): extract useLogFilters from LogsPage
chore(deps): update next to 14.2.0
docs(readme): add development setup instructions

# ❌ NEVER
fixed stuff
WIP
Update LogsPage.tsx
feat: add feature
```

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change (no new feature or fix) |
| `chore` | Build, deps, config |
| `docs` | Documentation |
| `test` | Tests |
| `style` | Formatting (no code change) |
| `perf` | Performance improvement |

## Commit Scope

Use the component/area affected:

```bash
# Component scopes
feat(button): add loading variant
fix(dialog): correct focus trap

# Feature scopes
feat(logs): implement search
fix(auth): handle expired tokens

# Package scopes
feat(i18n): add French translations
fix(ui-library): tooltip positioning
```

## Atomic Commits

**Each commit should be a single, complete change.**

```bash
# ❌ NEVER - mixed concerns
git commit -m "Add filter, fix bug, update styles"

# ✅ ALWAYS - separate commits
git commit -m "feat(logs): add level filter"
git commit -m "fix(logs): correct pagination offset"
git commit -m "style(logs): align filter buttons"
```

## PR Titles

**Same format as commits: `<type>(<scope>): <description>`**

```bash
# ✅ CORRECT
feat(logs): implement real-time log streaming
fix(auth): handle session expiry gracefully

# ❌ NEVER
Logs feature
Fix bug
STACK-123
```

## What NOT to Commit

```gitignore
# ❌ NEVER commit these
.env
.env.local
*.log
node_modules/
.DS_Store
*.pem
credentials.json
```

## Pre-Commit Checklist

Before committing:

1. **Lint passes** - `pnpm lint`
2. **Types check** - `pnpm typecheck`
3. **Tests pass** - `pnpm test`
4. **No console.logs** - Remove debugging statements
5. **No commented code** - Delete, don't comment
6. **No secrets** - Check for API keys, passwords

## Rebase vs Merge

```bash
# ✅ PREFERRED - rebase feature branches
git checkout feature/my-feature
git rebase main

# ✅ OK - merge for shared branches
git merge main

# ❌ AVOID - merge commits in feature branches
git merge main  # Creates noisy history
```

## Squash Strategy

**Squash when merging to main if commits are messy.**

```bash
# Multiple WIP commits → Squash to single clean commit
# Clean atomic commits → Preserve history (no squash)
```
