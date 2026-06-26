"use client";

import * as React from "react";
import { RelationshipRow, Badge, Separator } from "@gunjo/ui";

// The pairings that define people-heavy domains — each side is a full PersonCell.
const PAIRS = [
    {
        from: { name: "渡辺 文雄", secondary: "利用者・要介護3", avatar: { fallback: "渡" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" },
        relationshipLabel: "担当",
        to: { name: "田渕 美和子", secondary: "介護支援専門員", avatar: { fallback: "田" } },
        trailing: <Badge variant="success">交付済</Badge>,
    },
    {
        from: { name: "山田 大輔", secondary: "プロダクト本部", avatar: { fallback: "山" } },
        relationshipLabel: "上司",
        to: { name: "伊藤 健太", secondary: "EM", avatar: { fallback: "伊" }, presence: "online" as const },
        trailing: <Badge variant="warning">期限超過</Badge>,
    },
    {
        from: { name: "佐藤 健一", secondary: "訪問ヘルパー", avatar: { fallback: "佐" }, presence: "online" as const },
        relationshipLabel: "訪問",
        to: { name: "小林 トヨ", secondary: "利用者・88歳", avatar: { fallback: "小" } },
        trailing: <Badge variant="info">本日2件</Badge>,
    },
];

export function RelationshipRowDemo() {
    return (
        <div className="flex w-full max-w-lg flex-col">
            {PAIRS.map((p, i) => (
                <React.Fragment key={i}>
                    {i > 0 ? <Separator /> : null}
                    <div className="py-2.5">
                        <RelationshipRow from={p.from} to={p.to} relationshipLabel={p.relationshipLabel} trailing={p.trailing} />
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
