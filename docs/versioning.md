# Versioning & Breaking Change Policy

GunjoUI の semver 運用ルールと、破壊的変更がきたときの採用先側の対応方針。

## semver の運用

[semver.org](https://semver.org/lang/ja/) に従う。

- **MAJOR (X.0.0)**：採用先のコードを書き換えないと動かない変更
- **MINOR (1.X.0)**：後方互換のあるコンポーネント追加、新 prop 追加
- **PATCH (1.0.X)**：バグ修正、視覚的微調整、内部リファクタ

現バージョン：`0.1.0-beta.3`（1.0 前・beta）。**0.x（alpha / beta）期間中は上記の互換保証は努力目標**で、破壊的変更がマイナー / プレリリースに入ることがある（全部品 Experimental が既定。各部品の安定性は [/docs/stability](https://gunjo.jp/docs/stability)、1.0 の条件は GitHub issue [#1040](https://github.com/uixhero/gunjo/issues/1040)、各項目がどの版に入る予定かはリポジトリの [docs/roadmap.md](https://github.com/uixhero/gunjo/blob/main/docs/roadmap.md)）。上記 semver の保証は **1.0.0 以降**で正式に有効になる。1.0 までの版の切り方は次の節。

## beta の間の版の切り方

1.0 までは `0.x` の beta として出す（2026-10-06 決定）。1.0 にするのは「部品」「docs」「見た目」の3つがすべてそろったときで、条件の一覧は GitHub issue [#1040](https://github.com/uixhero/gunjo/issues/1040)。この節は 1.0 に届くまでの規則で、上の semver の運用と、下の破壊的変更の扱い・作法は 1.0 以降の規則としてそのまま残す。

### 1. 何で版を上げるか

| 変更の中身 | 次の版 | 例 |
|---|---|---|
| 破壊的変更を含む（下の「何が『破壊的変更』か」の7種類のどれか） | `0.(次).0-beta.1` | #492（重い部品を subpath export に分ける）は `0.2.0-beta.1` |
| それ以外（部品・props の追加、見た目の変更、不具合の修正） | `beta.(N+1)` | `0.1.0-beta.3` の次は `0.1.0-beta.4` |

破壊的変更が1つでも入る版は、ほかの変更が何であっても上の行で切る。

### 2. いつ出すか

次のどれか1つにあてはまったら出す。

- 1.0 の条件（#1040）の項目が1つ片付いたとき
- 自社の採用先（4px-hq-dashboard・design-qa・uixhero）が待っている変更が入ったとき
- 前回の版から4週間たち、CHANGELOG の `[Unreleased]` が空でないとき

npm への公開には KeEem の2段階認証が要る。AI の作業エージェントは版番号と CHANGELOG を整える PR までを作り、`npm publish` はしない。

### 3. 見た目が変わる版の CHANGELOG

画面の見た目が変わる変更を含む版は、CHANGELOG のその版の節に「採用先向けの要約（見た目が変わるもの）」を書く。コードを直さなくても依存を上げるだけで何が変わるか、上げたあとに目で確かめてほしい点、前の見た目に戻す方法（あれば）を並べる。手本は [CHANGELOG.md](../CHANGELOG.md) の `[0.1.0-beta.3]` の節。

### 4. 1.0 の手前

3つの条件がそろったら `1.0.0-rc.1` を出す。そこから2週間、採用先で問題が出なければ `1.0.0` を出す。

## 何が「破壊的変更」か

以下のいずれかは MAJOR バンプ対象：

1. **コンポーネントの削除・改名**：`Button` → `Btn` など
2. **公開 prop の削除・型変更**：`variant: "default"` → `variant: "primary"` など
3. **default の挙動変更**：`<Button>` がデフォルト `variant="default"` だったのを `variant="primary"` に変更
4. **トークンの破壊**：`--background` → `--bg` などの変数名変更、または値の意味が大きく変わる
5. **peer dependency 範囲の縮小**：`react ^18 || ^19` → `react ^19` に絞る
6. **export 構造の変更**：`@gunjo/ui` → `@gunjo/inputs` のようなカテゴリ別 package への分割など
7. **Tailwind preset の互換破壊**：採用先で生成される utility が変わる

以下は **MINOR**：

- 新コンポーネント追加（過去例：Skeleton / Stepper / Form は L3 期間中に追加され audit 67→70 に。npm 未公開期間中の調整として [Pre-publish history](../CHANGELOG.md#pre-publish-history内部-100-期間2026-04-以前2026-05-03) に履歴記載）
- 新 variant 追加
- 新 prop 追加（既存利用に影響しない）
- 新 token 追加（既存上書きしない）

以下は **PATCH**：

- スタイルの微修正（color hex 数値の微調整）
- 内部リファクタ（cva の整理、ファイル分割）
- バグ修正
- パッケージ内ドキュメント修正

## 破壊的変更を出すときの作法

### 1. 事前告知（推奨）

少なくとも **1 マイナーバージョン前**から `@deprecated` JSDoc を付けて警告。可能なら旧 API を残しつつ新 API を追加するパスを取る。

```tsx
/** @deprecated 2.0 で削除予定。`variant="primary"` を使用 */
const oldVariant = "default";
```

### 2. CHANGELOG に明記

リポジトリ root の [CHANGELOG.md](../CHANGELOG.md)。break-by-break のリスト + 移行手順 + 採用先影響度（none / minor / breaking）を書く。npm 公開後の各リリース（`0.0.1-alpha.0` 〜 将来の `1.0.0` stable）はそれぞれエントリ化、npm 未公開期間中の内部マイルストーンは末尾「Pre-publish history」セクションに履歴メモとして残す。

例：

```markdown
## 2.0.0 (2026-XX-XX)

### Breaking
- `Button` の `variant="default"` を `variant="primary"` に改名（旧名は警告付きで残置、3.0 で削除）
- 採用先影響度: **minor**（grep で全置換可能）

### Migration
旧：
```tsx
<Button variant="default">Click</Button>
```
新：
```tsx
<Button variant="primary">Click</Button>
```
```

### 3. PR テンプレに「採用先影響」欄

PR を出すときの説明テンプレ（[component-addition.md](./component-addition.md#6-pr-テンプレート参考) でも触れている）：

```markdown
## 採用先影響度
- [ ] **none** — 既存採用先のコードに変更不要
- [ ] **minor** — grep で機械的に置換可能（例：variant 名の改名）
- [ ] **breaking** — コードの構造変更が必要（例：compound component への移行）

## 影響範囲の見積もり
（採用先：workflow / Bannalyze）
- 該当箇所の概算ファイル数: __
- 推定置換時間: __
```

### 4. 採用先への通知

`@gunjo/ui` を npm publish した時、採用先プロジェクトに dependabot / renovate を入れておけば PR で気づける。社内採用の場合は Slack #gunjo チャンネル等で告知。

## バージョン上げの判断ツリー

```
変更後、採用先のコードが何か必要か？
├─ 何も必要ない → PATCH (1.0.X)
├─ 新機能を使うために何か追加するだけ → MINOR (1.X.0)
└─ 既存コードの書き換えが必要 → MAJOR (X.0.0)
```

迷ったら：「既存採用先で `npm update @gunjo/ui` を流したとき build が落ちるか？」で判定。落ちるなら MAJOR。

## 互換性の範囲

GunjoUI が後方互換を保証する範囲：

- **保証する**：パッケージの `exports` に出ている API（コンポーネント、token 名、preset）
- **保証しない**：内部実装（`src/components/generated/*` の型、`src/lib/*` の utility 関数）、`design/*.pen` の構造

採用先は「公開 API 経由のみ」で使うこと。`@gunjo/ui/src/components/generated/*` のような deep import は避ける。

## サポートポリシー

- **現在の MAJOR ライン**：常に最新 MINOR をサポート
- **1 つ前の MAJOR ライン**：critical bug fix のみ 6 ヶ月間
- **2 つ以上前**：サポート終了

例：2.0 リリース後の 1.x への対応は「重大バグのみ 6 ヶ月」となる。

## 関連

- [CHANGELOG.md](../CHANGELOG.md) — リリース履歴と Pre-L4 Deviations
- [adoption.md](./adoption.md) — 新規導入
- [migration-playbook.md](./migration-playbook.md) — 既存アプリの移行
- [dependencies.md](./dependencies.md) — peer dep 範囲
