# design/

gunjo のデザイン管理ディレクトリ。Pencil の `.pen` ファイルを SSOT（Single Source of Truth）として運用します。

## 正式仕様ドキュメント

- UI デザイン仕様の正式版はリポジトリルートの [DESIGN.md](../DESIGN.md) を参照。
- 本ドキュメントは SSOT 運用（同期・検証・CI）手順の運用ガイドとして扱う。
- 今回対応の概要と標準運用手順は [SSOT_RUNBOOK.md](../SSOT_RUNBOOK.md) を参照。

## 基本方針

- **`.pen` がデザインの正**：唯一の情報源として扱う
- **同期はスクリプトで自動化**：`design:sync` でトークン・メタデータ・仕様スナップショットを更新
- **Git ライクな運用**：デザインはリポジトリでバージョン管理し、反映はスクリプトで一貫させる
- **カテゴリ `.pen` は必須**：`atoms/molecules/organisms/templates` は欠損時に同期・検証を失敗させる

## ファイル構成

ドキュメントサイトのサイドバーカテゴリに合わせて、1 カテゴリ = 1 `.pen` で管理します。

```
design/
├── README.md       # 本ドキュメント
├── tokens.pen      # デザイントークン（変数）※ トークン → コンポーネント量産の起点
├── atoms.pen       # Atoms コンポーネント（Button, Input, Badge 等）
├── atoms-metadata.json
├── component-specs/
│   ├── atoms-core.json  # atoms.pen 由来の Atoms 仕様スナップショット
│   ├── molecules-core.json # molecules.pen 由来の Molecules 仕様スナップショット（Card/Accordion/Tabs/List/Breadcrumb/DropdownMenu/Popover/Command/Calendar/Table/Toast/Modal/Carousel/Pagination/NotificationCenter/Dialog/Sheet/Tooltip/HoverCard/ContextMenu/Menubar/ScrollArea/Resizable/StatusBar/SidebarItem/AIChatInput/AIChatMessage/FilterButton/SortButton/ProgressWidget）
│   ├── organisms-core.json # organisms.pen 由来の Organisms 仕様スナップショット（AppRail/CommandPalette/RightRail/FloatingPanel/InspectorPanel/SpatialCanvas/ShareModal/FileUploader/ToastProvider）
│   └── templates-core.json # templates.pen 由来の Templates 仕様スナップショット（DashboardTemplate/EditorTemplate/LandingTemplate/AuthTemplate/KanbanTemplate/ChatTemplate/SettingsTemplate/BannalyzeTemplate/MediaLibraryTemplate）
├── molecules.pen   # Molecules コンポーネント（Card, Accordion, Tabs, List, Breadcrumb, DropdownMenu, Popover, Command, Calendar, Table, Toast, Modal, Carousel, Pagination, NotificationCenter, Dialog, Sheet, Tooltip, HoverCard, ContextMenu, Menubar, ScrollArea, Resizable, StatusBar, SidebarItem, AIChatInput, AIChatMessage, FilterButton, SortButton, ProgressWidget）
├── molecules-metadata.json
├── organisms.pen   # Organisms コンポーネント（AppRail, CommandPalette, RightRail, FloatingPanel, InspectorPanel, SpatialCanvas, ShareModal, FileUploader, ToastProvider 等）
├── organisms-metadata.json
├── templates.pen   # Templates コンポーネント（DashboardTemplate, EditorTemplate, LandingTemplate, AuthTemplate, KanbanTemplate, ChatTemplate, SettingsTemplate, BannalyzeTemplate, MediaLibraryTemplate 等）
├── templates-metadata.json
├── policy/
│   └── coverage-exclusions.md # coverage 検証の除外ルール運用ポリシー
└── docs/           # ドキュメント内容（カテゴリ単位、将来）
    ├── introduction.pen
    ├── tokens.pen
    ├── atoms.pen
    └── ...
```

## Pencil の仕様

### ファイルの再読み込み

`.pen` を外部で編集した場合、**開き直すかリロードが必要**です。Pencil が自動で変更を検知する仕組みは現状ないため、編集後に `design/tokens.pen` を再度開いてください。

### ページについて

Pencil には **Figma のようなページタブ** はありません。

- **無限キャンバス**：トップレベルフレームがキャンバス上に並ぶ
- **切り替え**：カテゴリごとに別 `.pen` ファイルに分け、ファイルを開き替えて切り替える
- **ナビゲーション**：レイヤーパネル、パン・ズームで移動

## ワークフロー

### デザイン更新 → コード反映

```
1. .pen を編集（Pencil でデザイン変更）
2. npm run design:sync を実行
3. src/globals.css / design/*-metadata.json / design/component-specs/* が更新される
4. 変更をコミット・プッシュ
5. npm publish（新バージョン）
```

### 利用側での最新取得

```
npm update @gunjo/ui
# または
npm install @gunjo/ui@latest
```

パッケージを更新すれば、常に最新のコンポーネントを利用できます。

## design:sync について

`design:sync` スクリプトは以下を行う想定です：

