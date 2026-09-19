"use client";

import { BlogTemplate } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { BlogTemplateDemo } from "@/components/demos/BlogTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

export default function BlogTemplatePage() {
    const { locale } = useLocale();

    const code = `import { BlogTemplate } from "@gunjo/ui";

export function Post() {
    return (
        <BlogTemplate
            category="Engineering"
            title="..."
            meta="By Alice · 5 min read"
            hero={<img src="..." />}
        >
            <p>Article body...</p>
        </BlogTemplate>
    );
}`;

    const usageCode = `import { BlogTemplate } from "@gunjo/ui"

<BlogTemplate title="..." meta="...">{children}</BlogTemplate>`;

    const propsData = [
        { name: "category", type: "ReactNode", description: "Category label above the title (e.g. 'Engineering')." },
        { name: "title", type: "ReactNode", description: "Article title (h1)." },
        { name: "meta", type: "ReactNode", description: "Author / read time / date row." },
        { name: "hero", type: "ReactNode", description: "Optional hero media block (image, video)." },
        { name: "children", type: "ReactNode", description: "Article body. Wrapped in `prose` for typography styling." },
    ];

    const body = locale === "ja"
        ? (
            <p>
                設計の土台をひとつに決めておくと、画面が増えても言葉と部品がぶれません。
                この記事では、決め方と、決めたあとに何を機械で守るかを書きます。
            </p>
        )
        : (
            <p>
                Deciding on a single source of truth keeps wording and parts steady as screens
                multiply. This post covers how to pick one, and what to enforce automatically afterwards.
            </p>
        );

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).blogTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).blogTemplate.description}
            usedComponents={[
                { name: "BlogTemplate", href: "/docs/components/blog" },
            ]}
            relatedComponents={[
                { name: "DocsTemplate", href: "/docs/components/docs" },
                { name: "LandingTemplate", href: "/docs/components/landing" },
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
                { name: "PageHeader", href: "/docs/components/page-header" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/blog" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <BlogTemplateDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "title だけが必須で、category・meta・hero は省略できます。省いた分だけ本文が上に詰まるので、記事の重さに合わせて足し引きします。"
                        : "Only title is required; category, meta, and hero are all optional. The body moves up as you drop them, so add only what the article needs."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-hero",
                            title: locale === "ja" ? "hero つき" : "With hero",
                            description: locale === "ja"
                                ? "全部の口を埋めた形です。hero には画像でも動画でも、任意のノードを置けます。"
                                : "Every slot filled. The hero slot takes any node — an image, a video, or a coloured block.",
                            preview: (
                                <BlogTemplate
                                    category={locale === "ja" ? "設計" : "Engineering"}
                                    title={locale === "ja" ? "設計の土台をひとつに決める" : "Building a SSOT-driven design system"}
                                    meta={locale === "ja" ? "田中 美咲 / 5分で読めます" : "By Misaki Tanaka · 5 min read"}
                                    hero={
                                        <div className="flex h-32 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                                            {locale === "ja" ? "見出し画像" : "hero image"}
                                        </div>
                                    }
                                >
                                    {body}
                                </BlogTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { BlogTemplate } from "@gunjo/ui";

export function PostWithHero() {
  return (
    <BlogTemplate
      category="設計"
      title="設計の土台をひとつに決める"
      meta="田中 美咲 / 5分で読めます"
      hero={
        <div className="flex h-32 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          見出し画像
        </div>
      }
    >
      <p>設計の土台をひとつに決めておくと、画面が増えても言葉と部品がぶれません。</p>
    </BlogTemplate>
  );
}`
                                : `import { BlogTemplate } from "@gunjo/ui";

export function PostWithHero() {
  return (
    <BlogTemplate
      category="Engineering"
      title="Building a SSOT-driven design system"
      meta="By Misaki Tanaka · 5 min read"
      hero={
        <div className="flex h-32 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          hero image
        </div>
      }
    >
      <p>Deciding on a single source of truth keeps wording and parts steady as screens multiply.</p>
    </BlogTemplate>
  );
}`,
                        },
                        {
                            key: "without-hero",
                            title: locale === "ja" ? "hero 無し" : "Without hero",
                            description: locale === "ja"
                                ? "hero を省くと、見出しのすぐ下から本文が始まります。図が要らない短い記事はこちらです。"
                                : "Drop the hero and the body starts right under the heading. This suits short posts that do not need an image.",
                            preview: (
                                <BlogTemplate
                                    category={locale === "ja" ? "設計" : "Engineering"}
                                    title={locale === "ja" ? "設計の土台をひとつに決める" : "Building a SSOT-driven design system"}
                                    meta={locale === "ja" ? "田中 美咲 / 5分で読めます" : "By Misaki Tanaka · 5 min read"}
                                >
                                    {body}
                                </BlogTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { BlogTemplate } from "@gunjo/ui";

export function PostWithoutHero() {
  return (
    <BlogTemplate
      category="設計"
      title="設計の土台をひとつに決める"
      meta="田中 美咲 / 5分で読めます"
    >
      <p>設計の土台をひとつに決めておくと、画面が増えても言葉と部品がぶれません。</p>
    </BlogTemplate>
  );
}`
                                : `import { BlogTemplate } from "@gunjo/ui";

export function PostWithoutHero() {
  return (
    <BlogTemplate
      category="Engineering"
      title="Building a SSOT-driven design system"
      meta="By Misaki Tanaka · 5 min read"
    >
      <p>Deciding on a single source of truth keeps wording and parts steady as screens multiply.</p>
    </BlogTemplate>
  );
}`,
                        },
                        {
                            key: "title-only",
                            title: locale === "ja" ? "title だけ" : "Title only",
                            description: locale === "ja"
                                ? "category と meta も省いた最小の形です。お知らせや規約のように、書き手や分類を出さない文書に使います。"
                                : "The smallest form, with category and meta dropped too. Use it for notices or policies, where an author and a category would only add noise.",
                            preview: (
                                <BlogTemplate title={locale === "ja" ? "利用規約の改定について" : "Changes to our terms of service"}>
                                    {body}
                                </BlogTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { BlogTemplate } from "@gunjo/ui";

export function NoticePost() {
  return (
    <BlogTemplate title="利用規約の改定について">
      <p>設計の土台をひとつに決めておくと、画面が増えても言葉と部品がぶれません。</p>
    </BlogTemplate>
  );
}`
                                : `import { BlogTemplate } from "@gunjo/ui";

export function NoticePost() {
  return (
    <BlogTemplate title="Changes to our terms of service">
      <p>Deciding on a single source of truth keeps wording and parts steady as screens multiply.</p>
    </BlogTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
                <PropsTable data={propsData} />
            </div>
            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
