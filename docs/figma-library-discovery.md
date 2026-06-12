# Figma Library Discovery

Issue: #8

This document locks the first implementation plan for the GunjoUI Figma library.
Figma is a designer-facing distribution surface. The canonical SSOT remains
`.pen`, generated component specs, `src/`, and docs.

## Current Decision

Build the library in phases. Do not attempt a one-shot full library generation.

The first Figma file should mirror the public docs taxonomy:

- Cover
- Changelog
- Tokens
- Inputs
- Display
- Charts
- Feedback
- Navigation
- Overlay
- Layout
- Patterns

`Charts` is intentionally separate. Issue #8 lists the original functional
categories, but the current docs navigation and public component taxonomy expose
Charts as its own category.

## Source Chain

Use these local sources when creating or auditing the Figma file:

- Component page taxonomy: `app/lib/navigation.ts`
- Component visual/spec snapshots: `design/component-specs/*-core.json`
- Component descriptions: `design/*-metadata.json`
- Token source: `design/tokens.pen`
- Runtime CSS variables: `src/globals.css`
- Docs status copy: `app/docs/ai-handoff/figma/page.tsx`

Run this before a Figma work session:

```bash
npm run design:report:figma-library
```

Generated outputs:

- `docs/figma-library-discovery.generated.md`
- `docs/figma-library-discovery.generated.json`

The generated audit is the working checklist for page counts, variant gaps, and
manual completion scope.

## Scope Snapshot

As of the generated audit:

- Component targets: 162
- Variant targets: 226
- Components with empty variants: 46
- Synthetic variants: 120
- Unresolved pattern spec entries: 4
- `design/tokens.pen` variables: 43
- `src/globals.css` root variables: 95

The docs/navigation component count remains the public copy number source. Keep
hand-written prose at `150+`; do not publish a higher exact-sounding component
count from this discovery report.

## Token Scope

Recommended v1 token scope:

1. Create Figma variables from the 43 variables in `design/tokens.pen`.
2. Use Light/Dark modes where the same public CSS variable has a `.dark`
   override in `src/globals.css`.
3. Add runtime-only CSS variables from `src/globals.css` only when a Figma
   component needs the value for accurate rendering.
4. Keep brand atmosphere and palette variables as a documented secondary group,
   not as component-binding primitives unless a component uses them.

Reason: `tokens.pen` is the canonical design-source input. `src/globals.css`
contains additional runtime and docs-site values, so importing all 95 root
variables into Figma v1 would expand scope before the library components are
validated.

## Component Scope

Recommended v1 component sequence:

1. Foundations and pages only.
2. Inputs core: Button, TooltipButton, CopyButton, Input, Checkbox, Switch,
   RadioGroup, Select, Slider, Textarea.
3. Display core: Badge, Avatar, Separator, Card, Accordion, List, Table, Kbd,
   Img, Skeleton.
4. Navigation/Overlay core: Tabs, Breadcrumb, Pagination, Tooltip, Popover,
   DropdownMenu, Dialog, Sheet.
5. Charts and higher-order cards after variables and primitive components are
   validated.
6. Patterns last, using the component library as nested instances where possible.

Build one component or tightly related family per checkpoint. For each component:

- Match Figma page/name to docs and component specs.
- Mirror variant keys from `design/component-specs/*-core.json`.
- Bind fills, strokes, radius, spacing, and text values to variables where the
  token exists.
- Validate with Figma metadata and screenshots before moving to the next family.

## Known Gaps

- Some spec entries are `synthetic:*`; they are useful inventory markers, not
  publish-ready visual components.
- Components with empty variants require manual design completion before they can
  satisfy issue #8 acceptance.
- `patterns-core.json` currently has null entries for Pricing, Blog, Docs, and
  Onboarding templates. Treat those as follow-up pattern spec work, not Figma
  library blockers for the first MVP file.
- Figma library publishing itself depends on owner/team permissions and should be
  performed or confirmed by a human owner after QA.
- `.pen` to Figma automatic export is a follow-up project, not part of the first
  publishable library scope.

## Effort Estimate

- Discovery and scope lock: 0.5-1 day.
- Foundations in Figma: 1-2 days.
- Core MVP library, 25-35 components: 4-8 days.
- Full category pass: 3-6 weeks, depending on how many synthetic and empty
  variants must be completed rather than represented as placeholders.
- Automatic exporter or drift checker against Figma: separate follow-up.

## Exit Criteria for the Next PR

The next PR after this discovery should create or update a Figma file and stop at
Foundations:

- Pages exist with the taxonomy listed above.
- Token variables exist for the agreed v1 scope.
- Text and effect styles are created where needed.
- A screenshot or Figma URL is recorded in the issue or PR.
- No docs copy claims that Figma is the canonical SSOT.
