"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { MetadataList } from "@gunjo/ui";
import { IconCalendarEvent as CalendarDays, IconDatabase as HardDrive, IconFileTypeJpg as FileImage, IconRuler as Ruler } from "@tabler/icons-react";

const itemsByLocale = {
    ja: [
        { label: "サイズ", value: "1920 x 1080", icon: <Ruler className="h-3.5 w-3.5" /> },
        { label: "形式", value: "JPG", icon: <FileImage className="h-3.5 w-3.5" /> },
        { label: "容量", value: "1.4MB", icon: <HardDrive className="h-3.5 w-3.5" /> },
        { label: "作成日", value: "2026-05-12", icon: <CalendarDays className="h-3.5 w-3.5" /> },
    ],
    en: [
        { label: "Dimensions", value: "1920 x 1080", icon: <Ruler className="h-3.5 w-3.5" /> },
        { label: "File type", value: "JPG", icon: <FileImage className="h-3.5 w-3.5" /> },
        { label: "Size", value: "1.4MB", icon: <HardDrive className="h-3.5 w-3.5" /> },
        { label: "Created", value: "2026-05-12", icon: <CalendarDays className="h-3.5 w-3.5" /> },
    ],
} as const;

const codeByLocale = {
    ja: `import { MetadataList } from "@gunjo/ui";
import { IconCalendarEvent as CalendarDays, IconDatabase as HardDrive, IconFileTypeJpg as FileImage, IconRuler as Ruler } from "@tabler/icons-react";

const items = [
  { label: "サイズ", value: "1920 x 1080", icon: <Ruler className="h-3.5 w-3.5" /> },
  { label: "形式", value: "JPG", icon: <FileImage className="h-3.5 w-3.5" /> },
  { label: "容量", value: "1.4MB", icon: <HardDrive className="h-3.5 w-3.5" /> },
  { label: "作成日", value: "2026-05-12", icon: <CalendarDays className="h-3.5 w-3.5" /> },
];

export function Example() {
  return <MetadataList items={items} />;
}`,
    en: `import { MetadataList } from "@gunjo/ui";
import { IconCalendarEvent as CalendarDays, IconDatabase as HardDrive, IconFileTypeJpg as FileImage, IconRuler as Ruler } from "@tabler/icons-react";

const items = [
  { label: "Dimensions", value: "1920 x 1080", icon: <Ruler className="h-3.5 w-3.5" /> },
  { label: "File type", value: "JPG", icon: <FileImage className="h-3.5 w-3.5" /> },
  { label: "Size", value: "1.4MB", icon: <HardDrive className="h-3.5 w-3.5" /> },
  { label: "Created", value: "2026-05-12", icon: <CalendarDays className="h-3.5 w-3.5" /> },
];

export function Example() {
  return <MetadataList items={items} />;
}`,
} as const;

const horizontalCodeByLocale = {
    ja: `import { MetadataList } from "@gunjo/ui";

export function HorizontalMetadata() {
  return (
    <MetadataList
      layout="horizontal"
      items={[
        { label: "サイズ", value: "1920 x 1080" },
        { label: "形式", value: "JPG" },
        { label: "容量", value: "1.4MB" },
        { label: "作成日", value: "2026-05-12" },
      ]}
    />
  );
}`,
    en: `import { MetadataList } from "@gunjo/ui";

export function HorizontalMetadata() {
  return (
    <MetadataList
      layout="horizontal"
      items={[
        { label: "Dimensions", value: "1920 x 1080" },
        { label: "File type", value: "JPG" },
        { label: "Size", value: "1.4MB" },
        { label: "Created", value: "2026-05-12" },
      ]}
    />
  );
}`,
} as const;

const compactCodeByLocale = {
    ja: `import { MetadataList } from "@gunjo/ui";

export function CompactMetadata() {
  return (
    <MetadataList
      variant="compact"
      items={[
        { label: "形式", value: "PNG" },
        { label: "容量", value: "820KB" },
      ]}
    />
  );
}`,
    en: `import { MetadataList } from "@gunjo/ui";

export function CompactMetadata() {
  return (
    <MetadataList
      variant="compact"
      items={[
        { label: "File type", value: "PNG" },
        { label: "Size", value: "820KB" },
      ]}
    />
  );
}`,
} as const;

const emptyCodeByLocale = {
    ja: `import { MetadataList } from "@gunjo/ui";

export function EmptyMetadata() {
  return <MetadataList items={[]} emptyMessage="メタ情報はありません" />;
}`,
    en: `import { MetadataList } from "@gunjo/ui";

export function EmptyMetadata() {
  return <MetadataList items={[]} emptyMessage="No metadata available" />;
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "items", type: "MetadataListItem[]", required: true, description: "ラベルと値の行として表示する項目です。" },
        { name: "variant", type: "\"default\" | \"compact\"", default: "\"default\"", description: "行の密度を切り替えます。" },
        { name: "layout", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "縦並びか横並びかを切り替えます。" },
        { name: "emptyMessage", type: "ReactNode", description: "空の場合の表示内容です。日本語 UI では明示的に日本語の文言を渡してください。" },
        { name: "className", type: "string", description: "外側に追加するクラスです。" },
    ],
    en: [
        { name: "items", type: "MetadataListItem[]", required: true, description: "Rows rendered as label/value pairs." },
        { name: "variant", type: "\"default\" | \"compact\"", default: "\"default\"", description: "Controls row density." },
        { name: "layout", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "Controls whether rows stack vertically or wrap into horizontal cards." },
        { name: "emptyMessage", type: "ReactNode", default: "\"No metadata\"", description: "Fallback content for an empty list." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

export default function MetadataListDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/metadata-list", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.metadataList.title}
            description={content?.description ?? meta.metadataList.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "MetadataList", href: "/docs/components/metadata-list" },
            ]}
            relatedComponents={[
                { name: "Table", href: "/docs/components/table" },
                { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
                { name: "Card", href: "/docs/components/card" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="sm" previewHeight="auto">
                <MetadataList items={[...itemsByLocale[locale]]} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いインスペクターやサイドパネルでは compact で行の密度を上げます。"
                                : "Use compact density inside narrow inspectors and side panels.",
                            preview: <MetadataList variant="compact" items={[...itemsByLocale[locale]].slice(1, 3)} className="max-w-sm" />,
                            code: compactCodeByLocale[locale],
                        },
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "横並び" : "Horizontal",
                            description: locale === "ja"
                                ? "概要カードや詳細ヘッダーでは layout=\"horizontal\" で複数のメタ情報を横に並べます。"
                                : "Use layout=\"horizontal\" for summary cards and detail headers where metadata should scan across.",
                            preview: <MetadataList layout="horizontal" items={[...itemsByLocale[locale]]} className="max-w-xl" />,
                            code: horizontalCodeByLocale[locale],
                        },
                        {
                            key: "empty",
                            title: locale === "ja" ? "空" : "Empty",
                            description: locale === "ja"
                                ? "メタ情報がまだない場合は、空欄にせず短いメッセージを表示します。"
                                : "Show a short message instead of leaving the metadata area blank.",
                            preview: <MetadataList items={[]} emptyMessage={locale === "ja" ? "メタ情報はありません" : "No metadata available"} className="max-w-sm" />,
                            code: emptyCodeByLocale[locale],
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
