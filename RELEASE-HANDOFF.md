# リリース引き継ぎ — 次バージョン判断（alpha.4 or 0.1.0-beta.1）

> このファイルは**別セッションでリリース作業をする人向けの自己完結ハンドオフ**。
> 会話コンテキスト無しで、次リリースの版判断→publish まで進められるように書いてある。
> 最終更新: 2026-07-12。

---

## 1. いま何が起きているか（スナップショット）

| 項目 | 状態 |
|---|---|
| `package.json` version | `0.0.1-alpha.3` |
| npm `dist-tags` | `latest: 0.0.1-alpha.3` |
| `v0.0.1-alpha.3` タグ以降のコミット | **30**（すべて `main` にマージ済み・CI グリーン） |
| コンポーネント総数 | **219**（うち **54 が Beta 昇格済み**、残り experimental）SSOT=`design/stability.json` |
| gunjo.jp | **push to main で自動デプロイ**（`.github/workflows/deploy-docs.yml`）→ 常に最新。docs は publish 不要 |
| npm publish | **手動・2FA OTP 必須**（Claude は実行不可。人間が行う） |

**未反映は「版を切る」ことだけ。** コード・docs・CHANGELOG は次リリース候補として準備済み。

---

## 2. 決めること：**alpha.4 か 0.1.0-beta.1 か**

次リリースをどちらで切るかの**最終判断が未確定**。ゲート上は beta を切れる状態（§3）。

| | `0.0.1-alpha.4` | `0.1.0-beta.1`（推奨候補） |
|---|---|---|
| 物語 | 「まだ becoming／実験中」を継続 | 「機能は揃った・API を固め始める」宣言 |
| semver 約束 | ゆるい（alpha は何でも壊せる） | **破壊はマイナーのみ・移行パス提示**（規律開始） |
| dist-tag | 従来どおり `latest` | `latest` にするか `beta` に置くかを決める（下記） |
| 母艦記事 | 書き換え最小 | **「beta 公開」への書き換えが要る**（再ローンチ弾） |
| 前提 | いつでも可 | §3 の4点ゲート達成が前提 → **達成済み** |

**判断材料**: beta ゲート（#572）は達成済みなので、技術的には beta を切れる。残るのは「物語・マーケのタイミング」の経営判断。alpha.3 ローンチ直後（7/20-21）で、beta 再ローンチ弾を「+1〜2週（EN/PH）」に置く計画なら、その弾で beta.1 を切るのが #572 のロードマップどおり。

---

## 3. Beta 昇格ゲート（#572）の達成状況 — **4/4 実質達成**

| # | ゲート | 状態 | 根拠 |
|---|---|---|---|
| 1 | サイレント footgun ゼロ | ✅ | #338 クローズ。RSC 関数 prop が `next build` を壊す問題に CI ビルドゲート＋直列化代替（`valueFormat` 等）＋JSDoc |
| 2 | 第一印象の完成 | ✅ | i18n #326・44px タッチ #362・docs 216部品監査 #559 すべて完了 |
| 3 | semver 規律の開始 | ✅ | `CHANGELOG.md`・`docs/versioning.md` 実在。CHANGELOG に「運用開始」宣言を明記（§下）。**publish 時にこの規律が発効** |
| 4 | 部品昇格 第一波 | ✅ | 54 部品 Beta（目標 30〜50 を超過）#573 クローズ。`/docs/stability` にパッケージ版ゲート追記済（#572） |

→ **技術ゲートはクリア。** beta を名乗る資格はある。

---

## 4. リリース手順（版を決めたら実行）

> 事前に main が最新・クリーンなこと（`git checkout main && git pull`）。

### 共通の下準備（Claude が代行可能な部分）
1. `CHANGELOG.md` の `## [Unreleased]` を確定版の見出しへ（例 `## [0.1.0-beta.1] — 2026-07-XX`）。中身は既に全 30 コミット分が入っている。
2. `package.json` の `version` を確定値へ。
3. 検証: `npm run type-check && npm run design:verify && npm run build` が緑。

