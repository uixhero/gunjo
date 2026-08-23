"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowUpRight,
    IconChevronDown,
    IconChevronRight,
} from "@tabler/icons-react";
import { Badge, ListCard, cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    ADAPTATION_NOTES,
    BUSINESS_FLOWS,
    ORIGIN_ROUNDS,
    PLANNED_BADGE_EN,
    PLANNED_BADGE_JA,
    PLANNED_SCREENS,
    PROVENANCE_LOG,
    SCREEN_DESCRIPTIONS,
    plannedBySlug,
    screenBySlug,
    type BusinessFlow,
} from "./_lib/entry";
import { DEMO_SCREENS } from "./_lib/fictional";

const linkClass =
    "inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * 業務フロー図 — ステップの列（モバイルは縦・sm以上は横）。各ステップは
 * 対応画面へのリンク、または準備中画面の仮ページへのリンク（バッジ表示）を持つ。ページ固有グルー：
 * 見本の入口に固有の「業務ステップと画面の対応図」で、@gunjo/ui 候補として
 * #886 で追跡（業界デモが増えて3回目の手組みになったら部品化）。
 * 左端の色帯は使わない（design:verify:left-emphasis）。
 */
function FlowDiagram({ flow, isJa }: { flow: BusinessFlow; isJa: boolean }) {
    return (
        <div role="list" className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
            {flow.steps.map((step, index) => {
                const screen =
                    step.target.kind === "screen" ? screenBySlug(step.target.slug) : null;
                const planned =
                    step.target.kind === "planned" ? plannedBySlug(step.target.slug) : null;
                return (
                    <React.Fragment key={`${flow.id}-${index}`}>
                        {index > 0 ? (
                            <div
                                aria-hidden
                                className="flex justify-center text-muted-foreground sm:items-center sm:px-0.5"
                            >
                                <IconChevronDown className="h-4 w-4 sm:hidden" />
                                <IconChevronRight className="hidden h-4 w-4 sm:block" />
                            </div>
                        ) : null}
                        <div
                            role="listitem"
                            className="min-w-0 flex-1 rounded-lg border bg-card p-3"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    aria-hidden
                                    className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                        screen
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {index + 1}
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                    {isJa ? step.ja : step.en}
                                </span>
                            </div>
                            <div className="mt-2">
                                {screen ? (
                                    <Link
                                        href={screen.href}
                                        className={cn(linkClass, "text-xs")}
                                    >
                                        {isJa ? screen.navJa : screen.navEn}
                                        <IconArrowUpRight
                                            className="h-3 w-3 shrink-0"
                                            aria-hidden
                                        />
                                    </Link>
                                ) : planned ? (
                                    <Link
                                        href={planned.href}
                                        aria-label={
                                            isJa
                                                ? `準備中の画面「${planned.ja}」を開く`
                                                : `Open the planned screen: ${planned.en}`
                                        }
                                        className="group inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="gap-1 whitespace-normal text-left transition-colors group-hover:bg-secondary/80"
                                        >
                                            {isJa ? PLANNED_BADGE_JA : PLANNED_BADGE_EN}
                                            <IconArrowUpRight
                                                className="h-3 w-3 shrink-0"
                                                aria-hidden
                                            />
                                        </Badge>
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
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
                        ? "このデモが扱うのは、損害保険会社の社内と代理店の仕事です。まず業務の流れを2本の図で示し、いまある画面がどのステップに当たるかを対応づけます。画面名のリンクになっているステップは、押すとその画面をその場で操作できます。準備中のステップも押せます。中身はまだありませんが、前後の画面に移動できるので、業務の流れを最初から最後まで辿れます。準備中の画面は、このデモのもとになった連載「コールドテスト」（文脈を知らないAIに仕様書だけで画面を作らせる企画）の今後の回で、1画面ずつ出題する予定です。"
                        : "This demo covers the work inside a property and casualty insurer and its agencies. The two diagrams below show how the work flows and map each existing screen to its step. A step with a screen-name link opens that working screen. Steps marked as in preparation are clickable too: there is nothing in them yet, but each one links to the screens before and after it, so the whole flow can be walked from start to finish. The planned screens will be posed as assignments one screen at a time in future rounds of the cold-test series this demo grew out of, where an AI with no project context builds screens from a spec alone."}
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
                <div className="space-y-2">
                    {DEMO_SCREENS.map((screen) => (
                        <Link
                            key={screen.slug}
                            href={screen.href}
                            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <ListCard
                                title={isJa ? screen.titleJa : screen.titleEn}
                                description={
                                    isJa
                                        ? SCREEN_DESCRIPTIONS[screen.slug].ja
                                        : SCREEN_DESCRIPTIONS[screen.slug].en
                                }
                                trailing={
                                    <IconChevronRight className="size-5" aria-hidden />
                                }
                                className="transition-colors hover:bg-accent"
                            />
                        </Link>
                    ))}
                </div>
                <h3 className="pt-2 text-sm font-semibold text-foreground">
                    {isJa ? "準備中の画面" : "In preparation"}
                </h3>
                <div className="space-y-2">
                    {PLANNED_SCREENS.map((planned) => (
                        <Link
                            key={planned.slug}
                            href={planned.href}
                            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <ListCard
                                title={isJa ? planned.ja : planned.en}
                                description={isJa ? planned.stepJa : planned.stepEn}
                                status={
                                    <Badge
                                        variant="secondary"
                                        className="whitespace-normal text-left"
                                    >
                                        {isJa ? PLANNED_BADGE_JA : PLANNED_BADGE_EN}
                                    </Badge>
                                }
                                trailing={
                                    <IconChevronRight className="size-5" aria-hidden />
                                }
                                className="bg-muted/40 transition-colors hover:bg-accent"
                            />
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

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                        {isJa ? "アプリにまとめるときに変えたこと" : "Changes made along the way"}
                    </h3>
                    <ul className="max-w-3xl list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                        {ADAPTATION_NOTES.map((note, index) => (
                            <li key={index}>{isJa ? note.ja : note.en}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                        {isJa ? "変更履歴" : "Change log"}
                    </h3>
                    <ul className="max-w-3xl space-y-1.5 text-sm leading-6">
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
                </div>
            </section>
        </div>
    );
}
