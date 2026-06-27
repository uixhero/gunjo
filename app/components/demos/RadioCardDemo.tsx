"use client";

import * as React from "react";
import { RadioCardGroup, RadioCard, Badge, formatCurrency } from "@gunjo/ui";

// The priced selectable choice card — here a きっぷ store. Single-select (radiogroup),
// arrow-key navigable, with a dominant price + an おトク hook.
const PRODUCTS = [
  { value: "toku", name: "都区内パス", area: "JR東京都区内 1日乗り放題", price: 760, save: "3回乗ればモト", tag: { label: "人気", variant: "info" as const } },
  { value: "holiday", name: "休日おでかけパス", area: "首都圏フリーエリア・土休日限定", price: 2720, save: "約1,000円分おトク", tag: { label: "観光向け", variant: "success" as const } },
  { value: "metro24", name: "東京メトロ 24時間券", area: "東京メトロ全線 24時間", price: 600, save: "4回乗ればモト", tag: null },
  { value: "hakone", name: "箱根フリーパス（2日間）", area: "小田急＋箱根の乗り物乗り放題", price: 6100, save: "期間限定特典あり", tag: { label: "期間限定", variant: "warning" as const } },
];

export function RadioCardDemo() {
  const [value, setValue] = React.useState("holiday");

  return (
    <div className="w-full max-w-md space-y-3">
      <RadioCardGroup value={value} onValueChange={setValue} aria-label="おトクなきっぷ">
        {PRODUCTS.map((p) => (
          <RadioCard
            key={p.value}
            value={p.value}
            title={p.name}
            description={p.area}
            tags={p.tag ? <Badge variant={p.tag.variant}>{p.tag.label}</Badge> : undefined}
            price={formatCurrency(p.price)}
            highlight={p.save}
          />
        ))}
      </RadioCardGroup>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        選択中: <span className="font-medium text-foreground">{PRODUCTS.find((p) => p.value === value)?.name}</span>
      </p>
    </div>
  );
}
