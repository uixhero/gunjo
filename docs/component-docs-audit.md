# Component Docs Audit

Last updated: 2026-06-03

## Goal

GunjoUI を公開できる状態に近づけるため、`/docs/components` を先に整備する。Patterns は重要だが、コンポーネントそのものではなく GunjoUI コンポーネントを組み合わせた画面単位の見せ方なので、コンポーネント監査とは分けて扱う。

Related: `docs/docs-site-information-architecture.md` defines the page types, value, required content, and review system for the whole docs site. This audit focuses on `/docs/components` coverage and sweep planning.

Content guidance: `docs/content-guidelines.md` defines GunjoUI voice, tone, message patterns, Japanese/English copy rules, disabled reasons, destructive confirmations, and UI copy review criteria. Public page: `/docs/guidelines/writing`.

Tracking:

- Parent issue: #202 `docs: component audit and public readiness plan`
- Inventory issue: #216 `docs: generate component docs inventory and rollout report`
- Page structure issue: #203 `docs: standardize component page structure`
- Content guidelines issue: #234 `docs: define GunjoUI content guidelines and message catalog`
- Message catalog expansion issue: #235 `メッセージ一覧を実運用レベルまで拡充する`
- Component copy audit issue: #236 `既存コンポーネント文言を文言ガイド基準で棚卸しする`
- Template integration issue: #237 `文言ガイドを docs テンプレートの確認項目に組み込む`
- Image alt text guidance issue: #239 `docs: 画像の代替テキストルールを文言ガイドへ組み込む`

## Current Inventory

Component docs inventory report: `docs/component-docs-inventory.md`

Component docs review checklist: `docs/component-docs-checklist.md`

Reusable audit gates: `docs/component-docs-audit-rules.md`

Pattern docs inventory report: `docs/pattern-docs-inventory.md`

Pattern docs review checklist: `docs/pattern-docs-checklist.md`

Latest component summary:

- Component docs pages: 150
- Pages with no detected gaps: 127
- Pages with Usage: 138
- Pages with Usage code copy: 127
- Pages with Used Components: 129
- Pages with Related Components: 128

Latest pattern summary:

- Pattern docs pages: 15
- Pages with no detected pattern-doc gaps: 2
- Pages with Pattern route link: 2
- Pages importing GunjoUI components: 15

The component inventory excludes `Patterns`. The generated docs page count still includes aggregate/helper pages such as `charts` and `tokens` under `Uncategorized`; those are not reusable component detail pages and should be handled separately if they keep causing audit noise.

Notes:

- The docs left sidebar should show component categories as component documentation and expose `Patterns` as a single link to `/patterns`.
- Pattern docs can keep `/docs/components/<slug>` pages as explanation and code entry points, but `/patterns/<slug>` is the primary surface for visual and responsive review.
- Pattern review must focus on page composition, fake-browser viewport sizing, overlay containment, GunjoUI component composition, and code/preview consistency.
- `Used Components` and `Related Components` remain component-doc requirements. They are not used as the primary readiness metric for pattern pages.

## Competitive Framework Research

Issue: #210

Before locking the new docs structure, benchmark mature component libraries and design systems. The goal is not to copy their visual language, but to catch missing documentation patterns, component taxonomy gaps, and AI/developer workflow affordances that GunjoUI should support.

Initial references:

| Framework | Why it matters for GunjoUI | Primary docs |
| --- | --- | --- |
| shadcn/ui | Strong component + blocks model, registry-oriented distribution, practical copy/paste examples. | https://ui.shadcn.com/docs/components, https://ui.shadcn.com/docs/_blocks |
| Radix Themes | Accessible primitives with concise component taxonomy and predictable theming. | https://www.radix-ui.com/themes/docs/components |
| Chakra UI | Large component catalog with AI/MCP-oriented docs affordances and "copy page" behavior. | https://chakra-ui.com/docs/components/concepts/overview |
| MUI / MUI X | Mature props/API documentation, component categories, advanced data components. | https://mui.com/material-ui/all-components/ |
| Ant Design / Ant Design Pro | Enterprise-oriented categories, rich data-entry and data-display coverage, Pro components. | https://ant.design/components/overview/ |
| Atlassian Design System | Strong guidance for component roles, patterns, primitives, accessibility, and product-scale navigation. | https://design-system-docs-proxy.services.atlassian.com/components |
| IBM Carbon | Public-ready component docs with accessibility status, feature flags, and system-level consistency guidance. | https://carbondesignsystem.com/components/overview/components/ |
| Adobe Spectrum / React Spectrum | Accessibility, adaptive behavior, internationalization, and collection components. | https://react-spectrum.adobe.com/v3/index.html |
| Mantine | Broad component + hooks coverage and explicit AI docs/MCP/llms.txt workflow. | https://mantine.dev/ |
| Tremor / Tremor Raw | Dashboard and chart-specific component patterns. | https://www.tremor.so/docs/getting-started/installation |

Research questions:

- Which sections should every component page always have, and which should be conditional by component type?
- How do mature systems expose props, states, accessibility, theming, related components, and usage guidance?
- How do blocks/patterns link back to their base components?
- Which AI-friendly affordances are now expected, for example copy-for-AI, llms.txt, MCP, registry metadata, and install snippets?
- Which component gaps matter for GunjoUI's next patterns: chat, kanban, media library, editor, dashboard, finance, and wallet?

Expected output:

- A benchmark matrix added to this document or a linked doc.
- Concrete adjustments to the #203 docs page template.
- Follow-up issues for missing GunjoUI components or docs affordances.

## Documentation Structure Proposal

Every `/docs/components/:slug` page should converge on the same information architecture:

Baseline page for the first pass: `/docs/components/editable-field`. It is small enough to review quickly, but includes the important doc primitives: Preview, Code, Props, Used Components, Related Components, localized labels, and `Copy spec for AI`. After approval, validate the same structure against a complex page such as `/docs/components/asset-inspector-panel`.

1. Header
   - Component name
   - Short description
   - Status badge when needed, for example Experimental
   - Category
2. Preview
   - Default preview
   - Code tab
   - Responsive preview behavior when relevant
3. Data / Controls
   - Small data controls below preview when the component is data-driven
   - No oversized control panels inside the preview surface
4. Props
   - Complete props table
   - Important defaults
5. States
   - Empty, loading, disabled, selected, hover/focus, error, mobile
   - Only include states that naturally apply to the component
6. Usage
   - Practical guidance
   - When to use / when not to use
7. Used Components
   - Child GunjoUI components used internally or composed in examples
8. Related Components
   - Components commonly paired with it
   - Patterns/pages where it is used when applicable

## Quality Rules

- GunjoUI docs and patterns must use GunjoUI components.
- If a reusable UI unit is created for docs or patterns, it must become a GunjoUI component and enter SSOT.
- GunjoUI component changes require SSOT/design verification.
- Docs must support Japanese and English where page-specific copy exists.
- UI copy must follow `docs/content-guidelines.md`. New or revised component docs must review labels, descriptions, tooltips, disabled reasons, errors, empty states, and Japanese/English layout tolerance.
- Component docs are not complete until user-facing copy has been checked against `/docs/guidelines/writing`: labels, body messages, tooltips, disabled reasons, validation errors, destructive confirmations, empty states, image alt text, and copy feedback must be meaningful in both Japanese and English.
- Image alt text must match the image role: decorative images use empty alt text, informative/product images describe the content, image buttons expose the action through `aria-label` and tooltip, and charts/maps provide a nearby summary instead of relying on `alt` alone.
- Component docs are not complete until the reusable gates in `docs/component-docs-audit-rules.md` have been checked: GunjoUI composition, tooltip/disabled feedback, and preview/code parity.
- If a new message pattern appears during a sweep and is not covered by the message catalog, add it to `/docs/guidelines/writing` or leave a clear candidate note under #235. Do not leave one-off wording decisions untracked.
- Preview controls should verify real data entry, not only static visuals.
- Modals, sheets, popovers, and lightboxes shown inside pattern pseudo-browsers must stay inside the pseudo viewport.
- For chart-like data components, avoid SVG for dynamic rendering unless the shape is fixed and data-independent.

## Proposed Issue Split

Parent issue: #202

The rollout starts with #216 so the category sweeps are based on a reproducible inventory rather than manual memory.

### 0. Component Docs Inventory

Issue: #216

Scope:

- Generate or document a reproducible inventory for `/docs/components/*`.
- Check the required sections defined in `docs/docs-site-information-architecture.md`.
- Identify missing `Preview`, `Props`, `Usage`, `Used Components`, `Related Components`, code copy, and localization gaps.
- Use the report to choose the first actionable batch for #204.

Output:

- Updated audit report or linked generated report.
- First sweep batch list with issue references.

### 1. Docs Component Audit Foundation

Issue: #202

Scope:

- Keep this audit document current.
- Add a generated or scripted inventory command if repeated audits become necessary.
- Decide route naming for Pattern template docs.
- Decide whether aggregate pages, such as `charts` and `ai-chat`, are allowed to replace individual component pages.

Output:

- Updated audit document.
- Parent tracking issue with links to category sweep issues.

### 2. Docs Page Structure Template

Issue: #203

Scope:

- Standardize component page sections.
- Define required sections by component type.
- Add helper components or conventions for `Used Components` and `Related Components`.
- Incorporate findings from the competitive framework research in #210 before freezing the template.

Output:

- One or two representative pages updated as canonical examples.
- Clear rule for new component docs.

### 3. Competitive Framework Research

Issue: #210

Scope:

- Review mature component libraries and design systems.
- Extract docs structure, taxonomy, pattern/block strategy, AI/developer affordances, and component coverage gaps.
- Feed concrete recommendations into #203 and #209.

Output:

- Benchmark matrix.
- Template changes for GunjoUI docs.
- Follow-up component gap issues when needed.

### 3.1 Content Guidelines and Message Catalog

Issues: #235, #236, #237

Scope:

