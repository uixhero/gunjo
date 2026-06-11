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
                label="Bounce rate"
                value="32.4%"
                change="-3.2%"
                trend="down"
                hint="month over month"
            />
            <Statistic
                label="Active users"
                value="12,847"
                change="0.0%"
                trend="flat"
                hint="no change"
            />
        </div>
    );
}
