# SSOT Foundation Summary and Runbook

最終更新: 2026-04-18

## 1. 目的

このドキュメントは次の 2 つを 1 本にまとめる。

1. 今回の SSOT 基盤整備で何を変えたか（要約）
2. 以後の SSOT 運用をどう回すか（実務 RUNBOOK）

---

## 2. 今回対応の概要

今回のゴールは、`design/*.pen` を SSOT とした運用を、ローカル運用だけでなく PR/CI 上でも壊れにくくし、運用手順を文書化して再現可能にすること。

主な成果は次のとおり。

- SSOT PR コメント運用をラベル/変数駆動で制御できるように強化
- `design/README.md` と CI 実装の不整合を検知する verify を追加
- UI 仕様書 `DESIGN.md` を正式採用し、参照導線を追加
- `tsconfig.tsbuildinfo` の差分ノイズを解消
- PR 上で `ssot-comment:*` の実挙動を 1 回ずつ確認

---

## 3. 変更内容（実装サマリ）

### 3.1 SSOT PR コメント制御の強化

対象:
- `.github/workflows/design-verify.yml`

実装:
- `ssot-comment:post` が付いた PR のみコメント投稿
- `ssot-comment:no-post` が最優先で投稿停止
- `ssot-comment:detailed` / `ssot-comment:concise` でコメント粒度切替
- `SSOT_PR_COMMENT_NO_POST_ACTION` (`delete` / `update`) による cleanup 動作切替
- `SSOT_PR_COMMENT_NO_POST_DISABLED_MESSAGE` による no-post 時本文テンプレート化
- multiline メッセージを安全に `GITHUB_ENV` へ渡す実装
- テンプレート空文字時の既定文言フォールバック
- Step Summary に publish/cleanup 状態と no-post message preview を表示

### 3.2 CI 実装とドキュメントの同期検証

対象:
- `scripts/design-verify-ssot-pr-comment-docs.mjs` (新規)
- `scripts/design-verify.mjs`
- `package.json`
- `design/README.md`

実装:
- workflow 側で使っている `ssot-comment:*` ラベルと `SSOT_PR_COMMENT_*` 変数が README に記載されているか検証
- README の既定値と workflow の既定値（`|| '...'`）の差異も検知
- `npm run design:verify` に統合

### 3.3 ドキュメント整備

対象:
- `DESIGN.md`（正式採用）
- `README.md`
- `design/README.md`

実装:
- `DESIGN.md` を canonical UI specification として位置付け
- ルート README / design README から正式仕様ドキュメントへリンク
- SSOT PR コメント運用ルール（優先順位、変数既定値、挙動）を明文化

### 3.4 開発ノイズ削減

対象:
- `.gitignore`
- `package.json`

実装:
- `type-check` を `tsc --noEmit --incremental false` に変更
- `tsconfig.tsbuildinfo` を追跡対象から除外（`*.tsbuildinfo`）

### 3.5 PR 上での実地確認結果

対象 PR:
- https://github.com/eemlis7-ke/gunjo/pull/1

確認した挙動:
- `ssot-comment:post` + `ssot-comment:detailed`:
  - Actions `Design Verify` 成功
  - marker 付き SSOT コメントが投稿されることを確認
- `ssot-comment:no-post`:
  - Actions `Design Verify` 成功
  - marker 付き SSOT コメントが cleanup で削除されることを確認

---

## 4. SSOT 運用 RUNBOOK

### 4.1 運用対象と責務

- デザイン SSOT: `design/*.pen`
- 同期生成物:
  - `src/globals.css`
  - `design/*-metadata.json`
  - `design/component-specs/*`
  - `src/components/*/generated/*`
  - `src/components/generated/*`
  - `src/index.ts`
  - `app/lib/navigation.ts`
- 仕様ドキュメント:
  - UI 仕様: `DESIGN.md`
  - 運用手順: `design/README.md`, `SSOT_RUNBOOK.md`

### 4.2 日次運用フロー（ローカル）

1. `.pen` 編集
2. 同期
3. 検証
4. 差分レビュー
5. コミット/プッシュ

推奨コマンド:

```bash
npm install
npm run hooks:install

# 同期
npm run design:sync

# 検証
npm run design:verify
npm run type-check
```

### 4.3 PR 運用（ラベル駆動）

#### ラベル優先順位

