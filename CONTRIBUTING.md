# Contributing to GunjoUI

GunjoUI への貢献に興味を持っていただきありがとうございます。本ドキュメントは開発参加の手引きです。

> **alpha 段階の注意**：GunjoUI は現在 `0.0.1-alpha.x` シリーズで、API は流動的です。大規模な機能提案より、既存 issue / バグ報告 / ドキュメント改善の方が受け入れやすい段階にあります。`1.0.0` stable 後に本格的なエコシステム貢献を歓迎する設計です。

## 目次

- [何を貢献できるか](#何を貢献できるか)
- [開発環境セットアップ](#開発環境セットアップ)
- [SSOT 三軸ワークフロー](#ssot-三軸ワークフロー)
- [Issue を立てる](#issue-を立てる)
- [PR を出す](#pr-を出す)
- [コミット規約](#コミット規約)
- [コードスタイル](#コードスタイル)
- [質問・議論](#質問議論)

## 何を貢献できるか

| カテゴリ | 例 | 受け入れ難易度 |
|---|---|---|
| **バグ報告** | コンポーネントの視覚崩れ、TypeScript 型エラー、SSR 問題 | 🟢 歓迎 |
| **ドキュメント改善** | adoption.md / dependencies.md 等の typo / 不正確な記述 | 🟢 歓迎 |
| **新コンポーネント追加** | 既存 atom / molecule / organism の拡張 | 🟡 alpha 中は要相談（[Discussions](https://github.com/uixhero/gunjo/discussions) で先に話す） |
| **API 設計変更** | 既存 prop の rename、compound pattern への移行 | 🔴 alpha 中は控えめに、`1.0.0` 設計議論として |
| **採用先での実例** | adoption.md に従った実プロジェクトでの動作報告 | 🟢 大歓迎 |
| **i18n / 翻訳** | docs サイトの英訳・他言語化 | 🟢 歓迎 |

## 開発環境セットアップ

### 必要なもの

- Node.js 20 以上
- npm（リポジトリで `package-lock.json` を採用）
- 推奨：Pencil（`.pen` ファイル編集に必要、ただし spec / metadata の編集だけなら不要）

### クローン & 起動

```bash
git clone https://github.com/uixhero/gunjo.git
cd gunjo
npm install     # pre-commit hook も自動で `core.hooksPath=.githooks` に設定される
npm run dev     # docs サイトが http://localhost:13030 で起動
```

### 主なコマンド

| コマンド | 用途 |
|---|---|
| `npm run dev` | docs サイト起動（コンポーネントの視覚確認） |
| `npm run type-check` | TypeScript 型チェック |
| `npm run design:sync` | `.pen` → spec → source / docs の自動生成チェーン実行 |
| `npm run design:verify` | SSOT 三軸の整合性検証（CI で必須） |
| `npm run design:audit:refresh` | docs サイトのスクショと監査台帳更新 |
| `npm run lint` | ESLint |
| `npm pack --dry-run` | npm 配布物の中身確認 |

詳細は [package.json](./package.json) の `scripts` 参照。

## SSOT 三軸ワークフロー

GunjoUI のコア設計思想：**1 コンポーネント = pen + source + docs の 3 軸で常時整合**。これを CI が `design:verify` で検証します。

新規コンポーネント追加 / 既存コンポーネント改修の手順は **[docs/component-addition.md](./docs/component-addition.md)** に網羅されています。短縮版：

1. `.pen` に reusable variant + showcase frame 追加（Pencil で編集 → `Cmd+S`）
2. `src/components/<tier>/<Name>.tsx` 実装（`cva` で variant 定義）
3. `app/docs/components/<tier>/<kebab>/page.tsx` 追加（自動生成可）
4. `npm run design:sync` で生成物再生成
5. `npm run design:verify` 緑化
6. `npm run type-check` 緑化

詳細チェックリスト・ヒューリスティック警告対応・PR テンプレートは [docs/component-addition.md](./docs/component-addition.md) を参照。

## Issue を立てる

### バグ報告

最低限以下を含めてください：

- **環境**：Node.js / React / Tailwind / Next.js のバージョン
- **再現手順**：最小コード例（`@gunjo/ui` を `npm install` した別 project での再現が望ましい）
- **期待動作 vs 実動作**
- **スクショ / コンソールログ**

### 機能要望

- ユースケース（なぜ必要か）
- 既存コンポーネントの組み合わせで実現できないか確認したか
- API 案があれば（必須ではない）

### 質問

- まず [docs/](./docs/) を確認
- それでも不明なら [Discussions](https://github.com/uixhero/gunjo/discussions) で（Issue ではなく）

## PR を出す

### 大原則

- **小さく、focused に**：1 PR = 1 コンポーネント / 1 機能 / 1 バグ修正
- **`design:verify` 緑必須**：pre-commit hook と CI で自動チェック
- **CHANGELOG.md 更新**：[Unreleased] セクションに該当エントリ追記
- **PR description**：what / why / 採用先影響度 を書く

### ブランチ命名

```
feat/<short-description>     - 新機能・新コンポーネント
fix/<short-description>      - バグ修正
docs/<short-description>     - ドキュメントのみ
chore/<short-description>    - 雑務（設定 / 依存更新 / リネーム等）
refactor/<short-description> - 内部リファクタ
```

### PR テンプレート

[docs/component-addition.md §6](./docs/component-addition.md#6-pr-テンプレート参考) を参考に。新コンポーネント以外でも採用先影響度欄は埋めてください。

## コミット規約

[Conventional Commits](https://www.conventionalcommits.org/) に概ね準拠：

```
<type>(<scope>): <subject>

<body 任意、なぜを書く>

<footer 任意、co-author 等>
```

`type` の例：`feat` / `fix` / `docs` / `chore` / `refactor` / `test` / `style` / `perf` / `ci`

scope の例：`atoms` / `molecules` / `docs` / `release` / `l4`（プロジェクト履歴上のフェーズ名）

過去のコミット履歴を `git log --oneline` で見ると感じが掴めます。

## コードスタイル

- TypeScript strict
- 関数 vs クラス：関数優先（React 自体が関数コンポーネント前提）
- variant 管理：`class-variance-authority` (`cva`) で統一
- class 結合：`clsx` + `tailwind-merge`（`cn` ユーティリティ経由）
- インデント：スペース 2
- セミコロン：あり
- import 順：absolute（`@/...`）→ relative（`../...` → `./...`）

ESLint / Prettier の設定はリポジトリのものに従ってください（`npm run lint`）。

## 質問・議論

- **GitHub Issues**：バグ報告・機能要望
- **GitHub Discussions**：質問・設計議論・採用報告
- **PR 上のコメント**：その PR の実装相談

---

## License

contribution された変更は本リポジトリと同じ [MIT License](./LICENSE) でライセンスされます。PR を出す行為がそのライセンスへの同意と見なされます。

## 行動規範

別途 `CODE_OF_CONDUCT.md` を整備予定。それまでは [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) の原則を採用しているとお考えください。
