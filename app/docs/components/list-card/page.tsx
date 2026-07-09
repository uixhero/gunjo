"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, LineChip, ListCard, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@gunjo/ui";

type Locale = "ja" | "en";
type ListCardSelection = "incident" | "route-1";

function ListCardDetail({
  locale,
  selection,
}: {
  locale: Locale;
  selection: ListCardSelection;
}) {
  const routeLabel = locale === "ja" ? "10:42 → 11:14" : "10:42 to 11:14";
  const incidentLabel = locale === "ja" ? "中央線快速" : "Chuo rapid line";
  const details = {
    incident: {
      title: incidentLabel,
      status: locale === "ja" ? "運転見合わせ" : "Suspended",
      summary: locale === "ja" ? "人身事故の影響で上下線の運転を見合わせています。" : "Service is suspended in both directions due to an incident.",
      primary: locale === "ja" ? "振替輸送" : "Transfer",
      secondary: locale === "ja" ? "東京メトロ・都営線で実施中" : "Available on Tokyo Metro and Toei lines",
      badgeVariant: "destructive" as const,
    },
    "route-1": {
      title: routeLabel,
      status: locale === "ja" ? "推奨経路" : "Recommended",
      summary: locale === "ja" ? "乗換なしで到着する最速・最安の経路です。" : "Fastest and lowest-fare route with no transfers.",
      primary: locale === "ja" ? "所要時間" : "Duration",
      secondary: locale === "ja" ? "32分・34.1km・580円" : "32 min / 34.1 km / JPY 580",
      badgeVariant: "secondary" as const,
    },
  };
  const detail = details[selection];

  return (
    <div className="grid content-start gap-3 rounded-lg border bg-card p-3">
      <p className="text-sm font-semibold text-foreground">{detail.title}</p>
      <Badge variant={detail.badgeVariant} className="w-fit">{detail.status}</Badge>
      <p className="text-sm leading-6 text-muted-foreground">{detail.summary}</p>
      <div className="rounded-md bg-muted/50 p-2">
        <p className="text-xs text-muted-foreground">{detail.primary}</p>
        <p className="text-sm font-medium text-foreground">{detail.secondary}</p>
      </div>
    </div>
  );
}