### ライブラリ成果物のビルド → publish（**人間が 2FA で実行**）
4. `npm run build:lib`（`dist/` を再生成。`main: ./dist/index.js`。`files` に `dist src docs tailwind-preset.js tailwind-theme-extend.cjs design/*-metadata.json`）
5. 公開:
   - **beta.1 の場合**: `npm publish --tag beta --otp=XXXXXX`
     - ⚠️ **dist-tag の判断**: `beta` に置くと `npm install @gunjo/ui` は従来どおり alpha.3(latest) を取る。**beta を既定にしたい（再ローンチで beta を推す）なら `--tag latest`**。ここは要判断。
   - **alpha.4 の場合**: `npm publish --tag latest --otp=XXXXXX`
6. `git tag v<version> && git push origin v<version>`
7. 確認: `npm view @gunjo/ui dist-tags`

### リリース後
8. **母艦記事の版表記書き換え**（beta の場合）— `promotion/` 配下・Zenn/dev.to 下書きの「becoming/alpha」→「beta 公開」。#6（announcement posts）と連動。
9. #572 のチェックリストを閉じ、クローズ可否をオーナー確認。

---

## 5. このセッションで入った変更（次リリースの中身）

`CHANGELOG.md` の `[Unreleased]` に全記載。要約:
- **#338（beta 単一ブロッカー）解消**: RSC 関数 prop のビルドゲート＋直列化 `valueFormat`/`feeFormat`/`timeFormat`（11チャート＋部品）。
- **#573**: 54 部品を Beta 昇格。
- **#572**: `/docs/stability` にパッケージ版ゲート。
- **新規 API（すべて追加・影響 none）**: `SemanticTone`＋変換器(#294)、`Button.loading`(#305)、`Alert` icon/title/description(#303)、`Badge.size`/`Tag.icon`(#300)、`Sheet.size`(#328)、`Drawer.direction`(#335)、`DatePicker/DateRangePicker` label+description(#315)、`DataTable` caption/aria/hidePaginationSummary(#298,#311)、`MetadataList.wrap`(#284)、`TreeView.onNodeActivate`(#283)、`RadioGroup.disabled`+fieldset継承(#273)、layout gap エイリアス(#330)。
- **a11y/バグ修正**: Radix describedby 警告(#322)、Drawer ポインタ(#335)、DataTable ソート名(#307)/狭幅(#311)、ReferenceValue(#306)、Popover 重複クラス＋drift 訂正(#140)、ChartColor dev 警告(#296)。
- **docs**: Semantic Tones ページ、tabler 案内(#309)、Icon/Banner/renderCard/RSC 注記。

計 20 PR、すべて CI グリーンでマージ・gunjo.jp 反映済み。

---

## 6. beta には不要だが残っているもの

- **#251**（`fix`）— `Alert` の `AlertTitle` 既定 `h5` で見出し順が壊れる（h1→h5）。papercut。beta ブロッカーではない。棚卸しの `fix` 8件中これだけ未消化（他7件は消化済み）。
- **母艦記事の版表記書き換え**（§4-8）— マーケ作業。
- **#492 subpath export** — ロードマップ上 `0.2.0`（破壊枠、1.0 前に消化）。beta には不要。

---

## 7. feat バックログ（新規コンポーネント）は beta の条件では **ない**

open issue の大半（`feat(...)` 53＋`feat:` プリミティブ 13＝**約66件**）は、cold-test で「無かった」と記録された**新規部品**の要望。既存 219 部品とは別枠。
ロードマップ上は **beta 後の `0.1.x`（パック駆動）以降**で足していく位置づけ。**beta を出すのにこれらを消化する必要はない。**
棚卸しは `gh issue list --state open` でいつでも可能。

---

## 8. 落とし穴メモ（作業環境）

- このリポは **main repo（`/Users/hikaby/dev/gunjo`）** と **worktree（`.claude/worktrees/…`）** の二重チェックアウト。dev server（`preview_start` の launch.json）は worktree で動くので、main repo での編集がブラウザに反映されず stale/404 になる。**ランタイム検証は main repo で `PORT=13030 npm run dev` を直接起動**して行う。
- `npm run build`（next build）は dev server を止める。ビルド後にプレビューし直す場合は再起動。
