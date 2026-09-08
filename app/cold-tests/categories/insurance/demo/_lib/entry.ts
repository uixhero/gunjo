// デモ入口ページの内容定義 — 業務フロー図・画面一覧・来歴ログの唯一の出どころ。
// KeEem決定（2026-08-23）: このデモは「来歴のあるショーケース」＝入口で業務の
// 全体像を先に見せ、画面がどのステップに当たるかを明示する。無い画面は
// 準備中の仮ページを置き、あるふりをしない
// （ダミーのUI部品も架空のデータも置かない）。仮ページは前後の画面へ
// つないで、業務の流れを通しで辿れるようにする。

import { DEMO_BASE, DEMO_SCREENS, type DemoScreen } from "./fictional";

/** 準備中バッジの文言（フロー図・画面一覧で共通）。
 * 「次の回」ではなく「今後の回」＝回は1画面ずつなので、5画面全部を
 * 次の1回とは書けない（writing-review 2巡目の高指摘）。 */
export const PLANNED_BADGE_JA = "準備中（今後の回で出題予定）";
export const PLANNED_BADGE_EN = "In preparation (future rounds)";

/** 準備中の短い言い方。図と一覧では、上の全文ではなくこちらを使う。
 * 全文は1ページに11回出ていて、5つ並んだ枠が「どれも同じ」に見える
 * 最大の原因になっていた（visual-rhythm 1段目・9件中4件がこの反復）。
 * 全文は仮ページの見出しに1回だけ残す＝意味は失わない。 */
export const PLANNED_BADGE_SHORT_JA = "準備中";
export const PLANNED_BADGE_SHORT_EN = "In preparation";

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

/** 画面一覧に置く実画面サムネイルの代替テキスト。⛔「〜のプレビュー」で埋めない
 * ＝読み上げ環境で情報がゼロになる。画面に何が写っているかを書く。 */
export const SCREEN_SHOT_ALT: Record<DemoScreen["slug"], { ja: string; en: string }> = {
    policies: {
        ja: "契約管理ダッシュボードの画面。上部に6枚の数字のカードが並ぶ（保有している契約の件数、今月の保険料収入、代理店に払う手数料、今月満期になる契約の件数、更新率、失効しそうな契約の件数）。その下に、満期が30日以内に迫った契約を並べた「更新管理・失効リスク」の一覧。",
        en: "The policy management dashboard: six figure cards across the top (policies in force, monthly premium income, agency commission, expiring this month, renewal rate, lapse risk) above a renewal and lapse-risk list of policies expiring within 30 days.",
    },
    claims: {
        ja: "保険金請求・査定管理の画面。上部に7枚の数字のカードが並ぶ（今日届いた請求の件数、査定中の件数、承認待ちの件数、今月支払った保険金、査定にかかった平均日数、社内で決めた対応期限を過ぎた件数、要注意の印がついた件数）。その下に、絞り込みと検索のついた請求一覧の表。",
        en: "The claims and adjudication screen: seven figure cards across the top (new claims today, under adjudication, awaiting approval, paid this month, average days to adjudicate, SLA breaches, flagged for attention) above a claims table with a status filter and a search box.",
    },
    payments: {
        ja: "保険金支払・精算管理の画面。上部に6枚の数字のカードが並ぶ（今日支払う予定の件数、承認待ちの件数、振込を手配中の件数、金額の大きい案件の件数、まだ払っていない金額の合計、今月支払った総額）。その下に、状態で絞り込める支払一覧の表。列は保険証券の番号、支払先、補償の種類、今回支払う額、支払う予定の日、状態、担当。",
        en: "The claim payments and settlement screen: six figure cards across the top (due today, awaiting approval, transfer being arranged, high-value cases, unpaid amount due, total paid this month) above a payments table filtered by status, with policy number, payee, coverage, amount due, due date, status, and owner.",
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
    {
        date: "2026-08-23",
        ja: "入口に図を追加。画面一覧に3画面の写真、業務の流れの図に「どの画面がどのステップを受け持つか」の対応を出し、まだ作っていない画面のページに現在地の図を置いた。",
        en: "Added figures to the entry page: three screenshots in the screen list, a step-to-screen mapping in the flow diagrams, and a you-are-here strip on the placeholder pages.",
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

/** フロー図の1区画＝連続する何ステップかを1つの画面が受け持つ、そのまとまり。 */
export interface FlowRun {
    target: FlowTarget;
    /** この区画が受け持つステップ（連続）。 */
    steps: FlowStep[];
    /** 1始まりの通し番号（表示用）。 */
    firstStepNumber: number;
}

/**
 * ステップの列を「同じ画面が受け持つ連続したまとまり」に畳む。
 *
 * これがフロー図の芯。ステップは10個あるのに画面は8つで、「契約管理」は
 * 契約と異動・更新の2ステップ分を、「立件・損害調査」は立件と調査の
 * 2ステップ分をまたぐ。ステップの粒度と画面の粒度がずれていることが、
 * ステップを1つずつ並べた図では読み取れなかった（figure-review 1段目の
 * 3件が全部これ。3件とも「枠と画面をくくる線」1本で解ける）。
 */
export function flowRuns(flow: BusinessFlow): FlowRun[] {
    const runs: FlowRun[] = [];
    flow.steps.forEach((step, index) => {
        const last = runs[runs.length - 1];
        const sameAsLast =
            last &&
            last.target.kind === step.target.kind &&
            last.target.slug === step.target.slug;
        if (sameAsLast) {
            last.steps.push(step);
            return;
        }
        runs.push({ target: step.target, steps: [step], firstStepNumber: index + 1 });
    });
    return runs;
}

/** ある行き先が属する業務フローを引く（仮ページの現在地表示で使う）。 */
export function flowForTarget(target: FlowTarget): BusinessFlow | null {
    return (
        BUSINESS_FLOWS.find((flow) =>
            flow.steps.some(
                (step) =>
                    step.target.kind === target.kind && step.target.slug === target.slug
            )
        ) ?? null
    );
}

/** 2つの行き先が同じ画面を指すか。 */
export function isSameTarget(a: FlowTarget, b: FlowTarget): boolean {
    return a.kind === b.kind && a.slug === b.slug;
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
