# DESIGN.md — Gunjo UI

> このファイルはAIエージェントが正確な日本語UIを生成するためのデザイン仕様書です。
> セクションヘッダーは英語、値の説明は日本語で記述しています。

ライトモードの色は `app/globals.css` の `:root` トークンを HSL → hex に換算した値です。コンポーネント固有の Tailwind ユーティリティはソース実装に基づきます。

## Fixed-URL Assets（機械可読な配布ファイル）

トークンとパターンの実値は、固定 URL のスタンドアロンファイルとしても配信しています。すべて `@gunjo/ui` と同じ SSOT から生成されるため、値がパッケージとずれることはありません。

- <https://www.gunjo.jp/tokens.css> : 全デザイントークンの純 CSS（Tailwind 非依存・ライト/ダーク両対応）
- <https://www.gunjo.jp/patterns.css> : CSS パターン集（card / badge / table / tabs などの `gj-` クラス）
- <https://www.gunjo.jp/starter.html> : 自己完結の単一 HTML スターター（tokens + patterns + デモ）

npm・ビルドツールが使えない環境（Claude Artifacts などの単一 HTML）はこちら: <https://www.gunjo.jp/docs/no-npm>

---

## 0. Design System Usage Rule

- **GunjoUI components first**: GunjoUI の docs / patterns サイトは GunjoUI 自体を説明・検証するためのサイトです。新しい UI を実装する前に、必ず既存の GunjoUI コンポーネントを確認する。
- **確認対象**: `src/components/**`, `src/index.ts`, `app/lib/navigation.ts`, `app/docs/components/**`, 近い用途の `app/components/demos/**` と `app/patterns/**`。
- **既存優先**: 既存コンポーネントで表現できる場合は、それを compose して使う。見た目だけ似た app-local コンポーネントや one-off styling を作らない。
- **不足時の扱い**: 足りない挙動がある場合は、まず `@gunjo/ui` 本体のコンポーネント追加・修正として扱う。重い場合や SSOT 更新が必要な場合は GitHub issue を切り、暫定対応の範囲を明記する。
- **先行実装の扱い**: まだ `@gunjo/ui` に登録されていない UI を pattern 内で先行実装する場合は、「その場しのぎ」ではなく「登録予定の候補」として扱う。特定ページだけの glue なのか、全体で使う primitive / composition なのかを切り分け、登録予定・責務・再利用範囲を issue または作業メモに残す。
- **SSOT**: `src/components/**` を変更した場合は、SSOT / design sync / docs registry の同期対象として扱う。
- **Pattern viewport**: パターンページの擬似ブラウザは `app/patterns/_lib/MarqueeChrome.tsx` と `DeviceFrame.tsx` で構成される実質的なアプリ viewport として扱う。内部 UI は実ブラウザの `vw` / `vh` ではなく、`MarqueeViewport` と擬似ブラウザのコンテナ幅・高さに合わせる。
- **Overlay containment**: パターン内から開く Dialog / Popover / Dropdown / Sheet / Lightbox / overlay は、擬似ブラウザ外へ出さない。GunjoUI overlay が `portalContainer` を受け取れる場合は必ず渡し、コンテナ指定時は `fixed` / `vw` 前提ではなく container-relative な absolute 配置・幅指定にする。コンポーネント側に不足がある場合は、本体コンポーネントを修正する。

---

## 1. Visual Theme & Atmosphere

- **デザイン方針**: 群青 (gunjō) を主軸にした「becoming」のデザインシステム。情報ダッシュボード・業務ツール向けの落ち着いたコントラストの中に、伝統的な日本の色名が持つ詩性を残す。
- **ブランドストーリー**: 名前の由来である「群青」は **未だ青ならず、青になりつつある色** ── 夜明け前の空、墨のまだ乾かない瞬間。完成された青ではなく、これから青になる、成長と無限の可能性の象徴。プロダクトの beta 段階・AI 時代の design system という「becoming」と重ねている。
- **配色思想**: primary に **群青** (`#4D5AAF`) を据え、accent に **媚茶** (kobicha, `#E8DDD3`/`#3A2A25`) を温かい土として配置。becoming を支える地。
- **密度**: コンポーネントは `text-sm`（14px）が多く、コントロール高さ `36px`（`h-9`）前後のコンパクト寄り。
- **キーワード**: 群青、becoming、クリーン、温度のあるニュートラル、ダークモード対応（`.dark` でトークン切替）。

---

## 2. Color Palette & Roles

<!-- hex は `src/globals.css` :root の HSL から換算。意味づけは Tailwind のセマンティック色名に準拠 -->

