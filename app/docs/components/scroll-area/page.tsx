"use client";

import { ScrollArea, Separator } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const releaseItems = Array.from({ length: 18 }, (_, index) => `v2.${Math.floor((18 - index) / 3)}.${18 - index}`);
const wideTableColumns = {
    en: ["Project", "Owner", "Status", "Updated", "Budget", "Risk"],
    ja: ["プロジェクト", "担当", "状態", "更新日", "予算", "リスク"],
} as const;
const wideTableRows = {
    en: [
        ["Mobile refresh", "Design", "In review", "2026-06-01", "$18,200", "Low"],
        ["Search index", "Platform", "Building", "2026-06-02", "$42,000", "Medium"],
        ["Billing export", "Finance", "Blocked", "2026-06-03", "$9,800", "High"],
        ["Media library", "Product", "Ready", "2026-06-03", "$25,600", "Low"],
        ["Audit crawler", "Docs", "Planning", "2026-06-04", "$14,400", "Medium"],
        ["Export worker", "Operations", "Running", "2026-06-04", "$32,100", "Low"],
        ["Access review", "Security", "Reviewing", "2026-06-05", "$11,900", "Medium"],
        ["Usage dashboard", "Analytics", "Queued", "2026-06-05", "$27,300", "Low"],
    ],
    ja: [
        ["モバイル刷新", "デザイン", "確認中", "2026-06-01", "18,200円", "低"],
        ["検索インデックス", "基盤", "構築中", "2026-06-02", "42,000円", "中"],
        ["請求書き出し", "経理", "停止中", "2026-06-03", "9,800円", "高"],
        ["メディアライブラリ", "プロダクト", "準備完了", "2026-06-03", "25,600円", "低"],
        ["監査クローラー", "ドキュメント", "計画中", "2026-06-04", "14,400円", "中"],
        ["書き出しワーカー", "運用", "実行中", "2026-06-04", "32,100円", "低"],
        ["アクセス確認", "セキュリティ", "確認中", "2026-06-05", "11,900円", "中"],
        ["利用状況ダッシュボード", "分析", "待機中", "2026-06-05", "27,300円", "低"],
    ],
} as const;

