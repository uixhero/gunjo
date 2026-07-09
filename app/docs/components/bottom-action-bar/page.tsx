"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, BottomActionBar, Button, Label, Switch } from "@gunjo/ui";

type Locale = "ja" | "en";

function bottomBarCopy(locale: Locale) {
  return locale === "ja"
    ? {
        stack: "stack（料金の下にCTAを全幅で配置）",
        title: "配車内容の確認",
        route: "乗車地：渋谷駅前 / 行き先：六本木ヒルズ",
        car: "車種：JPNタクシー・到着まで約4分",
        helper: "バーはプレビュー枠の下部に固定されています。",
        priceLabel: "見積もり料金",
        price: "¥1,200〜",
        eta: "到着 4分",
        call: "この内容で呼ぶ",
        cancel: "配車をキャンセル",
        statusPrefix: "状態",
        statusIdle: "未確定",
        statusCalled: "配車依頼中",
      }
    : {
        stack: "stack (full-width CTA below fare)",
        title: "Ride details",
        route: "Pickup: Shibuya Station / Destination: Roppongi Hills",
        car: "Car: JPN Taxi / arrives in about 4 minutes",
        helper: "The bar is pinned to the bottom of the preview frame.",
        priceLabel: "Estimated fare",
        price: "¥1,200+",
        eta: "4 min",
        call: "Request ride",
        cancel: "Cancel ride",
        statusPrefix: "Status",
        statusIdle: "Not requested",
        statusCalled: "Requesting ride",
      };
}

function BottomActionBarPreview({ locale, initialStack = false }: { locale: Locale; initialStack?: boolean }) {
  const copy = bottomBarCopy(locale);
  const [stack, setStack] = React.useState(initialStack);
  const [called, setCalled] = React.useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id={`bottom-action-bar-stack-${locale}-${initialStack ? "stack" : "row"}`} checked={stack} onCheckedChange={setStack} />
        <Label htmlFor={`bottom-action-bar-stack-${locale}-${initialStack ? "stack" : "row"}`} className="text-xs">
          {copy.stack}
        </Label>
      </div>

      <div className="relative h-72 overflow-hidden rounded-xl border bg-muted/30">
        <div className={stack ? "h-full overflow-y-auto px-4 pb-36 pt-4 text-sm text-muted-foreground" : "h-full overflow-y-auto px-4 pb-28 pt-4 text-sm text-muted-foreground"}>
          <p className="font-medium text-foreground">{copy.title}</p>
          <p className="mt-1">{copy.route}</p>
          <p className="mt-3">{copy.car}</p>
          <div className="mt-20 rounded-md border bg-background p-3 text-xs">
            {copy.statusPrefix}: {called ? copy.statusCalled : copy.statusIdle}
          </div>
        </div>

        <BottomActionBar
          className="absolute inset-x-0"
          stack={stack}
          actions={
            <Button size="lg" onClick={() => setCalled((current) => !current)}>
              {called ? copy.cancel : copy.call}
            </Button>
          }
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{copy.priceLabel}</span>
            <span className="text-base font-semibold tabular-nums text-foreground">
              {copy.price} <Badge variant="info" className="ml-1 align-middle">{copy.eta}</Badge>
            </span>
          </div>
        </BottomActionBar>
      </div>
      <p className="text-xs text-muted-foreground">{copy.helper}</p>
    </div>
  );
}

export default function BottomActionBarDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/bottom-action-bar", locale);
  const metadata = displayMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.bottomActionBar.title;
  const description = content?.description ?? metadata.bottomActionBar.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, BottomActionBar, Button, Label, Switch } from "@gunjo/ui";

export function RideBottomActionBar() {
  const [stack, setStack] = React.useState(false);
  const [called, setCalled] = React.useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="ride-stack" checked={stack} onCheckedChange={setStack} />
        <Label htmlFor="ride-stack" className="text-xs">stack（料金の下にCTAを全幅で配置）</Label>
      </div>

      <div className="relative h-72 overflow-hidden rounded-xl border bg-muted/30">
        <div className={stack ? "h-full overflow-y-auto px-4 pb-36 pt-4 text-sm text-muted-foreground" : "h-full overflow-y-auto px-4 pb-28 pt-4 text-sm text-muted-foreground"}>
          <p className="font-medium text-foreground">配車内容の確認</p>
          <p className="mt-1">乗車地：渋谷駅前 / 行き先：六本木ヒルズ</p>
          <p className="mt-3">車種：JPNタクシー・到着まで約4分</p>
          <div className="mt-20 rounded-md border bg-background p-3 text-xs">
            状態: {called ? "配車依頼中" : "未確定"}
          </div>
        </div>

        <BottomActionBar
          className="absolute inset-x-0"
          stack={stack}
          actions={
            <Button size="lg" onClick={() => setCalled((current) => !current)}>
              {called ? "配車をキャンセル" : "この内容で呼ぶ"}
            </Button>
          }
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">見積もり料金</span>
            <span className="text-base font-semibold tabular-nums text-foreground">
              ¥1,200〜 <Badge variant="info" className="ml-1 align-middle">到着 4分</Badge>
            </span>
          </div>
        </BottomActionBar>
      </div>

      <p className="text-xs text-muted-foreground">バーはプレビュー枠の下部に固定されています。</p>
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, BottomActionBar, Button, Label, Switch } from "@gunjo/ui";

