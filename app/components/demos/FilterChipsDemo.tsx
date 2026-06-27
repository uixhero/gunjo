"use client";

import * as React from "react";
import { FilterChips, ListCard, Badge, type FilterChip } from "@gunjo/ui";

const CATEGORIES: FilterChip[] = [
  { value: "all", label: "すべて", count: 24 },
  { value: "gate", label: "搭乗口", count: 8 },
  { value: "lounge", label: "ラウンジ", count: 3 },
  { value: "shop", label: "店舗・免税", count: 6 },
  { value: "food", label: "飲食", count: 5 },
  { value: "toilet", label: "トイレ", count: 9 },
  { value: "money", label: "ATM・両替", count: 4 },
  { value: "smoking", label: "喫煙所", count: 2 },
];

const FACILITIES = [
  { cat: "lounge", name: "TIAT LOUNGE", area: "本館3F・制限エリア内", meta: "徒歩4分", open: true },
  { cat: "shop", name: "Fa-So-La 免税店", area: "本館3F・出国後", meta: "徒歩2分", open: true },
  { cat: "food", name: "江戸小路", area: "本館4F", meta: "徒歩6分", open: false },
  { cat: "gate", name: "搭乗口 68番", area: "サテライト・制限エリア内", meta: "徒歩11分", open: true },
];

export function FilterChipsDemo() {
  const [cat, setCat] = React.useState("all");
  const list = cat === "all" ? FACILITIES : FACILITIES.filter((f) => f.cat === cat);

  return (
    <div className="w-full max-w-md space-y-3">
      <FilterChips items={CATEGORIES} value={cat} onValueChange={setCat} aria-label="施設カテゴリ" />
      <div className="flex flex-col gap-2">
        {list.length ? (
          list.map((f) => (
            <ListCard
              key={f.name}
              title={f.name}
              description={f.area}
              status={<Badge variant={f.open ? "success" : "secondary"}>{f.open ? "営業中" : "営業時間外"}</Badge>}
              meta={f.meta}
              onSelect={() => {}}
            />
          ))
        ) : (
          <p className="px-1 py-6 text-center text-sm text-muted-foreground">該当する施設はありません</p>
        )}
      </div>
    </div>
  );
}
