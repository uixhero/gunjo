"use client";

import * as React from "react";
import { AmountBreakdown, Card, ToggleGroup, ToggleGroupItem, type AmountLine } from "@gunjo/ui";

// A 自動車保険 保険金支払明細 — the read-only derivation an adjuster verifies before 振込.
// 過失割合を切り替えると 過失相殺・今回支払額 が再計算される（データ駆動の確認）。
const 認定 = [
  { label: "修理費", amount: 480_000 },
  { label: "レッカー費用", amount: 22_000 },
  { label: "代車費用", amount: 38_000 },
];
const 免責 = 50_000;
const 既払 = 100_000;

const FAULTS = ["0", "20", "30", "50"] as const;

export function AmountBreakdownDemo() {
  const [fault, setFault] = React.useState<string>("30");

  const 認定計 = 認定.reduce((s, l) => s + l.amount, 0);
  const pct = Number(fault) / 100;
  const 過失相殺 = Math.round(認定計 * pct);
  const 支払額 = 認定計 - 過失相殺 - 免責 - 既払;

  const lines: AmountLine[] = [
    { type: "heading", label: "認定損害額" },
    ...認定,
    { type: "subtotal", label: "認定損害額 計", amount: 認定計 },
    { label: "過失相殺", kind: "subtract", amount: 過失相殺, note: `認定額 × 過失割合 ${fault}%` },
    { label: "免責金額", kind: "subtract", amount: 免責 },
    { label: "既払金（内払）", kind: "subtract", amount: 既払 },
  ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">過失割合</span>
        <ToggleGroup
          type="single"
          value={fault}
          onValueChange={(v) => v && setFault(v as string)}
          variant="outline"
          size="sm"
          disallowEmpty
        >
          {FAULTS.map((f) => (
            <ToggleGroupItem key={f} value={f} aria-label={`過失割合 ${f}%`}>
              {f}%
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Card className="p-5">
        <AmountBreakdown
          lines={lines}
          total={{ label: "今回支払額", amount: 支払額, tone: 支払額 > 0 ? "neutral" : "negative" }}
          formula="今回支払額 = 認定損害額 − 過失相殺 − 免責 − 既払金"
        />
      </Card>
    </div>
  );
}
