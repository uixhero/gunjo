# Dependency Contract

GunjoUI の peer dependency 範囲、テスト済み組み合わせ、内部依存の方針。

## peer dependencies（採用先が用意するもの）

`package.json` の `peerDependencies`：

```jsonc
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^3.0.0 || ^4.0.0"
}
```

採用先は **同じ React と React DOM のバージョン**を持つこと（mismatch は React 内部で警告）。

> **React 18 サポートについて**：当初は `^18 || ^19` で peer 宣言していたが、内部で React 19 専用 API を採用したため `^19` のみに縮小済。npm 未公開期間中の調整として、初回 publish `0.0.1-alpha.0` の Removed 欄で正式記載（[CHANGELOG.md](../CHANGELOG.md#0010-alpha0--2026-05-04)）。

## テスト済み組み合わせ

| GunjoUI ver | React | React DOM | Tailwind | Next.js | 状態 |
|---|---|---|---|---|---|
| 1.0.0 | 19.x | 19.x | 4.x | 16.x | ✅ 本リポジトリ docs サイトで稼働確認 |
| 1.0.0 | 19.x | 19.x | 3.x | 15.x | ⚠️ 未検証 |
| 1.0.0 | 19.x | 19.x | 4.x | 15.x | ⚠️ 未検証 |

**Phase D（採用ドライラン）まで未検証マスは確認待ち。** 採用先で動かない組み合わせを発見したら issue を立てる。React 18 系の検証行は peer 縮小に伴い削除済。

## runtime dependencies（採用先に transitive install されるもの）

`dependencies` に置いたライブラリは、採用先がどのコンポーネントを使うかに関係なく `@gunjo/ui` の transitive dependency として install される。そのため docs / app 専用の依存はここに置かず、出荷コンポーネントが直接 import する runtime だけに絞る。

主な runtime dependency：

- `@radix-ui/*`（モーダル、ドロップダウン等のヘッドレスプリミティブ）
- `@tabler/icons-react`（出荷コンポーネント内のアイコン）
- `class-variance-authority`（variant 管理）
- `clsx`、`tailwind-merge`（class 結合）
- `cmdk`、`input-otp`、`react-resizable-panels` などのコンポーネント primitive
- `react-day-picker`、`@tanstack/react-table`、`embla-carousel-react`、`framer-motion`、`vaul`、`react-markdown`、`remark-gfm` などの部品専用 runtime

`react` / `react-dom` / `tailwindcss` は採用先と単一インスタンスを共有する必要があるため peer dependency に置き、GUNJO 本体の docs / build 用には dev dependency にも置く。

`next`、`next-themes`、`@next/third-parties`、`shiki` は docs / app 専用なので dev dependency に置く。`lucide-react` は出荷コンポーネントでも docs / app でも使っていないため依存から外す。

## tree-shaking contract

`@gunjo/ui` は JavaScript / TypeScript module を副作用なしとして扱えるよう `sideEffects` を CSS のみに限定している：

```jsonc
{
  "sideEffects": ["./src/globals.css", "**/*.css"]
}
```

これにより bundler が未使用 export を落としやすくしつつ、`@gunjo/ui/styles` の CSS import は副作用として保持する。

### Radix UI のバージョン

GunjoUI 内部で Radix UI を多用している。ヘッドレス UI を別プロバイダーに差し替える設計はしていない。Radix 側の major bump があった場合、GunjoUI も追随して MAJOR バンプする可能性が高い（採用先には透過）。

### Tailwind CSS のバージョン分岐

- v3：`tailwind-preset.js` を `tailwind.config.ts` の `presets` に追加
- v4：`tailwind-theme-extend.cjs` を CSS の `@theme` ベース取り込み

GunjoUI の export `@gunjo/ui/tailwind-preset` は **v3 形式** を返す。v4 利用時は別途 `tailwind-theme-extend.cjs` を読む必要がある。詳細は [adoption.md](./adoption.md#2-tailwind-プリセット取り込み) 参照。

## CSS の前提

GunjoUI は以下の CSS variables を `@gunjo/ui/styles` で定義する：

- 色系：`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--card`, `--popover`, など
- spacing / radius：`--radius`
- chart palette：`--chart-1` 〜 `--chart-5`

採用先で同名の variable を独自定義していると衝突するため、GunjoUI を入れた後は採用先側の token 定義を整理する（[migration-playbook.md](./migration-playbook.md#stage--トークン-css-の差し替え) 参照）。

## TypeScript の前提

- TypeScript 5.0 以上推奨
- `tsconfig.json` の `moduleResolution` が `bundler` または `nodeNext` であること
- 厳密モード（`strict: true`）でも動く

GunjoUI 自身は `tsc --noEmit --incremental false` で型チェック緑。採用先側で型エラーが出る場合、`tsconfig.json` の compatibility（`jsx`, `target`, `lib`）を確認する。

## Node.js の前提

開発時：Node.js 20 以上（Pencil / Puppeteer 関連スクリプトの要件）。
採用先：採用先が使う Node が `npm install` 可能な範囲（特に縛りなし）。

## Browser support

採用先プロジェクトの判断に任せる。GunjoUI 自身は modern evergreen（Chrome / Edge / Firefox / Safari の latest 2 versions）想定。IE 対応は **しない**。

## 関連

- [adoption.md](./adoption.md) — 導入時に揃えるべきこと
- [versioning.md](./versioning.md) — peer 範囲が変わる時の MAJOR バンプポリシー
- [migration-playbook.md](./migration-playbook.md) — トークン衝突の解消手順
