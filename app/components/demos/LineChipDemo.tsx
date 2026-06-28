import * as React from "react";
import { LineChip } from "@gunjo/ui";

// Real-ish line/route brand colours (hex → auto-contrast text).
const LINES = [
  { label: "渋88", hex: "#e60012" }, // 赤
  { label: "宿51", hex: "#0079c2" }, // 青
  { label: "東98", hex: "#009944" }, // 緑
  { label: "都07", hex: "#f5a200" }, // 橙（明 → 黒文字）
  { label: "JY", hex: "#9acd32" }, // 山手・黄緑（明 → 黒文字）
  { label: "M", hex: "#f62e36" }, // 丸ノ内
  { label: "G", hex: "#ff9500" }, // 銀座（明 → 黒文字）
];

export function LineChipDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {LINES.map((l) => (
          <LineChip key={l.label} label={l.label} color={l.hex} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LineChip label="渋66" color="#e60012" size="sm" />
        <LineChip label="丸ノ内線" color="#f62e36" />
        <LineChip label="路線色なし" />
        <span className="text-xs text-muted-foreground">
          ← 明色 (#f5a200/#9acd32) は黒文字・暗色は白文字に自動。色を省くと中立チップ（ラベルが意味を担う）。
        </span>
      </div>
    </div>
  );
}
