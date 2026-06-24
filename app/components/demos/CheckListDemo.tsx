"use client";

import * as React from "react";
import { CheckList, Badge, Icon, type CheckListItem } from "@gunjo/ui";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

const REQUIRED_DOCS = [
    { id: "id", label: "本人確認書類（運転免許証等）" },
    { id: "former", label: "転出証明書", description: "前住所地の市区町村が発行" },
    { id: "mynumber", label: "マイナンバーカード / 通知カード" },
    { id: "seal", label: "印鑑（世帯主分）" },
];

export function CheckListDemo() {
    const [checked, setChecked] = React.useState<Record<string, boolean>>({ id: true });

    const docItems: CheckListItem[] = REQUIRED_DOCS.map((d) => ({
        id: d.id,
        label: d.label,
        description: d.description,
        checked: Boolean(checked[d.id]),
        trailing: checked[d.id] ? (
            <Badge variant="success" icon={<IconCheck />}>確認済</Badge>
        ) : (
            <Badge variant="warning" icon={<IconAlertTriangle />}>未確認</Badge>
        ),
    }));

    const done = REQUIRED_DOCS.filter((d) => checked[d.id]).length;

    return (
        <div className="flex w-full max-w-md flex-col gap-2">
            <CheckList
                items={docItems}
                onCheckedChange={(id, c) => setChecked((prev) => ({ ...prev, [id]: c }))}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                必要書類: {done} / {REQUIRED_DOCS.length} 確認済
            </p>
        </div>
    );
}
