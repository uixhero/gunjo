"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  LineageGraph,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type LineageEdge,
  type LineageNode,
} from "@gunjo/ui";

type Locale = "ja" | "en";

function lineageCopy(locale: Locale) {
  return locale === "ja"
    ? {
        label: "ロット系譜",
        detailTitle: "対象ロット",
        upstream: "上流",
        downstream: "下流",
        nodes: [
          { id: "rm-01", label: "原料ロット RM-01", sublabel: "仕入 2026/06/01", tone: "info" },
          { id: "rm-02", label: "原料ロット RM-02", sublabel: "仕入 2026/06/02", tone: "info" },
          { id: "mix-01", label: "混合ロット MX-01", sublabel: "配合工程", tone: "warning" },
          { id: "pl-2405", label: "製品ロット PL-2405", sublabel: "出荷対象", tone: "primary" },
          { id: "sh-102", label: "出荷 SH-102", sublabel: "関東倉庫", tone: "destructive" },
        ] satisfies LineageNode[],
      }
    : {
        label: "Lot lineage",
        detailTitle: "Active lot",
        upstream: "Upstream",
        downstream: "Downstream",
        nodes: [
          { id: "rm-01", label: "Raw lot RM-01", sublabel: "Received 2026-06-01", tone: "info" },
          { id: "rm-02", label: "Raw lot RM-02", sublabel: "Received 2026-06-02", tone: "info" },
          { id: "mix-01", label: "Blend lot MX-01", sublabel: "Mixing step", tone: "warning" },
          { id: "pl-2405", label: "Product lot PL-2405", sublabel: "Shipment target", tone: "primary" },
          { id: "sh-102", label: "Shipment SH-102", sublabel: "Kanto warehouse", tone: "destructive" },
        ] satisfies LineageNode[],
      };
}

const lineageEdges: LineageEdge[] = [
  { from: "rm-01", to: "mix-01" },
  { from: "rm-02", to: "mix-01" },
  { from: "mix-01", to: "pl-2405" },
  { from: "pl-2405", to: "sh-102" },
];

type LineageTone = NonNullable<LineageNode["tone"]>;

const DETAIL_TONE: Record<LineageTone, { panel: string; badge: "default" | "secondary" | "destructive" | "outline" }> = {
  default: { panel: "border-border bg-background", badge: "secondary" },
  primary: { panel: "border-primary-border bg-primary-subtle/70", badge: "outline" },
  info: { panel: "border-info-border bg-info-subtle/70", badge: "outline" },
  success: { panel: "border-success-border bg-success-subtle/70", badge: "outline" },
  warning: { panel: "border-warning-border bg-warning-subtle/70", badge: "outline" },
  destructive: { panel: "border-destructive-border bg-destructive-subtle/70", badge: "destructive" },
  muted: { panel: "border-border bg-muted/60", badge: "secondary" },
};

function LineageDetail({
  copy,
  node,
  upstreamCount,
  downstreamCount,
}: {
  copy: ReturnType<typeof lineageCopy>;
  node: LineageNode;
  upstreamCount: number;
  downstreamCount: number;
}) {
  const tone = node.tone ?? "default";
  const toneStyle = DETAIL_TONE[tone];

  return (
    <div className={`grid content-start gap-3 rounded-lg border p-3 ${toneStyle.panel}`} aria-live="polite">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.detailTitle}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{node.label}</p>
        {node.sublabel ? <p className="text-xs text-muted-foreground">{node.sublabel}</p> : null}
      </div>
      <Badge variant={toneStyle.badge} className="w-fit">{tone}</Badge>
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-background/60 p-2">
          <dt className="text-muted-foreground">{copy.upstream}</dt>
          <dd className="text-sm font-semibold text-foreground">{upstreamCount}</dd>
        </div>
        <div className="rounded-md bg-background/60 p-2">
          <dt className="text-muted-foreground">{copy.downstream}</dt>
          <dd className="text-sm font-semibold text-foreground">{downstreamCount}</dd>
        </div>
      </dl>
    </div>
  );
}

