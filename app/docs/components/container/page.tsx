"use client";

import { Container } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const sizes = ["sm", "md", "lg", "xl", "2xl", "full", "prose"] as const;

const codeByLocale = {
    en: `import { Container } from "@gunjo/ui";

const sizes = ["sm", "md", "lg", "xl", "2xl", "full", "prose"] as const;

export function ContainerSizePreview() {
  return (
    <div className="w-full space-y-3">
      {sizes.map((size) => (
        <Container
          key={size}
          size={size}
          className="rounded-md border border-dashed bg-muted/50 py-3 text-center text-sm text-muted-foreground"
        >
          size=&quot;{size}&quot;
        </Container>
      ))}
    </div>
  );
}`,
    ja: `import { Container } from "@gunjo/ui";

const sizes = ["sm", "md", "lg", "xl", "2xl", "full", "prose"] as const;

export function ContainerSizePreview() {
  return (
    <div className="w-full space-y-3">
      {sizes.map((size) => (
        <Container
          key={size}
          size={size}
          className="rounded-md border border-dashed bg-muted/50 py-3 text-center text-sm text-muted-foreground"
        >
          size=&quot;{size}&quot;
        </Container>
      ))}
    </div>
  );
}`,
} as const;

const proseCodeByLocale = {
    en: `<Container size="prose" className="space-y-2 rounded-md border bg-background p-4">
  <h3 className="font-semibold">Readable article content</h3>
  <p className="text-sm text-muted-foreground">
    Long-form text stays narrower than dashboard surfaces.
  </p>
</Container>`,
    ja: `<Container size="prose" className="space-y-2 rounded-md border bg-background p-4">
  <h3 className="font-semibold">読みやすい本文</h3>
  <p className="text-sm text-muted-foreground">
    長文は広げすぎず、本文として読みやすい横幅に保ちます。
  </p>
</Container>`,
} as const;

const sectionCodeByLocale = {
    en: `<Container as="section" size="lg" className="space-y-2 rounded-md border bg-background p-4">
  <h3 className="font-semibold">Release notes</h3>
  <p className="text-sm text-muted-foreground">
    Use a section-width container for standard documentation blocks.
  </p>
</Container>`,
    ja: `<Container as="section" size="lg" className="space-y-2 rounded-md border bg-background p-4">
  <h3 className="font-semibold">リリースノート</h3>
  <p className="text-sm text-muted-foreground">
    標準的なドキュメントブロックには、セクション幅のコンテナを使います。
  </p>
</Container>`,
} as const;

const fullCodeByLocale = {
    en: `<Container size="full" className="rounded-md border bg-muted/40 py-5 text-center text-sm text-muted-foreground">
  App surface or horizontally rich area
</Container>`,
    ja: `<Container size="full" className="rounded-md border bg-muted/40 py-5 text-center text-sm text-muted-foreground">
  アプリ面や横スクロール可能な領域
</Container>`,
} as const;

export default function ContainerPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full" | "prose"', default: '"lg"', description: "コンテンツの最大幅です。本文には prose、画面全体には full を使います。" },
            { name: "as", type: "keyof JSX.IntrinsicElements", default: '"div"', description: "描画する HTML 要素です。main、section、article などを指定できます。" },
            { name: "className", type: "string", description: "追加の className です。" },
        ]
        : [
            { name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full" | "prose"', default: '"lg"', description: "Maximum content width. Use prose for articles and full for app surfaces." },
            { name: "as", type: "keyof JSX.IntrinsicElements", default: '"div"', description: "HTML element to render, such as main, section, or article." },
            { name: "className", type: "string", description: "Additional class names." },
        ];

    return (
        <ComponentLayout
            title={meta.container.title}
            description={meta.container.description}
            usedComponents={[{ name: "Container", href: "/docs/components/container" }]}
            relatedComponents={[
                { name: "Grid", href: "/docs/components/grid" },
                { name: "Cluster", href: "/docs/components/cluster" },
                { name: "HStack", href: "/docs/components/h-stack" },
                { name: "VStack", href: "/docs/components/v-stack" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/container" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="full">
                <div className="w-full space-y-3">
                    {sizes.map((size) => (
                        <Container key={size} size={size} className="rounded-md border border-dashed bg-muted/50 py-3 text-center text-sm text-muted-foreground">
                            size=&quot;{size}&quot;
                        </Container>
                    ))}
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
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "サイズ展開" : "Size scale"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "sm から full / prose まで、Container が持つ最大幅の違いを確認します。" : "Compare every Container max-width option from sm through full and prose."}
                            </p>
                        </div>
                        <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="full" previewHeight="auto">
                            <div className="w-full space-y-3">
                                {sizes.map((size) => (
                                    <Container key={size} size={size} className="rounded-md border border-dashed bg-muted/50 py-3 text-center text-sm text-muted-foreground">
                                        size=&quot;{size}&quot;
                                    </Container>
                                ))}
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "本文幅" : "Prose width"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "長文は広げすぎず、本文として読みやすい横幅に保ちます。" : "Keep long-form content narrow enough to read comfortably."}
                            </p>
                        </div>
                        <ComponentPreview code={proseCodeByLocale[locale]} codeBlock={<CodeBlock code={proseCodeByLocale[locale]} />} previewBodyWidth="lg" previewHeight="auto">
                            <Container size="prose" className="space-y-2 rounded-md border bg-background p-4">
                                <h3 className="font-semibold">{locale === "ja" ? "読みやすい本文" : "Readable article content"}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {locale === "ja" ? "長文は広げすぎず、本文として読みやすい横幅に保ちます。" : "Long-form text stays narrower than dashboard surfaces."}
                                </p>
                            </Container>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "セクション幅" : "Section width"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "ドキュメントや通常ページの主要セクションに使う標準幅です。" : "Use this width for primary sections in docs or standard pages."}
                            </p>
                        </div>
                        <ComponentPreview code={sectionCodeByLocale[locale]} codeBlock={<CodeBlock code={sectionCodeByLocale[locale]} />} previewBodyWidth="lg" previewHeight="auto">
                            <Container as="section" size="lg" className="space-y-2 rounded-md border bg-background p-4">
                                <h3 className="font-semibold">{locale === "ja" ? "リリースノート" : "Release notes"}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {locale === "ja" ? "標準的なドキュメントブロックには、セクション幅のコンテナを使います。" : "Use a section-width container for standard documentation blocks."}
                                </p>
                            </Container>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "全幅" : "Full width"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "アプリ面や横方向の情報量が多い領域では、親幅いっぱいに広げます。" : "Let app surfaces and horizontally rich areas fill the parent width."}
                            </p>
                        </div>
                        <ComponentPreview code={fullCodeByLocale[locale]} codeBlock={<CodeBlock code={fullCodeByLocale[locale]} />} previewBodyWidth="lg" previewHeight="auto">
                            <Container size="full" className="rounded-md border bg-muted/40 py-5 text-center text-sm text-muted-foreground">
                                {locale === "ja" ? "アプリ面や横スクロール可能な領域" : "App surface or horizontally rich area"}
                            </Container>
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
