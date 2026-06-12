# Lucide to Tabler icon migration audit

Parent issue: https://github.com/uixhero/gunjo/issues/219

## Scope

GunjoUI 本体コンポーネントは `src/components/**` に `lucide-react` import が残っていない状態です。このログは docs / patterns / demos / site UI 側に残っている Lucide usage を Tabler Icons へ移行するための管理台帳です。

## Current Inventory

Last checked: 2026-06-07

| Area | Remaining files | Notes |
| --- | ---: | --- |
| `src/components/**` | 0 | Issue #218 は実装面ではほぼ完了。検証・目視確認待ち。 |
| `app/components/**` | 0 | demo pages も移行完了。 |
| `app/docs/**` | 0 | component docs のコード例内 import も移行完了。 |
| `app/embed/**` | 0 | docs preview iframe 側は移行完了。 |
| `app/patterns/**` | 0 | 公開 / hidden patterns ともに移行完了。 |
| `app/page.tsx`, `app/showcase/page.tsx`, `app/error.tsx` | 0 | top-level pages は移行完了。 |

## Working Rules

- 移行は小分けにし、各バッチで「使用中 Lucide」「移行先 Tabler」「判断理由」「目視 URL」を残す。
- 対応が明確なものは同じ意味の Tabler icon へ置換する。
- 意味が変わる、視認性が落ちる、ブランド系アイコンの代替が曖昧なものは `Needs decision` に入れてユーザー確認する。
- docs のコード例も、実プレビューと同じ import に合わせる。
- icon-only / toggle button の tooltip ルールは維持する。
- 各バッチの最後に `npm run type-check` と `git diff --check` を通す。docs/component ページを触った場合は `npm run docs:audit:components` も通す。

## Batch Plan

| Batch | Status | Scope | Files |
| --- | --- | --- | --- |
| 01 | complete | Site shell / shared docs helpers | `app/components/doc/ComponentHelpers.tsx`, `app/components/doc/CopySpecButton.tsx`, `app/components/layout/CommandMenu.tsx`, `app/components/layout/Sidebar.tsx`, `app/components/layout/SiteHeader.tsx`, `app/components/layout/ThemeSwitcher.tsx`, `app/components/layout/ThemeToggle.tsx`, `app/components/tokens/ColorTokenCard.tsx` |
| 02 | complete | Top-level docs / site pages | `app/page.tsx`, `app/showcase/page.tsx`, `app/error.tsx`, `app/docs/introduction/page.tsx`, `app/docs/colors/page.tsx`, `app/docs/comparison/page.tsx`, `app/docs/stability/page.tsx`, `app/docs/tokens/page.tsx`, `app/docs/tokens/spec/page.tsx` |
| 03 | complete | AI handoff docs | `app/docs/ai-handoff/page.tsx`, `app/docs/ai-handoff/mcp/page.tsx`, `app/docs/ai-handoff/figma/page.tsx`, `app/docs/ai-handoff/cookbook/page.tsx`, `app/docs/ai-handoff/cookbook/[slug]/page.tsx` |
| 04 | complete | Navigation docs / embeds | `app/docs/components/app-rail/page.tsx`, `app/docs/components/breadcrumb/page.tsx`, `app/docs/components/command/page.tsx`, `app/docs/components/command-palette/page.tsx`, `app/docs/components/footer/page.tsx`, `app/docs/components/header/page.tsx`, `app/docs/components/sidebar/page.tsx`, `app/docs/components/sidebar-item/page.tsx`, `app/embed/command/page.tsx`, `app/embed/command-palette/page.tsx`, `app/embed/footer/page.tsx`, `app/embed/header/page.tsx` |
| 05 | complete | Feedback docs | `app/docs/components/alert/page.tsx`, `app/docs/components/alert-dialog/page.tsx`, `app/docs/components/banner/page.tsx`, `app/docs/components/progress-widget/page.tsx`, `app/docs/components/status-screen/page.tsx`, `app/docs/components/timeline/page.tsx` |
| 06 | complete | Overlay docs | `app/docs/components/_overlayAuditDocPage.tsx`, `app/docs/components/context-menu/page.tsx`, `app/docs/components/dropdown-menu/page.tsx`, `app/docs/components/floating-panel/page.tsx`, `app/docs/components/hover-card/page.tsx` |
| 07 | complete | Display / misc component docs | `app/docs/components/_category-overview.tsx`, `app/docs/components/button/page.tsx`, `app/docs/components/card/page.tsx`, `app/docs/components/charts/page.tsx`, `app/docs/components/dashboard/page.tsx`, `app/docs/components/auth/page.tsx`, `app/docs/components/file-tree/page.tsx`, `app/docs/components/metadata-list/page.tsx`, `app/docs/components/page.tsx`, `app/docs/components/tokens/page.tsx`, `app/docs/components/tool-pill/page.tsx`, `app/docs/components/tree-view/page.tsx` |
| 08 | complete | Public patterns | `app/patterns/dashboard/_lib/DashboardShell.tsx`, `app/patterns/auth/forgot-password/page.tsx`, `app/patterns/page.tsx`, `app/patterns/layout.tsx` |
| 09 | complete | Hidden / legacy patterns | `app/patterns/chat/page.tsx`, `app/patterns/editor/page.tsx`, `app/patterns/kanban/page.tsx`, `app/patterns/landing/page.tsx` |
| 10 | complete | Demo pages | `app/components/demos/*.tsx` |

## Common Mapping Candidates

