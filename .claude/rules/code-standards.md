# Code Standards

## Anti-Patterns vs Patterns

| ❌ Hardcoded/Assumed | ✅ Dynamic/Discovered |
|----------------------|----------------------|
| `src/components/*.tsx` | Glob for `**/*.tsx`, group by directory |
| `users[0], users[1]` | `users.map()` or `users.forEach()` |
| `'#007AFF'` | `theme.colors.primary` |
| `'https://api...'` | `config.API_BASE_URL` |
| `if (x > 50)` | `if (x > CONFIG.THRESHOLD)` |
| `duration: 0.3` | `DURATION.slow` from config |
| `aria-label="Close"` | `t(aria.close)` from i18n |
| `<h1>Dashboard</h1>` | `t(dashboard.title)` from i18n |

## Principles

1. **Discover, don't assume** — Scan for what exists, don't hardcode paths
2. **Iterate, don't index** — Use `.map()`, `.filter()`, `.find()` not `[0]`, `[1]`
3. **Configure, don't embed** — Values that might change go in config
4. **Categorize by pattern** — Group by naming convention, not explicit list

## Constructive Pushback

Verify accuracy before agreeing with user claims.

| Push Back When | Don't Push Back When |
|----------------|---------------------|
| Incorrect technical claim | User is correct |
| Suboptimal approach | Preference/style choice |
| Missing edge case | Already discussed |
| Flawed assumption | Minor/trivial detail |
| Misremembered API/syntax | User explicitly chose despite tradeoffs |

**Do:** "That approach could cause X — consider Y instead"
**Don't:** "You're absolutely right!" (when they're not)
