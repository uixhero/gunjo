"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { SegmentedControl, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

function SegmentedControlPreview({ locale }: { locale: "ja" | "en" }) {
  const [passenger, setPassenger] = React.useState("adult");
  const [payment, setPayment] = React.useState("ic");

  const passengerOptions = locale === "ja"
    ? [
        { value: "adult", label: "大人" },
        { value: "child", label: "小児" },
        { value: "discount", label: "割引" },
      ]
    : [
        { value: "adult", label: "Adult" },
        { value: "child", label: "Child" },
        { value: "discount", label: "Discount" },
      ];

  const paymentOptions = locale === "ja"
    ? [
        { value: "cash", label: "現金" },
        { value: "ic", label: "IC" },
        { value: "qr", label: "QR" },
      ]
    : [
        { value: "cash", label: "Cash" },
        { value: "ic", label: "IC" },
        { value: "qr", label: "QR" },
      ];

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">
          {locale === "ja" ? "旅客区分" : "Passenger type"}
        </span>
        <SegmentedControl
          aria-label={locale === "ja" ? "旅客区分" : "Passenger type"}
          value={passenger}
          onValueChange={setPassenger}
          options={passengerOptions}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">
          {locale === "ja" ? "支払い方法" : "Payment method"}
        </span>
        <SegmentedControl
          aria-label={locale === "ja" ? "支払い方法" : "Payment method"}
          value={payment}
          onValueChange={setPayment}
          options={paymentOptions}
        />
      </label>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {locale === "ja"
          ? `選択中: 旅客=${passenger} / 支払い=${payment}`
          : `Selected: passenger=${passenger} / payment=${payment}`}
      </p>
    </div>
  );
}

function DisabledSegmentedControl({ locale }: { locale: "ja" | "en" }) {
  const reason = locale === "ja"
    ? "公開済みの料金設定のため、この画面では変更できません。"
    : "Published fare settings cannot be changed from this screen.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex w-full cursor-not-allowed">
          <SegmentedControl
            aria-label={locale === "ja" ? "旅客区分" : "Passenger type"}
            value="adult"
            disabled
            options={
              locale === "ja"
                ? [
                    { value: "adult", label: "大人" },
                    { value: "child", label: "小児" },
                  ]
                : [
                    { value: "adult", label: "Adult" },
                    { value: "child", label: "Child" },
                  ]
            }
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}

export default function SegmentedControlDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/segmented-control", locale);
  const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.segmentedControl.title;
  const description = content?.description ?? metadata.segmentedControl.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { SegmentedControl } from "@gunjo/ui";

export function SegmentedControlExample() {
  const [passenger, setPassenger] = React.useState("adult");
  const [payment, setPayment] = React.useState("ic");

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">旅客区分</span>
        <SegmentedControl
          aria-label="旅客区分"
          value={passenger}
          onValueChange={setPassenger}
          options={[
            { value: "adult", label: "大人" },
            { value: "child", label: "小児" },
            { value: "discount", label: "割引" },
          ]}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">支払い方法</span>
        <SegmentedControl
          aria-label="支払い方法"
          value={payment}
          onValueChange={setPayment}
          options={[
            { value: "cash", label: "現金" },
            { value: "ic", label: "IC" },
            { value: "qr", label: "QR" },
          ]}
        />
      </label>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        選択中: 旅客={passenger} / 支払い={payment}
      </p>
    </div>
  );
}`
    : `import * as React from "react";
import { SegmentedControl } from "@gunjo/ui";

