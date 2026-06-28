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

// Segmented bars — an aircraft rotation: one bar per tail = its whole day, split into
// 便 / 折返し / 整備 segments (gaps show as the bar's track).
const ROT_ROWS: GanttRow[] = [
    { id: "ja801a", label: "JA801A", sublabel: "B787-8" },
    { id: "ja02xj", label: "JA02XJ", sublabel: "A350-900" },
    { id: "ja335j", label: "JA335J", sublabel: "B737-800" },
];

const ROT_ITEMS: GanttItem[] = [
    {
        id: "r1", rowId: "ja801a", start: "2026-06-27T07:20", end: "2026-06-27T15:20", label: "JA801A 運用",
        segments: [
            { start: "2026-06-27T07:30", end: "2026-06-27T09:05", tone: "info", label: "NH055 HND→CTS", kind: "便" },
            { start: "2026-06-27T09:05", end: "2026-06-27T10:00", tone: "muted", kind: "折返し" },
            { start: "2026-06-27T10:00", end: "2026-06-27T11:40", tone: "info", label: "NH060 CTS→HND", kind: "便" },
            { start: "2026-06-27T11:40", end: "2026-06-27T12:35", tone: "muted", kind: "折返し" },
            { start: "2026-06-27T12:35", end: "2026-06-27T15:10", tone: "info", label: "NH067 HND→FUK", kind: "便" },
        ],
    },
    {
        id: "r2", rowId: "ja02xj", start: "2026-06-27T07:50", end: "2026-06-27T14:00", label: "JA02XJ 運用",
        segments: [
            { start: "2026-06-27T08:00", end: "2026-06-27T10:30", tone: "info", label: "NH471 HND→OKA", kind: "便" },
            { start: "2026-06-27T10:30", end: "2026-06-27T11:10", tone: "destructive", label: "折返し不足", kind: "折返し" },
            { start: "2026-06-27T11:10", end: "2026-06-27T13:50", tone: "info", label: "NH472 OKA→HND", kind: "便" },
        ],
    },
    {
        id: "r3", rowId: "ja335j", start: "2026-06-27T07:00", end: "2026-06-27T13:50", label: "JA335J 運用",
        segments: [
            { start: "2026-06-27T07:15", end: "2026-06-27T08:45", tone: "info", label: "JL503 HND→ITM", kind: "便" },
            { start: "2026-06-27T08:45", end: "2026-06-27T12:00", tone: "warning", label: "ライン整備", kind: "整備" },
            { start: "2026-06-27T12:00", end: "2026-06-27T13:40", tone: "info", label: "JL510 ITM→HND", kind: "便" },
        ],
    },
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

            <div className="mt-2 border-t pt-4">
                <p className="mb-2 text-sm font-medium text-foreground">機材繰り（segments［］で1本のバーを 便／折返し／整備 に分割）</p>
                <Gantt
                    rows={ROT_ROWS}
                    items={ROT_ITEMS}
                    startDate="2026-06-27T06:00"
                    endDate="2026-06-27T16:00"
                    resolution="hour"
                    hourWidth={72}
                    label="機材繰り（航空ローテーション）"
                    onSelectItem={(i) => setPicked(typeof i.label === "string" ? i.label : i.id)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                    終日でなく1日内の運用なので <code>resolution=&quot;hour&quot;</code>＝時刻目盛（HH:MM）。各機（登録記号）の1日を1本のバーで表し、内部を 便（info）／折返し（muted）／整備（warning）／折返し不足（destructive）に分割。セグメント間の隙間はバーの track として見える。
                </p>
            </div>
        </div>
    );
}
