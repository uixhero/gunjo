"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowUpRight,
    IconChevronLeft,
    IconChevronRight,
    IconHourglass,
} from "@tabler/icons-react";
import { Button, EmptyState, Separator } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DEMO_BASE } from "./fictional";
import {
    PLANNED_BADGE_EN,
    PLANNED_BADGE_JA,
    flowTargetHref,
    flowTargetLabel,
    plannedBySlug,
    type FlowTarget,
    type PlannedScreenSlug,
} from "./entry";

/** 前へ・次へのボタン1つ。行き先は既存画面か準備中画面。 */
function FlowNavButton({
    target,
    direction,
    isJa,
}: {
    target: FlowTarget;
    direction: "prev" | "next";
    isJa: boolean;
}) {
    const label = flowTargetLabel(target, isJa);
    // 「前の画面」だとブラウザの戻る・進むに読めるため、業務の流れ上の前後だと
    // 分かる「前のステップ」「次のステップ」にする（独立レビューの指摘）。
    const prefix =
        direction === "prev"
            ? isJa
                ? "前のステップ"
                : "Previous step"
            : isJa
              ? "次のステップ"
              : "Next step";
    return (
        <Button asChild variant="outline" size="sm">
            <Link href={flowTargetHref(target)}>
                {direction === "prev" ? (
                    <IconChevronLeft className="h-4 w-4" aria-hidden />
                ) : null}
                {isJa ? `${prefix}：${label}` : `${prefix}: ${label}`}
                {direction === "next" ? (
                    <IconChevronRight className="h-4 w-4" aria-hidden />
                ) : null}
            </Link>
        </Button>
    );
}

/**
 * 準備中画面の仮ページ。中身は「準備中」の表示と、業務の流れを通しで
 * 辿るための前後ナビだけ。動くふりをするUIや架空のデータは置かない
 * （KeEem決定 2026-08-23：無い画面は、あるふりをしない）。
 * ページ固有グルー：このデモのルーティング専用で @gunjo/ui 候補ではない。
 */
export function PlannedScreenView({ slug }: { slug: PlannedScreenSlug }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const planned = plannedBySlug(slug);

    return (
        <>
            <header className="mb-6 space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {isJa ? planned.ja : planned.en}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {isJa ? planned.roleJa : planned.roleEn}
                </p>
            </header>
            <Separator className="mb-6" />
            <EmptyState
                icon={<IconHourglass className="h-6 w-6" aria-hidden />}
                title={isJa ? PLANNED_BADGE_JA : PLANNED_BADGE_EN}
                description={
                    isJa
                        ? "この画面はまだありません。このデモは、文脈を知らないAIに仕様書だけを渡して画面を作らせる連載「コールドテスト」から生まれました。この画面も、この先の回でAIに作ってもらい、できあがったらここに載せます。"
                        : "This screen does not exist yet. This demo grew out of the cold-test series, where an AI with no project context builds screens from a spec alone. This screen will be built in a future round, and the finished screen will land here."
                }
                action={
                    <nav
                        aria-label={isJa ? "業務の流れの前後の画面" : "Adjacent screens in the flow"}
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {planned.prev ? (
                            <FlowNavButton target={planned.prev} direction="prev" isJa={isJa} />
                        ) : null}
                        {planned.next ? (
                            <FlowNavButton target={planned.next} direction="next" isJa={isJa} />
                        ) : null}
                    </nav>
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
