# Migration Playbook

既存の Next.js / React アプリを段階的に GunjoUI へ移行するためのプレイブック。`workflow` と `Bannalyze` を最初の採用候補として念頭に書いてある。

## 全体方針

**「全置換」ではなく「低リスクな土台から順に段階置換」**。トークン → Tailwind preset → Inputs → Display / Feedback → Navigation / Overlay の順で置き換え、各段階の終わりに視覚回帰を確認する。途中で問題が出たら直前の段階にロールバックできる構造を維持する。

> **前提**：本プレイブックは [adoption.md](./adoption.md) の §1（パッケージ追加）と §2（`transpilePackages` 設定）が完了している状態から始める。未完なら先に adoption.md の手順を踏むこと。

## ステージ概要

| Stage | 範囲 | 期待される視覚変化 | ロールバック |
|---|---|---|---|
| ① トークン CSS 差替 | `globals.css` の token 部 | 色・spacing が GunjoUI 値に | git revert globals.css |
| ② Tailwind preset 適用 | `tailwind.config.ts` | utility class の解釈変更 | preset 配列から外す |
| ③ Inputs 置換 | Button, Input, Select | 入力・操作系が GunjoUI 表現に | import を旧実装に戻す |
| ④ Display / Feedback 置換 | Card, Table, Badge, Toast | 表示・通知系の枠/影/間隔 | 同上 |
| ⑤ Navigation / Overlay 置換 | AppRail, Dialog, ShareModal | 画面構造・重なり UI が置換 | 同上 |

各 Stage は **PR 単位で独立**、視覚レビューを通してからマージするのが安全。

## Stage ①：トークン CSS の差し替え

### Why first

トークンは全コンポーネントの基底。先に揃えると、後段で個別 atom を入れた瞬間に色味の整合がとれている。

### How

1. 採用先の `app/globals.css` を開く
2. `:root` と `.dark` ブロック内の CSS variables（`--background`, `--foreground`, `--primary` 等）を、`@gunjo/ui/styles` の import に置き換える：

```css
/* 旧 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  /* ... */
}

/* 新 */
@import "@gunjo/ui/styles";
```

3. `npm run dev` で起動、**画面全体を 1 周** して大きな破綻がないことを確認
4. 色が破綻している場合：採用先で独自に上書きしていた token を `@import` の **後** に再定義することで段階的に上書き

### 期待される変化

- 中性色（gray 系）の階調が GunjoUI 値に揃う
- アクセントカラーが GunjoUI のもの（黒系 primary）に置き換わる
- これによって従来 design に「違和感」が出ることがあり、それは正常

### ロールバック

`git revert <commit>` で `globals.css` を元に戻す。

## Stage ②：Tailwind preset 適用

### How

採用先の `tailwind.config.ts`：

```ts
import gunjoPreset from "@gunjo/ui/tailwind-preset";

const config = {
  presets: [gunjoPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@gunjo/ui/src/**/*.{ts,tsx}",  // ← 重要
  ],
};
```

### 期待される変化

- カスタム utility（`bg-background`, `text-muted-foreground` 等）が解決可能に
- 既存の `text-gray-500` などの直接指定は変わらない（preset は default theme を上書きしない範囲で extend）

### Tailwind v4 の注意