1. **デザイントークン**: `tokens.pen` の変数 → `src/globals.css` の CSS 変数
2. **メタデータ同期**: `atoms.pen` / `molecules.pen` のタイトル・説明 → `design/*-metadata.json`（逆方向同期も可）
3. **コンポーネント仕様抽出**:
   - `atoms.pen` の ToolPill/Button/Input/Badge/Label/Checkbox/Separator/Switch/Textarea/Alert/Avatar/Kbd/Img/Progress/Spinner/RadioGroup/Slider/Select/ToggleGroup 情報 → `design/component-specs/atoms-core.json`
   - `molecules.pen` の Card/Accordion/Tabs/List/Breadcrumb/DropdownMenu/Popover/Command/Calendar/Table/Toast/Modal/Carousel/Pagination/NotificationCenter/Dialog/Sheet/Tooltip/HoverCard/ContextMenu/Menubar/ScrollArea/Resizable/StatusBar/SidebarItem/AIChatInput/AIChatMessage/FilterButton/SortButton/ProgressWidget 情報 → `design/component-specs/molecules-core.json`
   - `organisms.pen` の AppRail/CommandPalette/RightRail/FloatingPanel/InspectorPanel/SpatialCanvas/ShareModal/FileUploader/ToastProvider 情報 → `design/component-specs/organisms-core.json`
   - `templates.pen` の DashboardTemplate/EditorTemplate/LandingTemplate/AuthTemplate/KanbanTemplate/ChatTemplate/SettingsTemplate/BannalyzeTemplate/MediaLibraryTemplate 情報 → `design/component-specs/templates-core.json`
4. **ドキュメント連携**（将来）: `docs/*.pen` → `app/docs/` のページ内容

### 実行コマンド

