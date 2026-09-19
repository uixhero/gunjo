// 架空の保険会社の定義 — このデモに登場する社名・組織・宣言文の唯一の出どころ。
// 社名は実在の保険会社・共済に似せない（音写・一字違いも避ける）こと。
// scripts/check-fictional-names.mjs が、この宣言文の存在と実在社名の混入を検査する。

/** 架空の社名（正式） */
export const FICTIONAL_COMPANY_FULL = "群青損害保険株式会社";
/** 架空の社名（表示用） */
export const FICTIONAL_COMPANY = "群青損害保険";
/** 架空の社名（英語表示用） */
export const FICTIONAL_COMPANY_EN = "Gunjo General Insurance";

/** 架空の宣言 — 全画面のシェルに常時表示する。 */
export const FICTIONAL_DISCLAIMER_JA = `これは架空の保険会社「${FICTIONAL_COMPANY}」のデモです。実在の会社・商品とは関係なく、保険の勧誘ではありません。`;
export const FICTIONAL_DISCLAIMER_EN = `This is a demo of a fictional insurer, ${FICTIONAL_COMPANY_EN}. It has no relation to any real company or product, and it is not a solicitation of insurance.`;

export interface DemoScreen {
    slug: "policies" | "claims" | "payments";
    href: string;
    /** ナビのタブ表示（短い） */
    navJa: string;
    navEn: string;
    /** 画面の正式名（h1・metadata title） */
    titleJa: string;
    titleEn: string;
}

export const DEMO_BASE = "/cold-tests/categories/insurance/demo";

export const DEMO_SCREENS: DemoScreen[] = [
    {
        slug: "policies",
        href: `${DEMO_BASE}/policies`,
        navJa: "契約管理",
        navEn: "Policies",
        titleJa: "契約管理ダッシュボード",
        titleEn: "Policy management dashboard",
    },
    {
        slug: "claims",
        href: `${DEMO_BASE}/claims`,
        navJa: "請求・査定",
        navEn: "Claims",
        titleJa: "保険金請求・査定管理",
        titleEn: "Claims and adjudication",
    },
    {
        slug: "payments",
        href: `${DEMO_BASE}/payments`,
        navJa: "支払・精算",
        navEn: "Payments",
        titleJa: "保険金支払・精算管理",
        titleEn: "Claim payments and settlement",
    },
];
