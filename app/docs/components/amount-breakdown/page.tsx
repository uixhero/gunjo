"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { AmountBreakdown, Card, ToggleGroup, ToggleGroupItem, type AmountLine } from "@gunjo/ui";

type Locale = "ja" | "en";

const faultOptions = ["0", "20", "30", "50"] as const;
function amountCopy(locale: Locale) {
  return locale === "ja"
    ? {
        faultLabel: "過失割合",
        certifiedHeading: "認定損害額",
        repair: "修理費",
        tow: "レッカー費用",
        rental: "代車費用",
        certifiedTotal: "認定損害額 計",
        faultDeduction: "過失相殺",
        deductible: "免責金額",
        paid: "既払金（内払）",
        total: "今回支払額",
        formula: "今回支払額 = 認定損害額 - 過失相殺 - 免責 - 既払金",
        note: (fault: string) => `認定額 × 過失割合 ${fault}%`,
      }
    : {
        faultLabel: "Fault ratio",
        certifiedHeading: "Certified loss",
        repair: "Repair",
        tow: "Towing",
        rental: "Rental car",
        certifiedTotal: "Certified loss total",
        faultDeduction: "Fault deduction",
        deductible: "Deductible",
        paid: "Already paid",
        total: "Payment this time",
        formula: "Payment = certified loss - fault deduction - deductible - already paid",
        note: (fault: string) => `Certified total x ${fault}% fault ratio`,
      };
}

function buildBreakdown(locale: Locale, fault: string) {
  const copy = amountCopy(locale);
  const certified = [
    { label: copy.repair, amount: 480_000 },
    { label: copy.tow, amount: 22_000 },
    { label: copy.rental, amount: 38_000 },
  ];
  const certifiedTotal = certified.reduce((sum, line) => sum + line.amount, 0);
  const faultDeduction = Math.round(certifiedTotal * (Number(fault) / 100));
  const deductible = 50_000;
  const paid = 100_000;
  const payment = certifiedTotal - faultDeduction - deductible - paid;
  const lines: AmountLine[] = [
    { type: "heading", label: copy.certifiedHeading },
    ...certified,
    { type: "subtotal", label: copy.certifiedTotal, amount: certifiedTotal },
    { label: copy.faultDeduction, kind: "subtract", amount: faultDeduction, note: copy.note(fault) },
    { label: copy.deductible, kind: "subtract", amount: deductible },
    { label: copy.paid, kind: "subtract", amount: paid },
  ];

  return { lines, payment, formula: copy.formula, copy };
}

function AmountBreakdownPreview({ locale, initialFault = "30" }: { locale: Locale; initialFault?: string }) {
  const [fault, setFault] = React.useState(initialFault);
  const { lines, payment, formula, copy } = buildBreakdown(locale, fault);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">{copy.faultLabel}</span>
        <ToggleGroup
          type="single"
          value={fault}
          onValueChange={(value) => value && setFault(value)}
          variant="outline"
          size="sm"
          disallowEmpty
          aria-label={copy.faultLabel}
        >
          {faultOptions.map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              aria-label={`${copy.faultLabel} ${option}%`}
            >
              {option}%
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Card className="p-5">
        <AmountBreakdown
          lines={lines}
          total={{ label: copy.total, amount: payment, tone: payment >= 0 ? "neutral" : "negative" }}
          formula={formula}
        />
      </Card>
    </div>
  );
}

export default function AmountBreakdownDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/amount-breakdown", locale);
  const metadata = displayMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.amountBreakdown.title;
  const description = content?.description ?? metadata.amountBreakdown.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { AmountBreakdown, Card, ToggleGroup, ToggleGroupItem, type AmountLine } from "@gunjo/ui";

const certified = [
  { label: "修理費", amount: 480000 },
  { label: "レッカー費用", amount: 22000 },
  { label: "代車費用", amount: 38000 },
];

