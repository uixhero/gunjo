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

## Design Language（原則7本）

GunjoUI の見た目は、次の7本の原則で判定する（2026-10-07 決定）。言葉も合格の線もこの表が正で、判定の実装は `scripts/check-design-language.mjs`（`npm run design:verify:design-language`）。線を変えるときは、この表とスクリプトを同じ PR で変える。

| # | 原則 | 判定の方法 | 合格の線 |
|---|---|---|---|
| P1 | **群青は一つの値で、それが画面に出ている** | light の `--primary` の HSL を、ここに書いた群青 `232 39% 49%`（`#4D5AAF`）と比べる。あわせて、その色で塗られた要素が画面にあるかを数える | 色相 ±2°・彩度と明度 ±3%。5画面すべてで、群青で塗られた要素が1つ以上 |
| P2 | **どの画面の1画面目にも、群青の出自が1つ以上見える** | サイトのヘッダーとフッターを除いた1画面目（1440×900）に、明朝の文字・写真・「群青」の字・群青の言葉（群青・なりつつ・Becoming）のどれかがあるか | 5画面すべて × 明暗で1つ以上 |
| P3 | **中立色は既製の色と見分けがつく** | 地・文字・薄い面・控えめな文字・枠の5色 × 明暗＝10色と、既製の中立色（Tailwind slate の全段・shadcn/ui v3 slate・v4 neutral／slate）との色差 ΔE2000 の最小値 | 最小 ΔE ≥ 3 |
| P4 | **和文を前提に組む** | ① 本文の書体の並びに和文の書体名があるか ② 和文が20字以上ある段落の「行送り ÷ 字の大きさ」の中央値（行送りの指定が無い段落も、実際の1行の高さで測る） | ① 5画面 × 明暗で明示あり ② 全画面で 1.7 以上 |
| P5 | **区切りは面の濃淡で、影は浮くものだけに付ける** | 影の付いた要素の数。浮くもの（ダイアログ・メニュー・リストボックス・ツールチップとその中身）と、フォーカスの輪（ぼかし0・ずれ0）は数えない | 5画面 × 明暗で 0 |
| P6 | **角丸は2種類まで** | 画面に出ている角丸の値の種類（4隅とも数える。0 と丸＝999px 以上・円の 50% は除く） | 5画面 × 明暗を合わせて 2種類以下 |
| P7 | **数字は桁がそろう** | 数字だけの文字列（「129 / 223」「2026-05-26」など）のうち、`font-variant-numeric: tabular-nums` が効いている割合 | 5画面を合わせて 95% 以上 |

