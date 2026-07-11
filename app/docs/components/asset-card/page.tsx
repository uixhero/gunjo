"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { AssetCard } from "@gunjo/ui";
import * as React from "react";

const asset = {
    id: "hero",
    title: "Instagram_Story_v2.png",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80",
    width: 1920,
    height: 1080,
    type: "JPG",
    size: "1.4MB",
    createdAt: "2026-05-12",
    isFavorite: true,
    rating: 4.5,
};

const codeByLocale = {
    en: `import { AssetCard } from "@gunjo/ui";

const asset = {
  id: "hero",
  title: "Instagram_Story_v2.png",
  src: "/assets/campaign-hero.jpg",
  width: 1920,
  height: 1080,
  type: "JPG",
  size: "1.4MB",
  isFavorite: true,
  rating: 4.5,
};

export function Example() {
  return (
    <AssetCard
      asset={asset}
      selected
      onSelect={() => {}}
      onPreview={() => {}}
    />
  );
}`,
    ja: `import { AssetCard } from "@gunjo/ui";

const asset = {
  id: "hero",
  title: "Instagram_Story_v2.png",
  src: "/assets/campaign-hero.jpg",
  width: 1920,
  height: 1080,
  type: "JPG",
  size: "1.4MB",
  isFavorite: true,
  rating: 4.5,
};

export function Example() {
  return (
    <AssetCard
      asset={asset}
      selected
      onSelect={() => {}}
      onPreview={() => {}}
    />
  );
}`,
} as const;

const propsDataByLocale = {
    en: [
        { name: "asset", type: "AssetCardAsset", description: "The media item rendered by the card.", required: true },
        { name: "selected", type: "boolean", description: "Applies the selected border and ring." },
        { name: "selectionMode", type: "\"single\" | \"multiple\" | \"none\"", default: "\"single\"", description: "Controls whether a selection indicator is shown." },
        { name: "imageFit", type: "\"cover\" | \"contain\"", default: "\"cover\"", description: "Controls whether the image fills the card surface or is contained for full-asset inspection." },
        { name: "asset.rating", type: "number", description: "Optional 0-5 half-step rating value used by media workflows and inspector editing." },
        { name: "asset.score", type: "string | number", description: "Legacy fallback value. Prefer asset.rating for media library rating display." },
        { name: "noImageLabel", type: "string", default: "\"Preview image not found\"", description: "Label forwarded to ImagePreview when the asset has no preview image." },
        { name: "onSelect", type: "(asset) => void", description: "Called when the card is clicked or activated with the keyboard." },
        { name: "onPreview", type: "(asset) => void", description: "Adds a preview action button in the image area." },
        { name: "portalContainer", type: "HTMLElement | null", description: "Keeps tooltips inside a framed pattern or nested preview surface." },
        { name: "renderMeta", type: "(asset) => ReactNode", description: "Overrides the default dimensions / type / date metadata row. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Render props return JSX (no serializable alternative) — wrap in a \"use client\" component to pass from an RSC. (#338)" },
    ],
    ja: [
        { name: "asset", type: "AssetCardAsset", description: "カードに表示するメディア項目です。", required: true },
        { name: "selected", type: "boolean", description: "選択中の枠線とリングを表示します。" },
        { name: "selectionMode", type: "\"single\" | \"multiple\" | \"none\"", default: "\"single\"", description: "選択インジケータの表示方法を指定します。" },
        { name: "imageFit", type: "\"cover\" | \"contain\"", default: "\"cover\"", description: "画像面を枠いっぱいに見せるか、全体確認用に収めるかを指定します。" },
        { name: "asset.rating", type: "number", description: "メディアワークフローとインスペクター編集で使う任意の 0-5 点評価です。" },
        { name: "asset.score", type: "string | number", description: "旧形式の代替表示です。メディアライブラリの評価表示には asset.rating を優先します。" },
        { name: "noImageLabel", type: "string", default: "\"Preview image not found\"", description: "プレビュー画像がないアセットで ImagePreview に渡すラベルです。" },
        { name: "onSelect", type: "(asset) => void", description: "カードクリック、またはキーボード操作時に呼び出されます。" },
        { name: "onPreview", type: "(asset) => void", description: "画像エリアにプレビュー操作ボタンを追加します。" },
        { name: "portalContainer", type: "HTMLElement | null", description: "擬似ブラウザや入れ子のプレビュー内にツールチップを閉じ込める表示先です。" },
        { name: "renderMeta", type: "(asset) => ReactNode", description: "寸法・形式・日付のメタ情報行を差し替えます。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。JSX を返すため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" },
    ],
} as const;