- Expand `/docs/guidelines/writing` from a tone overview into a reusable message catalog.
- Audit existing component docs against the content rules.
- Add the content check to the component docs template and category sweep gates.

Required copy checks for every component page touched in a sweep:

- Japanese pages do not leave English-only user-facing descriptions.
- English pages do not leave Japanese-only user-facing descriptions.
- Labels, descriptions, and displayed messages are separated; labels stay short and body messages carry context.
- Disabled controls explain the reason and enablement condition through GunjoUI tooltip behavior.
- Error states explain what failed and how to recover.
- Destructive actions include a confirmation and clearly name the target and impact.
- Icon-only and toggle controls have tooltip text aligned with `aria-label`.
- Toasts, copy feedback, and status messages state the result, not just the action.
- Japanese and English copy lengths do not clip, wrap badly, or push controls out of place.

Output:

- Expanded public writing guideline page and internal `docs/content-guidelines.md`.
- Updated docs template readiness checks.
- Component sweep logs record copy review completion.

### 4. Inputs Sweep

Issue: #204

Scope:

- `Input`, `Textarea`, `EditableField`, `Form`, `FormGroup`, `Select`, `NumberInput`, `RangeSlider`, `FilterButton`, and related controls.
- Verify width, height, label, helper text, disabled, error, mobile, and real input behavior.

Priority:

- Highest. Inputs are foundational and have historically caused width/height drift across patterns.

First actionable batch:

- Issue: #217 `docs: sweep inputs batch 1 form primitives`
- Pages: `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-group`, `label`, `form`
- Rationale: these are the base form primitives used across docs, auth, dashboard, and media-library patterns. Fixing them first gives the rest of the Inputs sweep a stable reference for height, width, state, usage, and related-component documentation.
- Required checks: Usage code copy, Used Components, Related Components, Preview code copy where missing, state/variant sections where meaningful, Japanese/English copy, desktop/mobile browser spot checks, docs preview height clipping, preview/code parity for data/labels/icons/layout classes, `npm run type-check`, `npm run design:verify`, and `npm run docs:audit:components`.
- Current status: the first structural pass is complete for all eight pages. The generated audit now marks those pages as structurally complete. `npm run type-check`, `npm run design:verify`, `npm run docs:audit:components`, and representative desktop/mobile browser spot checks have passed.

### 4.1 Inputs Sweep Follow-up: reviewed pages

Work log: 2026-05-18

These pages were reviewed manually after the first structural pass. They should be treated as the current reference batch for interactive input-like component pages before expanding the template to the rest of `/docs/components`.

| Page | URL | Status | Main work completed | Follow-up checks |
| --- | --- | --- | --- | --- |
| Button | `/docs/components/button` | Reviewed | Normalized `Usage` as code, added state/variant structure, fixed mobile tab/control wrapping, fixed tooltip clipping, fixed FIT preview height and center alignment. | Confirm Japanese/English labels, tooltip visibility, copy feedback, and desktop/tablet/mobile preview controls. |
| Calendar | `/docs/components/calendar` | Reviewed | Reworked calendar behavior and docs preview: Japanese/English display, month/year navigation, previous/next month controls, fixed six-week height, weekend/holiday styling, and state preview clipping. | Confirm locale switching, month/year menu behavior, weekend/holiday color, and no vertical clipping in state previews. |
| Checkbox | `/docs/components/checkbox` | Reviewed | Localized main preview, aligned labels with checkbox states, fixed FIT preview height and iframe center alignment after load. | Confirm checked/unchecked/disabled states, Japanese/English labels, and stable center alignment after page load. |
| Combobox | `/docs/components/combobox` | Reviewed | Localized main preview, fixed selection behavior, added clear affordance for command input, clarified disabled options with tooltip reason, and kept multi-select out of scope for this component. | Confirm option selection, clear button, disabled-option tooltip, and locale switching. |
| DatePicker | `/docs/components/date-picker` | Reviewed | Reworked input interaction: segmented date entry, arrow/tab movement, up/down date stepping, Enter/open synchronization, Today and previous-date controls, calendar icon tooltip state, historical date handling, and preview clipping fixes. | Confirm direct input, keyboard operation, Today / previous-date behavior, calendar open/close behavior, and locale switching. |
| DateRangePicker | `/docs/components/date-range-picker` | Reviewed | Ported DatePicker input mechanics to range input, fixed range editing, active start/end indication, invalid reversed range handling, optional max range, responsive single-month mobile calendar, Today / previous-range controls, and main preview clipping. | Confirm start/end focus behavior, reversed range validation, range click flow, mobile single-month behavior, and locale switching. |

Shared fixes made during this batch:

- `ComponentPreview` FIT mode now avoids unnecessary `350px` fixed height for compact previews.
- Non-iframe previews now center compact components inside the preview body.
- Embed preview frames now keep compact iframe previews vertically centered after post-load height sync.
- Date range/mobile previews use compact content height where possible while fixed viewport modes remain available.

Remaining manual checks before marking the batch public-ready:

