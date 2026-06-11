# Component Style Drift Strict Targets

`design:verify:component-style-drift` は既定で全コンポーネントを strict 判定します。  
段階導入する場合は、`--strict-target-policy` とこのファイルで strict 対象を絞ります。

## JSON 形式

`design/policy/component-style-drift-strict-targets.json`

```json
{
  "categories": ["atoms"],
  "components": ["molecules/sortButton", "templates/settingsTemplate"]
}
```

## ルール

- `categories`: カテゴリ単位で strict 対象化
- `components`: `category/componentKey` 形式で strict 対象化
- `categories` と `components` は加算で評価
- 未知キー・重複・形式不正は strict で fail
- `--strict-target-policy` を指定したのに有効ターゲットが 0 件なら strict で fail

## 使い方

- レポート（警告）:
  - `npm run design:verify:component-style-drift-report`
- 全件 strict:
  - `npm run design:verify:component-style-drift`
- ポリシー適用 strict（段階導入）:
  - `npm run design:verify:component-style-drift:scoped`
- CLI で一時指定 strict:
  - `node scripts/design-verify-component-style-drift-report.mjs --strict --strict-category=atoms`
  - `node scripts/design-verify-component-style-drift-report.mjs --strict --strict-component=atoms/button,molecules/sortButton`

## 現在の運用

- `design/policy/component-style-drift-strict-targets.json` は `atoms/molecules/organisms/templates` の全カテゴリを strict 対象に設定
- `npm run design:verify` / `npm run design:verify:components` では component style drift を full strict で検証
