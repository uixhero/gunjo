"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { DesktopPageHeaderDemo } from "@/components/demos/DesktopPageHeaderDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { DesktopPageHeader } from "@gunjo/ui";

const usageCode = `"use client";

import * as React from "react";
import { Badge, Button, DesktopPageHeader } from "@gunjo/ui";

export function FleetHeader() {
  const [saved, setSaved] = React.useState(false);

  return (
    <DesktopPageHeader
      eyebrow="Gunjo Transit · Tokyo depot"
      title="Fleet maintenance console"
      subtitle="Track availability, deadlines, and workshop plans"
      actions={
        <>
          {saved && <Badge variant="success">Saved</Badge>}
          <Button size="sm" variant="outline" onClick={() => setSaved(true)}>
            Save updates
          </Button>
        </>
      }
    />
  );
}`;

const titleOnlyCode = `import { DesktopPageHeader } from "@gunjo/ui";

export function ReportHeader() {
  return <DesktopPageHeader title="Daily operations report" />;
}`;

export default function DesktopPageHeaderDocPage() {
  const { locale, sectionLabels } = useLocale();
  const isJa = locale === "ja";

  const propsData = isJa
    ? [
        { name: "title", type: "ReactNode", description: "画面の主見出し。h1 として描画します。" },
        { name: "eyebrow", type: "ReactNode", description: "タイトル上の任意コンテキスト（事業者・営業所・breadcrumb など）。" },
        { name: "subtitle", type: "ReactNode", description: "タイトル下の任意説明。" },
        { name: "actions", type: "ReactNode", description: "画面固有の末尾操作または状態。" },
        { name: "className / HTML attributes", type: "string / HTMLAttributes<HTMLElement>", description: "header 要素へ転送します。" },
      ]
    : [
        { name: "title", type: "ReactNode", description: "Primary screen heading, rendered as h1." },
        { name: "eyebrow", type: "ReactNode", description: "Optional context above the title: operator, depot, or breadcrumb." },
        { name: "subtitle", type: "ReactNode", description: "Optional summary below the title." },
        { name: "actions", type: "ReactNode", description: "Trailing screen-specific controls or status." },
        { name: "className / HTML attributes", type: "string / HTMLAttributes<HTMLElement>", description: "Forwarded to the header element." },
      ];

  return (
    <ComponentLayout
      title={displayMetadata.desktopPageHeader.title}
      description={displayMetadata.desktopPageHeader.description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "DesktopPageHeader", href: "/docs/components/desktop-page-header" },
        { name: "Button", href: "/docs/components/button" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
      relatedComponents={[
        { name: "Header", href: "/docs/components/header" },
        { name: "PageHeader", href: "/docs/components/page-header" },
        { name: "BottomActionBar", href: "/docs/components/bottom-action-bar" },
      ]}
    >
      <ComponentPreview embedSrc="/embed/desktop-page-header" code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <div className="w-full">
          <DesktopPageHeaderDemo locale={locale} />
        </div>
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {isJa ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "context-actions",
              title: isJa ? "コンテキスト＋操作" : "Context and actions",
              description: isJa ? "営業所などの文脈と、画面固有の操作を同じ見出しにまとめます。" : "Combine screen context with screen-specific actions.",
              preview: <DesktopPageHeaderDemo locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "title-only",
              title: isJa ? "タイトルのみ" : "Title only",
              description: isJa ? "補助情報や操作が無い場合も、同じ見出しのリズムを維持します。" : "Keep the same heading rhythm when no supporting content is needed.",
              preview: <DesktopPageHeader title={isJa ? "日次運行レポート" : "Daily operations report"} />,
              code: titleOnlyCode,
              previewBodyWidth: "lg",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <CodeBlock code={usageCode} />
      </section>
    </ComponentLayout>
  );
}