- [ ] Toggle site language and verify all six pages update visible preview labels and docs copy.
- [ ] Check desktop, tablet, and mobile preview modes for each page.
- [ ] Verify `Copy spec for AI` and code copy show feedback.
- [ ] Confirm props tables do not overflow on mobile.
- [ ] Confirm Preview and every States and Variants demo have no vertical or horizontal clipping in FIT, desktop, tablet, and mobile modes.
- [ ] Confirm interactive controls can be used without hidden clipping or unexpected scroll inside FIT mode.

### 4.2 Inputs Sweep Follow-up: reviewed pages batch 2

Work log: 2026-05-18

These pages were reviewed after the first interactive input batch. They now follow the same docs template expectations: localized preview copy, code-first Usage, meaningful state examples, Used Components, Related Components, and mobile-aware preview behavior.

| Page | URL | Status | Main work completed | Follow-up checks |
| --- | --- | --- | --- | --- |
| EditableField | `/docs/components/editable-field` | Reviewed | Added save success/failure feedback, kept edit/read layout height stable, fixed multiline field clipping, moved preview feedback into the preview surface, and normalized Japanese copy. | Confirm success/failure feedback, multiline editing, no layout jump, and Japanese/English copy. |
| FileUploader | `/docs/components/file-uploader` | Reviewed | Localized previews, added loading/success/failure/disabled examples, explained disabled reasons, fixed clipped state previews, aligned Alert text vertically, and switched docs icons to Tabler. | Confirm upload states, disabled tooltip, Alert alignment, and Japanese/English copy. |
| FilterButton | `/docs/components/filter-button` | Reviewed | Stabilized trigger width when badges appear, fixed dropdown alignment, added selected/open/custom menu states, and normalized Japanese copy. | Confirm menu alignment, selected badge behavior, custom menu examples, and Japanese/English copy. |
| Form | `/docs/components/form` | Reviewed | Added submit-time validation and pending submit examples, localized preview copy, fixed clipped state previews, and normalized Japanese copy. | Confirm validation timing, pending state, disabled submit behavior, and Japanese/English copy. |
| Input | `/docs/components/input` | Reviewed | Added labeled/error/disabled examples, included disabled reason tooltip, fixed preview localization, and normalized Japanese copy. | Confirm validation styling, disabled tooltip, preview width, and Japanese/English copy. |
| InputOTP | `/docs/components/input-otp` | Reviewed | Localized preview copy, added grouped/continuous/disabled states, included disabled reason tooltip, and normalized Japanese copy. | Confirm grouped slots, disabled tooltip, mobile fit, and Japanese/English copy. |

Validation completed for batch 2:

- [x] `npm run type-check`
- [x] `npm run design:verify:component-style-hints`

### 4.3 Inputs Sweep Follow-up: next pages batch 3

Work log: 2026-05-18

Next target pages:

| Page | URL | Status | Initial checks |
| --- | --- | --- | --- |
| Label | `/docs/components/label` | Reviewed | Localized the embedded preview, verified template sections, label/control pairing examples, and state coverage. |
| Mention | `/docs/components/mention` | Reviewed | Rebuilt the old page into the current template with localized Preview, States, Props, Usage copy, Used Components, Related Components, and disabled-reason tooltip coverage. |
| NumberInput | `/docs/components/number-input` | Reviewed | Rebuilt the old page into the current template, added min/max/step/disabled states, localized the embedded preview, and added accessible stepper labels to the GunjoUI component API. |
| PasswordInput | `/docs/components/password-input` | Reviewed | Rebuilt the old page into the current template, added masked/visible/disabled states, localized the embedded preview, and added accessible visibility-toggle labels to the GunjoUI component API. |
| RadioGroup | `/docs/components/radio-group` | Reviewed | Localized preview and state examples, added rich/horizontal/disabled-option states, and normalized props/usage copy. |
| RangeSlider | `/docs/components/range-slider` | Reviewed | Rebuilt the old page into the current template with range/step/linked-input/disabled states, localized preview copy, and value-label examples. |

Follow-up log: 2026-05-18

- Button: kept fixed-width buttons only in the variant summary list; practical-state buttons now use natural width so long labels do not wrap unexpectedly.
- PropsTable / Table: added shared overflow wrapping so long prop types and defaults do not escape table cells.
- Label: localized the shared preview demo so Japanese pages no longer show English-only labels.
- NumberInput: added `incrementLabel` / `decrementLabel` props to the GunjoUI component for localized stepper buttons.
- PasswordInput: added `showLabel` / `hideLabel` props to the GunjoUI component for localized visibility buttons.
- Mention / NumberInput / PasswordInput / RangeSlider: old pages now include code copy, states, props, usage, Used Components, Related Components, and Japanese/English page copy.
- RadioGroup: state examples now use Japanese/English labels and include disabled-option tooltip guidance.

Validation completed for batch 3:

- [x] `npm run type-check`
- [x] `npm run design:sync:components`
- [x] `npm run design:verify:component-style-hints`
- [x] `npm run docs:audit:components`

Manual confirmation completed for batch 3:

