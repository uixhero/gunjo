# Component Addition Playbook

GunjoUI に新規コンポーネントを追加するときの手順書。現在の GunjoUI は **機能カテゴリ**を SSOT と docs の単位にしている。

コンポーネント追加では **Pen / spec / source / docs / export** を揃える。どれかが欠けると `design:verify` や docs audit で検出される。

## 0. カテゴリ判断

| カテゴリ | 判断基準 | 例 |
|---|---|---|
| **Inputs** | 入力、選択、送信、編集、フォーム操作 | Button, Input, Select, ChatInput |
| **Display** | 情報表示、リスト、テーブル、カード、タグ、ツリー | Card, Table, Tag, FileTree |
| **Charts** | データ可視化、指標、チャートカード | BarChart, DonutChart, Statistic |
| **Feedback** | 状態通知、進捗、警告、トースト | Alert, Banner, Toast, Progress |
| **Navigation** | ページ移動、メニュー、サイドバー、ページャー | Header, Sidebar, Pagination |
| **Overlay** | モーダル、シート、ポップオーバー、ツールチップ | Dialog, Drawer, Tooltip |
| **Layout** | 配置、サイズ、キャンバス、フレーム、スクロール | Grid, Container, Resizable |
| **Patterns** | 複数コンポーネントを組んだページ級の型 | DashboardTemplate, AuthTemplate |

迷ったら、そのコンポーネントの主責務で判断する。たとえば「削除確認」はボタンではなく確認 UI なので Overlay、「進行中の保存状態」は表示ではなく Feedback。

## 1. .pen に追加

### 1.1 既存類似品の探索

`COMPONENT_VISUAL_AUDIT.md` や `/showcase` で近い用途のコンポーネントを確認する。命名、variant 設計、サイズ感、トークン使用、docs プレビューの構造を先に揃える。

### 1.2 対象カテゴリの `.pen` を更新

Pencil で対象カテゴリの `.pen` を開き、reusable component として variants を作成する。

対象例:

- `design/inputs.pen`
- `design/display.pen`
- `design/feedback.pen`
- `design/navigation.pen`
- `design/overlay.pen`
- `design/layout.pen`
- `design/patterns.pen`

命名規則:

- 1 variant のみ: `<ComponentName>/Default`
- 複数 variant: `<ComponentName>/<VariantKey>`
- variant key は source 側の `variant` key と対応させる

### 1.3 showcase frame に追加

`AuditShowcase` 配下に `showcase/<componentKey>` という子 frame を追加し、各 variant への `ref` 子を持たせる。Pencil MCP で生成する場合は次の形に揃える。

```js
sNew=I("<auditShowcaseId>",{type:"frame",name:"showcase/<componentKey>",layout:"horizontal",gap:24,padding:16,fill:"#ffffff",alignItems:"center"})
I(sNew,{type:"ref",ref:"<variant1Id>"})
I(sNew,{type:"ref",ref:"<variant2Id>"})
```

### 1.4 保存

Pencil で `Cmd+S`。保存しないと `.pen` が更新されず、`design:sync` が spec を拾えない。

## 2. ソース実装

### 2.1 ファイル作成

`src/components/<category>/<ComponentName>.tsx` を作成する。

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const newComponentVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newComponentVariants> {}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(newComponentVariants({ variant }), className)}
      {...props}
    />
  )
);
NewComponent.displayName = "NewComponent";

