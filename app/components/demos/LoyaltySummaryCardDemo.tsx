"use client";

import * as React from "react";
import { LoyaltySummaryCard, Badge, Button, ToggleGroup, ToggleGroupItem, formatNumber } from "@gunjo/ui";

// The points/tier hero. Toggle the brand surface vs a plain card.
export function LoyaltySummaryCardDemo() {
  const [tone, setTone] = React.useState<"brand" | "default">("brand");

  return (
    <div className="w-full max-w-sm space-y-3">
      <ToggleGroup
        type="single"
        value={tone}
        onValueChange={(v) => v && setTone(v as "brand" | "default")}
        variant="outline"
        size="sm"
        disallowEmpty
      >
        <ToggleGroupItem value="brand">brand</ToggleGroupItem>
        <ToggleGroupItem value="default">default</ToggleGroupItem>
      </ToggleGroup>

      <LoyaltySummaryCard
        tone={tone}
        meta="ハッピーズドラッグ メンバーズ"
        tier={<Badge variant={tone === "brand" ? "outline" : "warning"}>ゴールド会員</Badge>}
        balanceLabel="ポイント残高"
        balance={formatNumber(3480)}
        unit="P"
        secondary={[
          { label: "今月の獲得", value: "+312 P" },
          { label: "当年購入額", value: "¥86,200" },
        ]}
        progress={{
          value: 86200,
          max: 100000,
          label: "プラチナ会員まで あと ¥13,800",
          caption: "¥86,200 / ¥100,000",
        }}
        alert="200 P が 2026/06/30 に失効予定です"
        action={
          <Button size="lg" variant={tone === "brand" ? "secondary" : "default"} className="w-full">
            会員バーコードを表示
          </Button>
        }
      />
    </div>
  );
}
