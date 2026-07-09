# Component Docs 43 Completion Report

Generated: 2026-07-09

Branch: `codex/docs-43-audit`  
Commit: `07aafa1 Audit added component docs`

## Conclusion

The 43-component delta is complete for the repo SSOT/docs audit and the downstream
Figma export record.

- SSOT/docs audit: 43 done, 0 pending
- Figma export: 43 done, 0 pending
- Pushed branch: `origin/codex/docs-43-audit`
- Pull request status: branch is ready, but PR creation was blocked by GitHub auth/integration permissions

## Scope

The 43 components are the delta between the Figma foundation branch snapshot and
the current SSOT snapshot.

- Baseline Figma branch snapshot: `aacb6b0c` (`figma/foundations-8`, 173 components)
- Target SSOT snapshot: `ssot/complete-delta-173-216-codex`, 216 components
- Diff method: `docs/figma-library-discovery.generated.json` by `components[].key`
- Scope count: 43 components
- Out of scope: cold-test public copy counts (`26` crystallized builds, `71` deduped category discoveries)

## Completion Evidence

The source progress file records every component as `Done` for both SSOT/docs
audit and Figma export:

- `docs/component-docs-43-ssot-figma-progress.md`
- Current counts in that file:
  - `SSOT/docs audit: 43 done, 0 pending`
  - `Figma export: 43 done, 0 pending`

The Figma export log in the same file records:

- Target file: GunjoUI Library Foundations (#8)
- File key: `1hTzNSFLwOA88R15KCX9iG`
- Expected components: 43
- Done sections: 43
- Done components: 43
- Missing components: `[]`
- Export direction: repo SSOT -> Figma downstream only

## 43 Components

| # | Key | Title | Category | SSOT/docs audit | Figma export |
|---:|---|---|---|---|---|
| 1 | `actionQueue` | ActionQueue | display | Done | Done |
| 2 | `amountBreakdown` | AmountBreakdown | display | Done | Done |
| 3 | `approvalWorkflow` | ApprovalWorkflow | display | Done | Done |
| 4 | `bottomActionBar` | BottomActionBar | display | Done | Done |
| 5 | `checkList` | CheckList | display | Done | Done |
| 6 | `companyCell` | CompanyCell | display | Done | Done |
| 7 | `documentRow` | DocumentRow | display | Done | Done |
| 8 | `eventCalendar` | EventCalendar | display | Done | Done |
| 9 | `expiryBadge` | ExpiryBadge | display | Done | Done |
| 10 | `filterChips` | FilterChips | display | Done | Done |
| 11 | `gantt` | Gantt | display | Done | Done |
| 12 | `itinerary` | Itinerary | display | Done | Done |
| 13 | `kanbanBoard` | KanbanBoard | display | Done | Done |
| 14 | `leaderboard` | Leaderboard | display | Done | Done |
| 15 | `limitMonitor` | LimitMonitor | display | Done | Done |
| 16 | `lineageGraph` | LineageGraph | display | Done | Done |
| 17 | `lineChip` | LineChip | display | Done | Done |
| 18 | `listCard` | ListCard | display | Done | Done |
| 19 | `loyaltySummaryCard` | LoyaltySummaryCard | display | Done | Done |
| 20 | `matchCard` | MatchCard | display | Done | Done |
| 21 | `meter` | Meter | display | Done | Done |
| 22 | `navRow` | NavRow | display | Done | Done |
| 23 | `originDestination` | OriginDestination | display | Done | Done |
| 24 | `pageHeader` | PageHeader | display | Done | Done |
| 25 | `paretoChart` | ParetoChart | display | Done | Done |
| 26 | `personCell` | PersonCell | display | Done | Done |
| 27 | `radioCard` | RadioCard | display | Done | Done |
| 28 | `referenceValue` | ReferenceValue | display | Done | Done |
| 29 | `relationshipRow` | RelationshipRow | display | Done | Done |
| 30 | `routeStops` | RouteStops | display | Done | Done |
| 31 | `scheduleGrid` | ScheduleGrid | display | Done | Done |
| 32 | `seatMap` | SeatMap | display | Done | Done |
| 33 | `sectionList` | SectionList | display | Done | Done |
| 34 | `signedRecord` | SignedRecord | display | Done | Done |
| 35 | `statGroup` | StatGroup | display | Done | Done |
| 36 | `statusBoard` | StatusBoard | display | Done | Done |
| 37 | `stringline` | Stringline | display | Done | Done |
| 38 | `ticketStub` | TicketStub | display | Done | Done |
| 39 | `weekView` | WeekView | display | Done | Done |
| 40 | `safetyBanner` | SafetyBanner | feedback | Done | Done |
| 41 | `coSign` | CoSign | inputs | Done | Done |
| 42 | `scanGate` | ScanGate | inputs | Done | Done |
| 43 | `segmentedControl` | SegmentedControl | inputs | Done | Done |

## Audit Standards Applied

- Main docs preview and States/Variants previews were treated as separate surfaces.
- Preview and copyable code were aligned for labels, data, handlers, states,
  tooltips, overlays, and portal containment.
- Production-like previews no longer use placeholder explanation text such as
  "select an item to show details here" instead of actual resulting UI.
- Toasts, dialogs, popovers, sheets, and drawers render inside the preview surface
  when containment is supported.
- Disabled controls expose a reason on hover/focus.
- Japanese/English copy and light/dark rendering were included in the audit pass.
- Figma remains downstream of the repo SSOT; no Figma values were reverse-applied.

## Verification

Completed checks:

- `npm run build`
- `npm run type-check`
- `npm run design:verify`
- `npm run docs:crawl:components -- --only=...43 routes... --base-url=http://127.0.0.1:13033`
  - Result: 0 pages with errors, 0 pages with warnings
- `npm run docs:audit:components`
- `npm run docs:audit:mobile-disabled-feedback`
  - Result: `needs-review=0`
- `npm run docs:audit:en-locale-sweep -- --base-url=http://127.0.0.1:13033`
  - Unexpected Japanese text candidates: 0
  - Horizontal overflow pages: 0
  - Note: command exits non-zero because existing `/showcase` console/failed-request
    noise remains outside this 43-component docs scope
- Static search for product-like placeholder explanation text and abbreviated
  copyable code snippets in the audited component docs
  - Result: 0 target-scope hits
- `git diff --check`

## Remaining Operational Blocker

The implementation branch is pushed, but PR creation and merge could not be
completed from this environment.

- `gh auth status` reports invalid GitHub tokens.
- GitHub connector PR creation returns `403 Resource not accessible by integration`.
- Branch URL for PR creation:
  `https://github.com/uixhero/gunjo/pull/new/codex/docs-43-audit`

