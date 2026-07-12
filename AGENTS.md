# AGENTS.md — Gunjo UI agent rules

このファイルは Codex などの AI エージェントが、このリポジトリで作業する前に確認する作業規約です。

## GunjoUI components first

GunjoUI の docs / patterns サイトは GunjoUI 自体を説明・検証するためのサイトです。新しい UI を実装する前に、必ず既存の GunjoUI コンポーネントを確認してください。

確認対象:

- `src/components/**`
- `src/index.ts`
- `app/lib/navigation.ts`
- `app/docs/components/**`
- 近い用途の `app/components/demos/**` と `app/patterns/**`

ルール:

- 既存コンポーネントで表現できる場合は、それを compose して使う。
- app-local な見た目だけ似たコンポーネントや one-off styling を作らない。
- 足りない挙動がある場合は、まず `@gunjo/ui` 本体のコンポーネントとして追加・修正できるか判断する。
- まだ `@gunjo/ui` に登録されていない UI を pattern 内で先行実装する場合は、「この場だけの対応」ではなく「後で `@gunjo/ui` に登録する予定の候補」として扱う。登録予定・責務・再利用範囲をコメント、issue、または作業メモで明示する。
- その UI が特定ページだけの一時的な見せ方なのか、デザインシステム全体に必要な primitive / composition なのかを実装前に切り分ける。全体に必要ならローカルに閉じず、正式コンポーネント化または issue 化する。
- 本体修正が重い、SSOT 更新が必要、または別 PR に分けるべき場合は GitHub issue を切り、暫定対応の範囲を明記する。
- `src/components/**` を変更した場合は SSOT / design sync / docs registry の同期対象として扱う。

## Icon and toggle button tooltips

Icon-only buttons, compact icon buttons, and buttons that toggle UI state must expose their action with GunjoUI tooltip behavior. Do not rely on the icon alone.

Rules:

- Prefer `TooltipButton` from `@gunjo/ui` when the trigger is a button.
- Use `Tooltip`, `TooltipTrigger`, and `TooltipContent` from `@gunjo/ui` when the trigger is not a button or needs a custom composition.
- Keep `aria-label` and tooltip text aligned in meaning.
- Apply this to sidebar toggles, viewport toggles, theme toggles, toolbar icon buttons, card hover actions, and similar compact controls.
- If the button already has visible text, a tooltip is still required when the icon represents a stateful or destructive/ambiguous action.
- Do not create one-off tooltip styling. Fix or extend the GunjoUI `Tooltip` component if the default behavior is insufficient.

## Disabled control feedback

Disabled UI must explain why it is unavailable. Users should not have to infer the reason from styling alone.

Rules:

- Use GunjoUI `Tooltip`, `TooltipTrigger`, and `TooltipContent` to show the disabled reason on hover/focus.
- If a native disabled element cannot receive hover/focus, wrap it in an enabled element and make that wrapper the `TooltipTrigger`; keep the actual control disabled.
- Adjacent helper text can repeat the reason, but it does not replace the tooltip when the disabled control itself is the visible interaction target.
- Do not create one-off disabled tooltip styling. Fix or extend GunjoUI tooltip/control APIs if the default composition is insufficient.

## Mobile input focus

GunjoUI inputs must not trigger mobile browser zoom on focus.

Rules:

- On narrow/mobile viewports, text-like `input`, `textarea`, and `select` controls need an effective font size of at least 16px.
- Do not fix iOS focus zoom one component at a time if the issue is shared. Prefer the GunjoUI global/input primitive layer so `CommandInput`, `Input`, `SearchInput`, `Textarea`, `NumberInput`, and form-like compositions stay consistent.
- When verifying a mobile input issue, inspect computed font size on the actual focused control inside the relevant docs iframe or page, not only the parent preview container.

## Component docs preview verification

Component docs use both the top `ComponentPreview` iframe (`/embed/*`) and in-page States/Variants previews. Treat them as separate surfaces.

Rules:

