"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { Badge, CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

type Locale = "ja" | "en";

function addons(locale: Locale) {
  return locale === "ja"
    ? [
        { value: "insurance", title: "旅行保険", description: "ケガ・キャンセルを補償", price: "¥500", tag: <Badge variant="info">人気</Badge> },
        { value: "seat", title: "座席指定", description: "窓側・通路側を選択", price: "¥300" },
        { value: "meal", title: "機内食", description: "和食 / 洋食から選択", price: "¥1,200", highlight: "予約で¥200おトク" },
        { value: "lounge", title: "ラウンジ利用", description: "出発ラウンジ 1回", price: "¥2,000", disabled: true, disabledReason: "このプランでは追加できません。" },
      ]
    : [
        { value: "insurance", title: "Travel insurance", description: "Injury & cancellation cover", price: "$5", tag: <Badge variant="info">Popular</Badge> },
        { value: "seat", title: "Seat selection", description: "Choose window or aisle", price: "$3" },
        { value: "meal", title: "In-flight meal", description: "Japanese or Western", price: "$12", highlight: "$2 off when pre-ordered" },
        { value: "lounge", title: "Lounge access", description: "One departure lounge visit", price: "$20", disabled: true, disabledReason: "Not available on this plan." },
      ];
}

function CheckboxCardPreview({ locale }: { locale: Locale }) {
  const [selected, setSelected] = React.useState<string[]>(["insurance"]);
  return (
    <div className="w-full max-w-md">
      <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label={locale === "ja" ? "追加オプション" : "Add-ons"}>
        {addons(locale).map((a) => (
          <CheckboxCard
            key={a.value}
            value={a.value}
            title={a.title}
            description={a.description}
            price={a.price}
            highlight={a.highlight}
            tags={a.tag}
            disabled={a.disabled}
            disabledReason={a.disabledReason}
          />
        ))}
      </CheckboxCardGroup>
    </div>
  );
}

const usageCode = `import * as React from "react";
import { Badge, CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

const addons = [
  { value: "insurance", title: "Travel insurance", description: "Injury & cancellation cover", price: "$5" },
  { value: "seat", title: "Seat selection", description: "Choose window or aisle", price: "$3" },
  { value: "meal", title: "In-flight meal", description: "Japanese or Western", price: "$12" },
];

export function AddonPicker() {
  const [selected, setSelected] = React.useState<string[]>(["insurance"]);
  return (
    <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label="Add-ons">
      {addons.map((a) => (
        <CheckboxCard key={a.value} value={a.value} title={a.title} description={a.description} price={a.price} />
      ))}
    </CheckboxCardGroup>
  );
}`;

export default function CheckboxCardDocPage() {
  const meta = displayMetadata as Record<string, { title?: string; description?: string }>;
  const { locale, sectionLabels } = useLocale();

  const propsData =
    locale === "ja"
      ? [
          { name: "CheckboxCardGroup value / defaultValue", type: "string[]", description: "選択中の値の集合。制御(value)・非制御(defaultValue)どちらも可。" },
          { name: "CheckboxCardGroup onValueChange", type: "(value: string[]) => void", description: "選択が変わるたびに新しい配列で呼ばれます。" },
          { name: "CheckboxCardGroup name", type: "string", description: "各カードが hidden checkbox を出力し、フォーム送信に載せます。" },
          { name: "value", type: "string", description: "このカードが選択にトグルする値です。" },
          { name: "title", type: "ReactNode", description: "主行（オプション名）。" },
          { name: "description", type: "ReactNode", description: "副行（条件・期間など）。" },
          { name: "tags / price / highlight / leading", type: "ReactNode", description: "チップ列・価格・おトク訴求・先頭アクセサリ（RadioCard と同じ body スロット）。" },
          { name: "disabled / disabledReason", type: "boolean / ReactNode", description: "選択不可＋理由をツールチップで説明します。" },
        ]
      : [
          { name: "CheckboxCardGroup value / defaultValue", type: "string[]", description: "Selected values. Controlled (value) or uncontrolled (defaultValue)." },
          { name: "CheckboxCardGroup onValueChange", type: "(value: string[]) => void", description: "Called with the new array whenever the selection changes." },
          { name: "CheckboxCardGroup name", type: "string", description: "Each card emits a hidden checkbox so the selection posts with a form." },
          { name: "value", type: "string", description: "The value this card toggles in the selection." },
          { name: "title", type: "ReactNode", description: "Primary line (option name)." },
          { name: "description", type: "ReactNode", description: "Secondary line (conditions, period)." },
          { name: "tags / price / highlight / leading", type: "ReactNode", description: "Chip row, price, savings hook, leading accessory (same body slots as RadioCard)." },
          { name: "disabled / disabledReason", type: "boolean / ReactNode", description: "Disables selection and explains why with a tooltip." },
        ];

  return (
    <ComponentLayout
      title={meta.checkboxCard?.title ?? "CheckboxCard"}
      description={meta.checkboxCard?.description ?? ""}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "CheckboxCard", href: "/docs/components/checkbox-card" }, { name: "CheckboxCardGroup", href: "/docs/components/checkbox-card" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "RadioCard", href: "/docs/components/radio-card" }, { name: "Checkbox", href: "/docs/components/checkbox" }, { name: "ListCard", href: "/docs/components/list-card" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <CheckboxCardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "multi",
              title: locale === "ja" ? "複数選択" : "Multi-select",
              description: locale === "ja" ? "RadioCard と違い、複数を同時に選べます。選択はスクエアのチェックで示します。" : "Unlike RadioCard, several can be selected at once; the selection is marked by a square check.",
              preview: <CheckboxCardPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
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