| Lucide | Tabler candidate | Confidence | Notes |
| --- | --- | --- | --- |
| `AlertCircle` | `IconAlertCircle` | high | 同名対応。 |
| `AlertTriangle`, `TriangleAlert` | `IconAlertTriangle` | high | 警告用途。 |
| `ArrowLeft` | `IconArrowLeft` | high | 同名対応。 |
| `ArrowRight` | `IconArrowRight` | high | 同名対応。 |
| `ArrowUpRight` | `IconArrowUpRight` | high | 外部/遷移用途。 |
| `ArrowUpDown` | `IconArrowsSort` | medium | 並び替えなら `IconArrowsSort`。上下移動なら要確認。 |
| `BarChart3` | `IconChartBar` | high | ダッシュボード/分析用途。 |
| `Bell` | `IconBell` | high | 通知用途。 |
| `Bold` | `IconBold` | high | エディタ操作。 |
| `BookOpen` | `IconBook2` | medium | Tabler の見た目差があるため要目視。 |
| `Bookmark` | `IconBookmark` | high | 保存/ブックマーク。 |
| `Boxes` | `IconPackages` | medium | パターン/部品群用途。代替候補 `IconBoxMultiple`。 |
| `Box` | `IconBox` | high | オブジェクト/矩形。 |
| `Calculator` | `IconCalculator` | high | 同名対応。 |
| `Calendar`, `CalendarDays` | `IconCalendar`, `IconCalendarEvent` | medium | 日付単体は `IconCalendar`、予定/イベントなら `IconCalendarEvent`。 |
| `Check`, `CheckCircle`, `CheckCircle2` | `IconCheck`, `IconCircleCheck` | high | チェック単体か完了状態で使い分け。 |
| `ChefHat` | `IconChefHat` | high | 同名対応。 |
| `ChevronDown` | `IconChevronDown` | high | 同名対応。 |
| `ChevronRight` | `IconChevronRight` | high | 同名対応。 |
| `Clock`, `Clock3` | `IconClock`, `IconClockHour3` | medium | 具体時刻表現なら `IconClockHour3`。 |
| `Code` | `IconCode` | high | 同名対応。 |
| `Columns3` | `IconColumns3` | high | 同名対応。 |
| `Compass` | `IconCompass` | high | 同名対応。 |
| `Copy` | `IconCopy` | high | 同名対応。 |
| `Cpu` | `IconCpu` | high | 同名対応。 |
| `CreditCard` | `IconCreditCard` | high | 同名対応。 |
| `Download` | `IconDownload` | high | 同名対応。 |
| `Eraser` | `IconEraser` | high | 同名対応。 |
| `ExternalLink` | `IconExternalLink` | high | 同名対応。 |
| `Eye` | `IconEye` | high | 同名対応。 |
| `File`, `FileText`, `FileImage`, `FileVideo` | `IconFile`, `IconFileText`, `IconFileTypeJpg`, `IconFileTypeMp4` | medium | ファイル種別は用途ごとに要確認。 |
| `Filter`, `Funnel` | `IconFilter`, `IconFilterFilled` | medium | フィルター操作は `IconFilter` が基本。 |
| `Folder`, `FolderOpen` | `IconFolder`, `IconFolderOpen` | high | 同名対応。 |
| `Github` | `IconBrandGithub` | high | ブランド。 |
| `Globe2` | `IconWorld` | medium | 公開/言語/グローバル用途で確認。 |
| `Grid`, `LayoutGrid` | `IconLayoutGrid`, `IconGridDots` | medium | レイアウトか一覧かで使い分け。 |
| `HardDrive` | `IconDeviceDesktopAnalytics` / `IconDatabase` | low | ストレージ文脈は判断確認。 |
| `Hash` | `IconHash` | high | 同名対応。 |
| `HelpCircle` | `IconHelpCircle` | high | 同名対応。 |
| `Home` | `IconHome` | high | 同名対応。 |
| `Image` | `IconPhoto` | high | 画像用途。 |
| `Info` | `IconInfoCircle` | high | 情報用途。 |
| `Italic` | `IconItalic` | high | エディタ操作。 |
| `Languages` | `IconLanguage` | high | 言語切替。 |
| `Layers`, `Layers3` | `IconLayersSubtract`, `IconLayersIntersect` | low | レイヤー見た目の選定が必要。 |
| `LayoutDashboard` | `IconLayoutDashboard` | high | 同名対応。 |
| `LayoutPanelTop` | `IconLayoutNavbar` | medium | ナビ/パネル文脈で確認。 |
| `Lightbulb` | `IconBulb` | high | アイデア。 |
| `Linkedin` | `IconBrandLinkedin` | high | ブランド。 |
| `ListChecks` | `IconListCheck` | high | 同名対応。 |
| `Lock` | `IconLock` | high | 同名対応。 |
| `LogOut` | `IconLogout` | high | ログアウト。 |
| `MapPin` | `IconMapPin` | high | 同名対応。 |
| `Maximize2` | `IconMaximize` | high | 拡大。 |
| `Megaphone` | `IconSpeakerphone` | medium | 告知用途。 |
| `Menu` | `IconMenu2` | high | ハンバーガー。 |
| `MessageCircle`, `MessageSquare` | `IconMessageCircle`, `IconMessage` | medium | コメント/チャットで使い分け。 |
| `Minus` | `IconMinus` | high | 同名対応。 |
| `Monitor` | `IconDeviceDesktop` | high | デスクトップ表示。 |
| `Moon` | `IconMoon` | high | 同名対応。 |
| `MoreHorizontal` | `IconDots` | high | 三点メニュー。 |
| `MousePointer2` | `IconPointer` | medium | 選択ツール用途。 |
| `Move` | `IconArrowsMove` | high | 移動。 |
| `Network` | `IconNetwork` | high | 同名対応。 |
| `Package` | `IconPackage` | high | 同名対応。 |
| `Palette` | `IconPalette` | high | 同名対応。 |
| `Paperclip` | `IconPaperclip` | high | 添付。 |
| `PanelLeftOpen` | `IconLayoutSidebarLeftExpand` | high | サイドバー開閉。 |
| `PenLine` | `IconPencil` | medium | 線描画なら `IconPencilMinus` なども候補。 |
| `Phone` | `IconPhone` | high | 同名対応。 |
| `Play` | `IconPlayerPlay` | high | 再生。 |
| `Plus`, `PlusCircle` | `IconPlus`, `IconCirclePlus` | high | 追加。 |
| `Repeat2` | `IconRepeat` | high | 再投稿/繰り返し。 |
| `Rocket` | `IconRocket` | high | 同名対応。 |
| `RotateCcw` | `IconRotate` | medium | 戻す/リセット文脈で確認。 |
| `Ruler` | `IconRuler` | high | 同名対応。 |
| `Save` | `IconDeviceFloppy` | high | 保存。 |
| `Search` | `IconSearch` | high | 同名対応。 |
| `Send` | `IconSend` | high | 同名対応。 |
| `Settings` | `IconSettings` | high | 同名対応。 |
| `Share2` | `IconShare2` | high | 同名対応。 |
| `ShieldAlert` | `IconShieldExclamation` | high | 障害/危険通知。 |
| `ShieldCheck` | `IconShieldCheck` | high | 安全/検証済み。 |
| `SlidersHorizontal` | `IconAdjustmentsHorizontal` | high | 調整。 |
| `Smartphone` | `IconDeviceMobile` | high | 同名対応。 |
| `Smile` | `IconMoodSmile` | high | 絵文字/表情。 |
| `Sparkles` | `IconSparkles` | high | AI/生成。 |
| `Square` | `IconSquare` | high | 同名対応。 |
| `Star` | `IconStar`, `IconStarFilled` | high | 評価/お気に入りで使い分け。 |
| `Sun` | `IconSun` | high | 同名対応。 |
| `Tablet` | `IconDeviceTablet` | high | 同名対応。 |
| `Tag` | `IconTag` | high | 同名対応。 |
| `Target` | `IconTarget` | high | 同名対応。 |
| `Terminal` | `IconTerminal2` | high | コマンド/端末。 |
| `Trash`, `Trash2` | `IconTrash` | high | 削除。 |
| `TrendingUp` | `IconTrendingUp` | high | 同名対応。 |
| `Type` | `IconTypography` | high | タイポグラフィ。 |
| `Underline` | `IconUnderline` | high | エディタ操作。 |
| `User`, `UserRound`, `Users` | `IconUser`, `IconUserCircle`, `IconUsers` | medium | アバター/個人/複数で使い分け。 |
| `Video` | `IconVideo` | high | 同名対応。 |
| `WifiOff` | `IconWifiOff` | high | 同名対応。 |
| `Wind` | `IconWind` | high | motion/easing 文脈。 |
| `Workflow` | `IconRoute` / `IconSitemap` | low | AI handoff 文脈で確認。 |
| `Wrench` | `IconTool` | medium | 設定/修理/メンテで確認。 |
| `X` | `IconX` | high | 閉じる。 |
| `Youtube` | `IconBrandYoutube` | high | ブランド。 |
| `ZoomIn`, `ZoomOut` | `IconZoomIn`, `IconZoomOut` | high | 同名対応。 |

