"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowUpRight,
    IconChevronRight,
    IconHourglass,
} from "@tabler/icons-react";
import { Badge, EmptyState, Separator, cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DEMO_BASE } from "./fictional";
import {
    PLANNED_BADGE_EN,
    PLANNED_BADGE_JA,
    PLANNED_BADGE_SHORT_EN,
    PLANNED_BADGE_SHORT_JA,
    flowForTarget,
    flowRuns,
    flowTargetHref,
    flowTargetLabel,
    isSameTarget,
    plannedBySlug,
    type FlowTarget,
    type PlannedScreenSlug,
} from "./entry";

/**
 * 現在地の図 — この画面が、業務の流れのどこに当たるかを1本の帯で示す。
 *
 * 判定者が仮ページで掴めなかったのが「準備中の画面が1本につながっているのか
 * 2本に分かれているのか」で、前後2つのボタンだけでは鎖の全体が見えなかった
 * （figure-review 1段目）。流れ全体を出し、いまいる区画に印を付ける。
 * 中身のあるUIやデータは置かない＝あるふりをしない（KeEem決定 2026-08-23）。
 * 左端の色帯は使わない（design:verify:left-emphasis）。
 */
function FlowPosition({ current, isJa }: { current: FlowTarget; isJa: boolean }) {
    const flow = flowForTarget(current);
    if (!flow) return null;
    const runs = flowRuns(flow);

    return (
        <section aria-labelledby="flow-position" className="mb-6 space-y-2">
            <h2 id="flow-position" className="text-sm font-semibold text-foreground">
                {isJa
                    ? `業務の流れ「${flow.titleJa}」の中で、この画面が出てくるところ`
                    : `Where this screen comes up in ${flow.titleEn}`}
            </h2>
            <ol className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
                {runs.map((run, index) => {
                    const here = isSameTarget(run.target, current);
                    const isScreen = run.target.kind === "screen";
                    const label = flowTargetLabel(run.target, isJa);
                    const stepNames = run.steps
                        .map((step) => (isJa ? step.ja : step.en))
                        .join(isJa ? "・" : " / ");
                    return (
                        <React.Fragment key={`${flow.id}-${run.firstStepNumber}`}>
                            {index > 0 ? (
                                <div
                                    aria-hidden
                                    className="hidden text-muted-foreground sm:flex sm:items-center sm:px-0.5"
                                >
                                    <IconChevronRight className="h-4 w-4" />
                                </div>
                            ) : null}
                            <li
                                style={{ flexGrow: run.steps.length }}
                                aria-current={here ? "page" : undefined}
                                className={cn(
                                    "min-w-0 basis-0 rounded-lg p-2.5",
                                    here
                                        ? "border-2 border-primary bg-primary/5"
                                        : isScreen
                                          ? "border bg-card"
                                          : "border border-dashed bg-muted/40"
                                )}
                            >
                                <p className="text-xs text-muted-foreground">{stepNames}</p>
                                {here ? (
                                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                                        {label}
                                        <span className="ml-1.5 align-middle text-xs font-medium text-primary">
                                            {isJa ? "いま見ている画面" : "You are here"}
                                        </span>
                                    </p>
                                ) : (
                                    <Link
                                        href={flowTargetHref(run.target)}
                                        className={cn(
                                            "mt-0.5 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                            isScreen ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {label}
                                        {isScreen ? null : (
                                            <Badge variant="secondary">
                                                {isJa
                                                    ? PLANNED_BADGE_SHORT_JA
                                                    : PLANNED_BADGE_SHORT_EN}
                                            </Badge>
                                        )}
                                        <IconArrowUpRight
                                            className="h-3 w-3 shrink-0"
                                            aria-hidden
                                        />
                                    </Link>
                                )}
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </section>
    );
}

/**
 * 準備中画面の仮ページ。中身は「準備中」の表示と、業務の流れの中での現在地だけ。
 * 動くふりをするUIや架空のデータは置かない
 * （KeEem決定 2026-08-23：無い画面は、あるふりをしない）。
 * ページ固有グルー：このデモのルーティング専用で @gunjo/ui 候補ではない。
 */
export function PlannedScreenView({ slug }: { slug: PlannedScreenSlug }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const planned = plannedBySlug(slug);
    const current: FlowTarget = { kind: "planned", slug };

    return (
        <>
            <header className="mb-6 space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {isJa ? planned.ja : planned.en}
                </h1>
                <p className="text-sm leading-7 text-muted-foreground">
                    {isJa ? planned.roleJa : planned.roleEn}
                </p>
            </header>
            <Separator className="mb-6" />
            <FlowPosition current={current} isJa={isJa} />
            <EmptyState
                icon={<IconHourglass className="h-6 w-6" aria-hidden />}
                title={isJa ? PLANNED_BADGE_JA : PLANNED_BADGE_EN}
                description={
                    isJa
                        ? "この画面はまだありません。この先の回でAIに作ってもらい、できあがったらここに載せます。"
                        : "This screen does not exist yet. It will be built in a future round, and the finished screen will land here."
                }
            >
                <Link
                    href={DEMO_BASE}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {isJa
                        ? "業務の全体像と画面一覧を見る"
                        : "See the business at a glance"}
                    <IconArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </Link>
            </EmptyState>
        </>
    );
}
