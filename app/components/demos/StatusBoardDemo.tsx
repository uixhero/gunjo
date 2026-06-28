"use client";

import * as React from "react";
import { StatusBoard, Switch, Label, type StatusBoardGroup } from "@gunjo/ui";
import { IconCar, IconUser, IconCoffee, IconAlertTriangle } from "@tabler/icons-react";

type V = { id: string; crew: string; status: string; tone: "success" | "primary" | "info" | "warning" | "danger" | "muted"; note: string };

const SHIBUYA: V[] = [
  { id: "501", crew: "佐藤", status: "空車", tone: "success", note: "渋谷駅付け待ち" },
  { id: "508", crew: "鈴木", status: "実車", tone: "primary", note: "六本木へ賃走中" },
  { id: "512", crew: "高橋", status: "迎車", tone: "info", note: "到着まで3分" },
  { id: "517", crew: "田中", status: "休憩", tone: "muted", note: "休憩 42分経過" },
];
const SHINJUKU: V[] = [
  { id: "603", crew: "伊藤", status: "空車", tone: "success", note: "新宿駅西口" },
  { id: "609", crew: "渡辺", status: "実車", tone: "primary", note: "練馬へ賃走中" },
  { id: "611", crew: "山本", status: "支払対応", tone: "warning", note: "決済処理中 2分" },
];

export function StatusBoardDemo() {
  const [grouped, setGrouped] = React.useState(true);
  const [breakdown, setBreakdown] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const toItem = (v: V) => {
    const isBroken = breakdown && v.id === "508";
    return {
      id: v.id,
      label: `${v.id}号車`,
      icon: <IconCar className="size-4" />,
      status: isBroken ? "故障" : v.status,
      tone: isBroken ? ("danger" as const) : v.tone,
      statusIcon: isBroken ? <IconAlertTriangle className="size-3" /> : v.status === "空車" ? <IconCar className="size-3" /> : v.status === "休憩" ? <IconCoffee className="size-3" /> : <IconUser className="size-3" />,
      location: v.crew + " 乗務",
      note: isBroken ? "エンジン警告灯・対応要" : v.note,
      onSelect: () => setSelected(v.id),
    };
  };

  const groups: StatusBoardGroup[] = [
    { label: "渋谷エリア", items: SHIBUYA.map(toItem) },
    { label: "新宿エリア", items: SHINJUKU.map(toItem) },
  ];
  const flat = [...SHIBUYA, ...SHINJUKU].map(toItem);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <Switch id="sb-group" checked={grouped} onCheckedChange={setGrouped} />
          <Label htmlFor="sb-group" className="text-xs">エリア別にグループ化</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sb-break" checked={breakdown} onCheckedChange={setBreakdown} />
          <Label htmlFor="sb-break" className="text-xs">508号車を故障にする（fault-first 再ソート）</Label>
        </div>
      </div>

      {grouped ? (
        <StatusBoard groups={groups} selectedId={selected} minTileWidth={160} />
      ) : (
        <StatusBoard items={flat} selectedId={selected} minTileWidth={160} />
      )}

      <p className="text-xs text-muted-foreground">
        {selected ? `選択中：${selected}号車（タイルをクリック／Tab で選択）` : "故障/空車は先頭にソート・状態はアイコン＋ラベルで色のみに依存しない。グループ見出しは要対応件数を表示。"}
      </p>
    </div>
  );
}
