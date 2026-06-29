"use client";

import * as React from "react";
import { OriginDestination, Card, CardContent } from "@gunjo/ui";

const TRAINS = [
  { name: "のぞみ 501号", dep: "06:00", arr: "08:27", dur: "2時間27分" },
  { name: "ひかり 633号", dep: "06:33", arr: "09:30", dur: "2時間57分" },
];

export function OriginDestinationDemo() {
  const [from, setFrom] = React.useState({ label: "東京", sub: "新幹線" });
  const [to, setTo] = React.useState({ label: "新大阪", sub: "新幹線" });

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {/* Header variant — prominent A→B with a swap button + duration connector. */}
      <Card>
        <CardContent className="py-4">
          <OriginDestination
            from={from}
            to={to}
            connector="のぞみ最速 2:27"
            onSwap={() => {
              setFrom(to);
              setTo(from);
            }}
          />
        </CardContent>
      </Card>

      {/* via stops. */}
      <Card>
        <CardContent className="py-4">
          <OriginDestination
            from={{ label: "羽田", sub: "HND" }}
            to={{ label: "那覇", sub: "OKA" }}
            via={[{ label: "福岡" }]}
          />
        </CardContent>
      </Card>

      {/* Inline variant — the per-result 発→着 row. */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">列車一覧（inline）</p>
        {TRAINS.map((t) => (
          <div key={t.name} className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="text-sm font-medium">{t.name}</span>
            <OriginDestination
              inline
              from={{ label: t.dep, sub: "発" }}
              to={{ label: t.arr, sub: "着" }}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        ⇄ ボタンで {from.label}→{to.label} を入れ替え。横の A→B＝RouteStops/Itinerary（縦シーケンス）とは別物。
      </p>
    </div>
  );
}
