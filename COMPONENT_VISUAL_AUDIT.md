# Component Visual Audit Checklist (Docs vs Pen)

docs と pen の見た目差分を 1 コンポーネントずつ潰すための台帳です。

## How To Use

1. `npm run design:audit:docs-capture` で docs スクリーンショットを更新する。
2. Pencil から pen スクリーンショットを `./.design-audit/pen/<category>/<componentKey>.png` に保存する。
3. `npm run design:audit:checklist` を実行し、一覧と比較ページを再生成する。
4. `./.design-audit/compare/**` を開いて 1 件ずつ修正する。

## Snapshot Summary

- rows total: 70
- docs screenshots ready: 70/70
- pen screenshots ready: 70/70
- structural warnings: 0


## Atoms

- total: 20, docs captured: 20, pen captured: 20, auto warnings: 0

| Review | Component | Docs Route | Docs Shot | Pen Shot | Auto Check | Status | Compare |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ☐ | `button` (Button) | /docs/components/atoms/button | [docs](./.design-audit/docs/atoms/button.preview.png) | [pen](./.design-audit/pen/atoms/button.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/button--button.md) |
| ☐ | `input` (Input) | /docs/components/atoms/input | [docs](./.design-audit/docs/atoms/input.preview.png) | [pen](./.design-audit/pen/atoms/input.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/input--input.md) |
| ☐ | `badge` (Badge) | /docs/components/atoms/badge | [docs](./.design-audit/docs/atoms/badge.preview.png) | [pen](./.design-audit/pen/atoms/badge.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/badge--badge.md) |
| ☐ | `label` (Label) | /docs/components/atoms/label | [docs](./.design-audit/docs/atoms/label.preview.png) | [pen](./.design-audit/pen/atoms/label.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/label--label.md) |
| ☐ | `checkbox` (Checkbox) | /docs/components/atoms/checkbox | [docs](./.design-audit/docs/atoms/checkbox.preview.png) | [pen](./.design-audit/pen/atoms/checkbox.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/checkbox--checkbox.md) |
| ☐ | `separator` (Separator) | /docs/components/atoms/separator | [docs](./.design-audit/docs/atoms/separator.preview.png) | [pen](./.design-audit/pen/atoms/separator.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/separator--separator.md) |
| ☐ | `switch` (Switch) | /docs/components/atoms/switch | [docs](./.design-audit/docs/atoms/switch.preview.png) | [pen](./.design-audit/pen/atoms/switch.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/switch--switch.md) |
| ☐ | `textarea` (Textarea) | /docs/components/atoms/textarea | [docs](./.design-audit/docs/atoms/textarea.preview.png) | [pen](./.design-audit/pen/atoms/textarea.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/textarea--textarea.md) |
| ☐ | `alert` (Alert) | /docs/components/atoms/alert | [docs](./.design-audit/docs/atoms/alert.preview.png) | [pen](./.design-audit/pen/atoms/alert.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/alert--alert.md) |
| ☐ | `avatar` (Avatar) | /docs/components/atoms/avatar | [docs](./.design-audit/docs/atoms/avatar.preview.png) | [pen](./.design-audit/pen/atoms/avatar.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/avatar--avatar.md) |
| ☐ | `kbd` (Kbd) | /docs/components/atoms/kbd | [docs](./.design-audit/docs/atoms/kbd.preview.png) | [pen](./.design-audit/pen/atoms/kbd.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/kbd--kbd.md) |
| ☐ | `img` (Img) | /docs/components/atoms/img | [docs](./.design-audit/docs/atoms/img.preview.png) | [pen](./.design-audit/pen/atoms/img.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/img--img.md) |
| ☐ | `progress` (Progress) | /docs/components/atoms/progress | [docs](./.design-audit/docs/atoms/progress.preview.png) | [pen](./.design-audit/pen/atoms/progress.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/progress--progress.md) |
| ☐ | `spinner` (Spinner) | /docs/components/atoms/spinner | [docs](./.design-audit/docs/atoms/spinner.preview.png) | [pen](./.design-audit/pen/atoms/spinner.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/spinner--spinner.md) |
| ☐ | `radioGroup` (RadioGroup) | /docs/components/atoms/radio-group | [docs](./.design-audit/docs/atoms/radio-group.preview.png) | [pen](./.design-audit/pen/atoms/radioGroup.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/radio-group--radioGroup.md) |
| ☐ | `slider` (Slider) | /docs/components/atoms/slider | [docs](./.design-audit/docs/atoms/slider.preview.png) | [pen](./.design-audit/pen/atoms/slider.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/slider--slider.md) |
| ☐ | `select` (Select) | /docs/components/atoms/select | [docs](./.design-audit/docs/atoms/select.preview.png) | [pen](./.design-audit/pen/atoms/select.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/select--select.md) |
| ☐ | `toggleGroup` (ToggleGroup) | /docs/components/atoms/toggle-group | [docs](./.design-audit/docs/atoms/toggle-group.preview.png) | [pen](./.design-audit/pen/atoms/toggleGroup.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/toggle-group--toggleGroup.md) |
| ☐ | `toolPill` (ToolPill) | /docs/components/atoms/tool-pill | [docs](./.design-audit/docs/atoms/tool-pill.preview.png) | [pen](./.design-audit/pen/atoms/toolPill.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/tool-pill--toolPill.md) |
| ☐ | `skeleton` (Skeleton) | /docs/components/atoms/skeleton | [docs](./.design-audit/docs/atoms/skeleton.preview.png) | [pen](./.design-audit/pen/atoms/skeleton.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/atoms/skeleton--skeleton.md) |

