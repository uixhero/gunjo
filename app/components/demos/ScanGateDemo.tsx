"use client";

import * as React from "react";
import { ScanGate, Button, type ScanGateResult, type ScanGateHandle } from "@gunjo/ui";

type Line = { jan: string; name: string; ordered: number; packed: number };
type Carton = { barcode: string };

const ITEMS: Line[] = [
    { jan: "4901111111118", name: "デスクライト LED", ordered: 3, packed: 0 },
    { jan: "4902222222225", name: "USB-C ケーブル 1m", ordered: 5, packed: 0 },
];
const CARTONS = ["CTN-001", "CTN-002"];

export function ScanGateDemo() {
    const [lines, setLines] = React.useState<Line[]>(ITEMS);
    const gateRef = React.useRef<ScanGateHandle>(null);
    const [openCarton, setOpenCarton] = React.useState<string | null>(null);

    const handleCarton = (code: string): ScanGateResult => {
        if (!CARTONS.includes(code)) {
            return { ok: false, message: `カートンが見つかりません（${code}）`, advance: "stay" };
        }
        setOpenCarton(code);
        return { ok: true, message: `カートン ${code} を開きました`, advance: "next", value: { barcode: code } as Carton };
    };

    const handleItem = (code: string, ctx: { values: Record<string, unknown> }): ScanGateResult => {
        const carton = ctx.values.carton as Carton | undefined;
        const idx = lines.findIndex((l) => l.jan === code);
        if (idx === -1) return { ok: false, message: `受注に無い商品です（${code}）`, advance: "stay" };
        const line = lines[idx];
        if (line.packed >= line.ordered) {
            return { ok: false, message: `${line.name} は梱包済みです（${line.ordered}点）`, advance: "stay" };
        }
        const next = line.packed + 1;
        setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, packed: next } : l)));
        // stay on the item stage to keep packing into the same carton
        return { ok: true, message: `${line.name} を ${carton?.barcode} に梱包（${next} / ${line.ordered}）`, advance: "stay" };
    };

    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <ScanGate
                ref={gateRef}
                autoFocus={false}
                stages={[
                    {
                        id: "carton",
                        label: "① カートンをスキャン",
                        title: "カートン",
                        placeholder: "CTN-001 / CTN-002",
                        onScan: handleCarton,
                    },
                    {
                        id: "item",
                        label: "② 商品をスキャン",
                        title: "商品",
                        placeholder: "4901111111118 / 4902222222225",
                        inputMode: "numeric",
                        onScan: handleItem,
                    },
                ]}
            />

            <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                    {openCarton ? `梱包中: ${openCarton}` : "カートン未選択"}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setOpenCarton(null);
                        gateRef.current?.reset();
                    }}
                >
                    カートンを閉じる
                </Button>
            </div>

            <ul className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-sm">
                {lines.map((l) => {
                    const done = l.packed >= l.ordered;
                    return (
                        <li key={l.jan} className="flex items-center justify-between gap-3">
                            <span className="min-w-0 truncate text-foreground">{l.name}</span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">
                                梱包 {l.packed} / {l.ordered}
                                {done ? <span className="ml-2 text-success-strong">完了</span> : null}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
