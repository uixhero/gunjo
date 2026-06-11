"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { FloatingPanel, SpatialCanvas } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const codeByLocale = {
    en: `import { FloatingPanel, SpatialCanvas } from "@gunjo/ui";

export function CanvasWorkspace() {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={40}>
        <FloatingPanel title="Tools" className="absolute left-4 top-4 w-48">
          <div className="p-3 text-sm text-muted-foreground">Select, draw, and inspect.</div>
        </FloatingPanel>
        <FloatingPanel title="Properties" className="absolute bottom-4 right-4 w-56">
          <div className="p-3 text-sm text-muted-foreground">Selected node settings.</div>
        </FloatingPanel>
      </SpatialCanvas>
    </div>
  );
}`,
    ja: `import { FloatingPanel, SpatialCanvas } from "@gunjo/ui";

export function CanvasWorkspace() {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={40}>
        <FloatingPanel title="ツール" className="absolute left-4 top-4 w-48">
          <div className="p-3 text-sm text-muted-foreground">選択、描画、確認を行います。</div>
        </FloatingPanel>
        <FloatingPanel title="プロパティ" className="absolute bottom-4 right-4 w-56">
          <div className="p-3 text-sm text-muted-foreground">選択中ノードの設定です。</div>
        </FloatingPanel>
      </SpatialCanvas>
    </div>
  );
}`,
} as const;