```bash
# すべて実行（tokens + metadata + component-specs）
npm run design:sync

# 個別実行
npm run design:sync:tokens
npm run design:sync:metadata
npm run design:sync:components
npm run design:sync:docs-navigation
npm run design:sync:docs-pages
npm run design:sync:docs-pages:refresh
npm run design:sync:stubs
npm run design:sync:stubs:refresh
npm run design:sync:stubs:production
npm run design:sync:stubs:production:refresh
# カテゴリ限定（例）
npm run design:sync:docs-pages -- --category=atoms
npm run design:sync:docs-pages:refresh -- --categories=atoms,molecules
npm run design:sync:stubs -- --category=atoms
npm run design:sync:stubs:production -- --category=molecules
npm run design:sync:stubs:production:refresh -- --categories=atoms,molecules

# metadata -> .pen 逆同期
npm run design:sync:from-metadata

# 生成物ドリフト検証（CI向け）
npm run design:verify

# Atoms + Molecules + Organisms + Templates（DashboardTemplate/EditorTemplate/LandingTemplate/AuthTemplate/KanbanTemplate/ChatTemplate/SettingsTemplate/BannalyzeTemplate/MediaLibraryTemplate）の実装ドリフト検証のみ（slot node coverage / component style drift strict を含む）
npm run design:verify:components

# atoms/molecules/organisms/templates-metadata と component-specs のカバレッジ検証のみ
npm run design:verify:coverage

# sync-metadata の map ↔ metadata ↔ .pen ノード整合検証のみ
npm run design:verify:metadata-map

# docs page ↔ metadata 参照整合検証のみ
npm run design:verify:docs-metadata

# docs コンテンツ SSOT 検証のみ（EN の重複定義や components 一覧の手動説明マップを検知）
npm run design:verify:docs-content-ssot

# docs ナビゲーション整合検証のみ（navigation.ts ↔ metadata/docs page）
npm run design:verify:docs-navigation

# docs page の component-spec 直接 import 検証（docs-spec helper 経由を強制）
npm run design:verify:docs-spec-imports

# ナビゲーション翻訳キー整合検証のみ（navigation.ts title ↔ translations.nav）
npm run design:verify:nav-translations

# component-specs nodes スナップショットの欠損検証のみ（null/invalid id を検知）
npm run design:verify:node-snapshots

# component-specs variant children slot ↔ nodes スナップショット整合検証のみ
npm run design:verify:slot-nodes

# atoms-core variant keys ↔ source variant map 整合検証のみ
npm run design:verify:atom-variant-keys

# atoms-core variant keys ↔ generated variant map 整合検証のみ
npm run design:verify:atom-generated-variant-keys

# atoms-core multi-variant component ↔ generated variant key 型 利用検証のみ
npm run design:verify:atom-generated-variant-key-usage

# molecules-core variant keys ↔ generated variant map 整合検証のみ
npm run design:verify:molecule-variant-keys

# molecules-core multi-variant component ↔ generated variant key type 利用検証のみ
npm run design:verify:molecule-generated-variant-key-usage

# atoms/molecules-core default variant key ↔ generated default key 整合検証のみ
npm run design:verify:default-variant-keys

# atoms/molecules multi-variant component ↔ generated default variant key 利用検証のみ
npm run design:verify:default-variant-key-usage

# generated component manifest ↔ style hints 整合検証のみ
npm run design:verify:component-style-hints

# generated style hints ↔ 実装クラスの構造ドリフトレポート（警告）
npm run design:verify:component-style-drift-report
# カテゴリ限定レポート（例）
npm run design:verify:component-style-drift-report -- --category=atoms

# generated style hints ↔ 実装クラスの構造ドリフト検証（厳格 / fail）
npm run design:verify:component-style-drift
# カテゴリ限定 strict（例）
npm run design:verify:component-style-drift -- --categories=atoms,molecules

# generated style hints ↔ 実装クラスの構造ドリフト検証（段階適用 strict）
npm run design:verify:component-style-drift:scoped

# component 実装のハードコード色クラス検証のみ（atoms/molecules/organisms/templates）
npm run design:verify:hardcoded-color-classes

# tailwind-theme-extend.cjs の color マップが token 参照から外れていないか検証
npm run design:verify:tailwind-color-tokens

# tailwind-theme-extend.cjs の radius/shadow/motion(animation含む) マップが token 参照から外れていないか検証
npm run design:verify:tailwind-foundation-tokens

# tailwind.config.ts / tailwind-preset.js が共通 theme.extend を参照しているか検証
npm run design:verify:tailwind-theme-ssot

# tailwind-preset.js の plugin 構成が tailwind.config.ts / package.json と整合しているか検証
npm run design:verify:tailwind-preset-plugins

# tailwind-theme-extend.cjs 参照 token が src/globals.css (:root/.dark) に定義されているか検証
npm run design:verify:css-vars

# app/globals.css が src/globals.css を参照する SSOT 検証のみ
npm run design:verify:app-globals

# hardcoded color class 例外ポリシー（overlay scrim など）
cat design/policy/hardcoded-color-class-exceptions.json

# component style drift 除外ポリシー
cat design/policy/component-style-drift-exclusions.md

# component style drift strict ターゲットポリシー
cat design/policy/component-style-drift-strict-targets.md

# 生成マーカー付きスタブ残存検証のみ
npm run design:verify:generated-stubs
# 生成スタブ残存のレポート確認（fail させずに一覧表示）
npm run design:verify:generated-stubs:report
# カテゴリ限定レポート（例）
npm run design:verify:generated-stubs:report -- --category=atoms

# 生成マーカー付き docs page 残存検証のみ
npm run design:verify:generated-docs-pages
# 生成 docs page 残存のレポート確認（fail させずに一覧表示）
npm run design:verify:generated-docs-pages:report
# カテゴリ限定レポート（例）
npm run design:verify:generated-docs-pages:report -- --category=atoms

# 生成物残存（stubs + docs pages）をまとめてレポート確認
npm run design:verify:generated-artifacts:report
# カテゴリ限定（例）
npm run design:verify:generated-artifacts:report -- --categories=atoms,molecules

# SSOT進捗（stubs + docs pages + component style drift）をまとめて確認
npm run design:verify:ssot-progress-report
# カテゴリ限定（例）
npm run design:verify:ssot-progress-report -- --category=atoms
# SSOT進捗をJSONで取得（CI/ダッシュボード連携向け）
npm run design:verify:ssot-progress-report:json
# JSON + カテゴリ限定（例）
npm run design:verify:ssot-progress-report:json -- --categories=atoms,molecules
# JSON + 任意ディレクトリroot（例: base commit を worktree 展開したパス）
npm run design:verify:ssot-progress-report:json -- --root /tmp/ssot-base
# JSON から Markdown サマリを生成（例）
npm run design:verify:ssot-progress-summary -- --input /tmp/ssot-progress-report.json
# 2つの SSOT進捗 JSON を比較（例）
npm run design:verify:ssot-progress-diff -- --base /tmp/ssot-main.json --head /tmp/ssot-head.json
# 変更がある指標/カテゴリだけを表示
npm run design:verify:ssot-progress-diff -- --base /tmp/ssot-main.json --head /tmp/ssot-head.json --changed-only
# diff を JSON で出力
npm run design:verify:ssot-progress-diff -- --base /tmp/ssot-main.json --head /tmp/ssot-head.json --json
# diff(JSON) に対して悪化のみ fail するゲートを適用
npm run design:verify:ssot-progress-regressions -- --input /tmp/ssot-progress-diff.json
# カテゴリ別しきい値ポリシーを適用（例）
npm run design:verify:ssot-progress-regressions -- --input /tmp/ssot-progress-diff.json --category-thresholds design/policy/ssot-progress-regression-thresholds.json
# 回帰ゲートの判定結果を JSON 保存（例）
npm run design:verify:ssot-progress-regressions -- --input /tmp/ssot-progress-diff.json --category-thresholds design/policy/ssot-progress-regression-thresholds.json --report-json /tmp/ssot-progress-regressions.json
# 回帰ゲート判定JSONを Markdown サマリ化（例）
npm run design:verify:ssot-progress-regression-summary -- --input /tmp/ssot-progress-regressions.json --outcome success --policy design/policy/ssot-progress-regression-thresholds.json
# diff と回帰ゲート結果から PR共有用の短縮コメントを生成（例）
npm run design:verify:ssot-progress-pr-comment -- --diff /tmp/ssot-progress-diff.json --regression-report /tmp/ssot-progress-regressions.json --regression-outcome success
# 詳細コメントを生成（例）
npm run design:verify:ssot-progress-pr-comment -- --mode detailed --diff /tmp/ssot-progress-diff.json --regression-report /tmp/ssot-progress-regressions.json --regression-outcome success
# SSOT PRコメントのラベル / repo variable 設定が README と同期しているか検証
npm run design:verify:ssot-pr-comment-docs
# SSOT進捗JSONにしきい値ゲートを適用（デフォルトは未解消0 / completion rate 100%）
npm run design:verify:ssot-progress-thresholds -- --input /tmp/ssot-progress-report.json

# Templates の実装ドリフト検証のみ
npm run design:verify:templates

# docs vs pen の視覚差分監査（docs スクショ取得）
npm run design:audit:docs-capture
# カテゴリ / 1コンポーネントだけ撮影（例）
npm run design:audit:docs-capture -- --category=atoms --only=atoms/button

# 視覚差分チェックリストと比較ページを生成
npm run design:audit:checklist

# docs撮影 + チェックリスト生成をまとめて実行
npm run design:audit:refresh

# 出力先（比較ページ）
ls .design-audit/compare/atoms

# pre-commit hook を有効化（初回のみ）
npm run hooks:install
# npm install 後は prepare で自動実行される
```

