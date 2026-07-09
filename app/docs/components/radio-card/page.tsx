"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconTrain } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import { Badge, RadioCard, RadioCardGroup } from "@gunjo/ui";

type Locale = "ja" | "en";

function products(locale: Locale) {
  return locale === "ja"
    ? [
        { value: "toku", title: "都区内パス", description: "JR東京都区内 1日乗り放題", price: "¥760", highlight: "3回乗ればモト", tag: <Badge variant="info">人気</Badge> },
        { value: "holiday", title: "休日おでかけパス", description: "首都圏フリーエリア・土休日限定", price: "¥2,720", highlight: "約1,000円分おトク", tag: <Badge variant="success">観光向け</Badge> },
        { value: "metro24", title: "東京メトロ 24時間券", description: "東京メトロ全線 24時間", price: "¥600", highlight: "4回乗ればモト" },
      ]
    : [
        { value: "city", title: "Tokyo city pass", description: "Unlimited JR rides inside central Tokyo", price: "$5", highlight: "Pays off after 3 rides", tag: <Badge variant="info">Popular</Badge> },
        { value: "holiday", title: "Holiday outing pass", description: "Greater Tokyo free area / weekends only", price: "$18", highlight: "About $7 in savings", tag: <Badge variant="success">Sightseeing</Badge> },
        { value: "metro24", title: "Tokyo Metro 24-hour ticket", description: "All Tokyo Metro lines for 24 hours", price: "$4", highlight: "Pays off after 4 rides" },
      ];
}

function RadioCardPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "disabled" | "leading" }) {
  const [value, setValue] = React.useState("holiday");
  const copy = locale === "ja"
    ? {
        label: "おトクなきっぷ",
        disabledReason: "販売期間外のため、このきっぷは選択できません。",
        disabledTitle: "箱根フリーパス（2日間）",
        disabledDescription: "小田急＋箱根の乗り物乗り放題",
        limited: "販売期間外",
      }
    : {
        label: "Discount tickets",
        disabledReason: "This ticket is outside the sales window.",
        disabledTitle: "Hakone free pass (2 days)",
        disabledDescription: "Odakyu and Hakone transport rides",
        limited: "Unavailable",
      };
  const options = products(locale);

  if (mode === "disabled") {
    return (
      <div className="w-full max-w-md space-y-3">
        <RadioCardGroup defaultValue="holiday" aria-label={copy.label}>
          <RadioCard
            value="holiday"
            title={options[1].title}
            description={options[1].description}
            tags={options[1].tag}
            price={options[1].price}
            highlight={options[1].highlight}
          />
          <RadioCard
            value="hakone"
            title={copy.disabledTitle}
            description={copy.disabledDescription}
            tags={<Badge variant="warning">{copy.limited}</Badge>}
            price={locale === "ja" ? "¥6,100" : "$40"}
            disabled
            disabledReason={copy.disabledReason}
            disabledReasonLabel={copy.disabledReason}
          />
        </RadioCardGroup>
      </div>
    );
  }

  if (mode === "leading") {
    return (
      <div className="w-full max-w-md">
        <RadioCardGroup defaultValue="metro24" aria-label={copy.label}>
          <RadioCard
            value="metro24"
            title={options[2].title}
            description={options[2].description}
            price={options[2].price}
            highlight={options[2].highlight}
            leading={<IconTrain className="size-5 text-muted-foreground" />}
          />
        </RadioCardGroup>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <RadioCardGroup value={value} onValueChange={setValue} aria-label={copy.label} name="ticket">
        {options.map((option) => (
          <RadioCard
            key={option.value}
            value={option.value}
            title={option.title}
            description={option.description}
            tags={option.tag}
            price={option.price}
            highlight={option.highlight}
          />
        ))}
      </RadioCardGroup>
    </div>
  );
}

export default function RadioCardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/radio-card", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.radioCard.title ?? "RadioCard";
  const description = content?.description ?? metadata.radioCard.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, RadioCard, RadioCardGroup } from "@gunjo/ui";

