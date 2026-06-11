# SSOT Progress Regression Thresholds

`design:verify:ssot-progress-regressions` のカテゴリ別悪化許容量を定義します。

## JSON 形式

`design/policy/ssot-progress-regression-thresholds.json`

```json
{
  "stubsUnresolved": {
    "*": 0,
    "atoms": 0
  },
  "docsUnresolved": {
    "*": 0
  },
  "styleDrift": {
    "*": 0
  }
}
```

- セクションキー: `stubsUnresolved` / `docsUnresolved` / `styleDrift`
- 値: `category -> allowedDelta`（0以上の数値）
- `*` はデフォルト値
- カテゴリ個別設定がある場合は `*` より優先

## 運用

- CI は `design/policy/ssot-progress-regression-thresholds.json` を参照し、PR の base/head diff に対して悪化を判定します。
- 基本方針は `* = 0`（悪化を許容しない）です。