### 推奨順序

1. **トークン** → `tokens.pen` で変数を定義
2. **コンポーネント量産** → トークンを参照して各カテゴリの `.pen` から生成

### tokens.pen の構成

docs（http://localhost:13030/docs/）と同じ構成・見た目で表示。**Pencil と docs はイコール**を維持します。

| セクション | 内容 |
|------------|------|
| **Colors** | Brand（Primary, Secondary, Accent）、Neutral（Background, Card, Popover, Muted）、Semantic（Info, Success, Warning, Error） |
| **Typography** | H1〜H4、本文サンプル |
| **Spacing** | Token / Value / Pixels / Visual のテーブル（0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32） |
| **Shadows** | sm, base, md, lg, xl, 2xl, inner, none の影付きカード |
| **Radius** | none, sm, base, md, lg, xl, 2xl, 3xl, full の角丸サンプル |
| **Animation** | Duration（75, 100, 150, 200, 300, 500, 700, 1000ms）、Easing（linear, in, out, in-out）のトークン一覧 |

### variables と design:sync

`tokens.pen` の `variables` に定義した値が `npm run design:sync` で `src/globals.css` に反映されます。

| 型 | 対象 | 出力例 |
|----|------|--------|
| color | background, foreground, primary 等 | HSL 形式（`hsl(var(--primary))`） |
| number | radius, duration-* | rem（radius）または ms（duration-*） |
| string | shadow-*, ease-* | そのまま CSS 値 |

### 実装状況

- **tokens.pen → globals.css**: ✅ 実装済み（`npm run design:sync`、Colors, Radius, Shadows, Animation）
- **atoms.pen / molecules.pen ↔ metadata.json**: ✅ 実装済み（`npm run design:sync:metadata` で双方向同期）
  - `npm run design:sync:metadata`: `.pen` のタイトル・説明 → metadata
  - `npm run design:sync:metadata` 実行時に `app/lib/navigation.ts` も自動同期
  - `npm run design:sync:from-metadata`: `*-metadata.json` → `*.pen`（Pencil のテキストノードを更新）
- **atoms.pen → component-specs/atoms-core.json**: ✅ 実装済み（`npm run design:sync:components`）
  - 対象: ToolPill / Button / Input / Badge / Label / Checkbox / Separator / Switch / Textarea / Alert / Avatar / Kbd / Img / Progress / Spinner / RadioGroup / Slider / Select / ToggleGroup
- **atoms-core → variant key生成ファイル**: ✅ 実装済み（`npm run design:sync:components` で `src/components/atoms/generated/variant-keys.ts` を更新）
- **atoms-core → default variant key生成ファイル**: ✅ 実装済み（`npm run design:sync:components` で `src/components/atoms/generated/default-variant-keys.ts` を更新）
- **molecules.pen → component-specs/molecules-core.json**: ✅ 実装済み（`npm run design:sync:components`）
  - 対象: Card / Accordion / Tabs / List / Breadcrumb / DropdownMenu / Popover / Command / Calendar / Table / Toast / Modal / Carousel / Pagination / NotificationCenter / Dialog / Sheet / Tooltip / HoverCard / ContextMenu / Menubar / ScrollArea / Resizable / StatusBar / SidebarItem / AIChatInput / AIChatMessage / FilterButton / SortButton / ProgressWidget
- **molecules-core → variant key生成ファイル（multi-variant components）**: ✅ 実装済み（`npm run design:sync:components` で `src/components/molecules/generated/variant-keys.ts` を更新）
- **molecules-core → default variant key生成ファイル（multi-variant components）**: ✅ 実装済み（`npm run design:sync:components` で `src/components/molecules/generated/default-variant-keys.ts` を更新）
- **organisms.pen → component-specs/organisms-core.json**: ✅ 実装済み（`npm run design:sync:components`）
  - 対象: AppRail / CommandPalette / RightRail / FloatingPanel / InspectorPanel / SpatialCanvas / ShareModal / FileUploader / ToastProvider
- **templates.pen → component-specs/templates-core.json**: ✅ 実装済み（`npm run design:sync:components`）
  - 対象: DashboardTemplate / EditorTemplate / LandingTemplate / AuthTemplate / KanbanTemplate / ChatTemplate / SettingsTemplate / BannalyzeTemplate / MediaLibraryTemplate
  - `buildStructuredSpec` は variant `children` id の node snapshot 欠損を自動補完（nodeIds map 漏れ時のフォールバック）
- **component-specs → component manifest生成**: ✅ 実装済み（`npm run design:sync:components` で `src/components/generated/component-manifest.ts` を更新）
- **component-specs → component style hints生成**: ✅ 実装済み（`npm run design:sync:components` で `src/components/generated/component-style-hints.ts` を更新）
- **component-specs → public exports生成**: ✅ 実装済み（`npm run design:sync:components` で `src/index.ts` を更新）
- **metadata → docs navigation生成**: ✅ 実装済み（`npm run design:sync:docs-navigation` で `app/lib/navigation.ts` を更新）
- **metadata → docs component page スキャフォールド生成**: ✅ 実装済み（`npm run design:sync:docs-pages` で不足 `app/docs/components/**/page.tsx` を自動生成）
  - 単体/複合コンポーネントページともに実コンポーネント import と usage/preview の初期コードを自動生成
  - variant 既定値は spec の先頭ではなく `"default"` キー優先で解決
