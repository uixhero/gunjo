"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { DesktopPageHeaderDemo } from "@/components/demos/DesktopPageHeaderDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Button, DesktopPageHeader } from "@gunjo/ui";

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

const titleOnlyCode = `import { Badge, Button, DesktopPageHeader } from "@gunjo/ui";

export function ReportHeader() {
  return <DesktopPageHeader title="Daily operations report" />;
}`;

const longTitleCodeJa = `import { Badge, Button, DesktopPageHeader } from "@gunjo/ui";

const ACTIONS = [
  { id: "export", label: "CSVで書き出す" },
  { id: "print", label: "印刷する" },
];

export function LongTitleHeader() {
  return (
    <DesktopPageHeader
      eyebrow="群青交通 · 品川営業所 · 車両管理"
      title="車両点検と整備予定の一覧（2026年度 第2四半期・全営業所ぶん）"
      subtitle="期限が近い順に並んでいます。整備工場の空きと突き合わせて予定を組みます。"
      actions={
        <>
          <Badge variant="outline">下書き</Badge>
          {ACTIONS.map((action) => (
            <Button key={action.id} size="sm" variant="outline">
              {action.label}
            </Button>
          ))}
          <Button size="sm">予定を組む</Button>
        </>
      }
    />
  );
}`;

const longTitleCodeEn = `import { Badge, Button, DesktopPageHeader } from "@gunjo/ui";

const ACTIONS = [
  { id: "export", label: "Export CSV" },
  { id: "print", label: "Print" },
];

export function LongTitleHeader() {
  return (
    <DesktopPageHeader
      eyebrow="Gunjo Transit · Shinagawa depot · Fleet"
      title="Vehicle inspections and workshop bookings for Q2, across every depot"
      subtitle="Sorted by deadline. Cross-check against workshop availability before booking."
      actions={
        <>
          <Badge variant="outline">Draft</Badge>
          {ACTIONS.map((action) => (
            <Button key={action.id} size="sm" variant="outline">
              {action.label}
            </Button>
          ))}
          <Button size="sm">Book workshop</Button>
        </>
      }
    />
  );
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
            {
              key: "long-title",
              title: isJa ? "長いタイトルと、多い操作" : "A long title with many actions",
              description: isJa
                ? "タイトルは残った幅で折り返し、操作は行を折り返しても末尾に残ります。文字数が読めない画面でも崩れません。"
                : "The title wraps into whatever width is left, and the actions wrap while staying at the trailing edge.",
              preview: (
                <DesktopPageHeader
                  eyebrow={isJa ? "群青交通 · 品川営業所 · 車両管理" : "Gunjo Transit · Shinagawa depot · Fleet"}
                  title={
                    isJa
                      ? "車両点検と整備予定の一覧（2026年度 第2四半期・全営業所ぶん）"
                      : "Vehicle inspections and workshop bookings for Q2, across every depot"
                  }
                  subtitle={
                    isJa
                      ? "期限が近い順に並んでいます。整備工場の空きと突き合わせて予定を組みます。"
                      : "Sorted by deadline. Cross-check against workshop availability before booking."
                  }
                  actions={
                    <>
                      <Badge variant="outline">{isJa ? "下書き" : "Draft"}</Badge>
                      <Button size="sm" variant="outline">
                        {isJa ? "CSVで書き出す" : "Export CSV"}
                      </Button>
                      <Button size="sm" variant="outline">
                        {isJa ? "印刷する" : "Print"}
                      </Button>
                      <Button size="sm">{isJa ? "予定を組む" : "Book workshop"}</Button>
                    </>
                  }
                />
              ),
              code: isJa ? longTitleCodeJa : longTitleCodeEn,
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
