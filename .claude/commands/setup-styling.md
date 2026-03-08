Define your unique UI aesthetic for consistent component generation.

This command creates a personalized styling system. Once configured, the `styling` skill will automatically apply these tokens and recipes when generating UI components.

## Workflow

1. **Check existing progress** - Resume from where we left off:

   ```bash
   npx validate-config
   ```

   - If config valid → check recipes
   - If config missing/invalid → start fresh from step 2

   For recipes, check each required file exists and has content (not empty):
   - Required: button.md, card.md, input.md, badge.md, dialog.md
   - If all exist with content → skip to step 8 (harness question)
   - If some missing → generate only the missing ones in step 6

2. **Ask setup method** using AskUserQuestion tool:

   **Q0: How do you want to define your styling?**
   - Options:
     - [Extract from URL (Recommended)] - Analyze an existing website's design system
     - [Manual configuration] - Answer questions about colors, typography, etc.

### If "Extract from URL" selected:

Delegate to the `style-inspector` agent:

1. **Ask for URL**: "What website do you want to extract styling from?"

2. **Run the style-inspector agent** — This agent handles the full extraction workflow:
   - Technology detection (Wappalyzer, CRFT Lookup, or browser script)
   - Design token extraction (Dembrandt CLI → Superposition → browser script fallback)
   - Semantic interpretation with confidence scoring
   - Translation to styling-config.json format with user's aesthetic flair

3. **Review agent output** — The style-inspector returns structured findings with extracted tokens, detected patterns, and any gaps that need manual resolution.

4. **Generate themeName** from the source (e.g., "stripe-inspired", "vercel-dark")

5. **Generate config** with source attribution, then skip to step 5 (generate recipes).

---

### If "Manual configuration" selected:

3. **Ask styling questions** using AskUserQuestion tool:

   **Q1: Describe your desired aesthetic** (Free text)
   - "Describe the look and feel you want (e.g., 'dark terminal hacker vibe', 'soft pastels for kids app', 'clean minimal SaaS')"

   **Q2: Typography Configuration**

   Q2a: Heading font style
   - Options: [Geometric sans (modern, clean)] [Humanist sans (friendly, approachable)] [Serif (editorial, classic)] [Monospace (technical, retro)] [Enter custom font name]

   Q2b: Body font style
   - Options: [System stack (fastest loading)] [Clean sans (readable)] [Match heading font] [Enter custom font name]