export default function AssetCardDocPage() {
    const [selected, setSelected] = React.useState(true);
    const { locale, sectionLabels } = useLocale();
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return (
        <ComponentLayout
            title={meta.assetCard.title}
            description={meta.assetCard.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
                { name: "MediaLightbox", href: "/docs/components/media-lightbox" },
                { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
            ]}
        >
            <ComponentPreview
                code={codeByLocale[locale]}
                codeBlock={<CodeBlock code={codeByLocale[locale]} />}
                previewBodyWidth="sm"
                previewHeight="auto"
            >
                <AssetCard
                    asset={asset}
                    selected={selected}
                    className="w-80 max-w-full"
                    previewLabel={locale === "ja" ? "拡大表示" : "Open preview"}
                    favoriteLabel={locale === "ja" ? "お気に入りに追加" : "Add to favorites"}
                    unfavoriteLabel={locale === "ja" ? "お気に入りを解除" : "Remove from favorites"}
                    ratingLabel={locale === "ja" ? "評価" : "Rating"}
                    onSelect={() => setSelected((value) => !value)}
                    onPreview={() => setSelected(true)}
                />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "selected",
                            title: locale === "ja" ? "選択中" : "Selected",
                            description: locale === "ja"
                                ? "選択中のアセットは枠線、リング、チェックで示し、クリックまたはキーボード操作で切り替えます。"
                                : "Selected assets use a border, ring, and check indicator. Selection can be toggled by click or keyboard.",
                            preview: (
                                <AssetCard
                                    asset={asset}
                                    selected
                                    className="w-72 max-w-full"
                                    ratingLabel={locale === "ja" ? "評価" : "Rating"}
                                    onSelect={() => {}}
                                    onPreview={() => {}}
                                />
                            ),
                            previewHeight: "auto",
                            code: codeByLocale[locale],
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "サイドパネルや小さいグリッドでは、compact variant で余白と文字サイズを抑えます。"
                                : "Use the compact variant in side panels or tighter grids.",
                            preview: (
                                <AssetCard
                                    asset={{ ...asset, title: "thumbnail_square.png", rating: undefined }}
                                    variant="compact"
                                    className="w-52 max-w-full"
                                    onSelect={() => {}}
                                />
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { AssetCard } from "@gunjo/ui";

export function CompactAssetCard({ asset }) {
  return <AssetCard asset={asset} variant="compact" onSelect={() => {}} />;
}`
                                : `import { AssetCard } from "@gunjo/ui";

export function CompactAssetCard({ asset }) {
  return <AssetCard asset={asset} variant="compact" onSelect={() => {}} />;
}`,
                        },
                        {
                            key: "contain-fit",
                            title: locale === "ja" ? "全体確認" : "Contain fit",
                            description: locale === "ja"
                                ? "標準は画像面を枠いっぱいに見せます。バナーや縦長素材の全体を確認したい時は imageFit=\"contain\" を使います。"
                                : "The default fills the image surface. Use imageFit=\"contain\" when banners or portrait assets need full-asset inspection.",
                            preview: (
                                <AssetCard
                                    asset={{ ...asset, title: "full_asset_preview.jpg", width: 1920, height: 600 }}
                                    imageFit="contain"
                                    className="w-72 max-w-full"
                                    onSelect={() => {}}
                                />
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { AssetCard } from "@gunjo/ui";

export function FullAssetCard({ asset }) {
  return <AssetCard asset={asset} imageFit="contain" onSelect={() => {}} />;
}`
                                : `import { AssetCard } from "@gunjo/ui";

export function FullAssetCard({ asset }) {
  return <AssetCard asset={asset} imageFit="contain" onSelect={() => {}} />;
}`,
                        },
                        {
                            key: "empty-media",
                            title: locale === "ja" ? "画像なし" : "Without image",
                            description: locale === "ja"
                                ? "画像がないアセットでも、形式やタイトルで内容が判断できるようにします。"
                                : "When an asset has no image, the card still exposes type and title.",
                            preview: (
                                <AssetCard
                                    asset={{
                                        ...asset,
                                        src: undefined,
                                        title: "brief_document.pdf",
                                        type: "PDF",
                                        rating: undefined,
                                    }}
                                    className="w-72 max-w-full"
                                    noImageLabel={locale === "ja" ? "プレビュー画像がありません" : "No preview image"}
                                    onSelect={() => {}}
                                />
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { AssetCard } from "@gunjo/ui";

export function FileAssetCard() {
  return (
    <AssetCard
      asset={{ id: "brief", title: "brief_document.pdf", type: "PDF" }}
      onSelect={() => {}}
    />
  );
}`
                                : `import { AssetCard } from "@gunjo/ui";

export function FileAssetCard() {
  return (
    <AssetCard
      asset={{ id: "brief", title: "brief_document.pdf", type: "PDF" }}
      onSelect={() => {}}
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
