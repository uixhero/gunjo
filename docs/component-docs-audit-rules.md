# Component Docs Audit Rules

Last updated: 2026-07-01

Related issue: #253

This document records the reusable checks that must be applied when component docs are added, revised, or swept before release. Generated reports such as `docs/component-docs-checklist.md` and `docs/component-page-crawl-audit.md` are useful signals, but they do not replace these gates.

## Required Gates

### 1. GunjoUI Composition

Docs and preview examples must demonstrate GunjoUI itself.

- Prefer components exported from `@gunjo/ui` or existing demo helpers that compose those components.
- Do not ship app-local UI that only looks similar to a GunjoUI component.
- If a reusable control is missing, decide whether to add it to `src/components/**` and SSOT, or open a follow-up issue with the intended component name and scope.
- Check nearby implementations before creating new UI: `src/components/**`, `src/index.ts`, `app/components/demos/**`, `app/docs/components/**`, and `app/patterns/**`.

### 2. Tooltip and Disabled Feedback

Users must understand compact controls without guessing from icon shape alone.

- Icon-only buttons, state toggles, destructive actions, ambiguous compact controls, and disabled controls need GunjoUI tooltip behavior.
- Use `TooltipButton` when the trigger is a button.
- Use `Tooltip`, `TooltipTrigger`, and `TooltipContent` when the trigger needs custom composition.
- Disabled native controls should be wrapped in an enabled tooltip trigger so hover/focus can still explain the reason.
- Tooltip text and `aria-label` must match in meaning.

### 3. Preview and Code Parity

Copyable code must reproduce the visible preview.

- Include all data arrays, labels, state values, event handlers, and variant props shown in the preview.
- Avoid snippets that only import a component or hide required data in an undefined variable.
- Replace placeholder ellipses, fake `console.log` handlers, and no-op buttons with realistic local state or copy/toast feedback.
- If a demo is intentionally static, state that in the surrounding docs and keep the code static in the same way.

### 4. Preview Surfaces and Overlays

Docs previews must show realistic behavior without hiding problems in the preview frame.

- Do not use fixed preview heights to mask clipped content. If a component needs vertical room, the preview content itself must explain that usage pattern.
- Verify the top `ComponentPreview` iframe and the in-page States/Variants previews separately.
- Toasts, dialogs, popovers, scanner panels, and other overlays opened from a preview must render inside the preview surface when the component API supports a portal/container.
- Disabled follow-up actions must explain why they are unavailable on hover/focus, even if adjacent helper text repeats the same reason.
- When a workflow has multiple steps, keep the completed and next required work visible in the preview rather than replacing the whole surface with an ambiguous active-only input.

## Automated Checks

Run these for component docs batches:

```bash
npm run docs:audit:components
npm run docs:crawl:components
```

Use these when the batch touches the relevant areas:

```bash
npm run docs:audit:mobile-disabled-feedback
npm run docs:audit:command-palette
npm run docs:audit:en-locale-sweep
```

Always include the usual verification before merging:

```bash
npm run type-check
npm run design:verify
git diff --check
```

## Crawl Finding Policy

`npm run docs:crawl:components` writes `docs/component-page-crawl-audit.md` and JSON. The report should be read as route-level evidence.

- `code-missing`, `code-import-only`, `code-placeholder`, `code-console-action`, and `code-missing-data-definition` indicate preview/code parity work.
- `iframe-empty`, `preview-horizontal-overflow`, and `iframe-mobile-vertical-overflow` indicate preview sizing or responsive review work.
- `console-error` and request failures indicate runtime defects unless they are explicitly filtered as transient infrastructure noise.
- Each unresolved finding must keep the page route, viewport/theme when relevant, and preview surface name.

## Manual Review Log

When a finding cannot be fixed in the current PR, add a log row here or in the linked issue.

| Date | Scope | Component / Route | Surface | Gate | Finding | Action / Issue |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-06-10 | Crawler extension follow-up | `/docs/components/media-lightbox` | docs preview | Runtime | Hydration mismatch is still reported by the component crawl. | Track with overlay docs follow-up before release. |
| 2026-06-10 | Crawler extension follow-up | `/docs/components/media-picker-dialog` | docs preview | Runtime | Hydration mismatch is still reported by the component crawl. | Track with overlay docs follow-up before release. |
| 2026-06-10 | Crawler extension follow-up | `/docs/components/onboarding-flow` | docs preview | Runtime | Hydration mismatch is still reported by the component crawl. | Track with overlay docs follow-up before release. |
| 2026-06-10 | Crawler extension follow-up | Multiple component docs | Code tab | Preview/code parity | `code-*` warnings remain in the generated crawl report. | Use the route and surface names in `docs/component-page-crawl-audit.md` for the next code parity sweep. |

## Completion Criteria

A component docs batch is complete only when:

- Generated structure and crawl checks have been run, or a reason for skipping is recorded.
- GunjoUI composition has been checked for every changed preview.
- Tooltip and disabled feedback has been checked for every changed compact or disabled control.
- Preview/code parity has been checked for the docs preview and each States/Variants preview.
- The top preview and each States/Variants preview have been checked for clipping, overlay containment, and realistic task flow.
- Any deferred item is linked to a GitHub issue instead of remaining only in chat history.