## Needs Decision

| Lucide | File / context | Candidate | Question | Decision |
| --- | --- | --- | --- | --- |
| `HardDrive` | progress / metadata / storage contexts | `IconDatabase`, `IconDeviceDesktopAnalytics`, `IconServer` | ストレージ容量をどの比喩で統一するか。 | ProgressWidget のストレージ使用量は `IconDatabase` へ寄せる。 |
| `Layers`, `Layers3` | editor / layout / overview contexts | `IconLayersIntersect`, `IconLayersSubtract`, `IconStack2` | レイヤーの見た目をどれに寄せるか。 | FloatingPanel の重なり順文脈は `IconStack2`。editor / layout は後続バッチで個別確認。 |
| `Workflow` | AI handoff page | `IconRoute`, `IconSitemap`, `IconWorkflow` if available | AI 連携の流れをどの記号で表現するか。 | AI handoff の flow / handoff 文脈は `IconRoute` へ寄せる。 |
| `Boxes` | patterns overview | `IconPackages`, `IconBoxMultiple` | パターン群の記号をパッケージ寄りにするか、ボックス群にするか。 | home entry uses `IconPackages`; patterns overview still pending |

## Migration Log

| Date | Batch | Files | Lucide imports removed | Tabler imports added | Verification | Notes |
| --- | --- | --- | ---: | ---: | --- | --- |
| 2026-06-07 | setup | `docs/icon-migration-audit.md` | 0 | 0 | not run | 管理ログと候補対応表を追加。 |
| 2026-06-07 | 01 | shared docs helpers / site shell | 8 | 8 | `npm run type-check`, `git diff --check` | Site shell と docs helper の Lucide import を Tabler へ置換。 |
| 2026-06-07 | 02 | top-level docs / site pages | 9 | 9 | `npm run type-check`, `git diff --check` | トップページ、Showcase、error、introduction、colors、comparison、stability、tokens overview/spec の Lucide import を Tabler へ置換。 |
| 2026-06-07 | 03 | AI handoff docs | 5 | 5 | `npm run type-check`, `git diff --check` | AI handoff、MCP、Figma plugin、cookbook index/detail の Lucide import を Tabler へ置換。 |
| 2026-06-07 | 04 | navigation docs / embeds | 12 | 12 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | AppRail、Breadcrumb、Command、CommandPalette、Footer、Header、Sidebar、SidebarItem と関連 embed の Lucide import を Tabler へ置換。 |
| 2026-06-07 | 05 | feedback docs | 6 | 6 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | Alert、AlertDialog、Banner、ProgressWidget、StatusScreen、Timeline の Lucide import とコード例 import を Tabler へ置換。 |
| 2026-06-07 | 06 | overlay docs | 5 | 5 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | Overlay audit shared doc、ContextMenu、DropdownMenu、FloatingPanel、HoverCard のコード例 import を Tabler へ置換。 |
| 2026-06-07 | 07 | display / misc component docs | 12 | 12 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | Category overview、Button、Card、Charts、Dashboard、Auth、FileTree、MetadataList、Components index、Tokens index、ToolPill、TreeView の Lucide import とコード例 import を Tabler へ置換。 |
| 2026-06-07 | 08 | public patterns | 4 | 4 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | Patterns index/layout、Auth forgot password、DashboardShell の Lucide import を Tabler へ置換。 |
| 2026-06-07 | 09 | hidden / legacy patterns | 4 | 4 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | Chat、Editor、Kanban、Landing の hidden pattern Lucide import を Tabler へ置換。 |
| 2026-06-07 | 10 | demo pages | 16 | 16 | `npm run type-check`, `npm run docs:audit:components`, `git diff --check` | `app/components/demos/**` の Lucide import を Tabler へ置換。これで `app` / `src` の `lucide-react` import は 0。 |

