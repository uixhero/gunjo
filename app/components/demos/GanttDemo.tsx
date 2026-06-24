"use client";

import * as React from "react";
import { Gantt, type GanttRow, type GanttItem } from "@gunjo/ui";

const ROWS: GanttRow[] = [
    { id: "l1", label: "第1ライン", sublabel: "組立" },
    { id: "l2", label: "第2ライン", sublabel: "塗装" },
    { id: "l3", label: "第3ライン", sublabel: "検査" },
];

const ITEMS: GanttItem[] = [
    { id: "j1", rowId: "l1", start: "2026-06-22", end: "2026-06-24", label: "製造指図 A-101", tone: "info" },
    { id: "j2", rowId: "l1", start: "2026-06-24", end: "2026-06-27", label: "A-102", tone: "primary" },
    { id: "j3", rowId: "l2", start: "2026-06-22", end: "2026-06-25", label: "B-201", tone: "success" },
    { id: "j4", rowId: "l2", start: "2026-06-23", end: "2026-06-26", label: "B-202（並行）", tone: "warning" }, // overlaps j3 → stacks
    { id: "j5", rowId: "l3", start: "2026-06-25", end: "2026-06-28", label: "C-301 検査", tone: "muted" },
];

export function GanttDemo() {
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <div className="flex w-full flex-col gap-3">
            <Gantt
                rows={ROWS}
                items={ITEMS}
                startDate="2026-06-21"
                endDate="2026-06-29"
                today="2026-06-24"
                label="生産ライン スケジュール"
                onSelectItem={(i) => setPicked(typeof i.label === "string" ? i.label : i.id)}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {picked ? `選択: ${picked}` : "バーをクリックで選択。第2ラインの B-201 と B-202 は期間が重なり、行内で上下に詰めて表示。今日(6/24)に縦線。"}
            </p>
        </div>
    );
}