export function SegmentedControlExample() {
  const [passenger, setPassenger] = React.useState("adult");
  const [payment, setPayment] = React.useState("ic");

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Passenger type</span>
        <SegmentedControl
          aria-label="Passenger type"
          value={passenger}
          onValueChange={setPassenger}
          options={[
            { value: "adult", label: "Adult" },
            { value: "child", label: "Child" },
            { value: "discount", label: "Discount" },
          ]}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Payment method</span>
        <SegmentedControl
          aria-label="Payment method"
          value={payment}
          onValueChange={setPayment}
          options={[
            { value: "cash", label: "Cash" },
            { value: "ic", label: "IC" },
            { value: "qr", label: "QR" },
          ]}
        />
      </label>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        Selected: passenger={passenger} / payment={payment}
      </p>
    </div>
  );
}`;

  const propsData = [
    {
      name: "options",
      type: "SegmentedControlOption[]",
      description: locale === "ja"
        ? "表示するセグメントです。2〜4件程度の短い選択肢に向いています。"
        : "Segments to render. Best for two to four short choices.",
    },
    {
      name: "value / defaultValue",
      type: "string",
      description: locale === "ja"
        ? "制御状態または非制御の初期値です。選択値は常に単一の string です。"
        : "Controlled value or uncontrolled initial value. The selected value is always one string.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: locale === "ja"
        ? "選択が変わった時に呼ばれます。"
        : "Called when the selected segment changes.",
    },
    {
      name: "size",
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      description: locale === "ja"
        ? "セグメントの高さと余白です。タッチ操作を重視する場合は lg を使います。"
        : "Segment height and padding. Use lg when touch comfort matters.",
    },
    {
      name: "fullWidth",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "各セグメントを等幅で横幅いっぱいに広げます。"
        : "Makes segments equal width and fills the available row.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: locale === "ja"
        ? "全体を無効化します。理由が必要な場合はツールチップで補足します。"
        : "Disables the whole control. Explain the reason with a tooltip when needed.",
    },
    {
      name: "aria-label",
      type: "string",
      description: locale === "ja"
        ? "radiogroup のアクセシブル名です。"
        : "Accessible name for the radiogroup.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "SegmentedControl", href: "/docs/components/segmented-control" },
      ]}
      relatedComponents={[
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
        { name: "RadioCard", href: "/docs/components/radio-card" },
        { name: "Select", href: "/docs/components/select" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto">
        <SegmentedControlPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "default",
              title: locale === "ja" ? "標準" : "Default",
              description: locale === "ja"
                ? "等幅セグメントで、短い選択肢から1つを選びます。"
                : "Equal-width segments let users choose one option from a short set.",
              preview: <SegmentedControlPreview locale={locale} />,
              code: usageCode,
            },
            {
              key: "compact",
              title: locale === "ja" ? "コンパクト" : "Compact",
              description: locale === "ja"
                ? "ツールバーや狭い領域では sm と fullWidth={false} を使います。"
                : "Use sm with fullWidth={false} in compact toolbars or narrow spaces.",
              preview: (
                <SegmentedControl
                  aria-label={locale === "ja" ? "表示密度" : "Density"}
                  size="sm"
                  fullWidth={false}
                  defaultValue="regular"
                  options={
                    locale === "ja"
                      ? [
                          { value: "compact", label: "狭い" },
                          { value: "regular", label: "標準" },
                          { value: "wide", label: "広い" },
                        ]
                      : [
                          { value: "compact", label: "Compact" },
                          { value: "regular", label: "Regular" },
                          { value: "wide", label: "Wide" },
                        ]
                  }
                />
              ),
              code: locale === "ja"
                ? `<SegmentedControl
  aria-label="表示密度"
  size="sm"
  fullWidth={false}
  defaultValue="regular"
  options={[
    { value: "compact", label: "狭い" },
    { value: "regular", label: "標準" },
    { value: "wide", label: "広い" },
  ]}
/>`
                : `<SegmentedControl
  aria-label="Density"
  size="sm"
  fullWidth={false}
  defaultValue="regular"
  options={[
    { value: "compact", label: "Compact" },
    { value: "regular", label: "Regular" },
    { value: "wide", label: "Wide" },
  ]}
/>`,
            },
            {
              key: "large",
              title: locale === "ja" ? "タッチ向け" : "Touch size",
              description: locale === "ja"
                ? "モバイルやタッチ前提の入力では lg で操作面を広げます。"
                : "Use lg to increase the hit area for touch-first controls.",
              preview: (
                <SegmentedControl
                  aria-label={locale === "ja" ? "期間" : "Period"}
                  size="lg"
                  defaultValue="week"
                  options={
                    locale === "ja"
                      ? [
                          { value: "day", label: "日" },
                          { value: "week", label: "週" },
                          { value: "month", label: "月" },
                        ]
                      : [
                          { value: "day", label: "Day" },
                          { value: "week", label: "Week" },
                          { value: "month", label: "Month" },
                        ]
                  }
                />
              ),
              code: locale === "ja"
                ? `<SegmentedControl
  aria-label="期間"
  size="lg"
  defaultValue="week"
  options={[
    { value: "day", label: "日" },
    { value: "week", label: "週" },
    { value: "month", label: "月" },
  ]}
/>`
                : `<SegmentedControl
  aria-label="Period"
  size="lg"
  defaultValue="week"
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]}
/>`,
            },
            {
              key: "disabled",
              title: locale === "ja" ? "無効化" : "Disabled",
              description: locale === "ja"
                ? "変更できない理由を、無効なコントロールを包むツールチップで説明します。"
                : "Explain why the control is unavailable with a tooltip around the disabled control.",
              preview: <DisabledSegmentedControl locale={locale} />,
              code: `<Tooltip>
  <TooltipTrigger asChild>
    <span className="inline-flex cursor-not-allowed">
      <SegmentedControl
        aria-label="${locale === "ja" ? "旅客区分" : "Passenger type"}"
        disabled
        value="adult"
        options={[
          { value: "adult", label: "${locale === "ja" ? "大人" : "Adult"}" },
          { value: "child", label: "${locale === "ja" ? "小児" : "Child"}" },
        ]}
      />
    </span>
  </TooltipTrigger>
  <TooltipContent>${locale === "ja" ? "公開済みの料金設定のため、この画面では変更できません。" : "Published fare settings cannot be changed from this screen."}</TooltipContent>
</Tooltip>`,
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