## Molecules

- total: 32, docs captured: 32, pen captured: 32, auto warnings: 0

| Review | Component | Docs Route | Docs Shot | Pen Shot | Auto Check | Status | Compare |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ☐ | `card` (Card) | /docs/components/molecules/card | [docs](./.design-audit/docs/molecules/card.preview.png) | [pen](./.design-audit/pen/molecules/card.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/card--card.md) |
| ☐ | `list` (List) | /docs/components/molecules/list | [docs](./.design-audit/docs/molecules/list.preview.png) | [pen](./.design-audit/pen/molecules/list.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/list--list.md) |
| ☐ | `accordion` (Accordion) | /docs/components/molecules/accordion | [docs](./.design-audit/docs/molecules/accordion.preview.png) | [pen](./.design-audit/pen/molecules/accordion.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/accordion--accordion.md) |
| ☐ | `breadcrumb` (Breadcrumb) | /docs/components/molecules/breadcrumb | [docs](./.design-audit/docs/molecules/breadcrumb.preview.png) | [pen](./.design-audit/pen/molecules/breadcrumb.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/breadcrumb--breadcrumb.md) |
| ☐ | `dropdownMenu` (Dropdown Menu) | /docs/components/molecules/dropdown-menu | [docs](./.design-audit/docs/molecules/dropdown-menu.preview.png) | [pen](./.design-audit/pen/molecules/dropdownMenu.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/dropdown-menu--dropdownMenu.md) |
| ☐ | `popover` (Popover) | /docs/components/molecules/popover | [docs](./.design-audit/docs/molecules/popover.preview.png) | [pen](./.design-audit/pen/molecules/popover.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/popover--popover.md) |
| ☐ | `command` (Command) | /docs/components/molecules/command | [docs](./.design-audit/docs/molecules/command.preview.png) | [pen](./.design-audit/pen/molecules/command.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/command--command.md) |
| ☐ | `calendar` (Calendar) | /docs/components/molecules/calendar | [docs](./.design-audit/docs/molecules/calendar.preview.png) | [pen](./.design-audit/pen/molecules/calendar.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/calendar--calendar.md) |
| ☐ | `table` (Table) | /docs/components/molecules/table | [docs](./.design-audit/docs/molecules/table.preview.png) | [pen](./.design-audit/pen/molecules/table.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/table--table.md) |
| ☐ | `tabs` (Tabs) | /docs/components/molecules/tabs | [docs](./.design-audit/docs/molecules/tabs.preview.png) | [pen](./.design-audit/pen/molecules/tabs.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/tabs--tabs.md) |
| ☐ | `toast` (Toast) | /docs/components/molecules/toast | [docs](./.design-audit/docs/molecules/toast.preview.png) | [pen](./.design-audit/pen/molecules/toast.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/toast--toast.md) |
| ☐ | `modal` (Modal) | /docs/components/molecules/modal | [docs](./.design-audit/docs/molecules/modal.preview.png) | [pen](./.design-audit/pen/molecules/modal.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/modal--modal.md) |
| ☐ | `carousel` (Carousel) | /docs/components/molecules/carousel | [docs](./.design-audit/docs/molecules/carousel.preview.png) | [pen](./.design-audit/pen/molecules/carousel.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/carousel--carousel.md) |
| ☐ | `pagination` (Pagination) | /docs/components/molecules/pagination | [docs](./.design-audit/docs/molecules/pagination.preview.png) | [pen](./.design-audit/pen/molecules/pagination.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/pagination--pagination.md) |
| ☐ | `notificationCenter` (Notification Center) | /docs/components/molecules/notification-center | [docs](./.design-audit/docs/molecules/notification-center.preview.png) | [pen](./.design-audit/pen/molecules/notificationCenter.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/notification-center--notificationCenter.md) |
| ☐ | `dialog` (Dialog) | /docs/components/molecules/dialog | [docs](./.design-audit/docs/molecules/dialog.preview.png) | [pen](./.design-audit/pen/molecules/dialog.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/dialog--dialog.md) |
| ☐ | `sheet` (Sheet) | /docs/components/molecules/sheet | [docs](./.design-audit/docs/molecules/sheet.preview.png) | [pen](./.design-audit/pen/molecules/sheet.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/sheet--sheet.md) |
| ☐ | `tooltip` (Tooltip) | /docs/components/molecules/tooltip | [docs](./.design-audit/docs/molecules/tooltip.preview.png) | [pen](./.design-audit/pen/molecules/tooltip.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/tooltip--tooltip.md) |
| ☐ | `hoverCard` (HoverCard) | /docs/components/molecules/hover-card | [docs](./.design-audit/docs/molecules/hover-card.preview.png) | [pen](./.design-audit/pen/molecules/hoverCard.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/hover-card--hoverCard.md) |
| ☐ | `contextMenu` (ContextMenu) | /docs/components/molecules/context-menu | [docs](./.design-audit/docs/molecules/context-menu.preview.png) | [pen](./.design-audit/pen/molecules/contextMenu.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/context-menu--contextMenu.md) |
| ☐ | `menubar` (Menubar) | /docs/components/molecules/menubar | [docs](./.design-audit/docs/molecules/menubar.preview.png) | [pen](./.design-audit/pen/molecules/menubar.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/menubar--menubar.md) |
| ☐ | `scrollArea` (ScrollArea) | /docs/components/molecules/scroll-area | [docs](./.design-audit/docs/molecules/scroll-area.preview.png) | [pen](./.design-audit/pen/molecules/scrollArea.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/scroll-area--scrollArea.md) |
| ☐ | `resizable` (Resizable) | /docs/components/molecules/resizable | [docs](./.design-audit/docs/molecules/resizable.preview.png) | [pen](./.design-audit/pen/molecules/resizable.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/resizable--resizable.md) |
| ☐ | `statusBar` (StatusBar) | /docs/components/molecules/status-bar | [docs](./.design-audit/docs/molecules/status-bar.preview.png) | [pen](./.design-audit/pen/molecules/statusBar.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/status-bar--statusBar.md) |
| ☐ | `sidebarItem` (SidebarItem) | /docs/components/molecules/sidebar-item | [docs](./.design-audit/docs/molecules/sidebar-item.preview.png) | [pen](./.design-audit/pen/molecules/sidebarItem.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/sidebar-item--sidebarItem.md) |
| ☐ | `aiChatInput` (AIChatInput) | /docs/components/molecules/ai-chat | [docs](./.design-audit/docs/molecules/ai-chat.preview.png) | [pen](./.design-audit/pen/molecules/aiChatInput.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/ai-chat--aiChatInput.md) |
| ☐ | `aiChatMessage` (AIChatMessage) | /docs/components/molecules/ai-chat | [docs](./.design-audit/docs/molecules/ai-chat.preview.png) | [pen](./.design-audit/pen/molecules/aiChatMessage.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/ai-chat--aiChatMessage.md) |
| ☐ | `filterButton` (FilterButton) | /docs/components/molecules/filter-button | [docs](./.design-audit/docs/molecules/filter-button.preview.png) | [pen](./.design-audit/pen/molecules/filterButton.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/filter-button--filterButton.md) |
| ☐ | `sortButton` (SortButton) | /docs/components/molecules/sort-button | [docs](./.design-audit/docs/molecules/sort-button.preview.png) | [pen](./.design-audit/pen/molecules/sortButton.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/sort-button--sortButton.md) |
| ☐ | `progressWidget` (ProgressWidget) | /docs/components/molecules/progress-widget | [docs](./.design-audit/docs/molecules/progress-widget.preview.png) | [pen](./.design-audit/pen/molecules/progressWidget.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/progress-widget--progressWidget.md) |
| ☐ | `stepper` (Stepper) | /docs/components/molecules/stepper | [docs](./.design-audit/docs/molecules/stepper.preview.png) | [pen](./.design-audit/pen/molecules/stepper.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/stepper--stepper.md) |
| ☐ | `form` (Form) | /docs/components/molecules/form | [docs](./.design-audit/docs/molecules/form.preview.png) | [pen](./.design-audit/pen/molecules/form.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/molecules/form--form.md) |

