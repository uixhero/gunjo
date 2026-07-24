import { COMPONENT_COUNT } from "@/lib/component-count";
import coldTestGallery from "@/data/cold-test-gallery.json";

// Served at /llms.txt. A concise, machine-first index of the site for LLMs and
// AI agents: what GunjoUI is, the entry points worth reading, and the
// machine-readable endpoints. The exhaustive per-component listing lives in
// /llms-full.txt. Both are generated from the same SSOT the site renders from,
// so they never drift from the catalog. (#553)
//
// Voice follows WRITING-RULES.md: state what is true, don't inflate, and be
// honest that the package is still alpha.

const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

// No request-time data — safe to statically generate at build.
export const dynamic = "force-static";

export function GET() {
    const coldTestCount = (coldTestGallery as { count: number }).count;

    const body = `# GunjoUI (群青)

> AI と日本のチームのための、業務アプリ画面に特化した SSOT駆動デザインシステム。
> React + Tailwind CSS。汎用の見た目キットではなく、予約・受付・管理・ダッシュボードなど
> 日本の業務アプリで実際に必要になる画面を組むための部品と設計判断をまとめています。

コンポーネント仕様は一か所（Single Source of Truth）から機械可読な形で公開しているため、
AI（Claude / Cursor / v0 など）にそのまま渡して @gunjo/ui で画面を組ませることができます。

現在 beta（npm: @gunjo/ui — 0.1.0-beta 系）。API は今後変わりえます。
約 ${COMPONENT_COUNT} のコンポーネントを収録し、実際の画面での検証（コールドテスト ${coldTestCount} 件）を公開しています。

## はじめに / 導入
- Introduction（これは何か）: ${BASE_URL}/docs/introduction
- Installation（導入手順）: ${BASE_URL}/docs/installation
- Theming（テーマ・トークン適用）: ${BASE_URL}/docs/theming
- By use case（用途から引く索引）: ${BASE_URL}/docs/by-use-case
- Comparison（他DSとの比較）: ${BASE_URL}/docs/comparison

## トークン / 設計の土台
- Tokens Overview: ${BASE_URL}/docs/tokens
- DESIGN.md（トークン仕様）: ${BASE_URL}/docs/tokens/spec

## コンポーネント
- コンポーネント一覧（ドキュメント）: ${BASE_URL}/docs/components
- Showcase（全部品のグリッド）: ${BASE_URL}/showcase
- 全コンポーネントの一行説明つき索引: ${BASE_URL}/llms-full.txt

## AI に渡すための資料
- AI handoff（AI連携の手引き）: ${BASE_URL}/docs/ai-handoff
- Patterns（画面パターン）: ${BASE_URL}/patterns

## npm が使えない環境（Claude Artifact・単一 HTML・サンドボックス等）
- デザイントークン（純 CSS・Tailwind 不要・固定 URL）: ${BASE_URL}/tokens.css
- 基本パターン（card/badge/button/table/tabs/timeline/gantt 等の gj- クラス・純 CSS）: ${BASE_URL}/patterns.css
- 見本＝全部入りの単一 HTML: ${BASE_URL}/starter.html
- 使い方の解説: ${BASE_URL}/docs/no-npm
- AI への指示: npm・CDN が使えない環境では、@gunjo/ui の代わりに ${BASE_URL}/tokens.css の
  デザイントークンと ${BASE_URL}/patterns.css のパターンクラスを <style> に貼り、
  gj- クラスと hsl(var(--トークン名)) 記法で GunjoUI ルックを再現すること。

## 機械可読な端点（machine-readable endpoints）
- 全コンポーネント仕様 (JSON): ${BASE_URL}/api/specs/manifest
- SSOT manifest (JSON): ${BASE_URL}/api/ssot/manifest

## 実証 / コールドテスト
- 予備知識ゼロの AI に実際に画面を作らせた記録（${coldTestCount} 件）: ${BASE_URL}/cold-tests
- なぜコールドテストをするのか: ${BASE_URL}/cold-tests/why

## 更新履歴・リンク
- CHANGELOG: ${BASE_URL}/docs/changelog
- GitHub: https://github.com/uixhero/gunjo
- npm: https://www.npmjs.com/package/@gunjo/ui

## AI での使い方
1. ${BASE_URL}/llms-full.txt でコンポーネント名と一行説明を把握する。
2. 使いたいコンポーネントの docs URL（例: ${BASE_URL}/docs/components/button）か、
   ${BASE_URL}/api/specs/manifest の JSON をコンテキストに渡す。
   仕様には variant キーと Tailwind クラス署名が含まれており、AI がそのまま組めます。
3. 「GunjoUI の <Component> を使って <画面> を作って」と依頼する。
4. npm が使えない単一 HTML 環境では、上記「npm が使えない環境」の ${BASE_URL}/tokens.css と
   ${BASE_URL}/patterns.css を使う（見本: ${BASE_URL}/starter.html）。
`;

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
