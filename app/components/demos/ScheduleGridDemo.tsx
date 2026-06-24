"use client";

import * as React from "react";
import { ScheduleGrid, Badge, type ScheduleAxisItem, type ScheduleCell } from "@gunjo/ui";

const PERIODS: ScheduleAxisItem[] = [
    { id: "p1", label: "1限", sublabel: "8:50" },
    { id: "p2", label: "2限", sublabel: "9:50" },
    { id: "p3", label: "3限", sublabel: "10:50" },
    { id: "p4", label: "4限", sublabel: "11:50" },
];

const DAYS: ScheduleAxisItem[] = [
    { id: "mon", label: "月", ariaLabel: "月曜" },
    { id: "tue", label: "火", ariaLabel: "火曜" },
    { id: "wed", label: "水", ariaLabel: "水曜" },
    { id: "thu", label: "木", ariaLabel: "木曜" },
    { id: "fri", label: "金", ariaLabel: "金曜" },
];

interface Lesson {
    subject: string;
    teacher: string;
    room: string;
}

const LESSONS: Record<string, Lesson> = {
    "p1::mon": { subject: "数学", teacher: "佐藤", room: "2-A" },
    "p1::tue": { subject: "英語", teacher: "鈴木", room: "2-A" },
    "p1::wed": { subject: "国語", teacher: "高橋", room: "2-A" },
    "p2::mon": { subject: "理科", teacher: "田中", room: "理科室" },
    "p2::tue": { subject: "数学", teacher: "佐藤", room: "2-A" },
    "p2::thu": { subject: "社会", teacher: "伊藤", room: "2-A" },
    "p3::mon": { subject: "体育", teacher: "渡辺", room: "体育館" },
    "p3::wed": { subject: "数学", teacher: "佐藤", room: "2-A" },
    "p3::fri": { subject: "英語", teacher: "鈴木", room: "2-A" },
    "p4::tue": { subject: "音楽", teacher: "山本", room: "音楽室" },
    "p4::thu": { subject: "理科", teacher: "田中", room: "理科室" },
};

// 佐藤先生は火2限と…（デモ用に）木2限にも重複させて competing を作る。
const CONFLICTS = new Set<string>(["p2::tue", "p2::thu"]);
// 木2限を社会(伊藤)→数学(佐藤) にして competing を成立させる
LESSONS["p2::thu"] = { subject: "数学", teacher: "佐藤", room: "視聴覚室" };

export function ScheduleGridDemo() {
    const [picked, setPicked] = React.useState<string | null>(null);

    const cells: ScheduleCell[] = [];
    for (const p of PERIODS) {
        for (const d of DAYS) {
            const key = `${p.id}::${d.id}`;
            const lesson = LESSONS[key];
            if (!lesson) {
                // 空きコマ — クリックで割り当て（デモでは選択状態に）
                cells.push({
                    rowId: p.id,
                    colId: d.id,
                    onSelect: () => setPicked(key),
                    description: "空き時間。クリックで割り当て",
                });
                continue;
            }
            const conflict = CONFLICTS.has(key);
            cells.push({
                rowId: p.id,
                colId: d.id,
                tone: conflict ? "destructive" : "default",
                onSelect: () => setPicked(key),
                description: `${lesson.subject}、${lesson.teacher}、${lesson.room}${conflict ? "、競合あり" : ""}`,
                content: (
                    <div className="flex h-full flex-col gap-0.5">
                        <div className="flex items-start justify-between gap-1">
                            <span className="text-sm font-semibold leading-tight">{lesson.subject}</span>
                            {conflict ? <Badge variant="destructive">競合</Badge> : null}
                        </div>
                        <span className="text-xs text-muted-foreground">{lesson.teacher}</span>
                        <span className="text-xs text-muted-foreground">{lesson.room}</span>
                    </div>
                ),
            });
        }
    }

    return (
        <div className="flex w-full max-w-2xl flex-col gap-3">
            <ScheduleGrid
                label="2年A組 週間時間割（縦：時限、横：曜日）"
                cornerLabel="時限"
                rows={PERIODS}
                columns={DAYS}
                cells={cells}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {picked
                    ? `選択: ${picked.replace("::", " / ")}（矢印キーでセル移動・Enterで選択）`
                    : "セルを選ぶと表示。矢印キーで移動・Enter/Spaceで選択。佐藤先生が火2限と木2限で重複＝競合。"}
            </p>
        </div>
    );
}
