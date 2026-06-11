# Versioning & Breaking Change Policy

GunjoUI の semver 運用ルールと、破壊的変更がきたときの採用先側の対応方針。

## semver の運用

[semver.org](https://semver.org/lang/ja/) に従う。

- **MAJOR (X.0.0)**：採用先のコードを書き換えないと動かない変更
- **MINOR (1.X.0)**：後方互換のあるコンポーネント追加、新 prop 追加
- **PATCH (1.0.X)**：バグ修正、視覚的微調整、内部リファクタ

現バージョン：`1.0.0`（L4 採用前）

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
