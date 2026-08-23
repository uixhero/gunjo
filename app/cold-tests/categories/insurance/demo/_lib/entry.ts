// デモ入口ページの内容定義 — 業務フロー図・画面一覧・来歴ログの唯一の出どころ。
// KeEem決定（2026-08-23）: このデモは「来歴のあるショーケース」＝入口で業務の
// 全体像を先に見せ、画面がどのステップに当たるかを明示する。無い画面は
// 「準備中（今後の回で出題予定）」の仮ページを置き、あるふりをしない
// （ダミーのUI部品も架空のデータも置かない）。仮ページは前後の画面へ
// つないで、業務の流れを通しで辿れるようにする。

import { DEMO_BASE, DEMO_SCREENS, type DemoScreen } from "./fictional";

/** 準備中バッジの文言（フロー図・画面一覧で共通）。
 * 「次の回」ではなく「今後の回」＝回は1画面ずつなので、5画面全部を
 * 次の1回とは書けない（writing-review 2巡目の高指摘）。 */
export const PLANNED_BADGE_JA = "準備中（今後の回で出題予定）";
export const PLANNED_BADGE_EN = "In preparation (future rounds)";

/** 準備中画面の slug。ルートは既存3画面と同じく DEMO_BASE 直下。 */
export type PlannedScreenSlug =
    | "quotes"
    | "applications"
    | "underwriting"
    | "accident-intake"
    | "investigations";

/** フロー図・前後ナビの行き先。既存画面か準備中画面のどちらか。 */
export type FlowTarget =
    | { kind: "screen"; slug: DemoScreen["slug"] }
    | { kind: "planned"; slug: PlannedScreenSlug };