### Batch 01 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/components/doc/ComponentHelpers.tsx` | `Check` | `IconCheck as Check` |
| `app/components/doc/ComponentHelpers.tsx` | `Copy` | `IconCopy as Copy` |
| `app/components/doc/ComponentHelpers.tsx` | `ExternalLink` | `IconExternalLink as ExternalLink` |
| `app/components/doc/ComponentHelpers.tsx` | `Maximize2` | `IconMaximize as Maximize2` |
| `app/components/doc/ComponentHelpers.tsx` | `Monitor` | `IconDeviceDesktop as Monitor` |
| `app/components/doc/ComponentHelpers.tsx` | `Smartphone` | `IconDeviceMobile as Smartphone` |
| `app/components/doc/ComponentHelpers.tsx` | `Tablet` | `IconDeviceTablet as Tablet` |
| `app/components/doc/CopySpecButton.tsx` | `Check` | `IconCheck as Check` |
| `app/components/doc/CopySpecButton.tsx` | `Copy` | `IconCopy as Copy` |
| `app/components/doc/CopySpecButton.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/components/layout/CommandMenu.tsx` | `Search` | `IconSearch as Search` |
| `app/components/layout/Sidebar.tsx` | `PanelLeftOpen` | `IconLayoutSidebarLeftExpand as PanelLeftOpen` |
| `app/components/layout/SiteHeader.tsx` | `Github` | `IconBrandGithub as Github` |
| `app/components/layout/SiteHeader.tsx` | `Menu` | `IconMenu2 as Menu` |
| `app/components/layout/ThemeSwitcher.tsx` | `Check` | `IconCheck as Check` |
| `app/components/layout/ThemeSwitcher.tsx` | `Copy` | `IconCopy as Copy` |
| `app/components/layout/ThemeSwitcher.tsx` | `Palette` | `IconPalette as Palette` |
| `app/components/layout/ThemeSwitcher.tsx` | `RotateCcw` | `IconRotate as RotateCcw` |
| `app/components/layout/ThemeToggle.tsx` | `Moon` | `IconMoon as Moon` |
| `app/components/layout/ThemeToggle.tsx` | `Sun` | `IconSun as Sun` |
| `app/components/tokens/ColorTokenCard.tsx` | `Check` | `IconCheck as Check` |
| `app/components/tokens/ColorTokenCard.tsx` | `Copy` | `IconCopy as Copy` |

### Batch 02 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/page.tsx` | `Github` | `IconBrandGithub as Github` |
| `app/page.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/page.tsx` | `Code` | `IconCode as Code` |
| `app/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/page.tsx` | `Cpu` | `IconCpu as Cpu` |
| `app/page.tsx` | `BookOpen` | `IconBook2 as BookOpen` |
| `app/page.tsx` | `Network` | `IconNetwork as Network` |
| `app/page.tsx` | `Palette` | `IconPalette as Palette` |
| `app/page.tsx` | `Eye` | `IconEye as Eye` |
| `app/page.tsx` | `LayoutGrid` | `IconLayoutGrid as LayoutGrid` |
| `app/page.tsx` | `Boxes` | `IconPackages as Boxes` |
| `app/showcase/page.tsx` | `ArrowUpRight` | `IconArrowUpRight as ArrowUpRight` |
| `app/showcase/page.tsx` | `LayoutGrid` | `IconLayoutGrid as LayoutGrid` |
| `app/error.tsx` | `AlertTriangle` | `IconAlertTriangle as AlertTriangle` |
| `app/docs/introduction/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/introduction/page.tsx` | `Check` | `IconCheck as Check` |
| `app/docs/introduction/page.tsx` | `Copy` | `IconCopy as Copy` |
| `app/docs/introduction/page.tsx` | `ExternalLink` | `IconExternalLink as ExternalLink` |
| `app/docs/introduction/page.tsx` | `Package` | `IconPackage as Package` |
| `app/docs/introduction/page.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/docs/colors/page.tsx` | `Check` | `IconCheck as Check` |
| `app/docs/colors/page.tsx` | `Copy` | `IconCopy as Copy` |
| `app/docs/comparison/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/comparison/page.tsx` | `Check` | `IconCheck as Check` |
| `app/docs/comparison/page.tsx` | `Minus` | `IconMinus as Minus` |
| `app/docs/stability/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/tokens/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/tokens/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/tokens/page.tsx` | `Maximize2` | `IconMaximize as Maximize2` |
| `app/docs/tokens/page.tsx` | `Palette` | `IconPalette as Palette` |
| `app/docs/tokens/page.tsx` | `Ruler` | `IconRuler as Ruler` |
| `app/docs/tokens/page.tsx` | `Square` | `IconSquare as Square` |
| `app/docs/tokens/page.tsx` | `Type` | `IconTypography as Type` |
| `app/docs/tokens/page.tsx` | `Wind` | `IconWind as Wind` |

### Batch 03 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/docs/ai-handoff/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/ai-handoff/page.tsx` | `Clipboard` | `IconClipboard as Clipboard` |
| `app/docs/ai-handoff/page.tsx` | `Code` | `IconCode as Code` |
| `app/docs/ai-handoff/page.tsx` | `Cpu` | `IconCpu as Cpu` |
| `app/docs/ai-handoff/page.tsx` | `Download` | `IconDownload as Download` |
| `app/docs/ai-handoff/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/ai-handoff/page.tsx` | `Network` | `IconNetwork as Network` |
| `app/docs/ai-handoff/page.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/docs/ai-handoff/page.tsx` | `Workflow` | `IconRoute as Workflow` |
| `app/docs/ai-handoff/mcp/page.tsx` | `ArrowLeft` | `IconArrowLeft as ArrowLeft` |
| `app/docs/ai-handoff/mcp/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/ai-handoff/mcp/page.tsx` | `Clock` | `IconClock as Clock` |
| `app/docs/ai-handoff/mcp/page.tsx` | `Network` | `IconNetwork as Network` |
| `app/docs/ai-handoff/mcp/page.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/docs/ai-handoff/mcp/page.tsx` | `Wrench` | `IconTool as Wrench` |
| `app/docs/ai-handoff/figma/page.tsx` | `ArrowLeft` | `IconArrowLeft as ArrowLeft` |
| `app/docs/ai-handoff/figma/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/ai-handoff/figma/page.tsx` | `Palette` | `IconPalette as Palette` |
| `app/docs/ai-handoff/figma/page.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/docs/ai-handoff/figma/page.tsx` | `Wrench` | `IconTool as Wrench` |
| `app/docs/ai-handoff/cookbook/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/ai-handoff/cookbook/page.tsx` | `BookOpen` | `IconBook2 as BookOpen` |
| `app/docs/ai-handoff/cookbook/page.tsx` | `ChefHat` | `IconChefHat as ChefHat` |
| `app/docs/ai-handoff/cookbook/[slug]/page.tsx` | `ArrowLeft` | `IconArrowLeft as ArrowLeft` |
| `app/docs/ai-handoff/cookbook/[slug]/page.tsx` | `BookOpen` | `IconBook2 as BookOpen` |
| `app/docs/ai-handoff/cookbook/[slug]/page.tsx` | `Check` | `IconCheck as Check` |
| `app/docs/ai-handoff/cookbook/[slug]/page.tsx` | `Copy` | `IconCopy as Copy` |
| `app/docs/ai-handoff/cookbook/[slug]/page.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/docs/tokens/spec/page.tsx` | `ExternalLink` | `IconExternalLink as ExternalLink` |
| `app/docs/tokens/spec/page.tsx` | `FileText` | `IconFileText as FileText` |