const codeByLocale = {
    en: `import { ScrollArea, Separator } from "@gunjo/ui";

const releases = Array.from({ length: 18 }, (_, index) => \`v2.\${Math.floor((18 - index) / 3)}.\${18 - index}\`);

export function ReleaseList() {
  return (
    <ScrollArea className="h-56 w-full max-w-sm rounded-md border bg-background p-4">
      <div className="mb-3 text-sm font-medium">Releases</div>
      {releases.map((release) => (
        <div key={release}>
          <div className="text-sm">{release}</div>
          <Separator className="my-2" />
        </div>
      ))}
    </ScrollArea>
  );
}`,
    ja: `import { ScrollArea, Separator } from "@gunjo/ui";

const releases = Array.from({ length: 18 }, (_, index) => \`v2.\${Math.floor((18 - index) / 3)}.\${18 - index}\`);

export function ReleaseList() {
  return (
    <ScrollArea className="h-56 w-full max-w-sm rounded-md border bg-background p-4">
      <div className="mb-3 text-sm font-medium">リリース</div>
      {releases.map((release) => (
        <div key={release}>
          <div className="text-sm">{release}</div>
          <Separator className="my-2" />
        </div>
      ))}
    </ScrollArea>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        list: codeByLocale.en,
        article: `import { ScrollArea } from "@gunjo/ui";

export function ScrollableNotes() {
  return (
    <ScrollArea className="h-52 w-full max-w-lg rounded-md border bg-background p-4">
      <article className="space-y-3 text-sm leading-6 text-muted-foreground">
        <h3 className="text-base font-semibold text-foreground">Scrollable notes</h3>
        <p>Use ScrollArea when the visible region is intentionally constrained.</p>
        <p>Keep the scrollable area obvious and avoid hiding critical actions below the fold.</p>
        <p>Long supporting text can stay inside the panel without expanding the page.</p>
        <p>Reserve this pattern for secondary content, previews, and supporting information.</p>
        <p>When the content includes primary actions, keep those actions outside the scroll region.</p>
      </article>
    </ScrollArea>
  );
}`,
        horizontal: `import { ScrollArea } from "@gunjo/ui";

const sections = ["Dashboard", "Analytics", "Exports", "Members", "Settings", "Billing"];

export function HorizontalSectionScroller() {
  return (
    <ScrollArea
      className="w-full max-w-lg rounded-md border bg-background p-3"
      scrollbarOrientation="horizontal"
    >
      <div className="flex w-max gap-3 pb-2">
        {sections.map((item) => (
          <div key={item} className="w-36 rounded-md border bg-muted/50 p-3 text-sm">
            {item}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`,
        both: `import { ScrollArea } from "@gunjo/ui";

const columns = ["Project", "Owner", "Status", "Updated", "Budget", "Risk"];
const rows = [
  ["Mobile refresh", "Design", "In review", "2026-06-01", "$18,200", "Low"],
  ["Search index", "Platform", "Building", "2026-06-02", "$42,000", "Medium"],
  ["Billing export", "Finance", "Blocked", "2026-06-03", "$9,800", "High"],
  ["Media library", "Product", "Ready", "2026-06-03", "$25,600", "Low"],
  ["Audit crawler", "Docs", "Planning", "2026-06-04", "$14,400", "Medium"],
  ["Export worker", "Operations", "Running", "2026-06-04", "$32,100", "Low"],
  ["Access review", "Security", "Reviewing", "2026-06-05", "$11,900", "Medium"],
  ["Usage dashboard", "Analytics", "Queued", "2026-06-05", "$27,300", "Low"],
];

export function WideScrollableTable() {
  return (
    <ScrollArea className="h-44 w-full max-w-xl rounded-md border bg-background" scrollbarOrientation="both">
      <table className="min-w-[760px] text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-medium">{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t">
              {row.map((cell) => <td key={cell} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}`,
        always: `import { ScrollArea } from "@gunjo/ui";

export function AlwaysVisibleScrollbar() {
  return (
    <ScrollArea type="always" className="h-48 w-full max-w-sm rounded-md border bg-background p-4">
      {Array.from({ length: 12 }, (_, index) => (
        <p key={index} className="text-sm text-muted-foreground">Always visible row {index + 1}</p>
      ))}
    </ScrollArea>
  );
}`,
    },
    ja: {
        list: codeByLocale.ja,
        article: `import { ScrollArea } from "@gunjo/ui";

export function ScrollableNotes() {
  return (
    <ScrollArea className="h-52 w-full max-w-lg rounded-md border bg-background p-4">
      <article className="space-y-3 text-sm leading-6 text-muted-foreground">
        <h3 className="text-base font-semibold text-foreground">スクロールする補足</h3>
        <p>表示領域を意図的に制限する時に ScrollArea を使います。</p>
        <p>重要な操作を見えない位置に隠さず、スクロールが必要な領域だと分かるようにします。</p>
        <p>長い補足文は、ページ全体を押し広げずにパネル内へ収められます。</p>
        <p>このパターンは、補助情報、プレビュー、詳細説明などの二次的な内容に使います。</p>
        <p>主要な操作が含まれる場合は、操作そのものをスクロール領域の外に置きます。</p>
      </article>
    </ScrollArea>
  );
}`,
        horizontal: `import { ScrollArea } from "@gunjo/ui";

const sections = ["ダッシュボード", "分析", "書き出し", "メンバー", "設定", "請求"];

export function HorizontalSectionScroller() {
  return (
    <ScrollArea
      className="w-full max-w-lg rounded-md border bg-background p-3"
      scrollbarOrientation="horizontal"
    >
      <div className="flex w-max gap-3 pb-2">
        {sections.map((item) => (
          <div key={item} className="w-36 rounded-md border bg-muted/50 p-3 text-sm">
            {item}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`,
        both: `import { ScrollArea } from "@gunjo/ui";

const columns = ["プロジェクト", "担当", "状態", "更新日", "予算", "リスク"];
const rows = [
  ["モバイル刷新", "デザイン", "確認中", "2026-06-01", "18,200円", "低"],
  ["検索インデックス", "基盤", "構築中", "2026-06-02", "42,000円", "中"],
  ["請求書き出し", "経理", "停止中", "2026-06-03", "9,800円", "高"],
  ["メディアライブラリ", "プロダクト", "準備完了", "2026-06-03", "25,600円", "低"],
  ["監査クローラー", "ドキュメント", "計画中", "2026-06-04", "14,400円", "中"],
  ["書き出しワーカー", "運用", "実行中", "2026-06-04", "32,100円", "低"],
  ["アクセス確認", "セキュリティ", "確認中", "2026-06-05", "11,900円", "中"],
  ["利用状況ダッシュボード", "分析", "待機中", "2026-06-05", "27,300円", "低"],
];

export function WideScrollableTable() {
  return (
    <ScrollArea className="h-44 w-full max-w-xl rounded-md border bg-background" scrollbarOrientation="both">
      <table className="min-w-[760px] text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-medium">{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t">
              {row.map((cell) => <td key={cell} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}`,
        always: `import { ScrollArea } from "@gunjo/ui";

export function AlwaysVisibleScrollbar() {
  return (
    <ScrollArea type="always" className="h-48 w-full max-w-sm rounded-md border bg-background p-4">
      {Array.from({ length: 12 }, (_, index) => (
        <p key={index} className="text-sm text-muted-foreground">常時表示の行 {index + 1}</p>
      ))}
    </ScrollArea>
  );
}`,
    },
} as const;

export default function ScrollAreaPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "type", type: '"auto" | "always" | "scroll" | "hover"', default: '"hover"', description: "スクロールバーの表示タイミングです。" },
            { name: "scrollHideDelay", type: "number", default: "600", description: "スクロールバーが隠れるまでの遅延です。" },
            { name: "scrollbarOrientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "自動描画するスクロールバーの向きです。" },
            { name: "viewportClassName", type: "string", description: "viewport に追加する className です。" },
            { name: "scrollbarClassName", type: "string", description: "スクロールバーに追加する className です。" },
            { name: "thumbClassName", type: "string", description: "つまみに追加する className です。" },
        ]
        : [
            { name: "type", type: '"auto" | "always" | "scroll" | "hover"', default: '"hover"', description: "Controls scrollbar visibility behavior." },
            { name: "scrollHideDelay", type: "number", default: "600", description: "Delay before scrollbars hide." },
            { name: "scrollbarOrientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "Automatically rendered scrollbar orientation." },
            { name: "viewportClassName", type: "string", description: "Additional class names for the viewport." },
            { name: "scrollbarClassName", type: "string", description: "Additional class names for the scrollbar." },
            { name: "thumbClassName", type: "string", description: "Additional class names for the thumb." },
        ];

    return (
        <ComponentLayout
            title={locale === "ja" ? "スクロール領域" : meta.scrollArea.title}
            description={locale === "ja" ? "表示領域を意図的に制限し、縦横スクロールを一貫したスタイルで扱います。" : meta.scrollArea.description}
            usedComponents={[
                { name: "ScrollArea", href: "/docs/components/scroll-area" },
                { name: "ScrollBar", href: "/docs/components/scroll-area" },
            ]}
            relatedComponents={[
                { name: "Resizable", href: "/docs/components/resizable" },
                { name: "InspectorPanel", href: "/docs/components/inspector-panel" },
                { name: "DataTable", href: "/docs/components/data-table" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/scroll-area" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="md" previewHeight={340}>
                <ScrollArea className="h-56 w-full max-w-sm rounded-md border bg-background p-4">
                    <div className="mb-3 text-sm font-medium">{locale === "ja" ? "リリース" : "Releases"}</div>
                    {releaseItems.map((release) => (
                        <div key={release}>
                            <div className="text-sm">{release}</div>
                            <Separator className="my-2" />
                        </div>
                    ))}
                </ScrollArea>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "状態とバリエーション" : "States and Variants"}</h2>
                </div>
                <div className="space-y-8">
                    {[
                        {
                            key: "list",
                            title: locale === "ja" ? "リスト" : "List",
                            description: locale === "ja" ? "高さが決まったパネル内に長いリストを収めます。" : "Contain a long list inside a fixed-height panel.",
                            code: stateCodeByLocale[locale].list,
                            preview: (
                                <ScrollArea className="h-56 w-full max-w-sm rounded-md border bg-background p-4">
                                    <div className="mb-3 text-sm font-medium">{locale === "ja" ? "リリース" : "Releases"}</div>
                                    {releaseItems.map((release) => (
                                        <div key={release}>
                                            <div className="text-sm">{release}</div>
                                            <Separator className="my-2" />
                                        </div>
                                    ))}
                                </ScrollArea>
                            ),
                        },
                        {
                            key: "article",
                            title: locale === "ja" ? "本文" : "Article text",
                            description: locale === "ja" ? "補足文や説明文をパネル内でスクロールさせます。" : "Scroll supporting notes or explanatory text inside a panel.",
                            code: stateCodeByLocale[locale].article,
                            preview: (
                                <ScrollArea className="h-52 w-full max-w-lg rounded-md border bg-background p-4">
                                    <article className="space-y-3 text-sm leading-6 text-muted-foreground">
                                        <h3 className="text-base font-semibold text-foreground">{locale === "ja" ? "スクロールする補足" : "Scrollable notes"}</h3>
                                        <p>{locale === "ja" ? "表示領域を意図的に制限する時に ScrollArea を使います。" : "Use ScrollArea when the visible region is intentionally constrained."}</p>
                                        <p>{locale === "ja" ? "重要な操作を見えない位置に隠さず、スクロールが必要な領域だと分かるようにします。" : "Keep the scrollable area obvious and avoid hiding critical actions below the fold."}</p>
                                        <p>{locale === "ja" ? "長い補足文は、ページ全体を押し広げずにパネル内へ収められます。" : "Long supporting text can stay inside the panel without expanding the page."}</p>
                                        <p>{locale === "ja" ? "このパターンは、補助情報、プレビュー、詳細説明などの二次的な内容に使います。" : "Reserve this pattern for secondary content, previews, and supporting information."}</p>
                                        <p>{locale === "ja" ? "主要な操作が含まれる場合は、操作そのものをスクロール領域の外に置きます。" : "When the content includes primary actions, keep those actions outside the scroll region."}</p>
                                    </article>
                                </ScrollArea>
                            ),
                        },
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "横スクロール" : "Horizontal scroll",
                            description: locale === "ja" ? "幅の広い項目列を、横方向のスクロールとして扱います。" : "Use horizontal scrolling for wide item rows.",
                            code: stateCodeByLocale[locale].horizontal,
                            preview: (
                                <ScrollArea className="w-full max-w-lg rounded-md border bg-background p-3" scrollbarOrientation="horizontal">
                                    <div className="flex w-max gap-3 pb-2">
                                        {(locale === "ja" ? ["ダッシュボード", "分析", "書き出し", "メンバー", "設定", "請求"] : ["Dashboard", "Analytics", "Exports", "Members", "Settings", "Billing"]).map((item) => (
                                            <div key={item} className="w-36 rounded-md border bg-muted/50 p-3 text-sm">{item}</div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ),
                        },
                        {
                            key: "both",
                            title: locale === "ja" ? "縦横スクロール" : "Both directions",
                            description: locale === "ja" ? "横幅も高さも制限した表やワークスペースを、縦横両方にスクロールできます。" : "Constrain both width and height for tables or workspaces that overflow in two directions.",
                            code: stateCodeByLocale[locale].both,
                            preview: (
                                <ScrollArea className="h-44 w-full max-w-xl rounded-md border bg-background" scrollbarOrientation="both">
                                    <table className="min-w-[760px] text-left text-sm">
                                        <thead className="bg-muted/60 text-muted-foreground">
                                            <tr>
                                                {wideTableColumns[locale].map((column) => (
                                                    <th key={column} className="px-3 py-2 font-medium">{column}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wideTableRows[locale].map((row) => (
                                                <tr key={row[0]} className="border-t">
                                                    {row.map((cell) => (
                                                        <td key={cell} className="px-3 py-2">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </ScrollArea>
                            ),
                        },
                        {
                            key: "always",
                            title: locale === "ja" ? "常時表示" : "Always visible",
                            description: locale === "ja" ? "スクロール可能であることを常に示したい場合に使います。" : "Keep the scrollbar visible when scrollability must be obvious.",
                            code: stateCodeByLocale[locale].always,
                            preview: (
                                <ScrollArea type="always" className="h-48 w-full max-w-sm rounded-md border bg-background p-4">
                                    {Array.from({ length: 12 }, (_, index) => (
                                        <p key={index} className="text-sm text-muted-foreground">{locale === "ja" ? `常時表示の行 ${index + 1}` : `Always visible row ${index + 1}`}</p>
                                    ))}
                                </ScrollArea>
                            ),
                        },
                    ].map((item) => (
                        <section key={item.key} className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <ComponentPreview code={item.code} codeBlock={<CodeBlock code={item.code} />} previewBodyWidth="lg" previewHeight={340}>
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