4. **Generate tokens from description**

   Interpret the user's description and generate appropriate token values directly. Use these reference tables as guidance:

   ### Color Keyword Reference

   | Keywords | Base Color |
   |----------|------------|
   | ocean, sky, clean, calm | #0EA5E9 |
   | navy, corporate, trust | #1E3A8A |
   | forest, nature | #166534 |
   | emerald, fresh, growth | #10B981 |
   | coral, warm, friendly | #F97316 |
   | violet, creative, innovative | #8B5CF6 |
   | rose, playful, bold | #F43F5E |
   | slate, minimal, neutral | #64748B |
   | professional, modern, tech | #3B82F6 |
   | luxury, premium, elegant | #7C3AED |
   | earthy, natural, organic | #78716C |
   | teal, balanced, health | #14B8A6 |
   | indigo, deep, focused | #6366F1 |
   | amber, energy, attention | #F59E0B |
   | terminal, hacker, matrix | #00FF41 |
   | cyberpunk, neon | #FF00FF |

   ### Radii Reference

   | Feel | sm | md | lg | xl | 2xl | default |
   |------|-----|-----|-----|-----|------|---------|
   | Sharp/pixel | 0 | 0 | 0 | 0 | 0 | none |
   | Subtle | 0.125rem | 0.25rem | 0.375rem | 0.5rem | 0.75rem | sm |
   | Rounded | 0.25rem | 0.375rem | 0.5rem | 0.75rem | 1rem | md |
   | Pill/playful | 0.5rem | 0.75rem | 1rem | 1.5rem | 2rem | xl |

   ### Shadow Reference

   | Feel | sm | md | lg | glow |
   |------|-----|-----|-----|------|
   | Flat | none | none | none | none |
   | Subtle | 0 1px 2px 0 rgb(0 0 0 / 0.05) | 0 4px 6px -1px rgb(0 0 0 / 0.1) | 0 10px 15px -3px rgb(0 0 0 / 0.1) | 0 0 10px rgb(0 0 0 / 0.1) |
   | Pronounced | 0 2px 4px rgb(0 0 0 / 0.15) | 0 8px 12px rgb(0 0 0 / 0.2) | 0 20px 30px rgb(0 0 0 / 0.25) | 0 0 20px rgb(0 0 0 / 0.3) |

   ### Typography Reference

   **Heading Fonts:**
   | Style | Font Stack |
   |-------|------------|
   | Geometric sans | `"Plus Jakarta Sans", "Outfit", sans-serif` |
   | Humanist sans | `"Source Sans 3", "Nunito Sans", sans-serif` |
   | Serif | `"Lora", "Merriweather", serif` |
   | Monospace | `"JetBrains Mono", "Fira Code", monospace` |
   | Terminal/retro | `"VT323", monospace` |

   **Body Fonts:**
   | Style | Font Stack |
   |-------|------------|
   | System stack | `ui-sans-serif, system-ui, -apple-system, sans-serif` |
   | Clean sans | `"Inter var", "DM Sans", sans-serif` |

   ### Color Scale Generation

   From the base color, generate a 50-950 scale by adjusting lightness:

   ```
   50:  97% lightness (very light tint)
   100: 94% lightness
   200: 86% lightness
   300: 76% lightness
   400: 62% lightness
   500: Base color lightness
   600: Base - 10% lightness
   700: Base - 20% lightness
   800: Base - 30% lightness
   900: Base - 40% lightness
   950: Base - 50% lightness (very dark shade)
   ```

   ### Color Resolution

   **Light theme** (light backgrounds):
   - `background` → gray.50
   - `foreground` → gray.900
   - `primary` → primary.600
   - `primary-foreground` → gray.50
   - `surface` → gray.100
   - `muted` → gray.200
   - `muted-foreground` → gray.500
   - `border` → gray.200

   **Dark theme** (dark backgrounds):
   - `background` → gray.950
   - `foreground` → gray.50
   - `primary` → primary.500
   - `primary-foreground` → gray.950
   - `surface` → gray.900
   - `muted` → gray.800
   - `muted-foreground` → gray.400
   - `border` → gray.700

5. **Generate config and save theme**

   Generate a `themeName` from the user's description (e.g., "ocean-minimal", "terminal-dark", "pastel-playful").

   **Save to TWO locations:**
   - `.claude/styling-config.json` - active config (full structure)
   - `.claude/themes/{themeName}.json` - saved theme (for theme switcher)

   Config structure:

```json
{
  "themeName": "<generated-from-prompt>",
  "tokens": {
    "colors": {
      "primary": "#...",
      "primary-foreground": "#...",
      "secondary": "#...",
      "secondary-foreground": "#...",
      "background": "#...",
      "foreground": "#...",
      "surface": "#...",
      "muted": "#...",
      "muted-foreground": "#...",
      "border": "#...",
      "destructive": "#dc2626",
      "destructive-foreground": "#...",
      "accent": "#...",
      "accent-foreground": "#...",
      "success": "#16a34a",
      "success-foreground": "#...",
      "warning": "#f59e0b",
      "warning-foreground": "#..."
    },
    "radii": {
      "none": "0",
      "sm": "...",
      "md": "...",
      "lg": "...",
      "xl": "...",
      "2xl": "...",
      "full": "9999px",
      "default": "..."
    },
    "shadows": {
      "none": "none",
      "sm": "...",
      "md": "...",
      "lg": "...",
      "xl": "...",
      "glow": "..."
    },
    "spacing": {
      "tight": "1",
      "normal": "2",
      "loose": "4"
    },
    "typography": {
      "families": {
        "heading": { "name": "...", "stack": "...", "variable": "--font-heading" },
        "body": { "name": "...", "stack": "...", "variable": "--font-body" },
        "code": { "name": "JetBrains Mono", "stack": "'JetBrains Mono', ui-monospace, monospace", "variable": "--font-code" }
      },
      "scale": {
        "xs": { "size": "0.75rem", "lineHeight": "1rem", "letterSpacing": "0.025em" },
        "sm": { "size": "0.875rem", "lineHeight": "1.25rem", "letterSpacing": "0.015em" },
        "base": { "size": "1rem", "lineHeight": "1.5rem", "letterSpacing": "0" },
        "lg": { "size": "1.125rem", "lineHeight": "1.75rem", "letterSpacing": "-0.01em" },
        "xl": { "size": "1.25rem", "lineHeight": "1.75rem", "letterSpacing": "-0.015em" },
        "2xl": { "size": "1.5rem", "lineHeight": "2rem", "letterSpacing": "-0.02em" },
        "3xl": { "size": "1.875rem", "lineHeight": "2.25rem", "letterSpacing": "-0.025em" },
        "4xl": { "size": "2.25rem", "lineHeight": "2.5rem", "letterSpacing": "-0.03em" },
        "5xl": { "size": "3rem", "lineHeight": "1", "letterSpacing": "-0.035em" },
        "6xl": { "size": "3.75rem", "lineHeight": "1", "letterSpacing": "-0.04em" }
      },
      "weights": { "normal": "400", "medium": "500", "semibold": "600", "bold": "700" },
      "tracking": { "tighter": "-0.05em", "tight": "-0.025em", "normal": "0", "wide": "0.025em", "wider": "0.05em", "widest": "0.1em" },
      "leading": { "none": "1", "tight": "1.25", "snug": "1.375", "normal": "1.5", "relaxed": "1.625", "loose": "2" },
      "googleFonts": { "url": "...", "preconnect": true },
      "classes": {
        "h1": "font-heading text-4xl font-bold tracking-tight",
        "h2": "font-heading text-3xl font-semibold tracking-tight",
        "h3": "font-heading text-2xl font-semibold",
        "h4": "font-heading text-xl font-semibold",
        "h5": "font-heading text-lg font-medium",
        "h6": "font-heading text-base font-medium tracking-wide",
        "body": "font-body text-base leading-relaxed",
        "caption": "font-body text-xs text-muted-foreground tracking-wide",
        "label": "font-body text-sm font-medium tracking-wide",
        "code": "font-mono text-sm"
      },
      "accessibility": {
        "minBodySize": "16px",
        "minLineHeight": "1.5",
        "preferredLineLength": "65ch"
      }
    }
  }
}
```

6. **Generate `.claude/component-recipes/`** directory with recipes:
   - button.md, card.md, input.md, modal.md, select.md
   - checkbox.md, radio.md, badge.md, alert.md, avatar.md
   - tooltip.md, table.md, tabs.md, accordion.md, dialog.md, toast.md

   Each recipe uses semantic tokens (bg-primary, text-foreground, border-border, etc.)

7. **Validate the config**:
   ```bash
   npx validate-config
   ```
   If validation fails, fix the issues and re-run until it passes.

8. **Ask about component-harness**: "Want me to scaffold the visual component-harness for previewing?"

## Recipe Template

```markdown
# [Component] Component Recipe

## Structure
- HTML element to use
- Supported variants
- Supported sizes
- Required states (loading, disabled, etc.)

## Tailwind Classes
### Base
[classes using semantic tokens: bg-background, text-foreground, border-border]

### Variants
[variant-specific classes using semantic tokens]

### Sizes
[size-specific classes]

### States
[hover, focus, disabled using semantic tokens]

## Props Interface
[TypeScript interface]

## Do
- Use semantic color tokens (bg-primary, not bg-blue-500)
- Include focus-visible states for accessibility
- Use cn() utility for class merging

## Don't
- Hardcode colors (#hex or rgb values)
- Skip hover/focus states
- Forget cursor-pointer on interactive elements

## Example
[Complete code example using semantic tokens]
```

## CSS Variables

The harness maps design tokens to CSS variables:

```css
:root {
  /* Border Radius Scale */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
  --radius: var(--radius-md);  /* default radius */

  /* Shadow/Elevation Scale */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 15px rgb(0 0 0 / 0.1);

  /* Font Families */
  --font-heading: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-code: "JetBrains Mono", ui-monospace, monospace;

  /* Type Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;

  /* Semantic Colors (from tokens.colors) */
  --color-background: #...;
  --color-foreground: #...;
  --color-primary: #...;
  --color-primary-foreground: #...;
  /* etc. */
}
```

## Tailwind Config Extension

Add design tokens to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: 'var(--color-warning-foreground)',
        },
        border: 'var(--color-border)',
        surface: 'var(--color-surface)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-code)'],
      },
    },
  },
}
```

$ARGUMENTS
