# Roadmap

GunjoUI が 1.0 に届くまでの、機能と版の予定表。

- 1.0 の条件（部品・docs・見た目）の一覧は GitHub issue [#1040](https://github.com/uixhero/gunjo/issues/1040)。この表の行は、その条件の項目と同じものを並べる
- 版の切り方（何で版を上げるか・いつ出すか）は [versioning.md](./versioning.md) の「beta の間の版の切り方」
- 出た版は、行をこの表から消して [CHANGELOG.md](../CHANGELOG.md) に実績として書く

このファイルはリポジトリの中だけに置く。gunjo.jp のページ・ナビ・sitemap・llms.txt には載せない。

最終更新：2026-10-07

## 予定表

表は1つだけにする。版ごとに見たいときは「予定の版」の列で並べ替える（いまは版の順に並べてある）。版ごとの一覧を別の表として持たない。

| 機能（issue） | 1.0 の条件 | 予定の版 | 予定時期 | 状態 |
|---|---|---|---|---|
| 状態の言葉をそろえる（npm の説明文の `Early alpha` など、alpha と書いた9か所） | docs | `0.1.0-beta.4` | 案：2026-10-23 まで | 作業中（[#1048](https://github.com/uixhero/gunjo/pull/1048)） |
| [#690](https://github.com/uixhero/gunjo/issues/690) `/docs/installation` の旧 alpha の記述（`transpilePackages` 必須） | docs | `0.1.0-beta.4` | 案：2026-10-23 まで | 作業中（[#1048](https://github.com/uixhero/gunjo/pull/1048)） |
| 部品の数の表記をそろえる（200+ / 223 / 237） | docs | `0.1.0-beta.4` | 案：2026-10-23 まで | 作業中（[#1048](https://github.com/uixhero/gunjo/pull/1048)） |
| `/api/specs/manifest` に状態ラベルを出す（`/docs/stability` には「出る」と書いてある） | docs | `0.1.0-beta.4` | 案：2026-10-23 まで | 作業中（[#1048](https://github.com/uixhero/gunjo/pull/1048)） |
| [#492](https://github.com/uixhero/gunjo/issues/492) 重い部品を subpath export に分ける | 部品 | `0.2.0-beta.1` | 案：2026-11-20 まで | 未着手 |
| [#717](https://github.com/uixhero/gunjo/issues/717) Node から素で import すると `ERR_MODULE_NOT_FOUND` になる（`"type": "module"` が無い・拡張子の無い import） | 部品 | `0.2.0-beta.1` | 案：2026-11-20 まで | 未着手 |
| [#684](https://github.com/uixhero/gunjo/issues/684) Server Component からのバレル import で「直った」と言える再現手順を作る | 部品 | `0.2.0-beta.1` | 案：2026-11-20 まで | 未着手 |
| `AIChatInput`・`AIChatMessage` を正式な部品にするか、export から外す | 部品 | `0.2.0-beta.1` | 案：2026-11-20 まで | 未着手 |
| 全部品の状態を決める（`design/stability.json` は Beta 54件・未分類183件） | 部品 | `0.2.0-beta.2` | 案：2026-12-18 まで | 未着手 |
| [#774](https://github.com/uixhero/gunjo/issues/774) 採用ガイドの最小骨格 | docs | `0.2.0-beta.2` | 案：2026-12-18 まで | 未着手 |
| デザイン言語の原則を決める | 見た目 | 未定（原則の決定後） | 原則の決定は 2026-10-20 まで（KeEem） | 未着手 |
| トップ・docs・showcase が原則に沿っている（判定の方法は原則ごとに決める） | 見た目 | 未定（原則の決定後） | 未定（原則の決定後） | 未着手 |
| `1.0.0-rc.1` を出し、2週間、採用先で問題が出なければ `1.0.0` | 3つすべて | `1.0.0-rc.1` | 未定（見た目の版が決まってから） | 未着手 |

## 表の読み方と直し方

- **予定の版**：その項目が入る最初の版の見込み。versioning.md の規則2で、ほかの項目が先に片付いて途中の版が出たら、残った行の版を次の版に書き換える
- **予定時期**：「案」と付いた日付は、前の版から4週間（規則2の「4週間たち `[Unreleased]` が空でないとき」）で数えた期限。それより早く片付けば早く出す。根拠の無い日付は書かない
- **状態**：未着手／作業中（PR を書く）／済。済になった行は、その版が出たときに表から消す
- 破壊的変更（versioning.md の7種類）になる項目は `0.(次).0-beta.1` の行にまとめる。`AIChatInput`・`AIChatMessage` を export から外すなら破壊的変更なので、`0.2.0-beta.1` に置いてある