- **docs vs pen 視覚差分監査台帳**: ✅ 実装済み
  - `npm run design:audit:docs-capture` で `/docs/components/**` の preview/page スクリーンショットを `.design-audit/docs/**` に出力
  - `npm run design:audit:checklist` で `COMPONENT_VISUAL_AUDIT.md` と `.design-audit/compare/**`（1コンポーネント1ファイルの比較ページ）を生成
  - pen 側スクショは `.design-audit/pen/<category>/<componentKey>.png` に保存し、再生成で台帳に自動反映
  - `--category` / `--categories` オプションでカテゴリ限定実行が可能（例: `--category=atoms`）
  - `npm run design:sync:docs-pages:refresh` で「生成マーカー付き docs page」または未解消プレースホルダ文言を含む docs page を安全に再同期可能
- **coverage検証**: ✅ 実装済み（`npm run design:verify:coverage` で `metadata` / `component-specs` / `src/components` の 3 点整合を検知）
- **metadata map検証**: ✅ 実装済み（`npm run design:verify:metadata-map` で `sync-metadata map` / `*-metadata.json` / `*.pen` ノード整合を検知）
- **docs metadata検証**: ✅ 実装済み（`npm run design:verify:docs-metadata` で docs `ComponentLayout` の `title/description` が `*-metadata.json` 参照になっているか検知）
- **docs content SSOT検証**: ✅ 実装済み（`npm run design:verify:docs-content-ssot` で `en.ts` の重複コンポーネント文言定義や `components/page.tsx` の手動説明マップを検知）
- **docs navigation検証**: ✅ 実装済み（`npm run design:verify:docs-navigation` で `app/lib/navigation.ts` が metadata と docs page 実体に整合しているか検知）
- **docs spec import検証**: ✅ 実装済み（`npm run design:verify:docs-spec-imports` で docs page の `@design/component-specs/*` 直接 import を検知）
- **ナビ翻訳キー検証**: ✅ 実装済み（`npm run design:verify:nav-translations` で `navigation.ts` の title が `translations.ja.nav` に存在するか検知。EN は key fallback）
- **node snapshot coverage検証**: ✅ 実装済み（`npm run design:verify:node-snapshots` で `component-specs` の `nodes.*` が null/invalid id でないか検知）
- **slot node coverage検証**: ✅ 実装済み（`npm run design:verify:slot-nodes` で `component-specs` の variant `children` slot id が `nodes` スナップショットに存在するか検知）
- **atom variant key検証**: ✅ 実装済み（`npm run design:verify:atom-variant-keys` で `atoms-core` と `ButtonVariants.ts` / `ToolPill.tsx` の variant key 整合を検知）
- **atom generated variant key検証**: ✅ 実装済み（`npm run design:verify:atom-generated-variant-keys` で `atoms-core` と `src/components/atoms/generated/variant-keys.ts` の variant key 整合を検知）
- **atom generated variant key 利用検証**: ✅ 実装済み（`npm run design:verify:atom-generated-variant-key-usage` で multi-variant な Atom 実装が generated `*VariantKey` 型を利用しているか検知）
- **molecule variant key検証**: ✅ 実装済み（`npm run design:verify:molecule-variant-keys` で `molecules-core` と `src/components/molecules/generated/variant-keys.ts` の variant key 整合を検知）
- **molecule generated variant key 利用検証**: ✅ 実装済み（`npm run design:verify:molecule-generated-variant-key-usage` で multi-variant な Molecule 実装が generated `*VariantKey` 型を利用しているか検知）
- **default variant key検証**: ✅ 実装済み（`npm run design:verify:default-variant-keys` で `atoms/molecules-core` と `generated/default-variant-keys.ts` の整合を検知）
- **default variant key 利用検証**: ✅ 実装済み（`npm run design:verify:default-variant-key-usage` で multi-variant な Atom/Molecule 実装が generated `*DefaultVariantKey` を利用しているか検知）
- **component style hints 検証**: ✅ 実装済み（`npm run design:verify:component-style-hints` で `component-manifest.ts` と `component-style-hints.ts` のカテゴリ / component key / variant key 整合を検知）
- **component style drift レポート**: ✅ 実装済み（`npm run design:verify:component-style-drift-report` で generated `component-style-hints.ts` と各実装ファイルの構造クラス差分を可視化。`npm run design:verify:component-style-drift` は strict fail モード）
  - `--category` / `--categories` オプションでカテゴリ限定レポート/strict 実行が可能
  - 除外は `design/policy/component-style-drift-exclusions.json` で管理（理由・期限必須）。運用ルールは `design/policy/component-style-drift-exclusions.md`
  - 段階適用 strict は `npm run design:verify:component-style-drift:scoped`（`design/policy/component-style-drift-strict-targets.json`）で管理。運用ルールは `design/policy/component-style-drift-strict-targets.md`
  - 現在の strict 対象: カテゴリ単位で `atoms`, `molecules`, `organisms`, `templates`（= 全カテゴリ）を有効化
  - `npm run design:verify` / `npm run design:verify:components` は component style drift の full strict 失敗を含む
