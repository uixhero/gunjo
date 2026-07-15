# @gunjo/ui

[![npm version](https://img.shields.io/npm/v/@gunjo/ui.svg)](https://www.npmjs.com/package/@gunjo/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**English** · [日本語](./README.ja.md)

*A design system from [UIXHERO](https://www.uixhero.com) — see the live [component gallery](https://www.uixhero.com/resources/ui-components).*

> ⚠️ **Pre-1.0.** The current `0.0.1-alpha.x` publish reserves the name and exercises the release pipeline. Until the `1.0.0` stable release the public API may change — pin your version and check the [CHANGELOG](./CHANGELOG.md) before upgrading.

**Gunjo (群青)** is an SSOT-driven React + Tailwind design system — 200+ components whose **pen design source, React source, and docs are verified to stay in sync**, and which are built to be used as comfortably by AI agents as by people.

## "Becoming" — about the name

*Gunjo (群青)* is a deep ultramarine from the traditional palette of Japanese color names. But the name points at a color **not yet blue — becoming blue**: the sky before dawn, ink before it dries. Not a finished blue, but one on its way there — a symbol of growth and open possibility. That *becoming* is the stance of the whole project: built in the age of AI, never quite finished, always arriving. The primary **群青 (ultramarine)** is grounded by a warm **媚茶 (kobicha)** accent — the earth that supports the becoming.

## Why Gunjo

- **One source of truth, enforced.** Every shipped component is checked across three axes — design source (`.pen`), implementation (`src/`), and documentation — by an automated drift pipeline (`npm run design:verify`). Tokens, variants, and visuals can't silently diverge.
- **Organized by what you build.** Components are grouped by function — Inputs · Display · Charts · Feedback · Navigation · Overlay · Layout — not by abstract tiers. All Radix-based, with accessibility (ARIA, keyboard) and dark mode built in.

## AI-consumable by design

Gunjo treats "an agent will read and use this" as a first-class requirement, not an afterthought:

- **Single typed entry point** — every public API is re-exported from `src/index.ts`, so `import { Button, Card } from '@gunjo/ui'` is all an agent (or a person) needs to discover the surface.
- **SSOT pipeline** — machine-readable component metadata (`design/*-metadata.json`) describes every component's variants and tokens.
- **AI-handoff surface** — a dedicated handoff section (`/ai-handoff` in the docs, with MCP and Figma guides) for agents to pick up the system. *(A published Figma library and an MCP server are on the roadmap.)*

## Quick start

```bash
npm install @gunjo/ui
```

```typescript
// components
import { Button, Input, Card } from '@gunjo/ui';
// styles
import '@gunjo/ui/styles';
// tailwind preset
import gunjoPreset from '@gunjo/ui/tailwind-preset';
```

> **Install & import:** `npm install @gunjo/ui` — the package ships compiled ESM + types from `dist/` (with `"use client"` boundaries preserved), so no `transpilePackages` / bundler config is needed on Next.js or Vite. See [docs/adoption.md](./docs/adoption.md).

**Adopting Gunjo in another project**

- [docs/adoption.md](./docs/adoption.md) — 5-minute install (start here)
- [docs/adoption-strategy.md](./docs/adoption-strategy.md) — distribution-format decision record
- [docs/migration-playbook.md](./docs/migration-playbook.md) — staged migration for existing apps
- [docs/dependencies.md](./docs/dependencies.md) — peer-dependency ranges and tested combinations
- [docs/versioning.md](./docs/versioning.md) — semver policy and breaking-change rules

**Extending Gunjo**

- [docs/component-addition.md](./docs/component-addition.md) — add a component across the SSOT three axes (pen + source + docs)

## Documentation site

```bash
npm install
npm run dev      # http://localhost:13030
```

The docs site dogfoods `@gunjo/ui` and is the canonical reference for every component, token, and pattern.

## How Gunjo was built

Gunjo is built on a simple division of labor — the kind we expect to become commonplace before long:

- **A human sets the philosophy and direction** — what to build, what matters, the aesthetic, every judgment call.
- **The system is built in collaboration with Claude** — implementation, exhaustive audits (accessibility, design tokens, visual drift across every component), and fast iteration.
- **And it is designed to be consumed by AI** — a single typed entry point, an SSOT pipeline, and an AI-handoff surface, so agents can read and use it as easily as people can.

This is not "an AI made a component library." It is one person setting the vision and iterating, in tight loops, with an AI partner — and being transparent about it, because we think that's the honest (and increasingly normal) way software gets made.

## Contributing & security

- [CONTRIBUTING.md](./CONTRIBUTING.md) — workflow, PRs, the SSOT three-axis flow
- [SECURITY.md](./SECURITY.md) — vulnerability reporting and supported versions
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [CLAUDE.md](./CLAUDE.md) — issue-driven working agreement (open an issue before non-trivial work)

Work is tracked on [GitHub Issues](https://github.com/uixhero/gunjo/issues).

## License

[MIT](./LICENSE) © 2026 4px LLC · built by [UIXHERO](https://www.uixhero.com)
