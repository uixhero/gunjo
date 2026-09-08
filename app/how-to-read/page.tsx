import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Badge, Button } from "@gunjo/ui";
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
        // "公開されているコンポーネントだけで組んだ" contradicted the section
        // below, which says the AI reports "何が足りなくて自前で組んだか"
        // (writing-review, 2026-09-08): if it hand-rolled the missing pieces,
        // the screens are not built from published components alone.
        body: "組み上がった画面はどれも、公開されているコンポーネントを土台に組んだ実例です。足りずに自前で補った箇所も記録に残っています。AI は「この業種の画面はこう組む」の出発点として参照できます。",
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

// Narrow-width map of the same 2×2. Below `sm` the card grid stacks into one
// column, so the axis headers disappear and the prose below ("左上から入ります"
// / "右下から入ります" / "入口の角") loses its referent — a context-zero reader
// at 375px could not tell which card was which corner and had to rebuild the
// square in their head (figure-review detection, 2026-09-08). This map is that
// square: axis names, the four face names, and the two entry corners, nothing
// else. It carries information, so it keeps a real description rather than
// being hidden from screen readers. On sm+ the card grid already IS the square,
// and the same review found nothing missing there, so the map stays hidden.
const QUADRANT_MAP_ROWS = [
    { axis: "人間", cells: [QUADRANTS[0], QUADRANTS[1]] },
    { axis: "AI", cells: [QUADRANTS[2], QUADRANTS[3]] },
] as const;
const FLYWHEEL_STEPS = [
    "AI が画面を組む途中でつまずきます。足りないコンポーネントに当たるか、既存コンポーネントの欠陥に当たるかです。",
    "つまずいた箇所は、その場で記録されます。欠陥は誰でも見られる公開の課題票（GitHub の issue）になり、修正の対象になります。",
    "同じ「このコンポーネントが足りない」という記録が3回たまると、そのコンポーネントを正式に作って群青に加えます。",
    "次の AI は、同じ場所でつまずきません。",
    "コンポーネントが増えるほど、新しいつまずきが起きるのは、まだ試していない種類の画面だけになります。",
] as const;

// The age-field defect, one step per line: the reader has to carry the field's
// current value from step to step, and it changes three times.
const AGE_FIELD_STEPS = [
    "「4」と打ちます。18 より小さいので、その場で下限の 18 に直されます。",
    "続けて「5」と打ちます。18 の後ろに付いて 185 になります。",
    "185 は 75 より大きいので、今度は上限の 75 に直されます。",
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

// Footer doors, in reading order: the sample first (where most JA readers
// go next), then the record, the argument behind it, and the AI entrance.
const READ_NEXT = [
    { href: "/showcase", label: "コンポーネントと見本の一覧" },
    { href: "/cold-tests", label: "コールドテストの記録" },
    { href: "/cold-tests/why", label: "なぜコールドテストするか" },
    { href: "/docs/ai-handoff", label: "AI 向けの入口" },
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
            {/* The face's own door. It was a plain text link and read as
                body copy (KeEem review 2026-09-08), so each face now ends in
                a real @gunjo/ui Button: filled on the two entry corners,
                outlined on the other two. `w-full` overrides the variant's
                `w-fit` so all four doors share one bottom edge. */}
            <Button
                asChild
                variant={quadrant.entry ? "default" : "outline"}
                className="mt-1 h-auto w-full whitespace-normal py-2 text-center"
            >
                <Link href={quadrant.href}>
                    {quadrant.linkLabel}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </Link>
            </Button>
        </div>
    );
}