### Batch 04 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/docs/components/app-rail/page.tsx` | `Bell` | `IconBell as Bell` |
| `app/docs/components/app-rail/page.tsx` | `Home` | `IconHome as Home` |
| `app/docs/components/app-rail/page.tsx` | `Search` | `IconSearch as Search` |
| `app/docs/components/app-rail/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/app-rail/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |
| `app/docs/components/breadcrumb/page.tsx` | `Home` | `IconHome as Home` |
| `app/docs/components/breadcrumb/page.tsx` | `Slash` | `IconSlash as Slash` |
| `app/docs/components/command/page.tsx` | `Calculator` | `IconCalculator as Calculator` |
| `app/docs/components/command/page.tsx` | `Calendar` | `IconCalendar as Calendar` |
| `app/docs/components/command/page.tsx` | `CreditCard` | `IconCreditCard as CreditCard` |
| `app/docs/components/command/page.tsx` | `Search` | `IconSearch as Search` |
| `app/docs/components/command/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/command/page.tsx` | `Smile` | `IconMoodSmile as Smile` |
| `app/docs/components/command/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |
| `app/docs/components/command-palette/page.tsx` | `Calculator` | `IconCalculator as Calculator` |
| `app/docs/components/command-palette/page.tsx` | `Calendar` | `IconCalendar as Calendar` |
| `app/docs/components/command-palette/page.tsx` | `CreditCard` | `IconCreditCard as CreditCard` |
| `app/docs/components/command-palette/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/components/command-palette/page.tsx` | `Search` | `IconSearch as Search` |
| `app/docs/components/command-palette/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/command-palette/page.tsx` | `Smile` | `IconMoodSmile as Smile` |
| `app/docs/components/command-palette/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |
| `app/docs/components/footer/page.tsx` | `Github` | `IconBrandGithub as Github` |
| `app/docs/components/footer/page.tsx` | `Linkedin` | `IconBrandLinkedin as Linkedin` |
| `app/docs/components/footer/page.tsx` | `Youtube` | `IconBrandYoutube as Youtube` |
| `app/docs/components/header/page.tsx` | `Languages` | `IconLanguage as Languages` |
| `app/docs/components/header/page.tsx` | `Menu` | `IconMenu2 as Menu` |
| `app/docs/components/header/page.tsx` | `Moon` | `IconMoon as Moon` |
| `app/docs/components/header/page.tsx` | `Search` | `IconSearch as Search` |
| `app/docs/components/header/page.tsx` | `Sun` | `IconSun as Sun` |
| `app/docs/components/header/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |
| `app/docs/components/sidebar/page.tsx` | `BarChart3` | `IconChartBar as BarChart3` |
| `app/docs/components/sidebar/page.tsx` | `FolderKanban` | `IconLayoutKanban as FolderKanban` |
| `app/docs/components/sidebar/page.tsx` | `Home` | `IconHome as Home` |
| `app/docs/components/sidebar/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/sidebar-item/page.tsx` | `ChevronRight` | `IconChevronRight as ChevronRight` |
| `app/docs/components/sidebar-item/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/components/sidebar-item/page.tsx` | `Folder` | `IconFolder as Folder` |
| `app/docs/components/sidebar-item/page.tsx` | `Grid` | `IconGridDots as Grid` |
| `app/docs/components/sidebar-item/page.tsx` | `Plus` | `IconPlus as Plus` |
| `app/docs/components/sidebar-item/page.tsx` | `Star` | `IconStar as Star` |
| `app/docs/components/sidebar-item/page.tsx` | `Trash2` | `IconTrash as Trash2` |
| `app/embed/command/page.tsx` | `Calculator` | `IconCalculator as Calculator` |
| `app/embed/command/page.tsx` | `Calendar` | `IconCalendar as Calendar` |
| `app/embed/command/page.tsx` | `CreditCard` | `IconCreditCard as CreditCard` |
| `app/embed/command/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/embed/command/page.tsx` | `Smile` | `IconMoodSmile as Smile` |
| `app/embed/command/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |
| `app/embed/command-palette/page.tsx` | `Calculator` | `IconCalculator as Calculator` |
| `app/embed/command-palette/page.tsx` | `Calendar` | `IconCalendar as Calendar` |
| `app/embed/command-palette/page.tsx` | `CreditCard` | `IconCreditCard as CreditCard` |
| `app/embed/command-palette/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/embed/command-palette/page.tsx` | `Search` | `IconSearch as Search` |
| `app/embed/command-palette/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/embed/command-palette/page.tsx` | `Smile` | `IconMoodSmile as Smile` |
| `app/embed/command-palette/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |
| `app/embed/footer/page.tsx` | `Github` | `IconBrandGithub as Github` |
| `app/embed/footer/page.tsx` | `Linkedin` | `IconBrandLinkedin as Linkedin` |
| `app/embed/footer/page.tsx` | `Youtube` | `IconBrandYoutube as Youtube` |
| `app/embed/header/page.tsx` | `Languages` | `IconLanguage as Languages` |
| `app/embed/header/page.tsx` | `Menu` | `IconMenu2 as Menu` |
| `app/embed/header/page.tsx` | `Moon` | `IconMoon as Moon` |
| `app/embed/header/page.tsx` | `Search` | `IconSearch as Search` |
| `app/embed/header/page.tsx` | `Sun` | `IconSun as Sun` |
| `app/embed/header/page.tsx` | `UserRound` | `IconUserCircle as UserRound` |

