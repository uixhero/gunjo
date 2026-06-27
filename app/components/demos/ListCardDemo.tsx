"use client";

import * as React from "react";
import { ListCard, Badge, ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

// ListCard is the tappable list entry — here two faces: a route-search result list
// and a 運行情報 status list. Tap a card to select it.
const ROUTES = [
  { id: "r1", time: "10:42 → 11:14", sub: "32分・乗換0回・34.1km", price: "¥580", tags: ["最速", "おすすめ"] },
  { id: "r2", time: "10:46 → 11:20", sub: "34分・乗換0回・33.4km", price: "¥560", tags: ["最安"] },
  { id: "r3", time: "10:40 → 11:28", sub: "48分・乗換2回・35.0km", price: "¥640", tags: [] },
];

const LINES = [
  { id: "l1", name: "中央線快速", dot: "bg-destructive", status: "運転見合わせ", sev: "critical" as const, note: "人身事故の影響", at: "7:42" },
  { id: "l2", name: "京浜東北線", dot: "bg-warning", status: "遅延", sev: "warning" as const, note: "信号トラブルの影響", at: "7:40" },
  { id: "l3", name: "JR山手線", dot: "bg-success", status: "平常運転", sev: "neutral" as const, note: "", at: "8:40" },
];

export function ListCardDemo() {
  const [face, setFace] = React.useState<string>("経路");
  const [sel, setSel] = React.useState<string>("r1");

  return (
    <div className="w-full max-w-md space-y-4">
      <ToggleGroup
        type="single"
        value={face}
        onValueChange={(v) => v && setFace(v as string)}
        variant="outline"
        size="sm"
        disallowEmpty
      >
        <ToggleGroupItem value="経路">経路検索の結果</ToggleGroupItem>
        <ToggleGroupItem value="運行">運行情報の一覧</ToggleGroupItem>
      </ToggleGroup>

      {face === "経路" ? (
        <div className="flex flex-col gap-2">
          {ROUTES.map((r) => (
            <ListCard
              key={r.id}
              title={r.time}
              description={r.sub}
              tags={r.tags.map((t) => (
                <Badge key={t} variant={t === "最速" ? "info" : t === "最安" ? "success" : "secondary"}>
                  {t}
                </Badge>
              ))}
              meta={r.price}
              selected={sel === r.id}
              onSelect={() => setSel(r.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {LINES.map((l) => (
            <ListCard
              key={l.id}
              severity={l.sev}
              leading={<span className={`size-3 shrink-0 rounded-full ${l.dot}`} aria-hidden />}
              title={l.name}
              description={l.note || undefined}
              status={
                <Badge variant={l.sev === "critical" ? "destructive" : l.sev === "warning" ? "warning" : "success"}>
                  {l.status}
                </Badge>
              }
              meta={`${l.at} 更新`}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
