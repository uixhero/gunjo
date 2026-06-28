"use client";

import * as React from "react";
import { SectionList, ListCard, type SectionListSection } from "@gunjo/ui";

const yen = (n: number) => `¥${n.toLocaleString()}`;

// Invoices grouped by 締め (the caller does the groupBy + subtotal math).
const GROUPS = [
  {
    key: "0630",
    title: "2026年6月末締め",
    rows: [
      { id: "i1", title: "丸和ロジ 御中", meta: "運行 12件", amount: 842000 },
      { id: "i2", title: "東西運輸 御中", meta: "運行 7件", amount: 503500 },
      { id: "i3", title: "北港物流 御中", meta: "運行 4件", amount: 318000 },
    ],
  },
  {
    key: "0620",
    title: "2026年6月20日締め",
    rows: [
      { id: "i4", title: "山陽商事 御中", meta: "運行 9件", amount: 612000 },
      { id: "i5", title: "中央倉庫 御中", meta: "運行 3件", amount: 196500 },
    ],
  },
];

export function SectionListDemo() {
  const [picked, setPicked] = React.useState<string | null>(null);

  const sections: SectionListSection[] = GROUPS.map((g) => {
    const subtotal = g.rows.reduce((s, r) => s + r.amount, 0);
    return {
      key: g.key,
      title: g.title,
      sublabel: `${g.rows.length}社`,
      meta: `小計 ${yen(subtotal)}`,
      content: (
        <div className="flex flex-col gap-1 px-1 py-1">
          {g.rows.map((r) => (
            <ListCard
              key={r.id}
              title={r.title}
              meta={r.meta}
              status={yen(r.amount)}
              onSelect={() => setPicked(r.id)}
              selected={picked === r.id}
            />
          ))}
        </div>
      ),
      footer: (
        <>
          <span className="text-muted-foreground">締め小計（{g.rows.length}社）</span>
          <span>{yen(subtotal)}</span>
        </>
      ),
    };
  });

  return (
    <div className="w-full max-w-lg">
      <SectionList sections={sections} label="締め別 請求一覧" />
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
        {picked ? `選択: ${[...GROUPS].flatMap((g) => g.rows).find((r) => r.id === picked)?.title}` : "締め日ごとにグループ化＋各グループの小計フッター。本文は呼び出し側（ここは ListCard）。"}
      </p>
    </div>
  );
}