- **判定する画面**：トップ `/`・`/docs/introduction`・`/docs/components/data-table`・`/showcase`・`/patterns/dashboard/overview`。5画面で 7/7 になったら、1.0 の条件（[#1040](https://github.com/uixhero/gunjo/issues/1040)）の「見た目」は完成。
- **方向**：案1「紙と墨」。light の地は鳥の子 `44 42% 90%`（`#F0EADB`）。
- **動かし方**：`npm run build` のあとで `npm run design:verify:design-language`（ビルドを `next start` して10回読み込む）。`-- --strict` を付けると 7/7 でないときに落ちる（CI は `--strict` で回す＝5画面が 7/7 になった #1042 から）。`-- --self-test` は、原則ごとの「落ちる形」と「通る形」を検出器が見分けられるかの自己テスト。⛔ 本番（www.gunjo.jp）には向けない。
- ⚠️ P2 の「出自」は、いま GunjoUI にある要素から選んだもの。新しい固有の要素（独自のアイコンや図版など）を足すときは、検出の条件も足す。
- ⚠️ P3 の「既製の色」は Tailwind の slate と shadcn/ui の中立色だけ。zinc・gray・stone とは比べていない。

---

## 2. Color Palette & Roles

<!-- hex は `src/globals.css` :root の HSL から換算。意味づけは Tailwind のセマンティック色名に準拠 -->

### Primary（ブランドカラー — 群青 / Gunjō）

- **Primary** (`#4D5AAF`): `hsl(232 39% 49%)`（`--primary`）。アイコン・状態・チャート・選択表示など。becoming する青。
- **Primary subtle**: `--primary-subtle` / `--primary-subtle-foreground`。淡い選択面、インライン通知、補助ハイライト。
- **Primary strong**: `--primary-strong` / `--primary-strong-foreground`。主要 CTA と強い実行操作。
- **Primary border**: `--primary-border`。淡色面の枠線や選択境界。
- **Primary Dark mode** (`#909BDF` 相当): `hsl(232 55% 72%)`。墨の地（`#0E0F16`）の上での視認性のため明るくした群青。

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

中立色は案1「紙と墨」（2026-10-07・Design Language の P3）。light は鳥の子の地に墨の文字、dark は墨の地に生成りの文字。どれも Tailwind slate・shadcn/ui の中立色と ΔE2000 3 以上離してある。

- **Text Primary** (`#141724`・墨): `hsl(229 29% 11%)`（`--foreground`）。dark は `#EBE7E0`（`hsl(40 20% 90%)`）。
- **Text Secondary** (`#5B544D`): `hsl(30 8% 33%)`（`--muted-foreground`）。淡い面（`--muted`）の上でも AA を満たす補助テキスト。dark は `#B1AAA0`（`hsl(35 10% 66%)`）。
- **Text Disabled**: 単色トークンはなく、`disabled:opacity-50` 等で **前景色の 50% 不透明度** が一般的。
- **Border** (`#D5CEC2`): `hsl(38 18% 80%)`（`--border`）。平常時は面で区切るので、部品の枠は透明（ハイコントラストで戻る）。
- **Input** (`#7F756C`): `hsl(28 8% 46%)`（`--input`）。入力欄の縁。どの面の上でも 3:1 以上。
- **Background** (`#F0EADB`・鳥の子): `hsl(43 41% 90%)`（`--background`）。Design QA の紙 `#F5F3EF` と ΔE2000 5.35 離した地。dark は墨 `#0E0F16`（`hsl(228 22% 7%)`）。
- **Surface** (`#FCFCFA`): カード背景は `hsl(60 25% 98%)`（`--card`）、ポップオーバーは `#FDFDFC`（`--popover`）。地との段差だけで区切る。dark のカードは `#21242E`（`hsl(228 16% 15.5%)`）。

**Surface 上のテキスト補足**: `--primary-foreground` は `hsl(40 27% 98%)` → 実効 **`#FBFAF8`**（群青の上に載せるライト文字）。

---

## 3. Typography Rules

### 3.1 和文フォント

- **ゴシック体（本文）**: **Noto Sans JP**。gunjo.jp では `next/font/google` で取り込み、自分のオリジンから配信する（CSP `font-src 'self'` のまま読める）。欧文は Inter が先に当たり、和字だけが Noto Sans JP に落ちる。
- **明朝体（見出し）**: **Shippori Mincho**。gunjo.jp の `h1`〜`h3` はすべて明朝（Design Language の P2）。h1 は 700、h2・h3 は 500、字間 0.02em。
- ⚠️ 書体の並びと見出しの明朝は gunjo.jp のサイトの組み方（`app/globals.css`）で、`@gunjo/ui` の配布物（`dist/globals.css`）には入っていない。採用先で同じ組みにするときは、下の 3.3 の並びを自分の CSS に書く。

### 3.2 欧文フォント

- **サンセリフ**: **Inter**（`next/font/google` の `Inter`）。
- **セリフ**（標準では未使用）: プロジェクト側で指定するまで N/A。
- **等幅**: ドキュメント表などで `font-mono` を使用する場合、Tailwind プリセット（`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` 系）。

### 3.3 font-family 指定

`app/layout.tsx` で読み込んだ書体を、`app/globals.css` の `body` で並べる:

```css
/* 本文 */
font-family: var(--font-inter), var(--font-noto-sans-jp), "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", Meiryo, sans-serif;

/* 見出し（h1〜h3） */
font-family: var(--font-mincho), "Hiragino Mincho ProN", "Yu Mincho", serif;

/* 等幅（Tailwind font-mono 利用時のイメージ） */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

**フォールバックの考え方**:
- 和文は Inter の外なので Noto Sans JP に落ちる。Noto Sans JP の読み込みが終わるまでは、ヒラギノ角ゴ・游ゴシック・メイリオがつなぐ。
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

- **本文の行間 (line-height)**: gunjo.jp の段落（`p`）は **1.9**、字間 **0.02em**（Design Language の P4＝和文20字以上の段落は 1.7 以上）。部品やページの `leading-*` より後勝ちさせてある（`app/globals.css`）。
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

**数字は等幅（`tabular-nums`）が既定**（Design Language の P7）。`@gunjo/ui` の `body` に `font-variant-numeric: tabular-nums` を入れてある。文中で比例数字に戻すときは `proportional-nums` のクラスを付ける。

そのほかの機能はグローバルでは未設定。必要に応じて:

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

`src/components/inputs/ButtonVariants.ts` より（`--radius` = **0.125rem / 2px**）。

**Default（互換維持の強い標準操作）**

- Background: `hsl(var(--foreground))` → **`#141724`**（墨）
- Text: `hsl(var(--primary-foreground))` → **`#FBFAF8`**
- Hover: `bg-foreground/90`（**90% 不透明度**）
- Padding: `0.5rem 1rem`（**8px 16px**, `py-2 px-4`）
- Border Radius: **`2px`**（`rounded-[var(--radius)]`）
- Font Size: **`14px`**（`text-sm`）
- Font Weight: **`500`**（`font-medium`）
- Height: **`36px`**（`h-9`）
- Shadow: **なし**（`shadow` クラスは残っているが、`--shadow` は透明＝Design Language の P5）
- Focus: `ring-1` `ring` = `--ring`（プライマリと同色トーン）

**Primary / semantic variants**

- `variant="primary"`: `bg-primary-strong text-primary-strong-foreground`
- `variant="info"`: `bg-info-strong text-info-strong-foreground`
- `variant="success"`: `bg-success-strong text-success-strong-foreground`
- `variant="warning"`: `bg-warning-strong text-warning-strong-foreground`
- `variant="destructive"`: `bg-destructive-strong text-destructive-strong-foreground`

**Secondary（outline ではなく `secondary` variant）**

- Background: **`#E6E0D4`**（`--secondary`）
- Text: **`#141724`**（`--secondary-foreground`）
- Padding / Radius / Font: Default と同系

**Secondary（`outline` variant — ユーザ文脈のセカンダリに近い）**

- Background: **`transparent`**
- Text / Border: 境界 **`#D5CEC2`**（`border-border`）
- Hover: `bg-muted`（**`#DFD9CB`**）、文字は foreground
- Padding: 同上

### Inputs

`src/components/inputs/Input.tsx` の実装値（トークン `border` ではなく **Tailwind gray** を直接使用）。

- Background: **`transparent`**
- Border: **`1px solid #e5e7eb`**（`border-gray-200`）
- Border (dark): **`1px solid #1f2937`**（`dark:border-gray-800`）
- Border (focus ring): **`1px solid #030712`**（`focus-visible:ring-gray-950`、実質リング）
- Border Radius: **`0`**（`rounded-md` — `calc(var(--radius) - 2px)`。`--radius` が 2px なので 0 になる）
- Padding: **`0.25rem 0.75rem`**（`py-1 px-3`）
- Font Size: **`14px`**（`text-sm`）
- Height: **`36px`**（`h-9`）
- Placeholder: **`#6b7280`**（`placeholder:text-gray-500`）
- Disabled: **`opacity: 0.5`**

### Cards

`src/components/display/Card.tsx` より。

- Background: **`#FCFCFA`**（`bg-card`）
- Border: **透明の 1px**（`border-transparent`。ハイコントラストで `border-border` に戻る）。区切りは地 `#F0EADB` との段差
- Border Radius: **`0.125rem` / 2px**（`rounded-lg` = `var(--radius)`）
- Padding: **ヘッダー・フッター `24px`（`p-6`）**、コンテンツは `p-6 pt-0`
- Shadow: **なし**（`shadow-sm` → `--shadow-sm` は透明）

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

`src/globals.css` の `--shadow-*`（元は `design/tokens.pen`）。**影は浮くものだけに付ける**（Design Language の P5）＝静止した面（カード・ボタン・入力欄・枠の中の面）の段は透明で、区切りは面の濃淡が作る。

| Level | Shadow（light） | 用途 |
|-------|--------|------|
| none | `none` | フラット |
| sm | `0 0 #0000`（透明） | 静止した面。クラスは残してあるが影は出ない |
| 1 (base) | `0 0 #0000`（透明） | 同上 |
| 2 (md) | `0 2px 10px -2px hsl(30 20% 20% / 0.12)` | ドロップダウン・ツールチップ |
| 3 (lg) | `0 8px 24px -8px hsl(30 20% 20% / 0.18)` | ポップオーバー・メニュー |
| 4 (xl) | `0 12px 32px -10px hsl(30 20% 20% / 0.2)` | ダイアログ |
| 5 (2xl) | `0 20px 48px -16px hsl(30 20% 20% / 0.25)` | 強い浮遊 |
| inner | `0 0 #0000`（透明） | へこみ表現は使わない |

- 透明の段を `none` ではなく `0 0 #0000` にしているのは、`ring-*`（フォーカスの輪）と同じ `box-shadow` に重ねたときに、輪まで消えないようにするため（`none` は重ねると宣言ごと無効になる）。
- 影の色は黒ではなく、墨に寄せた茶（`hsl(30 20% 20%)`）。dark は同じ形で `hsl(228 40% 2% / 0.5〜0.7)`。

-------|--------|------|
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
- 角丸は **2種類まで**（Design Language の P6）。`rounded-lg`・`rounded-xl`・`rounded-2xl`・`rounded-3xl` は 2px、`rounded-md`・`rounded-sm` は 0。値を直書きした角丸（`rounded-[3px]` のような任意値）を足さない。
- 影は **浮くもの（ダイアログ・メニュー・ツールチップ）だけ**（P5）。カード・ボタン・枠の中の面には付けず、地との段差で区切る。
- 日本語の長文では **行間を広め**（例: `leading-7` 以上）に保つ。
- コントラストは WCAG AA を意識し、**補助テキストは `muted-foreground`** を使う。

### Don't（禁止）

- **デフォルト Button が `--primary` ではない**ことを誤解しない。青い CTA は `variant="primary"` を使う。
- Input は `border-input` / `ring-ring` / `aria-invalid:border-destructive-border` に揃える。
- 日本語本文に **`leading-none` を本文ブロックに流用**しない（`CardTitle` 専用の短い見出し向け）。
- **純黒 `#000000` 一色**を背景・文字に使わない（Gunjo は **墨 `#141724` の foreground**）。
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
