"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
  CodeCopyButton,
  ComponentLayout,
  ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Stringline, type StringlineRun, type StringlineStop } from "@gunjo/ui";

type Locale = "ja" | "en";

type RunDetail = {
  direction: string;
  planned: string;
  actual: string;
  delay: string;
  platform: string;
  crew: string;
};

function stops(locale: Locale): StringlineStop[] {
  return locale === "ja"
    ? [
        { id: "sjk", label: "新宿", distance: 0 },
        { id: "mtk", label: "三鷹", distance: 14.3 },
        { id: "ttc", label: "立川", distance: 27.2 },
        { id: "hco", label: "八王子", distance: 37.1 },
      ]
    : [
        { id: "sjk", label: "Shinjuku", distance: 0 },
        { id: "mtk", label: "Mitaka", distance: 14.3 },
        { id: "ttc", label: "Tachikawa", distance: 27.2 },
        { id: "hco", label: "Hachioji", distance: 37.1 },
      ];
}

function runs(locale: Locale, onSelect?: (id: string, label: string) => void): StringlineRun[] {
  return [
    {
      id: "712T",
      label: "712T",
      direction: "down",
      tone: "primary",
      points: [
        { stopId: "sjk", time: 432 },
        { stopId: "mtk", time: 451 },
        { stopId: "ttc", time: 469 },
        { stopId: "hco", time: 486 },
      ],
      actual: [
        { stopId: "sjk", time: 432 },
        { stopId: "mtk", time: 455 },
        { stopId: "ttc", time: 477 },
        { stopId: "hco", time: 494 },
      ],
      onSelect: () => onSelect?.("712T", locale === "ja" ? "712T 下り" : "712T outbound"),
    },
    {
      id: "809M",
      label: "809M",
      direction: "up",
      tone: "info",
      points: [
        { stopId: "hco", time: 438 },
        { stopId: "ttc", time: 456 },
        { stopId: "mtk", time: 474 },
        { stopId: "sjk", time: 494 },
      ],
      onSelect: () => onSelect?.("809M", locale === "ja" ? "809M 上り" : "809M inbound"),
    },
    {
      id: "615A",
      label: "615A",
      direction: "down",
      tone: "warning",
      points: [
        { stopId: "sjk", time: 450 },
        { stopId: "mtk", time: 466 },
        { stopId: "ttc", time: 490 },
        { stopId: "hco", time: 510 },
      ],
      onSelect: () => onSelect?.("615A", locale === "ja" ? "615A 下り" : "615A outbound"),
    },
  ];
}

function runDetails(locale: Locale): Record<string, RunDetail> {
  return locale === "ja"
    ? {
        "712T": { direction: "下り", planned: "新宿 7:12 → 八王子 8:06", actual: "新宿 7:12 → 八王子 8:14", delay: "+8分", platform: "新宿 12番線", crew: "中央線運行指令" },
        "809M": { direction: "上り", planned: "八王子 7:18 → 新宿 8:14", actual: "計画通り", delay: "定時", platform: "八王子 3番線", crew: "中央線運行指令" },
        "615A": { direction: "下り", planned: "新宿 7:30 → 八王子 8:30", actual: "立川で調整中", delay: "+12分見込み", platform: "新宿 10番線", crew: "運転整理担当" },
      }
    : {
        "712T": { direction: "Outbound", planned: "Shinjuku 7:12 -> Hachioji 8:06", actual: "Shinjuku 7:12 -> Hachioji 8:14", delay: "+8 min", platform: "Shinjuku platform 12", crew: "Chuo Line control" },
        "809M": { direction: "Inbound", planned: "Hachioji 7:18 -> Shinjuku 8:14", actual: "On schedule", delay: "On time", platform: "Hachioji platform 3", crew: "Chuo Line control" },
        "615A": { direction: "Outbound", planned: "Shinjuku 7:30 -> Hachioji 8:30", actual: "Holding at Tachikawa", delay: "+12 min est.", platform: "Shinjuku platform 10", crew: "Traffic adjustment desk" },
      };
}

