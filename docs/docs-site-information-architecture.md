# GunjoUI Docs Site Information Architecture

Last updated: 2026-05-16

## Purpose

このドキュメントは、GunjoUI のドキュメントサイトに存在するページ種別、各ページが持つべき内容、提供価値、レビュー時のチェック体制を定義する。

目的は、`/docs/components` の横展開に入る前に「何を揃えるべきか」を固定し、ページごとの役割が混ざることを防ぐこと。

Tracking:

- Parent issue: #202 `docs: component audit and public readiness plan`
- First rollout issue: #216 `docs: generate component docs inventory and rollout report`
- Component audit: `docs/component-docs-audit.md`

## Site Principles

- GunjoUI の docs / patterns は GunjoUI 自体を説明・検証するためのサイトである。
- ドキュメント内の UI は、原則として GunjoUI コンポーネントで構成する。
- 新しい再利用 UI が必要な場合は one-off にせず、GunjoUI コンポーネント化と SSOT 対象として扱う。
- すべての公開向けページは日本語・英語の文脈を想定する。
- すべてのコンポーネント詳細ページには `Usage` を置く。使い方がないコンポーネントページは不完全とみなす。
- `Copy spec for AI`、コードコピー、プレビュー、Props、関連情報は、AI と人間の両方が実装判断できるための導線として扱う。

## Page Types

### 1. Home / Brand Entry

Routes:

- `/`

Role:

- GunjoUI の第一印象を作る入口。
- 何のデザインシステムか、どの領域を支えるかを短時間で伝える。

Required content:

- GunjoUI の名前と短い価値説明
- 主要導線: Docs, Components, Patterns, Tokens, Showcase
- 現在の公開状態や安定度が分かる案内

Value:

- 初見の利用者が、GunjoUI を使うべきか判断できる。
- 既存利用者が、目的の場所へ素早く移動できる。

Checks:

- ファーストビューに GunjoUI の名前が明確に出ている
- 主要導線が 1 クリックで到達できる
- モバイルで導線が隠れない

### 2. Why / Positioning

Routes:

- `/why`

Role:

- GunjoUI の設計思想、他との差分、採用理由を説明するページ。

Required content:

- GunjoUI が解決する問題
- 設計原則
- 既存 UI ライブラリやプロダクト開発で困る点との対比
- どの利用者に向いているか

Value:

- 採用判断者やチームメンバーが、GunjoUI の存在理由を理解できる。

Checks:

- コンポーネント一覧と重複した内容になっていない
- 抽象論だけでなく、実装や運用に接続している

### 3. Docs Landing

Routes:

- `/docs`
- `/docs/introduction`

Role:

- ドキュメント全体の入口。
- 初めて読む人が、インストール、テーマ、トークン、コンポーネント、パターンの順序を理解する。

Required content:

- 導入概要
- 推奨読み順
- 主要カテゴリへのリンク
- 安定度や公開状態の案内

Value:

- 利用者が迷わず「次に何を見るか」を決められる。

Checks:

- コンポーネント詳細ページへの導線がある
- Tokens / Patterns / Showcase との関係が分かる
- 日本語ページで説明が英語のまま残っていない

### 4. Setup / Adoption Guides

Routes:

- `/docs/installation`
- `/docs/theming`
- `/docs/stability`

Role:

- GunjoUI をプロジェクトに導入し、テーマや安定度を理解するためのページ。

Required content:

- インストール手順
- import 例
- テーマ適用方法
- 安定度の定義
- バージョンや破壊的変更の考え方

Value:

- 利用開始時の失敗を減らす。
- 社内・外部利用時の運用基準を揃える。

Checks:

- コマンドや import が現行パッケージと一致している
- 例がコピーして動く
- 安定度の説明が各コンポーネントの badge と矛盾していない

### 5. Token Reference

Routes:

- `/docs/colors`
- `/docs/typography`
- `/docs/spacing`
- `/docs/shadows`
- `/docs/radius`
- `/docs/animation`
- `/docs/components/tokens/*`

Role:

- 色、文字、余白、角丸、影、アニメーションなどの基礎設計を説明する。

Required content:

- token 名
- 値
- 用途
- 使ってよい場面 / 避ける場面
- コピー導線

Value:

- コンポーネントやパターンの見た目を個別調整せず、共通ルールに戻せる。

Checks:

- `tokens.pen` / generated CSS と差分がない
- サンプルが token を使っている
- 一覧だけでなく用途が説明されている

### 6. Component Index

Routes:

- `/docs/components`

Role:

- 全コンポーネントの入口。
- カテゴリ別に、目的のコンポーネントへ到達できるようにする。

Required content:

- カテゴリ一覧
- コンポーネントカードまたはリスト
- 検索・絞り込みがある場合は実際に機能すること
- Experimental などの安定度

Value:

- 利用者が「何が存在するか」を把握できる。
- 新規コンポーネント追加時の棚卸し地点になる。

Checks:

- `app/lib/navigation.ts` とリンク切れがない
- SSOT にあるコンポーネントと docs ページの差分を確認する
- 追加・削除時にカテゴリの整合性が保たれている

