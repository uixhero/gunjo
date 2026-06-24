"use client";

import type { ReactNode } from "react";
import { Grid } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const dashboardCardsByLocale = {
    en: [
        { title: "Overview", meta: "Workspace health" },
        { title: "Revenue", meta: "$128,400" },
        { title: "Users", meta: "12,840 active" },
        { title: "Tasks", meta: "24 open" },
        { title: "Alerts", meta: "3 need review" },
        { title: "Settings", meta: "Team policy" },
    ],
    ja: [
        { title: "概要", meta: "ワークスペースの状況" },
        { title: "売上", meta: "128,400円" },
        { title: "ユーザー", meta: "12,840人が利用中" },
        { title: "タスク", meta: "24件が未完了" },
        { title: "通知", meta: "3件の確認待ち" },
        { title: "設定", meta: "チームポリシー" },
    ],
} as const;

const codeByLocale = {
    en: `import { Grid } from "@gunjo/ui";

const cards = [
  { title: "Overview", meta: "Workspace health" },
  { title: "Revenue", meta: "$128,400" },
  { title: "Users", meta: "12,840 active" },
  { title: "Tasks", meta: "24 open" },
  { title: "Alerts", meta: "3 need review" },
  { title: "Settings", meta: "Team policy" },
];

export function DashboardGrid() {
  return (
    <Grid minItemWidth={180} gap={3} className="w-full">
      {cards.map((card) => (
        <section key={card.title} className="rounded-md border bg-card p-4">
          <h3 className="font-medium">{card.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{card.meta}</p>
        </section>
      ))}
    </Grid>
  );
}`,
    ja: `import { Grid } from "@gunjo/ui";

const cards = [
  { title: "概要", meta: "ワークスペースの状況" },
  { title: "売上", meta: "128,400円" },
  { title: "ユーザー", meta: "12,840人が利用中" },
  { title: "タスク", meta: "24件が未完了" },
  { title: "通知", meta: "3件の確認待ち" },
  { title: "設定", meta: "チームポリシー" },
];

export function DashboardGrid() {
  return (
    <Grid minItemWidth={180} gap={3} className="w-full">
      {cards.map((card) => (
        <section key={card.title} className="rounded-md border bg-card p-4">
          <h3 className="font-medium">{card.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{card.meta}</p>
        </section>
      ))}
    </Grid>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        fixed: `import { Grid } from "@gunjo/ui";

const cells = ["1", "2", "3", "4", "5", "6"];

export function FixedColumnGrid() {
  return (
    <Grid cols={3} gap={3} className="w-full">
      {cells.map((cell) => (
        <div key={cell} className="grid min-h-16 place-items-center rounded-md border bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
          {cell}
        </div>
      ))}
    </Grid>
  );
}`,
        autoFit: `import { Grid } from "@gunjo/ui";

const cards = ["Audit", "Design", "Review", "Deploy", "Report"];

export function ResponsiveAutoFitGrid() {
  return (
    <Grid minItemWidth={160} gap={3} className="w-full">
      {cards.map((card) => (
        <div key={card} className="grid min-h-16 place-items-center rounded-md border bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
          {card}
        </div>
      ))}
    </Grid>
  );
}`,
        span: `import { Grid } from "@gunjo/ui";

export function TwelveColumnGrid() {
  return (
    <Grid cols={12} gap={3} className="w-full">
      <section className="col-span-12 rounded-md border bg-card p-4 sm:col-span-6 lg:col-span-8">
        <h3 className="font-medium">Main panel</h3>
        <p className="mt-1 text-sm text-muted-foreground">Spans 8 columns on desktop.</p>
      </section>
      <aside className="col-span-12 rounded-md border bg-card p-4 sm:col-span-6 lg:col-span-4">
        <h3 className="font-medium">Side panel</h3>
        <p className="mt-1 text-sm text-muted-foreground">Spans 4 columns on desktop.</p>
      </aside>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">Metric A</div>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">Metric B</div>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">Metric C</div>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">Metric D</div>
    </Grid>
  );
}`,
        gap: `import { Grid } from "@gunjo/ui";

const cells = ["1", "2", "3", "4"];

export function GridGapDensity() {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2">
      <Grid minItemWidth={96} gap={1}>
        {cells.map((cell) => (
          <div key={cell} className="grid min-h-14 place-items-center rounded-md border bg-muted/50 text-sm text-muted-foreground">
            Tight {cell}
          </div>
        ))}
      </Grid>
      <Grid minItemWidth={96} gap={6}>
        {cells.map((cell) => (
          <div key={cell} className="grid min-h-14 place-items-center rounded-md border bg-muted/50 text-sm text-muted-foreground">
            Loose {cell}
          </div>
        ))}
      </Grid>
    </div>
  );
}`,
    },
    ja: {
        fixed: `import { Grid } from "@gunjo/ui";

