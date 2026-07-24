import type { DocContent, SectionLabels } from "./types";
import { componentContentJa } from "./component-content-ja";

export const sectionLabelsJa: SectionLabels = {
  props: "プロパティ",
  usage: "使い方",
  preview: "プレビュー",
  code: "コード",
  viewDocumentation: "ドキュメントを見る",
  openExample: "例を開く",
  fullScreen: "全画面",
  examples: "例",
  usedComponents: "使用コンポーネント:",
  relatedComponents: "関連コンポーネント:",
  copySpecForAi: "AI用仕様をコピー",
  copied: "コピー済み",
  copyFailed: "コピーに失敗しました",
};

export const contentJa: Record<string, DocContent> = {
  introduction: {
    title: "はじめに",
    description: "データ密度の高いアプリ向けの SSOT 駆動 React + Tailwind デザインシステム。200+ コンポーネントを Pen / source / docs の3軸で検証。",
    body: `GunjoUI は単一のソース・オブ・トゥルースを起点に構築されています。デザイントークンとコンポーネントバリアントは \`.pen\` デザインファイルを元に TypeScript 実装、仕様 JSON、ドキュメント登録へ同期され、すべてのプリミティブが Pen / source / docs の3軸で検証されます。ページ全体を \`.pen\` から完全自動生成するのではなく、設計データと実装・ドキュメントのずれを同期と検証で抑える仕組みです。

アクセシビリティのために **Radix UI** を、スタイリングに **Tailwind CSS** を採用。npm パッケージ **\`@gunjo/ui\`** として配布（現在 beta = \`0.1.0-beta.1\`、1.0 stable 前は API が変更される可能性あり）。

### 採用モード

どこまで「自分で持つ」かに応じて、2通りの使い方ができます：

- **依存としてインストール**（推奨） — \`npm install @gunjo/ui\`。semver で更新を受け取り、安定後はバージョン固定。
- **コピー＆ペースト** — props 越えのカスタマイズが必要なときは、特定コンポーネントを自分のリポジトリに取り込めます。どちらにせよ、コードはあなたのもの。

合うほうを選んでください。npm 経由のほうが早く、コピー経由のほうが完全な自由度が得られます。`,
  },
  installation: {
    title: "インストール",
    description: "既存の Next.js / Vite + React プロジェクトに @gunjo/ui を導入する手順。",
    body: `### 前提

- Node.js 20 以上
- React 19 以上（peer は \`^19.0.0\` のみ。React 18 は未サポート）
- Tailwind CSS v3 または v4
- TypeScript 推奨（本パッケージは TS ソースを直接配布しているため、後述の \`transpilePackages\` 設定が必須）
- Next.js 15 以上（推奨 16）または Vite + React

### 1. パッケージを追加

\`\`\`bash
npm install @gunjo/ui
\`\`\`

> **beta 段階の注意**：\`0.1.0-beta.x\` はドライラン採用向け公開。\`1.0.0\` stable 前は API が変わる可能性があります。

#### アイコン（\`icon\` prop を使うならインストール）

Gunjo のコンポーネントはアイコンを \`ReactNode\` として受け取るだけで、グリフ自体は同梱しません。本ドキュメントのアイコン例はすべて [\`@tabler/icons-react\`](https://tabler.io/icons) を使っているので、アイコンを渡すなら**直接の依存**として入れてください：

\`\`\`bash
npm install @tabler/icons-react
\`\`\`

> npm のデフォルト hoisting では、この行が無くても \`import { IconX } from "@tabler/icons-react"\` が Gunjo UI 側のコピー経由で解決されることがあります。ただし **pnpm** や strict / \`nohoist\` の npm では壊れます。hoisting に依存しないよう、自分でインストールしてください。

### 2. Next.js 設定（必須）

\`@gunjo/ui\` は **TypeScript ソースを直接配布** しているため（\`main: "src/index.ts"\`）、採用先 Next.js でトランスパイルが必要です。\`next.config.ts\`：

\`\`\`ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gunjo/ui"],
};

export default nextConfig;
\`\`\`

これを忘れると採用先のビルドが \`SyntaxError: Unexpected token\` で落ちます。Vite の場合は \`optimizeDeps.include: ["@gunjo/ui"]\` を \`vite.config.ts\` に追加してください。

### 3. Tailwind プリセットを取り込む

#### Tailwind v4（推奨）

\`app/globals.css\`：

\`\`\`css
@import "tailwindcss";
@config "../node_modules/@gunjo/ui/tailwind-preset.js";
@source "../node_modules/@gunjo/ui/src/**/*.{ts,tsx}";
@import "@gunjo/ui/styles";
\`\`\`

\`@source\` で GunjoUI 内部のクラスをスキャン対象に追加します（これが無いと Tailwind がライブラリ側のクラスを knwon にできません）。

#### Tailwind v3

\`tailwind.config.ts\`：

\`\`\`ts
import type { Config } from "tailwindcss";
import gunjoPreset from "@gunjo/ui/tailwind-preset";

const config: Config = {
  presets: [gunjoPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@gunjo/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
\`\`\`

トークン CSS は \`app/globals.css\` で（Tailwind directives の **後** に）一度 import：

\`\`\`css
@import "@gunjo/ui/styles";
\`\`\`

### 4. コンポーネントを使う

\`app/page.tsx\`：

\`\`\`tsx
import { Button, Card, CardHeader, CardContent } from "@gunjo/ui";

export default function Page() {
  return (
    <main className="p-8">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Gunjo UI が動いている</h2>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </CardContent>
      </Card>
    </main>
  );
}
\`\`\`

\`npm run dev\` でボタンが GunjoUI のスタイルで表示されれば成功。

### トラブルシューティング

- **\`SyntaxError: Unexpected token\` でビルドが落ちる** → \`next.config.ts\` の \`transpilePackages\` 入れ忘れ（手順 2）。
- **Tailwind クラスが効かない** → v4 の \`@source\` または v3 の \`content\` で \`node_modules/@gunjo/ui/src/**/*\` を指していない。
- **画面が真っ黒・真っ白** → \`@import "@gunjo/ui/styles"\` が抜けている、または \`@import "tailwindcss"\` の **前** にきている。
- **アイコンの import が失敗する（\`Cannot find module '@tabler/icons-react'\`。pnpm だけで出ることが多い）** → \`@tabler/icons-react\` を直接の依存として入れる（手順1）。Gunjo UI は内部で使っていますが、グリフを re-export していません。

### この先

Dark mode（\`next-themes\`）、Vite 個別の調整、フォント設定、既存アプリへの段階移行は [採用ガイド](/docs/adoption) に。トークンの上書きは [テーマ](/docs/theming) を参照。`,
  },
  "no-npm": {
    title: "npm が使えない環境で使う",
    description: "Claude Artifact など npm・CDN 不可の自己完結 HTML 環境で、tokens.css を使って GunjoUI ルックの画面を組む方法。",
    body: `Claude Artifact、ChatGPT Canvas、メール内 HTML、コードサンドボックスなど、**npm も CDN も使えない自己完結 HTML 環境**では \`@gunjo/ui\` をインストールできません。この環境向けに、GunjoUI はデザイントークンを **Tailwind 非依存の純 CSS** として固定 URL で配布しています。

\`\`\`
https://www.gunjo.jp/tokens.css
\`\`\`

パッケージと同じソース・オブ・トゥルースから生成しているため、値は \`@gunjo/ui\` 本体と常に一致します。

### 1. tokens.css を取り込む

自己完結 HTML では外部 CSS を読み込めないことが多いため、**内容をコピーして \`<style>\` に貼る**のが基本です：

\`\`\`html
<style>
/* https://www.gunjo.jp/tokens.css の内容をここに貼る */
</style>
\`\`\`

AI エージェントなら URL を fetch して同じことができます。外部リソースの読み込みが許される環境（通常の静的サイトなど）では \`<link>\` でも構いません：

\`\`\`html
<link rel="stylesheet" href="https://www.gunjo.jp/tokens.css">
\`\`\`

### 2. トークンの読み方

値は \`H S% L%\` の HSL トリプレットです（[テーマ](/docs/theming) と同じ規約）。使うときは \`hsl()\` で包み、透明度は slash 記法で合成します：

\`\`\`css
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}
.button-primary:hover {
  background: hsl(var(--primary) / 0.9);
}
\`\`\`

セマンティックトーンは 5 色（\`primary\` / \`info\` / \`success\` / \`warning\` / \`destructive\`）。各色に \`subtle\`（淡い背景）・base（標準）・\`strong\`（濃い強調）の 3 段と専用の \`border\` があり、背景に \`-subtle\` を使ったらその上の文字は \`-subtle-foreground\`、のように対で使います。詳細は [セマンティックトーン](/docs/semantic-tones) を参照してください。

影（\`--shadow-*\`）はそのまま \`box-shadow\` に、\`--duration-*\` と \`--ease-*\` は \`transition\` に使えます。

### 3. ダークモード

\`<html class="dark">\` または \`<html data-theme="dark">\` で切り替わります。OS 設定に追従させる場合は \`<head>\` に 1 行：

\`\`\`html
<script>if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark")</script>
\`\`\`

### サンプル：カード 1 枚

トークンを貼ったあと、このまま \`<body>\` に貼れば GunjoUI ルックのカードが表示されます：

\`\`\`html
<style>
.demo-card {
  max-width: 360px;
  padding: 24px;
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}
.demo-badge {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  background: hsl(var(--success-subtle));
  color: hsl(var(--success-subtle-foreground));
  border: 1px solid hsl(var(--success-border));
  border-radius: 9999px;
}
.demo-button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: calc(var(--radius) - 2px);
  cursor: pointer;
}
.demo-button:hover { background: hsl(var(--primary) / 0.9); }
</style>

<div class="demo-card">
  <span class="demo-badge">稼働中</span>
  <h2 style="margin: 12px 0 4px; font-size: 18px;">今月の予約</h2>
  <p style="margin: 0 0 16px; font-size: 14px; color: hsl(var(--muted-foreground));">
    前月より 12 件増えています。
  </p>
  <button class="demo-button">詳細を見る</button>
</div>
\`\`\`

### 基本パターンも「貼るだけ」で使う（patterns.css）

トークンの上に、よく使う部品の見た目を \`gj-\` クラスとしてまとめた **patterns.css** も配布しています。tokens.css の**あとに**貼れば、card / stat tile / badge / button / form / table / tabs / timeline / gantt / meter が GunjoUI ルックで使えます。

\`\`\`
https://www.gunjo.jp/patterns.css
\`\`\`

\`\`\`html
<span class="gj-badge gj-badge--ok">稼働中</span>
<button class="gj-btn gj-btn--primary">保存</button>

<div class="gj-card gj-card--bar gj-card--bar-ok">
  <h2 class="gj-card__title">今月の予約</h2>
  <p class="gj-card__desc">前月より 12 件増えています。</p>
</div>
\`\`\`

状態は \`ok\`（稼働・成功）・\`warn\`（注意）・\`crit\`（危険）の 3 系統で統一しています。gantt（期間バー＋今日線＋マイルストーン）や timeline など、業務画面のプリミティブも含みます。

### まとめて開ける単一ファイル（starter.html）

tokens.css・patterns.css・デモ画面を 1 ファイルに詰めた **starter.html** もあります。開けば全部品の見本が見られ、コピーすれば動く土台になります。

\`\`\`
https://www.gunjo.jp/starter.html
\`\`\`

### AI に指示する場合

そのまま使える指示文の例：

> npm・CDN が使えない環境では、@gunjo/ui の代わりに https://www.gunjo.jp/tokens.css のデザイントークンと https://www.gunjo.jp/patterns.css のパターンクラスを \`<style>\` に貼り、\`gj-\` クラスと \`hsl(var(--トークン名))\` 記法で GunjoUI ルックを再現してください。見本は https://www.gunjo.jp/starter.html にあります。

### この方法で得られるもの・得られないもの

tokens.css / patterns.css が持つのは**トークンと見た目（色・角丸・影・モーション・基本パターンの CSS）**だけです。コンポーネントの実装（アクセシビリティ対応、キーボード操作、状態管理）は含まれません。tabs のパネル切替のような挙動には別途 JavaScript が要ります（starter.html に最小例あり）。npm が使える環境では [\`@gunjo/ui\` 本体のインストール](/docs/installation) を使ってください。`,
  },
  theming: {
    title: "テーマ",
    description: "Gunjo UI の CSS 変数を上書きしてシステムをカスタマイズする。",
    body: `Gunjo UI はカラー・角丸・影・モーションのすべてを CSS 変数として公開しています。自分の \`:root\` または \`.dark\` ブロックで値を変えれば、全コンポーネントがそれを拾います ── Tailwind の再ビルドも fork も不要。

### 規約

変数は kebab-case、値は \`H S% L%\` の HSL トリプレット（\`hsl()\` ラッパーなし）。これにより Tailwind 側で透明度を合成できます（\`hsl(var(--primary) / 0.5)\`）。

コンポーネントが実際に消費する **セマンティックトークン** は対で定義されています：

- \`--background\` / \`--foreground\` ── ページ表面とメインテキスト
- \`--card\` / \`--card-foreground\` ── Card 表面とテキスト
- \`--popover\` / \`--popover-foreground\` ── 浮遊サーフェス（Tooltip / Popover / DropdownMenu）
- \`--primary\` / \`--primary-foreground\` ── 群青ブルーと、その上に乗るテキスト
- \`--secondary\` / \`--secondary-foreground\` ── 控えめなサーフェスとテキスト
- \`--muted\` / \`--muted-foreground\` ── 背景とサブテキスト
- \`--accent\` / \`--accent-foreground\` ── 媚茶ティントの hover / selection
- \`--destructive\` / \`--destructive-foreground\` ── エラー / 危険操作
- \`--border\` / \`--input\` / \`--ring\` ── 枠線とフォーカス
- \`--radius\` ── 基本ボーダー半径

### ブランド・アトモスフィアトークン

これらは **テーマ非依存**（dark mode で反転しない）── 群青と媚茶のブランドアイデンティティをモードを跨いで保つために、ホームヒーローと色のストーリー演出だけが消費します：

- \`--gunjo-deep / -deeper / -deepest / -light / -mid / -bright / -dark\` ── 群青パレット
- \`--kobicha-warm / -mid / -bright / -deepest\` ── 媚茶パレット
- \`--pure-white\`, \`--pure-black\`

### デフォルト（ライトモード）

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 240 20% 6%;

  --card: 0 0% 100%;
  --card-foreground: 240 20% 6%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 20% 6%;

  --primary: 220 62% 49%;            /* 群青 */
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96%;
  --secondary-foreground: 240 6% 10%;

  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  --accent: 29 31% 87%;              /* 媚茶ティント */
  --accent-foreground: 14 22% 19%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;

  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 220 62% 49%;

  --radius: 0.5rem;
}
\`\`\`

### ダークモード上書き

\`\`\`css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 218 68% 63%;            /* 暗い背景でコントラストを得るため少し明るめの群青 */
  --primary-foreground: 220 60% 8%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 14 22% 19%;
  --accent-foreground: 29 31% 87%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 218 68% 63%;
}
\`\`\`

シャドウ・モーションを含む完全なリストは \`src/globals.css\` にあり、\`design/tokens.pen\` から自動生成されています。上書きは、採用先の \`globals.css\` で \`@import "@gunjo/ui/styles"\` の **後** に変数を再宣言してください。`,
  },
  colors: {
    title: "色",
    description: "色は Brand、Neutral、Semantic のパレットに分かれています。",
  },
  typography: {
    title: "タイポグラフィ",
    description: "見出し、段落、リストなどのスタイル。",
  },
  spacing: {
    title: "余白",
    description: "マージン、パディング、レイアウト用の一貫した余白スケール。",
  },
  shadows: {
    title: "影",
    description: "立体感や深さのための影トークン。",
  },
  radius: {
    title: "角丸",
    description: "角丸用のボーダー半径トークン。",
  },
  animation: {
    title: "アニメーション",
    description: "トランジション用の時間とイージングのトークン。",
  },
  components: {
    title: "コンポーネント",
    description:
      "リッチなデスクトップクラスの Web アプリを構築するためのプリビルトコンポーネント集。@gunjo/ui としてインストールするか、必要に応じて個別のプリミティブをコピーして取り込みます ── トレードオフは「はじめに」を参照。",
  },
  ...componentContentJa,
};
