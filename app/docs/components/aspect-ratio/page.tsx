"use client";

import { AspectRatio } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const codeByLocale = {
    en: `import { AspectRatio } from "@gunjo/ui";

const assets = [
  { label: "Hero video", ratio: 16 / 9, tone: "bg-primary-subtle" },
  { label: "Article image", ratio: 4 / 3, tone: "bg-success-subtle" },
  { label: "Avatar crop", ratio: 1, tone: "bg-warning-subtle" },
];

export function AspectRatioExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {assets.map((asset) => (
        <div key={asset.label} className="space-y-2">
          <AspectRatio
            ratio={asset.ratio}
            className={\`grid place-items-center rounded-md border \${asset.tone}\`}
          >
            <span className="text-sm font-medium">{asset.label}</span>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}`,
    ja: `import { AspectRatio } from "@gunjo/ui";

const assets = [
  { label: "ヒーロー動画", ratio: 16 / 9, tone: "bg-primary-subtle" },
  { label: "記事画像", ratio: 4 / 3, tone: "bg-success-subtle" },
  { label: "アバター切り抜き", ratio: 1, tone: "bg-warning-subtle" },
];

export function AspectRatioExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {assets.map((asset) => (
        <div key={asset.label} className="space-y-2">
          <AspectRatio
            ratio={asset.ratio}
            className={\`grid place-items-center rounded-md border \${asset.tone}\`}
          >
            <span className="text-sm font-medium">{asset.label}</span>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { AspectRatio } from "@gunjo/ui";

export function MediaCard() {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border">
      <img
        src="/example.jpg"
        alt="Dashboard preview"
        className="h-full w-full object-cover"
      />
    </AspectRatio>
  );
}`,
    ja: `import { AspectRatio } from "@gunjo/ui";

export function MediaCard() {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border">
      <img
        src="/example.jpg"
        alt="ダッシュボードのプレビュー"
        className="h-full w-full object-cover"
      />
    </AspectRatio>
  );
}`,
} as const;

const variantCodeByLocale = {
    en: {
        video: `<AspectRatio ratio={16 / 9} className="grid place-items-center rounded-md border bg-primary-subtle">
  <span className="text-sm font-medium">16:9 hero video</span>
</AspectRatio>`,
        photo: `<AspectRatio ratio={4 / 3} className="grid place-items-center rounded-md border bg-success-subtle">
  <span className="text-sm font-medium">4:3 article image</span>
</AspectRatio>`,
        square: `<AspectRatio ratio={1} className="grid place-items-center rounded-md border bg-warning-subtle">
  <span className="text-sm font-medium">1:1 avatar crop</span>
</AspectRatio>`,
        portrait: `<AspectRatio ratio={3 / 4} className="grid place-items-center rounded-md border bg-muted/70">
  <span className="text-sm font-medium">3:4 portrait card</span>
</AspectRatio>`,
    },
    ja: {
        video: `<AspectRatio ratio={16 / 9} className="grid place-items-center rounded-md border bg-primary-subtle">
  <span className="text-sm font-medium">16:9 ヒーロー動画</span>
</AspectRatio>`,
        photo: `<AspectRatio ratio={4 / 3} className="grid place-items-center rounded-md border bg-success-subtle">
  <span className="text-sm font-medium">4:3 記事画像</span>
</AspectRatio>`,
        square: `<AspectRatio ratio={1} className="grid place-items-center rounded-md border bg-warning-subtle">
  <span className="text-sm font-medium">1:1 アバター切り抜き</span>
</AspectRatio>`,
        portrait: `<AspectRatio ratio={3 / 4} className="grid place-items-center rounded-md border bg-muted/70">
  <span className="text-sm font-medium">3:4 縦長カード</span>
</AspectRatio>`,
    },
} as const;

function RatioBlock({ label, ratio, className }: { label: string; ratio: number; className: string }) {
    return (
        <div className="w-full min-w-0 space-y-2">
            <AspectRatio ratio={ratio} className={`grid place-items-center rounded-md border ${className}`}>
                <span className="px-2 text-center text-sm font-medium">{label}</span>
            </AspectRatio>
        </div>
    );
}

