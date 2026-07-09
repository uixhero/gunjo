# Component Docs 43 SSOT / Figma Progress

This is the working checklist for TASK-4/TASK-5: the 43 component delta between
the Figma foundation branch snapshot and the current SSOT snapshot.

## Scope Lock

- Baseline Figma branch snapshot: `aacb6b0c` (`figma/foundations-8`, 173 components)
- Target SSOT snapshot: `ssot/complete-delta-173-216-codex`, 216 components
- Diff method: compare `docs/figma-library-discovery.generated.json` by `components[].key`
- Scope count: 43 components
- Not in this scope: cold-test public copy counts (`26` crystallized builds, `71` deduped category discoveries)

## Audit Rules

- Main docs preview and States/Variants previews are separate surfaces.
- Do not fix overlays by increasing docs preview height.
- Do not set arbitrary fixed `previewHeight`; use real content sizing or `previewHeight="auto"`.
- Preview and copyable code must match exactly: labels, data, handlers, state, tooltips, and portals.
- Toasts, dialogs, popovers, menus, and other overlays must render inside the preview surface when the component supports containment.
- Disabled controls must explain why they are disabled on hover/focus.
- Japanese/English locale switching and light/dark mode must both be checked.
- Figma is downstream of repo SSOT. Do not reverse Figma values into source.

## Separate Improvements

These docs improvements are intentionally kept outside the 43-count progress:

- FileUploader
- FilterButton
- Form
- InputOTP
- SearchInput
- Select
- Slider
- SortButton
- Switch
- TagInput

## 43-Component Progress

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

## Current Counts

- SSOT/docs audit: 43 done, 0 pending
- Figma export: 43 done, 0 pending
- Figma pages: Display 33, Navigation 3, Charts 3, Feedback 1, Inputs 3

## Verification Log

- 2026-07-03: Figma export for all 43 delta components
  - Target file: GunjoUI Library Foundations (#8), file key 1hTzNSFLwOA88R15KCX9iG
  - Figma validation: expected 43, doneSections 43, doneComponents 43, missing []
  - Pages: Display 33, Navigation 3, Charts 3, Feedback 1, Inputs 3
  - Export direction: repo SSOT -> Figma downstream only; no Figma values were reverse-applied.
- 2026-07-02: `actionQueue`, `amountBreakdown`, `approvalWorkflow`, `bottomActionBar`, `checkList`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=action-queue,amount-breakdown,approval-workflow,bottom-action-bar,check-list --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, disabled reason tooltips for ApprovalWorkflow and CheckList.
- 2026-07-02: `companyCell`, `documentRow`, `eventCalendar`, `expiryBadge`, `filterChips`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=company-cell,document-row,event-calendar,expiry-badge,filter-chips --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, disabled reason tooltips for DocumentRow and FilterChips.
- 2026-07-02: `gantt`, `itinerary`, `kanbanBoard`, `leaderboard`, `limitMonitor`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=gantt,itinerary,kanban-board,leaderboard,limit-monitor --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, and selection feedback for Gantt, Itinerary, KanbanBoard, and Leaderboard.
- 2026-07-02: `lineageGraph`, `lineChip`, `listCard`, `loyaltySummaryCard`, `matchCard`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=lineage-graph,line-chip,list-card,loyalty-summary-card,match-card --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, and selection/action feedback for LineageGraph, ListCard, LoyaltySummaryCard, and MatchCard.
- 2026-07-02: `meter`, `navRow`, `originDestination`, `pageHeader`, `paretoChart`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=meter,nav-row,origin-destination,page-header,pareto-chart --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, EN preview language state, and tooltips for OriginDestination swap plus PageHeader back/action controls.
- 2026-07-02: `personCell`, `radioCard`, `referenceValue`, `relationshipRow`, `routeStops`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=person-cell,radio-card,reference-value,relationship-row,route-stops --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, EN preview language state, RadioCard disabled reason tooltip, and RouteStops action feedback.
- 2026-07-02: `scheduleGrid`, `seatMap`, `sectionList`, `signedRecord`, `statGroup`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=schedule-grid,seat-map,section-list,signed-record,stat-group --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, EN preview language state, and SignedRecord disabled reason tooltip.
- 2026-07-02: `statusBoard`, `stringline`, `ticketStub`, `weekView`, `safetyBanner`
  - `npm run type-check`
  - `npm run design:verify`
  - `npm run docs:crawl:components -- --only=status-board,stringline,ticket-stub,week-view,safety-banner --base-url=http://localhost:13033`
  - Browser check: ja/en descriptions, States and variants section, preview overflow, EN preview language state, and SafetyBanner disabled reason tooltip.