### Primary（ブランドカラー — 群青 / Gunjō）

- **Primary** (`#4D5AAF`): `hsl(232 39% 49%)`（`--primary`）。アイコン・状態・チャート・選択表示など。becoming する青。
- **Primary subtle**: `--primary-subtle` / `--primary-subtle-foreground`。淡い選択面、インライン通知、補助ハイライト。
- **Primary strong**: `--primary-strong` / `--primary-strong-foreground`。主要 CTA と強い実行操作。
- **Primary border**: `--primary-border`。淡色面の枠線や選択境界。
- **Primary Dark mode** (`#6571BD` 相当): `hsl(232 47% 65%)`。暗背景上での視認性のため少しライトに。

**補足（デフォルト Button）**: `src/components/inputs/ButtonVariants.ts` の `default` variant は互換性のため **`bg-foreground`（前景＝ほぼ黒）** を維持する。群青 CTA は `variant="primary"` を使う。

### Accent（媚茶 / Kobicha）

- **Accent (light)** (`#E8DDD3`): `hsl(29 31% 87%)`（`--accent`）。ホバー・サブ選択・カレンダー hover など、温度のあるニュートラル背景として。
- **Accent foreground (light)** (`#3A2A25`): `hsl(14 22% 19%)`（`--accent-foreground`）。アクセント背景上のテキスト。
- **Accent (dark)** (`#3A2A25`): `hsl(14 22% 19%)`。dark mode では accent が dark warm brown に反転。
- **Accent foreground (dark)** (`#E8DDD3`): `hsl(29 31% 87%)`。
- **設計意図**: 群青 (becoming) を支える「土」。前面を奪わず、ホバー・選択など人の意思が介在する瞬間に温度を与える。

### Semantic（意味的な色）

Semantic 色は `primary / info / success / warning / destructive` の各色に、次の段階を持つ。

- **subtle**: `--{color}-subtle` / `--{color}-subtle-foreground`。Alert、Banner、Toast、補足カードなど、文字を載せる淡い面。
- **default**: `--{color}` / `--{color}-foreground`。アイコン、ステータス点、チャート系列、軽い状態表示。
- **strong**: `--{color}-strong` / `--{color}-strong-foreground`。Button、強い CTA、はっきりした状態操作。
- **border**: `--{color}-border`。淡色面や選択状態の枠線。

対象:

- **Info** (`--info`): 補足情報、詳細確認、参照先の案内。
- **Success** (`--success`): 完了、接続済み、肯定的な状態。
- **Warning** (`--warning`): 注意、公開前確認、破壊的ではない警告。
- **Destructive** (`--destructive`): 削除、失敗、取り消せない操作。

### Palette（汎用実色）

`--palette-red` / `--palette-green` / `--palette-blue` / `--palette-yellow` / `--palette-cyan` / `--palette-magenta` / `--palette-gray` / `--palette-white` / `--palette-black` は、UI の意味色ではなく、エディタ・素材フィルター・色選択などで「実際の色」を選ぶための汎用パレット。テーマが変わっても色相は変えない。Alert、Banner、Button など意味を持つ UI には使わず、semantic token を使う。

### Neutral（ニュートラル）

- **Text Primary** (`#020817`): `hsl(222.2 84% 4.9%)`（`--foreground`）。
- **Text Secondary** (`#526070` 相当): `hsl(215 20% 40%)`（`--muted-foreground`）。淡い面の上でも AA を満たす補助テキスト。
- **Text Disabled**: 単色トークンはなく、`disabled:opacity-50` 等で **前景色の 50% 不透明度** が一般的。
- **Border** (`#e2e8f0`): `hsl(214.3 31.8% 91.4%)`（`--border` / `--input` の基準）。
- **Background** (`#ffffff`): `hsl(0 0% 100%)`（`--background`）。
- **Surface** (`#ffffff`): カード・ポップオーバー背景は `hsl(0 0% 100%)`（`--card` / `--popover`）。テキストはいずれも `--card-foreground` 等で `--foreground` と同系の濃色。

**Surface 上のテキスト補足**: `--primary-foreground` は `hsl(210 40% 98%)` → 実効 **`#f8fafc`**（プライマリ色の上に載せるライト文字）。

---

## 3. Typography Rules

### 3.1 和文フォント

- **ゴシック体**: ベースは Next.js の **Inter**（下記）。和字は Inter に含まれないため、ブラウザが **OS の sans-serif フォールバック**（例: ヒラギノ角ゴ、游ゴシック、Noto Sans CJK 系）を割り当てる。
- **明朝体**（使用する場合）: Gunjo UI の `app/layout.tsx` では未指定。必要なら別途 `font-serif` またはフォントファイルを追加する。

