# Security Policy

GunjoUI のセキュリティポリシー。脆弱性発見時の報告手順をまとめています。

## サポート対象バージョン

| バージョン | サポート状況 |
|---|---|
| `0.1.0-beta.x` | 🟢 active（current beta） |
| `1.0.0` 以降（将来） | 🟢 active 予定 |
| `0.0.1-alpha.x`（旧 pre-release） | ⚠️ 最新 beta への upgrade を推奨（back-port なし） |

> beta 段階では「critical bug fix のみ」というよりは、**最新 beta への upgrade** を推奨します。古い alpha / beta への back-port は基本的に行いません。
> `1.0.0` stable 後のサポートポリシー（前 MAJOR ライン保守期間など）は [docs/versioning.md §サポートポリシー](./docs/versioning.md#サポートポリシー) を参照。

## 報告方法

### ⚠️ public issue は使わないでください

セキュリティ脆弱性は **GitHub Issues / Discussions / Pull Request では公開しないで** ください。修正前に open に晒すと、悪用される時間を与えてしまいます。

### 推奨：GitHub Security Advisories（private）

リポジトリの **Security タブ → "Report a vulnerability"** から private に報告できます：

https://github.com/uixhero/gunjo/security/advisories/new

GitHub が maintainer に直接通知し、修正・公開タイミングをコントロールできます。CVE 発行も支援されます。

### 代替：メール

GitHub Security Advisories が使えない場合は、maintainer に直接メールで連絡：

- **dev@4px.jp**

メール件名に `[GunjoUI Security]` を含めると優先処理します。GPG 鍵は現時点で未公開（必要なら相談ください）。

### 報告時に含めて欲しい情報

- **影響範囲**：どのコンポーネント / 機能 / バージョン
- **再現手順**：最小コード例
- **影響度の自己評価**：CVSS スコア（可能なら）、想定攻撃シナリオ
- **発見者の情報**：報告者名 / 組織（謝辞表記の希望可否）

## 対応プロセス

| 段階 | 想定期間 | 内容 |
|---|---|---|
| 受領確認 | 48 時間以内 | maintainer から acknowledgment 返信 |
| トリアージ | 1 週間以内 | 重大度判定、影響範囲調査 |
| 修正 | 重大度に応じて | critical: 1 週間 / high: 2 週間 / medium 以下: 次回マイナーリリース |
| 公開 | 修正版 publish 後 | GitHub Security Advisory 公開、CHANGELOG エントリ |
| 謝辞 | 公開と同時 | 発見者の希望に応じて Hall of Fame / Advisory に氏名記載 |

## スコープ

### 対象（ここに脆弱性があれば報告対象）

- **`@gunjo/ui` パッケージ自体**：コンポーネント実装、配布物、依存関係
- **`@gunjo/ui/styles`**：CSS variables / token 定義
- **`tailwind-preset.js` / `tailwind-theme-extend.cjs`**
- **`design/*-metadata.json`**：採用先が直接読む metadata

### 対象外

- **docs サイト** (`app/`)：このサイト自体は配布物に含まれず、本リポジトリ内でのみ動作します。docs サイトのバグは通常の Issue で報告ください
- **採用先プロジェクトのコード**：採用先での実装ミスは採用先側で対応
- **Radix UI 等の依存関係本体の脆弱性**：それらの upstream に直接報告ください（GunjoUI は適宜 npm audit / dependabot で追従）

## 既知の non-issue

- **TypeScript ソース直配布**：採用先 Next.js で `transpilePackages` 必須となっており、これは仕様であってセキュリティ問題ではありません
- **`design/*-metadata.json` の公開**：構造データのみで、認証情報やシークレットは含みません

## 開示ポリシー

- **責任ある開示**：GitHub Security Advisory のプロセスに従い、**修正版 publish 後** に公開
- **embargo 期間**：critical な脆弱性で大規模採用がある場合、修正版公開前に 14 日程度の埋め草期間を設ける場合があります
- **公開時**：CHANGELOG.md に Security 欄を立てて記載、影響を受けるバージョン範囲も明記

## License との関係

GunjoUI は [MIT License](./LICENSE) で提供されており、`AS IS` で動作保証はありません。それでも、発見された脆弱性の修正には誠実に対応します。
