# Changelog

GunjoUI の変更履歴。フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に概ね準拠し、バージョニングは [docs/versioning.md](./docs/versioning.md) のポリシーに従う。

採用先影響度の表記：
- **none** — 既存採用先のコードに変更不要
- **minor** — `git grep` で機械的に置換可能
- **breaking** — 構造変更が必要

---

## [Unreleased]

### Changed

- **安定性の昇格 第一波：54 部品を Experimental → Beta**（採用先影響: **none**・ラベルのみ）。コールドテスト 170 画面での登場頻度（≥12 ラウンド）を「本番採用」の代理指標とし、docs Props 完全カバー（#559 監査済）と合わせて `/docs/stability` の Beta 基準を満たすコアを昇格。Beta = 機能完成・API はフィードバックで調整されうる（パッチでは壊れない）。対象: `Badge` `Button` `Card` `Separator` `Select` `Statistic` `MetadataList` `Alert` `Tabs` `Meter` `Sheet` `EmptyState` `StatGroup` `DataTable` `Container` `Input` `PageHeader` `Textarea` `Timeline` `Tag` `Dialog` `NumberInput` `ActionQueue` `Delta` `ToggleGroup` `ListCard` `AmountBreakdown` `Checkbox` `SignedRecord` `Table` `PersonCell` `Icon` `Label` `RouteStops` `CoSign` `Banner` `ReferenceValue` `SearchInput` `Avatar` `Switch` `Stepper` `Form` `ScheduleGrid` `Progress` `VStack` `ApprovalSteps` `Drawer` `FilterChips` `LineChart` `BottomActionBar` `RadioCard` `DatePicker` `EditableDataTable` `RadioGroup`。SSOT は `design/stability.json`。(#573)

## [0.0.1-alpha.3] — 2026-07-10

alpha.2（173 部品）以降、コールドテスト 170 画面の検証ループで見つかった欠落を埋め続けた成果をまとめた alpha リリース。**部品セットは 216 に到達（+43）**。**API は今後変更される可能性があります**（全部品 Experimental）。

### Added

