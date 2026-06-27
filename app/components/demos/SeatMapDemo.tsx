"use client";

import * as React from "react";
import { SeatMap, type Seat } from "@gunjo/ui";

// A 3-3 single-aisle cabin (737-style). Rows 11-12 are 非常口 (足元ゆったり, +¥).
const COLUMNS = ["A", "B", "C", null, "D", "E", "F"] as const;

const OCCUPIED = new Set(["10C", "10D", "11A", "12F", "13B", "13C", "14E"]);

function buildSeats(): Seat[] {
  const out: Seat[] = [];
  for (let r = 10; r <= 15; r++) {
    for (const c of ["A", "B", "C", "D", "E", "F"]) {
      const id = `${r}${c}`;
      const exit = r === 11 || r === 12;
      out.push({
        id,
        row: r,
        col: c,
        state: OCCUPIED.has(id) ? "occupied" : "available",
        position: c === "A" || c === "F" ? "window" : c === "C" || c === "D" ? "aisle" : "middle",
        type: exit ? "非常口座席（足元ゆったり）" : undefined,
        fee: exit ? 1500 : undefined,
      });
    }
  }
  return out;
}

const SEATS = buildSeats();

export function SeatMapDemo() {
  const [selected, setSelected] = React.useState<string[]>(["13E"]);
  const MAX = 2;

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));

  return (
    <div className="w-full max-w-sm space-y-3">
      <p className="text-sm text-muted-foreground">
        座席を選択（最大 {MAX} 席）。選択中:{" "}
        <span className="font-medium text-foreground">{selected.length ? selected.join("・") : "なし"}</span>
      </p>
      <SeatMap
        columns={[...COLUMNS]}
        seats={SEATS}
        selectedIds={selected}
        maxSelectable={MAX}
        onToggle={toggle}
        label="普通席 座席表"
      />
    </div>
  );
}