function QuadrantMap() {
    return (
        <figure
            className="sm:hidden"
            aria-label="4つの面の配置図。横に見本と試験、縦に人間と AI。左上が「完成した画面を見る」で日本語圏の入口、右上が「試験の記録を読む」、左下が「実例を足場にする」、右下が「AI に試験を受けさせる」で英語圏の入口。"
        >
            <div className="grid grid-cols-[1.75rem_1fr_1fr] gap-1 text-center">
                <div aria-hidden />
                <div className="pb-0.5 text-xs font-semibold text-foreground">
                    見本
                </div>
                <div className="pb-0.5 text-xs font-semibold text-foreground">
                    試験
                </div>
                {QUADRANT_MAP_ROWS.map((row) => (
                    <React.Fragment key={row.axis}>
                        {/* Horizontal, unlike the sm+ grid's vertical row
                            labels: "AI" is Latin, and vertical-rl lays its two
                            letters on their side. The names are short enough to
                            fit the rail upright. */}
                        <div className="flex items-center justify-center text-center text-xs font-semibold leading-4 text-foreground">
                            {row.axis}
                        </div>
                        {row.cells.map((cell) => (
                            <div
                                key={cell.key}
                                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border p-2 text-[11px] leading-4 ${
                                    cell.entry
                                        ? "border-primary-border/60 bg-primary-subtle/40 font-medium text-foreground"
                                        : "border-border/60 bg-muted/20 text-muted-foreground"
                                }`}
                            >
                                <span>{cell.title}</span>
                                {cell.entry && (
                                    <span className="rounded-sm bg-primary-subtle px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                        入口
                                    </span>
                                )}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
                4つの面の配置。この画面の幅では上の4枚が縦に並ぶので、本文が言う「左上」「右下」はこの図で確かめてください。
            </figcaption>
        </figure>
    );
}

export default function HowToReadPage() {
    return (
        <div className="container py-10 md:py-12">
            <article className="w-full space-y-10">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {TITLE}
                    </h1>
                    <p className="text-lg leading-8 text-muted-foreground">
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

                    <QuadrantMap />
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">
                        入口は逆でも、めぐる面は同じ
                    </h3>
                    <p className="leading-7 text-foreground">
                        日本語圏の読者の多くは、左上の「完成した画面を見る」から入ります。自分の業種でも組めそうだと確かめてから、試験の記録へ進みます。英語圏の読者の多くは、その対角にある右下の「AI
                        に試験を受けさせる」から入ります。試験の結果を先に確かめて、それから完成した画面を見に行きます。入る角は逆で、通る順も逆です。それでも、行き着く先は同じ4つの面です。
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
                        は「どのコンポーネントをそのまま使えたか」「何が足りなくて自前で組んだか」を報告します。
                    </p>
                    {/* Split out of the paragraph above: definition and scale
                        ran together as one ~250-character block, and a
                        context-zero reader stopped reading before the list of
                        industries (visual-rhythm detection, 2026-09-08). */}
                    <p className="leading-7 text-foreground">
                        これまでに {COLD_TEST_ROUND_COUNT}{" "}
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
                        になる」という欠陥がありました。年齢欄に入れられるのは
                        18 歳から 75
                        歳。1文字打つたびに、入力値をその範囲内へ丸める作りでした。
                    </p>
                    {/* These three steps used to be one 92-character sentence
                        in which five numbers changed in turn. A context-zero
                        reader read it twice, gave up, and scrolled past the
                        whole section (visual-rhythm detection, 2026-09-08), so
                        the value now changes once per line. */}
                    <ol className="ml-5 list-decimal space-y-2 text-foreground">
                        {AGE_FIELD_STEPS.map((step) => (
                            <li key={step} className="leading-7">
                                {step}
                            </li>
                        ))}
                    </ol>
                    <p className="leading-7 text-foreground">
                        画面を目で見るだけでは見つからず、実際に打ち込んで初めて出ます。この欠陥も、コールドテストが実際に画面を操作して見つけたものです。いまも課題票（
                        <a
                            href="https://github.com/uixhero/gunjo/issues/790"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary hover:underline"
                        >
                            GitHub の issue #790
                        </a>
                        ）として公開されていて、誰でも見られます。
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
                    {/* These were four hand-rolled button lookalikes. The
                        docs site dogfoods Gunjo UI (CLAUDE.md), so they are
                        @gunjo/ui Buttons now — same shape as the 2×2 doors. */}
                    <div className="flex flex-wrap gap-3">
                        {READ_NEXT.map((item, index) => (
                            <Button
                                key={item.href}
                                asChild
                                variant={index === 0 ? "default" : "outline"}
                            >
                                <Link href={item.href}>{item.label}</Link>
                            </Button>
                        ))}
                    </div>
                </section>
            </article>
        </div>
    );
}
