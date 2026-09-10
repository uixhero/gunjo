import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Badge, Button } from "@gunjo/ui";
import { LocalNav } from "@/components/layout/TableOfContents";
import { COLD_TEST_ROUND_COUNT } from "@/lib/cold-test-count";
import gallery from "@/data/cold-test-gallery.json";

// 「このサイトの読み方」— site-wide orientation page (KeEem decision
// 2026-08-22, issue #880). The core is the 2×2: whose doing the face is
// about (人間がすること / AI がすること) × what that doing is aimed at
// (見本/試験). The row axis used to be "読み手が人間か AI か", which broke
// on the AI×試験 face: the AI takes that test, it does not read that face,
// and the card itself says human EN readers enter there (writing-review,
// issue #968 item 1). "主役" was tried next and broke the same face for a
// different reason — a blind reader reads 主役 as "the one acting under
// its own steam", and the AI there is the one being measured, while
// "AI に試験を受けさせる" is grammatically the human's doing
// (writing-review, 2026-09-10). "〜がすること" survives all four: 見る /
// 読む / 画面を組む / 試験を受ける. Entry (which corner a human reader
// starts from) is a separate thing from the axis and is written as such.
// JA readers enter top-left and EN readers bottom-right. JA-only for now;
// the EN version is a separate task per the JA/EN split decision.

interface GalleryShape {
    categories: string[];
    entries: { category: string }[];
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
// The prose used to name the 15 and the 5 without ever saying whether the
// 5 were inside the 15 (issue #968), so it now leads with the total and
// shows the addition. Both halves stay derived, so the sum can't drift.
const INDUSTRY_TOTAL = INDUSTRY_COUNT + TRANSPORT_MODES.length;
// Screens that pick no industry (settings, login, dashboard …). The series
// opened with these, so they are the earliest rounds and always sit inside
// COLD_TEST_ROUND_COUNT — which lets the industry half be the remainder
// instead of a second count that could drift away from the total.
const GENERIC_SCREEN_COUNT = (gallery as GalleryShape).entries.filter(
    (entry) => entry.category === GENERIC_CATEGORY,
).length;
const INDUSTRY_SCREEN_COUNT = COLD_TEST_ROUND_COUNT - GENERIC_SCREEN_COUNT;

const TITLE = "このサイトの読み方";
const DESCRIPTION = `gunjo.jp の案内図。「人間がすること」と「AI がすること」、「見本」と「試験」で分かれる4つの面、コールドテストとは何か、見つかった不具合の3つの状態、この試験で言えること・言えないこと。`;
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
        row: "人間がすること",
        col: "見本",
        title: "完成した画面を見る",
        body: "自分の業種の業務画面が、実際にどんな見た目で組めるのかを確かめる面です。コンポーネント（画面を組み立てる部品）の一覧と、業種ごとの画面の見本があります。",
        href: "/showcase",
        linkLabel: "コンポーネントと見本の一覧へ",
        entry: "日本語圏の読者の多くは、ここから入ります",
    },
    {
        key: "human-test",
        row: "人間がすること",
        col: "試験",
        title: "試験の記録を読む",
        body: "作っている最中の記録そのものを読む面です。何がすぐに組めて、どこにコンポーネントが足りず、見つかった不具合がいまどの状態にあるか。作り手の主張ではなく、記録で確かめられます。",
        href: "/cold-tests",
        linkLabel: "試験の記録へ",
        entry: null,
    },
    {
        key: "ai-sample",
        row: "AI がすること",
        col: "見本",
        title: "実例を足場にする",
        // "公開されているコンポーネントだけで組んだ" contradicted the section
        // below, which says the AI reports "何が足りなくて自前で組んだか"
        // (writing-review, 2026-09-08): if it hand-rolled the missing pieces,
        // the screens are not built from published components alone. The
        // sentence stays; the doer of the face is named up front, because
        // "足場にする"/"手本にする" left the row header "AI がすること"
        // unfilled (writing-review, 2026-09-10).
        body: "AI が、組み上がった画面を読んで、そこから新しい画面を組み始める面です。どれも公開されているコンポーネントを土台に組んだ実例で、コンポーネントが足りずに AI が自前で作って埋めた箇所も、記録に残っています。実例と、AI がそのまま読める仕様書をまとめてあるので、「この業種の画面はこう組む」の出発点になります。",
        href: "/docs/ai-handoff",
        linkLabel: "AI に渡す仕様書へ",
        entry: null,
    },
    {
        key: "ai-test",
        row: "AI がすること",
        col: "試験",
        title: "AI が試験を受ける",
        // The only face where the doer and the reader differ, so it says so
        // outright: the AI takes the test, a human reads the result, and the
        // entry line below is about where a *human* starts reading — a
        // separate thing from the row axis (writing-review, issue #968 item 1).
        body: "「gunjo.jp のドキュメントと npm パッケージ（部品の配布物）だけで、AI は本当に画面を組めるか」を測る試験です。試験を受けるのは AI で、その結果を読むのは人間です。",
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
    { axis: QUADRANTS[0].row, cells: [QUADRANTS[0], QUADRANTS[1]] },
    { axis: QUADRANTS[2].row, cells: [QUADRANTS[2], QUADRANTS[3]] },
] as const;
// Two kinds, two words, fixed here and used nowhere else under another
// name: 足りないもの (a component that does not exist yet) and 不具合 (one
// that exists but misbehaves). The page used to call them 欠陥, 不備 and
// 不具合 by turns, which left "3つの状態" hanging between the two and hid
// the fact that they are handled differently (issue #968). つまずく stays,
// but only as the verb for what the AI does, never as a name for either.
// Both wordings are used twice on the page (here and above the three
// states). They are constants so the two copies can never drift apart —
// a context-zero reader who met "使いたい" once and "欲しい" the next time
// went back to check whether they were the same thing (writing-review).
const KIND_MISSING = "足りないもの（使いたいコンポーネントが群青に無い）";
const KIND_DEFECT = "不具合（あるコンポーネントが正しく動かない）";

