"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowUpRight,
    IconChevronDown,
    IconChevronRight,
} from "@tabler/icons-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Card,
    CardContent,
    cn,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    ADAPTATION_NOTES,
    BUSINESS_FLOWS,
    ORIGIN_ROUNDS,
    PLANNED_BADGE_SHORT_EN,
    PLANNED_BADGE_SHORT_JA,
    PLANNED_SCREENS,
    PROVENANCE_LOG,
    SCREEN_DESCRIPTIONS,
    SCREEN_SHOT_ALT,
    flowRuns,
    plannedBySlug,
    screenBySlug,
    type BusinessFlow,
    type FlowRun,
} from "./_lib/entry";
import { DEMO_SCREENS } from "./_lib/fictional";
import { ScreenShot } from "./_lib/ScreenShot";

const linkClass =
    "inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * 業務フロー図の1区画 — 1つの画面と、その画面が受け持つステップ。
 *
 * ⭐ 図の芯は「ステップの数と画面の数が合わないこと」を形で見せること。
 * 契約のライフサイクルは5ステップだが画面は4つ（契約管理が契約と異動・更新の
 * 2ステップ分をまたぐ）、事故処理も5ステップで画面は4つ（立件・損害調査が
 * 立件と調査をまたぐ）。ステップを1つずつ並べた前の図では、この対応が
 * 枠ごとのリンクに散っていて読み取れなかった（figure-review 1段目の3件）。
 * 区画の幅を受け持ちステップ数に比例させ、またぐ画面が横に広い枠になるようにする。
 *
 * いまある画面とまだ無い画面の差は、文字（以前は「準備中（今後の回で出題予定）」を
 * 1ページに11回）ではなく枠の形で出す＝実線か破線か（visual-rhythm 1段目）。
 * 左端の色帯は使わない（design:verify:left-emphasis）。
 */
