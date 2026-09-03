import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Badge } from "@gunjo/ui";
import { LocalNav } from "@/components/layout/TableOfContents";
import { COLD_TEST_ROUND_COUNT } from "@/lib/cold-test-count";
import gallery from "@/data/cold-test-gallery.json";

// 「このサイトの読み方」— site-wide orientation page (KeEem decision
// 2026-08-22, issue #880). The core is the 2×2: who reads (人間/AI) ×
// what they look at (見本/試験), with JA readers entering top-left and
// EN readers entering bottom-right. JA-only for now; the EN version is
// a separate task per the JA/EN split decision.

interface GalleryShape {
    categories: string[];
}
// Industry count, computed the same way as /cold-tests/why (WhyView):
// transport modes are cited separately (listed by name below) and the
// generic category is not an industry, so both are excluded to avoid
// double counting. Everything is derived from the gallery snapshot so
// the prose tracks the series as it grows.
const TRANSPORT_CATEGORY_PREFIX = "運輸：";
const GENERIC_CATEGORY = "基盤UI・汎用";
const INDUSTRY_COUNT = (gallery as GalleryShape).categories.filter(
    (category) =>
        category !== GENERIC_CATEGORY &&
        !category.startsWith(TRANSPORT_CATEGORY_PREFIX),
).length;
const TRANSPORT_MODES = (gallery as GalleryShape).categories
    .filter((category) => category.startsWith(TRANSPORT_CATEGORY_PREFIX))
    .map((category) => category.slice(TRANSPORT_CATEGORY_PREFIX.length));

const TITLE = "このサイトの読み方";
const DESCRIPTION = `gunjo.jp の案内図。読み手（人間と AI）と見るもの（見本と試験）で分かれる4つの面、コールドテストとは何か、見つかった不備の3つの状態、この試験で言えること・言えないこと。`;
const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");
const URL = `${SITE_URL}/how-to-read`;

export const metadata: Metadata = {
    title: `${TITLE} — GunjoUI`,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: URL,
        type: "article",
        siteName: "GunjoUI",
    },
};

// The four faces of the 2×2. DOM order = TL, TR, BL, BR so the mobile
// single-column stack reads in the JA entry order (見本 first).
const QUADRANTS = [
    {
        key: "human-sample",
        row: "人間が読む",
        col: "見本",
        title: "完成した画面を見る",
        body: "自分の業種の業務画面が、実際にどんな見た目で組めるのかを確かめる面です。コンポーネント（画面を組み立てる部品）の一覧と、業種ごとの画面の見本があります。",
        href: "/showcase",
        linkLabel: "コンポーネントと見本の一覧へ",
        entry: "日本語圏の読者の多くは、ここから入ります",
    },
    {
        key: "human-test",
        row: "人間が読む",
        col: "試験",
        title: "試験の記録を読む",
        body: "作る過程の記録そのものを読む面です。何がすぐに組めて、どこにコンポーネントが足りず、見つかった不備がいまどの状態にあるか。作り手の主張ではなく、記録で確かめられます。",
        href: "/cold-tests",
        linkLabel: "試験の記録へ",
        entry: null,
    },
    {
        key: "ai-sample",
        row: "AI が使う",
        col: "見本",
        title: "実例を足場にする",
        body: "組み上がった画面はどれも、公開されているコンポーネントだけで組んだ実例です。AI は「この業種の画面はこう組む」の出発点として、そのまま参照できます。",
        href: "/docs/ai-handoff",
        linkLabel: "AI 向けの入口へ",
        entry: null,
    },
    {
        key: "ai-test",
        row: "AI が使う",
        col: "試験",
        title: "AI に試験を受けさせる",
        body: "「gunjo.jp のドキュメントと npm パッケージ（部品の配布物）だけで、AI は本当に画面を組めるか」を測る試験です。英語圏で eval と呼ばれる、AI の実力測定と同じ形式です。",
        href: "/cold-tests/why",
        linkLabel: "この試験の詳しい説明へ",
        entry: "英語圏の読者の多くは、ここから入ります",
    },
] as const;

const FLYWHEEL_STEPS = [
    "AI が画面を組む途中でつまずきます。足りないコンポーネントに当たるか、既存コンポーネントの欠陥に当たるかです。",
    "つまずいた箇所は、その場で記録されます。欠陥は誰でも見られる公開の課題票（GitHub の issue）になり、修正の対象になります。",
    "同じ「このコンポーネントが足りない」という記録が3回たまると、そのコンポーネントを正式に作って群青に加えます。",
    "次の AI は、同じ場所でつまずきません。",
    "コンポーネントが増えるほど、新しいつまずきが起きるのは、まだ試していない種類の画面だけになります。",
] as const;

// The three states a found defect can be in. Deliberately NOT "全部対応済み"
// — the open issues being public is the trust argument (see prose below).
const DEFECT_STATES = [
    {
        label: "対応済み",
        body: "修正が済んで、配布中の最新版に反映されています。",
    },
    {
        label: "直し方記録済み",
        body: "原因と直し方まで特定し、issue として公開しています。修正はこれからです。",
    },
    {
        label: "追跡中",
        body: "再現の条件や原因を、まだ調べています。",
    },
] as const;