// The rail is a couple of characters wide, so CJK line-breaking would split
// the axis name mid-word ("人間がす" / "ること"). Break it after the particle
// instead and render one chunk per line.
function axisLines(axis: string): string[] {
    const at = axis.indexOf("が");
    return at < 0 ? [axis] : [axis.slice(0, at + 1), axis.slice(at + 1)];
}
const FLYWHEEL_STEPS = [
    `AI が画面を組む途中でつまずきます。行き当たるのは、${KIND_MISSING}か、${KIND_DEFECT}かのどちらかです。`,
    "つまずいた箇所は、その場で記録されます。不具合は誰でも見られる公開の課題票（GitHub の issue）になり、修正の対象になります。",
    "同じ「このコンポーネントが足りない」という記録が3回たまると、そのコンポーネントを正式に作って群青に加えます。",
    "そこから先の AI は、同じ場所でつまずきません。不具合も、修正が配られた後は同じです。",
    "コンポーネントが増えるほど、足りないものでつまずく先は、まだ試していない種類の画面だけになります。不具合のほうは、一度試した画面でも新しく見つかります。",
] as const;

// The age-field defect, one step per line: the reader has to carry the field's
// current value from step to step, and it changes three times.
const AGE_FIELD_STEPS = [
    "「4」と打ちます。18 より小さいので、その場で下限の 18 に直されます。",
    "続けて「5」と打ちます。18 の後ろに付いて 185 になります。",
    "185 は 75 より大きいので、今度は上限の 75 に直されます。",
] as const;

