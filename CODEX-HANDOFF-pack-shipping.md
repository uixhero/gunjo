# Codex 指示書 — 0.1.x パック出荷（cold-test 由来の新規部品）

> 依頼者: KeEem。作成: Claude Code。Codex は **Pencil が繋がる環境**で実行すること（新規部品は `.pen` 登録が必須）。
> 版ロードマップは #572。現在 `0.1.0-beta.2` 版切り prep が held PR #671（KeEem が 2FA で publish/tag）。

## ゴール
ロードマップ「8月：0.1.x パック出荷」を進める。**cold-test で繰り返し自前実装された（＝ライブラリに足りない）部品**を、3回ルールに従って新規追加する。

## ⛔ 最重要ルール：3回ルール（勝手に作らない）
このライブラリの中核原則（README 参照）：**独立した3画面が同じものを自前実装して初めて作る**。
- feat issue の本文に **`N/3`** マーカーがある（例「cold-test #176 で **1/3**」= 1回目＝**まだ作らない**）。
- **`3/3` 到達 or 「build now」/🟢 のものだけ着手**。`1/3`・`2/3`・🟡「build at 3rd」は**待つ**（追加しない）。
- 判断に迷う古い issue（N/3 記法が無いもの）は、cold-test データで登場回数を確認するか、着手前に KeEem に確認。
- **3回に届かない部品を先回りで作らないこと**（このプロジェクトの意図的な規律。過剰実装は反パターン）。

## データ源（readiness の確認先）
- **feat issue 一覧**：`gh issue list --state open --search "feat in:title"` → 各本文の `N/3` とラウンド番号。
- **cold-test ラウンド**：`app/data/cold-test-rounds/*.json`（最新は 177 など）。
- **公開ページ**：`/cold-tests`（gunjo.jp）と `app/cold-tests/`。「無かった＝自前実装」の記録。
- **3回集計**（もしあれば）：`npm run coldtest-primitives:aggregate` 等のスクリプト（`package.json` の `coldtest-*`）。

## 新規部品の作り方（SSOT 三軸・Pencil 必須）
`docs/component-addition.md` が正典。要約:
1. ブランチ作成（`feat/<kebab>-<issue>`）、`main` を取り込む。
2. **Pencil で該当カテゴリの `.pen`（多くは `design/display.pen`）を開く** → `get_editor_state(include_schema:true)` で接続＆スキーマ取得。
3. **reusable を作成**（近い既存部品を複製して命名・variant を揃える）。1 variant なら `<Name>/Default`。
4. **showcase frame 追加**：`AuditShowcase` 配下に `showcase/<componentKey>`＋各 variant への `ref`。
5. **`Cmd+S` で保存**（保存しないと sync が拾わない）。
6. `src/components/<tier>/<Name>.tsx` を実装（`cva` で variant・RSC 安全に留意＝関数propは serializable 代替 or "use client" ラッパー）。
7. `npm run design:sync` → spec/metadata/variant-keys/index/navigation を自動生成。
8. `app/docs/components/<kebab>/page.tsx` を作成（近い部品の docs を参考・**編集可能なデモ**推奨、特にチャート系）。
9. `npm run type-check` / `npm run design:verify`（緑）/ `next build`。
10. **ブラウザ実測**（main repo で `PORT=13030 npm run dev` → docs ページ）：主要挙動・ARIA・キーボード・console error ゼロ。
11. `npm run showcase:thumbs`（サムネ）。
12. CHANGELOG の `[Unreleased] > ### Added` に1行（影響: none）。
13. PR（`Closes #N`）→ CI 緑 → **up-to-date 化** → squash マージ → `state=MERGED` 確認。

## ⚠️ 罠（Pencil セッションの必読）
1. **`display.pen` を開くと「Some invalid data was skipped while opening this document」警告が出る**（画像URL由来の無害な警告も併発）。**保存でスキップ分が失われる恐れ**。→ 保存後に必ず **`git diff design/display.pen`** で意図しない削除がないか＋**`design:sync`→`design:verify` で既存 spec/coverage/drift が緑のまま**か確認。壊れる兆候があれば保存を破棄して切り分け。（前回 CheckboxCard/OccupancyMeter では喪失ゼロを実測済み。）
2. **マージ規約**：ブランチは **up-to-date 必須**（`BEHIND` だと `gh pr merge` が拒否）→ `gh pr update-branch <N>` → CI 緑待ち → `gh pr merge <N> --squash --delete-branch`。main が進むたび残りが BEHIND に戻るので直列。**マージ確認は `gh pr view <N> --json state -q .state` が `MERGED` か**で（`gh pr merge` の出力文字列で判定しない）。
3. **gunjo.jp は push-to-main で即本番デプロイ**。マージ＝公開。
4. CI ゲート: `design-verify`（design:sync + design:verify + next build）＋ `gitleaks` 両 pass。
5. 二重チェックアウト注意：ランタイム検証は **main repo で `PORT=13030 npm run dev`**。
6. **1 PR = 1 部品**（`docs/component-addition.md` / CONTRIBUTING の粒度規約）。

## 版切りの扱い（Codex はしない）
- 追加は `[Unreleased]` に溜める。**版切り（package.json 更新・CHANGELOG 日付確定）と publish は KeEem 主導**（現行の #671 と同じ流儀）。Codex は勝手に版を上げない。
- 版文字列が site に 8 箇所ハードコードされている点は既知の保守負債（package.json 単一ソース化が別 follow-up 候補）。Codex は触らない。

## 完了条件（各部品）
- [ ] **3回ルール充足**（3/3 到達を確認してから着手）
- [ ] `.pen` 登録・保存、既存 spec を壊していない（`git diff design/display.pen`）
- [ ] `design:sync` 実行、`type-check`/`design:verify` 緑/`next build` 成功
- [ ] docs ページ（編集可能デモ）＋ブラウザ実測（ARIA・キーボード・console 0）
- [ ] showcase サムネ
- [ ] CHANGELOG `[Unreleased]` 追記
- [ ] PR（`Closes #N`）→ CI 緑 → up-to-date → squash マージ → `state=MERGED` 確認