- **ハードコード色クラス検証**: ✅ 実装済み（`npm run design:verify:hardcoded-color-classes` で `src/components/{atoms,molecules,organisms,templates}` と `app` 全体に `bg-blue-*` などの color class、`#`/`rgb`/`hsl` を直接埋め込む arbitrary color class、`shadow-[...]` / `drop-shadow-[...]` の arbitrary shadow class、さらに inline style (`backgroundImage` / `color` / `filter` など) 内の生色リテラルが残っていないか検知。`var(--token)` 参照は許可（任意 shadow class は禁止）。overlay は `bg-overlay/*` トークンへ統一し、例外ファイルは原則空運用（必要時のみ明示許可 + 未使用例外検知）。`design:verify` に統合済み）
- **tailwind color token マップ検証**: ✅ 実装済み（`npm run design:verify:tailwind-color-tokens` で `tailwind-theme-extend.cjs` の `colors` が `--background` / `--foreground` / `--overlay` / `--info` / `--success` / `--warning` と各 semantic group（`primary.*` など）を `hsl(var(--token))` 参照で定義しているか、かつ `colors` 内に生色 literal を持ち込んでいないか検知。`design:verify` に統合済み）
- **tailwind foundation token マップ検証**: ✅ 実装済み（`npm run design:verify:tailwind-foundation-tokens` で `tailwind-theme-extend.cjs` の `borderRadius` / `boxShadow` / `transitionDuration` / `transitionTimingFunction` / `animation` が `--radius` / `--shadow-*` / `--duration-*` / `--ease-*` token 参照を維持しているか検知。`design:verify` に統合済み）
- **tailwind theme SSOT検証**: ✅ 実装済み（`npm run design:verify:tailwind-theme-ssot` で `tailwind.config.ts` / `tailwind-preset.js` が共通 `tailwind-theme-extend.cjs` を参照しているか検知。`design:verify` に統合済み）
- **tailwind preset plugin 整合検証**: ✅ 実装済み（`npm run design:verify:tailwind-preset-plugins` で `tailwind-preset.js` の plugin 一覧が `tailwind.config.ts` と一致し、各 plugin package が `package.json` に宣言済みかを検知。`design:verify` に統合済み）
- **CSS var coverage検証**: ✅ 実装済み（`npm run design:verify:css-vars` で `tailwind-theme-extend.cjs` が参照する `var(--token)` が `src/globals.css` の `:root` に定義されているか、かつ主要 theme/shadow token が `.dark` にも定義されているか検知。`design:verify` に統合済み）
- **app globals SSOT 検証**: ✅ 実装済み（`npm run design:verify:app-globals` で `app/globals.css` が `@import "tailwindcss";` / `@config "../tailwind.config.ts";` / `@import "../src/globals.css";` を維持しているか、`:root` / `.dark` の重複定義を持たないか、hero 背景が `--overlay` トークンベースかを検知。`design:verify` に統合済み）
- **生成スタブ残存検証**: ✅ 実装済み（`npm run design:verify:generated-stubs` で `design:sync:stubs` 生成マーカー、production marker、`data-slot-placeholder` などの slot 仮実装残存を検知。失敗時はカテゴリ別件数サマリを表示。`npm run design:verify:generated-stubs:report` で fail させずに残存一覧を確認可能。`--category` 指定にも対応）
- **生成 docs page 残存検証**: ✅ 実装済み（`npm run design:verify:generated-docs-pages` で docs page の未解消 TODO / 旧プレースホルダ文言を検知。失敗時はカテゴリ別件数サマリを表示。`npm run design:verify:generated-docs-pages:report` で fail させずに残存一覧を確認可能。`--category` 指定にも対応）
  - `npm run design:verify:generated-artifacts:report` で stubs + docs pages の残存をまとめて確認可能
  - `npm run design:verify:ssot-progress-report` で stubs + docs pages + component style drift をカテゴリ単位でまとめて確認可能
  - `npm run design:verify:ssot-progress-report:json` で同内容を JSON 出力可能（`schemaVersion` + `scanned/resolved/unresolved/completionRate` + カテゴリ内訳付き。`--root` で任意ディレクトリ解析にも対応。CI / ダッシュボード集計向け）
  - `npm run design:verify:ssot-progress-diff -- --base ... --head ...` で 2つの進捗 JSON の改善/悪化を比較可能（`--changed-only` / `--json` 対応）
  - `npm run design:verify:ssot-progress-regressions -- --input ...` で diff(JSON) の悪化指標のみ fail 可能（改善は pass、`--category-thresholds` でカテゴリ別許容量を指定可能、`--report-json` で判定結果の機械可読出力が可能）
  - `npm run design:verify:ssot-progress-pr-comment -- --diff ...` で diff + regression結果から PR共有用コメントMarkdownを生成可能（`--mode concise|detailed`）
  - 判定ルールは `scripts/design-sync/docs-page-scaffold-rules.mjs` を `sync` / `verify` の両方で共有
