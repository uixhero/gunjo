// デモ入口ページの内容定義 — 業務フロー図・画面一覧・来歴ログの唯一の出どころ。
// KeEem決定（2026-08-23）: このデモは「来歴のあるショーケース」＝入口で業務の
// 全体像を先に見せ、画面がどのステップに当たるかを明示する。無い画面は
// 「準備中（次の回で出題予定）」として、あるふりをしない。

import { DEMO_SCREENS, type DemoScreen } from "./fictional";

/** 準備中バッジの文言（フロー図・画面一覧で共通）。
 * 「次の回」ではなく「今後の回」＝回は1画面ずつなので、5画面全部を
 * 次の1回とは書けない（writing-review 2巡目の高指摘）。 */
export const PLANNED_BADGE_JA = "準備中（今後の回で出題予定）";
export const PLANNED_BADGE_EN = "In preparation (future rounds)";

/** フロー図の1ステップ。screen があれば既存画面へのリンク、無ければ準備中。 */
export interface FlowStep {
    ja: string;
    en: string;
    screen: DemoScreen["slug"] | null;
}

export interface BusinessFlow {
    id: string;
    titleJa: string;
    titleEn: string;
    /** 図の直前に置く1〜2文の説明（矢印を使わず流れを言葉で言う）。 */
    introJa: string;
    introEn: string;
    steps: FlowStep[];
}

export const BUSINESS_FLOWS: BusinessFlow[] = [
    {
        id: "policy-lifecycle",
        titleJa: "契約のライフサイクル",
        titleEn: "Policy lifecycle",
        introJa:
            "保険の契約は、見積に始まり、申込と引受査定（引き受けるかどうかの審査）を経て成立します。成立後は、住所や車の変更といった異動と、満期ごとの更新を管理し続けます。",
        introEn:
            "A policy starts with a quotation, then moves through application and underwriting (the decision to accept the risk). Once in force, the insurer keeps managing endorsements and renewals.",
        steps: [
            { ja: "見積", en: "Quotation", screen: null },
            { ja: "申込", en: "Application", screen: null },
            { ja: "引受査定", en: "Underwriting", screen: null },
            { ja: "契約", en: "Policy in force", screen: "policies" },
            { ja: "異動・更新", en: "Endorsements and renewal", screen: "policies" },
        ],
    },
    {
        id: "claims-handling",
        titleJa: "事故処理",
        titleEn: "Claims handling",
        introJa:
            "事故の連絡を受け付けたら、請求を案件として登録（立件）し、損害を調査します。調査結果をもとに支払額を査定し、承認を経て保険金を支払います。",
        introEn:
            "After an accident is reported, the claim is registered as a case and the damage is investigated. The payable amount is then adjudicated and, once approved, the claim is paid.",
        steps: [
            { ja: "受付", en: "Intake", screen: null },
            { ja: "立件", en: "Case registration", screen: null },
            { ja: "調査", en: "Investigation", screen: null },
            { ja: "査定", en: "Adjudication", screen: "claims" },
            { ja: "支払", en: "Payment", screen: "payments" },
        ],
    },
];

/** 画面一覧（サイトマップ）— 既存3画面の説明文。リンク先は DEMO_SCREENS から引く。 */
export const SCREEN_DESCRIPTIONS: Record<
    DemoScreen["slug"],
    { ja: string; en: string }
> = {
    policies: {
        ja: "保有契約の一覧と更新管理。失効リスクの追跡、募集人（保険を販売する担当者）と代理店の状況、契約ごとの保険料内訳まで掘り下げられます。",
        en: "The book of policies with renewal management, lapse-risk tracking, agent performance, and a per-policy premium breakdown.",
    },
    claims: {
        ja: "保険金請求の一覧と査定ワークフロー。損害調査の記録、査定明細、必要書類、高額案件の2名承認まで通して操作できます。",
        en: "The claims list and adjudication workflow: investigation records, assessment details, required documents, and two-person approval for high-value cases.",
    },
    payments: {
        ja: "査定が確定した請求の支払管理。認定した損害額から何が差し引かれて今回の支払額になるかを内訳で確かめ、承認して振込を手配します。",
        en: "Payment management for adjudicated claims: see what is deducted from the assessed amount to reach the payable amount, approve, and arrange the transfer.",
    },
};

/** 準備中の画面（サイトマップの後半）。フロー図で準備中になっているステップに対応する。 */
export interface PlannedScreen {
    ja: string;
    en: string;
    /** どの業務のどのステップに当たるか。 */
    stepJa: string;
    stepEn: string;
}

