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

アクセシビリティのために **Radix UI** を、スタイリングに **Tailwind CSS** を採用。npm パッケージ **\`@gunjo/ui\`** として配布（現在 early alpha = \`0.0.1-alpha.2\`、1.0 stable 前は API が変更される可能性あり）。

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

> **alpha 段階の注意**：\`0.0.1-alpha.x\` はドライラン採用向け公開。\`1.0.0\` stable 前は API が変わる可能性があります。

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

### この先

Dark mode（\`next-themes\`）、Vite 個別の調整、フォント設定、既存アプリへの段階移行は [採用ガイド](/docs/adoption) に。トークンの上書きは [テーマ](/docs/theming) を参照。`,
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