### 7. Component Detail

Routes:

- `/docs/components/:slug`

Role:

- 1 つの GunjoUI コンポーネントの仕様、使い方、状態、関連を確認するページ。

Required content:

- Header
  - 日本語・英語タイトル
  - 日本語・英語説明
  - stability badge
  - `Copy spec for AI`
- Preview
  - 実行可能な代表例
  - Code tab
  - コードコピー
  - responsive viewport controls when relevant
- States and Variants
  - 状態やバリアントを持つ場合のみ必須
  - 1 state / variant = 1 行または 1 ブロック
  - 状態の意味と使い分けを書く
- Props
  - props 名
  - 型
  - 初期値
  - 説明
  - 必須かどうか
- Usage
  - 全ページ必須
  - 実装例
  - コードコピー
  - 使うべき場面 / 注意点
- Used Components
  - 内部またはサンプルで構成に使っている GunjoUI コンポーネント
- Related Components
  - 置き換え候補、併用候補、実際に使われる pattern / complex component
- Previous / Next navigation
  - コンポーネント間の移動

Value:

- 人間が UI の使い方を判断できる。
- AI が仕様をコピーして実装できる。
- Pattern 実装時に「その場しのぎ」の UI を作らず、既存コンポーネントへ戻れる。

Checks:

- `ComponentLayout` を使っている
- `Preview` がある
- `Usage` がある
- `Usage` と Preview Code にコピー導線がある
- Preview / States and Variants の全デモで、上下左右の見切れがない
- desktop / tablet / mobile / FIT の各表示で、意図しない横スクロールや固定高さによる切れがない
- docs プレビュー iframe 内で `[data-embed-preview-wrap]`、直下の子要素、コンポーネント root の幅が意図した `previewBodyWidth` に合っている
- オーバーレイ系は開いた状態で確認し、プレビュー高さの追加だけで見切れを隠していない
- オーバーレイが見切れる場合は、トリガー位置、ポータル先、overflow 祖先、collision の side/align、viewport 境界を確認してから修正している
- props が実装とズレていない
- 日本語ページで英語説明が残っていない
- UI コピーが `docs/content-guidelines.md` と `/docs/guidelines/writing` に沿っている
- 無効化、エラー、空状態、破壊的操作、コピー完了、ツールチップに理由・結果・次の行動がある
- `usedComponents` と `relatedComponents` がある
- 状態・バリアントを持つ場合は `States and Variants` がある
- モバイルで横スクロールが不要な箇所に出ていない
- 表は狭い画面で崩さず、必要なら横スクロールとして分かる

Representative baselines:

- Basic component: `/docs/components/editable-field`
- Complex component: `/docs/components/asset-inspector-panel`
- State / variant component: `/docs/components/button`
- Runtime-state component: `/docs/components/filter-button`

### 8. Aggregate Component Pages

Routes:

- `/docs/components/charts`
- `/docs/components/ai-chat`
- similar group pages

Role:

- 個別コンポーネントではなく、関連コンポーネント群をまとめて比較・導入するページ。

Required content:

- 何をまとめているページか
- 含まれるコンポーネント一覧
- 代表 Preview
- 個別ページへのリンク
- どの順序で確認すべきか

Value:

- Chart や AI Chat のように単体より組み合わせで理解すべき領域を把握できる。

Checks:

- 個別コンポーネントページの代替にしすぎない
- 個別ページが必要なコンポーネントを aggregate だけで済ませていない
- 含まれるコンポーネントへのリンクがある

### 9. Patterns Index

Routes:

- `/patterns`

Role:

- GunjoUI コンポーネントで構成された実用パターン一覧。
- 業界別・用途別の UI パターンへの入口。

Required content:

- pattern card
- 目的
- 含まれるページ
- 主要 used components
- 状態: planned / in progress / ready
- 詳細ページへのリンク

Value:

- コンポーネント単体では見えない、実際のプロダクト UI の組み方を確認できる。

Checks:

- 実装済みページへリンクできる
- card の説明と詳細ページの内容が一致している
- 未実装の UI を実装済みのように見せない

### 10. Pattern Detail

Routes:

- `/patterns/auth/*`
- `/patterns/dashboard/*`
- `/patterns/media-library`
- `/patterns/chat`
- `/patterns/kanban`
- `/patterns/editor`
- `/patterns/landing`
- `/patterns/bannalyze`

Role:

- 実際のアプリ画面に近い構成で、GunjoUI の組み合わせ方を検証するページ。

Required content:

- Marquee / Device frame
- 実際に操作できる UI
- ページ間遷移または URL 変更が分かる仕組み
- パターン情報カード
  - 目的
  - 含まれるページ
  - Used Components
  - Related patterns
  - 実装メモ
- フッター

Value:

- 利用者が「この UI を自分のプロダクトにどう組むか」を判断できる。
- 足りないコンポーネントや API を見つける検証場所になる。

Checks:

- fake browser viewport 内で UI と overlay が完結する
- クリックできる見た目のものは動く
- 検索、追加、削除、設定、通知などの主要操作にフィードバックがある
- 使用している UI が GunjoUI コンポーネントまたは GunjoUI 化予定として明示されている
- mobile / tablet / desktop の frame 表示で破綻しない

### 11. Showcase

Routes:

- `/showcase`

Role:

- GunjoUI の代表的な使い方や完成度を見せるギャラリー。

Required content:

- showcase card
- screenshot / thumbnail
- 説明
- 関連 component / pattern へのリンク

Value:

- 詳細仕様ではなく、完成形の印象を短時間で伝える。

Checks:

- サムネイルが現在の UI と大きく乖離していない
- 詳細ページへのリンクがある
- カードが単なる装飾になっていない

### 12. AI / Internal Handoff

Routes:

- `/ai-handoff`
- internal docs such as `docs/*handoff*.md`

Role:

- AI agent や実装者が、プロジェクトの規約・進行中タスク・検証手順を理解するためのページ。

Required content:

- repo conventions
- workstream status
- issue links
- verification cycle
- known pitfalls

Value:

- 引き継ぎの品質を安定させる。
- 同じルールを毎回説明しなくて済む。

Checks:

- AGENTS.md / CLAUDE.md / DESIGN.md と矛盾していない
- 古い issue や閉じた前提が残っていない

## Template Readiness Checks

Before applying a page template broadly, validate these four baseline pages:

| Baseline | Route | Why |
| --- | --- | --- |
| Basic | `/docs/components/editable-field` | Small component with Preview, Props, Usage, Used/Related |
| Complex | `/docs/components/asset-inspector-panel` | Composite component with internal actions and multiple states |
| Variant | `/docs/components/button` | Visual variants plus practical states |
| Runtime state | `/docs/components/filter-button` | State is driven by selected/open data rather than a simple variant prop |

The template is ready only when all four pass:

- Header has bilingual title and localized description
- `Copy spec for AI` is present when spec can be generated
- Preview is present
- Preview has Code tab and code copy
- Usage is present
- Usage has code copy
- Props is present
- Used Components is present
- Related Components is present
- States and Variants exists when the component has meaningful states or variants
- Local nav includes the visible sections
- Desktop, tablet, and mobile do not introduce unintended horizontal scroll
- Labels, descriptions, tooltips, disabled reasons, errors, empty states, destructive confirmations, and copy feedback follow `docs/content-guidelines.md`
- New copy patterns that are not in the message catalog are added to `/docs/guidelines/writing` or recorded under #235

## Review System

Tracking parent: #202

### 1. Author checklist

Every docs PR must include:

- Page type being changed
- Why the page exists
- What value it gives users
- Sections added or intentionally omitted
- Related issue
- Verification commands
- Content review result against `/docs/guidelines/writing`

### 2. Automated checks

Required:

- `npm run type-check`
- `npm run design:verify`

For docs component sweeps, also run a browser audit script or equivalent check for:

- required section ids
- copy buttons
- local nav entries
- missing Japanese descriptions
- docs preview height clipping, especially non-embedded previews that use tall content with the default preview height
- preview/code parity: the code shown in the active preview must include the same data, labels, icons, and important layout classes as the rendered preview
- horizontal scroll at desktop and mobile widths

### 3. Manual browser checks

For representative pages:

- Desktop width
- Tablet preview width
- Mobile width
- Japanese locale
- English locale
- Copy spec for AI
- Preview code copy
- Usage code copy
- Preview/code parity: copied code must recreate the rendered preview without hidden sample data or missing icons/actions
- States / Variants interaction when applicable
- Overlay containment when applicable

### 4. Content review

Review questions:

- Does this page tell users when to use the component?
- Does it explain states and variants without duplicating Props?
- Are Used Components and Related Components useful, not just decorative?
- Can an AI agent copy the spec and implement the component correctly?
- Does the page avoid one-off UI that is not GunjoUI?
- Do labels stay short while body messages carry object, reason, and next action?
- Do disabled controls explain why they are unavailable and how to enable them?
- Do errors explain what failed and how to recover without blaming the user?
- Do destructive actions name the target and impact before execution?
- Do icon-only and toggle controls use tooltip text that matches their `aria-label`?
- Do Japanese and English messages preserve the same intent and information density?
- Does new wording belong in the public message catalog or an issue for #235?

### 5. Sweep gates

Do not start a full category sweep until:

- The four baseline pages pass the template readiness checks.
- This document and `docs/component-docs-audit.md` agree on required sections.
- #216 produces a reproducible inventory report for `/docs/components/*`.
- Any new reusable docs UI has been classified as either:
  - public GunjoUI component and SSOT target, or
  - docs-only structural helper with no public component responsibility.

## Open Follow-ups

- #216 Add or update a script/report that audits `/docs/components/*` pages for required sections.
- Decide how aggregate pages such as `charts` count against individual component documentation.
- Add a public-facing rule page for animation and interaction tokens.
- Extend `/patterns` detail pages with pattern information cards and Used Components.