### Batch 05 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/docs/components/alert/page.tsx` | `AlertCircle` | `IconAlertCircle as AlertCircle` |
| `app/docs/components/alert/page.tsx` | `CheckCircle2` | `IconCircleCheck as CheckCircle2` |
| `app/docs/components/alert/page.tsx` | `Info` | `IconInfoCircle as Info` |
| `app/docs/components/alert/page.tsx` | `Terminal` | `IconTerminal2 as Terminal` |
| `app/docs/components/alert/page.tsx` | `TriangleAlert` | `IconAlertTriangle as TriangleAlert` |
| `app/docs/components/alert-dialog/page.tsx` | `Trash2` | `IconTrash as Trash2` |
| `app/docs/components/banner/page.tsx` | `AlertTriangle` | `IconAlertTriangle as AlertTriangle` |
| `app/docs/components/banner/page.tsx` | `CheckCircle` | `IconCircleCheck as CheckCircle` |
| `app/docs/components/banner/page.tsx` | `Info` | `IconInfoCircle as Info` |
| `app/docs/components/banner/page.tsx` | `Megaphone` | `IconSpeakerphone as Megaphone` |
| `app/docs/components/banner/page.tsx` | `ShieldAlert` | `IconShieldExclamation as ShieldAlert` |
| `app/docs/components/progress-widget/page.tsx` | `Activity` | `IconActivity as Activity` |
| `app/docs/components/progress-widget/page.tsx` | `Gauge` | `IconGauge as Gauge` |
| `app/docs/components/progress-widget/page.tsx` | `HardDrive` | `IconDatabase as HardDrive` |
| `app/docs/components/progress-widget/page.tsx` | `Target` | `IconTarget as Target` |
| `app/docs/components/status-screen/page.tsx` | `Clock` | `IconClock as Clock` |
| `app/docs/components/status-screen/page.tsx` | `Lock` | `IconLock as Lock` |
| `app/docs/components/status-screen/page.tsx` | `WifiOff` | `IconWifiOff as WifiOff` |
| `app/docs/components/status-screen/page.tsx` | `Wrench` | `IconTool as Wrench` |
| `app/docs/components/timeline/page.tsx` | `CheckCircle2` | `IconCircleCheck as CheckCircle2` |
| `app/docs/components/timeline/page.tsx` | `Clock3` | `IconClockHour3 as Clock3` |
| `app/docs/components/timeline/page.tsx` | `Rocket` | `IconRocket as Rocket` |

### Batch 06 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/docs/components/_overlayAuditDocPage.tsx` | `Filter` | `IconFilter as Filter` |
| `app/docs/components/_overlayAuditDocPage.tsx` | `HelpCircle` | `IconHelpCircle as HelpCircle` |
| `app/docs/components/_overlayAuditDocPage.tsx` | `Info` | `IconInfoCircle as Info` |
| `app/docs/components/_overlayAuditDocPage.tsx` | `MoreHorizontal` | `IconDots as MoreHorizontal` |
| `app/docs/components/_overlayAuditDocPage.tsx` | `Save` | `IconDeviceFloppy as Save` |
| `app/docs/components/_overlayAuditDocPage.tsx` | `SlidersHorizontal` | `IconAdjustmentsHorizontal as SlidersHorizontal` |
| `app/docs/components/_overlayAuditDocPage.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/docs/components/context-menu/page.tsx` | `Copy` | `IconCopy as Copy` |
| `app/docs/components/context-menu/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/components/context-menu/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/dropdown-menu/page.tsx` | `ChevronDown` | `IconChevronDown as ChevronDown` |
| `app/docs/components/dropdown-menu/page.tsx` | `LogOut` | `IconLogout as LogOut` |
| `app/docs/components/dropdown-menu/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/dropdown-menu/page.tsx` | `Trash2` | `IconTrash as Trash2` |
| `app/docs/components/dropdown-menu/page.tsx` | `User` | `IconUser as User` |
| `app/docs/components/floating-panel/page.tsx` | `Bell` | `IconBell as Bell` |
| `app/docs/components/floating-panel/page.tsx` | `Box` | `IconBox as Box` |
| `app/docs/components/floating-panel/page.tsx` | `Layers` | `IconStack2 as Layers` |
| `app/docs/components/floating-panel/page.tsx` | `MousePointer2` | `IconPointer as MousePointer2` |
| `app/docs/components/floating-panel/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/hover-card/page.tsx` | `Bell` | `IconBell as Bell` |
| `app/docs/components/hover-card/page.tsx` | `CalendarDays` | `IconCalendarEvent as CalendarDays` |
| `app/docs/components/hover-card/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/components/hover-card/page.tsx` | `User` | `IconUser as User` |