### 3.2 欧文フォント

- **サンセリフ**: **Inter**（`next/font/google` の `Inter`）。
- **セリフ**（標準では未使用）: プロジェクト側で指定するまで N/A。
- **等幅**: ドキュメント表などで `font-mono` を使用する場合、Tailwind プリセット（`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` 系）。

### 3.3 font-family 指定

`app/layout.tsx` より、実装は Inter のクラスを `body` に適用:

```css
/* 本文 — Next/font が生成するクラス内（概略） */
font-family: __Inter_, __Inter_Fallback_, system-ui, sans-serif;

/* 等幅（Tailwind font-mono 利用時のイメージ） */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

**フォールバックの考え方**:
- 和文は Inter の外なので **OS/ブラウザのゴシック** に落ちる。日本語品質を固定したい場合は **Noto Sans JP を明示追加**を推奨（現在のライブラリ単体の既定では未導入）。
- `body` には `antialiased` が付与されている（グレースケール Antialiasing）。

### 3.4 文字サイズ・ウェイト階層

`app/docs/typography/page.tsx` の見本に準拠。サイズは Tailwind の **1rem = 16px** 前提。

| Role | Font | Size | Weight | Line Height | Letter Spacing | 備考 |
|------|------|------|--------|-------------|----------------|------|
| Display | Inter + fallback | 36px (`text-4xl`) / 48px (`lg:text-5xl`) | 800 (`font-extrabold`) | トークンに依存（コンポーネント既定） | `-0.025em` (`tracking-tight`) | ドキュメント見出し |
| Heading 1 | 同上 | 36px / 48px | 800 | 〃 | `tracking-tight` | 〃 |
| Heading 2 | 同上 | 30px (`text-3xl`) | 600 (`font-semibold`) | 〃 | `tracking-tight` | 下線 `border-b pb-2` がセット |
| Heading 3 | 同上 | 24px (`text-2xl`) | 600 | 〃 | `tracking-tight` | カードタイトル `CardTitle` と同型 |
| Heading 4 | 同上 | 20px (`text-xl`) | 600 | 〃 | `tracking-tight` | 〃 |
| Body | 同上 | 16px (`text-base` 既定) | 400 | `28px` 相当 (`leading-7` = `1.75rem`) | 既定 | 段落見本 `leading-7` |
| Caption | 同上 | 14px (`text-sm`) | 400–500 | コンポーネント依存 | 既定 | `CardDescription` は `text-sm text-muted-foreground` |
| Small | 同上 | 12px (`text-xs`) | 400–500 | 既定 | 〃 | ボタン `sm` サイズ等 |

### 3.5 行間・字間

- **本文の行間 (line-height)**: 見本段落は `leading-7`（**1.75rem / 28px @16px**）。
- **見出しの行間**: Tailwind の見出しユーティリティ既定。`CardTitle` は `leading-none`（**1**）。
- **本文の字間 (letter-spacing)**: 明示なし（`0`）。見出しは `tracking-tight`（**-0.025em**）。
- **見出しの字間**: `tracking-tight`。

**ガイドライン**:
- 日本語長文では `leading-7` 以上を維持しやすい。
- `tracking-tight` は欧文 UI 寄り。和文見出しで窮屈に感じる場合は **`tracking-normal` の検討**（現行コンポーネントは tight 前提）。

### 3.6 禁則処理・改行ルール

ライブラリ全体の強制指定はなし。日本語 UI 生成時の推奨:

```css
/* 推奨設定（プロダクト側で付与する想定） */
overflow-wrap: break-word;
word-break: normal;        /* または記事向けに keep-all */
line-break: strict;
```

**禁則対象**（一般的な和文組版）:
- 行頭禁止: `）」』】〕〉》」】、。，．・：；？！`
- 行末禁止: `（「『【〔〈《「【`

### 3.7 OpenType 機能

グローバルでは未設定。必要に応じて:

```css
font-feature-settings: "palt" 1;
```

- **palt**: 見出し・短いラベル向き。長文本文では可読性優先でオフもあり。

### 3.8 縦書き

```css
writing-mode: vertical-rl;
text-orientation: mixed;
```

**該当なし**（Gunjo UI コンポーネントの標準レイアウトは横書き）。

---

## 4. Component Stylings

### Buttons

`src/components/inputs/ButtonVariants.ts` より（`--radius` = **0.5rem / 8px**）。

**Default（互換維持の強い標準操作）**

- Background: `hsl(var(--foreground))` → **`#020817`**
- Text: `hsl(var(--primary-foreground))` → **`#f8fafc`**
- Hover: `bg-foreground/90`（**90% 不透明度**）
- Padding: `0.5rem 1rem`（**8px 16px**, `py-2 px-4`）
- Border Radius: **`8px`**（`rounded-[var(--radius)]`）
- Font Size: **`14px`**（`text-sm`）
- Font Weight: **`500`**（`font-medium`）
- Height: **`36px`**（`h-9`）
- Shadow: **`var(--shadow)`**（`shadow` クラス）
- Focus: `ring-1` `ring` = `--ring`（プライマリと同色トーン）

