"use client";

import * as React from "react";
import { SegmentedControl } from "@gunjo/ui";

export function SegmentedControlDemo() {
  const [passenger, setPassenger] = React.useState("adult");
  const [pay, setPay] = React.useState("ic");
  const [range, setRange] = React.useState("week");

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">旅客区分</span>
        <SegmentedControl
          aria-label="旅客区分"
          value={passenger}
          onValueChange={setPassenger}
          options={[
            { value: "adult", label: "大人" },
            { value: "child", label: "小児" },
            { value: "disabled", label: "障がい者" },
          ]}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">お支払い</span>
        <SegmentedControl
          aria-label="お支払い"
          value={pay}
          onValueChange={setPay}
          options={[
            { value: "cash", label: "現金" },
            { value: "ic", label: "IC" },
            { value: "qr", label: "QR" },
          ]}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">集計期間（lg・2分割）</span>
        <SegmentedControl
          aria-label="集計期間"
          size="lg"
          value={range}
          onValueChange={setRange}
          options={[
            { value: "day", label: "日" },
            { value: "week", label: "週" },
            { value: "month", label: "月" },
          ]}
        />
      </label>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        選択: 旅客={passenger} / 支払={pay} / 期間={range}。←→ キーで移動・選択。onValueChange は常に単一の string。
      </p>
    </div>
  );
}
