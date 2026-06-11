"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import displayMetadata from "@design/display-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { Img } from "@gunjo/ui";

const sampleImage = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80";
const wideImage = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const usageCodeByLocale = {
    ja: `import { Img } from "@gunjo/ui";

export function ImgExample() {
  return (
    <div className="w-64 h-64">
      <Img
        src="${sampleImage}"
        alt="オフィスデスクの写真"
        aspectRatio="square"
        errorLabel="画像が見つかりません"
        loading="lazy"
      />
    </div>
  );
}`,
    en: `import { Img } from "@gunjo/ui";

export function ImgExample() {
  return (
    <div className="w-64 h-64">
      <Img 
        src="${sampleImage}" 
        alt="Office desk"
        aspectRatio="square"
        loading="lazy"
      />
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "src", type: "string", required: true, description: "画像の URL です。" },
        { name: "alt", type: "string", required: true, description: "画像の代替テキストです。" },
        { name: "aspectRatio", type: '"square" | "video" | "auto" | "portrait" | "wide"', default: '"auto"', description: "画像ラッパーのアスペクト比です。" },
        { name: "objectFit", type: '"cover" | "contain" | "fill" | "none" | "scale-down"', default: '"cover"', description: "画像の収め方です。" },
        { name: "loading", type: '"eager" | "lazy"', default: "browser default", description: "ブラウザ標準の画像読み込み方式です。ImagePreview からも渡されます。" },
        { name: "showSkeleton", type: "boolean", default: "true", description: "読み込み中にスケルトンを表示するかどうかです。" },
        { name: "errorLabel", type: "string", default: '"Image not found"', description: "標準の読み込み失敗表示に出すラベルです。" },
        { name: "fallback", type: "ReactNode", description: "読み込み失敗時に表示する任意の内容です。" },
    ],
    en: [
        { name: "src", type: "string", description: "Image source URL.", required: true },
        { name: "alt", type: "string", description: "Alternative text.", required: true },
        { name: "aspectRatio", type: '"square" | "video" | "auto" | "portrait" | "wide"', description: "Aspect ratio of the image wrapper.", default: '"auto"' },
        { name: "objectFit", type: '"cover" | "contain" | "fill" | "none" | "scale-down"', description: "CSS object-fit property.", default: '"cover"' },
        { name: "loading", type: '"eager" | "lazy"', description: "Native image loading behavior. ImagePreview forwards this to Img.", default: "browser default" },
        { name: "showSkeleton", type: "boolean", description: "Show skeleton loader while loading.", default: "true" },
        { name: "errorLabel", type: "string", description: "Label shown in the default error fallback.", default: '"Image not found"' },
        { name: "fallback", type: "React.ReactNode", description: "Custom fallback content on error." },
    ],
} as const;

export default function ImgDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/img", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.img.title;
    const description = content?.description ?? meta.img.description;
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Img", href: "/docs/components/img" },
            ]}
            relatedComponents={[
                { name: "ImagePreview", href: "/docs/components/image-preview" },
                { name: "AssetCard", href: "/docs/components/asset-card" },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewHeight="auto">
                <div className="w-64">
                    <Img
                        src={sampleImage}
                        alt={locale === "ja" ? "オフィスデスクの写真" : "Office desk"}
                        aspectRatio="square"
                        loading="lazy"
                        className="rounded-lg"
                    />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sample-image",
                            title: locale === "ja" ? "サンプル画像" : "Sample image",
                            description: locale === "ja"
                                ? "Img は画像そのものの読み込み、代替テキスト、比率、収め方を扱います。"
                                : "Img owns image loading, alternative text, aspect ratio, and object-fit behavior.",
                            preview: (
                                <div className="w-64 max-w-full">
                                    <Img
                                        src={sampleImage}
                                        alt={locale === "ja" ? "オフィスデスクの写真" : "Office desk"}
                                        aspectRatio="square"
                                        errorLabel={locale === "ja" ? "画像が見つかりません" : "Image not found"}
                                        loading="lazy"
                                        className="rounded-lg"
                                    />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: usageCode,
                        },
                        {
                            key: "contain",
                            title: locale === "ja" ? "全体を収める" : "Contain",
                            description: locale === "ja"
                                ? "バナーや横長画像の全体を見せたい時は objectFit=\"contain\" を指定します。"
                                : "Use objectFit=\"contain\" when a banner or wide image must remain fully visible.",
                            preview: (
                                <div className="w-80 max-w-full rounded-lg bg-muted/40 p-3">
                                    <Img
                                        src={wideImage}
                                        alt={locale === "ja" ? "山と湖の風景写真" : "Mountain landscape"}
                                        aspectRatio="wide"
                                        objectFit="contain"
                                        errorLabel={locale === "ja" ? "画像が見つかりません" : "Image not found"}
                                        loading="lazy"
                                        className="rounded-md bg-background"
                                    />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { Img } from "@gunjo/ui";

export function ContainImage() {
  return <Img src="/assets/banner.jpg" alt="横長の画像" aspectRatio="wide" objectFit="contain" />;
}`
                                : `import { Img } from "@gunjo/ui";

export function ContainImage() {
  return <Img src="/assets/banner.jpg" alt="Banner" aspectRatio="wide" objectFit="contain" />;
}`,
                        },
                        {
                            key: "error",
                            title: locale === "ja" ? "読み込み失敗" : "Load error",
                            description: locale === "ja"
                                ? "画像を読み込めない時は、fallback で代替表示を出します。"
                                : "When the image cannot load, fallback content is rendered.",
                            preview: (
                                <div className="w-64 max-w-full">
                                    <Img
                                        src=""
                                        alt={locale === "ja" ? "読み込み失敗のサンプル" : "Missing image sample"}
                                        aspectRatio="square"
                                        errorLabel={locale === "ja" ? "画像が見つかりません" : "Image not found"}
                                        className="rounded-lg"
                                    />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: locale === "ja"
                                ? `import { Img } from "@gunjo/ui";

export function ImageFallback() {
  return (
    <Img
      src=""
      alt="読み込み失敗のサンプル"
      errorLabel="画像が見つかりません"
    />
  );
}`
                                : `import { Img } from "@gunjo/ui";

export function ImageFallback() {
  return (
    <Img
      src=""
      alt="Missing image"
      errorLabel="Image not found"
    />
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
