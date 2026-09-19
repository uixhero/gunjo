"use client";

import * as React from "react";
import {
  IconArrowsSplit,
  IconBan,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react";
import {
  Badge,
  ListCard,
  SegmentedControl,
  StatusLevel,
  compareStatusLevel,
  highestStatusLevel,
  statusLevelStep,
  type StatusLevelStep,
} from "@gunjo/ui";

// 段は軽い順に1回だけ書く。並べ替えも全体の導出もこの配列から引く。
const SERVICE_LEVELS = [
  { value: "normal", label: "平常運転", tone: "success", icon: <IconCircleCheck /> },
  { value: "delay", label: "遅延", tone: "warning", icon: <IconClock /> },
  { value: "detour", label: "迂回", tone: "warning", icon: <IconArrowsSplit /> },
  { value: "suspended", label: "運休", tone: "destructive", icon: <IconBan /> },
] as const satisfies readonly StatusLevelStep[];

const ROUTES = [
  { id: "都06", name: "渋谷駅前〜新橋駅前", level: "delay", note: "約15分遅れ" },
  { id: "宿75", name: "新宿駅西口〜三宅坂", level: "detour", note: "迂回運行" },
  { id: "品98", name: "品川駅港南口〜大井競馬場前", level: "suspended", note: "一部区間運休" },
  { id: "東22", name: "東京駅丸の内北口〜錦糸町駅前", level: "normal", note: "平常運転" },
];

export function StatusLevelDemo() {
  const [value, setValue] = React.useState<string>("detour");

  const sorted = React.useMemo(
    () => [...ROUTES].sort((a, b) => compareStatusLevel(SERVICE_LEVELS, b.level, a.level)),
    []
  );
  const overall = highestStatusLevel(SERVICE_LEVELS, ROUTES.map((r) => r.level));

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="space-y-3 rounded-lg border bg-card p-4">
        <SegmentedControl
          aria-label="いまのレベル"
          size="sm"
          options={SERVICE_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
          value={value}
          onValueChange={setValue}
        />
        <StatusLevel levels={SERVICE_LEVELS} value={value} size="lg" />
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((route) => (
          <ListCard
            key={route.id}
            leading={<Badge variant="outline">{route.id}</Badge>}
            title={route.name}
            description={route.note}
            severity={statusLevelStep(SERVICE_LEVELS, route.level)?.tone === "destructive" ? "critical" : undefined}
            status={<StatusLevel levels={SERVICE_LEVELS} value={route.level} />}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        全体の運行状況は「{statusLevelStep(SERVICE_LEVELS, overall)?.label}」。段バーは前景色と枠線色の濃淡なので、
        色を落としても何段目かを数えられます。
      </p>
    </div>
  );
}