function LineageGraphPreview({ locale, direction = "horizontal", custom = false }: { locale: Locale; direction?: "horizontal" | "vertical"; custom?: boolean }) {
  const copy = lineageCopy(locale);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = React.useState("pl-2405");
  const selectedNode = copy.nodes.find((node) => node.id === selectedId) ?? copy.nodes[0];
  const upstreamCount = lineageEdges.filter((edge) => edge.to === selectedNode.id).length;
  const downstreamCount = lineageEdges.filter((edge) => edge.from === selectedNode.id).length;
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

  const handleSelectNode = (node: LineageNode) => {
    setSelectedId(node.id);
    setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative grid w-full max-w-4xl gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <LineageGraph
        nodes={copy.nodes}
        edges={lineageEdges}
        direction={direction}
        label={copy.label}
        onSelectNode={handleSelectNode}
        renderNode={custom ? (node) => (
          <div className="flex h-full flex-col justify-center overflow-hidden">
            <span className="truncate text-sm font-medium text-foreground">{node.label}</span>
            <span className="mt-1">
              <Badge variant="secondary">{node.sublabel}</Badge>
            </span>
          </div>
        ) : undefined}
      />
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel={locale === "ja" ? "閉じる" : "Close"}
          className={isLargeViewport ? "grid w-[300px] max-w-[calc(100%-2rem)] p-4" : "max-h-[72%] overflow-y-auto p-4"}
        >
          <SheetHeader>
            <SheetTitle>{copy.detailTitle}</SheetTitle>
            <SheetDescription>{selectedNode.sublabel}</SheetDescription>
          </SheetHeader>
          <LineageDetail copy={copy} node={selectedNode} upstreamCount={upstreamCount} downstreamCount={downstreamCount} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function LineageGraphDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/lineage-graph", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.lineageGraph.title ?? "LineageGraph";
  const description = content?.description ?? metadata.lineageGraph.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import {
  Badge,
  LineageGraph,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type LineageEdge,
  type LineageNode,
} from "@gunjo/ui";

const nodes: LineageNode[] = [
  { id: "rm-01", label: "原料ロット RM-01", sublabel: "仕入 2026/06/01", tone: "info" },
  { id: "rm-02", label: "原料ロット RM-02", sublabel: "仕入 2026/06/02", tone: "info" },
  { id: "mix-01", label: "混合ロット MX-01", sublabel: "配合工程", tone: "warning" },
  { id: "pl-2405", label: "製品ロット PL-2405", sublabel: "出荷対象", tone: "primary" },
];

const edges: LineageEdge[] = [
  { from: "rm-01", to: "mix-01" },
  { from: "rm-02", to: "mix-01" },
  { from: "mix-01", to: "pl-2405" },
];

export function LotLineage() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = React.useState("pl-2405");
  const [open, setOpen] = React.useState(false);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const upstreamCount = edges.filter((edge) => edge.to === selectedNode.id).length;
  const downstreamCount = edges.filter((edge) => edge.from === selectedNode.id).length;

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

  return (
    <div ref={rootRef} className="relative grid w-full max-w-4xl gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <LineageGraph
        nodes={nodes}
        edges={edges}
        label="ロット系譜"
        onSelectNode={(node) => {
          setSelectedId(node.id);
          setOpen(true);
        }}
      />
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel="閉じる"
          className={isLargeViewport ? "grid w-[300px] max-w-[calc(100%-2rem)] p-4" : "max-h-[72%] overflow-y-auto p-4"}
        >
          <SheetHeader>
            <SheetTitle>対象ロット</SheetTitle>
            <SheetDescription>{selectedNode.sublabel}</SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 rounded-lg border border-primary-border bg-primary-subtle/70 p-3">
            <p className="text-sm font-semibold text-foreground">{selectedNode.label}</p>
            <Badge variant="outline" className="w-fit">{selectedNode.tone}</Badge>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-background/60 p-2">
                <dt className="text-muted-foreground">上流</dt>
                <dd className="text-sm font-semibold text-foreground">{upstreamCount}</dd>
              </div>
              <div className="rounded-md bg-background/60 p-2">
                <dt className="text-muted-foreground">下流</dt>
                <dd className="text-sm font-semibold text-foreground">{downstreamCount}</dd>
              </div>
            </dl>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
import {
  Badge,
  LineageGraph,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type LineageEdge,
  type LineageNode,
} from "@gunjo/ui";

const nodes: LineageNode[] = [
  { id: "rm-01", label: "Raw lot RM-01", sublabel: "Received 2026-06-01", tone: "info" },
  { id: "rm-02", label: "Raw lot RM-02", sublabel: "Received 2026-06-02", tone: "info" },
  { id: "mix-01", label: "Blend lot MX-01", sublabel: "Mixing step", tone: "warning" },
  { id: "pl-2405", label: "Product lot PL-2405", sublabel: "Shipment target", tone: "primary" },
];

const edges: LineageEdge[] = [
  { from: "rm-01", to: "mix-01" },
  { from: "rm-02", to: "mix-01" },
  { from: "mix-01", to: "pl-2405" },
];

export function LotLineage() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = React.useState("pl-2405");
  const [open, setOpen] = React.useState(false);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const upstreamCount = edges.filter((edge) => edge.to === selectedNode.id).length;
  const downstreamCount = edges.filter((edge) => edge.from === selectedNode.id).length;

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

  return (
    <div ref={rootRef} className="relative grid w-full max-w-4xl gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <LineageGraph
        nodes={nodes}
        edges={edges}
        label="Lot lineage"
        onSelectNode={(node) => {
          setSelectedId(node.id);
          setOpen(true);
        }}
      />
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel="Close"
          className={isLargeViewport ? "grid w-[300px] max-w-[calc(100%-2rem)] p-4" : "max-h-[72%] overflow-y-auto p-4"}
        >
          <SheetHeader>
            <SheetTitle>Active lot</SheetTitle>
            <SheetDescription>{selectedNode.sublabel}</SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 rounded-lg border border-primary-border bg-primary-subtle/70 p-3">
            <p className="text-sm font-semibold text-foreground">{selectedNode.label}</p>
            <Badge variant="outline" className="w-fit">{selectedNode.tone}</Badge>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-background/60 p-2">
                <dt className="text-muted-foreground">Upstream</dt>
                <dd className="text-sm font-semibold text-foreground">{upstreamCount}</dd>
              </div>
              <div className="rounded-md bg-background/60 p-2">
                <dt className="text-muted-foreground">Downstream</dt>
                <dd className="text-sm font-semibold text-foreground">{downstreamCount}</dd>
              </div>
            </dl>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    { name: "nodes", type: "LineageNode[]", description: locale === "ja" ? "表示するノードです。id、label、sublabel、tone、ariaLabel を渡せます。" : "Nodes to render. Pass id, label, sublabel, tone, and ariaLabel." },
    { name: "edges", type: "LineageEdge[]", description: locale === "ja" ? "from から to への有向エッジです。複数親・複数子を扱えます。" : "Directed edges from upstream to downstream. Multi-parent and multi-child are supported." },
    { name: "direction", type: '"horizontal" | "vertical"', default: '"horizontal"', description: locale === "ja" ? "左から右、または上から下の流れを選びます。" : "Flow direction: left-to-right or top-to-bottom." },
    { name: "renderNode", type: "(node: LineageNode) => ReactNode", description: locale === "ja" ? "ノード本体の描画を差し替えます。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。JSX を返すため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" : "Overrides node body rendering. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Render props return JSX (no serializable alternative) — wrap in a \"use client\" component to pass from an RSC. (#338)" },
    { name: "onSelectNode", type: "(node: LineageNode) => void", description: locale === "ja" ? "渡すとノードが選択可能なボタンになります。" : "When provided, nodes become activatable buttons." },
    { name: "nodeWidth / nodeHeight", type: "number", default: "160 / 56", description: locale === "ja" ? "ノード箱のサイズです。" : "Node box size." },
    { name: "layerGap / rowGap", type: "number", default: "64 / 16", description: locale === "ja" ? "階層間、同階層内の余白です。" : "Gap between layers and rows." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "グラフ全体のアクセシブル名です。" : "Accessible name for the graph." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "LineageGraph", href: "/docs/components/lineage-graph" }]}
      relatedComponents={[
        { name: "TreeView", href: "/docs/components/tree-view" },
        { name: "RelationshipRow", href: "/docs/components/relationship-row" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <LineageGraphPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "fan-in",
              title: locale === "ja" ? "複数親" : "Fan-in",
              description: locale === "ja" ? "複数の上流ロットが1つの工程に合流する関係を描けます。" : "Multiple upstream nodes can flow into one downstream node.",
              preview: <LineageGraphPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "xl",
            },
            {
              key: "vertical",
              title: locale === "ja" ? "縦方向" : "Vertical",
              description: locale === "ja" ? "direction=\"vertical\" で上から下へ流れる図にできます。" : "Use direction=\"vertical\" for top-to-bottom flow.",
              preview: <LineageGraphPreview locale={locale} direction="vertical" />,
              code: `<LineageGraph
  nodes={[
    { id: "rm-01", label: "${locale === "ja" ? "原料ロット RM-01" : "Raw lot RM-01"}" },
    { id: "mix-01", label: "${locale === "ja" ? "混合ロット MX-01" : "Blend lot MX-01"}" },
  ]}
  edges={[{ from: "rm-01", to: "mix-01" }]}
  direction="vertical"
/>`,
              previewBodyWidth: "xl",
            },
            {
              key: "custom-node",
              title: locale === "ja" ? "ノード描画の差し替え" : "Custom node",
              description: locale === "ja" ? "renderNode でノード内に Badge や補足情報を配置できます。" : "Use renderNode to place badges or richer metadata inside nodes.",
              preview: <LineageGraphPreview locale={locale} custom />,
              code: `<LineageGraph
  nodes={nodes}
  edges={edges}
  renderNode={(node) => (
    <div className="flex h-full flex-col justify-center">
      <span className="truncate text-sm font-medium">{node.label}</span>
      <Badge variant="secondary">{node.sublabel}</Badge>
    </div>
  )}
/>`,
              previewBodyWidth: "xl",
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