const tickets = [
  { value: "toku", title: "都区内パス", description: "JR東京都区内 1日乗り放題", price: "¥760", highlight: "3回乗ればモト", tag: <Badge variant="info">人気</Badge> },
  { value: "holiday", title: "休日おでかけパス", description: "首都圏フリーエリア・土休日限定", price: "¥2,720", highlight: "約1,000円分おトク", tag: <Badge variant="success">観光向け</Badge> },
  { value: "metro24", title: "東京メトロ 24時間券", description: "東京メトロ全線 24時間", price: "¥600", highlight: "4回乗ればモト" },
];

export function TicketChoice() {
  const [value, setValue] = React.useState("holiday");

  return (
    <div className="w-full max-w-md">
      <RadioCardGroup value={value} onValueChange={setValue} aria-label="おトクなきっぷ" name="ticket">
        {tickets.map((ticket) => (
          <RadioCard
            key={ticket.value}
            value={ticket.value}
            title={ticket.title}
            description={ticket.description}
            tags={ticket.tag}
            price={ticket.price}
            highlight={ticket.highlight}
          />
        ))}
      </RadioCardGroup>
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, RadioCard, RadioCardGroup } from "@gunjo/ui";

const tickets = [
  { value: "city", title: "Tokyo city pass", description: "Unlimited JR rides inside central Tokyo", price: "$5", highlight: "Pays off after 3 rides", tag: <Badge variant="info">Popular</Badge> },
  { value: "holiday", title: "Holiday outing pass", description: "Greater Tokyo free area / weekends only", price: "$18", highlight: "About $7 in savings", tag: <Badge variant="success">Sightseeing</Badge> },
  { value: "metro24", title: "Tokyo Metro 24-hour ticket", description: "All Tokyo Metro lines for 24 hours", price: "$4", highlight: "Pays off after 4 rides" },
];

export function TicketChoice() {
  const [value, setValue] = React.useState("holiday");

  return (
    <div className="w-full max-w-md">
      <RadioCardGroup value={value} onValueChange={setValue} aria-label="Discount tickets" name="ticket">
        {tickets.map((ticket) => (
          <RadioCard
            key={ticket.value}
            value={ticket.value}
            title={ticket.title}
            description={ticket.description}
            tags={ticket.tag}
            price={ticket.price}
            highlight={ticket.highlight}
          />
        ))}
      </RadioCardGroup>
    </div>
  );
}`;

  const disabledStateCode = locale === "ja"
    ? `import { Badge, RadioCard, RadioCardGroup } from "@gunjo/ui";

export function TicketWithDisabledOption() {
  return (
    <div className="w-full max-w-md space-y-3">
      <RadioCardGroup defaultValue="holiday" aria-label="おトクなきっぷ">
        <RadioCard
          value="holiday"
          title="休日おでかけパス"
          description="首都圏フリーエリア・土休日限定"
          tags={<Badge variant="success">観光向け</Badge>}
          price="¥2,720"
          highlight="約1,000円分おトク"
        />
        <RadioCard
          value="hakone"
          title="箱根フリーパス（2日間）"
          description="小田急＋箱根の乗り物乗り放題"
          tags={<Badge variant="warning">販売期間外</Badge>}
          price="¥6,100"
          disabled
          disabledReason="販売期間外のため、このきっぷは選択できません。"
          disabledReasonLabel="販売期間外のため、このきっぷは選択できません。"
        />
      </RadioCardGroup>
    </div>
  );
}`
    : `import { Badge, RadioCard, RadioCardGroup } from "@gunjo/ui";

export function TicketWithDisabledOption() {
  return (
    <div className="w-full max-w-md space-y-3">
      <RadioCardGroup defaultValue="holiday" aria-label="Discount tickets">
        <RadioCard
          value="holiday"
          title="Holiday outing pass"
          description="Greater Tokyo free area / weekends only"
          tags={<Badge variant="success">Sightseeing</Badge>}
          price="$18"
          highlight="About $7 in savings"
        />
        <RadioCard
          value="hakone"
          title="Hakone free pass (2 days)"
          description="Odakyu and Hakone transport rides"
          tags={<Badge variant="warning">Unavailable</Badge>}
          price="$40"
          disabled
          disabledReason="This ticket is outside the sales window."
          disabledReasonLabel="This ticket is outside the sales window."
        />
      </RadioCardGroup>
    </div>
  );
}`;

  const leadingStateCode = locale === "ja"
    ? `import { RadioCard, RadioCardGroup } from "@gunjo/ui";
import { IconTrain } from "@tabler/icons-react";

export function MetroTicketCard() {
  return (
    <div className="w-full max-w-md">
      <RadioCardGroup defaultValue="metro24" aria-label="おトクなきっぷ">
        <RadioCard
          value="metro24"
          title="東京メトロ 24時間券"
          description="東京メトロ全線 24時間"
          price="¥600"
          highlight="4回乗ればモト"
          leading={<IconTrain className="size-5 text-muted-foreground" />}
        />
      </RadioCardGroup>
    </div>
  );
}`
    : `import { RadioCard, RadioCardGroup } from "@gunjo/ui";
import { IconTrain } from "@tabler/icons-react";

export function MetroTicketCard() {
  return (
    <div className="w-full max-w-md">
      <RadioCardGroup defaultValue="metro24" aria-label="Discount tickets">
        <RadioCard
          value="metro24"
          title="Tokyo Metro 24-hour ticket"
          description="All Tokyo Metro lines for 24 hours"
          price="$4"
          highlight="Pays off after 4 rides"
          leading={<IconTrain className="size-5 text-muted-foreground" />}
        />
      </RadioCardGroup>
    </div>
  );
}`;

  const propsData = [
    { name: "RadioCardGroup.value / defaultValue", type: "string", description: locale === "ja" ? "制御/非制御の選択値です。" : "Controlled or uncontrolled selected value." },
    { name: "RadioCardGroup.onValueChange", type: "(value: string) => void", description: locale === "ja" ? "選択変更時に呼ばれます。" : "Called when selection changes." },
    { name: "RadioCardGroup.name", type: "string", description: locale === "ja" ? "フォーム送信用の name です。各カードが hidden radio input を出します。" : "Form field name emitted through hidden radio inputs." },
    { name: "RadioCard.value", type: "string", description: locale === "ja" ? "このカードが選択する値です。" : "Value selected by this card." },
    { name: "title / description", type: "ReactNode", description: locale === "ja" ? "選択肢の主行と副行です。" : "Primary and secondary option copy." },
    { name: "tags", type: "ReactNode", description: locale === "ja" ? "人気、期間限定などのチップ列です。" : "Tag row for popular, limited, or recommended markers." },
    { name: "price", type: "ReactNode", description: locale === "ja" ? "右寄せで強調する価格です。" : "Right-aligned emphasized price slot." },
    { name: "highlight", type: "ReactNode", description: locale === "ja" ? "おトクや条件の補足行です。" : "Savings or hook line under the body." },
    { name: "leading", type: "ReactNode", description: locale === "ja" ? "先頭アイコンやサムネイルです。" : "Optional leading icon or thumbnail." },
    { name: "disabledReason", type: "ReactNode", description: locale === "ja" ? "disabled 時に hover/focus で表示する理由です。" : "Reason tooltip shown on hover/focus when disabled." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "RadioCard", href: "/docs/components/radio-card" }, { name: "RadioCardGroup", href: "/docs/components/radio-card" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "RadioGroup", href: "/docs/components/radio-group" }, { name: "ListCard", href: "/docs/components/list-card" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <RadioCardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "selected",
              title: locale === "ja" ? "選択中" : "Selected",
              description: locale === "ja" ? "選択状態は ring とチェックで示し、色だけに依存しません。" : "Selected state is shown with a ring and check, not color alone.",
              preview: <RadioCardPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "disabled",
              title: locale === "ja" ? "無効化理由" : "Disabled reason",
              description: locale === "ja" ? "選べない選択肢は disabledReason で理由を必ず説明します。" : "Unavailable options explain why through disabledReason.",
              preview: <RadioCardPreview locale={locale} mode="disabled" />,
              code: disabledStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "leading",
              title: locale === "ja" ? "先頭アクセサリ" : "Leading accessory",
              description: locale === "ja" ? "交通手段やプラン種別を示すアイコンを先頭に置けます。" : "A leading icon can communicate mode or plan type.",
              preview: <RadioCardPreview locale={locale} mode="leading" />,
              code: leadingStateCode,
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
