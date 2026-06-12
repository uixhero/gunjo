import type { DocContent, SectionLabels } from "./types";
import { componentContentEn } from "./component-content-en";

export const sectionLabelsEn: SectionLabels = {
  props: "Props",
  usage: "Usage",
  preview: "Preview",
  code: "Code",
  viewDocumentation: "View Documentation",
  openExample: "Open Example",
  fullScreen: "Full Screen",
  examples: "Examples",
  usedComponents: "Used Components:",
  relatedComponents: "Related Components:",
  copySpecForAi: "Copy spec for AI",
  copied: "Copied",
  copyFailed: "Copy failed",
};

export const contentEn: Record<string, DocContent> = {
  introduction: {
    title: "Introduction",
    description: "An SSOT-driven React + Tailwind design system for rich, data-dense applications. 150+ components, three-axis verified (Pen / source / docs).",
    body: `GunjoUI is built around a single source of truth: design tokens and component variants are derived from \`.pen\` design files and synchronized into TypeScript implementation, structured JSON specs, and docs registration. Every primitive is verified across Pen / source / docs. It does not fully auto-generate every page from \`.pen\`; instead, it keeps design data, implementation, and documentation aligned through sync and verification.

It uses **Radix UI** primitives for accessibility and **Tailwind CSS** for styling. Distributed as **\`@gunjo/ui\`** on npm — currently early alpha (\`0.0.1-alpha.1\`), API may change before 1.0 stable.

### Adoption modes

You can use GunjoUI two ways depending on how much you want to own:

- **Install as a dependency** (recommended) — \`npm install @gunjo/ui\`. Get updates via semver, lock to a version when stable.
- **Copy & paste** — fork specific components into your repo when you need to customize beyond the props surface. The code is yours either way.

Pick what fits. The npm path is faster; the copy path gives you full control.`,
  },
  installation: {
    title: "Installation",
    description: "Install @gunjo/ui in an existing Next.js or Vite + React project.",
    body: `### Prerequisites

- Node.js 20+
- React 19+ (the package's only React peer is \`^19.0.0\` — React 18 is not supported)
- Tailwind CSS v3 or v4
- TypeScript recommended (the package ships TS source directly, so the \`transpilePackages\` setting in step 2 is required)
- Next.js 15+ (16 recommended) or Vite + React

### 1. Install the package

\`\`\`bash
npm install @gunjo/ui
\`\`\`

> **Alpha note:** \`0.0.1-alpha.x\` is published for dry-run adoption. The API can still change before \`1.0.0\`.

### 2. Configure Next.js (required)

\`@gunjo/ui\` ships TypeScript source directly (\`main: "src/index.ts"\`), so your Next.js project has to transpile it. In \`next.config.ts\`:

\`\`\`ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gunjo/ui"],
};

export default nextConfig;
\`\`\`

Skip this and the build dies with \`SyntaxError: Unexpected token\`. For Vite, add \`optimizeDeps.include: ["@gunjo/ui"]\` to \`vite.config.ts\`.

### 3. Wire up the Tailwind preset

#### Tailwind v4 (recommended)

In \`app/globals.css\`:

\`\`\`css
@import "tailwindcss";
@config "../node_modules/@gunjo/ui/tailwind-preset.js";
@source "../node_modules/@gunjo/ui/src/**/*.{ts,tsx}";
@import "@gunjo/ui/styles";
\`\`\`

\`@source\` is required so Tailwind scans the library's class names too.

#### Tailwind v3

In \`tailwind.config.ts\`:

\`\`\`ts
import type { Config } from "tailwindcss";
import gunjoPreset from "@gunjo/ui/tailwind-preset";

const config: Config = {
  presets: [gunjoPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@gunjo/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
\`\`\`

Then import the token CSS once in \`app/globals.css\` (after the Tailwind directives):

\`\`\`css
@import "@gunjo/ui/styles";
\`\`\`

### 4. Use a component

\`app/page.tsx\`:

\`\`\`tsx
import { Button, Card, CardHeader, CardContent } from "@gunjo/ui";

export default function Page() {
  return (
    <main className="p-8">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Gunjo UI is wired up</h2>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </CardContent>
      </Card>
    </main>
  );
}
\`\`\`

\`npm run dev\` and the buttons render with Gunjo UI styles.

### Troubleshooting

- **Build fails with \`SyntaxError: Unexpected token\`** → \`transpilePackages\` is missing in \`next.config.ts\` (step 2).
- **Tailwind classes don't apply** → the \`@source\` (v4) or \`content\` glob (v3) for \`node_modules/@gunjo/ui/src/**/*\` is missing.
- **Everything renders pure black or white** → \`@import "@gunjo/ui/styles"\` is missing or comes before \`@import "tailwindcss"\`.

### Beyond install

Dark mode (\`next-themes\`), Vite specifics, fonts, and the migration playbook live in the [Adoption Guide](/docs/adoption). Theme tokens you can override are documented in [Theming](/docs/theming).`,
  },
  theming: {
    title: "Theming",
    description: "Override Gunjo UI's CSS variables to customize the system.",
    body: `Gunjo UI exposes every color, radius, shadow, and motion value as a CSS variable. Change a value in your own \`:root\` or \`.dark\` block and every component picks it up — no recompiling Tailwind, no fork.

### Convention

Variables are kebab-cased and HSL-encoded as \`H S% L%\` triplets (no \`hsl()\` wrapper). That lets Tailwind compose them with opacity (\`hsl(var(--primary) / 0.5)\`).

The semantic tokens (the ones components actually consume) are paired:

- \`--background\` / \`--foreground\` — page surface and primary text
- \`--card\` / \`--card-foreground\` — Card surface and its text
- \`--popover\` / \`--popover-foreground\` — floating surfaces (Tooltip, Popover, DropdownMenu)
- \`--primary\` / \`--primary-foreground\` — Gunjō blue and the text that sits on it
- \`--secondary\` / \`--secondary-foreground\` — quiet surface and its text
- \`--muted\` / \`--muted-foreground\` — backgrounds and secondary text
- \`--accent\` / \`--accent-foreground\` — Kobicha-tinted hover/selection
- \`--destructive\` / \`--destructive-foreground\` — error / dangerous-action color
- \`--border\` / \`--input\` / \`--ring\` — outlines and focus states
- \`--radius\` — base border-radius scale

### Brand atmosphere tokens

These are theme-independent (do not flip in dark mode) — they're used by the home hero and color-story art so the brand identity stays constant:

- \`--gunjo-deep / -deeper / -deepest / -light / -mid / -bright / -dark\` — Gunjō blue palette
- \`--kobicha-warm / -mid / -bright / -deepest\` — Kobicha brown palette
- \`--pure-white\`, \`--pure-black\`

### Defaults (light mode)

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 240 20% 6%;

  --card: 0 0% 100%;
  --card-foreground: 240 20% 6%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 20% 6%;

  --primary: 232 39% 49%;            /* Gunjō blue */
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96%;
  --secondary-foreground: 240 6% 10%;

  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  --accent: 29 31% 87%;              /* Kobicha-tinted */
  --accent-foreground: 14 22% 19%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;

  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 232 39% 49%;

  --radius: 0.5rem;
}
\`\`\`

### Dark overrides

\`\`\`css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 232 47% 65%;            /* lifted Gunjō for contrast on dark */
  --primary-foreground: 210 40% 98%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 14 22% 19%;
  --accent-foreground: 29 31% 87%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 232 47% 65%;
}
\`\`\`

The full canonical list (including shadow and motion tokens) is in \`src/globals.css\` and is generated from \`design/tokens.pen\`. To override, redeclare the variable in your own \`globals.css\` **after** \`@import "@gunjo/ui/styles"\`.`,
  },
  colors: {
    title: "Colors",
    description: "Our color system is divided into Brand, Neutral, and Semantic palettes.",
  },
  typography: {
    title: "Typography",
    description: "Styles for headings, paragraphs, lists...etc",
  },
  spacing: {
    title: "Spacing",
    description: "Consistent spacing scale for margins, paddings, and layout.",
  },
  shadows: {
    title: "Shadows",
    description: "Elevation and depth tokens.",
  },
  radius: {
    title: "Radius",
    description: "Border radius tokens for smoothing corners.",
  },
  animation: {
    title: "Animation",
    description: "Duration and easing tokens for smooth transitions.",
  },
  components: {
    title: "Components",
    description:
      "A comprehensive collection of pre-built components for rich, desktop-class web applications. Install via @gunjo/ui or copy individual primitives into your project — see Introduction for the trade-off.",
  },
  ...componentContentEn,
};
