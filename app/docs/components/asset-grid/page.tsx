"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { AssetGrid, type AssetCardAsset } from "@gunjo/ui";
import * as React from "react";

const assets: AssetCardAsset[] = [
    {
        id: "hero",
        title: "Campaign_Hero.jpg",
        src: "/patterns-thumbs/media-library.light.png",
        width: 1920,
        height: 1080,
        type: "JPG",
        size: "1.4MB",
        createdAt: "2026-05-12",
        isFavorite: true,
        rating: 4.5,
    },
    {
        id: "story",
        title: "Instagram_Story.png",
        src: "/patterns-thumbs/dashboard.light.png",
        width: 1080,
        height: 1920,
        type: "PNG",
        size: "2.1MB",
        createdAt: "2026-05-10",
        rating: 3.5,
    },
    {
        id: "square",
        title: "Product_Square.png",
        src: "/showcase-thumbs/blog.light.png",
        width: 1200,
        height: 1200,
        type: "PNG",
        size: "980KB",
        createdAt: "2026-05-09",
    },
];

const codeByLocale = {
    en: `import { AssetGrid } from "@gunjo/ui";

export function Example({ assets }) {
  return (
    <AssetGrid
      items={assets}
      selectedIds={["hero"]}
      layout="content"
      onSelect={(asset) => console.log(asset.id)}
    />
  );
}`,
    ja: `import { AssetGrid } from "@gunjo/ui";

export function Example({ assets }) {
  return (
    <AssetGrid
      items={assets}
      selectedIds={["hero"]}
      layout="content"
      onSelect={(asset) => console.log(asset.id)}
    />
  );
}`,
} as const;

const propsDataByLocale = {
    en: [
        { name: "items", type: "AssetCardAsset[]", description: "Ungrouped asset items." },
        { name: "groups", type: "AssetGridGroup[]", description: "Grouped asset sections. Takes precedence over items." },
        { name: "selectedIds", type: "Iterable<string>", description: "Selected asset ids." },
        { name: "layout", type: '"fill" | "content"', default: '"fill"', description: "Whether columns stretch to fill the container or keep content-width columns." },
        { name: "minColumnWidth", type: "number", default: "180", description: "Minimum column width for responsive auto-fit layout." },
        { name: "onSelect", type: "(asset) => void", description: "Called when an asset card is selected." },
        { name: "onPreview", type: "(asset) => void", description: "Passes a preview action to each AssetCard." },
        { name: "portalContainer", type: "HTMLElement | null", description: "Keeps card tooltips inside a framed pattern or nested preview surface." },
        { name: "renderItem", type: "(asset, state) => ReactNode", description: "Overrides the default AssetCard renderer." },
    ],
    ja: [
        { name: "items", type: "AssetCardAsset[]", description: "グループなしで表示するアセット項目です。" },
        { name: "groups", type: "AssetGridGroup[]", description: "グループ化したアセット一覧です。items より優先されます。" },
        { name: "selectedIds", type: "Iterable<string>", description: "選択中のアセット ID です。" },
        { name: "layout", type: '"fill" | "content"', default: '"fill"', description: "カラムをコンテナ幅いっぱいに広げるか、内容幅に収めるかを指定します。" },
        { name: "minColumnWidth", type: "number", default: "180", description: "自動配置されるカラムの最小幅です。" },
        { name: "onSelect", type: "(asset) => void", description: "アセットカード選択時に呼び出されます。" },
        { name: "onPreview", type: "(asset) => void", description: "各 AssetCard にプレビュー操作を渡します。" },
        { name: "portalContainer", type: "HTMLElement | null", description: "擬似ブラウザや入れ子のプレビュー内にカードのツールチップを閉じ込める表示先です。" },
        { name: "renderItem", type: "(asset, state) => ReactNode", description: "標準の AssetCard 表示を差し替えます。" },
    ],
} as const;