function ListCardPreview({ locale, readonly = false }: { locale: Locale; readonly?: boolean }) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = React.useState<ListCardSelection | null>(null);
  const [open, setOpen] = React.useState(false);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);
  const routeLabel = locale === "ja" ? "10:42 → 11:14" : "10:42 to 11:14";
  const incidentLabel = locale === "ja" ? "中央線快速" : "Chuo rapid line";

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLargeViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const select = (id: ListCardSelection) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative grid w-full max-w-2xl gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <div className="grid content-start gap-3">
        <ListCard
          leading={<LineChip label="JC" color="#f15a24" />}
          title={incidentLabel}
          description={locale === "ja" ? "人身事故の影響" : "Service suspended due to an incident"}
          status={<Badge variant="destructive">{locale === "ja" ? "運転見合わせ" : "Suspended"}</Badge>}
          meta={locale === "ja" ? "7:42 更新" : "Updated 7:42"}
          severity="critical"
          selected={selectedId === "incident"}
          onSelect={readonly ? undefined : () => select("incident")}
        />
        <ListCard
          title={routeLabel}
          description={locale === "ja" ? "32分・乗換0回・34.1km" : "32 min / 0 transfers / 34.1 km"}
          tags={<><Badge variant="secondary">{locale === "ja" ? "最速" : "Fastest"}</Badge><Badge variant="secondary">{locale === "ja" ? "最安" : "Lowest fare"}</Badge></>}
          meta="¥580"
          selected={selectedId === "route-1"}
          onSelect={readonly ? undefined : () => select("route-1")}
        />
      </div>
      <Sheet open={open && selectedId != null} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel={locale === "ja" ? "閉じる" : "Close"}
          className={isLargeViewport ? "grid w-[300px] max-w-[calc(100%-2rem)] p-4" : "max-h-[72%] overflow-y-auto p-4"}
        >
          <SheetHeader>
            <SheetTitle>{locale === "ja" ? "詳細" : "Details"}</SheetTitle>
            <SheetDescription>{selectedId === "incident" ? incidentLabel : routeLabel}</SheetDescription>
          </SheetHeader>
          {selectedId ? <ListCardDetail locale={locale} selection={selectedId} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ListCardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/list-card", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.listCard.title ?? "ListCard";
  const description = content?.description ?? metadata.listCard.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, LineChip, ListCard, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@gunjo/ui";

export function RouteResults() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = React.useState<"incident" | "route-1" | null>(null);
  const [open, setOpen] = React.useState(false);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLargeViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const detail = selectedId === "incident"
    ? { title: "中央線快速", status: "運転見合わせ", summary: "人身事故の影響で上下線の運転を見合わせています。", variant: "destructive" as const }
    : { title: "10:42 → 11:14", status: "推奨経路", summary: "乗換なしで到着する最速・最安の経路です。", variant: "secondary" as const };

  const select = (id: "incident" | "route-1") => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative grid w-full max-w-2xl gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <div className="grid content-start gap-3">
        <ListCard
          leading={<LineChip label="JC" color="#f15a24" />}
          title="中央線快速"
          description="人身事故の影響"
          status={<Badge variant="destructive">運転見合わせ</Badge>}
          meta="7:42 更新"
          severity="critical"
          selected={selectedId === "incident"}
          onSelect={() => select("incident")}
        />
        <ListCard
          title="10:42 → 11:14"
          description="32分・乗換0回・34.1km"
          tags={<><Badge variant="secondary">最速</Badge><Badge variant="secondary">最安</Badge></>}
          meta="¥580"
          selected={selectedId === "route-1"}
          onSelect={() => select("route-1")}
        />
      </div>
      <Sheet open={open && selectedId != null} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel="閉じる"
          className={isLargeViewport ? "grid w-[300px] max-w-[calc(100%-2rem)] p-4" : "max-h-[72%] overflow-y-auto p-4"}
        >
          <SheetHeader>
            <SheetTitle>詳細</SheetTitle>
            <SheetDescription>{detail.title}</SheetDescription>
          </SheetHeader>
          <div className="grid content-start gap-3 rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold text-foreground">{detail.title}</p>
            <Badge variant={detail.variant} className="w-fit">{detail.status}</Badge>
            <p className="text-sm leading-6 text-muted-foreground">{detail.summary}</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, LineChip, ListCard, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@gunjo/ui";

export function RouteResults() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = React.useState<"incident" | "route-1" | null>(null);
  const [open, setOpen] = React.useState(false);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLargeViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const detail = selectedId === "incident"
    ? { title: "Chuo rapid line", status: "Suspended", summary: "Service is suspended in both directions due to an incident.", variant: "destructive" as const }
    : { title: "10:42 to 11:14", status: "Recommended", summary: "Fastest and lowest-fare route with no transfers.", variant: "secondary" as const };

  const select = (id: "incident" | "route-1") => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative grid w-full max-w-2xl gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <div className="grid content-start gap-3">
        <ListCard
          leading={<LineChip label="JC" color="#f15a24" />}
          title="Chuo rapid line"
          description="Service suspended due to an incident"
          status={<Badge variant="destructive">Suspended</Badge>}
          meta="Updated 7:42"
          severity="critical"
          selected={selectedId === "incident"}
          onSelect={() => select("incident")}
        />
        <ListCard
          title="10:42 to 11:14"
          description="32 min / 0 transfers / 34.1 km"
          tags={<><Badge variant="secondary">Fastest</Badge><Badge variant="secondary">Lowest fare</Badge></>}
          meta="¥580"
          selected={selectedId === "route-1"}
          onSelect={() => select("route-1")}
        />
      </div>
      <Sheet open={open && selectedId != null} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel="Close"
          className={isLargeViewport ? "grid w-[300px] max-w-[calc(100%-2rem)] p-4" : "max-h-[72%] overflow-y-auto p-4"}
        >
          <SheetHeader>
            <SheetTitle>Details</SheetTitle>
            <SheetDescription>{detail.title}</SheetDescription>
          </SheetHeader>
          <div className="grid content-start gap-3 rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold text-foreground">{detail.title}</p>
            <Badge variant={detail.variant} className="w-fit">{detail.status}</Badge>
            <p className="text-sm leading-6 text-muted-foreground">{detail.summary}</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    { name: "title", type: "ReactNode", description: locale === "ja" ? "主要行です。" : "Primary line." },
    { name: "leading", type: "ReactNode", description: locale === "ja" ? "先頭アクセサリです。アイコン、アバター、路線チップなどを置きます。" : "Leading accessory such as icon, avatar, or line chip." },
    { name: "description", type: "ReactNode", description: locale === "ja" ? "タイトル下の副次行です。" : "Secondary text under the title." },
    { name: "tags", type: "ReactNode", description: locale === "ja" ? "タイトル下に折り返すチップ列です。" : "Wrapping tag row under the title." },
    { name: "status", type: "ReactNode", description: locale === "ja" ? "右側の状態 Badge です。色だけに依存しない文言を含めます。" : "Right-side status badge. Include text, not color alone." },
    { name: "meta", type: "ReactNode", description: locale === "ja" ? "右側の補足値です。" : "Right-side secondary value." },
    { name: "trailing", type: "ReactNode", description: locale === "ja" ? "末尾アクセサリです。onSelect 時は既定で chevron です。" : "Trailing accessory. Defaults to a chevron when onSelect is set." },
    { name: "severity", type: '"critical" | "warning" | "info" | "success" | "neutral"', description: locale === "ja" ? "左アクセントレールのトーンです。" : "Tone for the left accent rail." },
    { name: "selected", type: "boolean", description: locale === "ja" ? "選択中の見た目です。" : "Selected visual state." },
    { name: "onSelect", type: "() => void", description: locale === "ja" ? "渡すとカード全体が44px以上のボタンになります。" : "Makes the entire card a tappable button of at least 44px." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "LineChip", href: "/docs/components/line-chip" },
      ]}
      relatedComponents={[
        { name: "ActionQueue", href: "/docs/components/action-queue" },
        { name: "StatGroup", href: "/docs/components/stat-group" },
        { name: "DocumentRow", href: "/docs/components/document-row" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <ListCardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "selectable",
              title: locale === "ja" ? "選択可能" : "Selectable",
              description: locale === "ja" ? "onSelect を渡すとカード全体がボタンになります。" : "Pass onSelect to make the whole card a button.",
              preview: <ListCardPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "presentational",
              title: locale === "ja" ? "表示専用" : "Presentational",
              description: locale === "ja" ? "onSelect を省略すると button ではなく表示用 div になります。" : "Omit onSelect to render a presentational div instead of a button.",
              preview: <ListCardPreview locale={locale} readonly />,
              code: `<ListCard
  title="${locale === "ja" ? "中央線快速" : "Chuo rapid line"}"
  description="${locale === "ja" ? "人身事故の影響" : "Service suspended due to an incident"}"
  status={<Badge variant="destructive">${locale === "ja" ? "運転見合わせ" : "Suspended"}</Badge>}
  severity="critical"
/>`,
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
