# #378 CheckboxCard / CheckboxCardGroup — finish steps (needs Pencil)

> **状態：準備ドラフト（CI 赤）。** ソースと docs は用意済み。**残りは Pencil で `.pen` に登録**して SSOT を揃えるだけ。
> このブランチ：`draft/checkbox-card-378-blocked-on-pencil`。`.pen` 未登録なので `design:verify`（spec-coverage）は赤。**そのままマージ禁止。**

## すでにこのブランチにあるも（paste-ready）
- `src/components/display/CheckboxCard.tsx` — 実装（RadioCard の複数選択版・完成）。
- `app/docs/components/checkbox-card/page.tsx` — docs 下書き（`meta.checkboxCard` は下記 sync 後に生成）。

## API（確定・RadioCard の双子）
- `CheckboxCardGroup`：`role="group"`／`value?: string[]`／`defaultValue?`／`onValueChange?(string[])`／`name?`。トグルで add/remove。**roving tabindex・矢印ナビはしない**（checkbox は各カード独立タブストップ）。
- `CheckboxCard`：`role="checkbox"`＋`aria-checked`。**インジケータは角丸スクエア**（`rounded-[5px]`／radio は丸）。body スロットは RadioCard と同一（title/description/tags/price/highlight/leading/disabledReason）。`name` 時は hidden `<input type="checkbox">`。

## Pencil セッションでやること（順番）
1. **Pencil アプリを起動**して `design/display.pen` を開く（MCP 接続を確認：`get_editor_state`）。
2. **RadioCard の reusable をコピー**して `CheckboxCard/Default` を作る（`docs/component-addition.md §1` 準拠）。
   - 見た目は RadioCard と同じカード body。**選択インジケータだけ丸→角丸スクエア**に。
   - 1 variant のみなので命名は `CheckboxCard/Default`。
3. **showcase frame 追加**：`AuditShowcase` 配下に `showcase/checkboxCard` を作り、`CheckboxCard/Default` への `ref` 子を持たせる（`§1.3` のフォーマット）。
4. **`Cmd+S` で保存**（保存しないと design:sync が拾えない）。
5. 同期：`npm run design:sync`（`design:sync:from-metadata` ではなく通常 sync）。
   - これで `display-metadata.json` に `checkboxCard`、`component-specs/display-core.json` に spec、`src/components/generated/*`（manifest/variant-keys/index）、`app/lib/navigation.ts` が生成される。
6. **docs メタ確認**：`meta.checkboxCard.title/description` が入ったか（docs ページが参照）。必要なら `.pen` 側の name/description を調整して再 sync。
7. **navigation 登録**：display カテゴリに checkbox-card が入ったか（`app/lib/navigation.ts`／自動のはず）。
8. **showcase サムネ**：`npm run dev` → `npm run showcase:thumbs`（`SSOT_RUNBOOK §4.5.1`）。
9. 検証：`npm run type-check` / `npm run design:verify`（緑化）/ `NEXT_TELEMETRY_DISABLED=1 npm run build`。
10. **ブラウザ実測**（`/docs/components/checkbox-card`）：複数選択トグル、スクエアチェック表示、`role="group"`/`role="checkbox"`＋`aria-checked`、キーボード（各カード Tab＋Space でトグル）、disabled+tooltip。
11. **この PEN-STEPS.md を削除**してから正式 PR（`Closes #378`）。ブランチは `draft/…` から `feat/checkbox-card-378` に切り直すと綺麗。

## 注意
- `export` は `.pen` sync が `src/index.ts` を再生成するので**手動 export 不要**（RadioCard と同様）。
- spec-coverage は「src の全 component に spec 必須」（例外は内部ヘルパのみ）。**.pen 登録するまで CI は赤**が正しい状態。
- RadioCard の docs（`app/docs/components/radio-card/page.tsx`）を states の参考に。
