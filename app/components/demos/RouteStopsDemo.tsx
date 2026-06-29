"use client";

import * as React from "react";
import { RouteStops, Button, type RouteStopItem } from "@gunjo/ui";

const STOPS: RouteStopItem[] = [
    {
        id: "1",
        title: "佐藤 一郎",
        description: "東京都渋谷区神南 1-2-3",
        status: "completed",
        plannedTime: "09:30",
        actualTime: "09:28",
        meta: "2 個",
    },
    {
        id: "2",
        title: "鈴木 商店",
        description: "東京都渋谷区宇田川町 4-5",
        status: "completed",
        plannedTime: "09:50",
        actualTime: "09:58",
        meta: "5 個",
    },
    {
        id: "3",
        title: "高橋 花子",
        description: "東京都渋谷区道玄坂 2-6-7",
        status: "current",
        plannedTime: "10:15",
        actualTime: "10:21",
        meta: "1 個",
        actions: (
            <>
                <Button size="sm" variant="outline">
                    完了
                </Button>
                <Button size="sm" variant="ghost">
                    不在
                </Button>
            </>
        ),
    },
    {
        id: "4",
        title: "田中 工業",
        description: "東京都渋谷区桜丘町 8-9",
        status: "failed",
        plannedTime: "10:40",
        meta: "3 個",
        actions: (
            <Button size="sm" variant="outline">
                再配達を設定
            </Button>
        ),
    },
    {
        id: "5",
        title: "山田 太郎",
        description: "東京都目黒区上目黒 1-1",
        status: "delayed",
        plannedTime: "11:00",
        delayMinutes: 18,
        meta: "1 個",
    },
    {
        id: "6",
        title: "伊藤 ストア",
        description: "東京都目黒区中目黒 3-2",
        status: "pending",
        plannedTime: "11:25",
        meta: "4 個",
    },
];

// Multi-day / multi-week dated timeline — a free-form `dateLabel` per stop instead of HH:MM.
const SHIPMENT: RouteStopItem[] = [
    { id: "s1", title: "輸出通関", description: "上海港 (CNSHA)", status: "completed", dateLabel: "2025/05/12 許可" },
    { id: "s2", title: "船積", description: "本船 EVER GIVEN / V.0PA21", status: "completed", dateLabel: "2025/05/15" },
    { id: "s3", title: "海上輸送", description: "上海 → 東京", status: "current", dateLabel: "2025/05/16 〜 05/29（航行中）" },
    { id: "s4", title: "着港（揚地）", description: "東京港 (JPTYO)", status: "pending", dateLabel: "ETA 2025/05/30" },
    { id: "s5", title: "輸入通関", description: "申告 → 審査 → 許可", status: "pending", dateLabel: "予定 2025/06/02" },
    { id: "s6", title: "国内配送・納品", description: "東京都江東区 物流センター", status: "pending", dateLabel: "予定 2025/06/05" },
];

export function RouteStopsDemo() {
    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            <div>
                <p className="mb-2 text-sm font-medium text-foreground">当日配送（HH:MM・予実＋遅延）</p>
                <RouteStops stops={STOPS} />
            </div>
            <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium text-foreground">多週の輸送追跡（<code>dateLabel</code>＝日付跨ぎ）</p>
                <RouteStops stops={SHIPMENT} />
            </div>
        </div>
    );
}
