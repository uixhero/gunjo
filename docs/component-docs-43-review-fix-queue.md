# Component Docs 43 Review Fix Queue

This queue tracks visual-review findings for the 43 added component docs pages. It is separate from the SSOT/Figma completion log in `docs/component-docs-43-ssot-figma-progress.md`.

## Carry-Forward Rules

- Main docs preview and States/Variants previews are separate surfaces.
- Do not fix overlays by increasing docs preview height or adding arbitrary fixed preview heights.
- Preview and copyable code must match exactly: labels, data, handlers, state, disabled reasons, tooltips, portals, and visible variants.
- Toasts, dialogs, popovers, menus, scanners, and other overlays must render inside the preview surface when the component supports containment.
- Disabled controls must explain why they are disabled on hover/focus.
- Japanese and English docs must be fully localized; avoid mixed-language UI in either locale.
- Light and dark mode must both remain legible.
- Figma is downstream of repo SSOT. Do not reverse Figma values into source.

## Review Status

| # | Key | Title | URL | Visual review | Docs/source fix | SSOT follow-up | Cold-test/article follow-up |
|---:|---|---|---|---|---|---|---|
| 1 | `actionQueue` | ActionQueue | `/docs/components/action-queue` | Reviewed | Fixed tab hover/cursor through shared `ToggleGroupItem`, removed page-local hover classes, fixed severity button colors, JA/EN empty/default labels, and source default `emptyLabel` to `No action items`. | Source default changed; explicit prop-default SSOT entry was not present. Add one only if the component spec starts tracking prop defaults. Pending only if `.pen` SSOT should explicitly document ToggleGroup item hover/cursor as a default interaction affordance. | Check screenshots/articles for the old empty label or uncolored action buttons. |
| 2 | `amountBreakdown` | AmountBreakdown | `/docs/components/amount-breakdown` | Reviewed | Fixed tab hover/cursor through shared `ToggleGroupItem`; removed page-local hover classes from preview and copyable code. | Pending only if `.pen` SSOT should explicitly document ToggleGroup item hover/cursor as a default interaction affordance. | Check screenshots/articles only if they show hover-state guidance. |
| 3 | `approvalWorkflow` | ApprovalWorkflow | `/docs/components/approval-workflow` | Reviewed | Fixed sendback/reject `Select` and `Textarea` visible backgrounds, reset button hover, and expanded copyable code. | Pending: update `.pen` SSOT to mention explicit editable backgrounds for composer controls. Direct JSON/manifest edits are overwritten by `design:sync`. | Check screenshots/articles for transparent sendback/reject controls or abbreviated code. |
| 4 | `bottomActionBar` | BottomActionBar | `/docs/components/bottom-action-bar` | Reviewed | Moved fixed-bar helper text outside the phone frame, changed stack layout so CTA sits below the fare, and expanded copyable code. | Pending: update `.pen` SSOT so stack places CTA below the summary. Direct JSON/manifest edits are overwritten by `design:sync`. | Update screenshots/articles that describe or show CTA above the fare/summary. |
| 5 | `checkList` | CheckList | `/docs/components/check-list` | Reviewed | Moved disabled reason tooltip into `CheckList` row-level source API, fixed tooltip target position, and removed JA/EN mixed labels. | Pending: update `.pen` SSOT to include `disabledReason` on disabled rows. Direct JSON/manifest edits are overwritten by `design:sync`. | Update screenshots/articles that wrap the whole list in a disabled tooltip or show mixed labels. |
| 6 | `companyCell` | CompanyCell | `/docs/components/company-cell` | Reviewed | Rebuilt the page to the audit template, replaced generic company examples with UIXHERO using `https://www.uixhero.com/images/512grid_wh.svg`, completed JA/EN copy, states, props, usage, and copyable code parity. | Docs-only unless the UIXHERO logo example should be captured as the canonical CompanyCell specimen in SSOT/Figma. | Update screenshots/articles that still show the old generic company logo examples or missing state sections. |
| 7 | `documentRow` | DocumentRow | `/docs/components/document-row` | Reviewed | Added source-level Checkbox hover/cursor affordance, disabled checkbox reason tooltip, preview-contained dialog/toast, and composition-level select-all / clear / selected-download toolbar so multi-select has an outcome. Copyable code was expanded to match the visible preview. | Source change: Checkbox hover/cursor should be reflected in SSOT if interaction affordances are tracked. Docs-only composition change: DocumentRow remains a row primitive; bulk toolbar belongs to the parent list composition, not the row component. | Update screenshots/articles that still show selection without a follow-up action, old disabled wording, or checkbox without hover. |
| 8 | `eventCalendar` | EventCalendar | `/docs/components/event-calendar` | Reviewed | Changed the component month label from `h2` to a non-heading element so `2026年6月` does not pollute the page TOC. Replaced passive selected-status text with a preview-contained right Sheet opened from date/event selection, and updated copyable code to match. | Source change: EventCalendar internal month title should remain non-heading unless a heading-level prop is designed. Docs composition uses Sheet; no EventCalendar API change needed. | Update screenshots/articles that still show selected-date text below the calendar instead of the detail preview Sheet. |
| 9 | `expiryBadge` | ExpiryBadge | `/docs/components/expiry-badge` | Reviewed | Moved the state chip to the far right after date/remaining text, with fixed root width, fixed state-chip width, left-aligned labels, and consistent icon position. Completed JA/EN wording for state summary and remaining/overdue text. Added `formatRemaining`, `stateClassName`, and `statePosition` to `ExpiryBadge` so list/table alignment and English remaining labels are source-supported instead of page-local hacks. | Source change: update SSOT for new `formatRemaining`, `stateClassName`, and `statePosition` props if component API specs are being synced. Docs code examples now include the new API for right-edge alignment and localization. | Update screenshots/articles that show the badge before date/remaining text, ragged badge widths, or Japanese remaining text on the English page. |
| 10 | `filterChips` | FilterChips | `/docs/components/filter-chips` | Reviewed | Added source-level chip hover/cursor affordance and made chip counts render as visible pill counters. Disabled-chip state now uses a focused minimal rail (`すべて3 / 搭乗口3 / ラウンジ0 / 喫煙所0`) with 3 gate cards so disabled categories stand out without overcrowding the example, and lounge/smoking use distinct disabled reasons. Replaced passive "showing category" text with a preview-contained non-modal Sheet that opens only from facility card selection; category chips now only filter the list. Added a local preview-surface overlay so the background is dimmed and backing cards cannot be clicked repeatedly while the Sheet is open. Expanded copyable code to match the visible preview data, labels, stable preview surface, and overlay composition. | Source change: FilterChips hover/cursor and count-pill styling should be reflected in SSOT if interaction/visual affordances are tracked. Docs-only composition change: selected facility cards open contained `Sheet modal={false}` with a local preview-surface overlay; category chips remain filtering controls; disabled-chip example uses a reduced category set plus matching cards. | Update screenshots/articles that still show passive selected-category text, category-chip-triggered preview, page-level scroll lock, missing local overlay, non-hovering chips, low-visibility count text, disabled examples without matching cards, repeated disabled reasons, or code that omits the Sheet drilldown. |
| 11 | `gantt` | Gantt | `/docs/components/gantt` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 12 | `itinerary` | Itinerary | `/docs/components/itinerary` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 13 | `kanbanBoard` | KanbanBoard | `/docs/components/kanban-board` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 14 | `leaderboard` | Leaderboard | `/docs/components/leaderboard` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 15 | `limitMonitor` | LimitMonitor | `/docs/components/limit-monitor` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 16 | `lineageGraph` | LineageGraph | `/docs/components/lineage-graph` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 17 | `lineChip` | LineChip | `/docs/components/line-chip` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 18 | `listCard` | ListCard | `/docs/components/list-card` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 19 | `loyaltySummaryCard` | LoyaltySummaryCard | `/docs/components/loyalty-summary-card` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 20 | `matchCard` | MatchCard | `/docs/components/match-card` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 21 | `meter` | Meter | `/docs/components/meter` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 22 | `navRow` | NavRow | `/docs/components/nav-row` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 23 | `originDestination` | OriginDestination | `/docs/components/origin-destination` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 24 | `pageHeader` | PageHeader | `/docs/components/page-header` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 25 | `paretoChart` | ParetoChart | `/docs/components/pareto-chart` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 26 | `personCell` | PersonCell | `/docs/components/person-cell` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 27 | `radioCard` | RadioCard | `/docs/components/radio-card` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 28 | `referenceValue` | ReferenceValue | `/docs/components/reference-value` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 29 | `relationshipRow` | RelationshipRow | `/docs/components/relationship-row` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 30 | `routeStops` | RouteStops | `/docs/components/route-stops` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 31 | `scheduleGrid` | ScheduleGrid | `/docs/components/schedule-grid` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 32 | `seatMap` | SeatMap | `/docs/components/seat-map` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 33 | `sectionList` | SectionList | `/docs/components/section-list` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 34 | `signedRecord` | SignedRecord | `/docs/components/signed-record` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 35 | `statGroup` | StatGroup | `/docs/components/stat-group` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 36 | `statusBoard` | StatusBoard | `/docs/components/status-board` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 37 | `stringline` | Stringline | `/docs/components/stringline` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 38 | `ticketStub` | TicketStub | `/docs/components/ticket-stub` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 39 | `weekView` | WeekView | `/docs/components/week-view` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 40 | `safetyBanner` | SafetyBanner | `/docs/components/safety-banner` | Not yet visually reviewed in this pass | TBD | TBD | TBD |
| 41 | `coSign` | CoSign | `/docs/components/co-sign` | Reviewed before this 5-page batch | Disabled button reason tooltip was fixed earlier; keep in queue for regression checks. | Confirm whether source/SSOT already records disabled reason behavior before final Figma sync. | Check screenshots/articles for disabled controls without reason tooltips. |
| 42 | `scanGate` | ScanGate | `/docs/components/scan-gate` | Reviewed before this 5-page batch | Scanner workflow was reworked earlier: barcode/QR label modal, employee scan modal, unified 1-3 completion flow, and stepped variation. | Confirm whether source/SSOT already records scanner modal + unified flow before final Figma sync. | Update screenshots/articles that show the earlier pseudo-scan inline UI or unclear carton/product flow. |
| 43 | `segmentedControl` | SegmentedControl | `/docs/components/segmented-control` | Reviewed before this 5-page batch | Hover/cursor behavior is now source-level: unchecked segments get hover background/text and enabled segments keep pointer cursor. | Pending only if `.pen` SSOT should explicitly document segmented-control hover as a default interaction affordance. | Check screenshots/articles only if they call out non-hovering tabs. |

## Shared Source Fixes

- `ToggleGroupItem`: enabled items now include `cursor-pointer` in the shared primitive, so docs pages do not need page-local cursor classes.
- `SegmentedControl`: unchecked enabled segments now show hover background/text feedback from the shared component.
- `TabsTrigger`: inactive enabled tabs now show hover background/text feedback from the shared navigation component.

## Open Queue

1. Continue visual review in 5-page batches from `companyCell` through `weekView`.
2. For each finding, decide whether it is docs-only, source component behavior, SSOT metadata/spec, Figma downstream, or cold-test article material.
3. After each batch, update this queue before moving on.
4. Run focused crawl for the batch and keep `docs/component-page-crawl-audit.*` as evidence, not as the source of truth.
5. For pending SSOT rows, update the `.pen` source through the approved SSOT workflow before running `npm run design:verify`; direct edits to generated JSON or manifest files will be reverted by `design:sync`.