export default function AssetGridDocPage() {
    const [selectedId, setSelectedId] = React.useState("hero");
    const { locale, sectionLabels } = useLocale();
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return (
        <ComponentLayout
            title={meta.assetGrid.title}
            description={meta.assetGrid.description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "AssetCard", href: "/docs/components/asset-card" }]}
            relatedComponents={[
                { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
                { name: "MediaPickerDialog", href: "/docs/components/media-picker-dialog" },
                { name: "EmptyState", href: "/docs/components/empty-state" },
            ]}
        >
            <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="lg" previewHeight="auto">
                <AssetGrid
                    items={assets}
                    selectedIds={[selectedId]}
                    onSelect={(asset) => setSelectedId(asset.id)}
                    onPreview={(asset) => setSelectedId(asset.id)}
                    layout="content"
                    minColumnWidth={160}
                />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default-grid",
                            title: locale === "ja" ? "標準グリッド" : "Default grid",
                            description: locale === "ja"
                                ? "アセットカードをレスポンシブに並べ、選択中の ID を selectedIds で制御します。"
                                : "Render responsive asset cards and control selected items with selectedIds.",
                            preview: (
                                <AssetGrid
                                    items={assets}
                                    selectedIds={[selectedId]}
                                    onSelect={(asset) => setSelectedId(asset.id)}
                                    layout="content"
                                    minColumnWidth={150}
                                />
                            ),
                            previewHeight: "auto",
                            code: codeByLocale[locale],
                        },
                        {
                            key: "compact-grid",
                            title: locale === "ja" ? "コンパクトグリッド" : "Compact grid",
                            description: locale === "ja"
                                ? "小さいパネルやドロワーでは、カード間隔と情報密度を抑えた表示にします。"
                                : "Use the compact variant in smaller panels or drawers.",
                            preview: (
                                <AssetGrid
                                    items={assets}
                                    variant="compact"
                                    selectedIds={[selectedId]}
                                    onSelect={(asset) => setSelectedId(asset.id)}
                                    layout="content"
                                    minColumnWidth={120}
                                />
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { AssetGrid } from "@gunjo/ui";

export function CompactAssetGrid({ assets }) {
  return <AssetGrid items={assets} variant="compact" layout="content" minColumnWidth={120} />;
}`
                                : `import { AssetGrid } from "@gunjo/ui";

export function CompactAssetGrid({ assets }) {
  return <AssetGrid items={assets} variant="compact" layout="content" minColumnWidth={120} />;
}`,
                        },
                        {
                            key: "grouped-grid",
                            title: locale === "ja" ? "グループ表示" : "Grouped sections",
                            description: locale === "ja"
                                ? "フォルダやカテゴリ単位で、見出し付きの一覧に分けて表示します。"
                                : "Use groups when the grid needs section headings such as folders or categories.",
                            preview: (
                                <AssetGrid
                                    groups={[
                                        {
                                            id: "campaign",
                                            label: locale === "ja" ? "キャンペーン素材" : "Campaign assets",
                                            description: locale === "ja" ? "公開前の候補" : "Pre-launch candidates",
                                            items: assets,
                                        },
                                    ]}
                                    selectedIds={[selectedId]}
                                    onSelect={(asset) => setSelectedId(asset.id)}
                                    layout="content"
                                    minColumnWidth={140}
                                />
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { AssetGrid } from "@gunjo/ui";

export function GroupedAssetGrid({ assets }) {
  return (
    <AssetGrid
      layout="content"
      groups={[
        {
          id: "campaign",
          label: "キャンペーン素材",
          description: "公開前の候補",
          items: assets,
        },
      ]}
    />
  );
}`
                                : `import { AssetGrid } from "@gunjo/ui";

export function GroupedAssetGrid({ assets }) {
  return (
    <AssetGrid
      layout="content"
      groups={[
        {
          id: "campaign",
          label: "Campaign assets",
          description: "Pre-launch candidates",
          items: assets,
        },
      ]}
    />
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </div>
        </ComponentLayout>
    );
}