採用先が v4 の場合、`tailwind.config.ts` ベースではなく CSS の `@theme` ベース。CSS 側で `@config "../node_modules/@gunjo/ui/tailwind-preset.js"` を読む方式が最も簡単（`tailwind-preset` は v3/v4 双方の入口になる）。完全な CSS サンプルは [adoption.md §3b](./adoption.md#3b-tailwind-v4-を使っている場合) を参照。

## Stage ③：Inputs 置換

### 順序の推奨

優先度高 → 低：

1. `Button`（最頻出、視認性高）
2. `Input` / `Textarea`
3. `Badge`
4. `Label` / `Checkbox` / `Switch`
5. `Avatar` / `Spinner`
6. その他

### How（per component）

採用先の旧 Button import：

```tsx
import { Button } from "@/components/ui/button";
```

→ GunjoUI から：

```tsx
import { Button } from "@gunjo/ui";
```

API 互換性は **shadcn 系であれば概ね揃う**。`variant` prop 名や値が一部異なる場合があるので、置換時は `git grep` で `Button variant=` を一覧して確認。

### 視覚回帰

各 component 置換 PR では **画面 3 枚以上のスクショ** を比較として PR 説明に貼ること（Before / After / Dark Mode）。差分が想定外だった場合は GunjoUI 側に issue を立てる。

## Stage ④：Display / Feedback 置換

`Card`, `Table`, `Badge`, `Toast`, `Progress` 等。Inputs より構造が大きく、**子要素の slot 設計** が rebar になりがち。

### How

旧コードの slot 構造を GunjoUI component の slot に **マッピング表** を作ってから置換するのが安全：

```
旧: <Modal title="Hello" body={<p>Body</p>} />
新: <Modal>
      <ModalHeader><h2>Hello</h2></ModalHeader>
      <ModalContent><p>Body</p></ModalContent>
    </Modal>
```

GunjoUI の複合コンポーネントは radix-ui ベースで composition pattern を強く採用しているため、旧 API → compound component pattern への書き換えは PR が大きくなりがち。**1 PR = 1 component** がおすすめ。

## Stage ⑤：Navigation / Overlay 置換

`AppRail`, `ShareModal`, `CommandPalette` など、画面に 1〜2 個出る大型コンポーネント。

### How

採用先で独自実装している大型ブロックを、GunjoUI の Navigation / Overlay component に置換。本ステージは **業務ロジック（state, handlers）を分離する設計工程** が必要なため、純粋な置換ではない。

採用判断時に、組み込めるか否かをチェック：

- AppRail：採用先のナビゲーション構造とスロットが合うか
- ShareModal：採用先の共有 UX flow と一致するか
- Command Palette：採用先の global search 設計と合うか

合わない場合は大型 Navigation / Overlay をスキップして、Inputs / Display / Feedback までで停止する選択もアリ。

## 全 Stage 完了後

採用先プロジェクトで：

```bash
npm run lint
npm run type-check
npm run build      # 本番ビルドが通るか
```

の三つが緑になり、画面 3 枚以上のスクショ比較で **致命的な差** がないことを確認できれば移行完了。

## 既知の落とし穴

- **`transpilePackages` 抜け**：採用先 `next.config.ts` に `transpilePackages: ["@gunjo/ui"]` を入れずに Stage ③ に進むと、最初の `import { Button } from "@gunjo/ui"` で `SyntaxError: Unexpected token` が出てビルドが落ちる。Stage ① 着手前に [adoption.md §2](./adoption.md#2-nextjs-設定必須) の確認を必須化
- **font-family の指定漏れ**：採用先で `<body>` に `Inter` を当てていない場合、GunjoUI の text 系コンポーネントだけ周囲と font が違って見える。layout で root font を `Inter` にするのが正解
- **CSS specificity 衝突**：採用先の独自 utility が GunjoUI のクラスを上書きしていた場合、置換後に挙動がおかしくなる。`!important` を使わず、独自スタイルの scope を絞ることで回避
- **Tailwind v3 と v4 の混在**：採用先が v3 なのに GunjoUI を v4 想定で使うとプリセットが機能しない。バージョンを揃えること
- **React 18 採用先**：GunjoUI は peer を `react: ^19.0.0` のみに縮小済（[CHANGELOG.md](../CHANGELOG.md#pre-l4-deviations10-期間中の-non-semver-変更) 参照）。React 18 のままでは導入不可、先に採用先の React 19 化が必要

## 関連

- [adoption.md](./adoption.md) — 新規プロジェクトへの初導入
- [versioning.md](./versioning.md) — GunjoUI 側の破壊的変更がきたときの対応
