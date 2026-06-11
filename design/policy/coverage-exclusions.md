# Coverage Exclusions Policy

`design:verify:coverage` は `metadata` / `component-specs` / `src/components` の整合を検証します。  
以下は「意図的な不一致」を許容するための運用ルールです。

## Exclusion の管理場所

- `scripts/design-verify-spec-coverage.mjs`
  - `EXCLUDED_ATOM_METADATA`
  - `EXCLUDED_MOLECULE_METADATA`
  - `EXCLUDED_ORGANISM_METADATA`
  - `EXCLUDED_TEMPLATE_METADATA`
  - `EXCLUDED_ATOM_SOURCE_COMPONENTS`
  - `EXCLUDED_MOLECULE_SOURCE_COMPONENTS`
  - `EXCLUDED_ORGANISM_SOURCE_COMPONENTS`
  - `EXCLUDED_TEMPLATE_SOURCE_COMPONENTS`
- `scripts/design-verify-docs-metadata-coverage.mjs`
  - `COMPOSITE_DOC_PAGE_KEYS`
- `design/policy/component-style-drift-exclusions.json`
  - `npm run design:verify:component-style-drift` の除外設定
  - 書式・運用ルール: `design/policy/component-style-drift-exclusions.md`
- `design/policy/component-style-drift-strict-targets.json`
  - `npm run design:verify:component-style-drift:scoped` の strict 適用対象
  - 書式・運用ルール: `design/policy/component-style-drift-strict-targets.md`

## 追加してよい条件

- コンポーネントが design-system の公開対象ではない（例: docs 専用ヘルパー）。
- 移行中で一時的に key 不一致が必要（期限付き）。
- 依存都合で `.tsx` は存在するが metadata 管理対象外にしたい。

## 追加時に必須の記録

- 対象 key
- 理由（1 行で可）
- 想定期限（恒久なら `permanent`）
- 追加日

`scripts/design-verify-spec-coverage.mjs` の該当 `Set` 直上コメントに残すこと。

## 禁止事項

- 理由なしで追加すること
- 一時回避目的で恒久除外すること
- metadata/spec/source の同期漏れを exclusion で隠すこと

## 見直しタイミング

- 新規コンポーネント追加時
- 大きなリファクタ後
- release 前の `design:verify` 失敗時
