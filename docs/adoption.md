# Adoption Guide

GunjoUI を他の Next.js / React プロジェクトに導入する手順。**5 分で Button が画面に出るところ** までを目標にしています。

## 前提

採用先プロジェクトは以下を満たしている：

- Node.js 20 以上
- **React 19 以上**（peer は `^19.0.0` のみ。React 18 は未サポート）
- Tailwind CSS v3 または v4（peer 宣言通り）
- TypeScript（推奨。`@gunjo/ui` は TS ソースを直接配布するため、後述の `transpilePackages` 設定が必須）
- Next.js 15+（推奨 16）または Vite + React

詳細は [dependencies.md](./dependencies.md) 参照。配布形態の方針は [adoption-strategy.md](./adoption-strategy.md) 参照。

## 5 分インストール

### 1. パッケージ追加

`0.0.1-alpha.0` から **`@gunjo/ui`** として npm に publish 済。alpha 段階のため API は変わり得るが、ドライラン採用は可：

```bash
# npm から（推奨、0.0.1-alpha.0 以降）
npm install @gunjo/ui

# 開発中（手元の clone を直接使う場合）
npm install file:../gunjo            # 相対パス推奨
# あるいは絶対パス
npm install /absolute/path/to/gunjo
```

> **alpha 段階の注意**：`1.0.0` stable 前は API が変わる可能性あり。本格採用は `0.x` シリーズでのドライラン後に判断推奨。バージョン履歴は [CHANGELOG.md](../CHANGELOG.md)。

### 2. Next.js 設定（必須）

`@gunjo/ui` は **TypeScript ソースを直接配布** している（`main: "src/index.ts"`）ため、採用先の Next.js でトランスパイルが必要。`next.config.ts`：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gunjo/ui"],
};

export default nextConfig;
```

これを忘れると採用先のビルドが `SyntaxError: Unexpected token` 等で落ちる。Vite の場合は `optimizeDeps.include: ["@gunjo/ui"]` を `vite.config.ts` に追加。

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
    "./node_modules/@gunjo/ui/src/**/*.{ts,tsx}", // GunjoUI のクラスもスキャン
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
@source "../node_modules/@gunjo/ui/src/**/*.{ts,tsx}";
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

> **⚠️ Turbopack dev の注意:** Next.js 16 + Turbopack の `npm run dev` では、CSS 内の **bare specifier `@import "@gunjo/ui/styles";` が解決できず全ルートが 500** になることがある（`CssSyntaxError: Can't resolve '@gunjo/ui/styles'`。`npm run build` は成功する dev 限定の挙動）。その場合は **下の `app/layout.tsx` で JS として `import "@gunjo/ui/styles";` する形（推奨）**、または CSS 側を相対パス `@import "../node_modules/@gunjo/ui/src/globals.css";` にして回避する。

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

## Dark Mode 有効化

GunjoUI は CSS variables ベースで、`html` または `body` に `class="dark"` を付けるだけで全コンポーネントが dark token に切り替わる。`next-themes` などのライブラリと組み合わせるのが定番：

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

トグル UI のサンプルは GunjoUI 本体の `app/components/layout/ThemeToggle.tsx` 参照（ただしこれは docs サイト用で配布物には含まれない）。

> **L3 段階の注記**：dark mode 全 70 コンポーネントの目視通しキャプチャは未取得。docs サイト（`npm run dev` → `:13030`）でトグル切替して目視確認することを推奨。

> **next-themes について**：`next-themes` は本パッケージの `dependencies` に含まれているため、採用先で transitive に解決される。明示インストールしなくても import 可能だが、採用先で peer-managed 化したい場合は `npm install next-themes` を別途実行してもよい。

## フォント前提

GunjoUI のテキスト系コンポーネントは `Inter` を `fontFamily` に指定している。

- **Next.js**：`next/font/google` の `Inter` を root layout で読み込めば OK
- **その他**：採用先の CSS で `@import url('https://fonts.googleapis.com/css2?family=Inter...')` を読む

和文（日本語）は GunjoUI 側で OS フォールバック前提。明示したい場合は採用先の CSS で `font-family: Inter, "Hiragino Sans", "Yu Gothic UI", sans-serif;` などを設定。

## トラブルシューティング

### `SyntaxError: Unexpected token` でビルドが落ちる

採用先の `next.config.ts` に `transpilePackages: ["@gunjo/ui"]` を入れ忘れている。本パッケージは TS ソースを直接配布しているため、Next.js 側でのトランスパイル指定が必須（[§2 Next.js 設定](#2-nextjs-設定必須)）。

### Tailwind クラスが効かない

v3 の場合は `tailwind.config.ts` の `content` に `node_modules/@gunjo/ui/src/**/*.{ts,tsx}` を入れ忘れている可能性が高い。v4 の場合は `@source` ディレクティブで同等のパスを指す必要がある。Tailwind は採用先のクラス出現箇所しかスキャンしないため、library のクラスも明示する必要がある。

### 色が真っ黒・真っ白

`@gunjo/ui/styles` の import が抜けている、または順序が `@import "tailwindcss"` の **後** にきていない。CSS variables が定義されていないと `bg-background` などのクラスが空になる。

### Tailwind v4 で動かない

本リポジトリの docs サイトは v4 + Next 16 で稼働確認済（[dependencies.md](./dependencies.md#テスト済み組み合わせ) の ✅ 行）。v4 で問題が出る場合は最初に `@config` のパス解決を疑う（採用先の `globals.css` から見た相対パスが正しいか）。それでもだめなら issue で報告。

## 次のステップ

- 既存アプリへの段階移行：[migration-playbook.md](./migration-playbook.md)
- 新規コンポーネントを足したい：[component-addition.md](./component-addition.md)
- バージョンアップ時の注意：[versioning.md](./versioning.md)