export function RideBottomActionBar() {
  const [stack, setStack] = React.useState(false);
  const [called, setCalled] = React.useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="ride-stack" checked={stack} onCheckedChange={setStack} />
        <Label htmlFor="ride-stack" className="text-xs">stack (full-width CTA below fare)</Label>
      </div>

      <div className="relative h-72 overflow-hidden rounded-xl border bg-muted/30">
        <div className={stack ? "h-full overflow-y-auto px-4 pb-36 pt-4 text-sm text-muted-foreground" : "h-full overflow-y-auto px-4 pb-28 pt-4 text-sm text-muted-foreground"}>
          <p className="font-medium text-foreground">Ride details</p>
          <p className="mt-1">Pickup: Shibuya Station / Destination: Roppongi Hills</p>
          <p className="mt-3">Car: JPN Taxi / arrives in about 4 minutes</p>
          <div className="mt-20 rounded-md border bg-background p-3 text-xs">
            Status: {called ? "Requesting ride" : "Not requested"}
          </div>
        </div>

        <BottomActionBar
          className="absolute inset-x-0"
          stack={stack}
          actions={
            <Button size="lg" onClick={() => setCalled((current) => !current)}>
              {called ? "Cancel ride" : "Request ride"}
            </Button>
          }
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Estimated fare</span>
            <span className="text-base font-semibold tabular-nums text-foreground">
              ¥1,200+ <Badge variant="info" className="ml-1 align-middle">4 min</Badge>
            </span>
          </div>
        </BottomActionBar>
      </div>

      <p className="text-xs text-muted-foreground">The bar is pinned to the bottom of the preview frame.</p>
    </div>
  );
}`;

  const propsData = [
    {
      name: "children",
      type: "ReactNode",
      description: locale === "ja"
        ? "左側のサマリです。料金、件数、到着予定など残り幅を取る情報を置きます。"
        : "Left summary content such as price, count, or ETA. It takes the remaining width.",
    },
    {
      name: "actions",
      type: "ReactNode",
      description: locale === "ja"
        ? "右側または下側に置く主要CTAです。ボタン側に実際の onClick を渡します。"
        : "Primary CTA rendered on the right or below. Pass the actual onClick to the button.",
    },
    {
      name: "stack",
      type: "boolean",
      default: "false",
      description: locale === "ja"
        ? "CTA をサマリの下に全幅で積みます。"
        : "Stacks the CTA full-width below the summary.",
    },
    {
      name: "sticky",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "スクロールコンテナの下部に固定します。"
        : "Pins the bar to the bottom of its scroll container.",
    },
    {
      name: "maxWidth",
      type: '"sm" | "md" | "lg" | "xl"',
      description: locale === "ja"
        ? "広い画面で内側コンテンツを中央寄せし、幅上限を付けます。"
        : "Centers and caps the inner content width on wider surfaces.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "BottomActionBar", href: "/docs/components/bottom-action-bar" },
        { name: "Button", href: "/docs/components/button" },
        { name: "Switch", href: "/docs/components/switch" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
      relatedComponents={[
        { name: "PageHeader", href: "/docs/components/page-header" },
        { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" },
        { name: "Sheet", href: "/docs/components/sheet" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <BottomActionBarPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "row",
              title: locale === "ja" ? "横並び" : "Row layout",
              description: locale === "ja"
                ? "サマリとCTAを左右に並べる標準形です。"
                : "The default layout places summary and CTA side by side.",
              preview: <BottomActionBarPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "stack",
              title: locale === "ja" ? "CTAを下に積む" : "Stacked CTA",
              description: locale === "ja"
                ? "主要操作をより強く見せたい時は、料金サマリの下に全幅 CTA を置きます。"
                : "Use stack when the primary action should occupy the full width below the fare summary.",
              preview: <BottomActionBarPreview locale={locale} initialStack />,
              code: locale === "ja"
                ? `import { Badge, BottomActionBar, Button } from "@gunjo/ui";

export function StackedRideBottomActionBar() {
  return (
    <div className="relative h-72 overflow-hidden rounded-xl border bg-muted/30">
      <div className="h-full overflow-y-auto px-4 pb-36 pt-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">配車内容の確認</p>
        <p className="mt-1">乗車地：渋谷駅前 / 行き先：六本木ヒルズ</p>
        <p className="mt-3">車種：JPNタクシー・到着まで約4分</p>
      </div>

      <BottomActionBar
        className="absolute inset-x-0"
        stack
        actions={<Button size="lg">この内容で呼ぶ</Button>}
      >
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">見積もり料金</span>
          <span className="text-base font-semibold tabular-nums text-foreground">
            ¥1,200〜 <Badge variant="info" className="ml-1 align-middle">到着 4分</Badge>
          </span>
        </div>
      </BottomActionBar>
    </div>
  );
}`
                : `import { Badge, BottomActionBar, Button } from "@gunjo/ui";

export function StackedRideBottomActionBar() {
  return (
    <div className="relative h-72 overflow-hidden rounded-xl border bg-muted/30">
      <div className="h-full overflow-y-auto px-4 pb-36 pt-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Ride details</p>
        <p className="mt-1">Pickup: Shibuya Station / Destination: Roppongi Hills</p>
        <p className="mt-3">Car: JPN Taxi / arrives in about 4 minutes</p>
      </div>

      <BottomActionBar
        className="absolute inset-x-0"
        stack
        actions={<Button size="lg">Request ride</Button>}
      >
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Estimated fare</span>
          <span className="text-base font-semibold tabular-nums text-foreground">
            ¥1,200+ <Badge variant="info" className="ml-1 align-middle">4 min</Badge>
          </span>
        </div>
      </BottomActionBar>
    </div>
  );
}`,
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