// The three states a finding can be in. They apply to BOTH kinds: every
// requirement in app/data/cold-test-findings/*.json carries a status
// (21/21 resolved on main), and FindingList renders the status badge
// without looking at `kind`. The name was DEFECT_STATES back when this
// section spoke only of 不具合. Deliberately NOT "全部対応済み" — the open
// issues being public is the trust argument (see prose below).
const FINDING_STATES = [
    {
        label: "対応済み",
        body: "足りないものはコンポーネントが加わり、不具合は修正が済んで、どちらも配布中の最新版に反映されています。",
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
    `業務画面 ${COLD_TEST_ROUND_COUNT} 枚（うち ${INDUSTRY_SCREEN_COUNT} 枚は実在の業種の画面）を組むのに、コンポーネントがどこまで足りたかの実測。`,
    "予備知識ゼロの AI が、ドキュメントと npm パッケージだけで業務画面を組めること。",
    "コンポーネントを組み合わせて実際に操作したときに出る類の不具合を、利用者の画面に載る前に見つけて記録できること。",
] as const;

const CANNOT_SAY = [
    "実データの量。試験の画面は現実的なサンプルデータで組んでいて、数万件の実データを流したときの挙動は測っていません。",
    "実運用。長期間の利用や、実際の利用者の操作でしか出ない問題は、この試験の外にあります。",
    "組織ごとの業務手順。その会社の運用の中でしか再現しない不具合は、ここでは出ません。",
] as const;

// Footer doors, in reading order: the sample first (where most JA readers
// go next), then the record, the argument behind it, and the AI entrance.
const READ_NEXT = [
    { href: "/showcase", label: "コンポーネントと見本の一覧" },
    { href: "/cold-tests", label: "コールドテストの記録" },
    { href: "/cold-tests/why", label: "なぜコールドテストするか" },
    { href: "/docs/ai-handoff", label: "AI に渡す仕様書" },
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
            aria-label="4つの面の配置図。縦は人間がすることか AI がすることか、横は見本か試験か。左上が「完成した画面を見る」で日本語圏の読者の入口、右上が「試験の記録を読む」、左下が「実例を足場にする」、右下が「AI が試験を受ける」で英語圏の読者の入口。"
        >
            <div className="grid grid-cols-[3.25rem_1fr_1fr] gap-1 text-center">
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
                        <div className="flex flex-col items-center justify-center text-center text-xs font-semibold leading-4 text-foreground">
                            {axisLines(row.axis).map((line) => (
                                <span key={line}>{line}</span>
                            ))}
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
                        は、役割の違う4つの面でできています。分け方は2つあります。1つ目は、その面で描かれているのが「人間がすること」（見る・読む）か「AI がすること」（画面を組む・試験を受ける）か。2つ目は、その面が扱っているのが「見本（完成した画面）」か「試験（作っている最中）」か。この2つで、サイト全体は4つの面に分かれます。このページは、その案内図です。
                    </p>
                    <LocalNav />
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        4つの面
                    </h2>
                    {/* Placed above the square on purpose. In the lead it read
                        as cancelling the split it had just followed; below the
                        square the reader met the puzzle first and its answer
                        second, and went back to the row headers to re-read
                        (writing-review, 2026-09-10). Here it arrives before
                        the square it settles. */}
                    <p className="text-sm leading-6 text-muted-foreground">
                        4つのどの面も、ページを読むのは人間です。分けているのは、その面で描かれている作業のほうです。
                    </p>

                    {/* 2×2 figure. Tokens only — and no left-edge color band
                        emphasis (KeEem rule): entry corners are marked by a
                        full-cell subtle tint + text, never a border-l rail.
                        On mobile the grid stacks to one column and each cell
                        shows its axes as chips instead of the headers. */}
                    {/* data-toc-skip: the four cell titles are h3s for
                        structure, but they are figure labels, not page
                        sections — keep them out of the page TOC. */}
                    <figure
                        aria-label="サイトの4つの面の一覧図。縦は人間がすることか AI がすることか、横は見本か試験か。"
                        data-toc-skip
                    >
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
                                    作っている最中
                                </span>
                            </div>

                            {/* Row: 人間がすること */}
                            <div className="hidden items-center sm:flex">
                                <span className="text-sm font-semibold text-foreground [writing-mode:vertical-rl]">
                                    人間がすること
                                </span>
                            </div>
                            <QuadrantCell quadrant={QUADRANTS[0]} />
                            <QuadrantCell quadrant={QUADRANTS[1]} />

                            {/* Row: AI がすること */}
                            <div className="hidden items-center sm:flex">
                                <span className="text-sm font-semibold text-foreground [writing-mode:vertical-rl]">
                                    AI がすること
                                </span>
                            </div>
                            <QuadrantCell quadrant={QUADRANTS[2]} />
                            <QuadrantCell quadrant={QUADRANTS[3]} />
                        </div>
                    </figure>

                    <QuadrantMap />
                </section>

                {/* h2, not h3: at h3 this sat at the same level as the four
                    card titles above and read as a fifth face (issue #968).
                    It is a summary of all four, so it is its own section. */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        日本語圏と英語圏で、入口が逆になる
                    </h2>
                    <p className="leading-7 text-foreground">
                        日本語圏の読者の多くは、左上の「完成した画面を見る」から入り、見本の2面を見てから、試験の2面へ進みます。英語圏の読者の多くは、その対角にある右下の「AI
                        が試験を受ける」から入り、試験の2面を確かめてから、見本の2面へ来ます。英語圏では、AI
                        にどこまでできるかを測るこの種の試験を eval
                        と呼んでいて、そちらの読者になじみがあるためです。入口は対角で、たどる向きも逆です。それでも、どちらの道も「見本」と「試験」の両方を通ります。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        コールドテストとは
                    </h2>
                    <p className="leading-7 text-foreground">
                        群青（このサイト gunjo.jp で公開している UI
                        コンポーネント集）を一度も見たことのない AI
                        に、業務画面を組ませる試験です。AI
                        に渡すのは、公開されている npm パッケージと gunjo.jp
                        のドキュメントだけです。組み終えた AI
                        は「どのコンポーネントをそのまま使えたか」「何が足りなくて自前で組んだか」を報告します。
                    </p>
                    {/* Split out of the paragraph above: definition and scale
                        ran together as one ~250-character block, and a
                        context-zero reader stopped reading before the list of
                        industries (visual-rhythm detection, 2026-09-08).
                        The breakdown itself then named 15 and 5 without ever
                        saying whether the 5 were inside the 15, and counted
                        all COLD_TEST_ROUND_COUNT screens as 実在の業種のもの
                        even though the generic ones are not (issue #968), so
                        the totals lead and both sums are visible. */}
                    <p className="leading-7 text-foreground">
                        これまでに {COLD_TEST_ROUND_COUNT} 回繰り返し、
                        {COLD_TEST_ROUND_COUNT}{" "}
                        枚の画面を組みました。そのうち {INDUSTRY_SCREEN_COUNT}{" "}
                        枚は実在の業種の画面で、残りの {GENERIC_SCREEN_COUNT}{" "}
                        枚は、設定やログインのように業種を選ばない画面です。業種は全部で{" "}
                        {INDUSTRY_TOTAL} あります。金融・医療・建設などの{" "}
                        {INDUSTRY_COUNT} 業種と、運輸の {TRANSPORT_MODES.length}{" "}
                        業種（{TRANSPORT_MODES.join("・")}）を足した数です。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        先につまずいた記録が、次の画面づくりを速くする
                    </h2>
                    {/* "そういう作りです" used to come first and be taken
                        back four paragraphs later by "設計上の狙いというより、
                        実測の結果です" (issue #968). The measurement leads
                        now, and the mechanism follows as explanation. */}
                    <p className="leading-7 text-foreground">
                        回を重ねるほど、次の画面づくりが速くなっています。狙って設計したというより、記録を数えたらそうなっていました。仕組みはこうです。
                    </p>
                    <ol className="ml-5 list-decimal space-y-2 text-foreground">
                        {FLYWHEEL_STEPS.map((step) => (
                            <li key={step} className="leading-7">
                                {step}
                            </li>
                        ))}
                    </ol>
                    <p className="leading-7 text-foreground">
                        たとえば
                        <Link
                            href="/cold-tests/177"
                            className="font-medium text-primary hover:underline"
                        >
                            建設業の出来高査定（工事の進み具合に応じて支払いを査定する業務）の回
                        </Link>
                        がそうでした。保険金や給与明細のために作ったコンポーネントが、まったく別の業種である建設の画面でもそのまま使えて、新しく作るものはほとんどありませんでした。（連載の通し番号で
                        #177。番号は未公開の回にも振られるため、公開済みの回数とは一致しません）
                    </p>
                    <p className="leading-7 text-foreground">
                        つまずきの記録には、足りないものの話だけでなく、実際に触らないと気づけない類の不具合も入ります。たとえば数値入力のコンポーネントには「年齢欄に
                        45 と打ったら 75
                        になる」という不具合がありました。年齢欄に入れられるのは
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
                        画面を目で見るだけでは見つからず、実際に打ち込んで初めて出ます。この不具合も、コールドテストが実際に画面を操作して見つけたものです。いまも課題票（
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
                        見つかったものの、3つの状態
                    </h2>
                    {/* Which of the two kinds these states apply to was left
                        open, and the two are handled differently: one is
                        counted to three and built, the other is filed and
                        fixed (issue #968). The pair is named again here, each
                        with its own handling, and the sentence that mentions
                        "3つ" comes after both handlings — putting the pair's
                        count first made a reader stop to work out whether the
                        section was about 2 things or 3 (writing-review).
                        The last sentence carries the two 見出し words the
                        round pages actually use: the guide says 足りないもの /
                        不具合, the round page says この回で要ると分かったもの /
                        この回でつまずいたところ, and two context-zero readers
                        could only match them up when the page said so. */}
                    <p className="leading-7 text-foreground">
                        試験で出てくるものは2種類あります。{KIND_MISSING}
                        は、同じ記録が3回たまったらそのコンポーネントを作ります。
                        {KIND_DEFECT}
                        は、課題票にして直します。下に並べる3つは、足りないものと不具合の、どちらにも付きます。回のページでは、足りないものが「この回で要ると分かったもの」、不具合が「この回でつまずいたところ」という見出しの下に並びます。
                    </p>
                    <ul className="space-y-3">
                        {FINDING_STATES.map((state) => (
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
                        このサイトは「全部対応済みです」とは書きません。「直し方記録済み」と「追跡中」の
                        issue がそのまま GitHub
                        で公開されていることが、この試験が実際に回っていることのなによりの証拠だからです。不具合の状態はリンク先の
                        issue で、足りないものの状態は回のページで確認できます。
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
