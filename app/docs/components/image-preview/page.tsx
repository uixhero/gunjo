"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ImagePreview } from "@gunjo/ui";

const imageSrc = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80";
const bannerSrc = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const codeByLocale = {
    en: `import { ImagePreview } from "@gunjo/ui";

export function Example() {
  return (
    <ImagePreview
      src="/assets/campaign-hero.jpg"
      alt="Campaign hero"
      loading="lazy"
      onPreview={() => {}}
    />
  );
}`,
    ja: `import { ImagePreview } from "@gunjo/ui";

export function Example() {
  return (
    <ImagePreview
      src="/assets/campaign-hero.jpg"
      alt="キャンペーン画像"
      loading="lazy"
      onPreview={() => {}}
      previewLabel="拡大表示"
    />
  );
}`,
} as const;

const propsDataByLocale = {
    en: [
        { name: "src", type: "string", description: "Image source URL." },
        { name: "alt", type: "string", description: "Alternative text for the image." },
        { name: "variant", type: "\"default\" | \"contain\" | \"empty\"", default: "\"default\"", description: "Sets the preview surface intent." },
        { name: "aspectRatio", type: "\"square\" | \"video\" | \"auto\" | \"portrait\" | \"wide\"", default: "\"square\"", description: "Aspect ratio passed to Img." },
        { name: "objectFit", type: "Img objectFit", description: "Overrides the image fit. Defaults to cover, or contain for the contain variant." },
        { name: "loading", type: "\"eager\" | \"lazy\"", default: "\"lazy\"", description: "Image loading behavior forwarded to Img. Use eager for above-the-fold hero previews." },
        { name: "noImageLabel", type: "string", default: "\"Image not found\"", description: "Label shown in the standard no-image placeholder when src is missing or fails to load." },
        { name: "onPreview", type: "() => void", description: "Shows the preview affordance and calls the handler when activated." },
        { name: "portalContainer", type: "HTMLElement | null", description: "Keeps the preview button tooltip inside a framed pattern or nested preview surface." },
        { name: "children", type: "ReactNode", description: "Overlay slot for badges, selection indicators, or favorite actions." },
    ],
    ja: [
        { name: "src", type: "string", description: "画像の URL です。" },
        { name: "alt", type: "string", description: "画像の代替テキストです。" },
        { name: "variant", type: "\"default\" | \"contain\" | \"empty\"", default: "\"default\"", description: "画像プレビュー面の用途を指定します。" },
        { name: "aspectRatio", type: "\"square\" | \"video\" | \"auto\" | \"portrait\" | \"wide\"", default: "\"square\"", description: "Img に渡すアスペクト比です。" },
        { name: "objectFit", type: "Img objectFit", description: "画像の収め方を上書きします。標準は cover、contain variant では contain です。" },
        { name: "loading", type: "\"eager\" | \"lazy\"", default: "\"lazy\"", description: "Img に渡す画像読み込み方式です。ファーストビューの大きなプレビューでは eager を指定できます。" },
        { name: "noImageLabel", type: "string", default: "\"Image not found\"", description: "src がない時や読み込みに失敗した時に、標準の no image プレースホルダーへ表示するラベルです。" },
        { name: "onPreview", type: "() => void", description: "拡大表示ボタンを表示し、押した時に呼び出されます。" },
        { name: "portalContainer", type: "HTMLElement | null", description: "擬似ブラウザや入れ子のプレビュー内にツールチップを閉じ込める表示先です。" },
        { name: "children", type: "ReactNode", description: "バッジ、選択表示、お気に入り操作などを重ねるためのスロットです。" },
    ],
} as const;

export default function ImagePreviewDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/image-preview", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.imagePreview.title;
    const description = content?.description ?? meta.imagePreview.description;

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Img", href: "/docs/components/img" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "AssetCard", href: "/docs/components/asset-card" },
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
                { name: "MediaLightbox", href: "/docs/components/media-lightbox" },
            ]}
        >
            <ComponentPreview
                code={codeByLocale[locale]}
                codeBlock={<CodeBlock code={codeByLocale[locale]} />}
                previewBodyWidth="sm"
                previewHeight="auto"
            >
                <ImagePreview
                    src={imageSrc}
                    alt={locale === "ja" ? "作業机の写真" : "Workspace photo"}
                    className="w-80 max-w-full rounded-lg"
                    previewLabel={locale === "ja" ? "拡大表示" : "Open preview"}
                    onPreview={() => {}}
                />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "cover",
                            title: locale === "ja" ? "枠いっぱい" : "Cover",
                            description: locale === "ja"
                                ? "カードの画像面では、標準で画像を枠いっぱいに見せます。"
                                : "The default fills the preview surface for card image areas.",
                            preview: (
                                <ImagePreview
                                    src={imageSrc}
                                    alt={locale === "ja" ? "作業机の写真" : "Workspace photo"}
                                    className="w-72 max-w-full rounded-lg"
                                    previewLabel={locale === "ja" ? "拡大表示" : "Open preview"}
                                    onPreview={() => {}}
                                />
                            ),
                            previewHeight: "auto",
                            code: codeByLocale[locale],
                        },
                        {
                            key: "contain",
                            title: locale === "ja" ? "全体を収める" : "Contain",
                            description: locale === "ja"
                                ? "バナーや縦長素材の確認では、素材全体を収めて表示します。"
                                : "Use contain when banners or portrait assets need full-asset inspection.",
                            preview: (
                                <ImagePreview
                                    src={bannerSrc}
                                    alt={locale === "ja" ? "横長バナー" : "Wide banner"}
                                    variant="contain"
                                    aspectRatio="wide"
                                    className="w-80 max-w-full rounded-lg"
                                    previewLabel={locale === "ja" ? "拡大表示" : "Open preview"}
                                    onPreview={() => {}}
                                />
                            ),
                            previewHeight: "auto",
                            code: `import { ImagePreview } from "@gunjo/ui";

export function ContainImagePreview() {
  return <ImagePreview src="/assets/banner.jpg" alt="Banner" variant="contain" aspectRatio="wide" />;
}`,
                        },
                        {
                            key: "empty",
                            title: locale === "ja" ? "画像なし" : "Empty",
                            description: locale === "ja"
                                ? "画像がない場合は、フォールバック表示でプレビュー面のサイズを維持します。"
                                : "When no image is available, fallback content keeps the preview surface stable.",
                            preview: (
                                <ImagePreview
                                    alt={locale === "ja" ? "未設定の画像" : "Unset image"}
                                    noImageLabel={locale === "ja" ? "画像が見つかりません" : "Image not found"}
                                    className="w-64 max-w-full rounded-lg"
                                />
                            ),
                            previewHeight: "auto",
                            code: `import { ImagePreview } from "@gunjo/ui";

export function EmptyImagePreview() {
  return <ImagePreview alt="Image not found" noImageLabel="Image not found" />;
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </div>
        </ComponentLayout>
    );
}
