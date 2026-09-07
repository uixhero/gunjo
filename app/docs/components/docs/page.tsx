"use client";

import { DocsTemplate } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { DocsTemplateDemo } from "@/components/demos/DocsTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

export default function DocsTemplatePage() {
    const { locale } = useLocale();

    const code = `import { DocsTemplate } from "@gunjo/ui";

const navItems = [
    { href: "/docs/getting-started", label: "Getting started" },
    { href: "/docs/components/button", label: "Button" },
];

const tocItems = [
    { href: "#overview", label: "Overview" },
    { href: "#props", label: "Props" },
];

export function DocsLayoutExample() {
    return (
        <DocsTemplate
            sidebar={
                <nav className="grid gap-1 text-sm">
                    {navItems.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>
            }
            toc={
                <nav className="grid gap-1 text-sm">
                    {tocItems.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>
            }
        >
            <article className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight">Button</h1>
                <p className="text-muted-foreground">
                    Buttons trigger an action in the current view.
                </p>
            </article>
        </DocsTemplate>
    );
}`;

    const usageCode = code;

    const propsData = [
        { name: "sidebar", type: "ReactNode", description: "Left navigation sidebar content (required)." },
        { name: "toc", type: "ReactNode", description: "Optional right 'On this page' table of contents." },
        { name: "header", type: "ReactNode", description: "Optional top header (e.g. site Header organism)." },
        { name: "children", type: "ReactNode", description: "Main content area." },
    ];

    const navLabels = locale === "ja"
        ? ["はじめに", "インストール", "テーマ"]
        : ["Introduction", "Installation", "Theming"];
    const tocLabels = locale === "ja"
        ? ["前提", "導入する", "設定する"]
        : ["Prerequisites", "Install", "Configure"];

    const sidebarNav = (
        <nav className="grid gap-1 text-sm">
            {navLabels.map((label, index) => (
                <span key={label} className={index === 0 ? "rounded px-2 py-1 font-medium text-foreground" : "rounded px-2 py-1 text-muted-foreground"}>
                    {label}
                </span>
            ))}
        </nav>
    );

    const tocNav = (
        <nav className="grid gap-1 text-xs">
            <span className="font-semibold text-muted-foreground">
                {locale === "ja" ? "このページの内容" : "On this page"}
            </span>
            {tocLabels.map((label) => (
                <span key={label} className="text-muted-foreground">{label}</span>
            ))}
        </nav>
    );

    const article = (
        <article className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">
                {locale === "ja" ? "インストール" : "Installation"}
            </h1>
            <p className="text-sm text-muted-foreground">
                {locale === "ja"
                    ? "Node 20 以上、React 19、Tailwind v4 が要ります。5分で終わります。"
                    : "You need Node 20+, React 19, and Tailwind v4. It takes about five minutes."}
            </p>
        </article>
    );

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).docsTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).docsTemplate.description}
            usedComponents={[
                { name: "DocsTemplate", href: "/docs/components/docs" },
            ]}
            relatedComponents={[
                { name: "BlogTemplate", href: "/docs/components/blog" },
                { name: "PageAside", href: "/docs/components/page-aside" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "ScrollArea", href: "/docs/components/scroll-area" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/docs" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <DocsTemplateDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "sidebar だけが必須で、toc と header は省略できます。右の目次を外すと本文が広がり、header を足すと上に横帯が乗ります。"
                        : "Only sidebar is required; toc and header are optional. Dropping the table of contents widens the body, and adding a header puts a bar across the top."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sidebar-and-toc",
                            title: locale === "ja" ? "目次つき" : "Sidebar and table of contents",
                            description: locale === "ja"
                                ? "左に案内、右に目次を置いた三段の形です。節が多い解説ページの既定形です。"
                                : "Navigation on the left, a table of contents on the right. This is the default for reference pages with many sections.",
                            preview: (
                                <DocsTemplate className="min-h-0" sidebar={sidebarNav} toc={tocNav}>
                                    {article}
                                </DocsTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { DocsTemplate } from "@gunjo/ui";

const NAV_ITEMS = ["はじめに", "インストール", "テーマ"];
const TOC_ITEMS = ["前提", "導入する", "設定する"];

export function DocsWithToc() {
  return (
    <DocsTemplate
      className="min-h-0"
      sidebar={
        <nav className="grid gap-1 text-sm">
          {NAV_ITEMS.map((label) => (
            <span key={label} className="rounded px-2 py-1 text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
      toc={
        <nav className="grid gap-1 text-xs">
          {TOC_ITEMS.map((label) => (
            <span key={label} className="text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
    >
      <article className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">インストール</h1>
        <p className="text-sm text-muted-foreground">Node 20 以上、React 19、Tailwind v4 が要ります。</p>
      </article>
    </DocsTemplate>
  );
}`
                                : `import { DocsTemplate } from "@gunjo/ui";

const NAV_ITEMS = ["Introduction", "Installation", "Theming"];
const TOC_ITEMS = ["Prerequisites", "Install", "Configure"];

export function DocsWithToc() {
  return (
    <DocsTemplate
      className="min-h-0"
      sidebar={
        <nav className="grid gap-1 text-sm">
          {NAV_ITEMS.map((label) => (
            <span key={label} className="rounded px-2 py-1 text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
      toc={
        <nav className="grid gap-1 text-xs">
          {TOC_ITEMS.map((label) => (
            <span key={label} className="text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
    >
      <article className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Installation</h1>
        <p className="text-sm text-muted-foreground">You need Node 20+, React 19, and Tailwind v4.</p>
      </article>
    </DocsTemplate>
  );
}`,
                        },
                        {
                            key: "without-toc",
                            title: locale === "ja" ? "目次無し" : "Without the table of contents",
                            description: locale === "ja"
                                ? "toc を省くと本文が右まで広がります。節がひとつしか無い短いページに向きます。"
                                : "Drop toc and the body runs to the right edge. This suits short pages with a single section.",
                            preview: (
                                <DocsTemplate className="min-h-0" sidebar={sidebarNav}>
                                    {article}
                                </DocsTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { DocsTemplate } from "@gunjo/ui";

const NAV_ITEMS = ["はじめに", "インストール", "テーマ"];

export function DocsWithoutToc() {
  return (
    <DocsTemplate
      className="min-h-0"
      sidebar={
        <nav className="grid gap-1 text-sm">
          {NAV_ITEMS.map((label) => (
            <span key={label} className="rounded px-2 py-1 text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
    >
      <article className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">インストール</h1>
        <p className="text-sm text-muted-foreground">Node 20 以上、React 19、Tailwind v4 が要ります。</p>
      </article>
    </DocsTemplate>
  );
}`
                                : `import { DocsTemplate } from "@gunjo/ui";

const NAV_ITEMS = ["Introduction", "Installation", "Theming"];

export function DocsWithoutToc() {
  return (
    <DocsTemplate
      className="min-h-0"
      sidebar={
        <nav className="grid gap-1 text-sm">
          {NAV_ITEMS.map((label) => (
            <span key={label} className="rounded px-2 py-1 text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
    >
      <article className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Installation</h1>
        <p className="text-sm text-muted-foreground">You need Node 20+, React 19, and Tailwind v4.</p>
      </article>
    </DocsTemplate>
  );
}`,
                        },
                        {
                            key: "with-header",
                            title: locale === "ja" ? "上に横帯を足す" : "With a header",
                            description: locale === "ja"
                                ? "header を渡すと、左右の段の上に横帯が乗ります。検索や版の切り替えを置く場所です。"
                                : "A node passed to header spans the columns above them. This is where search or a version switcher goes.",
                            preview: (
                                <DocsTemplate
                                    className="min-h-0"
                                    header={
                                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                                            <span className="font-semibold">{locale === "ja" ? "Gunjo ドキュメント" : "Gunjo docs"}</span>
                                            <span className="text-muted-foreground">v0.1.0-beta</span>
                                        </div>
                                    }
                                    sidebar={sidebarNav}
                                    toc={tocNav}
                                >
                                    {article}
                                </DocsTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { DocsTemplate } from "@gunjo/ui";

const NAV_ITEMS = ["はじめに", "インストール", "テーマ"];

export function DocsWithHeader() {
  return (
    <DocsTemplate
      className="min-h-0"
      header={
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="font-semibold">Gunjo ドキュメント</span>
          <span className="text-muted-foreground">v0.1.0-beta</span>
        </div>
      }
      sidebar={
        <nav className="grid gap-1 text-sm">
          {NAV_ITEMS.map((label) => (
            <span key={label} className="rounded px-2 py-1 text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
    >
      <article className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">インストール</h1>
        <p className="text-sm text-muted-foreground">Node 20 以上、React 19、Tailwind v4 が要ります。</p>
      </article>
    </DocsTemplate>
  );
}`
                                : `import { DocsTemplate } from "@gunjo/ui";

const NAV_ITEMS = ["Introduction", "Installation", "Theming"];

export function DocsWithHeader() {
  return (
    <DocsTemplate
      className="min-h-0"
      header={
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="font-semibold">Gunjo docs</span>
          <span className="text-muted-foreground">v0.1.0-beta</span>
        </div>
      }
      sidebar={
        <nav className="grid gap-1 text-sm">
          {NAV_ITEMS.map((label) => (
            <span key={label} className="rounded px-2 py-1 text-muted-foreground">{label}</span>
          ))}
        </nav>
      }
    >
      <article className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Installation</h1>
        <p className="text-sm text-muted-foreground">You need Node 20+, React 19, and Tailwind v4.</p>
      </article>
    </DocsTemplate>
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