- [x] User visually confirmed `Label`, `Mention`, `NumberInput`, `PasswordInput`, `RadioGroup`, and `RangeSlider` on 2026-05-18.
- [x] Final Japanese copy pass completed for the six pages. Technical names such as prop names remain in English where they are part of the API, but user-facing descriptions avoid mixed Japanese/English phrasing.

### 4.4 Inputs Sweep Follow-up: next pages batch 4

Work target: 2026-05-18

| Page | URL | Status | Initial focus |
| --- | --- | --- | --- |
| SearchInput | `/docs/components/search-input` | Reviewed | Rebuilt into the current template, localized preview copy, added clear/without-clear/disabled states, and added disabled-reason tooltip guidance. |
| Select | `/docs/components/select` | Reviewed | Rebuilt state examples with localized labels, grouped options, disabled reason tooltip, and width alignment inside form groups. |
| Slider | `/docs/components/slider` | Reviewed | Rebuilt into the current template, added value/step/disabled states, and added `onValueChange` to the GunjoUI component API while preserving native `onChange`. |
| SortButton | `/docs/components/sort-button` | Reviewed | Added states, props, usage, used/related components, localized labels, and exported `SortButtonVariantKey` from the GunjoUI component. |
| Switch | `/docs/components/switch` | Reviewed | Rebuilt disabled guidance with tooltip, localized copy, and added uncontrolled `defaultChecked` behavior to the GunjoUI component. |
| TagInput | `/docs/components/tag-input` | Reviewed | Rebuilt into the current template, localized add/remove copy, added max/disabled states, fixed disabled tooltip width, and fixed IME Enter handling so committed tags clear the input. |

Implementation log: 2026-05-18

- SearchInput: added localized clear-button labeling and documented clearable / non-clearable / disabled states.
- Select: kept GunjoUI SSOT sizing intact and applied form-level `w-full` where the docs need field-width alignment.
- Slider: added `onValueChange` for controlled numeric usage and kept native `onChange` compatibility for existing sliders.
- SortButton: kept SSOT state styling intact and used page/demo class composition where horizontal docs examples are required.
- Switch: added uncontrolled toggling through `defaultChecked` while preserving controlled `checked` behavior.
- TagInput: added localized remove-label support and documented max-tag and disabled states.
- Disabled input-like examples now use `DisabledReasonTooltip fullWidth` so tooltip wrappers do not shrink controls compared with enabled states.
- TagInput now ignores Enter while IME composition is active, then clears the draft after a real tag commit.

Validation completed for batch 4 implementation:

- [x] `npm run type-check`
- [x] `npm run design:sync:components`
- [x] `npm run design:verify:component-style-hints`
- [x] `npm run design:verify:docs-content-ssot`
- [x] `npm run docs:audit:components`
- [x] User visually confirmed `SearchInput`, `Select`, `Slider`, `SortButton`, `Switch`, and `TagInput` on 2026-05-19.
- [ ] `npm run design:verify:components` currently reports an existing Toast style drift (`flex-col` hint for error/info). The batch 4 input pages no longer add Select / Slider / SortButton drift after reverting source-only style changes.

### 4.5 Inputs Sweep Follow-up: next pages batch 5

Work target: 2026-05-19

| Page | URL | Status | Initial focus |
| --- | --- | --- | --- |
| Textarea | `/docs/components/textarea` | Implementation complete / visual review pending | Rebuilt copy and examples with localized preview, counter, validation, disabled tooltip, Props, Usage, Used Components, and Related Components. |
| TimePicker | `/docs/components/time-picker` | Implementation complete / visual review pending | Rebuilt old page into the current template, added 24-hour / 12-hour / minute-step / disabled states, localized preview copy, and added localized accessible labels to the GunjoUI component API. |
| Toggle | `/docs/components/toggle` | Implementation complete / visual review pending | Rebuilt old page into the current template, added default / pressed / outline / disabled states, and paired icon-only toggle examples with Tooltips. |
| ToggleGroup | `/docs/components/toggle-group` | Implementation complete / visual review pending | Rebuilt old page into the current template, added single / multiple / outline / disabled examples, Props, Usage, Used Components, and Related Components. |
| TooltipButton | `/docs/components/tooltip-button` | Implementation complete / visual review pending | Rebuilt page with localized copy, states for explained / icon-only / destructive actions, Props, Usage, Used Components, and Related Components. |

Implementation log: 2026-05-19

- Textarea: localized the embedded preview and state copy, added a character-counter example, validation-error state, and disabled reason tooltip.
- TimePicker: added `hourLabel`, `minuteLabel`, and `periodLabel` props so the component can expose localized accessible labels; rebuilt docs around real controlled values.
- Toggle: kept the GunjoUI primitive intact and documented the rule that icon-only toggles need a tooltip and accessible label.
- ToggleGroup: added single-selection and multiple-selection examples so the state model is explicit.
- TooltipButton: replaced old minimal docs with the current template and Tabler icon examples.
- Follow-up: aligned Toggle and ToggleGroup selected colors in the GunjoUI source components with `primary` / `primary-foreground`, kept disabled toggles visibly button-like, added disabled tooltips to the docs examples, and cleaned up Japanese copy that mixed English terms unnecessarily.
- Follow-up: fixed a Radix `TooltipTrigger` / Toggle `data-state` collision in the docs state previews by moving the tooltip trigger to an outer wrapper, so Toggle and ToggleGroupItem keep their own `data-state="on"` selection state.
- Follow-up: moved Toggle size examples out of the main preview and into a dedicated States and variants row, so the default preview no longer reads as an accidental mix of uneven button sizes.
- Follow-up: set the Toggle size examples to start selected so the size differences are easier to compare at a glance.

