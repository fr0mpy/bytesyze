Launch the visual component harness to preview, iterate, and test your design system components.

## Prerequisites
- Run `/setup-styling` first to generate styling config and component recipes
- Node.js 18+ installed

## Workflow

1. **Check for styling config**
   - If `.claude/styling-config.json` doesn't exist, prompt to run `/setup-styling` first

2. **Check if component-harness exists**
   - Look for `component-harness/` directory in project root
   - If not found, scaffold it from templates

3. **Scaffold component-harness** (if needed)
   Create the following structure:
   ```
   component-harness/
   ├── index.html
   ├── main.tsx
   ├── App.tsx
   ├── Gallery.tsx
   ├── ComponentErrorBoundary.tsx  # Per-component error catching
   ├── components/           # Generated components go here
   │   ├── Button.tsx
   │   ├── Card.tsx
   │   ├── ThemeSwitcher.tsx  # Multi-theme dropdown switcher
   │   └── ...
   ├── lib/
   │   ├── utils.ts          # cn() utility
   │   ├── theme-loader.ts   # loadThemes(), applyTheme()
   │   └── themes.json       # Build-time generated theme list
   ├── vite.config.ts
   ├── tailwind.config.ts
   ├── postcss.config.js
   ├── tsconfig.json
   ├── package.json
   ├── playwright.config.ts  # Playwright test configuration
   └── tests/
       └── components.spec.ts # Auto-discovery component tests
   ```

4. **Generate components from recipes (resumable)**
   - List all `.claude/component-recipes/*.md` files
   - For each recipe, check if matching `.tsx` component exists
   - Only generate missing components (skip existing ones)
   - Use tokens from `.claude/styling-config.json`
   - Update `components/index.ts` to export all components

5. **Validate completeness**
   - Count recipes vs generated components
   - If any missing, loop back to step 4
   - Only proceed when: `✓ [N]/[N] components generated`

6. **Install dependencies** (if package.json is new)
   ```bash
   cd component-harness && npm install
   ```

7. **Install Playwright browser** (first time only)
   ```bash
   cd component-harness && npx playwright install chromium
   ```

8. **Copy Playwright test templates**
   - If `.claude/playwright-templates/` exists, copy `playwright.config.ts` and `tests/` into `component-harness/`
   - If templates don't exist, the `playwright-tester` agent will scaffold them on demand

9. **Start dev server**
   ```bash
   cd component-harness && npm run dev
   ```

10. **Open browser**
    - Open `http://localhost:5173` (or configured port)

11. **Offer to run Playwright tests**
    - Ask: "Want me to run Playwright tests on all components?"
    - If yes, delegate to the `playwright-tester` agent
    - The agent discovers all components, tests rendering, a11y, and responsiveness
    - Results include per-component pass/fail and screenshots

## Harness Features

### Navigation
- Left/right chevron buttons to cycle through components
- Component name displayed in header
- Variant selector for components with multiple variants

### Live Preview
- Component rendered in isolated preview area
- Props can be adjusted in real-time
- Dark/light mode toggle via ThemeToggle component

### Theme System
The harness includes a multi-theme system with live switching:

**Theme discovery** - Loads all themes from `.claude/themes/*.json`:
```tsx
// lib/theme-loader.ts
export async function loadThemes(): Promise<Theme[]>
export function applyTheme(theme: Theme): void  // Injects CSS variables
```

**ThemeSwitcher component** - Dropdown in Gallery header:
```tsx
import { ThemeSwitcher } from './components/ThemeSwitcher'

// Shows all available themes from .claude/themes/
// Switching updates CSS variables instantly (no page reload)
// Persists selection to localStorage
```

**Features:**
- Discovers all `.claude/themes/*.json` files at build time
- Live theme switching via CSS variable injection
- No page reload required - instant visual update
- LocalStorage persistence of selected theme
- Theme preview on hover (optional)
- Light/dark mode toggle within each theme

### Change Requests
- "Request Change" button that:
  1. Prompts user to describe desired change
  2. Claude updates the recipe and regenerates component
  3. HMR updates the preview instantly

### Testing
- Run `npm test` in component-harness to test all components
- Tests auto-discover components from Gallery.tsx
- Per-component checks: renders, no console errors, a11y, responsive
- Screenshots saved to `test-results/screenshots/`
- HTML report at `test-results/reports/`

## Generated main.tsx Structure

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './lib/theme-context'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultMode="system">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
```

## Generated Gallery.tsx Structure

```tsx
// Core navigation and preview
- useState for currentComponentIndex
- Array of all components with their variants
- Left/Right chevron navigation
- Component name + variant display
- ThemeToggle in header for light/dark/system switching
- Isolated preview area
- "Request Change" button
```

## package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0",
    "@base-ui/react": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "@playwright/test": "^1.40.0",
    "@axe-core/playwright": "^4.8.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report test-results/reports"
  }
}
```

## Available Agents

These agents support the component harness workflow:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `harness-scaffolder` | Scaffolds the full harness from recipes | Initial setup or adding missing components |
| `playwright-tester` | Runs Playwright tests on all components | After scaffolding or making changes |
| `component-auditor` | Validates components match recipes + a11y | Before shipping, after generation |
| `design-token-validator` | Audits token compliance | After generating components |

$ARGUMENTS
