"use client";

import * as React from "react";
import { ParetoChart, NumberInput } from "@gunjo/ui";

interface Cause {
    key: string;
    label: string;
    value: number;
    color?: "primary" | "success" | "warning" | "info" | "accent" | "destructive" | "muted";
}

const INITIAL: Cause[] = [
    { key: "chokotei", label: "チョコ停", value: 142 },
    { key: "setup", label: "段取替え", value: 96 },
    { key: "fault", label: "故障", value: 64, color: "destructive" },
    { key: "material", label: "材料待ち", value: 38 },
    { key: "quality", label: "品質調整", value: 22 },
    { key: "other", label: "その他", value: 11, color: "muted" },
];

export function ParetoChartDemo() {
    const [causes, setCauses] = React.useState<Cause[]>(INITIAL);

    const update = (key: string, value: number) =>
        setCauses((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));

    return (
        <div className="flex w-full max-w-2xl flex-col gap-6">
            <ParetoChart
                data={causes.map((c) => ({ label: c.label, value: c.value, color: c.color }))}
                label="停止時間（分）"
                cumulativeLabel="累計"
                threshold={80}
                formatValue={(v) => `${v}分`}
                showValues
            />

            {/* Editable data — adjust the minutes and watch the bars re-sort and the
                cumulative line + 80% crossing recompute live. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {causes.map((c) => (
                    <NumberInput
                        key={c.key}
                        label={c.label}
                        value={c.value}
                        onValueChange={(v) => update(c.key, v)}
                        min={0}
                        max={500}
                        step={1}
                        incrementLabel={`${c.label}を増やす`}
                        decrementLabel={`${c.label}を減らす`}
                    />
                ))}
            </div>
        </div>
    );
}
