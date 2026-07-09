"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { CurrencyInput, formatCurrency } from "@gunjo/ui";

const propsByLocale = {
    ja: [
        { name: "label", type: "ReactNode", description: "入力欄の上に表示するラベルです。id と紐づけて読み上げにも使います。" },
        { name: "description", type: "ReactNode", description: "入力欄の下に表示する補足文です。aria-describedby に接続されます。" },
        { name: "value / defaultValue", type: "number", description: "金額の数値です。value を渡すと controlled、defaultValue では uncontrolled として動きます。" },
        { name: "onValueChange", type: "(value: number | undefined) => void", description: "入力値が数値に変換された時に呼ばれます。空欄では undefined を返します。" },
        { name: "currency", type: "string", default: "\"JPY\"", description: "通貨記号と表示に使う ISO 4217 コードです。" },
        { name: "locale", type: "string", default: "\"ja-JP\"", description: "桁区切りと通貨記号の表示に使う locale です。" },
        { name: "showSymbol", type: "boolean", default: "true", description: "先頭の通貨記号を表示するかを指定します。" },
        { name: "min / max", type: "number", description: "入力できる金額の下限と上限です。入力中に範囲内へ丸めます。" },
        { name: "disabled", type: "boolean", description: "金額入力を無効化します。docs では理由を Tooltip で説明します。" },
    ],
    en: [
        { name: "label", type: "ReactNode", description: "Visible label rendered above the control and associated with the input id." },
        { name: "description", type: "ReactNode", description: "Helper text shown below the control and wired through aria-describedby." },
        { name: "value / defaultValue", type: "number", description: "Amount as a number. Pass value for controlled usage or defaultValue for uncontrolled usage." },
        { name: "onValueChange", type: "(value: number | undefined) => void", description: "Called with the parsed number, or undefined when the field is cleared." },
        { name: "currency", type: "string", default: "\"JPY\"", description: "ISO 4217 currency code used for the symbol and formatting." },
        { name: "locale", type: "string", default: "\"ja-JP\"", description: "Locale used for grouping and currency symbol display." },
        { name: "showSymbol", type: "boolean", default: "true", description: "Whether to show the leading currency symbol." },
        { name: "min / max", type: "number", description: "Minimum and maximum amount. Values are clamped while typing." },
        { name: "disabled", type: "boolean", description: "Disables amount entry. In docs examples, the reason is explained with a Tooltip." },
    ],
} as const;