**Primary / semantic variants**

- `variant="primary"`: `bg-primary-strong text-primary-strong-foreground`
- `variant="info"`: `bg-info-strong text-info-strong-foreground`
- `variant="success"`: `bg-success-strong text-success-strong-foreground`
- `variant="warning"`: `bg-warning-strong text-warning-strong-foreground`
- `variant="destructive"`: `bg-destructive-strong text-destructive-strong-foreground`

**Secondary（outline ではなく `secondary` variant）**

- Background: **`#f1f5f9`**（`--secondary`）
- Text: **`#0f172a`**（`--secondary-foreground`）
- Padding / Radius / Font: Default と同系（`shadow-sm`）

**Secondary（`outline` variant — ユーザ文脈のセカンダリに近い）**

- Background: **`transparent`**
- Text / Border: 境界 **`#e2e8f0`**（`border-border`）
- Hover: `bg-muted`（**`#f1f5f9`**）、文字は foreground
- Padding: 同上、`shadow-sm`

### Inputs

`src/components/inputs/Input.tsx` の実装値（トークン `border` ではなく **Tailwind gray** を直接使用）。

- Background: **`transparent`**
- Border: **`1px solid #e5e7eb`**（`border-gray-200`）
- Border (dark): **`1px solid #1f2937`**（`dark:border-gray-800`）
- Border (focus ring): **`1px solid #030712`**（`focus-visible:ring-gray-950`、実質リング）
- Border Radius: **`0.375rem` / 6px**（`rounded-md` — `calc(var(--radius) - 2px)`）
- Padding: **`0.25rem 0.75rem`**（`py-1 px-3`）
- Font Size: **`14px`**（`text-sm`）
- Height: **`36px`**（`h-9`）
- Placeholder: **`#6b7280`**（`placeholder:text-gray-500`）
- Disabled: **`opacity: 0.5`**

### Cards

`src/components/display/Card.tsx` より。

- Background: **`#ffffff`**（`bg-card`）
- Border: **`1px solid #e2e8f0`（相当）**（`border` → `border-border`）
- Border Radius: **`0.5rem` / 8px**（`rounded-lg` = `var(--radius)`）
- Padding: **ヘッダー・フッター `24px`（`p-6`）**、コンテンツは `p-6 pt-0`
- Shadow: **`0 1px 2px 0 rgb(0 0 0 / 0.05)`**（`shadow-sm` → `--shadow-sm`）

---

## 5. Layout Principles

### Spacing Scale

`app/docs/spacing/page.tsx` の Tailwind スペーシングに対応（**1 = 4px** 刻みの指数表記）。

| Token | Value |
|-------|-------|
| XS | **4px**（`1` / `0.25rem`） |
| S | **8px**（`2` / `0.5rem`） |
| M | **16px**（`4` / `1rem`） |
| L | **24px**（`6` / `1.5rem`） |
| XL | **32px**（`8` / `2rem`） |
| XXL | **48px**（`12` / `3rem`） |

### Container

`tailwind.config.ts` の `theme.container`:

- Max Width: **`1400px`**（`screens["2xl"]` 基準の中央寄せコンテナ）
- Padding (horizontal): **`32px`**（`2rem`）

### Grid

固定の「12 カラム」トークンはなし。ドキュメントでは `grid` + `gap` のユーティリティが多い。

---

## 6. Depth & Elevation

`app/globals.css` の `--shadow-*`（ライト）＝ `app/docs/shadows/page.tsx` 記載と一致。

