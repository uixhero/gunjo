"use client";

import * as React from "react";
import { WeekView, type WeekEvent } from "@gunjo/ui";

const EVENTS: WeekEvent[] = [
    { id: "e1", start: "2026-06-22T09:00", end: "2026-06-22T10:30", label: "編集会議", tone: "info" },
    { id: "e2", start: "2026-06-22T10:00", end: "2026-06-22T11:00", label: "1on1（佐藤）", tone: "primary" }, // overlaps e1
    { id: "e3", start: "2026-06-23T13:00", end: "2026-06-23T14:30", label: "取材", tone: "success" },
    { id: "e4", start: "2026-06-24T11:00", end: "2026-06-24T12:00", label: "校了チェック", tone: "warning" },
    { id: "e5", start: "2026-06-24T15:00", end: "2026-06-24T18:00", label: "撮影", tone: "info" },
    { id: "e6", start: "2026-06-25T09:30", end: "2026-06-25T10:30", label: "デザインレビュー", tone: "primary" },
    { id: "e7", start: "2026-06-26T16:00", end: "2026-06-26T17:00", label: "週次まとめ", tone: "muted" },
];

export function WeekViewDemo() {
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <div className="flex w-full flex-col gap-3">
            <WeekView
                weekOf="2026-06-24"
                today="2026-06-24"
                events={EVENTS}
                startHour={8}
                endHour={19}
                label="今週の予定"
                onSelectEvent={(e) => setPicked(typeof e.label === "string" ? e.label : e.id)}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {picked ? `選択: ${picked}` : "予定をクリックで選択。月22日の編集会議と1on1は時間が重なり、横並びに詰めて表示。"}
            </p>
        </div>
    );
}
