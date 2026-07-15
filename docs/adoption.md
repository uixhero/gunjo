# Adoption Guide

GunjoUI を他の Next.js / React プロジェクトに導入する手順。**5 分で Button が画面に出るところ** までを目標にしています。

## 前提

採用先プロジェクトは以下を満たしている：

- Node.js 20 以上
- **React 19 以上**（peer は `^19.0.0` のみ。React 18 は未サポート）
- Tailwind CSS v3 または v4（peer 宣言通り）
- TypeScript（推奨。型定義 `.d.ts` を同梱）
- Next.js 15+（推奨 16）または Vite + React

詳細は [dependencies.md](./dependencies.md) 参照。配布形態の方針は [adoption-strategy.md](./adoption-strategy.md) 参照。

## 5 分インストール

### 1. パッケージ追加

`0.0.1-alpha.0` から **`@gunjo/ui`** として npm に publish 済（現在は `0.1.0-beta.x`）。beta 段階（1.0 前）のため API は変わり得るが、ドライラン採用は可：

```bash
# npm から（推奨、0.0.1-alpha.0 以降）
npm install @gunjo/ui

# 開発中（手元の clone を直接使う場合）
npm install file:../gunjo            # 相対パス推奨
# あるいは絶対パス
npm install /absolute/path/to/gunjo
```

> **alpha 段階の注意**：`1.0.0` stable 前は API が変わる可能性あり。本格採用は `0.x` シリーズでのドライラン後に判断推奨。バージョン履歴は [CHANGELOG.md](../CHANGELOG.md)。

### 2. ビルド設定（不要）

`@gunjo/ui` は **コンパイル済みの ESM + 型定義を `dist/` から配布** している（`exports "." → ./dist/index.js`、各コンポーネントの `"use client"` 境界も保持）。そのため **`transpilePackages` は不要**で、`npm install` してそのまま import できる（Next.js / Vite いずれも追加設定なし）。

> 旧 alpha（`main: "src/index.ts"` で生 TS を配布していた頃）は `transpilePackages: ["@gunjo/ui"]` が必須だった。dist 配布化以降は削除してよい。

### 3. Tailwind プリセット取り込み

採用先の Tailwind 系統で手順が分岐する。

#### 3a. Tailwind v3 を使っている場合

`tailwind.config.ts`：

```ts
import type { Config } from "tailwindcss";
import gunjoPreset from "@gunjo/ui/tailwind-preset";

const config: Config = {
  presets: [gunjoPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@gunjo/ui/dist/**/*.js", // GunjoUI のクラスもスキャン（コンパイル済み dist）
  ],
};

export default config;
```

#### 3b. Tailwind v4 を使っている場合

v4 は `tailwind.config.ts` ベースではなく CSS の `@theme` ベース。`@gunjo/ui/tailwind-preset` をそのまま CSS から `@config` で読み込む方式が最も簡単：

```css
/* app/globals.css */
@import "tailwindcss";
@config "../node_modules/@gunjo/ui/tailwind-preset.js";
@source "../node_modules/@gunjo/ui/dist/**/*.js";
@import "@gunjo/ui/styles";  /* 次節 4 でも触れる token 定義 */
```

`@source` で GunjoUI 内部のクラスをスキャン対象に追加する。`@config` を使わずに直接 `@theme` ブロックを書きたい場合は、`@gunjo/ui/tailwind-theme-extend` から token map を取り出して手で写経する形になる（メンテ負担が大きいので非推奨）。

### 4. グローバル CSS 取り込み

採用先の `app/globals.css`（Next.js App Router の場合）：

```css
@import "tailwindcss";          /* v4。v3 なら従来の @tailwind directives */
@import "@gunjo/ui/styles";        /* GunjoUI のトークン定義 */
```

> v4 採用で前節 3b の `@config` を使った場合は、`@import "@gunjo/ui/styles";` がその CSS 内に既にあるはずなのでここは重複させない。

`create-next-app` が生成する `:root { --background; --foreground; }` や `@theme inline` の既定トークンブロックが残っている場合は、GunjoUI の token と競合しないように削除するか `@gunjo/ui/styles` の定義へ置き換える。

> **⚠️ Turbopack dev の注意:** Next.js 16 + Turbopack の `npm run dev` では、CSS 内の **bare specifier `@import "@gunjo/ui/styles";` が解決できず全ルートが 500** になることがある（`CssSyntaxError: Can't resolve '@gunjo/ui/styles'`。`npm run build` は成功する dev 限定の挙動）。その場合は **下の `app/layout.tsx` で JS として `import "@gunjo/ui/styles";` する形（推奨）**、または CSS 側を相対パス `@import "../node_modules/@gunjo/ui/dist/globals.css";` にして回避する。

または `app/layout.tsx`：

```tsx
import "@gunjo/ui/styles";
import "./globals.css";
```

### 5. 最初のコンポーネント

`app/page.tsx`：

```tsx
import { Button, Card, CardHeader, CardContent } from "@gunjo/ui";

export default function Page() {
  return (
    <main className="p-8">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">GunjoUI が動いている</h2>
        </CardHeader>
        <CardContent>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </CardContent>
      </Card>
    </main>
  );
}
```

`npm run dev` で `Button` が GunjoUI のスタイルで表示されれば成功。