## Organisms

- total: 9, docs captured: 9, pen captured: 9, auto warnings: 0

| Review | Component | Docs Route | Docs Shot | Pen Shot | Auto Check | Status | Compare |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ☐ | `appRail` (App Rail) | /docs/components/organisms/app-rail | [docs](./.design-audit/docs/organisms/app-rail.preview.png) | [pen](./.design-audit/pen/organisms/appRail.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/app-rail--appRail.md) |
| ☐ | `commandPalette` (Command Palette) | /docs/components/organisms/command-palette | [docs](./.design-audit/docs/organisms/command-palette.preview.png) | [pen](./.design-audit/pen/organisms/commandPalette.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/command-palette--commandPalette.md) |
| ☐ | `rightRail` (Right Rail) | /docs/components/organisms/right-rail | [docs](./.design-audit/docs/organisms/right-rail.preview.png) | [pen](./.design-audit/pen/organisms/rightRail.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/right-rail--rightRail.md) |
| ☐ | `floatingPanel` (Floating Panel) | /docs/components/organisms/floating-panel | [docs](./.design-audit/docs/organisms/floating-panel.preview.png) | [pen](./.design-audit/pen/organisms/floatingPanel.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/floating-panel--floatingPanel.md) |
| ☐ | `inspectorPanel` (Inspector Panel) | /docs/components/organisms/inspector-panel | [docs](./.design-audit/docs/organisms/inspector-panel.preview.png) | [pen](./.design-audit/pen/organisms/inspectorPanel.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/inspector-panel--inspectorPanel.md) |
| ☐ | `spatialCanvas` (Spatial Canvas) | /docs/components/organisms/spatial-canvas | [docs](./.design-audit/docs/organisms/spatial-canvas.preview.png) | [pen](./.design-audit/pen/organisms/spatialCanvas.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/spatial-canvas--spatialCanvas.md) |
| ☐ | `shareModal` (Share Modal) | /docs/components/organisms/share-modal | [docs](./.design-audit/docs/organisms/share-modal.preview.png) | [pen](./.design-audit/pen/organisms/shareModal.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/share-modal--shareModal.md) |
| ☐ | `fileUploader` (File Uploader) | /docs/components/organisms/file-uploader | [docs](./.design-audit/docs/organisms/file-uploader.preview.png) | [pen](./.design-audit/pen/organisms/fileUploader.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/file-uploader--fileUploader.md) |
| ☐ | `toastProvider` (Toast Provider) | /docs/components/organisms/toast-provider | [docs](./.design-audit/docs/organisms/toast-provider.preview.png) | [pen](./.design-audit/pen/organisms/toastProvider.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/organisms/toast-provider--toastProvider.md) |

