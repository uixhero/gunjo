"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Card, CardContent, OriginDestination } from "@gunjo/ui";

type Locale = "ja" | "en";

function OriginDestinationPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "via" | "inline" }) {
  const initialFrom = locale === "ja" ? { label: "東京", sub: "新幹線" } : { label: "Tokyo", sub: "Shinkansen" };
  const initialTo = locale === "ja" ? { label: "新大阪", sub: "新幹線" } : { label: "Shin-Osaka", sub: "Shinkansen" };
  const [from, setFrom] = React.useState(initialFrom);
  const [to, setTo] = React.useState(initialTo);
  const copy = locale === "ja"
    ? {
        connector: "のぞみ最速 2:27",
        swap: "出発駅と到着駅を入れ替える",
        viaFrom: { label: "羽田", sub: "HND" },
        viaTo: { label: "那覇", sub: "OKA" },
        via: { label: "福岡" },
        list: "列車一覧",
        trains: [
          { name: "のぞみ 501号", dep: "06:00", arr: "08:27", dur: "2時間27分" },
          { name: "ひかり 633号", dep: "06:33", arr: "09:30", dur: "2時間57分" },
        ],
        dep: "発",
        arr: "着",
      }
    : {
        connector: "Nozomi fastest 2:27",
        swap: "Swap origin and destination",
        viaFrom: { label: "Haneda", sub: "HND" },
        viaTo: { label: "Naha", sub: "OKA" },
        via: { label: "Fukuoka" },
        list: "Train options",
        trains: [
          { name: "Nozomi 501", dep: "06:00", arr: "08:27", dur: "2h 27m" },
          { name: "Hikari 633", dep: "06:33", arr: "09:30", dur: "2h 57m" },
        ],
        dep: "dep",
        arr: "arr",
      };

  React.useEffect(() => {
    setFrom(locale === "ja" ? { label: "東京", sub: "新幹線" } : { label: "Tokyo", sub: "Shinkansen" });
    setTo(locale === "ja" ? { label: "新大阪", sub: "新幹線" } : { label: "Shin-Osaka", sub: "Shinkansen" });
  }, [locale]);

  if (mode === "via") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="py-4">
          <OriginDestination from={copy.viaFrom} to={copy.viaTo} via={[copy.via]} label={`${copy.viaFrom.label} to ${copy.viaTo.label}`} />
        </CardContent>
      </Card>
    );
  }

  if (mode === "inline") {
    return (
      <div className="flex w-full max-w-lg flex-col gap-2 rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-foreground">{copy.list}</p>
        {copy.trains.map((train) => (
          <div key={train.name} className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
            <span className="text-sm font-medium text-foreground">{train.name}</span>
            <span className="flex items-center gap-3">
              <OriginDestination inline from={{ label: train.dep, sub: copy.dep }} to={{ label: train.arr, sub: copy.arr }} />
              <span className="text-xs tabular-nums text-muted-foreground">{train.dur}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Card>
        <CardContent className="py-4">
          <OriginDestination
            from={from}
            to={to}
            connector={copy.connector}
            onSwap={() => {
              setFrom(to);
              setTo(from);
            }}
            swapLabel={copy.swap}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function OriginDestinationDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/origin-destination", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.originDestination.title ?? "OriginDestination";
  const description = content?.description ?? metadata.originDestination.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Card, CardContent, OriginDestination } from "@gunjo/ui";

export function RouteHeader() {
  const [from, setFrom] = React.useState({ label: "東京", sub: "新幹線" });
  const [to, setTo] = React.useState({ label: "新大阪", sub: "新幹線" });

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Card>
        <CardContent className="py-4">
          <OriginDestination
            from={from}
            to={to}
            connector="のぞみ最速 2:27"
            swapLabel="出発駅と到着駅を入れ替える"
            onSwap={() => {
              setFrom(to);
              setTo(from);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}`
    : `import * as React from "react";
import { Card, CardContent, OriginDestination } from "@gunjo/ui";

export function RouteHeader() {
  const [from, setFrom] = React.useState({ label: "Tokyo", sub: "Shinkansen" });
  const [to, setTo] = React.useState({ label: "Shin-Osaka", sub: "Shinkansen" });

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Card>
        <CardContent className="py-4">
          <OriginDestination
            from={from}
            to={to}
            connector="Nozomi fastest 2:27"
            swapLabel="Swap origin and destination"
            onSwap={() => {
              setFrom(to);
              setTo(from);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

  const viaStateCode = locale === "ja"
    ? `import { Card, CardContent, OriginDestination } from "@gunjo/ui";

export function FlightRouteWithVia() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="py-4">
        <OriginDestination
          from={{ label: "羽田", sub: "HND" }}
          to={{ label: "那覇", sub: "OKA" }}
          via={[{ label: "福岡" }]}
          label="羽田 to 那覇"
        />
      </CardContent>
    </Card>
  );
}`
    : `import { Card, CardContent, OriginDestination } from "@gunjo/ui";

export function FlightRouteWithVia() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="py-4">
        <OriginDestination
          from={{ label: "Haneda", sub: "HND" }}
          to={{ label: "Naha", sub: "OKA" }}
          via={[{ label: "Fukuoka" }]}
          label="Haneda to Naha"
        />
      </CardContent>
    </Card>
  );
}`;

  const inlineStateCode = locale === "ja"
    ? `import { OriginDestination } from "@gunjo/ui";

const trains = [
  { name: "のぞみ 501号", dep: "06:00", arr: "08:27", dur: "2時間27分" },
  { name: "ひかり 633号", dep: "06:33", arr: "09:30", dur: "2時間57分" },
];

export function TrainOptionRows() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2 rounded-lg border bg-card p-4">
      <p className="text-sm font-medium text-foreground">列車一覧</p>
      {trains.map((train) => (
        <div key={train.name} className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
          <span className="text-sm font-medium text-foreground">{train.name}</span>
          <span className="flex items-center gap-3">
            <OriginDestination inline from={{ label: train.dep, sub: "発" }} to={{ label: train.arr, sub: "着" }} />
            <span className="text-xs tabular-nums text-muted-foreground">{train.dur}</span>
          </span>
        </div>
      ))}
    </div>
  );
}`
    : `import { OriginDestination } from "@gunjo/ui";

const trains = [
  { name: "Nozomi 501", dep: "06:00", arr: "08:27", dur: "2h 27m" },
  { name: "Hikari 633", dep: "06:33", arr: "09:30", dur: "2h 57m" },
];

export function TrainOptionRows() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2 rounded-lg border bg-card p-4">
      <p className="text-sm font-medium text-foreground">Train options</p>
      {trains.map((train) => (
        <div key={train.name} className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
          <span className="text-sm font-medium text-foreground">{train.name}</span>
          <span className="flex items-center gap-3">
            <OriginDestination inline from={{ label: train.dep, sub: "dep" }} to={{ label: train.arr, sub: "arr" }} />
            <span className="text-xs tabular-nums text-muted-foreground">{train.dur}</span>
          </span>
        </div>
      ))}
    </div>
  );
}`;

  const propsData = [
    { name: "from / to", type: "{ label: ReactNode; sub?: ReactNode }", description: locale === "ja" ? "出発地と到着地です。label が主表示、sub がコードや時刻です。" : "Origin and destination endpoints. label is primary, sub is secondary metadata." },
    { name: "via", type: "OriginDestinationEndpoint[]", description: locale === "ja" ? "経由地です。指定時は入れ替えボタンを出さず、横並びの経由表示になります。" : "Intermediate stops. When present, the swap button is suppressed and via labels are rendered inline." },
    { name: "connector", type: "ReactNode", description: locale === "ja" ? "矢印の下に置く所要時間や便種別です。" : "Duration or mode copy rendered with the connector." },
    { name: "onSwap", type: "() => void", description: locale === "ja" ? "出発地と到着地を入れ替える操作です。via がない時だけ表示します。" : "Swap action shown only when there are no via stops." },
    { name: "swapLabel", type: "string", default: '"出発駅と到着駅を入れ替える"', description: locale === "ja" ? "入れ替えボタンの aria-label と tooltip 文言です。" : "ARIA label and tooltip copy for the swap button." },
    { name: "inline", type: "boolean", default: "false", description: locale === "ja" ? "検索結果行向けの小さな1行表示にします。" : "Renders the compact single-line result-row variant." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "group のアクセシブル名です。省略時は from/to の文字列から作ります。" : "Accessible group name. Defaults from string endpoint labels." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "OriginDestination", href: "/docs/components/origin-destination" }, { name: "Card", href: "/docs/components/card" }]}
      relatedComponents={[{ name: "RouteStops", href: "/docs/components/route-stops" }, { name: "Itinerary", href: "/docs/components/itinerary" }, { name: "LineChip", href: "/docs/components/line-chip" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <OriginDestinationPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "swap",
              title: locale === "ja" ? "入れ替え可能" : "Swappable",
              description: locale === "ja" ? "via がない経路検索ヘッダーでは、入れ替えボタンを tooltip 付きで表示します。" : "When there are no via stops, the route header can expose a tooltip-backed swap button.",
              preview: <OriginDestinationPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "via",
              title: locale === "ja" ? "経由あり" : "With via stop",
              description: locale === "ja" ? "経由地を含む場合は、入れ替えではなく A→経由→B の読み取り表示にします。" : "With via stops, the component reads as A to via to B instead of a swappable pair.",
              preview: <OriginDestinationPreview locale={locale} mode="via" />,
              code: viaStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "inline",
              title: locale === "ja" ? "検索結果行" : "Result-row inline",
              description: locale === "ja" ? "inline は時刻や短い地点名を一覧行の中で表示します。" : "inline keeps times or short endpoint names compact inside result rows.",
              preview: <OriginDestinationPreview locale={locale} mode="inline" />,
              code: inlineStateCode,
              previewBodyWidth: "lg",
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
