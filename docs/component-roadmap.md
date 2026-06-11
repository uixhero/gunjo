# Component Roadmap

GunjoUI の追加コンポーネント計画と進捗追跡。**セッション間引き継ぎの SSOT** として運用する。

最終更新：2026-05-04

## ステータス凡例

| 記号 | 意味 |
|---|---|
| ✅ | npm に publish 済（実配布物に含まれる） |
| 🟢 | main マージ済（次の publish で配布される） |
| 🟡 | PR open 中 |
| ⏳ | 未着手 |
| ❌ | blocked / 設計再検討 |

## 全体プラン

42 components を 5 tier に分けて段階追加。各 PR は 3〜5 件 / セッションのペースで進行。

| Tier | 件数 | テーマ | PR ペース |
|---|---|---|---|
| 1 | 9 | 必須欠落（基本コンポーネント） | 2〜3 PR で完了 |
| Layout | 5 | Layout primitives（atoms/ 配下） | 1 PR で完了 |
| 2 | 13 | 多用パターン | 3 PR で完了 |
| 3 | 9 | 特化用途 | 2 PR で完了 |
| Templates | 6 | テンプレート追加 | 1 PR で完了 |

## Tier 1：Essentials（9 件）

| Component | Tier | Status | PR | Session | Notes |
|---|---|---|---|---|---|
| Toggle | atom | 🟢 | #7 | 1 | Pressed/unpressed の単体ボタン。Radix `react-toggle` + cva |
| AspectRatio | atom | 🟢 | #8 | 2 | Radix `react-aspect-ratio` の薄いラッパー |
| Code | atom | 🟢 | #8 | 2 | inline `<code>` cva pattern。default / muted variant、sm / default / lg size |
| AlertDialog | molecule | 🟢 | #9 | 3 | Radix `react-alert-dialog` ベース、compound pattern |
| Drawer | molecule | 🟢 | #9 | 3 | vaul ライブラリベース、mobile bottom-sheet |
| Combobox | molecule | 🟢 | #10 | 4 | Popover + Command の compound、searchable select |
| DatePicker | molecule | 🟢 | #10 | 4 | Popover + Calendar の compound、date-fns で formatting |
| Sidebar | molecule | 🟡 | (pending) | 5 | Provider + compound (Header/Body/Footer/Separator) + useSidebar hook |
| DataTable | molecule | 🟡 | (pending) | 5 | @tanstack/react-table wrapper、sort + filter + pagination |

## Layout primitives（5 件）

`atoms/` 配下に配置。HStack / VStack 等は AI エディタで多用される。

| Component | Tier | Status | PR | Session | Notes |
|---|---|---|---|---|---|
| Container | atom | 🟡 | (pending) | 6 | size prop で max-width + padding wrapper |
| HStack | atom | 🟡 | (pending) | 6 | flex 横、gap/align/justify/wrap props |
| VStack | atom | 🟡 | (pending) | 6 | flex 縦、gap/align/justify props |
| Cluster | atom | 🟡 | (pending) | 6 | flex-wrap、Tags 等の自動折返し用 |
| Grid | atom | 🟡 | (pending) | 6 | cols 固定 or minItemWidth auto-fit |
| Spacer | atom | 🟡 | (pending) | 6 | size 指定 or flex-grow filler |

## Tier 2：High-frequency（13 件）