### Batch 07 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/docs/components/_category-overview.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/components/_category-overview.tsx` | `BadgeCheck` | `IconCircleCheck as BadgeCheck` |
| `app/docs/components/_category-overview.tsx` | `Bell` | `IconBell as Bell` |
| `app/docs/components/_category-overview.tsx` | `Columns3` | `IconColumns3 as Columns3` |
| `app/docs/components/_category-overview.tsx` | `Compass` | `IconCompass as Compass` |
| `app/docs/components/_category-overview.tsx` | `LayoutPanelTop` | `IconLayoutNavbar as LayoutPanelTop` |
| `app/docs/components/_category-overview.tsx` | `Layers3` | `IconStack2 as Layers3` |
| `app/docs/components/_category-overview.tsx` | `ListChecks` | `IconListCheck as ListChecks` |
| `app/docs/components/_category-overview.tsx` | `TriangleAlert` | `IconAlertTriangle as TriangleAlert` |
| `app/docs/components/auth/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/components/button/page.tsx` | `Save` | `IconDeviceFloppy as Save` |
| `app/docs/components/button/page.tsx` | `Trash2` | `IconTrash as Trash2` |
| `app/docs/components/card/page.tsx` | `Bookmark` | `IconBookmark as Bookmark` |
| `app/docs/components/card/page.tsx` | `MessageCircle` | `IconMessageCircle as MessageCircle` |
| `app/docs/components/card/page.tsx` | `Repeat2` | `IconRepeat as Repeat2` |
| `app/docs/components/charts/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/components/charts/page.tsx` | `ChartNoAxesCombined` | `IconChartDots3 as ChartNoAxesCombined` |
| `app/docs/components/dashboard/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/components/dashboard/page.tsx` | `LayoutDashboard` | `IconLayoutDashboard as LayoutDashboard` |
| `app/docs/components/dashboard/page.tsx` | `Settings` | `IconSettings as Settings` |
| `app/docs/components/dashboard/page.tsx` | `User` | `IconUser as User` |
| `app/docs/components/file-tree/page.tsx` | `MoreHorizontal` | `IconDots as MoreHorizontal` |
| `app/docs/components/metadata-list/page.tsx` | `CalendarDays` | `IconCalendarEvent as CalendarDays` |
| `app/docs/components/metadata-list/page.tsx` | `FileImage` | `IconFileTypeJpg as FileImage` |
| `app/docs/components/metadata-list/page.tsx` | `HardDrive` | `IconDatabase as HardDrive` |
| `app/docs/components/metadata-list/page.tsx` | `Ruler` | `IconRuler as Ruler` |
| `app/docs/components/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/components/tokens/page.tsx` | `ArrowRight` | `IconArrowRight as ArrowRight` |
| `app/docs/components/tool-pill/page.tsx` | `Copy` | `IconCopy as Copy` |
| `app/docs/components/tool-pill/page.tsx` | `Eraser` | `IconEraser as Eraser` |
| `app/docs/components/tool-pill/page.tsx` | `MousePointer2` | `IconPointer as MousePointer2` |
| `app/docs/components/tool-pill/page.tsx` | `Move` | `IconArrowsMove as Move` |
| `app/docs/components/tool-pill/page.tsx` | `PenLine` | `IconPencil as PenLine` |
| `app/docs/components/tool-pill/page.tsx` | `Plus` | `IconPlus as Plus` |
| `app/docs/components/tool-pill/page.tsx` | `Trash2` | `IconTrash as Trash2` |
| `app/docs/components/tree-view/page.tsx` | `FileCode2` | `IconFileCode as FileCode2` |
| `app/docs/components/tree-view/page.tsx` | `FileText` | `IconFileText as FileText` |
| `app/docs/components/tree-view/page.tsx` | `Folder` | `IconFolder as Folder` |
| `app/docs/components/tree-view/page.tsx` | `Image` | `IconPhoto as Image` |
| `app/docs/components/tree-view/page.tsx` | `MoreHorizontal` | `IconDots as MoreHorizontal` |
| `app/docs/components/tree-view/page.tsx` | `Settings` | `IconSettings as Settings` |

### Batch 08 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/patterns/page.tsx` | `ArrowUpRight` | `IconArrowUpRight as ArrowUpRight` |
| `app/patterns/page.tsx` | `Boxes` | `IconPackages as Boxes` |
| `app/patterns/layout.tsx` | `ChevronRight` | `IconChevronRight as ChevronRight` |
| `app/patterns/auth/forgot-password/page.tsx` | `CheckCircle` | `IconCircleCheck as CheckCircle` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Bell` | `IconBell as Bell` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `BriefcaseBusiness` | `IconBriefcase2 as BriefcaseBusiness` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `CheckCircle2` | `IconCircleCheck as CheckCircle2` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `CreditCard` | `IconCreditCard as CreditCard` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Filter` | `IconFilter as Filter` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `LayoutDashboard` | `IconLayoutDashboard as LayoutDashboard` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Menu` | `IconMenu2 as Menu` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `MoreHorizontal` | `IconDots as MoreHorizontal` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Plus` | `IconPlus as Plus` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Settings` | `IconSettings as Settings` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `ShieldCheck` | `IconShieldCheck as ShieldCheck` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `SlidersHorizontal` | `IconAdjustmentsHorizontal as SlidersHorizontal` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Sparkles` | `IconSparkles as Sparkles` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `TrendingUp` | `IconTrendingUp as TrendingUp` |
| `app/patterns/dashboard/_lib/DashboardShell.tsx` | `Users` | `IconUsers as Users` |

### Batch 09 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/patterns/chat/page.tsx` | `Hash` | `IconHash as Hash` |
| `app/patterns/chat/page.tsx` | `Info` | `IconInfoCircle as Info` |
| `app/patterns/chat/page.tsx` | `Paperclip` | `IconPaperclip as Paperclip` |
| `app/patterns/chat/page.tsx` | `Phone` | `IconPhone as Phone` |
| `app/patterns/chat/page.tsx` | `Plus` | `IconPlus as Plus` |
| `app/patterns/chat/page.tsx` | `Send` | `IconSend as Send` |
| `app/patterns/chat/page.tsx` | `Smile` | `IconMoodSmile as Smile` |
| `app/patterns/chat/page.tsx` | `Video` | `IconVideo as Video` |
| `app/patterns/editor/page.tsx` | `Box` | `IconBox as Box` |
| `app/patterns/editor/page.tsx` | `Layers` | `IconStack2 as Layers` |
| `app/patterns/editor/page.tsx` | `MousePointer2` | `IconPointer as MousePointer2` |
| `app/patterns/editor/page.tsx` | `Play` | `IconPlayerPlay as Play` |
| `app/patterns/editor/page.tsx` | `Share2` | `IconShare2 as Share2` |
| `app/patterns/kanban/page.tsx` | `Filter` | `IconFilter as Filter` |
| `app/patterns/kanban/page.tsx` | `MoreHorizontal` | `IconDots as MoreHorizontal` |
| `app/patterns/kanban/page.tsx` | `Plus` | `IconPlus as Plus` |
| `app/patterns/kanban/page.tsx` | `Search` | `IconSearch as Search` |
| `app/patterns/landing/page.tsx` | `Check` | `IconCheck as Check` |
| `app/patterns/landing/page.tsx` | `ArrowRight` | removed unused import |
| `app/patterns/landing/page.tsx` | `Star` | removed unused import |

