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

export function RouteStopsDemo() {
    return (
        <div className="w-full max-w-md">
            <RouteStops stops={STOPS} />
        </div>
    );
}