| Component | Tier | Status | PR | Session | Notes |
|---|---|---|---|---|---|
| NumberInput | atom | 🟡 | (pending) | 7 | input + chevron stepper、min/max/step props |
| PasswordInput | atom | 🟡 | (pending) | 7 | input + Eye/EyeOff toggle |
| SearchInput | atom | 🟡 | (pending) | 7 | input + Search icon + clearable × |
| EmptyState | atom | 🟡 | (pending) | 8 | icon + title + description + action slot |
| Tag | atom | 🟡 | (pending) | 8 | onRemove 付き Badge、4 variants × 3 sizes |
| InputOTP | atom | 🟡 | (pending) | 8 | input-otp ライブラリ wrap、Group/Slot/Separator |
| AvatarGroup | molecule | 🟡 | (pending) | 9 | 重ね avatars + max prop で +N overflow |
| DateRangePicker | molecule | 🟡 | (pending) | 9 | Popover + Calendar mode=range、numberOfMonths |
| TimePicker | molecule | 🟡 | (pending) | 9 | hour/minute select、hour12 / minuteStep props |
| TagInput | molecule | 🟡 | (pending) | 10 | Enter / , でコミット、Backspace で末尾削除、maxTags / dedupe |
| CodeBlock | molecule | 🟡 | (pending) | 10 | filename / language / copy button 付き |
| Banner | molecule | 🟡 | (pending) | 10 | 5 variants、icon / action / onDismiss props |
| NavigationMenu | molecule | 🟡 | (pending) | 10 | Radix `react-navigation-menu` の compound |

## Tier 3：Specialty（9 件）

| Component | Tier | Status | PR | Session | Notes |
|---|---|---|---|---|---|
| ColorSwatch | atom | 🟡 | (pending) | 11 | color preview chip + 値コピー |
| Timeline | molecule | 🟡 | (pending) | 11 | TimelineItem (variant/marker/connector) compound |
| TreeView | molecule | 🟡 | (pending) | 11 | TreeNode[] data driven、controlled / uncontrolled expand |
| MarkdownRenderer | molecule | 🟡 | (pending) | 12 | react-markdown + remark-gfm wrapper、prose styling |
| Mention | molecule | 🟡 | (pending) | 12 | textarea + @ trigger picker、↑↓+Enter 選択 |
| Statistic | molecule | 🟡 | (pending) | 12 | KPI card、trend (up/down/flat) で色・矢印切替 |
| Header | organism | 🟡 | (pending) | 13 | Brand / Nav / NavLink / Actions の compound |
| Footer | organism | 🟡 | (pending) | 13 | Columns / Section / Link / Brand / Copyright compound |
| OnboardingFlow | organism | 🟡 | (pending) | 13 | step indicator + content + Back/Continue、controlled / uncontrolled |

## Templates（6 件）

| Component | Tier | Status | PR | Session | Notes |
|---|---|---|---|---|---|
| NotFoundTemplate | template | 🟡 | (pending) | 14 | 404 page、code/title/description/action props |
| ErrorTemplate | template | 🟡 | (pending) | 14 | 500 page、details (stack trace) prop 付き |
| PricingTemplate | template | 🟡 | (pending) | 14 | 3-tier 価格表、PricingPlan[]、featured で highlight |
| BlogTemplate | template | 🟡 | (pending) | 14 | category / title / meta / hero、prose article |
| DocsTemplate | template | 🟡 | (pending) | 14 | sidebar / main / toc 三分割 layout |
| OnboardingTemplate | template | 🟡 | (pending) | 14 | hero panel + content 二分割、OnboardingFlow と組合せ |

## セッション履歴（引き継ぎログ）

### Session 6：2026-05-05

- 開始：Layout primitives（Container / HStack / VStack / Cluster / Grid / Spacer の 6 件）
- branch: `feat/layout-primitives`
- PR：(closing session で記入)
- 完了：**全 6 件 Layout primitives**
- **🎉 Layout primitives 完了** — atoms カテゴリに layout 系を追加

**学び：**
- Layout primitives は **新規依存ゼロ**、純粋な Tailwind 組み合わせ → 1 セッションで 6 件完了可能
- 6 components まとめて batch_design は max 25 ops 制約があり、最初に共有 showcase frame を作ったが metadata 上 1 component 扱いになるので各 component 個別 showcase に分割し直し（D() で削除 → 6 個別 showcase 作成）
- key naming: kebab-case slug（`hStack` ↔ `/h-stack` URL）が auto 生成。translations は `HStack` のように元の component 名を key に
- Spacer は flex-grow ベースで `size` prop オプショナル、`size` 無指定で flex-1
- Grid の `minItemWidth` props は CSS grid auto-fit を扱う Tailwind 範囲外の機能で、style 属性経由で実装

