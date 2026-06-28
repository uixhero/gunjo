"use client";

import * as React from "react";
import { Leaderboard, type LeaderboardItem, ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

// Best-first: 営業所別 売上 (up = good → default Delta tones, green up).
const SALES: LeaderboardItem[] = [
  { id: "shibuya", label: "渋谷営業所", sublabel: "12系統", value: 4820, delta: 6.2, tone: "primary" },
  { id: "shinjuku", label: "新宿営業所", sublabel: "9系統", value: 4310, delta: 3.1, tone: "primary" },
  { id: "meguro", label: "目黒営業所", sublabel: "7系統", value: 3180, delta: -1.4, tone: "primary" },
  { id: "ota", label: "大田営業所", sublabel: "8系統", value: 2640, delta: 0.8, tone: "primary" },
  { id: "setagaya", label: "世田谷営業所", sublabel: "6系統", value: 1990, delta: -4.7, tone: "primary" },
];

// Worst-first: 系統別 事故率 (走行百万kmあたり, up = BAD → inverted Delta tones, red up).
const SAFETY: LeaderboardItem[] = [
  { id: "shibuya88", label: "渋88 系統", sublabel: "渋谷↔六本木", value: 3.4, delta: 0.9, tone: "destructive" },
  { id: "shuku51", label: "宿51 系統", sublabel: "新宿↔練馬", value: 2.8, delta: 0.3, tone: "destructive" },
  { id: "higashi98", label: "東98 系統", sublabel: "東京↔等々力", value: 1.9, delta: -0.6, tone: "warning" },
  { id: "to07", label: "都07 系統", sublabel: "門前仲町↔錦糸町", value: 1.2, delta: -0.2, tone: "warning" },
  { id: "rin01", label: "臨01 系統", sublabel: "東京↔ビッグサイト", value: 0.6, delta: -0.4, tone: "success" },
];

export function LeaderboardDemo() {
  const [mode, setMode] = React.useState<"sales" | "safety">("sales");
  const [picked, setPicked] = React.useState<string | number | null>(null);

  const sales = mode === "sales";
  const items = (sales ? SALES : SAFETY).map((it) => ({ ...it, onSelect: () => setPicked(it.id) }));

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(v) => v && setMode(v as "sales" | "safety")}
        aria-label="ランキングの種類"
      >
        <ToggleGroupItem value="sales">売上（多い順）</ToggleGroupItem>
        <ToggleGroupItem value="safety">事故率（高い順・要対応）</ToggleGroupItem>
      </ToggleGroup>

      <Leaderboard
        items={items}
        label={sales ? "営業所別 売上ランキング" : "系統別 事故率ランキング"}
        selectedId={picked ?? undefined}
        formatValue={(v) => (sales ? `¥${v.toLocaleString()}万` : `${v.toFixed(1)}件`)}
        formatDelta={(d) => `${d > 0 ? "+" : ""}${sales ? `${d.toFixed(1)}%` : d.toFixed(1)}`}
        // 事故率は「上昇＝悪い」なので Delta の色を反転
        deltaTones={sales ? undefined : { positive: "destructive", negative: "success" }}
      />

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {picked
          ? `選択: ${[...SALES, ...SAFETY].find((i) => i.id === picked)?.label}`
          : sales
            ? "売上が多い順。前年比は上昇＝緑（良い）。行をクリックで選択。"
            : "事故率が高い順＝要対応の並び。前年比は上昇＝赤（悪化）に反転（deltaTones）。"}
      </p>
    </div>
  );
}
