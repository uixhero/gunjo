"use client";

import { Statistic } from "@gunjo/ui";

export function StatisticDemo() {
    return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
            <Statistic
                label="Total revenue"
                value="$45,231.89"
                change="+20.1%"
                trend="up"
                hint="vs last month"
            />
            <Statistic
                label="Subscriptions"
                value="2,350"
                change="+180"
                trend="up"
                hint="this week"
            />
            <Statistic
                label="直帰率 (good-when-low)"
                value="32.4%"
                change="-3.2%"
                trend="down"
                goodWhen="lower"
                hint="下降＝緑（改善）"
            />
            <Statistic
                label="遅延件数 (good-when-low)"
                value="96件"
                change="+12"
                trend="up"
                goodWhen="lower"
                hint="上昇＝赤（悪化）"
            />
        </div>
    );
}