### Session 5：2026-05-05

- 開始：Tier 1 batch 5（Sidebar / DataTable）— Tier 1 完了
- branch: `feat/tier1-batch5-sidebar-datatable`（PR #10 stack）
- PR：(closing session で記入)
- 完了：**Sidebar**（Context provider + compound）+ **DataTable**（@tanstack/react-table wrapper）
- **🎉 Tier 1 全 9 件完了**

**学び：**
- Sidebar は Context-based provider で `useSidebar` hook を提供（外部からの collapsed 制御可）
- DataTable は generic component（`<TData, TValue>`）で型安全な columns 定義
- @tanstack/react-table は新規依存。flexRender / getCoreRowModel など hooks が豊富
- 複雑な molecule でも 1 セッションで 2 件は可能（既存ライブラリを活用すれば）

### Session 4：2026-05-05

- 開始：Tier 1 batch 4（Combobox / DatePicker）— 既存 molecule の compound
- branch: `feat/tier1-batch4-combobox-datepicker`
- PR：(closing session で記入)
- 完了：**Combobox**（Popover + Command）+ **DatePicker**（Popover + Calendar + date-fns）

**学び：**
- 既存 molecule の合成は **新規依存無し**で済むので素早い（cmdk / react-day-picker / date-fns 既存）
- 内部 import は `./Command` `./Popover` `../atoms/Button` の相対パス
- compound + state management（useState で open / value）が必要な分、demo file が長くなる
- design:verify は naming convention だけ check で composition の妥当性は見ない

### Session 3：2026-05-05

- 開始：Tier 1 batch 3（AlertDialog / Drawer）— 初の molecule 追加
- branch: `feat/tier1-batch3-alertdialog-drawer`
- PR：(closing session で記入)
- 完了：**AlertDialog**（Radix `react-alert-dialog` + compound pattern）+ **Drawer**（vaul）

**学び：**
- Molecule の追加は atom と比べて：(a) compound pattern で複数 export、(b) demo の interactivity が必要、(c) page も Trigger ボタン経由 — 構造は複雑だが手順は同じ
- molecules.pen は atoms.pen と別ファイル。`open_document` で切り替えるが editor state 表示は遅延、`batch_get` の `filePath` 引数で直接指定すれば確実
- molecules の spec config は `sync-molecule-specs.mjs` の `buildMoleculeSpec` 経由（atoms の `ATOM_COMPONENT_SPEC_DEFINITIONS` と異なるパターン）
- metadata config は `sync-metadata.mjs` の `MOLECULE_COMPONENT_KEYS` + `MOLECULES_MAP_OVERRIDES` で2重管理

### Session 2：2026-05-05

- 開始：Tier 1 batch 2（AspectRatio / Code）
- branch: `feat/tier1-batch2-aspectratio-code`
- PR：#8（マージ済）
- 完了：**AspectRatio**（Radix wrapper）+ **Code**（cva pattern）

**学び（Session 1 の検証）：**
- Session 1 で記録した「1 component あたり 40〜60 分」は正しかった
- 同じ session で 2 件の atoms を完了（infrastructure 学習が済んだ後の実工数）
- Skeleton-style パターン（top-level reusable + showcase）で安定運用可
- Pencil で 2 件分まとめて batch_design → 1 回 Cmd+S → 効率的

### Session 1：2026-05-04

- 開始：Tier 1 batch 1（Toggle / AspectRatio / Code）
- branch: `feat/tier1-batch1-toggle-aspectratio-code`
- PR：#7（マージ済）
- 完了：**Toggle** のみ（infrastructure 学習に時間使ったため）