function StringlinePreview({ locale, mode = "actual" }: { locale: Locale; mode?: "actual" | "selected" | "compact" }) {
  const [selected, setSelected] = React.useState<string | number>("712T");

  React.useEffect(() => {
    setSelected("712T");
  }, [locale, mode]);

  const selectRun = (id: string) => setSelected(id);

  const visibleRuns = mode === "compact" ? runs(locale, selectRun).slice(0, 2) : runs(locale, selectRun);
  const visibleStops = mode === "compact" ? stops(locale).slice(0, 3) : stops(locale);
  const selectedRun = visibleRuns.find((run) => run.id === selected) ?? visibleRuns[0];
  const detail = runDetails(locale)[String(selectedRun.id)];

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-lg border bg-card p-4">
      <Stringline
        stops={visibleStops}
        runs={visibleRuns}
        startTime={420}
        endTime={520}
        now={462}
        tickInterval={20}
        height={300}
        selectedRunId={selected}
        ariaLabel={locale === "ja" ? "中央線の運行図表" : "Chuo Line time-distance diagram"}
        runLabel={locale === "ja" ? "運行" : "Run"}
        directionLabels={locale === "ja" ? undefined : { up: "inbound", down: "outbound" }}
      />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label={locale === "ja" ? "選択中運行の詳細" : "Selected run details"}>
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedRun.label}</h3>
            <Badge variant={selectedRun.tone === "warning" ? "outline" : "secondary"}>{detail.direction}</Badge>
            <Badge variant={detail.delay.includes("+") ? "destructive" : "secondary"}>{detail.delay}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.platform}</p>
          <p className="text-sm text-foreground">{detail.actual}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "計画" : "Planned"}</dt>
            <dd className="font-medium text-foreground">{detail.planned}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "運行担当" : "Control"}</dt>
            <dd className="font-medium text-foreground">{detail.crew}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default function StringlineDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/stringline", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.stringline.title ?? "Stringline";
  const description = content?.description ?? metadata.stringline.description ?? "";

  const usageCode =
    locale === "ja"
      ? `import * as React from "react";
import { Badge, Stringline, type StringlineRun, type StringlineStop } from "@gunjo/ui";

const stops: StringlineStop[] = [
  { id: "sjk", label: "新宿", distance: 0 },
  { id: "mtk", label: "三鷹", distance: 14.3 },
  { id: "ttc", label: "立川", distance: 27.2 },
  { id: "hco", label: "八王子", distance: 37.1 },
];
const runs: StringlineRun[] = [
  {
    id: "712T",
    label: "712T",
    direction: "down",
    tone: "primary",
    points: [{ stopId: "sjk", time: 432 }, { stopId: "mtk", time: 451 }, { stopId: "ttc", time: 469 }, { stopId: "hco", time: 486 }],
    actual: [{ stopId: "sjk", time: 432 }, { stopId: "mtk", time: 455 }, { stopId: "ttc", time: 477 }, { stopId: "hco", time: 494 }],
  },
  {
    id: "809M",
    label: "809M",
    direction: "up",
    tone: "info",
    points: [{ stopId: "hco", time: 438 }, { stopId: "ttc", time: 456 }, { stopId: "mtk", time: 474 }, { stopId: "sjk", time: 494 }],
  },
  {
    id: "615A",
    label: "615A",
    direction: "down",
    tone: "warning",
    points: [{ stopId: "sjk", time: 450 }, { stopId: "mtk", time: 466 }, { stopId: "ttc", time: 490 }, { stopId: "hco", time: 510 }],
  },
];

const details = {
  "712T": { direction: "下り", planned: "新宿 7:12 → 八王子 8:06", actual: "新宿 7:12 → 八王子 8:14", delay: "+8分", platform: "新宿 12番線", crew: "中央線運行指令" },
  "809M": { direction: "上り", planned: "八王子 7:18 → 新宿 8:14", actual: "計画通り", delay: "定時", platform: "八王子 3番線", crew: "中央線運行指令" },
  "615A": { direction: "下り", planned: "新宿 7:30 → 八王子 8:30", actual: "立川で調整中", delay: "+12分見込み", platform: "新宿 10番線", crew: "運転整理担当" },
};

export function TrainDiagram() {
  const [selectedRunId, setSelectedRunId] = React.useState("712T");
  const selectableRuns = runs.map((run) => ({ ...run, onSelect: () => setSelectedRunId(String(run.id)) }));
  const selectedRun = selectableRuns.find((run) => run.id === selectedRunId)!;
  const detail = details[selectedRunId as keyof typeof details];

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-lg border bg-card p-4">
      <Stringline stops={stops} runs={selectableRuns} startTime={420} endTime={520} now={462} tickInterval={20} height={300} selectedRunId={selectedRunId} ariaLabel="中央線の運行図表" />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label="選択中運行の詳細">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedRun.label}</h3>
            <Badge variant="secondary">{detail.direction}</Badge>
            <Badge variant={detail.delay.includes("+") ? "destructive" : "secondary"}>{detail.delay}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.platform}</p>
          <p className="text-sm text-foreground">{detail.actual}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div><dt className="text-muted-foreground">計画</dt><dd className="font-medium text-foreground">{detail.planned}</dd></div>
          <div><dt className="text-muted-foreground">運行担当</dt><dd className="font-medium text-foreground">{detail.crew}</dd></div>
        </dl>
      </section>
    </div>
  );
}`
      : `import * as React from "react";
import { Badge, Stringline, type StringlineRun, type StringlineStop } from "@gunjo/ui";

const stops: StringlineStop[] = [
  { id: "sjk", label: "Shinjuku", distance: 0 },
  { id: "mtk", label: "Mitaka", distance: 14.3 },
  { id: "ttc", label: "Tachikawa", distance: 27.2 },
  { id: "hco", label: "Hachioji", distance: 37.1 },
];
const runs: StringlineRun[] = [
  {
    id: "712T",
    label: "712T",
    direction: "down",
    tone: "primary",
    points: [{ stopId: "sjk", time: 432 }, { stopId: "mtk", time: 451 }, { stopId: "ttc", time: 469 }, { stopId: "hco", time: 486 }],
    actual: [{ stopId: "sjk", time: 432 }, { stopId: "mtk", time: 455 }, { stopId: "ttc", time: 477 }, { stopId: "hco", time: 494 }],
  },
  {
    id: "809M",
    label: "809M",
    direction: "up",
    tone: "info",
    points: [{ stopId: "hco", time: 438 }, { stopId: "ttc", time: 456 }, { stopId: "mtk", time: 474 }, { stopId: "sjk", time: 494 }],
  },
  {
    id: "615A",
    label: "615A",
    direction: "down",
    tone: "warning",
    points: [{ stopId: "sjk", time: 450 }, { stopId: "mtk", time: 466 }, { stopId: "ttc", time: 490 }, { stopId: "hco", time: 510 }],
  },
];

const details = {
  "712T": { direction: "Outbound", planned: "Shinjuku 7:12 -> Hachioji 8:06", actual: "Shinjuku 7:12 -> Hachioji 8:14", delay: "+8 min", platform: "Shinjuku platform 12", crew: "Chuo Line control" },
  "809M": { direction: "Inbound", planned: "Hachioji 7:18 -> Shinjuku 8:14", actual: "On schedule", delay: "On time", platform: "Hachioji platform 3", crew: "Chuo Line control" },
  "615A": { direction: "Outbound", planned: "Shinjuku 7:30 -> Hachioji 8:30", actual: "Holding at Tachikawa", delay: "+12 min est.", platform: "Shinjuku platform 10", crew: "Traffic adjustment desk" },
};

export function TrainDiagram() {
  const [selectedRunId, setSelectedRunId] = React.useState("712T");
  const selectableRuns = runs.map((run) => ({ ...run, onSelect: () => setSelectedRunId(String(run.id)) }));
  const selectedRun = selectableRuns.find((run) => run.id === selectedRunId)!;
  const detail = details[selectedRunId as keyof typeof details];

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-lg border bg-card p-4">
      <Stringline stops={stops} runs={selectableRuns} startTime={420} endTime={520} now={462} tickInterval={20} height={300} selectedRunId={selectedRunId} ariaLabel="Chuo Line time-distance diagram" runLabel="Run" directionLabels={{ up: "inbound", down: "outbound" }} />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label="Selected run details">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedRun.label}</h3>
            <Badge variant="secondary">{detail.direction}</Badge>
            <Badge variant={detail.delay.includes("+") ? "destructive" : "secondary"}>{detail.delay}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.platform}</p>
          <p className="text-sm text-foreground">{detail.actual}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div><dt className="text-muted-foreground">Planned</dt><dd className="font-medium text-foreground">{detail.planned}</dd></div>
          <div><dt className="text-muted-foreground">Control</dt><dd className="font-medium text-foreground">{detail.crew}</dd></div>
        </dl>
      </section>
    </div>
  );
}`;

  const propsData = [
    { name: "stops", type: "StringlineStop[]", description: locale === "ja" ? "距離軸の停車地点です。distance が縦位置を決めます。" : "Route stops on the distance axis. distance drives vertical position." },
    { name: "runs", type: "StringlineRun[]", description: locale === "ja" ? "時刻と停車地点を結ぶ運行線です。" : "Run lines connecting stop samples over time." },
    { name: "startTime / endTime", type: "number", description: locale === "ja" ? "時間軸の範囲です。既定単位は0時からの分です。" : "Time-axis range, usually minutes from midnight." },
    { name: "actual", type: "StringlineRunPoint[]", description: locale === "ja" ? "実績点です。計画は破線、実績は実線で重ねます。" : "Actual samples. Planned line becomes dashed and actual is drawn solid." },
    { name: "now", type: "number", description: locale === "ja" ? "現在時刻の縦線です。SSR安全のため値を渡します。" : "Current-time line. Pass a value for SSR-safe rendering." },
    { name: "runLabel / directionLabels", type: "string / object", description: locale === "ja" ? "選択可能な運行の読み上げ文言をローカライズします。" : "Localizes focusable run hit-target labels." },
    { name: "selectedRunId", type: "string | number", description: locale === "ja" ? "1本の運行を強調し、他を淡色化します。" : "Highlights one run and dims the rest." },
    { name: "height", type: "number", default: "320", description: locale === "ja" ? "プロット高さです。" : "Plot height in pixels." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "Stringline", href: "/docs/components/stringline" }]}
      relatedComponents={[{ name: "Gantt", href: "/docs/components/gantt" }, { name: "RouteStops", href: "/docs/components/route-stops" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <StringlinePreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "actual", title: locale === "ja" ? "計画と実績" : "Planned and actual", description: locale === "ja" ? "actual を渡すと計画線を破線、実績を実線で重ねます。" : "Passing actual draws planned as dashed and actual as solid.", preview: <StringlinePreview locale={locale} />, code: usageCode, previewBodyWidth: "xl" },
            { key: "selected", title: locale === "ja" ? "選択中の運行" : "Selected run", description: locale === "ja" ? "selectedRunId で1本を強調し、他を淡色化します。" : "selectedRunId highlights one run and dims the others.", preview: <StringlinePreview locale={locale} mode="selected" />, code: usageCode, previewBodyWidth: "xl" },
            { key: "compact", title: locale === "ja" ? "短い区間" : "Short segment", description: locale === "ja" ? "停車地点や運行本数を絞ったプレビューにも使えます。" : "Use fewer stops and runs for compact route segments.", preview: <StringlinePreview locale={locale} mode="compact" />, code: usageCode, previewBodyWidth: "xl" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
