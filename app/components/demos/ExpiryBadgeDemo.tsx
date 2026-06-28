"use client";

import * as React from "react";
import { ExpiryBadge, Slider, Label, MetadataList } from "@gunjo/ui";

const TODAY = "2026-06-28"; // fixed for a deterministic demo

const QUALS = [
  { label: "普通二種免許", value: "2029-03-15" }, // valid
  { label: "適性診断（適齢）", value: "2026-07-20" }, // expiring soon
  { label: "健康診断", value: "2026-06-10" }, // expired
  { label: "地理試験合格証", value: null }, // missing
];

export function ExpiryBadgeDemo() {
  const [warn, setWarn] = React.useState(30);

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <Label className="mb-1.5 flex justify-between text-xs">
          <span>期限間近のしきい値（warnWithinDays）</span>
          <span className="tabular-nums text-muted-foreground">残{warn}日以内</span>
        </Label>
        <Slider min={7} max={120} step={1} value={warn} onValueChange={setWarn} />
      </div>

      <MetadataList
        items={QUALS.map((q) => ({
          label: q.label,
          value: <ExpiryBadge value={q.value} today={TODAY} warnWithinDays={warn} />,
        }))}
      />

      <p className="text-xs text-muted-foreground">
        基準日 {TODAY}。しきい値を上げると「適性診断」が有効→期限間近に変わる。失効/未登録は色のみに依存せずアイコン＋ラベルで表示。
      </p>
    </div>
  );
}
