"use client";

import * as React from "react";
import { Stringline, Slider, Switch, Label, Badge, type StringlineStop, type StringlineRun } from "@gunjo/ui";

const STOPS: StringlineStop[] = [
  { id: "sjk", label: "新宿", distance: 0 },
  { id: "ngt", label: "中野", distance: 4.4 },
  { id: "kji", label: "吉祥寺", distance: 12.2 },
  { id: "mtk", label: "三鷹", distance: 14.3 },
  { id: "kkb", label: "国分寺", distance: 21.3 },
  { id: "ttc", label: "立川", distance: 27.2 },
];

// minutes-from-midnight helper
const t = (h: number, m: number) => h * 60 + m;

// A down run (新宿→立川) every ~12 min; an up run (立川→新宿) interleaved.
function downRun(id: string, dep: number, tone?: StringlineRun["tone"]): StringlineRun {
  return {
    id,
    label: id,
    direction: "down",
    tone,
    points: [
      { stopId: "sjk", time: dep },
      { stopId: "ngt", time: dep + 6 },
      { stopId: "kji", time: dep + 16 },
      { stopId: "mtk", time: dep + 19 },
      { stopId: "kkb", time: dep + 28 },
      { stopId: "ttc", time: dep + 37 },
    ],
  };
}
function upRun(id: string, dep: number): StringlineRun {
  return {
    id,
    label: id,
    direction: "up",
    points: [
      { stopId: "ttc", time: dep },
      { stopId: "kkb", time: dep + 9 },
      { stopId: "mtk", time: dep + 18 },
      { stopId: "kji", time: dep + 21 },
      { stopId: "ngt", time: dep + 31 },
      { stopId: "sjk", time: dep + 38 },
    ],
  };
}

export function StringlineDemo() {
  const [now, setNow] = React.useState(t(7, 30));
  const [delay, setDelay] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  // The 07:12 down run; with `delay` on, its actual line lags (bunching toward 07:24).
  const delayedRun: StringlineRun = React.useMemo(() => {
    const base = downRun("快速 712T", t(7, 12), "primary");
    if (!delay) return { ...base, onSelect: () => setSelected("快速 712T") };
    return {
      ...base,
      tone: "danger",
      onSelect: () => setSelected("快速 712T"),
      actual: base.points.map((p, i) => ({ ...p, time: p.time + Math.min(i * 2, 8) })),
    };
  }, [delay]);

  const runs: StringlineRun[] = [
    downRun("700T", t(7, 0)),
    delayedRun,
    downRun("724T", t(7, 24)),
    downRun("736T", t(7, 36)),
    upRun("701T", t(7, 5)),
    upRun("719T", t(7, 19)),
    upRun("733T", t(7, 33)),
  ].map((r) => ({ ...r, onSelect: r.onSelect ?? (() => setSelected(String(r.id))) }));

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="min-w-52 flex-1">
          <Label className="mb-1.5 flex justify-between text-xs">
            <span>現在時刻（now-line）</span>
            <span className="tabular-nums text-muted-foreground">
              {String(Math.floor(now / 60)).padStart(2, "0")}:{String(now % 60).padStart(2, "0")}
            </span>
          </Label>
          <Slider min={t(7, 0)} max={t(8, 20)} step={1} value={now} onValueChange={(v) => setNow(v)} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sl-delay" checked={delay} onCheckedChange={setDelay} />
          <Label htmlFor="sl-delay" className="text-xs">712T を遅延させる（予実・続行）</Label>
        </div>
      </div>

      <Stringline
        stops={STOPS}
        runs={runs}
        startTime={t(7, 0)}
        endTime={t(8, 20)}
        now={now}
        tickInterval={20}
        selectedRunId={selected}
        height={300}
      />

      <p className="text-xs text-muted-foreground">
        {selected ? (
          <>選択中の運行：<Badge variant="secondary">{selected}</Badge>（線をクリック／Tab で選択）</>
        ) : (
          "斜線＝各運行（下り＝青・上り＝水）。傾き＝速度、近づく線＝続行（だんご）。線をクリックで選択。"
        )}
        {delay && " 712T は実線（実績）が破線（計画）から遅れ、724T に接近＝続行。"}
      </p>
    </div>
  );
}