## Server Components と関数prop（RSC）

一部のコンポーネントは **関数の prop**（`formatValue` / `formatTime` / `renderCard` / `renderNode` など）を受け取る。これらを **Server Component から直接渡すと `next build` が失敗する**：

```
Error: Functions cannot be passed directly to Client Components
unless you explicitly expose it by marking it with "use server".
```

これは React の制約で、関数はサーバー→クライアント境界をまたげないため。`tsc --noEmit` も `next dev` も気づかず、**`next build`（本番ビルド）だけが検出する**ので、最初の本番ビルドで初めて踏みがち。

**対処（いずれか）**

1. **既定のまま使う** — 関数 prop を渡さなければどのコンポーネントも RSC で安全に描画できる（既定パスはサーバー安全）。
2. **シリアライズ可能な代替を使う** — 数値整形の主要コンポーネントは、関数の代わりに `valueFormat`（`"number" | "compact" | "integer"` または `Intl.NumberFormatOptions`）を受け取る。これは serializable なので Server Component から渡せる：

   ```tsx
   // Server Component — OK（関数ではなく serializable な指定）
   <PieChart segments={data} valueFormat="compact" />
   <GaugeChart value={72} valueFormat={{ style: "currency", currency: "JPY" }} />
   ```

3. **クライアント境界で包む** — 関数整形や JSX を返したい場合は、`"use client"` を付けた薄いラッパーに切り出し、そこから関数 prop を渡す：

   ```tsx
   "use client";
   import { PieChart } from "@gunjo/ui";
   export function RevenuePie({ data }: { data: { label: string; value: number }[] }) {
     return <PieChart segments={data} formatValue={(n) => `¥${n.toLocaleString()}`} />;
   }
   ```

> どのコンポーネントが関数 prop を持つかは各コンポーネントの docs（Props 表）で確認できる。`valueFormat` 等の serializable 代替は順次追加中（[#576](https://github.com/uixhero/gunjo/issues/576)）。

## Dark Mode 有効化

GunjoUI は CSS variables ベースで、`html` または `body` に `class="dark"` を付けるだけで全コンポーネントが dark token に切り替わる。採用先で `next-themes` などのライブラリと組み合わせる場合は、採用先プロジェクトに明示的に追加する：

```bash
npm install next-themes
```

`app/layout.tsx`：

```tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

GunjoUI 本体には `ThemeProvider` / `ThemeToggle` も含まれているため、外部ライブラリを使わずに GunjoUI の `.dark` class 管理だけで始めることもできる。

> **L3 段階の注記**：dark mode 全 70 コンポーネントの目視通しキャプチャは未取得。docs サイト（`npm run dev` → `:13030`）でトグル切替して目視確認することを推奨。

## フォント前提

GunjoUI のテキスト系コンポーネントは `Inter` を `fontFamily` に指定している。

- **Next.js**：`next/font/google` の `Inter` を root layout で読み込めば OK
- **その他**：採用先の CSS で `@import url('https://fonts.googleapis.com/css2?family=Inter...')` を読む

和文（日本語）は GunjoUI 側で OS フォールバック前提。明示したい場合は採用先の CSS で `font-family: Inter, "Hiragino Sans", "Yu Gothic UI", sans-serif;` などを設定。

## トラブルシューティング

### `SyntaxError: Unexpected token` でビルドが落ちる

`0.0.1-alpha.2` 以前の生 TS 配布版を掴んでいる可能性が高い。最新版はコンパイル済み `dist/` を配布しており `transpilePackages` 不要（[§2 ビルド設定](#2-ビルド設定不要)）。パッケージを更新するか、旧版なら `next.config.ts` に `transpilePackages: ["@gunjo/ui"]` を追加する。

### Tailwind クラスが効かない

v3 の場合は `tailwind.config.ts` の `content` に `node_modules/@gunjo/ui/dist/**/*.js` を入れ忘れている可能性が高い。v4 の場合は `@source` ディレクティブで同等のパスを指す必要がある。Tailwind は採用先のクラス出現箇所しかスキャンしないため、library のクラスも明示する必要がある。

### 色が真っ黒・真っ白

`@gunjo/ui/styles` の import が抜けている、または順序が `@import "tailwindcss"` の **後** にきていない。CSS variables が定義されていないと `bg-background` などのクラスが空になる。

### Tailwind v4 で動かない

本リポジトリの docs サイトは v4 + Next 16 で稼働確認済（[dependencies.md](./dependencies.md#テスト済み組み合わせ) の ✅ 行）。v4 で問題が出る場合は最初に `@config` のパス解決を疑う（採用先の `globals.css` から見た相対パスが正しいか）。それでもだめなら issue で報告。

### `Functions cannot be passed directly to Client Components` でビルドが落ちる

Server Component から関数 prop（`formatValue` 等）を渡している。`tsc` / `next dev` は通り `next build` だけが落ちる。[§ Server Components と関数prop](#server-components-と関数proprsc) の対処（`valueFormat` を使う／`"use client"` ラッパーで包む）を参照。

## 次のステップ

- 既存アプリへの段階移行：[migration-playbook.md](./migration-playbook.md)
- 新規コンポーネントを足したい：[component-addition.md](./component-addition.md)
- バージョンアップ時の注意：[versioning.md](./versioning.md)