export default function AspectRatioPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "ratio", type: "number", default: "1", description: "横幅を高さで割った比率です。16 / 9、4 / 3、1 などを指定します。" },
            { name: "asChild", type: "boolean", default: "false", description: "子要素へ props を渡して、div ではなく任意の要素として描画します。" },
            { name: "children", type: "ReactNode", description: "比率を保つ領域の中に表示する画像、動画、iframe、プレースホルダーです。" },
        ]
        : [
            { name: "ratio", type: "number", default: "1", description: "Width divided by height, such as 16 / 9, 4 / 3, or 1." },
            { name: "asChild", type: "boolean", default: "false", description: "Forwards props to a child element instead of rendering a div." },
            { name: "children", type: "ReactNode", description: "Image, video, iframe, or placeholder content inside the fixed-ratio area." },
        ];

    return (
        <ComponentLayout
            title={meta.aspectRatio.title}
            description={meta.aspectRatio.description}
            usedComponents={[{ name: "AspectRatio", href: "/docs/components/aspect-ratio" }]}
            relatedComponents={[
                { name: "Img", href: "/docs/components/img" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
                { name: "Card", href: "/docs/components/card" },
                { name: "DeviceFrame", href: "/docs/components/device-frame" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/aspect-ratio" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="lg">
                <div className="grid w-full gap-4 sm:grid-cols-3">
                    <RatioBlock label={locale === "ja" ? "ヒーロー動画" : "Hero video"} ratio={16 / 9} className="bg-primary-subtle" />
                    <RatioBlock label={locale === "ja" ? "記事画像" : "Article image"} ratio={4 / 3} className="bg-success-subtle" />
                    <RatioBlock label={locale === "ja" ? "アバター切り抜き" : "Avatar crop"} ratio={1} className="bg-warning-subtle" />
                </div>
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
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "ヒーロー動画" : "Hero video"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "動画、ヒーロー、横長のメディアに使う 16:9 の比率です。" : "Use 16:9 for videos, heroes, and wide media."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={variantCodeByLocale[locale].video}
                            codeBlock={<CodeBlock code={variantCodeByLocale[locale].video} />}
                            previewBodyWidth="md"
                            previewHeight="auto"
                        >
                            <div className="w-full max-w-md">
                                <RatioBlock label={locale === "ja" ? "16:9 ヒーロー動画" : "16:9 hero video"} ratio={16 / 9} className="bg-primary-subtle" />
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "記事画像" : "Article image"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "記事サムネイルや標準的な写真枠に使う 4:3 の比率です。" : "Use 4:3 for article thumbnails and classic image frames."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={variantCodeByLocale[locale].photo}
                            codeBlock={<CodeBlock code={variantCodeByLocale[locale].photo} />}
                            previewBodyWidth="md"
                            previewHeight="auto"
                        >
                            <div className="w-full max-w-sm">
                                <RatioBlock label={locale === "ja" ? "4:3 記事画像" : "4:3 article image"} ratio={4 / 3} className="bg-success-subtle" />
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "正方形" : "Square"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "アバター、ロゴ、正方形カードに使う 1:1 の比率です。" : "Use 1:1 for avatars, logos, and square cards."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={variantCodeByLocale[locale].square}
                            codeBlock={<CodeBlock code={variantCodeByLocale[locale].square} />}
                            previewBodyWidth="sm"
                            previewHeight="auto"
                        >
                            <div className="w-full max-w-56">
                                <RatioBlock label={locale === "ja" ? "1:1 アバター切り抜き" : "1:1 avatar crop"} ratio={1} className="bg-warning-subtle" />
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "縦長" : "Portrait"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "ポスター、縦長カード、人物写真に使う 3:4 の比率です。" : "Use 3:4 for posters, portrait cards, and people photography."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={variantCodeByLocale[locale].portrait}
                            codeBlock={<CodeBlock code={variantCodeByLocale[locale].portrait} />}
                            previewBodyWidth="sm"
                            previewHeight="auto"
                        >
                            <div className="w-full max-w-48">
                                <RatioBlock label={locale === "ja" ? "3:4 縦長カード" : "3:4 portrait card"} ratio={3 / 4} className="bg-muted/70" />
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
                    <CodeCopyButton code={usageCodeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCodeByLocale[locale]} />
                </div>
            </section>
        </ComponentLayout>
    );
}
