"use client";

import * as React from "react";
import { ActionQueue, Button, ToggleGroup, ToggleGroupItem, type ActionItem } from "@gunjo/ui";

// The morning-dashboard triage list — here a 生保営業 "要対応" queue. Filter by surface
// to see severity ordering re-pack. The other half of the dashboard alongside StatGroup.
const ALL: (ActionItem & { surface: string })[] = [
  { surface: "失効", severity: "critical", kind: "失効リスク", title: "田所 慎一さま — 終身保険が今月末で失効", detail: "保険料未入金。失効防止コールを本日中に。", meta: "本日" },
  { surface: "更新", severity: "warning", kind: "更新", title: "三宅 加奈さま — 収入保障保険の更新期限", detail: "更新手続き書類の送付がまだ。", meta: "あと7日" },
  { surface: "満期", severity: "warning", kind: "満期", title: "黒川 大悟さま — 学資保険が満期", detail: "満期金のご案内と次プランの提案。", meta: "あと14日" },
  { surface: "誕生日", severity: "info", kind: "誕生日", title: "宇佐美 結菜さま — お誕生日", detail: "ご連絡のきっかけ。医療特約の見直し提案も。", meta: "明日" },
  { surface: "誕生日", severity: "info", kind: "誕生日", title: "永田 龍一さま — お誕生日", meta: "あと3日" },
];

const SURFACES = ["すべて", "失効", "更新", "満期", "誕生日"] as const;

export function ActionQueueDemo() {
  const [surface, setSurface] = React.useState<string>("すべて");
  const items = surface === "すべて" ? ALL : ALL.filter((a) => a.surface === surface);

  return (
    <div className="w-full max-w-xl space-y-4">
      <ToggleGroup
        type="single"
        value={surface}
        onValueChange={(v) => v && setSurface(v as string)}
        variant="outline"
        size="sm"
        disallowEmpty
      >
        {SURFACES.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {s}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ActionQueue
        items={items.map((it) => ({
          ...it,
          actions: (
            <Button size="sm" variant={it.severity === "critical" ? "default" : "outline"}>
              対応
            </Button>
          ),
        }))}
      />
    </div>
  );
}