1. 投稿可否: `ssot-comment:no-post` が最優先（`ssot-comment:post` より強い）
2. コメントモード: `ssot-comment:detailed` > `ssot-comment:concise` > repo variable 既定値

#### ラベル動作

| ラベル状態 | 期待挙動 |
|---|---|
| `ssot-comment:post` | SSOT PR コメントを upsert 投稿 |
| `ssot-comment:no-post` | 投稿停止し既存 marker コメントを cleanup |
| `ssot-comment:detailed` | コメント粒度を detailed |
| `ssot-comment:concise` | コメント粒度を concise |

#### repo variable（既定値）

| 変数 | 既定値 | 許可値 | 用途 |
|---|---|---|---|
| `SSOT_PR_COMMENT_MODE` | `concise` | `concise`, `detailed` | コメント粒度の既定値 |
| `SSOT_PR_COMMENT_NO_POST_ACTION` | `delete` | `delete`, `update` | no-post cleanup 動作 |
| `SSOT_PR_COMMENT_NO_POST_DISABLED_MESSAGE` | `- status: disabled\n- reason: ssot-comment:no-post label set` | 任意文字列 | `update` 時の本文テンプレート |

### 4.4 代表 verify コマンド

```bash
# SSOT進捗レポート
npm run design:verify:ssot-progress-report
npm run design:verify:ssot-progress-report:json

# しきい値ゲート
npm run design:verify:ssot-progress-thresholds -- --input /tmp/ssot-progress-report.json

# PRコメント生成（ローカル検証）
npm run design:verify:ssot-progress-pr-comment -- --mode detailed --diff /tmp/ssot-progress-diff.json --regression-report /tmp/ssot-progress-regressions.json --regression-outcome success

# workflow ↔ docs 同期検証
npm run design:verify:ssot-pr-comment-docs
```

### 4.5 障害対応ガイド

#### A. `base SSOT report was unavailable`

意味:
- PR base 側 SSOT JSON 生成が失敗し、diff/regression の一部が skip された状態

対応:
1. Actions Step Summary の該当ログを確認
2. base SHA で `design:verify:ssot-progress-report:json` が動くか確認
3. 必要なら base を最新化（rebase / merge main）

#### B. コメントが投稿されない

確認順:
1. PR が fork ではないか
2. `ssot-comment:post` ラベル有無
3. `ssot-comment:no-post` が付いていないか（最優先で停止）
4. workflow run の `Append SSOT PR Comment Publish status` を確認

#### C. README と workflow の運用記述がズレる

対応:
1. `npm run design:verify:ssot-pr-comment-docs` 実行
2. 指摘された label/variable/default を `design/README.md` へ反映

### 4.5.1 Showcase サムネイル再生成

`/showcase` のカード画像は `public/showcase-thumbs/<category>/<slug>.png` に静的キャッシュされており、`/embed/*` ルートを毎回レンダリングしない。コンポーネント追加・変更・既存デモ差し替え時はサムネイルを再生成する。

```bash
# 別ターミナルで dev server を起動（port 13030 必須）
npm run dev

# 全 112 コンポーネントを Puppeteer で 640×360 PNG に再キャプチャ
npm run showcase:thumbs

# 部分的に再生成したい場合
npm run showcase:thumbs -- --only=molecules/sheet,atoms/button
npm run showcase:thumbs -- --category=organisms,templates
```

ポート上書き時:

```bash
SHOWCASE_BASE_URL=http://127.0.0.1:13030 npm run showcase:thumbs
```

生成物 (`public/showcase-thumbs/**/*.png` + `manifest.json`) は repo にコミットする（合計 ~1.5 MB）。

### 4.6 完了条件（Definition of Done）

- `npm run design:verify` が成功
- `npm run type-check` が成功
- 生成物差分が意図どおりでレビュー済み
- PR ラベル運用が目的に合っている（post/no-post, mode）
- ドキュメント更新が必要な変更は `DESIGN.md` / `design/README.md` に反映済み

---

## 5. 更新ルール

- SSOT 運用ルール変更時は、必ず次を同時更新する:
  - `.github/workflows/design-verify.yml`
  - `design/README.md`
  - `SSOT_RUNBOOK.md`（本書）
- PR コメント制御ルールを変更した場合は、`ssot-comment:post` と `ssot-comment:no-post` の実地確認を最低 1 回行う。
