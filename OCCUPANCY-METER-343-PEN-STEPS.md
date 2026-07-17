# #343 ③ OccupancyMeter — finish steps (needs Pencil)

> **状態：準備ドラフト（CI 赤）。** `direction="neutral"`（ask a/b）は本線に merge 済み（#654）。
> これは **ask ③「ラベル付き occupancy 合成（caption「2/7卓」+ readout + bar）」**の準備。
> ブランチ：`draft/occupancy-meter-343-blocked-on-pencil`。`.pen` 未登録なので `design:verify`（spec-coverage）は赤。**そのままマージ禁止。**

## すでにこのブランチにあるもの（paste-ready）
- `src/components/display/OccupancyMeter.tsx` — 実装（`Meter` を薄くラップ・完成）。既定 `direction="neutral"`。
- `app/docs/components/occupancy-meter/page.tsx` — docs 下書き（`meta.occupancyMeter` は sync 後に生成）。

## これは何か
`OccupancyMeter` = キャプション行（label ＋ `<value> / <max>` readout）＋ その下に `Meter` バー。
cold-test #95 が「毎回自前で書いた 2/7卓 のキャプション行」を1コンポーネントに。`Meter` を compose するだけの薄い合成。

## Pencil セッションでやること（順番）
1. **Pencil 起動**して `design/display.pen` を開く（`get_editor_state` で接続確認）。
2. **reusable `OccupancyMeter/Default` を作成**（`docs/component-addition.md §1`）。中身は「小さいラベル行＋その下に Meter バー」。Meter を ref で内包できるなら内包、無理なら見た目を再現。
3. **showcase frame 追加**：`AuditShowcase` 配下に `showcase/occupancyMeter` を作り、`OccupancyMeter/Default` への `ref` 子を持たせる（`§1.3`）。
4. **`Cmd+S` で保存**。
5. `npm run design:sync` → `display-metadata.json` に `occupancyMeter`、spec、`src/components/generated/*`（manifest/index）、`app/lib/navigation.ts` が生成される。
6. **docs メタ確認**（`meta.occupancyMeter.title/description`）。
7. **showcase サムネ**：`npm run dev` → `npm run showcase:thumbs`。
8. 検証：`npm run type-check` / `design:verify`（緑化）/ `next build`。
9. **ブラウザ実測**（`/docs/components/occupancy-meter`）：キャプション「2 / 7卓」表示、低い値でもバーが primary（赤くならない）、target マーカー、`role="meter"`。
10. **この PEN-STEPS.md を削除**して正式 PR（`Closes #343`。これで #343 の3 ask 完了）。ブランチは `feat/occupancy-meter-343` に切り直すと綺麗。

## 注意
- `export` は sync が `src/index.ts` を再生成するので手動不要。
- spec-coverage は「src の全 component に spec 必須」。`.pen` 登録まで CI は赤が正しい状態。
- ソース＋docs は temp export で type-check 通過を確認済み（下記の検証ログ参照）。