export const PLANNED_SCREENS: PlannedScreen[] = [
    {
        ja: "見積作成",
        en: "Quotation",
        stepJa: "契約のライフサイクル：見積",
        stepEn: "Policy lifecycle: quotation",
    },
    {
        ja: "申込受付",
        en: "Application intake",
        stepJa: "契約のライフサイクル：申込",
        stepEn: "Policy lifecycle: application",
    },
    {
        ja: "引受査定",
        en: "Underwriting workbench",
        stepJa: "契約のライフサイクル：引受査定",
        stepEn: "Policy lifecycle: underwriting",
    },
    {
        ja: "事故受付",
        en: "Accident intake",
        stepJa: "事故処理：受付",
        stepEn: "Claims handling: intake",
    },
    {
        ja: "立件・損害調査",
        en: "Case setup and investigation",
        stepJa: "事故処理：立件・調査",
        stepEn: "Claims handling: registration and investigation",
    },
];

/** 来歴 ⑴ — 出発点になったコールドテストの回。リンク先は /cold-tests/<round>。 */
export interface OriginRound {
    round: number;
    ja: string;
    en: string;
}

export const ORIGIN_ROUNDS: OriginRound[] = [
    {
        round: 101,
        ja: "第101回：保険金請求・査定の画面",
        en: "Round #101: claims and adjudication",
    },
    {
        round: 102,
        ja: "第102回：保険の契約管理の画面",
        en: "Round #102: policy management",
    },
    {
        round: 103,
        ja: "第103回：保険金支払の画面",
        en: "Round #103: claim payments",
    },
];

/** 来歴 ⑵ — 1社のアプリとしてまとめるときに加えた主な変更。 */
export const ADAPTATION_NOTES: { ja: string; en: string }[] = [
    {
        ja: "社名を「群青損害保険」に統一しました（「◯◯海上火災保険」のような、実在の社名を連想させる型を避けて付け直し）。",
        en: "Unified the company name as Gunjo General Insurance (renamed to avoid patterns that evoke real insurers' names).",
    },
    {
        ja: "損保用とは別に作られていた生命保険の2画面（第104回の引受査定・第105回の営業ポータル）は採用していません。生保と損保は別会社という業界の実務に合わせ、損害保険1社のアプリに絞ったためです。",
        en: "The two life-insurance screens built separately from the P&C ones (rounds #104 and #105) were not adopted: life and non-life are separate companies in practice, so the app stays one P&C insurer.",
    },
    {
        ja: "画面ごとに個別に組んでいた金額内訳3箇所（保険料内訳・査定額の算定・支払明細）を、共通のコンポーネントに置き換えました。使ったのは、このサイトのUIコンポーネント集 @gunjo/ui に後から加わった AmountBreakdown（金額内訳）です。",
        en: "Three amount breakdowns, each built by hand per screen (premium, assessment, payment), were replaced with a shared component: AmountBreakdown, which later joined @gunjo/ui, this site's component library.",
    },
    {
        ja: "第102回の代理店集計では、手数料の額が当月の保険料収入と桁が合っていませんでした。手数料の表示を「年間見込の概算」に改めました。",
        en: "In round #102's agent summary, the commission figure did not match the scale of monthly premium income. Commission is now labeled as an annual estimate.",
    },
    {
        ja: "3画面に共通の外枠（架空である旨の宣言・社名・画面の切り替え）を追加しました。",
        en: "A shared frame (the fictional-company notice, the masthead, and screen navigation) was added across the three screens.",
    },
];

/** 来歴 ⑶ — 変更履歴。以後の変更は日付＋1行でここに追記していく（古い順）。 */
export interface ProvenanceLogEntry {
    date: string;
    ja: string;
    en: string;
}

export const PROVENANCE_LOG: ProvenanceLogEntry[] = [
    {
        date: "2026-08-23",
        ja: "コールドテスト3回分の画面を、1社の業務アプリとして統一（この見本の初版）。",
        en: "Unified the three cold-test screens into one company's operations app (first version of this demo).",
    },
    {
        date: "2026-08-23",
        ja: "入口ページを追加（業務フロー2本・画面一覧・この来歴）。",
        en: "Added this entry page: the two business flows, the screen list, and this history.",
    },
];

/** slug から画面定義を引く。 */
export function screenBySlug(slug: DemoScreen["slug"]): DemoScreen {
    const screen = DEMO_SCREENS.find((s) => s.slug === slug);
    if (!screen) throw new Error(`unknown demo screen: ${slug}`);
    return screen;
}
