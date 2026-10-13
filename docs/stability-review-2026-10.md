# 全部品の状態の判定（2026-10-13）

`design/stability.json` を埋めたときの判定の記録。1.0 の条件（[#1040](https://github.com/uixhero/gunjo/issues/1040)）の「部品」の「全部品の状態を決める」にあたる。

このファイルはリポジトリの中だけに置く。gunjo.jp のページ・ナビ・sitemap・llms.txt には載せない。

## 結果

| 状態 | 件数 | 前（2026-10-12） |
|---|---|---|
| Stable | 0 | 0 |
| Beta | 54 | 54 |
| Experimental | 183 | 183（うち未分類 183） |
| 合計 | 237 | 237 |

- 全 237 件を `design/stability.json` に書いた。未分類（書いていないので既定の Experimental になる部品）は 0 件になった
- 状態が変わった部品は無い。上げられる部品が無かったのではなく、**基準の「a11y レビュー通過」の記録が1件も見つからない**ため、上げてよいかを決められなかった（下の「決めてほしいこと」）
- 下げた部品も無い。`/docs/stability` には上がる条件しか書いていないので、条件を満たさなくなった Beta をどうするかは決まっていない

## 基準

`/docs/stability`（`app/docs/stability/page.tsx`）の文言をそのまま使った。足しても緩めてもいない。

- **Stable**：Beta で最低 1 マイナー期間 API 破壊的変更ゼロ、過去の形からの移行ドキュメント完備
- **Beta**：機能完成、/docs の Props 完全カバー、a11y レビュー通過、本番採用 1 件以上
- **Experimental**：デフォルト

表の番号は次のとおり。①〜④が Beta の4項目、⑤⑥が Stable の2項目。

| 番号 | 項目 | 何を測ったか | 出どころ |
|---|---|---|---|
| ① | 機能完成 | 部品の名前が題に出る open issue（a11y 以外）。✓＝0件、△＝あり | `gh issue list --state open`（2026-10-13 取得・245件） |
| ② | Props 完全カバー | 部品の props のうち、gunjo の中で宣言したもの（`src/` の型）が docs の Props の表に全部あるか。✗ のときは表に無い props を書く | 型は TypeScript で読んだ。表は `app/docs/components/<slug>/page.tsx` の `propsData` |
| ③ | a11y レビュー通過 | 通過の記録。✗＝a11y の open issue がある（番号を書く）、記録なし＝通過の記録も open issue も無い | 下の「a11y の記録を探した場所」 |
| ④ | 本番採用 1 件以上 | 自社の採用先 2 つの既定の枝で、実際に使っている部品（import して本文で使っているもの） | 下の「本番採用の数え方」 |
| ⑤ | Beta で 1 マイナー期間、API 破壊的変更ゼロ | `0.1.x` を1つのマイナーとみなし、`0.1.0-beta.1`〜`0.1.0-beta.4` の CHANGELOG と、2つの tag の型の差分 | `CHANGELOG.md`・`v0.1.0-beta.1` と `v0.1.0-beta.4` |
| ⑥ | 過去の形からの移行ドキュメント | 部品の形が変わった記録があるときに、移行の手順が書いてあるか。変わった記録が無いときは「対象なし」 | `CHANGELOG.md` |

### 判定の手順

- いま Experimental の部品：①〜④のどれかが ✗ なら Experimental（確定）。✗ が無くても③が「記録なし」なら、**上げずに Experimental のまま**にし、「白黒つかず＝Beta 候補」と書いた
- いま Beta の部品：②④が ✓・③が ✗ でなく・⑤が ✓ でも、③が「記録なし」なので **上げずに Beta のまま**にし、「白黒つかず＝Stable 候補」と書いた。①は全部品で判断の材料として書いたが、題に名前が出るだけの issue も拾うので、これだけで ✗ にはしていない

## 決めてほしいこと

1. **a11y レビューは何をもって「通過」とするか**。部品ごとの a11y レビューの記録は見つからなかった。この答えが出れば、下の 18 件はそのまま判定できる
   - Stable 候補 11 件：`progress`・`tabs`・`sheet`・`actionQueue`・`card`・`filterChips`・`icon`・`pageHeader`・`timeline`・`button`・`searchInput`（②④⑤⑥は満たし、③は a11y の open issue が無い）
   - Beta 候補 7 件：`authTemplate`・`spinner`・`scrollArea`・`sidebar`・`dropdownMenu`・`popover`・`kanbanBoard`（②④は満たし、③は a11y の open issue が無い）
2. **いまの Beta 54 件のうち 32 件は、Beta の「本番採用 1 件以上」を満たしていない**。この 54 件は 2026-07 に、コールドテストへの登場回数を本番採用の代わりにして上げた（PR #581）。コールドテストは本番採用に数えないので、32 件は Beta の条件に届いていない。基準には下げる条件が無いので、Beta のままにした
   - `banner`・`stepper`・`container`・`vStack`・`dialog`・`drawer`・`amountBreakdown`・`approvalSteps`・`bottomActionBar`・`delta`・`editableDataTable`・`emptyState`・`listCard`・`metadataList`・`meter`・`personCell`・`radioCard`・`referenceValue`・`routeStops`・`separator`・`signedRecord`・`statGroup`・`tag`・`checkbox`・`coSign`・`datePicker`・`form`・`label`・`numberInput`・`radioGroup`・`switch`・`toggleGroup`
3. **simple-blog-sec を採用先に数えるか**。依存に `@gunjo/ui` が無く、部品の写し（`src/components/gunjo-examples/`）をブログの見本に使っている。パッケージの部品を使っているわけではないので、0 件と数えた

## 測り方の詳細

### 本番採用の数え方

2026-10-13 に、次の既定の枝を読んだ（書き換えていない）。

| 採用先 | 枝・コミット | `@gunjo/ui` の版 | 使っている部品 |
|---|---|---|---|
| 4px-hq-dashboard | `main` `d0df6db` | `^0.2.0-beta.1` | 36 件（`components/ui.ts` の再 export を通した import を、使っている側のファイルで数えた。再 export しただけで使っていないものは数えない） |
| design-qa | `main` `1cae3c6`（GitHub の最新） | `^0.0.1-alpha.2` | 3 件（`Progress`・`Spinner`・`TooltipProvider`） |
| simple-blog-sec | `master` `41293c8` | 依存に無い | 0 件（上の 3） |

import した名前は、manifest の `sourceFile` が export している名前に当てて部品にした（例：`SheetContent` は `sheet`）。コールドテストの画面は数えていない。

### Props の測り方

部品の主な export（`Button` など）の第1引数の型から、`src/` の中で宣言された props を集めた。`ref`・`key`・`children`・`className` と、React や Radix から来る props は除いた。docs の Props の表の `name` に無いものを ✗ にした。本文で触れていても、表に無ければ ✗ にした（例：`checkbox` の `label`・`description`、`emptyState` の `headingLevel`）。

### a11y の記録を探した場所

- このリポジトリ：`docs/`・`design/policy/`・`scripts/`（axe などの a11y の検査は無い）・docs の部品ページ（「アクセシビリティ」が出てくる 5 ページは、どれも見本の文言かタグで、a11y の節ではない）
- issue：題に `a11y` が入る issue（open・closed）。部品ごとの「レビュー通過」の issue は無い
- HQ（`~/dev/new-4px`）：`a11y レビュー` で全文を検索して 0 件。`gunjo/promotion/beta-gate-inventory.md` は beta の前に潰す a11y の不具合の一覧で、通過の記録ではない
- 2026-07 の Beta への昇格（PR #581）は「docs/a11y 全件監査（#559）」を根拠に挙げているが、#559 の中身は docs のプレビュー・コードの一致・モバイルの配置などの監査で、a11y のレビューではない

a11y の open issue は題で部品に当てたあと、1件ずつ読んで直した。題に名前があっても良い例として出ているだけのもの（#837・#801 の `Button`、#765 の `Slider`、#778・#767 の `Form`）は外した。本文の表に部品が並んでいるもの（#837・#801 の入力系、#778 の `RadioCard`・`CheckboxCard`、#822 の `RangeSlider`）は足した。

### 0.1.x の破壊的変更

- CHANGELOG：`0.1.0-beta.2`〜`0.1.0-beta.4` の節は、どれも「破壊的変更なし」と書いている。影響 minor は 6 件で、Beta の部品にかかるのは `RouteStops`（既定の状態ラベルを変えた。`statusLabels` 1つで戻せる）・`ListCard`・`ActionQueue`（見た目だけ。公開 API は不変）
- 型の差分：`v0.1.0-beta.1` と `v0.1.0-beta.4` で、237 件の部品のファイルの export と props を比べた。export の削除・props の削除・省略できた props の必須化は 0 件。型が変わったのは `Meter` の `direction`（`neutral` が増えた）と `tone`（`SemanticTone` を受けるようになった）だけで、どちらも受け付ける値が広がっただけ
- `RouteStops` の既定ラベルの変更は、props の型は変わっていないが、呼ぶ側を直さないと表示が変わる。破壊的変更かどうかを決められないので ⑤ を △ にした（本番採用が無いので、どちらにしても Stable にはならない）
- `0.2.0-beta.1` で `DataTable`・`DatePicker`・`Drawer` が root の入口から外れた（破壊的変更・移行表あり）。⑤の期間（`0.1.x`）の外なので ⑤ には数えていない。表の注に書いた

## 部品ごとの表

### A. いま Beta の 54 件（Stable に上げられるか）

| 部品 | ⑤ 0.1.x の破壊的変更 | ⑥ 移行の記述 | ① 機能（題に名前が出る open issue） | ② Props（表に無い props） | ③ a11y | ④ 本番採用 | 判定 |
|---|---|---|---|---|---|---|---|
| `actionQueue` | ✓（0.1.0-beta.3 で severity の見た目を変更＝影響 minor・公開 API は不変。CHANGELOG `[0.1.0-beta.3]` Changed） | 対象なし | △ #792 #750 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `button` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `card` | ✓ | 対象なし | △ #834 #769 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `filterChips` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `icon` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `pageHeader` | ✓ | 対象なし | △ #760 #373 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `progress` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✓ design-qa | Beta のまま（白黒つかず＝Stable 候補） |
| `searchInput` | ✓ | 対象なし | △ #722 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `sheet` | ✓ | 対象なし | △ #840 #781 #769 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `tabs` | ✓ | 対象なし | △ #814 #769 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `timeline` | ✓ | 対象なし | △ #741 | ✓ | 記録なし | ✓ hq-dashboard | Beta のまま（白黒つかず＝Stable 候補） |
| `alert` | ✓（0.1.0-beta.2 で `AlertTitle` の既定要素を h5 から p に（a11y 修正・影響 none・`as` で戻せる）CHANGELOG `[0.1.0-beta.2]` Fixed） | 対象なし | △ #858 #792 #740 | ✓ | ✗ #936 #743 | ✓ hq-dashboard | Beta のまま |
| `amountBreakdown` | ✓ | 対象なし | △ #818 #797 | ✓ | ✗ #949 #786 | ✗ | Beta のまま |
| `approvalSteps` | ✓ | 対象なし | △ #843 | ✓ | 記録なし | ✗ | Beta のまま |
| `avatar` | ✓ | 対象なし | ✓ | ✗ `tooltipAlign` `tooltipContentClassName` `tooltipSide` | 記録なし | ✓ hq-dashboard | Beta のまま |
| `badge` | ✓ | 対象なし | △ #718 | ✗ `as` `onRemove` `removeLabel` | 記録なし | ✓ hq-dashboard | Beta のまま |
| `banner` | ✓ | 対象なし | △ #907 | ✓ | ✗ #743 | ✗ | Beta のまま |
| `bottomActionBar` | ✓ | 対象なし | △ #391 | ✓ | 記録なし | ✗ | Beta のまま |
| `checkbox` | ✓ | 対象なし | △ #773 | ✗ `description` `label` | 記録なし | ✗ | Beta のまま |
| `container` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |
| `coSign` | ✓ | 対象なし | ✓ | ✗ `minSignerLength` | 記録なし | ✗ | Beta のまま |
| `dataTable` | ✓（0.2.0-beta.1 で root の入口から外した（破壊・影響 minor・移行表あり）CHANGELOG `[0.2.0-beta.1]` Removed） | ✓ CHANGELOG `[0.2.0-beta.1]` Removed の移行表（`@gunjo/ui/table`） | △ #857 #825 #823 #756 #752 #739 #668 #126 | ✗ `captionClassName` `getRowState` `headerActions` | ✗ #715 | ✓ hq-dashboard | Beta のまま |
| `datePicker` | ✓（0.2.0-beta.1 で root の入口から外した（破壊・影響 minor・移行表あり）CHANGELOG `[0.2.0-beta.1]` Removed） | ✓ CHANGELOG `[0.2.0-beta.1]` Removed の移行表（`@gunjo/ui/calendar`） | ✓ | ✗ `disabledReason` `disabledReasonLabel` `disabledReasonPortalContainer` `triggerClassName` | ✗ #733 | ✗ | Beta のまま |
| `delta` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |
| `dialog` | ✓ | 対象なし | △ #781 | ✓ | 記録なし | ✗ | Beta のまま |
| `drawer` | ✓（0.2.0-beta.1 で root の入口から外した（破壊・影響 minor・移行表あり）CHANGELOG `[0.2.0-beta.1]` Removed） | ✓ CHANGELOG `[0.2.0-beta.1]` Removed の移行表（`@gunjo/ui/drawer`） | △ #781 | ✓ | 記録なし | ✗ | Beta のまま |
| `editableDataTable` | ✓ | 対象なし | ✓ | ✗ `renderFooterCell` | 記録なし | ✗ | Beta のまま |
| `emptyState` | ✓ | 対象なし | ✓ | ✗ `headingLevel` | 記録なし | ✗ | Beta のまま |
| `form` | ✓ | 対象なし | △ #794 #793 #738 #166 | ✓ | ✗ #771 | ✗ | Beta のまま |
| `input` | ✓ | 対象なし | △ #1007 #751 #746 | ✓ | ✗ #837 #801 | ✓ hq-dashboard | Beta のまま |
| `label` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |
| `lineChart` | ✓ | 対象なし | △ #400 #242 #184 | ✗ `formatValue` `max` `min` `referenceLabel` ほか3 | ✗ #815 | ✓ hq-dashboard | Beta のまま |
| `listCard` | ✓（0.1.0-beta.3 で severity の見た目を変更＝影響 minor・公開 API は不変。CHANGELOG `[0.1.0-beta.3]` Changed） | 対象なし | △ #849 #834 #805 #792 #782 #779 #763 #756 | ✓ | 記録なし | ✗ | Beta のまま |
| `metadataList` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |
| `meter` | ✓（0.1.0-beta.2 で `direction` に `neutral`・`tone` が `SemanticTone` に（広がっただけ・影響 none）CHANGELOG `[0.1.0-beta.2]` Added。型 `MeterTone` に `default` が増えた） | 対象なし | △ #831 #381 | ✓ | 記録なし | ✗ | Beta のまま |
| `numberInput` | ✓ | 対象なし | △ #790 #773 | ✗ `layout` | ✗ #837 #801 #780 | ✗ | Beta のまま |
| `personCell` | ✓ | 対象なし | △ #756 #748 | ✓ | 記録なし | ✗ | Beta のまま |
| `radioCard` | ✓ | 対象なし | △ #830 #791 | ✗ `disabledReasonLabel` | ✗ #778 | ✗ | Beta のまま |
| `radioGroup` | ✓ | 対象なし | ✓ | ✗ `name` | 記録なし | ✗ | Beta のまま |
| `referenceValue` | ✓ | 対象なし | △ #784 | ✓ | 記録なし | ✗ | Beta のまま |
| `routeStops` | △（0.1.0-beta.2 で既定の状態ラベルを変更（影響 minor・`statusLabels` 1つで復元）CHANGELOG `[0.1.0-beta.2]` Changed） | ✓ CHANGELOG `[0.1.0-beta.2]` Changed に復元手順 | △ #905 | ✓ | 記録なし | ✗ | Beta のまま |
| `scheduleGrid` | ✓ | 対象なし | △ #838 #832 #354 | ✗ `cornerLabel` `label` | 記録なし | ✓ hq-dashboard | Beta のまま |
| `select` | ✓ | 対象なし | △ #751 | ✗ `description` `label` | ✗ #837 #801 | ✓ hq-dashboard | Beta のまま |
| `separator` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |
| `signedRecord` | ✓ | 対象なし | △ #736 #312 | ✗ `cannotSignReasonLabel` | ✗ #801 | ✗ | Beta のまま |
| `statGroup` | ✓（0.1.0-beta.2 で `tone` が `SemanticTone` を受理（影響 none）CHANGELOG `[0.1.0-beta.2]` Added） | 対象なし | △ #752 #720 | ✓ | ✗ #753 | ✗ | Beta のまま |
| `statistic` | ✓（0.1.0-beta.2 で `tone` が `SemanticTone` を受理（影響 none）CHANGELOG `[0.1.0-beta.2]` Added） | 対象なし | △ #798 #720 | ✗ `goodWhen` | ✗ #753 | ✓ hq-dashboard | Beta のまま |
| `stepper` | ✓ | 対象なし | △ #843 #820 | ✓ | ✗ #777 | ✗ | Beta のまま |
| `switch` | ✓ | 対象なし | ✓ | ✗ `description` `label` | 記録なし | ✗ | Beta のまま |
| `table` | ✓ | 対象なし | △ #903 | ✓ | ✗ #744 | ✓ hq-dashboard | Beta のまま |
| `tag` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |
| `textarea` | ✓ | 対象なし | △ #1007 | ✓ | ✗ #837 #801 | ✓ hq-dashboard | Beta のまま |
| `toggleGroup` | ✓ | 対象なし | △ #365 | ✗ `disallowEmpty` | 記録なし | ✗ | Beta のまま |
| `vStack` | ✓ | 対象なし | ✓ | ✓ | 記録なし | ✗ | Beta のまま |

### B. いま Experimental の 183 件（Beta に上げられるか）

| 部品 | 分類 | ① 機能（題に名前が出る open issue） | ② Props（表に無い props） | ③ a11y | ④ 本番採用 | 判定 |
|---|---|---|---|---|---|---|
| `authTemplate` | patterns | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Experimental のまま（白黒つかず＝Beta 候補） |
| `dropdownMenu` | overlay | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Experimental のまま（白黒つかず＝Beta 候補） |
| `kanbanBoard` | display | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Experimental のまま（白黒つかず＝Beta 候補） |
| `popover` | overlay | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Experimental のまま（白黒つかず＝Beta 候補） |
| `scrollArea` | layout | ✓ | ✓ | 記録なし | ✓ hq-dashboard | Experimental のまま（白黒つかず＝Beta 候補） |
| `sidebar` | navigation | △ #119 | ✓ | 記録なし | ✓ hq-dashboard | Experimental のまま（白黒つかず＝Beta 候補） |
| `spinner` | feedback | ✓ | ✓ | 記録なし | ✓ design-qa | Experimental のまま（白黒つかず＝Beta 候補） |
| `accordion` | display | △ #787 | ✓ | ✗ #799 | ✗ | Experimental |
| `accordionGroup` | display | ✓ | ✗ `accordionClassName` `controlsLabel` `variant` | 記録なし | ✗ | Experimental |
| `actionDataTable` | display | ✓ | ✗ `aria-label` `aria-labelledby` `caption` `captionClassName` ほか12 | ✗ #732 | ✗ | Experimental |
| `actionProgress` | feedback | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `activityTimelineCard` | display | ✓ | ✗ `caption` `delta` `deltaDescription` `description` ほか2 | 記録なし | ✗ | Experimental |
| `alertDialog` | overlay | △ #842 #781 | ✓ | ✗ #801 | ✓ hq-dashboard | Experimental |
| `analyticsCard` | display | ✓ | ✗ `titleAs` | 記録なし | ✗ | Experimental |
| `appRail` | navigation | △ #974 | ✓ | 記録なし | ✗ | Experimental |
| `approvalWorkflow` | display | △ #399 #312 | ✗ `actor` `now` `stateLabels` `variant` | 記録なし | ✗ | Experimental |
| `aspectRatio` | layout | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `assetCard` | display | △ #802 | ✗ `favoriteLabel` `onFavorite` `previewLabel` `ratingLabel` ほか2 | 記録なし | ✗ | Experimental |
| `assetGrid` | display | △ #658 | ✗ `emptyDescription` `emptyTitle` `gap` `onFavorite` ほか3 | 記録なし | ✗ | Experimental |
| `assetInspectorPanel` | layout | ✓ | ✗ `footer` `header` `onTagsChange` `tooltipPortalContainer` | 記録なし | ✗ | Experimental |
| `avatarGroup` | display | ✓ | ✗ `overflowContentSideOffset` | 記録なし | ✗ | Experimental |
| `bannalyzeTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `barChart` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `blogTemplate` | patterns | △ #755 | ✓ | 記録なし | ✗ | Experimental |
| `breadcrumb` | navigation | ✓ | ✗ `items` `itemsAfterCollapse` `itemsBeforeCollapse` `maxItems` ほか1 | 記録なし | ✗ | Experimental |
| `calendar` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `carousel` | display | △ #839 #769 | ✓ | 記録なし | ✗ | Experimental |
| `chartLegend` | display | ✓ | ✗ `activeIndex` | 記録なし | ✗ | Experimental |
| `chatComposer` | inputs | ✓ | ✗ `labels` `variant` | 記録なし | ✗ | Experimental |
| `chatInput` | inputs | ✓ | ✗ `defaultModelValue` `defaultOptionsOpen` `defaultVoiceActive` `modelValue` ほか8 | 記録なし | ✗ | Experimental |
| `chatMessage` | display | ✓ | ✗ `avatarSrc` `labels` `variant` | 記録なし | ✗ | Experimental |
| `chatPanel` | overlay | ✓ | ✗ `description` `enableAttachments` `labels` `onStop` ほか3 | 記録なし | ✗ | Experimental |
| `chatTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `checkboxCard` | display | ✓ | ✗ `disabledReasonLabel` | ✗ #778 | ✗ | Experimental |
| `checkList` | display | △ #838 #718 | ✓ | 記録なし | ✗ | Experimental |
| `choroplethMap` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `cluster` | layout | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `code` | display | △ #1063 | ✓ | 記録なし | ✗ | Experimental |
| `codeBlock` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `collapsiblePanelToggle` | layout | ✓ | ✗ `asChild` `loading` `size` `tooltipAlign` ほか7 | 記録なし | ✗ | Experimental |
| `colorSwatch` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `combobox` | inputs | ✓ | ✗ `aria-describedby` `aria-invalid` `aria-label` `aria-labelledby` ほか3 | ✗ #837 | ✗ | Experimental |
| `command` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `commandPalette` | navigation | ✓ | ✗ `dialogDescription` | 記録なし | ✗ | Experimental |
| `companyCell` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `concentricProgressCard` | display | ✓ | ✗ `centerLabel` `delta` `deltaDescription` `description` ほか4 | 記録なし | ✗ | Experimental |
| `contextMenu` | overlay | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `copyButton` | inputs | ✓ | ✗ `asChild` `iconSize` `loading` `onCopied` ほか10 | 記録なし | ✗ | Experimental |
| `currencyInput` | inputs | △ #824 #784 #746 | ✓ | 記録なし | ✗ | Experimental |
| `dashboardTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `dateRangePicker` | inputs | △ #825 #817 | ✗ `triggerClassName` | 記録なし | ✗ | Experimental |
| `dayBand` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `desktopPageHeader` | display | △ #814 #760 | ✓ | 記録なし | ✗ | Experimental |
| `deviceFrame` | layout | ✓ | ✗ `defaultPath` `tabTitle` | 記録なし | ✗ | Experimental |
| `distributionBar` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `docNote` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `docsTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `documentPager` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `documentRow` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `donutChart` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `editableField` | inputs | ✓ | ✗ `disabled` `fieldClassName` `inputClassName` | 記録なし | ✗ | Experimental |
| `editorTemplate` | patterns | △ #90 | ✓ | 記録なし | ✗ | Experimental |
| `eventCalendar` | display | ✓ | ✗ `label` | 記録なし | ✓ hq-dashboard | Experimental |
| `expiryBadge` | display | △ #906 #737 #721 #415 | ✓ | 記録なし | ✗ | Experimental |
| `fileTree` | display | ✓ | ✗ `onNodeActivate` | 記録なし | ✗ | Experimental |
| `fileUploader` | inputs | △ #766 | ✓ | ✗ #764 #733 | ✗ | Experimental |
| `filterButton` | inputs | ✓ | ✗ `asChild` `loading` `size` `variant` | 記録なし | ✗ | Experimental |
| `floatingPanel` | overlay | △ #937 | ✗ `dragHandleClassName` | 記録なし | ✗ | Experimental |
| `footer` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `gallery` | display | △ #802 #766 | ✓ | 記録なし | ✗ | Experimental |
| `gantt` | display | △ #845 #788 #652 #651 #354 | ✗ `hourStep` `label` | 記録なし | ✓ hq-dashboard | Experimental |
| `gaugeChart` | display | ✓ | ✗ `thickness` | 記録なし | ✗ | Experimental |
| `grid` | layout | △ #769 | ✓ | 記録なし | ✗ | Experimental |
| `header` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `heatmapChart` | display | ✓ | ✗ `color` `formatValue` `summaryLabel` | 記録なし | ✗ | Experimental |
| `hoverCard` | overlay | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `hStack` | layout | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `imagePreview` | display | △ #766 | ✗ `fallback` `imgProps` `previewLabel` `showSkeleton` | 記録なし | ✗ | Experimental |
| `img` | display | △ #757 | ✓ | 記録なし | ✗ | Experimental |
| `inputOTP` | inputs | △ #746 | ✓ | 記録なし | ✗ | Experimental |
| `inspectorPanel` | layout | △ #381 | ✓ | 記録なし | ✗ | Experimental |
| `itinerary` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `kanbanTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `kbd` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `labeledDonutCard` | display | ✓ | ✗ `caption` `centerLabel` `centerValue` `delta` ほか4 | 記録なし | ✗ | Experimental |
| `landingTemplate` | patterns | △ #112 | ✓ | 記録なし | ✗ | Experimental |
| `layerMenu` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `leaderboard` | display | △ #830 | ✓ | 記録なし | ✗ | Experimental |
| `limitMonitor` | display | △ #829 #827 #737 | ✓ | 記録なし | ✗ | Experimental |
| `lineageGraph` | display | △ #828 #827 | ✓ | 記録なし | ✗ | Experimental |
| `lineChip` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `list` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `liveBadge` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `loyaltySummaryCard` | display | △ #408 | ✓ | 記録なし | ✗ | Experimental |
| `mapControlButton` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `mapStatusCorner` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `markdownRenderer` | display | △ #894 #868 | ✓ | 記録なし | ✗ | Experimental |
| `marqueeFrame` | layout | ✓ | ✗ `defaultPath` `defaultToDeviceViewport` `initialViewport` `labels` ほか4 | 記録なし | ✗ | Experimental |
| `matchCard` | display | △ #763 | ✓ | 記録なし | ✗ | Experimental |
| `mediaLibraryTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `mediaLightbox` | overlay | △ #802 #656 | ✗ `hasNext` `hasPrevious` `labels` `onDetails` ほか4 | 記録なし | ✗ | Experimental |
| `mediaPickerDialog` | overlay | ✓ | ✗ `labels` | 記録なし | ✗ | Experimental |
| `mention` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `menubar` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `miniDistributionBarCard` | display | ✓ | ✗ `caption` `delta` `deltaDescription` `description` ほか11 | 記録なし | ✗ | Experimental |
| `modal` | overlay | △ #781 | ✓ | 記録なし | ✗ | Experimental |
| `navigationMenu` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `navRow` | display | △ #833 | ✓ | 記録なし | ✗ | Experimental |
| `notificationCenter` | feedback | △ #766 #85 | ✓ | 記録なし | ✗ | Experimental |
| `occupancyMeter` | display | △ #800 | ✓ | 記録なし | ✗ | Experimental |
| `onboardingFlow` | overlay | △ #154 | ✗ `backLabel` `canAdvance` `completeLabel` `nextDisabledReason` ほか1 | 記録なし | ✗ | Experimental |
| `onboardingTemplate` | patterns | △ #74 | ✓ | 記録なし | ✗ | Experimental |
| `originDestination` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `pageAside` | navigation | ✓ | ✗ `asideLabel` `closeLabel` `contentLabel` `mobileClassName` ほか2 | 記録なし | ✗ | Experimental |
| `pagination` | navigation | △ #749 | ✓ | 記録なし | ✗ | Experimental |
| `paretoChart` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `passwordGroup` | inputs | ✓ | ✗ `description` `disabled` `error` `id` ほか5 | ✗ #745 | ✗ | Experimental |
| `passwordInput` | inputs | ✓ | ✗ `inputClassName` | 記録なし | ✗ | Experimental |
| `passwordRequirementList` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `passwordStrengthMeter` | inputs | ✓ | ✓ | ✗ #745 | ✗ | Experimental |
| `phoneInput` | inputs | △ #773 #746 | ✗ `description` `label` `showCount` | 記録なし | ✗ | Experimental |
| `pieChart` | display | ✓ | ✗ `totalLabel` | 記録なし | ✗ | Experimental |
| `placePanel` | overlay | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `postalCodeInput` | inputs | △ #746 | ✗ `description` `label` `showCount` | 記録なし | ✗ | Experimental |
| `pricingTemplate` | patterns | △ #830 | ✓ | 記録なし | ✗ | Experimental |
| `progressDialog` | overlay | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `progressWidget` | feedback | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `quadrantMatrix` | display | △ #783 | ✗ `color` `formatValue` `items` `max` ほか10 | 記録なし | ✗ | Experimental |
| `radarChart` | display | ✓ | ✗ `color` `data` `fillOpacity` `formatValue` ほか7 | 記録なし | ✗ | Experimental |
| `radialBarChart` | display | ✓ | ✗ `centerLabel` `centerValue` `data` `formatValue` ほか7 | 記録なし | ✗ | Experimental |
| `rangeBar` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `rangeSlider` | inputs | ✓ | ✗ `disabled` `rangeClassName` `thumbClassName` `trackClassName` | ✗ #822 #765 | ✗ | Experimental |
| `rating` | display | △ #776 | ✓ | 記録なし | ✗ | Experimental |
| `relationshipRow` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `resizable` | layout | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `responsiveAuthCardPattern` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `retentionCohortCard` | display | ✓ | ✗ `caption` `cohorts` `color` `delta` ほか12 | 記録なし | ✗ | Experimental |
| `revealSection` | display | △ #749 | ✓ | 記録なし | ✗ | Experimental |
| `ribbonChart` | display | ✓ | ✗ `formatValue` `layers` `max` `showGrid` ほか5 | 記録なし | ✗ | Experimental |
| `rightRail` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `routeProgress` | feedback | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `safetyBanner` | feedback | △ #850 | ✗ `icon` `titleAs` | 記録なし | ✗ | Experimental |
| `scaleBar` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `scanGate` | inputs | △ #835 | ✓ | 記録なし | ✗ | Experimental |
| `scanInput` | inputs | ✓ | ✗ `labels` | ✗ #837 | ✗ | Experimental |
| `searchableAccordion` | display | ✓ | ✗ `categories` `description` `emptyState` `label` ほか2 | 記録なし | ✗ | Experimental |
| `seatMap` | display | △ #838 #836 #835 #390 | ✗ `label` | ✗ #837 | ✗ | Experimental |
| `sectionList` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `segmentedControl` | inputs | △ #814 #365 | ✓ | ✗ #780 | ✓ hq-dashboard | Experimental |
| `segmentedGaugeCard` | display | ✓ | ✗ `caption` `centerLabel` `delta` `deltaDescription` ほか17 | 記録なし | ✗ | Experimental |
| `segmentTimelineCard` | display | △ #788 | ✗ `caption` `delta` `deltaDescription` `description` ほか15 | 記録なし | ✗ | Experimental |
| `settingsTemplate` | patterns | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `shareModal` | overlay | ✓ | ✗ `apiEndpoint` `labels` | 記録なし | ✗ | Experimental |
| `sidebarItem` | navigation | △ #119 | ✗ `countLabel` `draggable` `isCurrentAncestor` `onDragEnd` ほか3 | 記録なし | ✓ hq-dashboard | Experimental |
| `skeleton` | display | △ #975 #752 #704 | ✓ | 記録なし | ✗ | Experimental |
| `slider` | inputs | △ #1035 | ✗ `formatValue` `label` `showValue` | 記録なし | ✗ | Experimental |
| `sortButton` | inputs | △ #150 | ✗ `asChild` `loading` `size` `variant` | 記録なし | ✗ | Experimental |
| `spacer` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `sparklineChart` | display | △ #184 | ✗ `color` `referenceLabel` `showDots` `showGrid` ほか1 | 記録なし | ✓ hq-dashboard | Experimental |
| `spatialCanvas` | layout | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `stackedBarChart` | display | △ #768 | ✗ `max` `showGrid` `showLabels` `showLegend` ほか2 | 記録なし | ✓ hq-dashboard | Experimental |
| `statusBar` | feedback | △ #90 | ✓ | 記録なし | ✗ | Experimental |
| `statusBoard` | display | △ #851 | ✓ | 記録なし | ✗ | Experimental |
| `statusLevel` | display | △ #902 | ✓ | 記録なし | ✗ | Experimental |
| `statusScreen` | feedback | △ #747 #379 #366 | ✗ `headingLevel` | 記録なし | ✗ | Experimental |
| `stickyNoticeBar` | feedback | △ #810 | ✓ | 記録なし | ✗ | Experimental |
| `stringline` | display | ✓ | ✗ `ariaLabel` `tickInterval` | 記録なし | ✗ | Experimental |
| `swatchGroup` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `tagEditor` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `tagInput` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `textLink` | navigation | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `ticketStub` | display | △ #841 #835 | ✓ | 記録なし | ✗ | Experimental |
| `timelineScrubber` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `timePicker` | inputs | ✓ | ✗ `label` | 記録なし | ✗ | Experimental |
| `timeTransport` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `toast` | feedback | ✓ | ✗ `tooltipPortalContainer` | 記録なし | ✗ | Experimental |
| `toastProvider` | feedback | ✓ | ✗ `labels` `placement` `portalContainer` | 記録なし | ✓ hq-dashboard | Experimental |
| `toggle` | inputs | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `toolPill` | display | ✓ | ✓ | 記録なし | ✗ | Experimental |
| `tooltip` | overlay | △ #832 | ✗ `openOnPress` `pressOpenDuration` | 記録なし | ✓ hq-dashboard・design-qa | Experimental |
| `tooltipButton` | inputs | ✓ | ✗ `asChild` `loading` `tooltipCloseOnPress` `tooltipPortalContainer` | 記録なし | ✗ | Experimental |
| `treeView` | display | △ #787 | ✓ | 記録なし | ✗ | Experimental |
| `weekView` | display | △ #763 | ✗ `hourHeight` `label` `today` | 記録なし | ✗ | Experimental |