## Templates

- total: 9, docs captured: 9, pen captured: 9, auto warnings: 0

| Review | Component | Docs Route | Docs Shot | Pen Shot | Auto Check | Status | Compare |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ☐ | `dashboardTemplate` (Dashboard Template) | /docs/components/templates/dashboard | [docs](./.design-audit/docs/templates/dashboard.preview.png) | [pen](./.design-audit/pen/templates/dashboardTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/dashboard--dashboardTemplate.md) |
| ☐ | `editorTemplate` (Editor Template) | /docs/components/templates/editor | [docs](./.design-audit/docs/templates/editor.preview.png) | [pen](./.design-audit/pen/templates/editorTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/editor--editorTemplate.md) |
| ☐ | `landingTemplate` (Landing Template) | /docs/components/templates/landing | [docs](./.design-audit/docs/templates/landing.preview.png) | [pen](./.design-audit/pen/templates/landingTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/landing--landingTemplate.md) |
| ☐ | `authTemplate` (Auth Template) | /docs/components/templates/auth | [docs](./.design-audit/docs/templates/auth.preview.png) | [pen](./.design-audit/pen/templates/authTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/auth--authTemplate.md) |
| ☐ | `kanbanTemplate` (Kanban Template) | /docs/components/templates/kanban | [docs](./.design-audit/docs/templates/kanban.preview.png) | [pen](./.design-audit/pen/templates/kanbanTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/kanban--kanbanTemplate.md) |
| ☐ | `chatTemplate` (Chat Template) | /docs/components/templates/chat | [docs](./.design-audit/docs/templates/chat.preview.png) | [pen](./.design-audit/pen/templates/chatTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/chat--chatTemplate.md) |
| ☐ | `settingsTemplate` (Settings Template) | /docs/components/templates/settings | [docs](./.design-audit/docs/templates/settings.preview.png) | [pen](./.design-audit/pen/templates/settingsTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/settings--settingsTemplate.md) |
| ☐ | `bannalyzeTemplate` (Bannalyze Template) | /docs/components/templates/bannalyze | [docs](./.design-audit/docs/templates/bannalyze.preview.png) | [pen](./.design-audit/pen/templates/bannalyzeTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/bannalyze--bannalyzeTemplate.md) |
| ☐ | `mediaLibraryTemplate` (Media Library Template) | /docs/components/templates/media-library | [docs](./.design-audit/docs/templates/media-library.preview.png) | [pen](./.design-audit/pen/templates/mediaLibraryTemplate.png) | ✅ Structural pass | 🟢 ready to confirm | [open](./.design-audit/compare/templates/media-library--mediaLibraryTemplate.md) |