| Level | Shadow | 用途 |
|-------|--------|------|
| none | `none` | フラット |
| sm | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | カード、小さな浮き |
| 1 (base) | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | ボタン等 `shadow` |
| 2 (md) | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | ドロップダウン感 |
| 3 (lg) | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | 大きめパネル |
| 4 (xl) | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | モーダル風 |
| 5 (2xl) | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | 強い浮遊感 |
| inner | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)` | へこみ表現 |

ダークモードでは同形で **黒の不透明度が 0.2 / 0.4 等に上がる**定義（`.dark` ブロック）。

---

## 7. Do's and Don'ts

### Do（推奨）

- 色・余白・影は **`hsl(var(--...))` と Tailwind のセマンティッククラス**（`bg-background`, `text-foreground`, `border-border`）を優先し、`app/globals.css` と乖離しないようにする。
- フォーカス可視化は **`focus-visible:ring-*` と `ring` トークン**に揃える（アクセシビリティ）。
- アイコンのみのボタン、コンパクトなアイコンボタン、UI 状態を切り替えるボタンには **GunjoUI の `TooltipButton`** を優先して使い、`aria-label` と同じ意味を伝える。ボタン以外をトリガーにする場合は `Tooltip` / `TooltipTrigger` / `TooltipContent` を compose する。
- 角丸はコンポーネントに合わせ **`rounded-md`（6px）と `rounded-lg`（8px）**を使い分ける（入力は md、カードは lg）。
- 日本語の長文では **行間を広め**（例: `leading-7` 以上）に保つ。
- コントラストは WCAG AA を意識し、**補助テキストは `muted-foreground`** を使う。

### Don't（禁止）

- **デフォルト Button が `--primary` ではない**ことを誤解しない。青い CTA は `variant="primary"` を使う。
- Input は `border-input` / `ring-ring` / `aria-invalid:border-destructive-border` に揃える。
- 日本語本文に **`leading-none` を本文ブロックに流用**しない（`CardTitle` 専用の短い見出し向け）。
- **純黒 `#000000` 一色**を背景・文字に使わない（Gunjo は **`#020817` 系の foreground**）。
- Success/Warning/Info/Destructive を **勝手な hex でばら撒かない**。文字を載せる面は `*-subtle`、強い操作は `*-strong`、枠線は `*-border` を使う。

---

## 8. Responsive Behavior

### Breakpoints

Gunjo UI アプリは Tailwind の **デフォルトブレークポイント**を前提（`tailwind.config.ts` で sm/md/lg を上書きしていない）。コンテナの `2xl` のみ **1400px** に調整あり。

| Name | Width | 説明 |
|------|-------|------|
| Mobile | **640px 未満** | `sm` ブレークポイント前 |
| Tablet | **640px 以上 1024px 未満** | `sm`〜`md`/`lg` 前後の帯 |
| Desktop | **1024px 以上** | `lg` 以上でサイドレイアウト等が成立しやすい |

### タッチターゲット

- **`Switch`**: 高さ **24px** × 幅 **44px**（`h-[24px] w-[44px]`）。その他ボタン **`h-9`（36px）** は小型デバイスでは **`size="lg"`（40px）** やパディング拡張を検討。
- WCAG の **44×44px** を厳密に満たす必要がある画面では、ボタン周辺のタップ領域を広げる。

### フォントサイズの調整

- モバイルでは見出しの **`lg:text-5xl` 等の段階切替**を踏襲。本文は **14–16px** を基準に余白を詰めない。

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
Primary (token, 群青): #4D5AAF (light) / #6571BD (dark)
Primary foreground: #f8fafc
Accent (媚茶, light): #E8DDD3 / Accent foreground: #3A2A25
Accent (媚茶, dark): #3A2A25 / Accent foreground: #E8DDD3
Default Button BG: #020817 (foreground, not primary)
Text Color: #020817
Muted Text: #64748b
Background: #ffffff
Card/Surface: #ffffff
Border: #e2e8f0
Font: Inter (next/font) + system-ui Japanese fallback
Body: 16px, leading-7 for prose; controls often 14px (text-sm)
Radius: 8px (--radius); input md = 6px
Shadow (card): 0 1px 2px 0 rgb(0 0 0 / 0.05)
```

### プロンプト例

```
Gunjo UI（app/globals.css トークン）に従い、ユーザー一覧テーブルを作成してください。
- ブランドのアクセント: primary 群青 #4D5AAF（リング・選択状態・群青 CTA に使用）/ accent 媚茶 #E8DDD3（温度のあるホバー・選択背景）
- 既定のプライマリボタン色が黒基調なら: 背景 #020817 / 文字 #f8fafc
- テーブル文字: 本文 #020817、補助 #64748b
- 区切り線: #e2e8f0
- 行のホバー: bg-muted (#f1f5f9) を検討
- フォント: Inter + 和文は OS ゴシックフォールバック
```