### Batch 10 Mapping

| File | Lucide | Tabler |
| --- | --- | --- |
| `app/components/demos/BannerDemo.tsx` | `Megaphone` | `IconSpeakerphone as Megaphone` |
| `app/components/demos/BannalyzeTemplateDemo.tsx` | `Check`, `ChevronDown`, `ChevronRight`, `Download`, `History`, `MapPin`, `Plus`, `Share2`, `Target`, `X`, `ZoomIn`, `ZoomOut` | same-meaning Tabler icons |
| `app/components/demos/BannalyzeTemplateDemo.tsx` | `CheckCircle`, `CheckCircle2` | `IconCircleCheck` |
| `app/components/demos/BannalyzeTemplateDemo.tsx` | `Grid` | `IconGridDots` |
| `app/components/demos/BannalyzeTemplateDemo.tsx` | `Lightbulb` | `IconBulb` |
| `app/components/demos/BannalyzeTemplateDemo.tsx` | `Maximize2` | `IconMaximize` |
| `app/components/demos/BannalyzeTemplateDemo.tsx` | `MessageSquare` | `IconMessage` |
| `app/components/demos/EmptyStateDemo.tsx` | `FolderOpen` | `IconFolderOpen as FolderOpen` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Archive`, `Check`, `ChevronRight`, `Copy`, `Folder`, `Lock`, `Palette`, `Plus`, `Search`, `Settings`, `Star`, `Tag`, `Trash2` | same-meaning Tabler icons |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `ArrowUpDown` | `IconArrowsSort` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `FileType` | `IconFileTypeDoc` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Funnel` | `IconFilter` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Globe2` | `IconWorld` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Grid` | `IconGridDots` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `HardDrive` | `IconDatabase` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Info` | `IconInfoCircle` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Layout` | `IconLayoutGrid` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Maximize2` | `IconMaximize` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Menu` | `IconMenu2` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `Shapes` | `IconShape` |
| `app/components/demos/MediaLibraryTemplateDemo.tsx` | `WandSparkles` | `IconWand` |
| `app/components/demos/MoleculesDemo.tsx` | `FileImage` | `IconFileTypeJpg as FileImage` |
| `app/components/demos/MoleculesDemo.tsx` | `Folder` | `IconFolder as Folder` |
| `app/components/demos/NavigationDemos.tsx` | `Calculator`, `CreditCard`, `Settings`, `User` | same-meaning Tabler icons |
| `app/components/demos/NavigationDemos.tsx` | `Calendar` | `IconCalendar` |
| `app/components/demos/NavigationDemos.tsx` | `Smile` | `IconMoodSmile` |
| `app/components/demos/OrganismsDemo.tsx` | `Bold`, `Box`, `Calculator`, `CreditCard`, `Italic`, `Settings`, `Underline` | same-meaning Tabler icons |
| `app/components/demos/OrganismsDemo.tsx` | `Calendar` | `IconCalendar` |
| `app/components/demos/OrganismsDemo.tsx` | `Layers` | `IconStack2` |
| `app/components/demos/OrganismsDemo.tsx` | `MousePointer2` | `IconPointer` |
| `app/components/demos/OrganismsDemo.tsx` | `Terminal` | `IconTerminal2` |
| `app/components/demos/OverlayComponentDemos.tsx` | `Bell`, `Box`, `ChevronDown`, `Copy`, `FileText`, `Settings`, `Trash2`, `User` | same-meaning Tabler icons |
| `app/components/demos/OverlayComponentDemos.tsx` | `CalendarDays` | `IconCalendarEvent` |
| `app/components/demos/OverlayComponentDemos.tsx` | `Layers` | `IconStack2` |
| `app/components/demos/OverlayComponentDemos.tsx` | `LogOut` | `IconLogout` |
| `app/components/demos/OverlayComponentDemos.tsx` | `MousePointer2` | `IconPointer` |
| `app/components/demos/OverlayDemos.tsx` | `CreditCard`, `Settings`, `User` | same-meaning Tabler icons |
| `app/components/demos/OverlayDemos.tsx` | `LogOut` | `IconLogout` |
| `app/components/demos/OverlayDemos.tsx` | `PlusCircle` | `IconCirclePlus` |
| `app/components/demos/OverlayRemainderDemos.tsx` | `CheckCircle2`, `FileImage`, `Filter`, `HelpCircle`, `Info`, `MoreHorizontal`, `Save`, `Settings`, `Share2`, `SlidersHorizontal`, `Sparkles` | Batch 06 と同じ Tabler mapping |
| `app/components/demos/PanelDemos.tsx` | `CalendarDays` | `IconCalendarEvent as CalendarDays` |
| `app/components/demos/SidebarItemDemo.tsx` | `Folder` | `IconFolder as Folder` |
| `app/components/demos/SidebarItemDemo.tsx` | `FileVideo` | `IconVideo as FileVideo` |
| `app/components/demos/SidebarItemDemo.tsx` | `Image` | `IconPhoto as Image` |
| `app/components/demos/StatusScreenDemo.tsx` | `Clock`, `Lock`, `WifiOff` | same-meaning Tabler icons |
| `app/components/demos/StatusScreenDemo.tsx` | `AlertTriangle` | removed unused import |
| `app/components/demos/StatusScreenDemo.tsx` | `Wrench` | `IconTool` |
| `app/components/demos/TemplateDemos.tsx` | `Box`, `LayoutDashboard`, `Phone`, `Plus`, `Send`, `Settings`, `User`, `Video` | same-meaning Tabler icons |
| `app/components/demos/TemplateDemos.tsx` | `Info` | `IconInfoCircle` |
| `app/components/demos/TemplateDemos.tsx` | `Layers` | `IconStack2` |
| `app/components/demos/TemplateDemos.tsx` | `MoreHorizontal` | `IconDots` |
| `app/components/demos/TemplateDemos.tsx` | `MousePointer2` | `IconPointer` |
| `app/components/demos/ToolPillDemo.tsx` | `Copy`, `Plus`, `Trash` | same-meaning Tabler icons |
| `app/components/demos/TreeViewDemo.tsx` | `File`, `Folder` | same-meaning Tabler icons |