Validation completed for batch 5 implementation:

- [x] `npm run type-check`
- [x] `npm run design:sync:components`
- [x] `npm run design:verify:component-style-hints`
- [x] `npm run design:verify:docs-content-ssot`
- [x] Browser check confirmed selected Toggle / ToggleGroup items can be clicked in state previews and render with the GunjoUI primary selected color.
- [x] Browser section smoke check for all five pages confirmed Preview, States, Props, Usage, Used Components, and Related Components render.
- [ ] Visual review by user.

### 4.6 Inputs Category Cover Page

Issue: #221

Work log: 2026-05-19

- Added `/docs/components/inputs` as an Inputs category cover page.
- The page is not a Showcase duplicate. It focuses on component selection, common input rules, confusing component pairs, and future component candidates.
- Added an `Inputs Overview` entry to the generated docs navigation before individual input component pages.
- Updated docs navigation generation and verification so category cover pages can exist without being treated as component SSOT entries.
- Follow-up: removed the top CTA link cards, changed the selection guide into a vertical component list with one row per component, added lightweight thumbnails instead of heavy interactive previews, and grouped common rules, decision points, and future candidates under supplemental information.
- Review decision: keep the cover page as a lightweight overview. Full interactive previews for every input component would make the category page heavier and more fragile, so hands-on verification stays on each component detail page.

Review URL:

- `/docs/components/inputs`

### 4.2 Inputs Sweep Follow-up: next review batch

Work target: 2026-05-18

| Page | URL | Status | Focus |
| --- | --- | --- | --- |
| EditableField | `/docs/components/editable-field` | Reviewed | Confirmed the basic editable-field template still has Preview, States, Props, Usage, Used Components, Related Components, localized title/description, and code-copy controls. |
| FileUploader | `/docs/components/file-uploader` | Reviewed | Promoted localized labels into the GunjoUI `FileUploader` API, rebuilt the docs page with Preview, States, Props, Usage, Used/Related components, and Japanese/English visible copy. |
| FilterButton | `/docs/components/filter-button` | Reviewed | Localized the main preview and state summary, kept one-state-per-row guidance, and verified the representative state/variant page still matches the template. |
| Form | `/docs/components/form` | Reviewed | Localized the main preview, usage code, props descriptions, pending state copy, and page metadata through docs content. |
| Input | `/docs/components/input` | Reviewed | Fixed the docs-content key, localized the main preview, states, usage, props descriptions, and kept preview width aligned with state examples. |
| InputOTP | `/docs/components/input-otp` | Reviewed | Rebuilt the old page into the current template with Preview, grouped/plain/disabled states, Props, Usage code copy, Used Components, Related Components, and Japanese/English copy. |

Checks completed:

- [x] `npm run type-check`
- [x] `npm run design:verify:component-style-hints`
- [x] `npm run docs:audit:components`
- [x] Browser DOM spot check for all six pages: no application error, States/Props/Usage present, Used/Related present, Japanese state section present.

Follow-up log: 2026-05-18

- EditableField: increased the multi-line state preview height so textarea editing is not clipped.
- FileUploader: localized the embedded preview through the shared demo, passed the parent locale into embed iframes, and increased all state preview heights.
- FilterButton: reserved badge width in the GunjoUI component so selecting filters does not resize the trigger while the popover is open; aligned the state summary trigger widths.
- Form: localized the embedded preview through the shared demo and increased state preview heights.
- Input: localized the embedded preview through the shared demo and increased state preview heights.
- InputOTP: localized the embedded preview through the shared demo and increased state preview heights.
- Candidate components: postal-code input and phone-number input are not OTP variants. Treat them as separate formatted/masked input components to be planned in a future Inputs sweep.

### 5. Overlay Sweep

Issue: #205

Scope:

- `Dialog`, `AlertDialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `MediaLightbox`, `MediaPickerDialog`, `ShareModal`.
- Verify centering, mobile behavior, pseudo-browser containment, close/cancel/confirm affordances.

Priority:

- High. Overlay behavior affects patterns and mobile verification.

### 6. Layout / Navigation / Feedback Sweep

Issue: #206

Scope:

- `DeviceFrame`, `MarqueeFrame`, `ScrollArea`, `InspectorPanel`, `Sidebar`, `Tabs`, `Breadcrumb`, `Toast`, `Banner`, `Stepper`.
- Verify docs structure, Used/Related components, and real usage in patterns.

Priority:

- High. These components shape the docs and pattern shell itself.

### 7. Display Sweep

Issue: #207

Scope:

- `Badge`, `Card`, `AssetCard`, `AssetGrid`, `MetadataList`, `TagEditor`, `DataTable`, `TreeView`, `EmptyState`, `AvatarGroup`, and other non-chart display components.
- Verify hover/focus/active, overflow, truncation/wrapping, mobile, and composability.

Priority:

- Medium-high. Many of these already work, but docs consistency is uneven.

#### 7.1 Display Sweep: first review batch

Issue: #225

Work target: 2026-05-19

| Page | URL | Status | Initial focus |
| --- | --- | --- | --- |
| Display | `/docs/components/display` | Implementation complete / visual review pending | Added a category cover page for choosing display components by structure, media, people, and status use cases. |
| Accordion | `/docs/components/accordion` | Visual review complete | Localized Preview, States, Props, Usage, Used Components, and Related Components; documented single, multiple, disabled, icon, and tooltip behavior. |
| AccordionGroup | `/docs/components/accordion-group` | Visual review complete | Added grouped accordion composition with fixed-width open/close toggle, localized states, Props, Usage, Used Components, and Related Components. |
| AssetCard | `/docs/components/asset-card` | Visual review complete | Added full image surface, title, metadata, selected, compact, and no-image states using ImagePreview. |
| AssetGrid | `/docs/components/asset-grid` | Visual review complete | Added default, compact, and grouped grid states with localized copy and related components. |
| Avatar | `/docs/components/avatar` | Visual review complete | Added image, fallback, tooltip, and presence composition states with localized Props and Usage. |
| AvatarGroup | `/docs/components/avatar-group` | Visual review complete | Added overflow member list, name tooltip, and max-count behavior with localized copy. |
| Badge | `/docs/components/badge` | Visual review complete | Added variant summary rows, icon/removable/addable/selectable/disabled states, TagInput guidance, Tabler icon examples, and code-first Usage. |

Implementation log: 2026-05-19

- Added `Display Overview` to generated docs navigation and Japanese navigation labels.
- Added `/docs/components/display` and `/embed/display` using GunjoUI components only.
- Completed the generated structural checklist for `Accordion`, `AssetCard`, `AssetGrid`, `Avatar`, `AvatarGroup`, and `Badge`.
- Kept Usage sections code-first and added code-copy controls to the six detail pages.
- Added Used Components and Related Components to each target detail page.

Review log: 2026-05-21

- User visually reviewed and accepted `Accordion`, `AccordionGroup`, `AssetCard`, `AssetGrid`, `Avatar`, `AvatarGroup`, and `Badge`.
- Confirmed the pages follow the current detail-page template: Preview, States and variants, Props, Usage, Used Components, and Related Components.
- Rechecked Japanese/English copy paths and updated Badge guidance so typed tag creation points to `TagInput` instead of expanding Badge responsibilities.

#### 7.2 Display Sweep: card and data batch

Issue: #207

Work target: 2026-05-21

| Page | URL | Status | Initial focus |
| --- | --- | --- | --- |
| Card | `/docs/components/card` | Implementation complete / visual review pending | Rechecked template structure and corrected props guidance to match the actual Card slot API. |
| Carousel | `/docs/components/carousel` | Implementation complete / visual review pending | Added localized Preview, States, Props, Usage, Used Components, and Related Components; added tooltip labels to navigation controls. |
| Code | `/docs/components/code` | Implementation complete / visual review pending | Added localized states for emphasis and size, code-first Usage, and component relationships. |
| CodeBlock | `/docs/components/code-block` | Implementation complete / visual review pending | Added localized states, copy labels, tooltip-backed copy action, Props, Usage, Used Components, and Related Components. |
| ColorSwatch | `/docs/components/color-swatch` | Implementation complete / visual review pending | Added token, size, and non-copyable states with localized copy labels and tooltip-backed copy action. |
| DataTable | `/docs/components/data-table` | Implementation complete / visual review pending | Added localized table labels, rich/empty/no-filter states, Props, Usage, Used Components, and Related Components. |
| ActionDataTable | `/docs/components/action-data-table` | Implementation complete / visual review pending | Added as issue #232 for selectable rows, bulk actions, row actions, disabled-action tooltips, and relationship back to DataTable. |

Implementation log: 2026-05-21

- Updated `Carousel`, `CodeBlock`, `ColorSwatch`, and `DataTable` in `src/components/display/**` where docs consistency required first-class GunjoUI behavior.
- Added `ActionDataTable` as a first-class GunjoUI display composition and registered it through SSOT, generated exports, manifest, style hints, navigation, and docs.
- Kept Usage sections code-first and removed old `Practical states` copy from the target pages.
- Added Japanese and English docs-content entries for `Code`, `CodeBlock`, `ColorSwatch`, and `DataTable`.
- Changed `ComponentDemoStates` so state demos default to auto height. Component pages should not require one-off height fixes just to avoid clipped state previews.
- Verified the six pages with `npm run type-check`, `npm run design:verify`, `git diff --check`, and browser inspection on the local docs site.

#### 7.3 Display Sweep: primitive media batch

Issue: #207

Work target: 2026-05-23

| Page | URL | Status | Initial focus |
| --- | --- | --- | --- |
| EmptyState | `/docs/components/empty-state` | Implementation complete / visual review pending | Rebuilt into the current template with localized Preview, States, Props, Usage, Used Components, and Related Components. |
| Icon | `/docs/components/icon` | Implementation complete / visual review pending | Verified template structure, added the missing Props anchor, and kept icon examples aligned with the Tabler/Icon primitive direction. |
| ImagePreview | `/docs/components/image-preview` | Implementation complete / visual review pending | Rechecked template coverage, no-image behavior, and Japanese/English page copy. |
| Img | `/docs/components/img` | Implementation complete / visual review pending | Localized the page title and usage/state examples, keeping image loading, fallback, and lazy-loading guidance on the `Img` primitive. |
| Kbd | `/docs/components/kbd` | Implementation complete / visual review pending | Rebuilt into the current template with localized Preview, States, Props, Usage, Used Components, and Related Components. |
| List | `/docs/components/list` | Implementation complete / visual review pending | Rebuilt into the current template and adjusted the GunjoUI List primitive so ordered lists and custom marker lists align without one-off docs styling. |
| MarkdownRenderer | `/docs/components/markdown-renderer` | Implementation complete / visual review pending | Rebuilt into the current template with localized Markdown/GFM/plain-text states, Props, Usage, Used Components, and Related Components. |

Implementation log: 2026-05-23

- Added localized docs-content entries for `EmptyState`, `Img`, and `MarkdownRenderer` so Japanese pages show the Japanese title and description while keeping the English component name secondary.
- Rebuilt `EmptyState`, `Kbd`, `List`, and `MarkdownRenderer` pages around the current component-detail template.
- Confirmed `Icon` and `ImagePreview` already had the same structural sections, then fixed the missing `#props` anchor on `Icon`.
- Updated `Img` examples so Japanese Usage and state code no longer show English-only labels.
- Adjusted the GunjoUI `List` primitive layout to avoid centered one-off list behavior and keep standard ordered lists semantically ordered.
- Browser checks for the seven pages confirmed no document-level horizontal overflow and no vertical clipping in desktop/mobile preview surfaces.

### 8. Charts Sweep

Issue: #208

Scope:

- All chart cards and chart primitives.
- Normalize Preview/Data/Props structure.
- Confirm data controls, tooltips, mobile, and HTML/CSS dynamic rendering rule.

Priority:

- Medium. A lot has already been polished, but docs structure and consistency still need a final pass.

### 9. Public Readiness QA

Issue: #209

Scope:

- Full `/docs/components/*` pass in Japanese and English.
- Desktop/tablet/mobile preview.
- `npm run design:verify`
- `npm run type-check`
- noindex/noarchive decision.

Output:

- Release checklist for publishing docs.

## Definition Of Done For Each Component Page

- Has a working preview.
- Has code sample.
- Has props table.
- Has Used Components.
- Has Related Components or an explicit "none" decision.
- Handles Japanese and English page-specific copy.
- Disabled controls expose a reason through GunjoUI Tooltip on hover/focus. Helper text may repeat the reason, but it does not replace the tooltip.
- Handles mobile width without horizontal overflow unless the component is intentionally scrollable.
- Mobile text-like inputs, textareas, and selects do not trigger browser zoom on focus; verify the focused control has an effective font size of at least 16px.
- Preview and every States and Variants demo are checked for vertical and horizontal clipping in FIT, desktop, tablet, and mobile modes.
- Top docs preview iframe is checked separately from States and Variants: `[data-embed-preview-wrap]`, its direct child, and the component root must match the intended preview width instead of shrinking to content width.
- Overlay demos are checked in the open state. Dropdowns, popovers, tooltips, menus, sheets, drawers, dialogs, and hover cards must be fully visible without using arbitrary preview `height` / `min-height` as the fix.
- For overlay clipping, audit trigger position, portal/container behavior, nearest overflow ancestor, collision side/align, and viewport bounds before changing demo size. The trigger must stay in a realistic usage position; a fix that only moves the trigger to a strange location or hides the issue with height is not complete.
- Uses only GunjoUI components or explicitly promoted reusable components.
- Passes `npm run design:verify` and `npm run type-check`.

## Work Log

- 2026-06-02: Added explicit overlay-open-state verification after repeated regressions where preview height changes hid clipping, broke trigger position, or reintroduced clipping in Popover/HoverCard-style demos.
- 2026-05-29: Added docs preview iframe width verification to `AGENTS.md` and this audit DoD after repeated FIT-width regressions where parent-page checks missed shrink-to-content behavior inside `/embed/*`.
- 2026-05-29: Added mobile input focus zoom prevention to `AGENTS.md` and this audit DoD. GunjoUI global styles now enforce a 16px effective font size for text-like form controls on mobile widths.
- 2026-05-18: Added disabled-reason tooltip rule to `AGENTS.md` and this audit DoD. Applied the rule to `Input`, `InputOTP`, and `FileUploader` state previews with a shared docs helper that composes GunjoUI `Tooltip`.