- **coverage除外ルール**: ✅ 運用中（`design/policy/coverage-exclusions.md` で例外登録ルールを管理）
- **docs → category metadata.json**: ✅ docs の ComponentLayout は atoms/molecules/organisms/templates metadata を参照（`molecules/ai-chat` は `AIChatInput` / `AIChatMessage` の複合参照）
- **component-specs → コンポーネント実装スタブ生成**: ✅ 実装済み（`npm run design:sync:stubs` で不足コンポーネントの TSX スタブを自動生成）
  - 生成スタブには `component-specs` の variant 情報（`children` / `width` / `height` / `padding` / `gap` / `cornerRadius` / `stroke` / `text.fontSize` / `text.fontWeight`）由来の Tailwind クラス初期値を埋め込み
  - 生成スタブは `React.forwardRef` + `displayName` を含む最小実装を出力
  - multi-variant コンポーネントは variant class マップと default variant を型付きで生成（atoms/molecules は generated variant key、その他カテゴリはローカル union 型）
  - multi-variant で `children` が variant ごとに異なる場合、variant 別 slot map（`*VariantSlotIds`）を生成して scaffold 上で出し分け
  - slot プレースホルダは slot 名ヒントから `header/footer/nav/aside/section/form/div` の semantic tag を自動選択
  - slot プレースホルダには `aria-label` と置換ガイドコメント（Generated slot placeholder）を自動付与
  - icon / separator 系 slot は装飾扱いとして `aria-hidden` を自動付与（通常 slot のみ `aria-label`）
  - slot プレースホルダの class 初期値は `component-specs` の node snapshot（`width/height/padding/gap/cornerRadius/stroke` など）から自動推定
  - text slot のプレースホルダ本文は node snapshot の `content`（未設定時は slot 名ベース文言）を自動反映
  - `children` 定義がある variant は `data-slot="<childId>"` プレースホルダノードを自動生成
  - 生成スタブの variant class マップには `fill` / `stroke` / `text.fill` のカラー値ヒントをコメント出力（手動トークン整合を補助）
  - `npm run design:sync:stubs:refresh` で「生成マーカー付きスタブ」だけを安全に再同期可能
  - `--category` / `--categories` オプションでカテゴリ限定実行が可能（例: `--category=atoms`）
  - `npm run design:sync:stubs:production` は marker / `data-slot-placeholder` / placeholder comment を含まない production 向け初期実装を生成
  - `npm run design:sync:stubs:production:refresh` で「production marker 付き」および旧 `design:sync:stubs` marker 付きスタブを production 形式へ安全に再同期可能
- **atoms.pen 等 → React コンポーネント本体の完全自動生成**: 🟡 進行中（型付きスタブ + production 向け初期実装生成までは自動化済み。実ビジネスロジック/アクセシビリティ調整は手動）

## コンポーネント作成の進め方

トークンが揃ったので、次は `.pen` を起点にコンポーネントを作成・更新します。

### 現状

- **atoms.pen**: tokens.pen と同様にコンポーネントごとにフレームセクションを分割。各セクションにタイトル・説明を配置（docs と同じ文言）。
  - **Button**: Default, Destructive, Outline, Secondary, Ghost, Link のバリアント
  - **Input**: Default, Placeholder, Disabled のバリアント