const CAN_SAY = [
    `実在の業種の業務画面 ${COLD_TEST_ROUND_COUNT} 枚を組むのに、コンポーネントがどこまで足りたかの実測。`,
    "予備知識ゼロの AI が、ドキュメントと npm パッケージだけで業務画面を組めること。",
    "コンポーネントを組み合わせて実際に操作したときに出る類の不具合を、利用者の画面に載る前に見つけて記録できること。",
] as const;

const CANNOT_SAY = [
    "実データの量。試験の画面は現実的なサンプルデータで組んでいて、数万件の実データを流したときの挙動は測っていません。",
    "実運用。長期間の利用や、実際の利用者の操作でしか出ない問題は、この試験の外にあります。",
    "組織ごとの業務手順。その会社の運用の中でしか再現しない欠陥は、ここでは出ません。",
] as const;

function QuadrantCell({
    quadrant,
}: {
    quadrant: (typeof QUADRANTS)[number];
}) {
    return (
        <div
            className={`flex flex-col gap-2 rounded-lg border p-4 ${
                quadrant.entry
                    ? "border-primary-border/60 bg-primary-subtle/40"
                    : "border-border/60 bg-card"
            }`}
        >
            {/* Axis chips — mobile only; on sm+ the grid headers carry them */}
            <div className="flex flex-wrap gap-1.5 sm:hidden">
                <Badge variant="outline" className="text-[10px]">
                    {quadrant.row}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                    {quadrant.col}
                </Badge>
            </div>
            <h3 className="text-base font-semibold text-foreground">
                {quadrant.title}
            </h3>
            <p className="flex-1 text-sm leading-6 text-muted-foreground">
                {quadrant.body}
            </p>
            {quadrant.entry && (
                <p className="text-xs font-medium text-primary">
                    {quadrant.entry}
                </p>
            )}
            <Link
                href={quadrant.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
                {quadrant.linkLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
        </div>
    );
}

export default function HowToReadPage() {
    return (
        <div className="container py-10 md:py-12">
            <article className="mx-auto w-full max-w-3xl space-y-10">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {TITLE}
                    </h1>
                    <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                        gunjo.jp
                        は、役割の違う4つの面でできています。読み手が「人間」か「AI」か。見ているものが「見本（完成した画面）」か「試験（作る過程の記録）」か。この2つの分け方で、サイト全体は4つの面に分かれます。このページは、その案内図です。
                    </p>
                    <LocalNav />
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        4つの面
                    </h2>

                    {/* 2×2 figure. Tokens only — and no left-edge color band
                        emphasis (KeEem rule): entry corners are marked by a
                        full-cell subtle tint + text, never a border-l rail.
                        On mobile the grid stacks to one column and each cell
                        shows its axes as chips instead of the headers. */}
                    {/* data-toc-skip: the four cell titles are h3s for
                        structure, but they are figure labels, not page
                        sections — keep them out of the page TOC. */}
                    <figure aria-label="サイトの4つの面の一覧図" data-toc-skip>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr_1fr] sm:gap-x-3 sm:gap-y-3">
                            {/* Column headers (sm+) */}
                            <div className="hidden sm:block" aria-hidden />
                            <div className="hidden text-center text-sm font-semibold text-foreground sm:block">
                                見本
                                <span className="block text-xs font-normal text-muted-foreground">
                                    完成した画面
                                </span>
                            </div>
                            <div className="hidden text-center text-sm font-semibold text-foreground sm:block">
                                試験
                                <span className="block text-xs font-normal text-muted-foreground">
                                    作る過程の記録
                                </span>
                            </div>

                            {/* Row: 人間が読む */}
                            <div className="hidden items-center sm:flex">
                                <span className="text-sm font-semibold text-foreground [writing-mode:vertical-rl]">
                                    人間が読む
                                </span>
                            </div>
                            <QuadrantCell quadrant={QUADRANTS[0]} />
                            <QuadrantCell quadrant={QUADRANTS[1]} />

                            {/* Row: AI が使う */}
                            <div className="hidden items-center sm:flex">
                                <span className="text-sm font-semibold text-foreground [writing-mode:vertical-rl]">
                                    AI が使う
                                </span>
                            </div>
                            <QuadrantCell quadrant={QUADRANTS[2]} />
                            <QuadrantCell quadrant={QUADRANTS[3]} />
                        </div>
                    </figure>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">
                        入口は逆でも、めぐる面は同じ
                    </h3>
                    <p className="leading-7 text-foreground">
                        日本語圏の読者の多くは、左上から入ります。まず完成した画面を見て「自分の業種でも組めそうだ」と確かめ、それから試験の記録へ進みます。英語圏の読者の多くは、右下から入ります。右下の面は
                        AI
                        に受けさせる試験ですが、人間の読者はその結果を確かめに来ます。試験の結果を確かめてから、完成した画面を見に行きます。入口の角は逆ですが、最後には同じ4つの面をひと巡りします。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        コールドテストとは
                    </h2>
                    <p className="leading-7 text-foreground">
                        群青（このサイト gunjo.jp で公開している UI
                        コンポーネント集）を一度も見たことのない AI
                        に、実在の業種の業務画面を組ませる試験です。AI
                        に渡すのは、公開されている npm パッケージと gunjo.jp
                        のドキュメントだけです。組み終えた AI
                        は「どのコンポーネントをそのまま使えたか」「何が足りなくて自前で組んだか」を報告します。これまでに{" "}
                        {COLD_TEST_ROUND_COUNT}{" "}
                        回繰り返してきました。対象は、金融・医療・建設などの{" "}
                        {INDUSTRY_COUNT} 業種と、
                        {TRANSPORT_MODES.join("・")}の
                        {TRANSPORT_MODES.length}
                        つの運輸分野、それに業種を選ばない画面です。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        先につまずいた記録が、次の画面づくりを速くする
                    </h2>
                    <p className="leading-7 text-foreground">
                        この試験は、回を重ねるほど次の画面づくりが速くなる作りになっています。
                    </p>
                    <ol className="ml-5 list-decimal space-y-2 text-foreground">
                        {FLYWHEEL_STEPS.map((step) => (
                            <li key={step} className="leading-7">
                                {step}
                            </li>
                        ))}
                    </ol>
                    <p className="leading-7 text-foreground">
                        これは設計上の狙いというより、実測の結果です。たとえば
                        <Link
                            href="/cold-tests/177"
                            className="font-medium text-primary hover:underline"
                        >
                            建設業の出来高査定（工事の進み具合に応じて支払いを査定する業務）の回
                        </Link>
                        がそうでした。保険金や給与明細のために作ったコンポーネントが、まったく別の業種である建設の画面でそのまま主役を張り、新しく作るものはほとんどありませんでした。（連載の通し番号で
                        #177。番号は未公開の回にも振られるため、公開済みの回数とは一致しません）
                    </p>
                    <p className="leading-7 text-foreground">
                        つまずきの記録には、コンポーネントが足りない話だけでなく、実際に触らないと気づけない類の欠陥も入ります。たとえば数値入力のコンポーネントには「年齢欄に
                        45 と打ったら 75
                        になる」という欠陥がありました。年齢欄の範囲は 18
                        歳から 75
                        歳。1文字打つたびに入力値を範囲内へ丸める作りだったため、4
                        と打った瞬間に下限の 18 に直され、続けて打った 5
                        がその後ろに付いて 185 になり、今度は上限の 75
                        に直されるのです。画面を目で見るだけでは見つからず、実際に打ち込んで初めて出ます。これもコールドテストが実際に画面を操作して見つけ、課題票（
                        <a
                            href="https://github.com/uixhero/gunjo/issues/790"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary hover:underline"
                        >
                            GitHub の issue #790
                        </a>
                        ）として、誰でも見られるまま残っています。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        見つかった不備の、3つの状態
                    </h2>
                    <p className="leading-7 text-foreground">
                        試験で見つかった不備は、それぞれ次のどれかの状態にあります。
                    </p>
                    <ul className="space-y-3">
                        {DEFECT_STATES.map((state) => (
                            <li
                                key={state.label}
                                className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-muted/20 p-3 sm:flex-row sm:items-baseline sm:gap-3"
                            >
                                <Badge
                                    variant="outline"
                                    className="w-fit shrink-0"
                                >
                                    {state.label}
                                </Badge>
                                <span className="text-sm leading-6 text-foreground">
                                    {state.body}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="leading-7 text-foreground">
                        このサイトは「全部対応済みです」とは書きません。未対応の
                        issue がそのまま GitHub
                        で公開されていることが、この試験が実際に回っていることのなによりの証拠だからです。それぞれの不備がいまどの状態にあるかは、リンク先の
                        issue でいつでも確認できます。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        この試験で言えること、言えないこと
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-foreground">
                                言えること
                            </h3>
                            <ul className="ml-5 list-disc space-y-2 text-foreground">
                                {CAN_SAY.map((item) => (
                                    <li key={item} className="leading-7">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-foreground">
                                言えないこと
                            </h3>
                            <ul className="ml-5 list-disc space-y-2 text-foreground">
                                {CANNOT_SAY.map((item) => (
                                    <li key={item} className="leading-7">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        ここから読む
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/showcase"
                            className="inline-flex items-center gap-2 rounded-md border border-primary-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            コンポーネントと見本の一覧
                        </Link>
                        <Link
                            href="/cold-tests"
                            className="inline-flex items-center gap-2 rounded-md border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-border hover:text-primary"
                        >
                            コールドテストの記録
                        </Link>
                        <Link
                            href="/cold-tests/why"
                            className="inline-flex items-center gap-2 rounded-md border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-border hover:text-primary"
                        >
                            なぜコールドテストするか
                        </Link>
                        <Link
                            href="/docs/ai-handoff"
                            className="inline-flex items-center gap-2 rounded-md border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-border hover:text-primary"
                        >
                            AI 向けの入口
                        </Link>
                    </div>
                </section>
            </article>
        </div>
    );
}