- **コンポーネント +43 件（173 → 216）**（採用先影響: **none**・追加のみ）。コールドテスト 170 ラウンドで「文脈ゼロの AI が手組みした＝欠落」と報告された部品を、業種横断で追加（運行図 Stringline、系譜 LineageGraph、月カレンダー EventCalendar、座席 SeatMap、経路 OriginDestination / RouteStops / Itinerary ほか）。docs / SSOT / Figma を 3 軸で監査 (#559)。
- **i18n `LocaleProvider`**（採用先影響: **none**・後方互換）。shadcn 由来の組み込み文字列（`No results.` / 検索プレースホルダ / ページャ等）を `<LocaleProvider locale="ja">` 一箇所で切替。en 既定＝プロバイダ未マウント時は従来どおり。precedence: instance prop > provider bundle > 既定。14 部品配線 (#326 / #560–562)。docs: `/docs/i18n`（ライブ en/ja トグル）(#567)。
- **`Button` の `size="touch"` / `size="icon-touch"`**（採用先影響: **none**・追加のみ）。44px タップ標的（WCAG 2.5.5）を意図で選べるサイズ。モバイル / toC 画面向け (#362 / #568)。
- **部品固有のローカライズ上書き prop**（採用先影響: **none**・追加のみ）— `ActionQueue.severityLabels` / `EventCalendar.formatMonthTitle`・`formatDayLabel` / `ScanGate.stepsLabel` / `TicketStub.formatCodeAlt`。既定は日本語のまま (#558)。

### Changed

- **配布形態を「生 TS 直配布」から「コンパイル済み `dist/`（ESM + `.d.ts`）」へ変更**（採用先影響: **none**）。`exports "."` が `./dist/index.js` を指すようになり、採用先は `transpilePackages: ["@gunjo/ui"]` なしで Next.js / Vite からそのまま import できる。各コンポーネントの `"use client"` 境界は `tsc` が directive として保持。`npm run build:lib`（`tsc -p tsconfig.build.json`）で生成し、`prepare` で `npm install` / `pack` / `publish` 時に自動ビルド。既存採用先はコード変更不要（`transpilePackages` は削除してよい）。
- `ScanGate` の手順区切りをテキスト矢印（→）からアイコン（`IconChevronRight`）へ（採用先影響: **none**・視覚のみ、aria-hidden の装飾）(#570)。

### Fixed

- `prepare` が dist を自動ビルドするようになり、`npm install file:../gunjo` などローカル採用でも `dist/` が確実に揃う（採用先影響: **none**）。
- `prepare` の git hooks インストールを堅牢化：書込不可環境でも失敗しない（`npm pack` / `publish` を壊さない）。gunjo リポジトリ本体でのみ動作し、`file:`/`git+` install で採用先の `core.hooksPath` を書き換えない。
- リポジトリに commit されていた古いビルド成果物 `gunjo-ui-0.0.1-alpha.2.tgz` を削除し、`*.tgz` を gitignore。

## [0.0.1-alpha.2] — 2026-06-13

OSS 公開に合わせた alpha リリース。`0.0.1-alpha.0` / `alpha.1`（70 components）以降に追加された全コンポーネント（Tier 1/2/3 + Templates、計 42 件）と、LICENSE / `repository` フィールド / public 化などの OSS 整備を配布。npm 上の README・メタデータも刷新。**API は今後変更される可能性があります。**

### Added

- `LICENSE` ファイル追加（MIT、`package.json` の `license: MIT` 宣言と整合）
- git tag `v0.0.1-alpha.0` バックフィル（commit `dc7256d`、初回 publish 時点を指す）
- `CONTRIBUTING.md` / `SECURITY.md` 追加（OSS 整備）
- **新コンポーネント：Toggle（atom）** — Radix `react-toggle` ベース。`variant` (`default` / `outline`) と `size` (`sm` / `default` / `lg`) をサポート。Tier 1 batch 1 の最初の追加
- **新コンポーネント：AspectRatio（atom）** — Radix `react-aspect-ratio` の薄いラッパー。`ratio` prop で 16/9, 4/3, 1 等の固定比率コンテナ提供
- **新コンポーネント：Code（atom）** — inline `<code>` の cva スタイル。`variant` (`default` / `muted`) と `size` (`sm` / `default` / `lg`) をサポート
- **新コンポーネント：AlertDialog（molecule）** — Radix `react-alert-dialog` ベースの compound pattern。Trigger / Content / Header / Title / Description / Footer / Action / Cancel
- **新コンポーネント：Drawer（molecule）** — vaul ライブラリベースの mobile bottom-sheet。drag-to-dismiss handle 付き
- **新コンポーネント：Combobox（molecule）** — Popover + Command の compound。`options` array で searchable select。`placeholder` / `searchPlaceholder` / `emptyMessage` カスタマイズ可
- **新コンポーネント：DatePicker（molecule）** — Popover + Calendar + date-fns の compound。`value` (Date) と `onValueChange` で controlled 利用、`dateFormat` で表示形式指定
- **新コンポーネント：Sidebar（molecule）** — Context-based provider + compound (`Sidebar` / `SidebarHeader` / `SidebarBody` / `SidebarFooter` / `SidebarSeparator`)。`useSidebar` hook で descendant から collapsed 制御
- **新コンポーネント：DataTable（molecule）** — `@tanstack/react-table` の wrapper。generic で型安全 (`<TData, TValue>`)。sort + filter（指定カラム）+ pagination（pageSize 設定可）統合
- **🎉 Tier 1 essentials 全 9 件完了**（Toggle / AspectRatio / Code / AlertDialog / Drawer / Combobox / DatePicker / Sidebar / DataTable）
- **新コンポーネント：Container（atom）** — `size` prop（sm/md/lg/xl/2xl/full/prose）で max-width + padding wrapper
- **新コンポーネント：HStack（atom）** — flex 横、`gap` / `align` / `justify` / `wrap` props
- **新コンポーネント：VStack（atom）** — flex 縦、`gap` / `align` / `justify` props
- **新コンポーネント：Cluster（atom）** — flex-wrap、tag list 等の自動折返し用
- **新コンポーネント：Grid（atom）** — `cols` 固定 or `minItemWidth` auto-fit のレスポンシブ grid
- **新コンポーネント：Spacer（atom）** — `size` で固定 or flex-grow filler
- **🎉 Layout primitives 全 6 件完了**
- **新コンポーネント：NumberInput（atom）** — chevron stepper 付き numeric input。`value` / `onValueChange` / `min` / `max` / `step` props
- **新コンポーネント：PasswordInput（atom）** — Eye / EyeOff icon の visibility toggle 付き password input
- **新コンポーネント：SearchInput（atom）** — leading Search icon と clearable × button 付き search input
- **新コンポーネント：EmptyState（atom）** — icon / title / description / action slot 付きのプレースホルダ
- **新コンポーネント：Tag（atom）** — `onRemove` 付き Badge、4 variants × 3 sizes
- **新コンポーネント：InputOTP（atom）** — `input-otp` library wrap、`InputOTPGroup` / `InputOTPSlot` / `InputOTPSeparator` の compound
- **新コンポーネント：AvatarGroup（molecule）** — 重ね avatars、`max` prop で +N overflow indicator
- **新コンポーネント：DateRangePicker（molecule）** — Popover + Calendar (mode="range") + date-fns、`numberOfMonths` で複月表示
- **新コンポーネント：TimePicker（molecule）** — hour / minute select、`hour12` (AM/PM) と `minuteStep` (1/5/10/15/30) props
- **新コンポーネント：TagInput（molecule）** — Tag を内部使用、Enter/コンマでコミット、Backspace で末尾削除、`dedupe` / `maxTags` props
- **新コンポーネント：CodeBlock（molecule）** — code 表示用、`filename` / `language` / `copyable` props
- **新コンポーネント：Banner（molecule）** — page 全幅 announcement、5 variants + icon / action / onDismiss
- **新コンポーネント：NavigationMenu（molecule）** — Radix `react-navigation-menu` の compound（List/Item/Trigger/Content/Link/Indicator/Viewport）
- **🎉 Tier 2 high-frequency 全 13 件完了**
- **新コンポーネント：ColorSwatch（atom）** — color preview chip、`color` / `label` / `copyable` / `size` props
- **新コンポーネント：Timeline（molecule）** — `TimelineItem` (variant/marker/connector) + Title/Description/Time の compound
- **新コンポーネント：TreeView（molecule）** — `TreeNode[]` data driven、controlled / uncontrolled expand、selected state
- **新コンポーネント：MarkdownRenderer（molecule）** — react-markdown + remark-gfm、prose styling 内蔵、`disableGfm` で plain markdown
- **新コンポーネント：Mention（molecule）** — textarea + `@` trigger picker、↑↓+Enter で選択、`options` / `trigger` / `maxSuggestions` props
- **新コンポーネント：Statistic（molecule）** — KPI card、`label` / `value` / `change` / `trend` (up/down/flat) で色・矢印切替
- **新コンポーネント：Header（organism）** — Brand / Nav / NavLink / Actions の compound site nav bar
- **新コンポーネント：Footer（organism）** — Columns / Section / Link / Brand / Copyright compound、responsive grid
- **新コンポーネント：OnboardingFlow（organism）** — step indicator + content + Back/Continue、controlled/uncontrolled、`onComplete` callback
- **🎉 Tier 3 specialty 全 9 件完了**
- **新コンポーネント：NotFoundTemplate（template）** — 404 page、`code` / `title` / `description` / `action` props
- **新コンポーネント：ErrorTemplate（template）** — 500 page、`details` (stack trace) prop 付き
- **新コンポーネント：PricingTemplate（template）** — 3-tier 価格表、`PricingPlan[]`、`featured` で highlight
- **新コンポーネント：BlogTemplate（template）** — `category` / `title` / `meta` / `hero` の prose article layout
- **新コンポーネント：DocsTemplate（template）** — sidebar / main / toc の三分割 layout
- **新コンポーネント：OnboardingTemplate（template）** — hero panel + content の二分割、OnboardingFlow と組合せ可
- **🎉🎉🎉 Templates 全 6 件完了 — 計画 42/42 components 完成**
- `docs/component-roadmap.md` 追加（42 components 追加計画と引き継ぎログの SSOT）

### Planned（次回以降）

- 実採用プロジェクトでのドライラン（`npm install @gunjo/ui` で `transpilePackages` 込みの実動作確認）
- CONTRIBUTING.md / SECURITY.md の整備
- CI で `npm publish --dry-run` を流して配布物の差分を見える化
- GitHub リポジトリの public 化＋ `repository` フィールド追加（OSS 公開準備が整い次第）

---

## [0.0.1-alpha.1] — 2026-05-04

軽微な housekeeping リリース。**コードの API 変更なし**、配布物のサイズ・依存・コンポーネント構成は `0.0.1-alpha.0` と完全同一。

### Changed

- `package.json` の maintainer メアドが `register@4px.jp`（メール転送設定不備のあった alias）→ `dev@4px.jp` に切り替わったため、npm registry の maintainer 表記を更新
  - 採用先影響度：**none**

---

## [0.0.1-alpha.0] — 2026-05-04

**初回 npm publish。** `@gunjo/ui` の名前確保が主目的の alpha 公開で、API は今後の alpha / beta 期間中に変更される可能性があります。中身は L3 整備完了時点のスナップショット（70 components）。

### Added

- npm レジストリへの初回 publish（`@gunjo/ui`、access: public）
- `@gunjo` Org（admin: `uixhero`）配下の最初のパッケージとして登録

### Changed

- パッケージ名：`@gunjo`（bare scope、npm 規則違反で publish 不能）→ **`@gunjo/ui`**（npm の `@scope/name` 規則準拠）
- export サブパスも追従：
  - `@gunjo/styles` → `@gunjo/ui/styles`
  - `@gunjo/tailwind-preset` → `@gunjo/ui/tailwind-preset`
  - `@gunjo/tailwind-theme-extend` → `@gunjo/ui/tailwind-theme-extend`
- 採用先側の参照箇所（`transpilePackages` / `tailwind.config` の `content` / `next.config` / globals.css の `@import` / `@source`）も `@gunjo/ui` へ追従要
- `package.json`：`private: true` → `false`、`publishConfig.access: "restricted"` → `"public"`
- `version`：内部マイルストーン `1.0.0` を npm 公開バージョンとしては破棄、初回公開を `0.0.1-alpha.0` から開始（npm 上の `1.0.0` は将来の stable リリースに予約）

### Removed

- React 18 peer サポート（peer は `^19.0.0` のみ。内部実装で React 19 専用 API を採用したため）

### Documentation

- adoption / migration / dependencies / versioning / component-addition / adoption-strategy 整備（PR #2）
- このファイル（CHANGELOG.md、PR #2 で bootstrap、PR #3 で本エントリ追加）

### 採用先影響度

- **breaking**：`@gunjo` を import / `tailwind.config` の content / `next.config` の `transpilePackages` 等で参照していた場合は全て `@gunjo/ui` に置換必須
  - 移行手順：`git grep -l '@gunjo' | xargs sed -i '' 's|@gunjo|@gunjo/ui|g'` のような一括置換 + 確認
  - ただし alpha 段階のため、現時点の採用先は本リポジトリ内 docs サイトのみで影響範囲は限定

---

## Pre-publish history（内部 `1.0.0` 期間、2026-04 以前〜2026-05-03）

npm 未公開期間の内部マイルストーン。CHANGELOG エントリではなく履歴メモ：

- L3 整備：adoption guide 一式追加（PR #2 / 2026-05-03）
- React peer 範囲を `^18 || ^19` → `^19` のみに縮小（実装内で React 19 専用 API 使用のため、本来 MAJOR 事案だが未公開期間中の調整として CHANGELOG エントリ化せず）
- コンポーネント 67 → 70 追加：`Skeleton`, `Stepper`, `Form`（コミット `be127e9` / 2026-05）
- L3 配布準備：`package.json` の `description` / `keywords` / `publishConfig` / 拡張 `files` / 追加 `exports` 整備（PR `1f9b760`）
- SSOT 三軸（pen + source + docs）配備、視覚監査 70/70（コミット `8e3246e` 他）