- **atoms-metadata.json**: 各コンポーネントの title / description を一元管理。docs はここから import。design:sync で atoms.pen と双方向同期。
- **src/components/**: 既存の React コンポーネント（Button, Card, Input 等）は手書き。一部はトークン（CSS 変数）未対応。

### 推奨ワークフロー

1. **atoms.pen でコンポーネントを定義**  
   - Pencil で `reusable: true` のフレームを作成  
   - 色・余白・角丸は `$primary` 等のトークン変数を参照  

2. **React コンポーネントを整合**  
   - `.pen` の見た目・構造に合わせて TSX を更新  
   - Tailwind は `bg-primary`、`text-foreground` 等のトークンクラスを使用（硬直した gray-900 等を避ける）  

3. **優先順位**  
   - 1. **Button**（atoms.pen に定義済み）→ 既存 Button.tsx / ButtonVariants をトークン対応に更新  
   - 2. **Input, Badge, Label** 等の Atoms  
   - 3. **Card, Tabs** 等の Molecules  

### atoms.pen のセクション構成（tokens と同様）

各コンポーネントは独立したフレームセクションで管理：

| セクション | 内容 |
|------------|------|
| **Button** | タイトル・説明（docs と同一）＋ 6 バリアント + ショーケース |
| **Input** | タイトル・説明（docs と同一）＋ Default / Placeholder / Disabled |

タイトル・説明は `design/atoms-metadata.json` と双方向同期。Pencil でテキストを編集 → `npm run design:sync` で metadata に反映。metadata を編集 → `npm run design:sync:from-metadata` で atoms.pen に反映。

新規コンポーネント追加時は、`design/atoms-metadata.json` にエントリを追加し、`scripts/design-sync/sync-metadata.mjs` の `ATOMS_MAP` に `titleId` / `descId` を登録すること。

### 整合時の注意

- `atoms.pen` の Button は `$foreground`（default）、`$destructive`、`$border`、`$secondary` を参照
- React 側は `bg-primary`、`bg-destructive`、`border-border`、`bg-secondary` 等の Tailwind クラスで対応
- `design:sync` は型付きスタブ / production 向け初期実装の生成まで自動化済み。実ビジネスロジックやアクセシビリティ調整は手動で整合

## Docs 公開について

- **ナビとページの対応**: サイドバー・コマンドパレットの全リンクに対応する doc ページが存在する状態に揃えた（存在しなかった Templates「Review」のリンクはナビから削除済み）。
- **言語切り替え**: ヘッダーにテーマ切替の横で EN/JA を切り替えるボタンを設置。サイドバー・ヘッダー・コマンドパレット・Docs ページャーのラベルは選択言語で表示され、locale は `localStorage` に保存される。
- **ページ本文の辞書化**: タイトル・説明・本文は `app/lib/docs-content/` で辞書管理（en / ja）。プロセページ（Introduction, Installation, Theming）は Markdown 本文まで辞書から表示。トークン・コンポーネント一覧・Button/Input 等は辞書の title/description とセクションラベル（Props, Usage 等）に対応済み。**他コンポーネントページ**で日本語を出したい場合は、`app/docs/components/atoms/button/page.tsx` または `app/docs/components/atoms/input/page.tsx` を参考に、`useLocale()` と `getDocContent(pageId, locale)` および `sectionLabels` を組み込み、`ComponentLayout` / `ComponentPreview` に渡す。辞書の日本語は `app/lib/docs-content/ja.ts` と `component-content-ja.ts` にあり、ブラッシュアップはそこを編集すればよい。

## CI / Hooks 連携

- **pre-commit**: ✅ 実装済み（`.githooks/pre-commit` で `npm run design:verify` を実行）
- **CI**: ✅ 実装済み（GitHub Actions: `.github/workflows/design-verify.yml`）
  - `design:verify`（sync + metadata/coverage/docs/components + component style drift full strict）
  - `design:verify:ssot-progress-report:json`（SSOT進捗の JSON を生成し `ssot-progress-report` artifact として保存）
  - `pull_request` では base commit を worktree 展開して `--root` で SSOT JSON を生成し、`ssot-progress-diff` で base/head 差分を生成（互換性がない場合は diff を skip 表示）
  - `pull_request` で base/head diff が生成できた場合は `design:verify:ssot-progress-regressions` で悪化のみ fail（`design/policy/ssot-progress-regression-thresholds.json` 適用）
  - `design:verify:ssot-progress-thresholds`（SSOT進捗 JSON にしきい値ゲートを適用）
  - `design:verify:ssot-progress-summary` で SSOT進捗サマリ（stubs/docs/drift件数）を Markdown 化し、Actions の Step Summary に自動表示
  - `pull_request` では SSOT diff と regression gate 結果（policy / pass-fail / 回帰件数 / 実行ログ）を Step Summary / artifact に出力（summary 生成は `design:verify:ssot-progress-regression-summary`）
  - `pull_request` では `design:verify:ssot-progress-pr-comment` でコメント `artifacts/ssot-progress-pr-comment.md` を生成し、Step Summary にも表示（`SSOT_PR_COMMENT_MODE` repo variable で既定値を設定）
  - `design:verify:ssot-pr-comment-docs` で `.github/workflows/design-verify.yml` の SSOT PR コメント用ラベル / repo variable が `design/README.md` に記載されているかを検証
  - PRラベルでコメントモードを上書き可能
    - `ssot-comment:detailed` を付与すると `detailed`
    - `ssot-comment:concise` を付与すると `concise`
    - 両方付与時は `ssot-comment:detailed` を優先
  - `pull_request`（fork 以外）では、`ssot-comment:post` ラベルが付与された場合のみ `artifacts/ssot-progress-pr-comment.md` をPRコメントへ upsert 投稿（固定マーカー付き）
  - `ssot-comment:no-post` ラベルを付与すると `ssot-comment:post` より優先して投稿を停止し、既存の SSOT bot コメント（固定マーカー付き）を cleanup
    - cleanup の既定動作は `delete`
    - repo variable `SSOT_PR_COMMENT_NO_POST_ACTION` に `update` を設定すると削除せず「disabled」メッセージへ更新
    - repo variable `SSOT_PR_COMMENT_NO_POST_DISABLED_MESSAGE` で `update` 時の本文をテンプレート指定可能（例: `- status: disabled\n- reason: maintenance`。改行は `\n` と実改行の両方に対応）
    - テンプレートが空文字（trim 後）になった場合は既定文言（`- status: disabled` / `- reason: ssot-comment:no-post label set`）へフォールバック
    - `update` を使う場合は Step Summary に「no-post message preview」を表示（先頭160文字、単一行）
  - `ssot-comment:detailed` / `ssot-comment:concise` は投稿可否ではなく、コメントモード選択のみを制御
  - ラベル未指定時は PRコメント投稿は行わず、Step Summary のみ更新
  - `type-check`

### SSOT PRコメント運用ルール（優先順）

1. 投稿可否は `ssot-comment:no-post` が最優先（`ssot-comment:post` より強い）
2. モードは `ssot-comment:detailed` > `ssot-comment:concise` > `SSOT_PR_COMMENT_MODE`（repo variable）
3. `no-post` cleanup は `SSOT_PR_COMMENT_NO_POST_ACTION`（`delete` / `update`）で制御

| Repo Variable | 既定値 | 許可値 | 用途 |
|---|---|---|---|
| `SSOT_PR_COMMENT_MODE` | `concise` | `concise`, `detailed` | PRコメント本文の表示粒度の既定値 |
| `SSOT_PR_COMMENT_NO_POST_ACTION` | `delete` | `delete`, `update` | `ssot-comment:no-post` 時に既存 bot コメントを削除するか、disabled 文面へ更新するか |
| `SSOT_PR_COMMENT_NO_POST_DISABLED_MESSAGE` | `- status: disabled\n- reason: ssot-comment:no-post label set` | 任意文字列 | `update` 時に出力する本文テンプレート（`\n` と実改行の両方対応、空文字は既定文言へフォールバック） |

## 参照

- [Pencil Design to Code](https://docs.pencil.dev/design-to-code)
- [Pencil Documentation](https://docs.pencil.dev/)
