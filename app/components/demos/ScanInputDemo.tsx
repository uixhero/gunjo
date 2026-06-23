"use client";

import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

type Line = { jan: string; name: string; ordered: number; scanned: number };

const INITIAL: Line[] = [
    { jan: "4901234567894", name: "有機ほうじ茶 500ml", ordered: 24, scanned: 0 },
    { jan: "4900000000017", name: "玄米おにぎり", ordered: 12, scanned: 0 },
    { jan: "4912345678904", name: "豆乳 1L", ordered: 6, scanned: 0 },
];

export function ScanInputDemo() {
    const [lines, setLines] = React.useState<Line[]>(INITIAL);

    const handleScan = (code: string): ScanResult => {
        const idx = lines.findIndex((l) => l.jan === code);
        if (idx === -1) {
            return { ok: false, message: `発注に無い商品です（${code}）` };
        }
        const line = lines[idx];
        const next = line.scanned + 1;
        setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, scanned: next } : l)));
        return { ok: true, message: `${line.name} を1点 検品（検品 ${next} / 発注 ${line.ordered}）` };
    };

    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <ScanInput
                label="バーコード / JAN をスキャン"
                description="ハンディスキャナで読み取るか、コードを入力して Enter。例: 4901234567894 / 0000(対象外)"
                placeholder="コードを入力して Enter"
                inputMode="numeric"
                onScan={handleScan}
                showFeed
                feedLimit={5}
            />

            <ul className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-sm">
                {lines.map((l) => {
                    const diff = l.scanned - l.ordered;
                    return (
                        <li key={l.jan} className="flex items-center justify-between gap-3">
                            <span className="min-w-0 truncate text-foreground">{l.name}</span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">
                                検品 {l.scanned} / 発注 {l.ordered}
                                {diff !== 0 ? (
                                    <span className={diff > 0 ? "ml-2 text-warning" : "ml-2 text-destructive"}>
                                        {diff > 0 ? `+${diff} 過剰` : `${diff} 不足`}
                                    </span>
                                ) : l.scanned > 0 ? (
                                    <span className="ml-2 text-success-strong">一致</span>
                                ) : null}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