export { NewComponent };
```

実装時の注意:

- 既存 GunjoUI コンポーネントで compose できるものは再利用する。
- icon-only / ambiguous / toggle button には `TooltipButton` または `Tooltip` を付ける。
- disabled control には理由を tooltip で出す。
- mobile input zoom を避けるため、入力系の実効 font-size は mobile で 16px 以上にする。
- ハードコード色・独自 shadow・独自 spacing を増やさず、トークンを使う。

### 2.2 export 追加

`src/index.ts` は手で編集しない。`design:sync` が `design/component-specs/*.json` から再生成する。

```bash
npm run design:sync
```

## 3. SSOT / metadata 登録

### 3.1 metadata に追加

対象カテゴリの metadata に component key を追加する。

例:

- `design/inputs-metadata.json`
- `design/display-metadata.json`
- `design/feedback-metadata.json`
- `design/navigation-metadata.json`
- `design/overlay-metadata.json`
- `design/layout-metadata.json`
- `design/patterns-metadata.json`

### 3.2 functional category map に追加

`scripts/design-sync/docs-component-config.mjs` の `FUNCTIONAL_CATEGORY_OF_SLUG` に slug とカテゴリを追加する。docs URL はカテゴリに関係なく flat で、常に次の形になる。

```ts
"/docs/components/<kebab-slug>"
```

source の置き場が `src/components/display` でも、docs は `/docs/components/display/<slug>` にはしない。

## 4. docs ページ追加

### 4.1 ページ作成

`app/docs/components/<kebab-slug>/page.tsx` を作成する。既存ページのテンプレートに合わせ、以下を必ず揃える。

- docs preview
- states / variants
- props
- usage
- used components
- related components
- preview と code の中身の一致
- 日本語 / 英語の混在チェック

### 4.2 docs preview の注意

docs preview と states / variants は別の表示面として確認する。

- top の `/embed/<slug>` が FIT 幅で狭くなっていないか
- overlay が preview 内で見切れていないか
- modal / drawer / popover がページ全体ではなく preview 内で完結しているか
- 高さ不足を固定 `min-h-*` で隠していないか
- code copy が preview と一致しているか

見切れや overlay 問題は、まず共通 helper や component の portal / collision / overflow を疑う。デモ wrapper に高さを足して逃げない。

## 5. 同期と検証

```bash
# 1) .pen / metadata / spec / source / export / docs nav を同期
npm run design:sync

# 2) docs navigation だけ再生成したい場合
npm run design:sync:docs-navigation

# 3) 全 verify
npm run design:verify
npm run docs:audit:components
npm run type-check
git diff --check
```

`design:verify` が通り、`/showcase` と対象 docs page で preview / code / states が確認できれば完了。

## 6. PR チェックリスト

```markdown
## Summary
- New component: `<ComponentName>` (`<componentKey>`)
- Category: `<Inputs / Display / Charts / Feedback / Navigation / Overlay / Layout / Patterns>`
- Variants added: <list>
- 採用先影響度: <none / minor / breaking>（[versioning](/docs/versioning) 基準）

## SSOT チェック
- [ ] .pen に reusable + showcase 追加（Cmd+S 済）
- [ ] metadata / component spec 同期
- [ ] `src/components/<category>/<ComponentName>.tsx` 実装
- [ ] docs page 追加
- [ ] `src/index.ts` export 再生成
- [ ] `npm run design:sync` 緑
- [ ] `npm run design:verify` 緑
- [ ] `npm run docs:audit:components` 緑
- [ ] `npm run type-check` 緑
- [ ] `git diff --check` 緑
- [ ] [CHANGELOG](/docs/changelog) に Added 欄を追記
```

## トラブルシューティング

### `design:verify:component-style-drift` が落ちる

spec JSON と source の className が乖離している。`design:verify` の `Top drift components` を読んで、足りない token / class を base または variant に追加する。デザインに合わせるのではなく、必要なら .pen / spec / source のどれを正とするかを判断して同期する。

### docs ページが 404

`app/docs/components/<slug>/page.tsx` があるか確認し、`npm run design:sync:docs-navigation` を流す。`app/lib/navigation.ts` は生成物なので手動編集しない。

### docs preview の幅や overlay が崩れる

ページローカルの `max-w-*` や固定高さを疑う前に、`app/components/doc/ComponentHelpers.tsx` と `app/embed/EmbedPreviewFrame.tsx`、対象 overlay の portal / collision behavior を確認する。
