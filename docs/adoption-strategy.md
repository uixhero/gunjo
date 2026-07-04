# Adoption Strategy

GunjoUI を他プロジェクトに「採用」するときの配布形態の決定書。

## 結論

**現時点での推奨：プライベート npm レジストリ（GitHub Packages 互換 / または npm の private package）**。`@gunjo/ui` というスコープを保ち、`package.json` の `private: true` を `false` に切替、`publishConfig` で公開先 registry を明示する。

L4（実採用）開始時にレジストリの最終決定（社内 / 公開）をするまでは、**ローカルパスインストール** (`npm install /path/to/gunjo`) で運用可能。本リポジトリはこのパス導入を一級でサポートする。

## 候補と評価

| 形態 | メリット | デメリット | 採用推奨度 |
|---|---|---|---|
| (a) **プライベート npm registry** | バージョン管理・依存解決が標準、CI 連携容易 | 認証セットアップ必要 | ★★★（推奨） |
| (b) **GitHub Packages** | コードと同居、認証は GH Token | GH に縛られる | ★★ |
| (c) **git submodule** | 即時導入、レジストリ不要 | 親リポと密結合、バージョン凍結手動 | ★ |
| (d) **コピー貼付** | ゼロ依存 | 同期不能、SSOT 崩壊 | × |

(c) と (d) は SSOT のメリット（pen + source + docs の三軸検証）を採用先で享受できないため、本リポジトリの設計思想と矛盾する。

## 配布物

`package.json` の `files` フィールドで以下を含める：

```jsonc
"files": [
  "dist",                     // コンパイル済み ESM + .d.ts（配布ランタイム）
  "src",                      // TypeScript 実装（sourcemap / go-to-definition 用）
  "tailwind-preset.js",       // Tailwind v3 用プリセット
  "tailwind-theme-extend.cjs",// Tailwind v4 用 extend
  "design/*-metadata.json"    // 採用先で参照可能なメタデータ
]
```

`exports` は dist（コンパイル済み）を指す 4 エントリ：

```jsonc
"exports": {
  ".":                     { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
  "./styles":              "./dist/globals.css",
  "./tailwind-preset":     "./tailwind-preset.js",
  "./tailwind-theme-extend":"./tailwind-theme-extend.cjs"
}
```

> dist は `npm run build:lib`（`tsc -p tsconfig.build.json`）で生成し、`prepublishOnly` で publish 時に自動ビルドされる。`"use client"` 境界はファイル先頭の directive として tsc がそのまま保持する。生 TS を直接 `exports` していた旧 alpha と異なり、採用先は `transpilePackages` 不要でそのまま import できる。

`tailwind-theme-extend` は Tailwind v4 採用先が `@theme` ベースで token map を直接使いたい場合の出口。通常は `tailwind-preset` 経由で十分（[adoption.md](./adoption.md#3-tailwind-プリセット取り込み) 参照）。

`.pen` SSOT ファイル本体（`design/*.pen`）は **配布物に含めない**。SSOT は本リポジトリ側でのみ更新し、採用先には生成済 metadata と TypeScript 実装のみ届ける。

## L4 着手作業（2026-05-04 PR #3 で実施済 / 部分残）

### 完了

1. ✅ レジストリ確定：**public npm**
2. ✅ npm Org `gunjo` 取得（admin: `uixhero`）
3. ✅ パッケージ改名：`@gunjo` → `@gunjo/ui`
4. ✅ `package.json`：
   - `"private": true` → `false`
   - `"publishConfig.access": "restricted"` → `"public"`
   - `"version": "1.0.0"` → `"0.0.1-alpha.0"`（公開 1.0.0 は将来の stable に予約）
5. ✅ 全 `@gunjo` 参照を `@gunjo/ui` へ置換（128 ファイル）
6. ✅ `npm pack --dry-run` で配布物確認

### 残（未実施）

- ⏳ `"repository"` フィールド追加：GH リポジトリ public 化と同時に。それまで空（採用先からはリンクが見えない状態）
- ⏳ 初回 `npm publish --access public`：本 PR マージ後に admin user (`uixhero`) が手元で実行
- ⏳ GitHub リポジトリの public 化：README/LICENSE/CONTRIBUTING を整備してから

## 既存の状態（2026-05-04 / 0.0.1-alpha.0 時点）

```jsonc
{
  "name": "@gunjo/ui",
  "version": "0.0.1-alpha.0",  // 公開 1.0.0 は将来の stable に予約
  "private": false,
  "license": "MIT",
  "publishConfig": { "access": "public" },
  "exports": { /* 4 エントリ。改名後は @gunjo/ui/styles, /tailwind-preset, /tailwind-theme-extend */ },
  "files": [
    "src",
    "tailwind-preset.js",
    "tailwind-theme-extend.cjs",
    "design/inputs-metadata.json",
    "design/display-metadata.json",
    "design/feedback-metadata.json",
    "design/navigation-metadata.json",
    "design/overlay-metadata.json",
    "design/layout-metadata.json",
    "design/patterns-metadata.json"
  ],
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.0.0 || ^4.0.0"
  }
}
```

## ローカルパスでの「擬似採用」（alpha 期間中も並行可）

`@gunjo/ui` が npm に出ていても、開発中の hot fix を試したい場合はローカルパスで上書き install 可：

```bash
# 採用先プロジェクトで（相対パス推奨）
npm install file:../gunjo
# または絶対パス
npm install /absolute/path/to/gunjo
```

これは Phase D（採用ドライラン）でも使うフロー。

## 参考

- 関連：[adoption.md](./adoption.md) — インストール手順
- 関連：[versioning.md](./versioning.md) — バージョニング・破壊的変更ポリシー
- 関連：[dependencies.md](./dependencies.md) — peer dependency 契約
