"use client";

import * as React from "react";
import { LimitMonitor, Slider } from "@gunjo/ui";

const fmtH = (v: number) => `${v.toFixed(1)}時間`;

export function LimitMonitorDemo() {
  // 拘束時間: ceiling — soft 13h (基準), hard 16h (上限). Drag to cross the limits.
  const [kosoku, setKosoku] = React.useState(12.5);

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2">
        <LimitMonitor
          label="拘束時間（当日）"
          value={kosoku}
          limit={13}
          hardLimit={16}
          warnWithin={1}
          formatValue={fmtH}
        />
        <Slider
          aria-label="拘束時間を調整"
          value={kosoku}
          min={8}
          max={17}
          step={0.5}
          onValueChange={setKosoku}
        />
        <p className="text-xs text-muted-foreground">
          ↑ ドラッグで 基準内→基準間近(12h〜)→基準超過(13h〜)→上限超過(16h〜)。基準線と上限線をバー上に描画。
        </p>
      </div>

      {/* 連続運転: ceiling — 4h で中断必須, 0.5h 前から near */}
      <LimitMonitor label="連続運転時間" value={3.7} limit={4} warnWithin={0.5} formatValue={fmtH} />

      {/* 休息期間: floor — 11h 下限 (value must stay ABOVE) */}
      <LimitMonitor label="休息期間" value={9.5} limit={11} direction="floor" formatValue={fmtH} />

      <p className="text-xs text-muted-foreground">
        連続運転＝天井(4h で超過)・休息期間＝床(11h を下回ると割れ)。日付は ExpiryBadge、範囲は ReferenceValue、容量は Meter、名前付き上限は LimitMonitor。
      </p>
    </div>
  );
}
