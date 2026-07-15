# @gunjo/ui

[![npm version](https://img.shields.io/npm/v/@gunjo/ui.svg)](https://www.npmjs.com/package/@gunjo/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

[English](./README.md) · **日本語**

*[UIXHERO](https://www.uixhero.com) が手がけるデザインシステム — ライブの [コンポーネントギャラリー](https://www.uixhero.com/resources/ui-components) もどうぞ。*

> ⚠️ **1.0 未満。** 現在の `0.1.0-beta.x` は初の public beta です。`1.0.0` stable まで public API は変わる可能性があります——バージョンを固定し、アップグレード前に [CHANGELOG](./CHANGELOG.md) を確認してください。

**Gunjo（群青）** は SSOT 駆動の React + Tailwind デザインシステムです。**pen デザインソース・React ソース・ドキュメントの 3 軸が常に同期している**ことを検証された 200+ コンポーネントを提供し、人だけでなく AI エージェントからも快適に使えるよう設計しています。

## 「becoming」── 名前について

**群青（ぐんじょう）** は、伝統的な日本の色名に連なる深い青。けれどこの名が指すのは、**まだ青ならず、青になりつつある色**です。夜明け前の空、まだ乾かない墨。完成された青ではなく、これから青になる色──成長と、開かれた可能性の象徴。この *becoming* が、プロジェクトそのものの姿勢でもあります。AI 時代に作られ、完成を急がず、いまも到着し続けているデザインシステム。主役の **群青** を、温かい **媚茶（こびちゃ）** のアクセントが「土」として支えます。

## なぜ Gunjo か

- **単一の正（SSOT）を強制する。** すべての公開コンポーネントは、デザインソース（`.pen`）・実装（`src/`）・ドキュメントの 3 軸で、自動ドリフト検査（`npm run design:verify`）により突合されます。トークン・バリアント・見た目が黙ってズレることがありません。
- **「何を作るか」で整理。** コンポーネントは機能別に分類されています──Inputs · Display · Charts · Feedback · Navigation · Overlay · Layout。抽象的な階層ではなく、用途で引けます。すべて Radix ベースで、アクセシビリティ（ARIA・キーボード）とダークモードを内包。

## 群青を知らない AI に試させた

群青のコンポーネントは、勘で選んだものではありません。うまくいかなかった場所から見つけたものです。

**170 回のコールドテスト**を回しました。毎回、AI に渡すのは**公開された npm パッケージと公開ドキュメントだけ**です。ソースは見せず、予備知識も与えません。その状態で、実在する業種の画面を組ませます。配車、与薬、運航管理、保険金請求、貨物請求。そして、AI が見つけられなかったもの、見つけられずに自前で組んでしまったもの、間違えたところを記録します。

独立した 3 つの画面が同じものを自前で組んだら、そこで初めて作る。この 3回確認のルールから、このライブラリの **26 コンポーネント**が生まれました。3 回に届かなかったものは入れていません。

うまくいかなかった回も含めて、すべて公開しています。5/5 だった画面もあれば、2.5/5 だった画面もあります。後者はこの連載で最も役に立った回でした。足りないものの地図になったからです。

**[gunjo.jp/cold-tests](https://www.gunjo.jp/cold-tests)**

システム全体の形を決めた発見は、**ライブラリを一度も見たことのない AI は、忖度しない検査役になる**ということでした。気を遣う理由がないからです。AI が自前で組んだ箇所には、足りないものがあります。そしてその自前のコードが、何が足りないのかの正確な地図になります。

## AI から使える設計

Gunjo は「エージェントがこれを読んで使う」を後付けではなく第一級の要件として扱います:

- **単一の型付きエントリ** — すべての公開 API を `src/index.ts` から re-export。`import { Button, Card } from '@gunjo/ui'` だけで、エージェント（や人）が API 全体を発見できます。
- **SSOT パイプライン** — 機械可読のコンポーネントメタデータ（`design/*-metadata.json`）が各コンポーネントのバリアントとトークンを記述。
- **AI ハンドオフ面** — 専用のハンドオフ面（docs サイトの `/ai-handoff`、MCP・Figma ガイドを含む）でエージェントがシステムを把握できます。*（公開 Figma ライブラリと MCP サーバは roadmap）*

## クイックスタート

```bash
npm install @gunjo/ui
```

```typescript
// コンポーネント
import { Button, Input, Card } from '@gunjo/ui';
// スタイル
import '@gunjo/ui/styles';
// Tailwind プリセット
import gunjoPreset from '@gunjo/ui/tailwind-preset';
```

> **インストールと import:** `npm install @gunjo/ui` だけで動きます。本パッケージは `dist/` からコンパイル済みの ESM と型定義を配布しており（各コンポーネントの `"use client"` 境界も保持）、Next.js でも Vite でも `transpilePackages` やバンドラの追加設定は不要です。詳細は [docs/adoption.md](./docs/adoption.md)。

**別プロジェクトへ導入する**

- [docs/adoption.md](./docs/adoption.md) — 5 分インストール（ここから）
- [docs/adoption-strategy.md](./docs/adoption-strategy.md) — 配布形態の決定書
- [docs/migration-playbook.md](./docs/migration-playbook.md) — 既存アプリの段階移行
- [docs/dependencies.md](./docs/dependencies.md) — peer dependency 範囲とテスト済みの組み合わせ
- [docs/versioning.md](./docs/versioning.md) — semver 運用と破壊的変更ポリシー

**Gunjo を拡張する**

- [docs/component-addition.md](./docs/component-addition.md) — SSOT 三軸（pen + source + docs）でコンポーネントを追加する手順

## ドキュメントサイト

```bash
npm install
npm run dev      # http://localhost:13030
```

ドキュメントサイトは `@gunjo/ui` を自ら使って（ドッグフーディング）構築されており、全コンポーネント・トークン・パターンの正式リファレンスです。

## Gunjo の作り方

Gunjo は、近い将来あたりまえになっていくと考える、シンプルな役割分担の上に作られています:

- **人が思想と方向を定める** — 何を作るか、何を大事にするか、美意識、すべての判断。
- **Claude と協働して作る** — 実装、網羅的な監査（アクセシビリティ・デザイントークン・全コンポーネントの視覚ドリフト）、そして速い反復。
- **そして AI から使えるよう設計する** — 単一の型付きエントリ、SSOT パイプライン、AI ハンドオフ面。エージェントが人と同じくらい簡単に読んで使えるように。

これは「AI がコンポーネントライブラリを作った」ではありません。一人の人間がビジョンを定め、AI をパートナーに、短いループで試行錯誤を重ねたものです。そしてそれを隠さず明示します——それが誠実で、そして次第に当たり前になっていく、ソフトウェアの作られ方だと考えるからです。

## 貢献・セキュリティ

- [CONTRIBUTING.md](./CONTRIBUTING.md) — 開発参加の手引き、PR、SSOT 三軸ワークフロー
- [SECURITY.md](./SECURITY.md) — 脆弱性報告手順、サポート対象バージョン
- [CHANGELOG.md](./CHANGELOG.md) — リリース履歴
- [CLAUDE.md](./CLAUDE.md) — issue 駆動の working agreement（非自明な作業は issue を切ってから）

タスクは [GitHub Issues](https://github.com/uixhero/gunjo/issues) に集約しています。

## ライセンス

[MIT](./LICENSE) © 2026 4px LLC · built by [UIXHERO](https://www.uixhero.com)