const selectionCanvasCode = {
    en: `import { useMemo, useRef, useState, type PointerEvent } from "react";
import { SpatialCanvas } from "@gunjo/ui";

type Point = { x: number; y: number };
type Bounds = { left: number; top: number; width: number; height: number };

const nodes = [
  { id: "start", label: "Start", x: 48, y: 48, width: 128, height: 80 },
  { id: "review", label: "Review", x: 224, y: 112, width: 160, height: 96 },
  { id: "publish", label: "Publish", x: 520, y: 236, width: 128, height: 80 },
];

function intersects(a: Bounds, b: Bounds) {
  return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

export function SelectionCanvas() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selection, setSelection] = useState<Bounds>({ left: 32, top: 32, width: 360, height: 184 });
  const selectedNodes = useMemo(
    () => nodes.filter((node) => intersects(selection, { left: node.x, top: node.y, width: node.width, height: node.height })),
    [selection]
  );
  const selectionLabelTop = Math.min(selection.top + selection.height + 8, 328);

  const getPoint = (event: PointerEvent<HTMLDivElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(event.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(event.clientY - rect.top, rect.height)),
    };
  };

  const updateSelection = (start: Point, current: Point) => {
    setSelection({
      left: Math.min(start.x, current.x),
      top: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y),
    });
  };

  return (
    <div className="h-[360px] overflow-hidden rounded-lg border">
      <SpatialCanvas
        ref={canvasRef}
        gridSize={32}
        className="touch-none cursor-crosshair"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const start = getPoint(event);
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragStart(start);
          updateSelection(start, start);
        }}
        onPointerMove={(event) => {
          if (!dragStart) return;
          updateSelection(dragStart, getPoint(event));
        }}
        onPointerUp={() => setDragStart(null)}
        onPointerCancel={() => setDragStart(null)}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute grid place-items-center rounded-md border bg-background text-sm font-medium shadow-sm"
            style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
          >
            {node.label}
          </div>
        ))}
        <div className="pointer-events-none absolute rounded-md border border-primary-border bg-primary-subtle" style={selection} />
        <div className="pointer-events-none absolute rounded bg-primary px-2 py-1 text-xs text-primary-foreground" style={{ left: selection.left, top: selectionLabelTop }}>
          {selectedNodes.length} items selected
        </div>
      </SpatialCanvas>
    </div>
  );
}`,
    ja: `import { useMemo, useRef, useState, type PointerEvent } from "react";
import { SpatialCanvas } from "@gunjo/ui";

type Point = { x: number; y: number };
type Bounds = { left: number; top: number; width: number; height: number };

const nodes = [
  { id: "start", label: "開始", x: 48, y: 48, width: 128, height: 80 },
  { id: "review", label: "確認", x: 224, y: 112, width: 160, height: 96 },
  { id: "publish", label: "公開", x: 520, y: 236, width: 128, height: 80 },
];

function intersects(a: Bounds, b: Bounds) {
  return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

export function SelectionCanvas() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selection, setSelection] = useState<Bounds>({ left: 32, top: 32, width: 360, height: 184 });
  const selectedNodes = useMemo(
    () => nodes.filter((node) => intersects(selection, { left: node.x, top: node.y, width: node.width, height: node.height })),
    [selection]
  );
  const selectionLabelTop = Math.min(selection.top + selection.height + 8, 328);

  const getPoint = (event: PointerEvent<HTMLDivElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(event.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(event.clientY - rect.top, rect.height)),
    };
  };

  const updateSelection = (start: Point, current: Point) => {
    setSelection({
      left: Math.min(start.x, current.x),
      top: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y),
    });
  };

  return (
    <div className="h-[360px] overflow-hidden rounded-lg border">
      <SpatialCanvas
        ref={canvasRef}
        gridSize={32}
        className="touch-none cursor-crosshair"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const start = getPoint(event);
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragStart(start);
          updateSelection(start, start);
        }}
        onPointerMove={(event) => {
          if (!dragStart) return;
          updateSelection(dragStart, getPoint(event));
        }}
        onPointerUp={() => setDragStart(null)}
        onPointerCancel={() => setDragStart(null)}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute grid place-items-center rounded-md border bg-background text-sm font-medium shadow-sm"
            style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
          >
            {node.label}
          </div>
        ))}
        <div className="pointer-events-none absolute rounded-md border border-primary-border bg-primary-subtle" style={selection} />
        <div className="pointer-events-none absolute rounded bg-primary px-2 py-1 text-xs text-primary-foreground" style={{ left: selection.left, top: selectionLabelTop }}>
          {selectedNodes.length}件を選択中
        </div>
      </SpatialCanvas>
    </div>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        panels: codeByLocale.en,
        nodes: `import { SpatialCanvas } from "@gunjo/ui";

export function WorkflowCanvas() {
  return (
    <div className="h-[360px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={32}>
        <div className="absolute left-10 top-10 rounded-md border bg-background p-3 shadow-sm">Start</div>
        <div className="absolute left-56 top-32 rounded-md border bg-background p-3 shadow-sm">Review</div>
        <div className="absolute bottom-10 right-12 rounded-md border bg-background p-3 shadow-sm">Publish</div>
      </SpatialCanvas>
    </div>
  );
}`,
        selection: selectionCanvasCode.en,
        dense: `import { SpatialCanvas } from "@gunjo/ui";

export function DenseGridCanvas() {
  return (
    <div className="h-[320px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={16}>
        <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          Dense grid for precise placement
        </div>
      </SpatialCanvas>
    </div>
  );
}`,
        coarse: `import { SpatialCanvas } from "@gunjo/ui";

export function CoarseGridCanvas() {
  return (
    <div className="h-[320px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={64}>
        <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          Coarse grid for broad layout work
        </div>
      </SpatialCanvas>
    </div>
  );
}`,
    },
    ja: {
        panels: codeByLocale.ja,
        nodes: `import { SpatialCanvas } from "@gunjo/ui";

export function WorkflowCanvas() {
  return (
    <div className="h-[360px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={32}>
        <div className="absolute left-10 top-10 rounded-md border bg-background p-3 shadow-sm">開始</div>
        <div className="absolute left-56 top-32 rounded-md border bg-background p-3 shadow-sm">確認</div>
        <div className="absolute bottom-10 right-12 rounded-md border bg-background p-3 shadow-sm">公開</div>
      </SpatialCanvas>
    </div>
  );
}`,
        selection: selectionCanvasCode.ja,
        dense: `import { SpatialCanvas } from "@gunjo/ui";

export function DenseGridCanvas() {
  return (
    <div className="h-[320px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={16}>
        <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          細かい配置向けのグリッド
        </div>
      </SpatialCanvas>
    </div>
  );
}`,
        coarse: `import { SpatialCanvas } from "@gunjo/ui";

export function CoarseGridCanvas() {
  return (
    <div className="h-[320px] overflow-hidden rounded-lg border">
      <SpatialCanvas gridSize={64}>
        <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          大きな構成確認向けのグリッド
        </div>
      </SpatialCanvas>
    </div>
  );
}`,
    },
} as const;

type SelectionPoint = {
    x: number;
    y: number;
};

type SelectionBounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};

const selectionNodes = [
    { id: "start", labelJa: "開始", labelEn: "Start", x: 48, y: 48, width: 128, height: 80 },
    { id: "review", labelJa: "確認", labelEn: "Review", x: 224, y: 112, width: 160, height: 96 },
    { id: "publish", labelJa: "公開", labelEn: "Publish", x: 520, y: 236, width: 128, height: 80 },
];

function intersects(a: SelectionBounds, b: SelectionBounds) {
    return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

function SelectionCanvasPreview({ locale }: { locale: keyof typeof codeByLocale }) {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [dragStart, setDragStart] = useState<SelectionPoint | null>(null);
    const [selection, setSelection] = useState<SelectionBounds>({ left: 32, top: 32, width: 360, height: 184 });
    const selectedNodes = useMemo(
        () => selectionNodes.filter((node) => intersects(selection, { left: node.x, top: node.y, width: node.width, height: node.height })),
        [selection]
    );
    const selectionLabelTop = Math.min(selection.top + selection.height + 8, 328);

    const getPoint = (event: PointerEvent<HTMLDivElement>): SelectionPoint => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return {
            x: Math.max(0, Math.min(event.clientX - rect.left, rect.width)),
            y: Math.max(0, Math.min(event.clientY - rect.top, rect.height)),
        };
    };

    const updateSelection = (start: SelectionPoint, current: SelectionPoint) => {
        setSelection({
            left: Math.min(start.x, current.x),
            top: Math.min(start.y, current.y),
            width: Math.abs(current.x - start.x),
            height: Math.abs(current.y - start.y),
        });
    };

    return (
        <div className="h-[360px] w-full overflow-hidden rounded-lg border">
            <SpatialCanvas
                ref={canvasRef}
                gridSize={32}
                className="touch-none cursor-crosshair"
                onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    const start = getPoint(event);
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragStart(start);
                    updateSelection(start, start);
                }}
                onPointerMove={(event) => {
                    if (!dragStart) return;
                    updateSelection(dragStart, getPoint(event));
                }}
                onPointerUp={() => setDragStart(null)}
                onPointerCancel={() => setDragStart(null)}
            >
                {selectionNodes.map((node) => (
                    <div
                        key={node.id}
                        className="absolute grid place-items-center rounded-md border bg-background text-sm font-medium shadow-sm"
                        style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
                    >
                        {locale === "ja" ? node.labelJa : node.labelEn}
                    </div>
                ))}
                <div className="pointer-events-none absolute rounded-md border border-primary-border bg-primary-subtle" style={selection} />
                <div
                    className="pointer-events-none absolute rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                    style={{ left: selection.left, top: selectionLabelTop }}
                >
                    {locale === "ja" ? `${selectedNodes.length}件を選択中` : `${selectedNodes.length} items selected`}
                </div>
            </SpatialCanvas>
        </div>
    );
}

export default function SpatialCanvasPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "gridSize", type: "number", default: "20", description: "背景グリッドの間隔です。px 単位で指定します。" },
            { name: "children", type: "ReactNode", description: "キャンバス内に配置するノードやパネルです。" },
            { name: "className", type: "string", description: "サイズや背景を調整する追加 className です。" },
        ]
        : [
            { name: "gridSize", type: "number", default: "20", description: "Background grid interval in pixels." },
            { name: "children", type: "ReactNode", description: "Nodes or panels positioned inside the canvas." },
            { name: "className", type: "string", description: "Additional class names for sizing or background treatment." },
        ];

    return (
        <ComponentLayout
            title={locale === "ja" ? "空間キャンバス" : meta.spatialCanvas.title}
            description={locale === "ja" ? "パネルやノードを配置できる、ドット背景とグリッド間隔を持つキャンバス面です。" : meta.spatialCanvas.description}
            usedComponents={[{ name: "SpatialCanvas", href: "/docs/components/spatial-canvas" }]}
            relatedComponents={[
                { name: "FloatingPanel", href: "/docs/components/floating-panel" },
                { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
                { name: "Resizable", href: "/docs/components/resizable" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/spatial-canvas" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="lg" previewHeight="auto">
                <div className="h-[420px] w-full overflow-hidden rounded-lg border">
                    <SpatialCanvas gridSize={40}>
                        <FloatingPanel title={locale === "ja" ? "ツール" : "Tools"} className="absolute left-4 top-4 w-48">
                            <div className="p-3 text-sm text-muted-foreground">{locale === "ja" ? "選択、描画、確認を行います。" : "Select, draw, and inspect."}</div>
                        </FloatingPanel>
                        <FloatingPanel title={locale === "ja" ? "プロパティ" : "Properties"} className="absolute bottom-4 right-4 w-56">
                            <div className="p-3 text-sm text-muted-foreground">{locale === "ja" ? "選択中ノードの設定です。" : "Selected node settings."}</div>
                        </FloatingPanel>
                    </SpatialCanvas>
                </div>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "状態とバリエーション" : "States and Variants"}</h2>
                </div>
                <div className="space-y-8">
                    {[
                        {
                            key: "panels",
                            title: locale === "ja" ? "パネル配置" : "Floating panels",
                            description: locale === "ja" ? "作業面の上にツールやプロパティパネルを配置します。" : "Place tools and property panels on top of a workspace surface.",
                            code: stateCodeByLocale[locale].panels,
                            preview: (
                                <div className="h-[420px] w-full overflow-hidden rounded-lg border">
                                    <SpatialCanvas gridSize={40}>
                                        <FloatingPanel title={locale === "ja" ? "ツール" : "Tools"} className="absolute left-4 top-4 w-48"><div className="p-3 text-sm text-muted-foreground">{locale === "ja" ? "選択、描画、確認を行います。" : "Select, draw, and inspect."}</div></FloatingPanel>
                                        <FloatingPanel title={locale === "ja" ? "プロパティ" : "Properties"} className="absolute bottom-4 right-4 w-56"><div className="p-3 text-sm text-muted-foreground">{locale === "ja" ? "選択中ノードの設定です。" : "Selected node settings."}</div></FloatingPanel>
                                    </SpatialCanvas>
                                </div>
                            ),
                        },
                        {
                            key: "nodes",
                            title: locale === "ja" ? "ノード配置" : "Positioned nodes",
                            description: locale === "ja" ? "絶対配置のノードをキャンバス上に並べます。" : "Place absolute-positioned nodes on the canvas.",
                            code: stateCodeByLocale[locale].nodes,
                            preview: (
                                <div className="h-[360px] w-full overflow-hidden rounded-lg border">
                                    <SpatialCanvas gridSize={32}>
                                        <div className="absolute left-10 top-10 rounded-md border bg-background p-3 shadow-sm">{locale === "ja" ? "開始" : "Start"}</div>
                                        <div className="absolute left-56 top-32 rounded-md border bg-background p-3 shadow-sm">{locale === "ja" ? "確認" : "Review"}</div>
                                        <div className="absolute bottom-10 right-12 rounded-md border bg-background p-3 shadow-sm">{locale === "ja" ? "公開" : "Publish"}</div>
                                    </SpatialCanvas>
                                </div>
                            ),
                        },
                        {
                            key: "selection",
                            title: locale === "ja" ? "選択範囲" : "Selection range",
                            description: locale === "ja" ? "キャンバス上をドラッグして矩形で囲い、範囲内のノードを選択します。" : "Drag on the canvas to draw a rectangle and select nodes inside the range.",
                            code: stateCodeByLocale[locale].selection,
                            preview: <SelectionCanvasPreview locale={locale} />,
                        },
                        {
                            key: "dense",
                            title: locale === "ja" ? "細かいグリッド" : "Dense grid",
                            description: locale === "ja" ? "細かい配置や位置合わせを見せる時に gridSize を小さくします。" : "Use a smaller grid size for precise placement.",
                            code: stateCodeByLocale[locale].dense,
                            preview: (
                                <div className="h-[320px] w-full overflow-hidden rounded-lg border">
                                    <SpatialCanvas gridSize={16}><div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">{locale === "ja" ? "細かい配置向けのグリッド" : "Dense grid for precise placement"}</div></SpatialCanvas>
                                </div>
                            ),
                        },
                        {
                            key: "coarse",
                            title: locale === "ja" ? "大きいグリッド" : "Coarse grid",
                            description: locale === "ja" ? "大きな構成確認では gridSize を広げます。" : "Use a larger grid size for broad layout work.",
                            code: stateCodeByLocale[locale].coarse,
                            preview: (
                                <div className="h-[320px] w-full overflow-hidden rounded-lg border">
                                    <SpatialCanvas gridSize={64}><div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">{locale === "ja" ? "大きな構成確認向けのグリッド" : "Coarse grid for broad layout work"}</div></SpatialCanvas>
                                </div>
                            ),
                        },
                    ].map((item) => (
                        <section key={item.key} className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <ComponentPreview code={item.code} codeBlock={<CodeBlock code={item.code} />} previewBodyWidth="lg" previewHeight="auto">
                                {item.preview}
                            </ComponentPreview>
                        </section>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </section>
        </ComponentLayout>
    );
}
