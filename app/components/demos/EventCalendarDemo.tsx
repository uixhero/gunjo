"use client";

import * as React from "react";
import { EventCalendar, type CalendarEvent } from "@gunjo/ui";

const EVENTS: CalendarEvent[] = [
    { id: "a1", date: "2026-06-03", label: "特集: 夏の旅", tone: "info" },
    { id: "a2", date: "2026-06-03", label: "ニュース速報", tone: "primary" },
    { id: "a3", date: "2026-06-10", label: "インタビュー公開", tone: "success" },
    { id: "a4", date: "2026-06-15", label: "入稿締切: 連載#12", tone: "destructive" },
    { id: "a5", date: "2026-06-15", label: "レビュー記事", tone: "info" },
    { id: "a6", date: "2026-06-15", label: "編集会議", tone: "muted" },
    { id: "a7", date: "2026-06-15", label: "SNS 企画", tone: "warning" },
    { id: "a8", date: "2026-06-24", label: "公開: 群青UI 解説", tone: "primary" },
    { id: "a9", date: "2026-06-28", label: "月末まとめ", tone: "muted" },
];

export function EventCalendarDemo() {
    const [month, setMonth] = React.useState<Date>(new Date(2026, 5, 1));
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <div className="flex w-full max-w-2xl flex-col gap-2">
            <EventCalendar
                month={month}
                events={EVENTS}
                today="2026-06-24"
                label="編集カレンダー"
                maxPerDay={3}
                onMonthChange={setMonth}
                onSelectDate={(iso) => setPicked(`日付: ${iso}`)}
                onSelectEvent={(e) => setPicked(`予定: ${typeof e.label === "string" ? e.label : e.id}`)}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {picked ?? "日付/予定をクリック・矢印キーで移動（±1日 / ±1週）・Enterで選択。15日は4件で「＋1件」。"}
            </p>
        </div>
    );
}