const cells = ["1", "2", "3", "4", "5", "6"];

export function FixedColumnGrid() {
  return (
    <Grid cols={3} gap={3} className="w-full">
      {cells.map((cell) => (
        <div key={cell} className="grid min-h-16 place-items-center rounded-md border bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
          {cell}
        </div>
      ))}
    </Grid>
  );
}`,
        autoFit: `import { Grid } from "@gunjo/ui";

const cards = ["監査", "デザイン", "確認", "公開", "レポート"];

export function ResponsiveAutoFitGrid() {
  return (
    <Grid minItemWidth={160} gap={3} className="w-full">
      {cards.map((card) => (
        <div key={card} className="grid min-h-16 place-items-center rounded-md border bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
          {card}
        </div>
      ))}
    </Grid>
  );
}`,
        span: `import { Grid } from "@gunjo/ui";

export function TwelveColumnGrid() {
  return (
    <Grid cols={12} gap={3} className="w-full">
      <section className="col-span-12 rounded-md border bg-card p-4 sm:col-span-6 lg:col-span-8">
        <h3 className="font-medium">メインパネル</h3>
        <p className="mt-1 text-sm text-muted-foreground">デスクトップでは8列分を使います。</p>
      </section>
      <aside className="col-span-12 rounded-md border bg-card p-4 sm:col-span-6 lg:col-span-4">
        <h3 className="font-medium">補助パネル</h3>
        <p className="mt-1 text-sm text-muted-foreground">デスクトップでは4列分を使います。</p>
      </aside>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">指標A</div>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">指標B</div>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">指標C</div>
      <div className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">指標D</div>
    </Grid>
  );
}`,
        gap: `import { Grid } from "@gunjo/ui";

const cells = ["1", "2", "3", "4"];

