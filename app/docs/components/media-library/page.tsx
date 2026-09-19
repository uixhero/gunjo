"use client";

import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { MediaLibraryTemplateDemo } from "@/components/demos/MediaLibraryTemplateDemo";
import { Button, Input, MediaLibraryTemplate } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { MediaLibraryTemplate } from "@gunjo/ui";

export default function MediaLibraryPage() {
  return (
    <MediaLibraryTemplate
      header={<div>Header Content</div>}
      sidebar={<div>Left Sidebar (Folders)</div>}
      details={<div>Right Sidebar (Details)</div>}
    >
      <div>Main Content (Asset Grid)</div>
    </MediaLibraryTemplate>
  );
}`;

const propsData = [
    {
        name: "header",
        type: "ReactNode",
        description: "Content for the top header area.",
        required: false,
        default: "-",
    },
    {
        name: "sidebar",
        type: "ReactNode",
        description: "Content for the left sidebar (e.g., folder tree). Hidden on mobile.",
        required: false,
        default: "-",
    },
    {
        name: "details",
        type: "ReactNode",
        description: "Content for the right details panel (e.g., metadata inspector). Hidden on tablet/mobile.",
        required: false,
        default: "-",
    },
    {
        name: "children",
        type: "ReactNode",
        description: "The main content area, typically for displaying an asset grid.",
        required: true,
        default: "-",
    },
];

export default function MediaLibraryDocPage() {
    const { locale } = useLocale();

    const grid = (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
            {(locale === "ja"
                ? ["表紙.png", "図版 1.png", "図版 2.png", "背景.jpg", "ロゴ.svg", "写真.jpg"]
                : ["cover.png", "figure-1.png", "figure-2.png", "backdrop.jpg", "logo.svg", "photo.jpg"]
            ).map((name) => (
                <div key={name} className="space-y-2">
                    <div className="aspect-video rounded-md border bg-muted" />
                    <p className="truncate text-xs text-muted-foreground">{name}</p>
                </div>
            ))}
        </div>
    );

    const folders = (
        <div className="space-y-1 p-3">
            <p className="px-1 pb-2 text-xs font-semibold uppercase text-muted-foreground">
                {locale === "ja" ? "フォルダ" : "Folders"}
            </p>
            {(locale === "ja" ? ["すべて", "広告", "商品写真"] : ["All files", "Campaigns", "Product shots"]).map((name, index) => (
                <div key={name} className={index === 0 ? "rounded bg-accent px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm text-muted-foreground"}>
                    {name}
                </div>
            ))}
        </div>
    );

    const libraryHeader = (
        <div className="flex w-full items-center gap-3">
            <Input className="max-w-xs" placeholder={locale === "ja" ? "ファイルを探す" : "Search files"} />
            <Button size="sm">{locale === "ja" ? "追加" : "Upload"}</Button>
        </div>
    );

    return (
        <ComponentLayout
            title={patternsMetadata.mediaLibraryTemplate.title}
            description={patternsMetadata.mediaLibraryTemplate.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "AssetCard", href: "/docs/components/asset-card" },
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
                { name: "MetadataList", href: "/docs/components/metadata-list" },
                { name: "TagEditor", href: "/docs/components/tag-editor" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
            ]}
            relatedComponents={[
                { name: "BannalyzeTemplate", href: "/docs/components/bannalyze" },
                { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
                { name: "FileTree", href: "/docs/components/file-tree" },
                { name: "MediaLightbox", href: "/docs/components/media-lightbox" },
            ]}
        >
            <ComponentPreview code={usageCode} fullPagePreview
                codeBlock={<CodeBlock code={usageCode} />}
                embedSrc="/embed/media-library"
            >
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <MediaLibraryTemplateDemo className="min-h-[900px]" />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "header・sidebar・details はどれも省略できます。左のフォルダは中くらいの幅から、右の詳細は広い幅から現れ、一覧は常に残ります。"
                        : "header, sidebar, and details are all optional. Folders appear from medium widths, the details panel only on wide ones, and the grid is always there."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "full-library",
                            title: locale === "ja" ? "フォルダと詳細つき" : "Folders and details",
                            description: locale === "ja"
                                ? "左にフォルダ、右に選んだファイルの情報を並べた標準形です。真ん中は一覧に使います。"
                                : "Folders on the left, information about the selected file on the right, and the listing in the middle.",
                            preview: (
                                <MediaLibraryTemplate
                                    className="h-auto"
                                    header={libraryHeader}
                                    sidebar={folders}
                                    details={
                                        <div className="space-y-3 p-4">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                {locale === "ja" ? "ファイルの情報" : "File details"}
                                            </p>
                                            <dl className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">{locale === "ja" ? "形式" : "Format"}</dt>
                                                    <dd>PNG</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">{locale === "ja" ? "大きさ" : "Size"}</dt>
                                                    <dd>2.4 MB</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    }
                                >
                                    {grid}
                                </MediaLibraryTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Input, MediaLibraryTemplate } from "@gunjo/ui";

const FILES = ["表紙.png", "図版 1.png", "図版 2.png"];

export function FullLibrary() {
  return (
    <MediaLibraryTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center gap-3">
          <Input className="max-w-xs" placeholder="ファイルを探す" />
          <Button size="sm">追加</Button>
        </div>
      }
      sidebar={<div className="p-3 text-sm text-muted-foreground">すべて</div>}
      details={<div className="p-4 text-sm text-muted-foreground">PNG / 2.4 MB</div>}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {FILES.map((name) => (
          <div key={name} className="space-y-2">
            <div className="aspect-video rounded-md border bg-muted" />
            <p className="truncate text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </MediaLibraryTemplate>
  );
}`
                                : `import { Button, Input, MediaLibraryTemplate } from "@gunjo/ui";

const FILES = ["cover.png", "figure-1.png", "figure-2.png"];

export function FullLibrary() {
  return (
    <MediaLibraryTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center gap-3">
          <Input className="max-w-xs" placeholder="Search files" />
          <Button size="sm">Upload</Button>
        </div>
      }
      sidebar={<div className="p-3 text-sm text-muted-foreground">All files</div>}
      details={<div className="p-4 text-sm text-muted-foreground">PNG / 2.4 MB</div>}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {FILES.map((name) => (
          <div key={name} className="space-y-2">
            <div className="aspect-video rounded-md border bg-muted" />
            <p className="truncate text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </MediaLibraryTemplate>
  );
}`,
                        },
                        {
                            key: "no-details",
                            title: locale === "ja" ? "詳細を閉じる" : "Without the details panel",
                            description: locale === "ja"
                                ? "details を省くと一覧が右まで広がり、1行に並ぶ枚数が増えます。探している最中はこちらが向いています。"
                                : "Drop details and the grid widens, fitting more per row. This is the better shape while someone is still searching.",
                            preview: (
                                <MediaLibraryTemplate className="h-auto" header={libraryHeader} sidebar={folders}>
                                    {grid}
                                </MediaLibraryTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Input, MediaLibraryTemplate } from "@gunjo/ui";

const FILES = ["表紙.png", "図版 1.png", "図版 2.png"];

export function LibraryWithoutDetails() {
  return (
    <MediaLibraryTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center gap-3">
          <Input className="max-w-xs" placeholder="ファイルを探す" />
          <Button size="sm">追加</Button>
        </div>
      }
      sidebar={<div className="p-3 text-sm text-muted-foreground">すべて</div>}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {FILES.map((name) => (
          <div key={name} className="space-y-2">
            <div className="aspect-video rounded-md border bg-muted" />
            <p className="truncate text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </MediaLibraryTemplate>
  );
}`
                                : `import { Button, Input, MediaLibraryTemplate } from "@gunjo/ui";

const FILES = ["cover.png", "figure-1.png", "figure-2.png"];

export function LibraryWithoutDetails() {
  return (
    <MediaLibraryTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center gap-3">
          <Input className="max-w-xs" placeholder="Search files" />
          <Button size="sm">Upload</Button>
        </div>
      }
      sidebar={<div className="p-3 text-sm text-muted-foreground">All files</div>}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {FILES.map((name) => (
          <div key={name} className="space-y-2">
            <div className="aspect-video rounded-md border bg-muted" />
            <p className="truncate text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </MediaLibraryTemplate>
  );
}`,
                        },
                        {
                            key: "grid-only",
                            title: locale === "ja" ? "一覧だけ" : "Grid only",
                            description: locale === "ja"
                                ? "children だけを渡すと一覧だけが残ります。すでに見出しや検索を持つ画面へ埋め込むときに使います。"
                                : "Pass only children and the grid stands alone. Use it inside a screen that already has its own heading and search.",
                            preview: (
                                <MediaLibraryTemplate className="h-auto">
                                    {grid}
                                </MediaLibraryTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { MediaLibraryTemplate } from "@gunjo/ui";

const FILES = ["表紙.png", "図版 1.png", "図版 2.png"];

export function GridOnlyLibrary() {
  return (
    <MediaLibraryTemplate className="h-auto">
      <div className="grid grid-cols-3 gap-3 p-4">
        {FILES.map((name) => (
          <div key={name} className="space-y-2">
            <div className="aspect-video rounded-md border bg-muted" />
            <p className="truncate text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </MediaLibraryTemplate>
  );
}`
                                : `import { MediaLibraryTemplate } from "@gunjo/ui";

const FILES = ["cover.png", "figure-1.png", "figure-2.png"];

export function GridOnlyLibrary() {
  return (
    <MediaLibraryTemplate className="h-auto">
      <div className="grid grid-cols-3 gap-3 p-4">
        {FILES.map((name) => (
          <div key={name} className="space-y-2">
            <div className="aspect-video rounded-md border bg-muted" />
            <p className="truncate text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </MediaLibraryTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent-foreground/20 bg-accent/40 p-5">
                <div className="max-w-md space-y-1">
                    <h3 className="text-base font-semibold">View as a full app</h3>
                    <p className="text-sm text-muted-foreground">
                        <code className="font-mono text-xs">/patterns/media-library</code> wraps
                        the template in a working media management mini-site with mock state.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/patterns/media-library">
                        Open mini-site
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <PropsTable data={propsData} />
        </ComponentLayout>
    );
}