- When a user reports "docs preview", "FIT", or preview width/height issues, inspect the top iframe content itself, not only the States/Variants DOM on the parent page.
- Verify the rendered size inside the iframe: the `[data-embed-preview-wrap]` width, its direct child width, and the component root width. A passing parent-page width does not prove the iframe content is correct.
- Do not fix repeated docs preview width issues by changing individual demo `max-w-*` classes first. Check `app/components/doc/ComponentHelpers.tsx` and `app/embed/EmbedPreviewFrame.tsx` for shared sizing behavior before applying page-local changes.
- In FIT mode, embedded preview children must not shrink to content width accidentally. If the selected `previewBodyWidth` is wide, the direct embed child should be able to fill that width unless the component intentionally demonstrates compact sizing.

## Component docs audit gates

Every component docs change must satisfy the reusable audit gates below. Do not treat a generated checklist pass as enough by itself.

Rules:

- Verify GunjoUI composition: examples and preview controls should use existing `@gunjo/ui` components instead of hardcoded app-local UI. If a missing reusable UI is discovered, add it to GunjoUI or create/link a follow-up issue.
- Verify tooltip coverage: icon-only buttons, ambiguous compact controls, state toggles, destructive actions, disabled controls, and controls whose outcome is not visible from text alone must expose GunjoUI tooltip behavior.
- Verify preview/code parity: copyable code must include the data, labels, handlers, and variant props needed to reproduce the visible preview. Do not leave code snippets with import-only bodies, placeholder ellipses, missing data arrays, or `console.log` as the final action.
- Run `npm run docs:crawl:components` when a docs batch changes. Treat `code-*`, iframe, overflow, and console findings as component/page-level follow-ups with route and surface names.
- When a finding is intentionally deferred, record the component, route, preview surface, reason, and issue number in the audit log. Do not rely on chat memory.

## Sustainable preview and overlay fixes

GunjoUI is a design system, so docs and preview pages must verify reusable component behavior rather than hide layout defects with one-off sizing.

Rules:

- Do not fix clipped dropdowns, popovers, tooltips, drawers, menus, or other overlays by adding arbitrary fixed heights or `min-h-*` to the docs preview, demo wrapper, or page section.
- If an overlay is clipped, first inspect overflow, portal/container behavior, viewport positioning, collision handling, and component root sizing. Fix the shared docs preview helper or the `@gunjo/ui` component behavior when the issue is systemic.
- Repeated failure pattern to avoid: adding preview height to reveal an overlay, then moving the trigger into an unnatural position, then reintroducing clipping. A passing fix must keep the trigger in a realistic usage position and prove the opened overlay is fully visible.
- For overlays, verify the open state in the actual docs preview iframe and in States/Variants. Check trigger position, overlay bounding box, portal root, nearest overflow ancestor, available viewport, and collision side/align before changing height.
- Use extra preview height only when the component itself is intentionally height-dependent and that height is part of the documented scenario, such as a scroll area, virtualized list, full-page template, or fixed-size device frame. Document that intent in the demo configuration.
- Page-local layout changes are acceptable only when they describe the actual component usage pattern. They must not be used as a workaround for overlay containment, collision, or viewport bugs.
- When a workaround seems necessary, stop and identify whether the sustainable fix belongs in `src/components/**`, `app/components/doc/**`, or an issue for a larger API/design change.

## Pattern viewport and overlay containment

Patterns use the fake browser frame in `app/patterns/_lib/MarqueeChrome.tsx` and `app/patterns/_lib/DeviceFrame.tsx`. Treat this frame as the active application viewport, not as a decorative wrapper.

Rules:

- Pattern content must size itself from the `MarqueeViewport` passed by `MarqueeChrome`, not from the real browser window.
- Dialogs, popovers, dropdowns, sheets, lightboxes, and overlays opened from inside a pattern must stay inside the fake browser viewport.
- For overlay components that support a container, pass the fake browser or pattern root as `portalContainer`.
- Avoid `vw`, `vh`, and `position: fixed` as the only sizing/positioning strategy inside patterns. When a portal container is used, prefer container-relative sizing such as `width: calc(100% - 2rem)` and absolute positioning scoped to that container.
- If an existing GunjoUI overlay component cannot stay contained in the fake viewport, fix the GunjoUI component API/behavior first when scoped and safe. Do not add one-off pattern-only overlay workarounds as the final state.
