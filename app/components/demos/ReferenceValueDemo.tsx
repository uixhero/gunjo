"use client";

import * as React from "react";
import { ReferenceValue, type ReferenceRange } from "@gunjo/ui";

type Row = { name: string; value: number; unit: string; range: ReferenceRange };

const RESULTS: Row[] = [
    { name: "体温", value: 38.9, unit: "℃", range: { low: 36.0, high: 37.5, criticalHigh: 40.0 } },
    { name: "SpO₂", value: 88, unit: "%", range: { low: 96, criticalLow: 90 } },
    { name: "脈拍", value: 72, unit: "回/分", range: { low: 60, high: 100 } },
    { name: "K (カリウム)", value: 6.8, unit: "mEq/L", range: { low: 3.5, high: 5.0, criticalHigh: 6.0 } },
    { name: "Hb", value: 9.2, unit: "g/dL", range: { low: 13.0, high: 17.0 } },
];

export function ReferenceValueDemo() {
    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th scope="col" className="py-1.5 pr-3 font-medium">
                            項目
                        </th>
                        <th scope="col" className="py-1.5 font-medium">
                            結果
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {RESULTS.map((r) => (
                        <tr key={r.name} className="border-b last:border-0">
                            <th scope="row" className="py-2 pr-3 text-left font-normal text-foreground">
                                {r.name}
                            </th>
                            <td className="py-2">
                                <ReferenceValue
                                    value={r.value}
                                    unit={r.unit}
                                    range={r.range}
                                    size="inline"
                                    showRange
                                    format={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
