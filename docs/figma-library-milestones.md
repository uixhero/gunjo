# Figma Library Foundations Milestones

Updated: 2026-06-28

Source of truth:

- Repository: `/Users/hikaby/dev/gunjo-figma`
- Branch: `figma/foundations-8`
- Figma file: `GunjoUI Library Foundations (#8)`
- Tracking source: `docs/figma-library-foundations.md` and
  `docs/figma-library-discovery.generated.json`

## Current Status

- Discovery scope: 162 components / templates
- Recorded exports: 124
- Remaining exports: 38
- Completed category blocks: `Inputs`, `Overlay`, `Display`, `Charts`
- Current working category: `Feedback`
- Last recorded component: `Stepper`
- Recommended next component: `Banner`

## Completed Blocks

### Foundations

- Tokens, runtime radius, text styles, effect styles, and page skeleton are
  recorded in `docs/figma-library-foundations.md`.

### Inputs

All 37 Inputs components are recorded:

- Button
- TooltipButton
- CopyButton
- ChatInput
- ChatComposer
- Input
- Label
- Checkbox
- Switch
- Textarea
- RadioGroup
- Slider
- RangeSlider
- Select
- ToggleGroup
- Toggle
- NumberInput
- PasswordInput
- PasswordRequirementList
- PasswordStrengthMeter
- PasswordGroup
- PhoneInput
- PostalCodeInput
- SearchInput
- InputOTP
- Calendar
- FilterButton
- SortButton
- EditableField
- Form
- Combobox
- DatePicker
- DateRangePicker
- TimePicker
- TagInput
- Mention
- FileUploader

### Overlay

All 16 Overlay components are recorded:

- Dialog
- AlertDialog
- Modal
- Sheet
- Drawer
- Popover
- Tooltip
- HoverCard
- DropdownMenu
- ContextMenu
- ChatPanel
- FloatingPanel
- ShareModal
- OnboardingFlow
- MediaLightbox
- MediaPickerDialog

## Display Progress

Display recorded so far:

- Badge
- Avatar
- Separator
- Card
- Accordion
- AccordionGroup
- List
- MarkdownRenderer
- MetadataList
- Rating
- RevealSection
- SearchableAccordion
- Skeleton
- Spacer
- Statistic
- SwatchGroup
- Table
- Kbd
- Img
- ChatMessage
- ImagePreview
- ToolPill
- Code
- EmptyState
- Tag
- Icon
- ColorSwatch
- Carousel
- DataTable
- ActionDataTable
- AvatarGroup
- CodeBlock
- Timeline
- TreeView
- FileTree
- DocNote
- AssetCard
- AssetGrid
- TagEditor

Display remaining:

- None

## Charts Progress

Charts recorded so far:

- ChartLegend
- SparklineChart
- LineChart
- RibbonChart
- RadialBarChart
- BarChart
- ConcentricProgressCard
- StackedBarChart
- DistributionBar
- MiniDistributionBarCard
- SegmentTimelineCard
- DonutChart
- PieChart
- GaugeChart
- SegmentedGaugeCard
- RadarChart
- HeatmapChart
- ActivityTimelineCard
- LabeledDonutCard
- RetentionCohortCard
- ChoroplethMap
- QuadrantMatrix
- AnalyticsCard

Charts remaining:

- None

## Remaining Milestones

### Milestone 1: Finish Display

Status: complete.

### Milestone 2: Charts

Status: complete.

### Milestone 3: Feedback

Recorded so far:

- Alert
- Progress
- StatusScreen
- Spinner
- Toast
- NotificationCenter
- StatusBar
- ProgressWidget
- Stepper

Remaining:

- Banner
- ToastProvider

### Milestone 4: Navigation

Already recorded:

- Tabs
- Breadcrumb
- Pagination

Remaining:

- TextLink
- DocumentPager
- NavigationMenu
- Sidebar
- SidebarItem
- Menubar
- Command
- AppRail
- CommandPalette
- RightRail
- PageAside
- Header
- Footer

### Milestone 5: Layout

Remaining:

- AspectRatio
- Container
- HStack
- VStack
- Cluster
- Grid
- ScrollArea
- Resizable
- CollapsiblePanelToggle
- InspectorPanel
- SpatialCanvas
- AssetInspectorPanel
- DeviceFrame
- MarqueeFrame

### Milestone 6: Patterns

Patterns should stay last, after their component dependencies are represented.

Remaining:

- DashboardTemplate
- EditorTemplate
- LandingTemplate
- AuthTemplate
- KanbanTemplate
- ChatTemplate
- SettingsTemplate
- BannalyzeTemplate
- MediaLibraryTemplate

## Operating Rules

- Keep using the dedicated worktree at `/Users/hikaby/dev/gunjo-figma`.
- Keep `.pen` read-only; Figma is the downstream export target.
- Do not reverse Figma changes back into SSOT.
- For each component, update `docs/figma-library-foundations.md`, run
  `npm run design:verify`, run `gitleaks`, commit, and push
  `figma/foundations-8`.
