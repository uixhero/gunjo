"use client";

import * as React from "react";
import { Meter, Button } from "@gunjo/ui";

const MAX_KG = 3000;
const SHIPMENT_KG = 350;

export function MeterDemo() {
    const [loaded, setLoaded] = React.useState(2100);
    const [preview, setPreview] = React.useState(false);
    const incoming = preview ? SHIPMENT_KG : undefined;
    const wouldOver = loaded + SHIPMENT_KG > MAX_KG;

    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            {/* Interactive — capacity with an incoming preview */}
            <div className="flex flex-col gap-3">
                <Meter
                    label="重量積載率"
                    value={loaded}
                    max={MAX_KG}
                    incoming={incoming}
                    unit="kg"
                    thresholds={{ warning: 0.8, over: 1 }}
                />
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onMouseEnter={() => setPreview(true)}
                        onMouseLeave={() => setPreview(false)}
                        onFocus={() => setPreview(true)}
                        onBlur={() => setPreview(false)}
                        disabled={wouldOver}
                        onClick={() => {
                            setLoaded((v) => Math.min(MAX_KG, v + SHIPMENT_KG));
                            setPreview(false);
                        }}
                    >
                        次の出荷を積む（+{SHIPMENT_KG}kg）
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setLoaded(2100)}>
                        リセット
                    </Button>
                    {wouldOver ? <span className="text-xs text-destructive">積み残し（超過）</span> : null}
                </div>
            </div>

            {/* Auto-tone by threshold (higher-is-worse / capacity) */}
            <div className="flex flex-col gap-3">
                <Meter label="棚 A-01" value={1350} max={3000} unit="点" />
                <Meter label="棚 B-07" value={2520} max={3000} unit="点" />
                <Meter label="棚 C-02" value={3000} max={3000} unit="点" />
            </div>

            {/* higher-is-better — at/above the target marker is success, just under it warns */}
            <div className="flex flex-col gap-3">
                <Meter label="入居率（目標 90%）" value={95} max={100} unit="%" direction="higher-is-better" target={90} />
                <Meter label="設備稼働率（目標 90%）" value={86} max={100} unit="%" direction="higher-is-better" target={90} />
                <Meter label="工程能力 Cpk（目標 1.33）" value={1.05} max={2} direction="higher-is-better" target={1.33} />
            </div>

            {/* fill-is-good (coverage, no target) + formatValue (grouped readout) */}
            <div className="flex flex-col gap-3">
                <Meter label="受注カバー率" value={87} max={100} unit="%" direction="fill-is-good" />
                <Meter label="予算消化（円）" value={2_340_000} max={3_000_000} direction="higher-is-worse" formatValue={(n) => `¥${n.toLocaleString("ja-JP")}`} />
            </div>

            {/* Inline size — for table cells */}
            <table className="w-full text-sm">
                <tbody>
                    {[
                        { bin: "D-01", v: 18, max: 40 },
                        { bin: "D-02", v: 36, max: 40 },
                        { bin: "D-03", v: 41, max: 40 },
                    ].map((r) => (
                        <tr key={r.bin} className="border-t">
                            <td className="py-2 pr-3 font-medium">{r.bin}</td>
                            <td className="w-40 py-2">
                                <Meter size="inline" value={r.v} max={r.max} label={`${r.bin} 充填`} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
