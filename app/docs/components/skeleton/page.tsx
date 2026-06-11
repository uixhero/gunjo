"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Skeleton } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton shape="circle" />
      <div className="space-y-2">
        <Skeleton shape="text" className="w-32" />
        <Skeleton shape="text" className="w-48" />
      </div>
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton shape="circle" />
      <div className="space-y-2">
        <Skeleton shape="text" className="w-32" />
        <Skeleton shape="text" className="w-48" />
      </div>
    </div>
  );
}`,
} as const;

const rectangleCodeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function VideoSkeleton() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-video">
        <Skeleton shape="rectangle" className="h-full w-full rounded-none" />
        <Skeleton shape="circle" className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
          <Skeleton shape="rectangle" className="h-2 flex-1 rounded-full" />
          <Skeleton shape="circle" className="h-3 w-3" />
          <Skeleton shape="circle" className="h-3 w-3" />
        </div>
      </div>
      <div className="space-y-2 p-3">
        <Skeleton shape="text" className="w-40" />
        <Skeleton shape="text" className="w-24" />
      </div>
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function VideoSkeleton() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-video">
        <Skeleton shape="rectangle" className="h-full w-full rounded-none" />
        <Skeleton shape="circle" className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
          <Skeleton shape="rectangle" className="h-2 flex-1 rounded-full" />
          <Skeleton shape="circle" className="h-3 w-3" />
          <Skeleton shape="circle" className="h-3 w-3" />
        </div>
      </div>
      <div className="space-y-2 p-3">
        <Skeleton shape="text" className="w-40" />
        <Skeleton shape="text" className="w-24" />
      </div>
    </div>
  );
}`,
} as const;

const cardCodeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function CardSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-lg border p-4">
      <Skeleton shape="rectangle" className="mb-4 h-28 w-full rounded-md" />
      <Skeleton shape="text" className="mb-2 w-40" />
      <Skeleton shape="text" className="w-56" />
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function CardSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-lg border p-4">
      <Skeleton shape="rectangle" className="mb-4 h-28 w-full rounded-md" />
      <Skeleton shape="text" className="mb-2 w-40" />
      <Skeleton shape="text" className="w-56" />
    </div>
  );
}`,
} as const;

const listCodeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function ListSkeleton() {
  return (
    <div className="w-full max-w-sm space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-center gap-3">
          <Skeleton shape="circle" className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton shape="text" className="w-40" />
            <Skeleton shape="text" className="w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function ListSkeleton() {
  return (
    <div className="w-full max-w-sm space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-center gap-3">
          <Skeleton shape="circle" className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton shape="text" className="w-40" />
            <Skeleton shape="text" className="w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}`,
} as const;

const proseCodeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function ProseSkeleton() {
  return (
    <div className="w-full max-w-lg space-y-3">
      <Skeleton shape="text" className="h-5 w-48" />
      <Skeleton shape="text" className="w-full" />
      <Skeleton shape="text" className="w-11/12" />
      <Skeleton shape="text" className="w-3/4" />
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function ProseSkeleton() {
  return (
    <div className="w-full max-w-lg space-y-3">
      <Skeleton shape="text" className="h-5 w-48" />
      <Skeleton shape="text" className="w-full" />
      <Skeleton shape="text" className="w-11/12" />
      <Skeleton shape="text" className="w-3/4" />
    </div>
  );
}`,
} as const;

const navCodeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function NavigationSkeleton() {
  return (
    <div className="flex w-full max-w-md items-center gap-4">
      <Skeleton shape="rectangle" className="h-8 w-24 rounded-md" />
      <Skeleton shape="text" className="w-16" />
      <Skeleton shape="text" className="w-20" />
      <Skeleton shape="text" className="w-14" />
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function NavigationSkeleton() {
  return (
    <div className="flex w-full max-w-md items-center gap-4">
      <Skeleton shape="rectangle" className="h-8 w-24 rounded-md" />
      <Skeleton shape="text" className="w-16" />
      <Skeleton shape="text" className="w-20" />
      <Skeleton shape="text" className="w-14" />
    </div>
  );
}`,
} as const;

const tableCodeByLocale = {
    ja: `import { Skeleton } from "@gunjo/ui";

export function TableSkeleton() {
  return (
    <div className="w-full max-w-md space-y-2">
      {[0, 1, 2].map((row) => (
        <div key={row} className="grid grid-cols-3 gap-3">
          <Skeleton shape="text" className="w-full" />
          <Skeleton shape="text" className="w-full" />
          <Skeleton shape="text" className="w-full" />
        </div>
      ))}
    </div>
  );
}`,
    en: `import { Skeleton } from "@gunjo/ui";

export function TableSkeleton() {
  return (
    <div className="w-full max-w-md space-y-2">
      {[0, 1, 2].map((row) => (
        <div key={row} className="grid grid-cols-3 gap-3">
          <Skeleton shape="text" className="w-full" />
          <Skeleton shape="text" className="w-full" />
          <Skeleton shape="text" className="w-full" />
        </div>
      ))}
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "shape", type: "\"rectangle\" | \"circle\" | \"text\"", default: "\"rectangle\"", description: "プレースホルダーの形です。" },
        { name: "className", type: "string", description: "実際に表示される領域に合わせた幅、高さ、角丸を追加します。" },
    ],
    en: [
        { name: "shape", type: "\"rectangle\" | \"circle\" | \"text\"", default: "\"rectangle\"", description: "Placeholder shape." },
        { name: "className", type: "string", description: "Optional width, height, and radius classes that match the final content." },
    ],
} as const;

export default function SkeletonPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/skeleton", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.skeleton.title}
            description={content?.description ?? meta.skeleton.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Skeleton", href: "/docs/components/skeleton" },
            ]}
            relatedComponents={[
                { name: "Img", href: "/docs/components/img" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
                { name: "Table", href: "/docs/components/table" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="sm" previewHeight="auto">
                <div className="flex items-center gap-4">
                    <Skeleton shape="circle" />
                    <div className="space-y-2">
                        <Skeleton shape="text" className="w-32" />
                        <Skeleton shape="text" className="w-48" />
                    </div>
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "card",
                            title: locale === "ja" ? "カード" : "Card",
                            description: locale === "ja"
                                ? "カードの読み込みでは、画像領域、見出し、本文の位置を先に確保します。"
                                : "Reserve the media area, title, and body lines before card content loads.",
                            preview: (
                                <div className="w-full max-w-sm rounded-lg border p-4">
                                    <Skeleton shape="rectangle" className="mb-4 h-28 w-full rounded-md" />
                                    <Skeleton shape="text" className="mb-2 w-40" />
                                    <Skeleton shape="text" className="w-56" />
                                </div>
                            ),
                            code: cardCodeByLocale[locale],
                        },
                        {
                            key: "list",
                            title: locale === "ja" ? "リスト" : "List",
                            description: locale === "ja"
                                ? "一覧の読み込みでは、アバターやアイコンの列とテキスト列を実際の行構造に合わせます。"
                                : "For lists, match avatar/icon columns and text columns to the final row structure.",
                            preview: (
                                <div className="w-full max-w-sm space-y-3">
                                    {[0, 1, 2].map((item) => (
                                        <div key={item} className="flex items-center gap-3">
                                            <Skeleton shape="circle" className="h-8 w-8" />
                                            <div className="space-y-2">
                                                <Skeleton shape="text" className="w-40" />
                                                <Skeleton shape="text" className="w-28" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                            code: listCodeByLocale[locale],
                        },
                        {
                            key: "prose",
                            title: locale === "ja" ? "本文" : "Prose",
                            description: locale === "ja"
                                ? "本文の読み込みでは、見出しと段落の行幅を変えて文章量を予告します。"
                                : "For prose, vary heading and paragraph widths to preview the final rhythm.",
                            preview: (
                                <div className="w-full max-w-lg space-y-3">
                                    <Skeleton shape="text" className="h-5 w-48" />
                                    <Skeleton shape="text" className="w-full" />
                                    <Skeleton shape="text" className="w-11/12" />
                                    <Skeleton shape="text" className="w-3/4" />
                                </div>
                            ),
                            code: proseCodeByLocale[locale],
                        },
                        {
                            key: "navigation",
                            title: locale === "ja" ? "ナビゲーション" : "Navigation",
                            description: locale === "ja"
                                ? "ヘッダーやタブの読み込みでは、ロゴ領域とリンク幅を個別に確保します。"
                                : "For headers or tabs, reserve separate logo and link widths.",
                            preview: (
                                <div className="flex w-full max-w-md items-center gap-4">
                                    <Skeleton shape="rectangle" className="h-8 w-24 rounded-md" />
                                    <Skeleton shape="text" className="w-16" />
                                    <Skeleton shape="text" className="w-20" />
                                    <Skeleton shape="text" className="w-14" />
                                </div>
                            ),
                            code: navCodeByLocale[locale],
                        },
                        {
                            key: "media",
                            title: locale === "ja" ? "動画" : "Video",
                            description: locale === "ja"
                                ? "動画の読み込みでは、プレイヤー領域、再生ボタン、タイトル行をまとめて模倣します。"
                                : "For video loading, mirror the player area, play control, and title lines together.",
                            preview: (
                                <div className="w-full max-w-sm overflow-hidden rounded-lg border bg-card">
                                    <div className="relative aspect-video">
                                        <Skeleton shape="rectangle" className="h-full w-full rounded-none" />
                                        <Skeleton shape="circle" className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" />
                                        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
                                            <Skeleton shape="rectangle" className="h-2 flex-1 rounded-full" />
                                            <Skeleton shape="circle" className="h-3 w-3" />
                                            <Skeleton shape="circle" className="h-3 w-3" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-3">
                                        <Skeleton shape="text" className="w-40" />
                                        <Skeleton shape="text" className="w-24" />
                                    </div>
                                </div>
                            ),
                            code: rectangleCodeByLocale[locale],
                        },
                        {
                            key: "table-rows",
                            title: locale === "ja" ? "テーブル行" : "Table rows",
                            description: locale === "ja"
                                ? "列数を実データに合わせると、読み込み後のレイアウトずれを減らせます。"
                                : "Match the column count to reduce layout shift when the data arrives.",
                            preview: (
                                <div className="w-full max-w-md space-y-2">
                                    {[0, 1, 2].map((row) => (
                                        <div key={row} className="grid grid-cols-3 gap-3">
                                            <Skeleton shape="text" className="w-full" />
                                            <Skeleton shape="text" className="w-full" />
                                            <Skeleton shape="text" className="w-full" />
                                        </div>
                                    ))}
                                </div>
                            ),
                            code: tableCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
