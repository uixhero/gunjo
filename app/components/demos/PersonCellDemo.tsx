"use client";

import * as React from "react";
import { PersonCell, Badge, Separator } from "@gunjo/ui";

// A people list (directory row / assignee picker / reviewer row) — the unit
// PersonCell exists for. Mixes image + fallback, presence, trailing, and sizes.
const PEOPLE = [
    {
        name: "佐藤 美咲",
        secondary: "プロダクト本部 / シニアUXデザイナー",
        tertiary: "正社員・東京本社",
        avatar: { src: "https://i.pravatar.cc/80?img=47" },
        presence: "online" as const,
        trailing: <Badge variant="success">在籍</Badge>,
    },
    {
        name: "高橋 健一",
        secondary: "プロダクト本部 / デザインマネージャー",
        tertiary: "正社員・大阪支社",
        avatar: { fallback: "高" },
        avatarClassName: "bg-info-subtle text-info-subtle-foreground",
        presence: "away" as const,
        trailing: <Badge variant="warning">休職中</Badge>,
    },
    {
        name: "山田 涼介",
        secondary: "コーポレート本部 / 人事 HRBP",
        avatar: { fallback: "山" },
        avatarClassName: "bg-warning-subtle text-warning-subtle-foreground",
        trailing: <Badge variant="outline">退職予定</Badge>,
    },
];

export function PersonCellDemo() {
    return (
        <div className="flex w-full max-w-md flex-col">
            {PEOPLE.map((p, i) => (
                <React.Fragment key={p.name}>
                    {i > 0 ? <Separator /> : null}
                    <div className="py-2.5">
                        <PersonCell
                            name={p.name}
                            secondary={p.secondary}
                            tertiary={p.tertiary}
                            avatar={p.avatar}
                            avatarClassName={p.avatarClassName}
                            presence={p.presence}
                            presenceLabel={p.presence}
                            trailing={p.trailing}
                        />
                    </div>
                </React.Fragment>
            ))}

            <Separator className="my-3" />
            <p className="mb-2 text-xs font-medium text-muted-foreground">サイズ（sm / md / lg）</p>
            <div className="flex flex-col gap-3">
                <PersonCell size="sm" name="中野 葵" secondary="エンジニアリング本部" avatar={{ fallback: "中" }} />
                <PersonCell size="md" name="中野 葵" secondary="エンジニアリング本部" avatar={{ fallback: "中" }} />
                <PersonCell size="lg" name="中野 葵" secondary="エンジニアリング本部" avatar={{ fallback: "中" }} />
            </div>
        </div>
    );
}