export function ClaimPaymentBreakdown() {
  const [fault, setFault] = React.useState("30");
  const certifiedTotal = certified.reduce((sum, line) => sum + line.amount, 0);
  const faultDeduction = Math.round(certifiedTotal * (Number(fault) / 100));
  const deductible = 50000;
  const paid = 100000;
  const payment = certifiedTotal - faultDeduction - deductible - paid;
  const lines: AmountLine[] = [
    { type: "heading", label: "認定損害額" },
    ...certified,
    { type: "subtotal", label: "認定損害額 計", amount: certifiedTotal },
    {
      label: "過失相殺",
      kind: "subtract",
      amount: faultDeduction,
      note: \`認定額 × 過失割合 \${fault}%\`,
    },
    { label: "免責金額", kind: "subtract", amount: deductible },
    { label: "既払金（内払）", kind: "subtract", amount: paid },
  ];

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">過失割合</span>
        <ToggleGroup
          type="single"
          value={fault}
          onValueChange={(value) => value && setFault(value)}
          variant="outline"
          size="sm"
          disallowEmpty
          aria-label="過失割合"
        >
          {["0", "20", "30", "50"].map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              aria-label={\`過失割合 \${option}%\`}
            >
              {option}%
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Card className="p-5">
        <AmountBreakdown
          lines={lines}
          total={{ label: "今回支払額", amount: payment, tone: payment >= 0 ? "neutral" : "negative" }}
          formula="今回支払額 = 認定損害額 - 過失相殺 - 免責 - 既払金"
        />
      </Card>
    </div>
  );
}`
    : `import * as React from "react";
import { AmountBreakdown, Card, ToggleGroup, ToggleGroupItem, type AmountLine } from "@gunjo/ui";

const certified = [
  { label: "Repair", amount: 480000 },
  { label: "Towing", amount: 22000 },
  { label: "Rental car", amount: 38000 },
];

export function ClaimPaymentBreakdown() {
  const [fault, setFault] = React.useState("30");
  const certifiedTotal = certified.reduce((sum, line) => sum + line.amount, 0);
  const faultDeduction = Math.round(certifiedTotal * (Number(fault) / 100));
  const deductible = 50000;
  const paid = 100000;
  const payment = certifiedTotal - faultDeduction - deductible - paid;
  const lines: AmountLine[] = [
    { type: "heading", label: "Certified loss" },
    ...certified,
    { type: "subtotal", label: "Certified loss total", amount: certifiedTotal },
    {
      label: "Fault deduction",
      kind: "subtract",
      amount: faultDeduction,
      note: \`Certified total x \${fault}% fault ratio\`,
    },
    { label: "Deductible", kind: "subtract", amount: deductible },
    { label: "Already paid", kind: "subtract", amount: paid },
  ];

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">Fault ratio</span>
        <ToggleGroup
          type="single"
          value={fault}
          onValueChange={(value) => value && setFault(value)}
          variant="outline"
          size="sm"
          disallowEmpty
          aria-label="Fault ratio"
        >
          {["0", "20", "30", "50"].map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              aria-label={\`Fault ratio \${option}%\`}
            >
              {option}%
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Card className="p-5">
        <AmountBreakdown
          lines={lines}
          total={{ label: "Payment this time", amount: payment, tone: payment >= 0 ? "neutral" : "negative" }}
          formula="Payment = certified loss - fault deduction - deductible - already paid"
        />
      </Card>
    </div>
  );
}`;

  const propsData = [
    {
      name: "lines",
      type: "AmountLine[]",
      description: locale === "ja"
        ? "内訳行です。line / subtotal / heading を順番通りに混在できます。"
        : "Breakdown rows. Mix line, subtotal, and heading rows in display order.",
    },
    {
      name: "AmountLine.kind",
      type: '"add" | "subtract"',
      default: '"add"',
      description: locale === "ja"
        ? "subtract は金額にマイナス記号を付け、控除として読み取れるトーンで表示します。"
        : "subtract renders a minus sign and deduction tone so the sign is not color-only.",
    },
    {
      name: "total",
      type: "{ label: ReactNode; amount: number; tone?: 'neutral' | 'positive' | 'negative' }",
      description: locale === "ja"
        ? "強調する導出合計です。"
        : "The emphasized derived total row.",
    },
    {
      name: "formula",
      type: "ReactNode",
      description: locale === "ja"
        ? "合計の下に表示する計算式や補足です。"
        : "Formula or explanatory caption shown under the total.",
    },
    {
      name: "formatValue",
      type: "(value: number) => string",
      default: "formatCurrency",
      description: locale === "ja"
        ? "金額の整形関数です。既定は ja-JP / JPY の formatCurrency です。"
        : "Value formatter. Defaults to the ja-JP / JPY formatCurrency helper.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" },
        { name: "Card", href: "/docs/components/card" },
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
      ]}
      relatedComponents={[
        { name: "Statistic", href: "/docs/components/statistic" },
        { name: "DataTable", href: "/docs/components/data-table" },
        { name: "SectionList", href: "/docs/components/section-list" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto">
        <AmountBreakdownPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "default",
              title: locale === "ja" ? "支払明細" : "Claim payment",
              description: locale === "ja"
                ? "行、控除、小計、導出合計を1つの読み取り専用ブロックで表示します。"
                : "Rows, deductions, subtotal, and derived total appear in one read-only block.",
              preview: <AmountBreakdownPreview locale={locale} />,
              code: usageCode,
            },
            {
              key: "no-fault",
              title: locale === "ja" ? "控除なし" : "No fault deduction",
              description: locale === "ja"
                ? "上位の入力で金額が変わる場合も、AmountBreakdown は導出済みの値を表示します。"
                : "When parent inputs change the math, AmountBreakdown displays the derived values.",
              preview: <AmountBreakdownPreview locale={locale} initialFault="0" />,
              code: locale === "ja"
                ? `<AmountBreakdown
  lines={[
    { type: "heading", label: "認定損害額" },
    { label: "修理費", amount: 480000 },
    { label: "レッカー費用", amount: 22000 },
    { label: "代車費用", amount: 38000 },
    { type: "subtotal", label: "認定損害額 計", amount: 540000 },
    { label: "過失相殺", kind: "subtract", amount: 0, note: "認定額 × 過失割合 0%" },
    { label: "免責金額", kind: "subtract", amount: 50000 },
    { label: "既払金（内払）", kind: "subtract", amount: 100000 },
  ]}
  total={{ label: "今回支払額", amount: 390000 }}
  formula="今回支払額 = 認定損害額 - 過失相殺 - 免責 - 既払金"
/>`
                : `<AmountBreakdown
  lines={[
    { type: "heading", label: "Certified loss" },
    { label: "Repair", amount: 480000 },
    { label: "Towing", amount: 22000 },
    { label: "Rental car", amount: 38000 },
    { type: "subtotal", label: "Certified loss total", amount: 540000 },
    { label: "Fault deduction", kind: "subtract", amount: 0, note: "Certified total x 0% fault ratio" },
    { label: "Deductible", kind: "subtract", amount: 50000 },
    { label: "Already paid", kind: "subtract", amount: 100000 },
  ]}
  total={{ label: "Payment this time", amount: 390000 }}
  formula="Payment = certified loss - fault deduction - deductible - already paid"
/>`,
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
