"use client";

import { StatGroup } from "@gunjo/ui";

// The KPI row almost every back-office screen opens with — here, a 介護報酬請求 strip.
export function StatGroupDemo() {
    return (
        <StatGroup
            cols={{ base: 2, md: 3, lg: 5 }}
            items={[
                { label: "請求対象者", value: "6名", hint: "未確定 3件" },
                { label: "請求総額", value: "¥1,224,520", hint: "介護給付＋利用者負担" },
                { label: "国保連請求分", value: "¥1,019,911" },
                { label: "限度額超過者", value: "1名", tone: "negative" },
                { label: "提出期限", value: "6/10", change: "あと4日", trend: "down" },
            ]}
        />
    );
}