function FlowRunCard({ run, isJa }: { run: FlowRun; isJa: boolean }) {
    const screen = run.target.kind === "screen" ? screenBySlug(run.target.slug) : null;
    const planned = run.target.kind === "planned" ? plannedBySlug(run.target.slug) : null;
    const href = screen ? screen.href : planned!.href;
    const name = screen ? (isJa ? screen.navJa : screen.navEn) : isJa ? planned!.ja : planned!.en;

    return (
        <div
            role="listitem"
            style={{ flexGrow: run.steps.length }}
            className={cn(
                "min-w-0 basis-0 rounded-lg p-3",
                screen ? "border bg-card" : "border border-dashed bg-muted/40"
            )}
        >
            <ul className="space-y-1">
                {run.steps.map((step, index) => (
                    <li key={step.ja} className="flex items-center gap-2">
                        <span
                            aria-hidden
                            className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                screen
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {run.firstStepNumber + index}
                        </span>
                        <span
                            className={cn(
                                "text-sm font-semibold",
                                screen ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {isJa ? step.ja : step.en}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="mt-2 border-t pt-2">
                <Link
                    href={href}
                    aria-label={
                        screen
                            ? undefined
                            : isJa
                              ? `準備中の画面「${name}」を開く`
                              : `Open the planned screen: ${name}`
                    }
                    className={cn(
                        "inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        screen
                            ? "font-medium text-primary"
                            : "text-muted-foreground"
                    )}
                >
                    {name}
                    {screen ? null : (
                        <Badge variant="secondary" className="ml-0.5">
                            {isJa ? PLANNED_BADGE_SHORT_JA : PLANNED_BADGE_SHORT_EN}
                        </Badge>
                    )}
                    <IconArrowUpRight className="h-3 w-3 shrink-0" aria-hidden />
                </Link>
            </div>
        </div>
    );
}

/** 業務フロー図 — 画面の区画の列（モバイルは縦・sm以上は横）。 */
function FlowDiagram({ flow, isJa }: { flow: BusinessFlow; isJa: boolean }) {
    const runs = flowRuns(flow);
    return (
        <div role="list" className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
            {runs.map((run, index) => (
                <React.Fragment key={`${flow.id}-${run.firstStepNumber}`}>
                    {index > 0 ? (
                        <div
                            aria-hidden
                            className="flex justify-center text-muted-foreground sm:items-center sm:px-0.5"
                        >
                            <IconChevronDown className="h-4 w-4 sm:hidden" />
                            <IconChevronRight className="hidden h-4 w-4 sm:block" />
                        </div>
                    ) : null}
                    <FlowRunCard run={run} isJa={isJa} />
                </React.Fragment>
            ))}
        </div>
    );
}

/** デモの入口 — 業務フロー図2本・画面一覧（サイトマップ）・この見本の来歴。 */
export function EntryOverview() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="space-y-10">
            <section className="space-y-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {isJa ? "業務の全体像と画面一覧" : "The business at a glance"}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {isJa
                        ? "このデモが扱うのは、損害保険会社の社員と代理店の担当者が日々使う画面です。まず業務の流れを2つの図で示し、いまある画面がどのステップに当たるかを対応づけます。図の中の箱のうち、実線の箱がいまある画面で、押すとその場で操作できます。破線の箱はまだ作っていない画面です。押すと「まだありません」と書かれたページが開き、そこから流れの前後の画面へ進めるので、業務の流れを最初から最後まで辿れます。"
                        : "This demo covers the screens used day to day by the insurer's own staff and by its agencies. The two diagrams below show how the work flows and map each existing screen to its step. In the diagrams, a solid box is a screen that exists: open it and you can use it. A dashed box is a screen not built yet; opening it gives a page saying so, with links onward to the screens before and after it, so the whole flow can still be walked from start to finish."}
                </p>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {isJa
                        ? "まだ作っていない画面は、このデモのもとになった連載「コールドテスト」（文脈を知らないAIに仕様書だけで画面を作らせる企画）の今後の回で、1画面ずつAIに作ってもらう予定です。"
                        : "The screens not built yet will be handed to an AI one at a time in future rounds of the cold-test series this demo grew out of, where an AI with no project context builds screens from a spec alone."}
                </p>
            </section>

            {BUSINESS_FLOWS.map((flow) => (
                <section key={flow.id} aria-labelledby={`flow-${flow.id}`} className="space-y-3">
                    <h2
                        id={`flow-${flow.id}`}
                        className="text-lg font-semibold text-foreground"
                    >
                        {isJa ? flow.titleJa : flow.titleEn}
                    </h2>
                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                        {isJa ? flow.introJa : flow.introEn}
                    </p>
                    <FlowDiagram flow={flow} isJa={isJa} />
                </section>
            ))}

            <section aria-labelledby="demo-sitemap" className="space-y-3">
                <h2 id="demo-sitemap" className="text-lg font-semibold text-foreground">
                    {isJa ? "画面一覧" : "Screens"}
                </h2>
                <h3 className="text-sm font-semibold text-foreground">
                    {isJa ? "いまある画面" : "Available now"}
                </h3>
                <div className="grid gap-5 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                    {DEMO_SCREENS.map((screen) => (
                        <Link
                            key={screen.slug}
                            href={screen.href}
                            className="group block focus-visible:outline-none"
                        >
                            <Card className="flex h-full w-full flex-col overflow-hidden border-border/80 shadow-sm transition-all hover:border-primary-border hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
                                <ScreenShot
                                    slug={screen.slug}
                                    alt={
                                        isJa
                                            ? SCREEN_SHOT_ALT[screen.slug].ja
                                            : SCREEN_SHOT_ALT[screen.slug].en
                                    }
                                    unavailableLabel={
                                        isJa
                                            ? "この画面の写真はまだありません"
                                            : "No screenshot of this screen yet"
                                    }
                                />
                                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                                    <div className="inline-flex w-full items-start justify-between gap-2">
                                        <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                                            {isJa ? screen.titleJa : screen.titleEn}
                                        </span>
                                        <IconArrowUpRight
                                            className="h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                            aria-hidden
                                        />
                                    </div>
                                    <p className="text-xs leading-5 text-muted-foreground">
                                        {isJa
                                            ? SCREEN_DESCRIPTIONS[screen.slug].ja
                                            : SCREEN_DESCRIPTIONS[screen.slug].en}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* 準備中の画面は、上のフロー図と同じ情報を持つ。以前は同じ幅の
                    カード5枚で、フロー図の直後にもう一度同じ名前と同じバッジが
                    並んでいた（判定者は5枚とも読まずにスクロールした）。画面一覧
                    としての網羅は残しつつ、小さく畳んで反復を止める。 */}
                <h3 className="pt-2 text-sm font-semibold text-foreground">
                    {isJa ? "まだ作っていない画面" : "Not built yet"}
                </h3>
                <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                    {PLANNED_SCREENS.map((planned) => (
                        <Link
                            key={planned.slug}
                            href={planned.href}
                            className="group block rounded-lg border border-dashed bg-muted/40 p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <div className="inline-flex w-full items-start justify-between gap-2">
                                <span className="text-sm font-medium text-foreground">
                                    {isJa ? planned.ja : planned.en}
                                </span>
                                <IconArrowUpRight
                                    className="h-3.5 w-3.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
                                    aria-hidden
                                />
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {isJa ? planned.stepJa : planned.stepEn}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section aria-labelledby="demo-provenance" className="space-y-4">
                <h2
                    id="demo-provenance"
                    className="text-lg font-semibold text-foreground"
                >
                    {isJa ? "この見本の来歴" : "History of this demo"}
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {isJa
                        ? "この見本は、コールドテストの成果から1つの完成品に仕上げ、いまも育てている業務アプリです。出発点になった3回と、1社のアプリにまとめるときに加えた変更、その後の変更履歴をここに記録しています。"
                        : "This demo was shaped into one finished piece from cold-test results, and it keeps growing. Recorded here: the three rounds it started from, the changes made to unify them into one company's app, and everything since."}
                </p>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                        {isJa ? "出発点になった回" : "Where it started"}
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                        {ORIGIN_ROUNDS.map((origin) => (
                            <li key={origin.round}>
                                <Link
                                    href={`/cold-tests/${origin.round}`}
                                    className={linkClass}
                                >
                                    {isJa ? origin.ja : origin.en}
                                    <IconArrowUpRight
                                        className="h-3.5 w-3.5 shrink-0"
                                        aria-hidden
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 制作側の記録なので、開いた人が最後まで読み進める必要はない。
                    以前はここで判定者が離脱した（「読むこと自体が作業になった」）。
                    消さずに畳んで、読みたい人だけが開く形にする。 */}
                <Accordion type="single" collapsible className="max-w-3xl">
                    <AccordionItem value="adaptations">
                        <AccordionTrigger className="text-sm font-semibold">
                            {isJa
                                ? `3回分の画面を1つにまとめたときに変えたこと（${ADAPTATION_NOTES.length}件）`
                                : `Changed when the three rounds were merged into one app (${ADAPTATION_NOTES.length})`}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                                {ADAPTATION_NOTES.map((note, index) => (
                                    <li key={index}>{isJa ? note.ja : note.en}</li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="changelog">
                        <AccordionTrigger className="text-sm font-semibold">
                            {isJa
                                ? `まとめたあとの変更履歴（${PROVENANCE_LOG.length}件）`
                                : `Changed since then (${PROVENANCE_LOG.length})`}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1.5 text-sm leading-6">
                                {PROVENANCE_LOG.map((entry, index) => (
                                    <li key={index} className="flex flex-wrap gap-x-3 gap-y-0.5">
                                        <time
                                            dateTime={entry.date}
                                            className="shrink-0 font-mono text-xs leading-6 text-muted-foreground"
                                        >
                                            {entry.date}
                                        </time>
                                        <span className="min-w-0 flex-1 text-foreground">
                                            {isJa ? entry.ja : entry.en}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
}
