# Component Style Drift Exclusions Policy

`design:verify:component-style-drift` は、`component-style-hints.ts` と実装クラスの構造ドリフトを厳格検証します。  
一時的に strict fail を回避する場合は、`design/policy/component-style-drift-exclusions.json` に除外を登録します。

## JSON 形式

```json
{
  "entries": [
    {
      "category": "atoms",
      "componentKey": "button",
      "reason": "token migration in progress",
      "expiresOn": "2026-05-31",
      "addedOn": "2026-04-17"
    }
  ]
}
```

## 必須項目

- `category`: `atoms` / `molecules` / `organisms` / `templates`
- `componentKey`: 対象 component key
- `reason`: 1 行理由
- `expiresOn`: `YYYY-MM-DD` または `permanent`
- `addedOn`: `YYYY-MM-DD`

## 検証ルール

- 不正エントリ（必須項目不足・日付形式不正）は strict で fail
- 重複エントリ（`category/componentKey` 重複）は strict で fail
- 未知エントリ（manifest/style-hints に存在しない key）は strict で fail
- 期限切れエントリは strict で fail

`design:verify:component-style-drift-report` では上記を警告として表示し、`design:verify:component-style-drift` で fail します。