function CurrencyInputPreview({
    locale,
    variant = "default",
}: {
    locale: "ja" | "en";
    variant?: "default" | "usd" | "no-symbol" | "disabled";
}) {
    const [amount, setAmount] = React.useState<number | undefined>(variant === "usd" ? 1280 : 1200000);
    const isJa = locale === "ja";
    const currency = variant === "usd" ? "USD" : "JPY";
    const inputLocale = variant === "usd" ? "en-US" : isJa ? "ja-JP" : "en-US";
    const disabledReason = isJa
        ? "請求金額が確定済みのため変更できません。"
        : "The invoice amount is final and cannot be changed.";
    const formatted = amount !== undefined
        ? formatCurrency(amount, { currency, locale: inputLocale })
        : isJa ? "未入力" : "Empty";

    const input = (
        <CurrencyInput
            id={`currency-${variant}`}
            label={variant === "usd" ? (isJa ? "海外請求額" : "International invoice") : (isJa ? "請求金額" : "Invoice amount")}
            description={
                variant === "no-symbol"
                    ? (isJa ? "表では記号を列見出しに置くため、入力欄では非表示にします。" : "Hide the symbol when a table column already provides the currency context.")
                    : (isJa ? "入力値は数値として保持し、表示時だけ通貨表記にします。" : "The field stores a number and formats it only for display.")
            }
            value={amount}
            onValueChange={setAmount}
            min={0}
            max={variant === "usd" ? 5000 : 5000000}
            currency={currency}
            locale={inputLocale}
            showSymbol={variant !== "no-symbol"}
            disabled={variant === "disabled"}
        />
    );

    return (
        <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg border bg-card p-4">
            {variant === "disabled" ? (
                <DisabledReasonTooltip fullWidth reason={disabledReason}>
                    {input}
                </DisabledReasonTooltip>
            ) : input}
            <div className="rounded-md border bg-background px-3 py-2 text-sm">
                <p className="text-xs font-medium text-muted-foreground">
                    {isJa ? "保存される値" : "Stored value"}
                </p>
                <p className="font-mono text-foreground">{amount ?? "undefined"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {isJa ? "表示: " : "Display: "}{formatted}
                </p>
            </div>
        </div>
    );
}

export default function CurrencyInputDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/currency-input", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const isJa = locale === "ja";
    const description = content?.description ?? metadata.currencyInput.description;
    const usageCode = isJa
        ? `import * as React from "react";
import { CurrencyInput, formatCurrency } from "@gunjo/ui";

export function InvoiceAmountField() {
  const [amount, setAmount] = React.useState<number | undefined>(1200000);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <CurrencyInput
        id="invoice-amount"
        label="請求金額"
        description="入力値は数値として保持し、表示時だけ通貨表記にします。"
        value={amount}
        onValueChange={setAmount}
        min={0}
        max={5000000}
        currency="JPY"
        locale="ja-JP"
      />
      <p className="text-sm text-muted-foreground">
        表示: {amount !== undefined ? formatCurrency(amount) : "未入力"}
      </p>
    </div>
  );
}`
        : `import * as React from "react";
import { CurrencyInput, formatCurrency } from "@gunjo/ui";

export function InvoiceAmountField() {
  const [amount, setAmount] = React.useState<number | undefined>(1200000);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <CurrencyInput
        id="invoice-amount"
        label="Invoice amount"
        description="The field stores a number and formats it only for display."
        value={amount}
        onValueChange={setAmount}
        min={0}
        max={5000000}
        currency="JPY"
        locale="en-US"
      />
      <p className="text-sm text-muted-foreground">
        Display: {amount !== undefined ? formatCurrency(amount, { locale: "en-US" }) : "Empty"}
      </p>
    </div>
  );
}`;

    return (
        <ComponentLayout
            title={content?.title ?? metadata.currencyInput.title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "CurrencyInput", href: "/docs/components/currency-input" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "NumberInput", href: "/docs/components/number-input" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="sm"
                previewHeight="auto"
            >
                <CurrencyInputPreview locale={locale} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: isJa ? "標準" : "Default",
                            description: isJa
                                ? "JPY の金額を数値として保持し、入力中は桁区切りを維持します。"
                                : "Store a JPY amount as a number while keeping grouped digits while typing.",
                            preview: <CurrencyInputPreview locale={locale} />,
                            code: usageCode,
                        },
                        {
                            key: "usd",
                            title: isJa ? "通貨違い" : "Different currency",
                            description: isJa
                                ? "currency と locale を組み合わせて、海外請求額の記号と桁区切りを変えます。"
                                : "Combine currency and locale to change the symbol and grouping for international invoices.",
                            preview: <CurrencyInputPreview locale={locale} variant="usd" />,
                            code: isJa
                                ? `<CurrencyInput
  label="海外請求額"
  value={amount}
  onValueChange={setAmount}
  currency="USD"
  locale="en-US"
  min={0}
  max={5000}
/>`
                                : `<CurrencyInput
  label="International invoice"
  value={amount}
  onValueChange={setAmount}
  currency="USD"
  locale="en-US"
  min={0}
  max={5000}
/>`,
                        },
                        {
                            key: "no-symbol",
                            title: isJa ? "記号なし" : "Without symbol",
                            description: isJa
                                ? "表や一覧で通貨単位が別に示されている場合は showSymbol=false にできます。"
                                : "Use showSymbol=false when a table or list already shows the currency unit.",
                            preview: <CurrencyInputPreview locale={locale} variant="no-symbol" />,
                            code: isJa
                                ? `<CurrencyInput
  label="請求金額"
  value={amount}
  onValueChange={setAmount}
  showSymbol={false}
/>`
                                : `<CurrencyInput
  label="Invoice amount"
  value={amount}
  onValueChange={setAmount}
  showSymbol={false}
/>`,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "無効化" : "Disabled",
                            description: isJa
                                ? "確定済み金額は無効化し、操作対象の上で理由を説明します。"
                                : "Disable finalized amounts and explain the reason on the disabled target.",
                            preview: <CurrencyInputPreview locale={locale} variant="disabled" />,
                            code: isJa
                                ? `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CurrencyInput } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="請求金額が確定済みのため変更できません。">
  <CurrencyInput label="請求金額" value={1200000} disabled />
</DisabledReasonTooltip>`
                                : `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CurrencyInput } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="The invoice amount is final and cannot be changed.">
  <CurrencyInput label="Invoice amount" value={1200000} disabled />
</DisabledReasonTooltip>`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[420px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