**学びメモ（次セッション以降への引き継ぎ）：**

1. **Pencil MCP の save が手動必須** — `batch_design` で .pen に書き込んでも disk に反映されない。**ユーザーに Pencil で Cmd+S を依頼するステップが各セッションで 1 回必要**（複数 component の .pen 編集をまとめてから 1 回 save が効率的）
2. **Skeleton-style パターン推奨** — top-level reusable + showcase/<key> in u7EF6 で十分。`scripts/design-sync/sync-component-specs.mjs` の `ATOM_COMPONENT_SPEC_DEFINITIONS` に `{key, frameId, titleId, descId, variantsId}` を追加するだけ
3. **auto-generated docs page は 100% 流用不可** — `meta[metaKey]?.title` 形式は `design:verify:docs-metadata` の正規表現に合致しない。**Skeleton の page.tsx をテンプレに hand-edit が必要**（`(atomsMetadata as Record<...>).<key>.title` 形式）
4. **auto-generated stub の bug** — `slotIds` / `renderSlotNode` 等の未定義参照が含まれる。**stub は完全置換**して書き直す（cva pattern）
5. **demo file 必須** — docs page は `@/components/atoms/<Name>` を直接 import せず、`@/components/demos/<Name>Demo` 経由（demo は `@gunjo/ui` から import）
6. **i18n nav translation 必須** — `app/lib/translations.ts` の ja キーに新コンポーネント名追加が必要（`design:verify:nav-translations` で検出）
7. **i18n .md docs-content はオプション** — Skeleton も無い。spec の auto 表示で代替される。後でまとめ追加可

**1 component あたりの実工数（Toggle 計測）：**
- .pen 編集 + Cmd+S（ユーザー）: 5 分
- sync-component-specs.mjs エントリ追加: 2 分
- Toggle.tsx 実装（cva + Radix）: 10 分
- ToggleDemo.tsx: 5 分
- docs page hand-edit: 10 分
- ja translation 追加: 2 分
- design:sync + design:verify + type-check 緑化: 5〜15 分（debug 込み）
- 視覚確認: 3 分
- **合計：約 40〜60 分**

→ 1 セッションで 3〜5 atoms は現実的、複雑な molecule は 2〜3 件。

**未対応の理想化（次セッション以降に検討）：**
- auto-gen 修正：`sync-docs-pages.mjs` を `(meta as ...).<key>.title` 形式に変える → hand-edit 不要に
- nav translation の auto-add：design:sync で ja キーを足す
- i18n .md scaffold 自動生成

これらをやれば 1 component あたり 15〜20 分まで圧縮可能。

## セッション間引き継ぎチェックリスト

セッション終了時：

- [ ] 完成した component の Status を ⏳ → 🟢 に更新
- [ ] PR 列に PR 番号を記入
- [ ] 「セッション履歴」に学びメモ・blocker を残す
- [ ] [CHANGELOG.md](../CHANGELOG.md) の [Unreleased] に Added エントリ追記
- [ ] 中断地点（次セッションが何から再開すべきか）を明記

セッション開始時：

- [ ] 本ファイルの「セッション履歴」末尾を読む
- [ ] 直近の Status から「次にやる component」を特定
- [ ] 関連する PR があれば状態確認
- [ ] CHANGELOG の [Unreleased] を確認

## 補足ルール

- **1 セッション = 3〜5 components** が目安。複雑な molecule は 1〜2 件で OK
- **Tier 順守**：原則 Tier 1 → Layout → Tier 2 → Tier 3 → Templates の順。優先度逆転は roadmap で議論してから
- **PR 単位**：1 PR = 1 セッション分（3〜5 件）。半端な状態で commit せず、まとまった単位で PR
- **alpha 期間中**：MINOR バンプは行わず、`0.0.x-alpha.y` で進める。新コンポーネント追加は CHANGELOG [Unreleased] へ集約
