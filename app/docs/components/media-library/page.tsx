"use client";

import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { MediaLibraryTemplateDemo } from "@/components/demos/MediaLibraryTemplateDemo";
import { Button } from "@gunjo/ui";
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
        >
            <ComponentPreview code={usageCode} fullPagePreview
                codeBlock={<CodeBlock code={usageCode} />}
                embedSrc="/embed/media-library"
            >
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <MediaLibraryTemplateDemo className="min-h-[900px]" />
                </div>
            </ComponentPreview>

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