export function GridGapDensity() {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2">
      <Grid minItemWidth={96} gap={1}>
        {cells.map((cell) => (
          <div key={cell} className="grid min-h-14 place-items-center rounded-md border bg-muted/50 text-sm text-muted-foreground">
            密 {cell}
          </div>
        ))}
      </Grid>
      <Grid minItemWidth={96} gap={6}>
        {cells.map((cell) => (
          <div key={cell} className="grid min-h-14 place-items-center rounded-md border bg-muted/50 text-sm text-muted-foreground">
            広 {cell}
          </div>
        ))}
      </Grid>
    </div>
  );
}`,
    },
} as const;

function DemoCell({ children }: { children: ReactNode }) {
    return (
        <div className="grid min-h-16 place-items-center rounded-md border bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
            {children}
        </div>
    );
}

export default function GridPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "cols", type: "ColCount | { base?, sm?, md?, lg?, xl? }", default: "3", description: "列数。固定数（cols={3}）は全幅で N 列固定のため狭い画面で溢れます。モバイル対応はレスポンシブ指定（cols={{ base: 1, md: 3 }}）か minItemWidth を。minItemWidth 指定時は無視されます。" },
            { name: "minItemWidth", type: "number", description: "auto-fit の最小セル幅です。幅に応じて列数が変わります。" },
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8", default: "4", description: "セル同士の余白です。" },
            { name: "className", type: "string", description: "追加の className です。" },
        ]
        : [
            { name: "cols", type: "ColCount | { base?, sm?, md?, lg?, xl? }", default: "3", description: "Column count. A fixed number (cols={3}) stays N-up at every width and overflows on narrow screens — for mobile-safe layouts pass a responsive object (cols={{ base: 1, md: 3 }}) or use minItemWidth. Ignored when minItemWidth is provided." },
            { name: "minItemWidth", type: "number", description: "Minimum auto-fit cell width. The column count changes with available width." },
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8", default: "4", description: "Spacing between cells." },
            { name: "className", type: "string", description: "Additional class names." },
        ];

    return (
        <ComponentLayout
            title={meta.grid.title}
            description={meta.grid.description}
            usedComponents={[{ name: "Grid", href: "/docs/components/grid" }]}
            relatedComponents={[
                { name: "Container", href: "/docs/components/container" },
                { name: "Cluster", href: "/docs/components/cluster" },
                { name: "Card", href: "/docs/components/card" },
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/grid" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="lg">
                <Grid minItemWidth={180} gap={3} className="w-full">
                    {dashboardCardsByLocale[locale].map((card) => (
                        <section key={card.title} className="rounded-md border bg-card p-4">
                            <h3 className="font-medium">{card.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{card.meta}</p>
                        </section>
                    ))}
                </Grid>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <div className="space-y-8">
                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "固定列" : "Fixed columns"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "カード数や表示幅が決まっている領域では、列数を明示します。" : "Set an explicit column count when the layout has a fixed structure."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].fixed} codeBlock={<CodeBlock code={stateCodeByLocale[locale].fixed} />} previewBodyWidth="md" previewHeight="auto">
                            <Grid cols={3} gap={3} className="w-full">
                                {Array.from({ length: 6 }, (_, index) => <DemoCell key={index}>{index + 1}</DemoCell>)}
                            </Grid>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "幅に応じて列数を変える" : "Responsive auto-fit"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "親幅に合わせて列数を変えるカード一覧では、最小セル幅を指定します。" : "Set a minimum item width when card lists should adapt to the parent width."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].autoFit} codeBlock={<CodeBlock code={stateCodeByLocale[locale].autoFit} />} previewBodyWidth="md" previewHeight="auto">
                            <Grid minItemWidth={160} gap={3} className="w-full">
                                {(locale === "ja" ? ["監査", "デザイン", "確認", "公開", "レポート"] : ["Audit", "Design", "Review", "Deploy", "Report"]).map((item) => <DemoCell key={item}>{item}</DemoCell>)}
                            </Grid>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "12列レイアウト" : "12-column layout"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "子要素側の col-span と組み合わせて、メイン領域と補助領域の比率を調整します。" : "Combine Grid with child col-span classes to size main and supporting regions."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].span} codeBlock={<CodeBlock code={stateCodeByLocale[locale].span} />} previewBodyWidth="lg" previewHeight="auto">
                            <Grid cols={12} gap={3} className="w-full">
                                <section className="col-span-12 rounded-md border bg-card p-4 sm:col-span-6 lg:col-span-8">
                                    <h3 className="font-medium">{locale === "ja" ? "メインパネル" : "Main panel"}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {locale === "ja" ? "デスクトップでは8列分を使います。" : "Spans 8 columns on desktop."}
                                    </p>
                                </section>
                                <aside className="col-span-12 rounded-md border bg-card p-4 sm:col-span-6 lg:col-span-4">
                                    <h3 className="font-medium">{locale === "ja" ? "補助パネル" : "Side panel"}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {locale === "ja" ? "デスクトップでは4列分を使います。" : "Spans 4 columns on desktop."}
                                    </p>
                                </aside>
                                {(locale === "ja" ? ["指標A", "指標B", "指標C", "指標D"] : ["Metric A", "Metric B", "Metric C", "Metric D"]).map((item) => (
                                    <div key={item} className="col-span-6 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground lg:col-span-3">
                                        {item}
                                    </div>
                                ))}
                            </Grid>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "余白の密度" : "Gap density"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "同じセル幅でも、gap の違いで一覧の密度を変えられます。" : "Adjust list density by changing gap while keeping the same item width."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].gap} codeBlock={<CodeBlock code={stateCodeByLocale[locale].gap} />} previewBodyWidth="lg" previewHeight="auto">
                            <div className="grid w-full gap-5 md:grid-cols-2">
                                <Grid minItemWidth={96} gap={1}>
                                    {Array.from({ length: 4 }, (_, index) => (
                                        <div key={index} className="grid min-h-14 place-items-center rounded-md border bg-muted/50 text-sm text-muted-foreground">
                                            {locale === "ja" ? `密 ${index + 1}` : `Tight ${index + 1}`}
                                        </div>
                                    ))}
                                </Grid>
                                <Grid minItemWidth={96} gap={6}>
                                    {Array.from({ length: 4 }, (_, index) => (
                                        <div key={index} className="grid min-h-14 place-items-center rounded-md border bg-muted/50 text-sm text-muted-foreground">
                                            {locale === "ja" ? `広 ${index + 1}` : `Loose ${index + 1}`}
                                        </div>
                                    ))}
                                </Grid>
                            </div>
                        </ComponentPreview>
                    </section>
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