/** フロー図の1ステップ。既存画面 or 準備中画面のページへリンクする。 */
export interface FlowStep {
    ja: string;
    en: string;
    target: FlowTarget;
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
            { ja: "見積", en: "Quotation", target: { kind: "planned", slug: "quotes" } },
            { ja: "申込", en: "Application", target: { kind: "planned", slug: "applications" } },
            { ja: "引受査定", en: "Underwriting", target: { kind: "planned", slug: "underwriting" } },
            { ja: "契約", en: "Policy in force", target: { kind: "screen", slug: "policies" } },
            {
                ja: "異動・更新",
                en: "Endorsements and renewal",
                target: { kind: "screen", slug: "policies" },
            },
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
            { ja: "受付", en: "Intake", target: { kind: "planned", slug: "accident-intake" } },
            { ja: "立件", en: "Case registration", target: { kind: "planned", slug: "investigations" } },
            { ja: "調査", en: "Investigation", target: { kind: "planned", slug: "investigations" } },
            { ja: "査定", en: "Adjudication", target: { kind: "screen", slug: "claims" } },
            { ja: "支払", en: "Payment", target: { kind: "screen", slug: "payments" } },
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

/** 準備中の画面（サイトマップの後半）。フロー図で準備中になっているステップに対応し、
 * 1画面ずつ仮のページ（中身は準備中の表示だけ）を持つ。 */
export interface PlannedScreen {
    slug: PlannedScreenSlug;
    href: string;
    ja: string;
    en: string;
    /** どの業務のどのステップに当たるか。 */
    stepJa: string;
    stepEn: string;
    /** 仮のページに置く「どのステップに当たるか」の1文。 */
    roleJa: string;
    roleEn: string;
    /** 業務の流れで1つ前の画面（流れの起点なら null）。 */
    prev: FlowTarget | null;
    /** 業務の流れで1つ次の画面。 */
    next: FlowTarget | null;
}

export const PLANNED_SCREENS: PlannedScreen[] = [
    {
        slug: "quotes",
        href: `${DEMO_BASE}/quotes`,
        ja: "見積作成",
        en: "Quotation",
        stepJa: "契約のライフサイクル：見積",
        stepEn: "Policy lifecycle: quotation",
        roleJa:
            "保険料の見積を作る画面です。業務の流れ「契約のライフサイクル」の最初のステップに当たります。",
        roleEn:
            "A screen for preparing a premium quotation. It is the first step of the policy lifecycle.",
        prev: null,
        next: { kind: "planned", slug: "applications" },
    },
    {
        slug: "applications",
        href: `${DEMO_BASE}/applications`,
        ja: "申込受付",
        en: "Application intake",
        stepJa: "契約のライフサイクル：申込",
        stepEn: "Policy lifecycle: application",
        roleJa:
            "保険の申し込みを受け付ける画面です。業務の流れ「契約のライフサイクル」で、見積の次のステップに当たります。",
        roleEn:
            "A screen for taking in an application. It follows quotation in the policy lifecycle.",
        prev: { kind: "planned", slug: "quotes" },
        next: { kind: "planned", slug: "underwriting" },
    },
    {
        slug: "underwriting",
        href: `${DEMO_BASE}/underwriting`,
        ja: "引受査定",
        en: "Underwriting workbench",
        stepJa: "契約のライフサイクル：引受査定",
        stepEn: "Policy lifecycle: underwriting",
        roleJa:
            "申し込みを引き受けるかどうかを審査する画面です。業務の流れ「契約のライフサイクル」で、申し込みの次のステップに当たります。",
        roleEn:
            "A screen for deciding whether to accept an application. It follows application in the policy lifecycle.",
        prev: { kind: "planned", slug: "applications" },
        next: { kind: "screen", slug: "policies" },
    },
    {
        slug: "accident-intake",
        href: `${DEMO_BASE}/accident-intake`,
        ja: "事故受付",
        en: "Accident intake",
        stepJa: "事故処理：受付",
        stepEn: "Claims handling: intake",
        roleJa:
            "事故の連絡を受け付ける画面です。業務の流れ「事故処理」の最初のステップに当たります。",
        roleEn:
            "A screen for taking accident reports. It is the first step of claims handling.",
        prev: null,
        next: { kind: "planned", slug: "investigations" },
    },
    {
        slug: "investigations",
        href: `${DEMO_BASE}/investigations`,
        ja: "立件・損害調査",
        en: "Case setup and investigation",
        stepJa: "事故処理：立件・調査",
        stepEn: "Claims handling: registration and investigation",
        roleJa:
            "受け付けた事故の連絡を案件として登録し、損害を調べる画面です。業務の流れ「事故処理」で、受付の次のステップに当たります。",
        roleEn:
            "A screen for registering a reported accident as a case and examining the damage. It follows intake in claims handling.",
        prev: { kind: "planned", slug: "accident-intake" },
        next: { kind: "screen", slug: "claims" },
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
    {
        date: "2026-08-23",
        ja: "まだ作っていない5画面に仮のページを追加（業務の流れを通しで辿れるように）。",
        en: "Placed a placeholder page for each of the five screens not built yet, so the whole flow can be walked through.",
    },
];

/** slug から画面定義を引く。 */
export function screenBySlug(slug: DemoScreen["slug"]): DemoScreen {
    const screen = DEMO_SCREENS.find((s) => s.slug === slug);
    if (!screen) throw new Error(`unknown demo screen: ${slug}`);
    return screen;
}

/** slug から準備中画面の定義を引く。 */
export function plannedBySlug(slug: PlannedScreenSlug): PlannedScreen {
    const planned = PLANNED_SCREENS.find((p) => p.slug === slug);
    if (!planned) throw new Error(`unknown planned screen: ${slug}`);
    return planned;
}

/** フローの行き先の href。 */
export function flowTargetHref(target: FlowTarget): string {
    return target.kind === "screen"
        ? screenBySlug(target.slug).href
        : plannedBySlug(target.slug).href;
}

/** フローの行き先の表示名（画面名）。 */
export function flowTargetLabel(target: FlowTarget, isJa: boolean): string {
    if (target.kind === "screen") {
        const screen = screenBySlug(target.slug);
        return isJa ? screen.navJa : screen.navEn;
    }
    const planned = plannedBySlug(target.slug);
    return isJa ? planned.ja : planned.en;
}
