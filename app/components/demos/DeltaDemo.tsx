"use client";

import * as React from "react";
import { Delta, NumberInput, formatCurrency } from "@gunjo/ui";

const yen = (v: number) => formatCurrency(v, { signed: true });

export function DeltaDemo() {
    const [value, setValue] = React.useState<number | undefined>(-930);
    const v = value ?? 0;

    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            {/* Interactive — sign drives arrow, tone and announced label */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground" htmlFor="delta-demo-input">
                    過不足（実査 − 理論）
                </label>
                <NumberInput
                    id="delta-demo-input"
                    value={value}
                    onValueChange={setValue}
                    step={100}
                    className="max-w-[12rem]"
                />
                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">現在の差額</span>
                    <Delta
                        value={v}
                        format={yen}
                        tones={{ positive: "warning", negative: "destructive", zero: "success" }}
                        labels={{ positive: "過剰", negative: "不足", zero: "一致" }}
                        showLabel
                    />
                </div>
            </div>

            {/* Three semantic modes from the same atom */}
            <dl className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 text-sm">
                <dt className="text-muted-foreground">損益（既定トーン）</dt>
                <dd className="text-right">
                    <Delta value={12500} format={yen} labels={{ positive: "増加", negative: "減少" }} />
                </dd>
                <dt className="text-muted-foreground">棚卸差異</dt>
                <dd className="text-right">
                    <Delta value={-5880} format={yen} labels={{ positive: "過剰", negative: "不足", zero: "一致" }} />
                </dd>
                <dt className="text-muted-foreground">増減なし</dt>
                <dd className="text-right">
                    <Delta value={0} format={yen} labels={{ zero: "増減なし" }} />
                </dd>
            </dl>
        </div>
    );
}
