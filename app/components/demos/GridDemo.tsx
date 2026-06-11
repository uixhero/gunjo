"use client";

import { Grid } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const cardsByLocale = {
    en: [
        { title: "Overview", meta: "Workspace health" },
        { title: "Revenue", meta: "$128,400" },
        { title: "Users", meta: "12,840 active" },
        { title: "Tasks", meta: "24 open" },
        { title: "Alerts", meta: "3 need review" },
        { title: "Settings", meta: "Team policy" },
    ],
    ja: [
        { title: "概要", meta: "ワークスペースの状況" },
        { title: "売上", meta: "128,400円" },
        { title: "ユーザー", meta: "12,840人が利用中" },
        { title: "タスク", meta: "24件が未完了" },
        { title: "通知", meta: "3件の確認待ち" },
        { title: "設定", meta: "チームポリシー" },
    ],
} as const;

export function GridDemo() {
    const { locale } = useLocale();
    const cards = cardsByLocale[locale];

    return (
        <Grid minItemWidth={180} gap={3} className="w-full">
            {cards.map((card) => (
                <section key={card.title} className="rounded-md border bg-card p-4">
                    <h3 className="font-medium">{card.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{card.meta}</p>
                </section>
            ))}
        </Grid>
    );
}
