"use client";

import * as React from "react";
import { DocumentRow, SectionList, Checkbox, Button, Badge, type SectionListSection } from "@gunjo/ui";
import { IconFileTypePdf, IconDownload } from "@tabler/icons-react";

const DOCS = [
  { id: "p2606", year: "2026年", title: "2026年6月分 給与明細", meta: "PDF・124KB・発行日 2026/06/25", isNew: true },
  { id: "p2605", year: "2026年", title: "2026年5月分 給与明細", meta: "PDF・122KB・発行日 2026/05/25" },
  { id: "b2606", year: "2026年", title: "2026年 夏季賞与明細", meta: "PDF・98KB・発行日 2026/06/10" },
  { id: "g2025", year: "2025年", title: "2025年分 給与所得の源泉徴収票", meta: "PDF・88KB・発行日 2026/01/20" },
];

export function DocumentRowDemo() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const years = ["2026年", "2025年"];
  const sections: SectionListSection[] = years.map((year) => {
    const rows = DOCS.filter((d) => d.year === year);
    return {
      key: year,
      title: year,
      meta: `${rows.length}件`,
      content: (
        <div className="flex flex-col divide-y divide-border">
          {rows.map((d) => (
            <DocumentRow
              key={d.id}
              icon={<IconFileTypePdf className="size-5" />}
              title={d.title}
              meta={d.meta}
              status={d.isNew ? <Badge variant="info">新着</Badge> : undefined}
              control={
                <Checkbox
                  checked={selected.has(d.id)}
                  onCheckedChange={() => toggle(d.id)}
                  aria-label={`${d.title} を選択`}
                />
              }
              actions={
                <Button variant="ghost" size="icon" aria-label={`${d.title} をダウンロード`}>
                  <IconDownload className="size-4" />
                </Button>
              }
            />
          ))}
        </div>
      ),
    };
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <SectionList sections={sections} label="ダウンロードできる書類" />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {selected.size > 0 ? `選択中 ${selected.size}件（まとめてDL）` : "チェックボックス・行・DLボタンは独立した3つの操作対象（ListCard の単一 button では作れない）。"}
      </p>
    </div>
  );
}
