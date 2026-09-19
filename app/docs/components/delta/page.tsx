"use client";

import {
  Delta,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  formatCurrency,
} from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";

import { DeltaDemo } from "@/components/demos/DeltaDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const yen = (v: number) => formatCurrency(v, { signed: true });
const magnitude = (v: number) => formatCurrency(Math.abs(v));

const usageCode = `import { Delta, formatCurrency } from "@gunjo/ui"

const yen = (v: number) => formatCurrency(v, { signed: true })

export function Example() {
  return (
    <>
      {/* Gain/loss — default tones (positive = success, negative = destructive) */}
      <Delta value={12500} format={yen} labels={{ positive: "増加", negative: "減少" }} />

      {/* Cash over/short — positive isn't "good", so remap the tones */}
      <Delta
        value={-930}
        format={yen}
        tones={{ positive: "warning", negative: "destructive", zero: "success" }}
        labels={{ positive: "過剰", negative: "不足", zero: "一致" }}
        showLabel
      />
    </>
  )
}`;

const propsData = [
  {
    name: "value",
    type: "number",
    description: "The signed change. Its sign drives the arrow, tone and label.",
  },
  {
    name: "format",
    type: "(value: number) => React.ReactNode",
    description:
      "Format the numeric value. Default: signed, grouped ja-JP (+1,000 / −930). Pass formatCurrency for ¥.",
  },
  {
    name: "tones",
    type: "Partial<Record<DeltaSign, DeltaTone>>",
    description:
      "Tone per sign. Default { positive: \"success\", negative: \"destructive\", zero: \"muted\" }. Override where positive isn't \"good\" (cash over/short).",
  },
  {
    name: "labels",
    type: "Partial<Record<DeltaSign, React.ReactNode>>",
    description:
      "Accessible (and optionally visible) label per sign, e.g. { positive: \"過剰\", negative: \"不足\", zero: \"一致\" }. Always announced — meaning never rides on colour alone.",
  },
  {
    name: "showLabel",
    type: "boolean",
    description: "Render the sign label visibly after the value. Default false (screen-reader-only).",
  },
  {
    name: "hideArrow",
    type: "boolean",
    description: "Hide the directional arrow. Default false.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
];

export default function DeltaDocPage() {
  const { locale } = useLocale();
  const title = meta.delta.title ?? "Delta";
  const description = meta.delta.description ?? "";

  const countLabels = locale === "ja"
    ? { positive: "増加", negative: "減少", zero: "増減なし" }
    : { positive: "up", negative: "down", zero: "no change" };

  const varianceRows = locale === "ja"
    ? [
      { account: "売上高", amount: 4820000, diff: 312000 },
      { account: "仕入高", amount: 2640000, diff: -95000 },
      { account: "販売管理費", amount: 1180000, diff: 0 },
    ]
    : [
      { account: "Revenue", amount: 4820000, diff: 312000 },
      { account: "Cost of goods", amount: 2640000, diff: -95000 },
      { account: "Operating expenses", amount: 1180000, diff: 0 },
    ];

  const varianceHeads = locale === "ja"
    ? { account: "勘定科目", amount: "当月", diff: "前月差" }
    : { account: "Account", amount: "This month", diff: "vs. last month" };

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[]}
      relatedComponents={[
        { name: "Statistic", href: "/docs/components/statistic" },
        { name: "ReferenceValue", href: "/docs/components/reference-value" },
        { name: "SparklineChart", href: "/docs/components/sparkline-chart" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <DeltaDemo />
      </ComponentPreview>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {locale === "ja"
            ? "Delta が読む値は value ひとつで、そこから矢印・色・読み上げのラベルが決まります。見え方を変える口は3つです。format が数字の書き方、hideArrow が矢印の有無、showLabel が labels を画面に出すかどうかを決めます。"
            : "Delta reads one number, value, and derives the arrow, the tone, and the announced label from its sign. Three props change how that reads: format sets how the number is written, hideArrow drops the glyph, and showLabel decides whether labels appears on screen."}
        </p>
        <ComponentDemoStates
          states={[
            {
              key: "default-format",
              title: locale === "ja" ? "既定の書式（通貨ではない数）" : "Default format (not money)",
              description: locale === "ja"
                ? "format を渡さないときは、符号つきで桁区切りした数がそのまま出ます（+1,240 / −58）。会員数・在庫数・件数のように単位が通貨でない増減は、この既定のままで足ります。"
                : "With no format, the number is written signed and grouped as-is (+1,240 / −58). Counts of people, stock, or tickets need nothing more than this default.",
              preview: (
                <div className="flex flex-wrap items-center gap-6">
                  <Delta value={1240} labels={countLabels} />
                  <Delta value={-58} labels={countLabels} />
                  <Delta value={0} labels={countLabels} />
                </div>
              ),
              code: locale === "ja"
                ? `import { Delta } from "@gunjo/ui";

const labels = { positive: "増加", negative: "減少", zero: "増減なし" };

export function MemberCountDelta() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Delta value={1240} labels={labels} />
      <Delta value={-58} labels={labels} />
      <Delta value={0} labels={labels} />
    </div>
  );
}`
                : `import { Delta } from "@gunjo/ui";

const labels = { positive: "up", negative: "down", zero: "no change" };

export function MemberCountDelta() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Delta value={1240} labels={labels} />
      <Delta value={-58} labels={labels} />
      <Delta value={0} labels={labels} />
    </div>
  );
}`,
            },
            {
              key: "no-arrow",
              title: locale === "ja" ? "矢印を落として表の列に置く" : "No arrow, inside a table column",
              description: locale === "ja"
                ? "hideArrow を付けると矢印が消え、数字の頭がそろいます。金額の列に混ぜるときはこちらです。向きは色だけでなく labels が読み上げるので、矢印を落としても意味は残ります。"
                : "hideArrow removes the glyph so the digits line up at the left of the column. Use it when the delta sits in a money column. Direction is still announced through labels, so dropping the arrow does not drop the meaning.",
              preview: (
                <div className="w-full max-w-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{varianceHeads.account}</TableHead>
                        <TableHead className="text-right">{varianceHeads.amount}</TableHead>
                        <TableHead className="text-right">{varianceHeads.diff}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {varianceRows.map((row) => (
                        <TableRow key={row.account}>
                          <TableCell>{row.account}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrency(row.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Delta value={row.diff} format={yen} hideArrow labels={countLabels} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ),
              code: locale === "ja"
                ? `import {
  Delta,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  formatCurrency,
} from "@gunjo/ui";

const yen = (v: number) => formatCurrency(v, { signed: true });
const labels = { positive: "増加", negative: "減少", zero: "増減なし" };

const rows = [
  { account: "売上高", amount: 4820000, diff: 312000 },
  { account: "仕入高", amount: 2640000, diff: -95000 },
  { account: "販売管理費", amount: 1180000, diff: 0 },
];

export function BudgetVarianceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>勘定科目</TableHead>
          <TableHead className="text-right">当月</TableHead>
          <TableHead className="text-right">前月差</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.account}>
            <TableCell>{row.account}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(row.amount)}
            </TableCell>
            <TableCell className="text-right">
              <Delta value={row.diff} format={yen} hideArrow labels={labels} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`
                : `import {
  Delta,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  formatCurrency,
} from "@gunjo/ui";

const yen = (v: number) => formatCurrency(v, { signed: true });
const labels = { positive: "up", negative: "down", zero: "no change" };

const rows = [
  { account: "Revenue", amount: 4820000, diff: 312000 },
  { account: "Cost of goods", amount: 2640000, diff: -95000 },
  { account: "Operating expenses", amount: 1180000, diff: 0 },
];

export function BudgetVarianceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead className="text-right">This month</TableHead>
          <TableHead className="text-right">vs. last month</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.account}>
            <TableCell>{row.account}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(row.amount)}
            </TableCell>
            <TableCell className="text-right">
              <Delta value={row.diff} format={yen} hideArrow labels={labels} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`,
            },
            {
              key: "magnitude",
              title: locale === "ja" ? "大きさだけを出して、向きは言葉で言う" : "Magnitude in figures, direction in words",
              description: locale === "ja"
                ? "format は生の value を受け取るので、Math.abs を通せば符号を落として大きさだけを書けます。showLabel を足すと labels が画面にも出るので、向きは記号ではなく言葉で伝わります。読み上げは元から labels を読みます。"
                : "format receives the raw value, so passing it through Math.abs prints magnitude only. Adding showLabel puts labels on screen as well, so the direction is carried by a word instead of a sign. Screen readers were already getting that word.",
              preview: (
                <div className="flex flex-wrap items-center gap-6">
                  <Delta
                    value={312000}
                    format={magnitude}
                    labels={locale === "ja" ? { positive: "増加" } : { positive: "up" }}
                    showLabel
                  />
                  <Delta
                    value={-95000}
                    format={magnitude}
                    labels={locale === "ja" ? { negative: "減少" } : { negative: "down" }}
                    showLabel
                  />
                </div>
              ),
              code: locale === "ja"
                ? `import { Delta, formatCurrency } from "@gunjo/ui";

const magnitude = (v: number) => formatCurrency(Math.abs(v));

export function SalesMagnitude() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Delta
        value={312000}
        format={magnitude}
        labels={{ positive: "増加" }}
        showLabel
      />
      <Delta
        value={-95000}
        format={magnitude}
        labels={{ negative: "減少" }}
        showLabel
      />
    </div>
  );
}`
                : `import { Delta, formatCurrency } from "@gunjo/ui";

const magnitude = (v: number) => formatCurrency(Math.abs(v));

export function SalesMagnitude() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Delta
        value={312000}
        format={magnitude}
        labels={{ positive: "up" }}
        showLabel
      />
      <Delta
        value={-95000}
        format={magnitude}
        labels={{ negative: "down" }}
        showLabel
      />
    </div>
  );
}`,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
        <PropsTable data={propsData} />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
          <CodeBlock code={usageCode} />
        </div>
      </div>
    </ComponentLayout>
  );
}
