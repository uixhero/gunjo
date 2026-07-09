"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import {
  CodeCopyButton,
  ComponentLayout,
  ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, ListCard, SectionList, type SectionListSection } from "@gunjo/ui";

type Locale = "ja" | "en";

function formatCurrency(value: number, locale: Locale) {
  return locale === "ja"
    ? `¥${value.toLocaleString("ja-JP")}`
    : `$${Math.round(value / 150).toLocaleString("en-US")}`;
}

function sectionRows(locale: Locale) {
  return locale === "ja"
    ? [
        {
          key: "june",
          title: "2026年6月締め",
          sublabel: "3社",
          rows: [
            { id: "inv-101", title: "青山商事", description: "広告素材 / 確認済み", amount: 248000, status: "確認済み" },
            { id: "inv-102", title: "北浜デザイン", description: "LP制作 / レビュー中", amount: 186000, status: "レビュー中" },
            { id: "inv-103", title: "神田食品", description: "商品撮影 / 未提出", amount: 128000, status: "未提出" },
          ],
        },
        {
          key: "july",
          title: "2026年7月締め",
          sublabel: "2社",
          rows: [
            { id: "inv-201", title: "渋谷出版", description: "SNS運用 / 進行中", amount: 96000, status: "進行中" },
            { id: "inv-202", title: "西新宿物流", description: "配送管理UI / 確認待ち", amount: 322000, status: "確認待ち" },
          ],
        },
      ]
    : [
        {
          key: "june",
          title: "June 2026 close",
          sublabel: "3 clients",
          rows: [
            { id: "inv-101", title: "Aoyama Trading", description: "Campaign assets / approved", amount: 248000, status: "Approved" },
            { id: "inv-102", title: "Kitahama Design", description: "Landing page / in review", amount: 186000, status: "In review" },
            { id: "inv-103", title: "Kanda Foods", description: "Product shoot / missing", amount: 128000, status: "Missing" },
          ],
        },
        {
          key: "july",
          title: "July 2026 close",
          sublabel: "2 clients",
          rows: [
            { id: "inv-201", title: "Shibuya Publishing", description: "Social operations / active", amount: 96000, status: "Active" },
            { id: "inv-202", title: "Nishi-Shinjuku Logistics", description: "Dispatch UI / waiting", amount: 322000, status: "Waiting" },
          ],
        },
      ];
}

function makeSections(locale: Locale, mode: "default" | "footer" | "sticky" = "default"): SectionListSection[] {
  return sectionRows(locale).map((group) => {
    const subtotal = group.rows.reduce((sum, row) => sum + row.amount, 0);
    return {
      key: group.key,
      title: group.title,
      sublabel: group.sublabel,
      meta: formatCurrency(subtotal, locale),
      content: (
        <div className="divide-y divide-border/70">
          {group.rows.map((row) => (
            <ListCard
              key={row.id}
              title={row.title}
              description={row.description}
              meta={formatCurrency(row.amount, locale)}
              status={<Badge variant={row.status.includes("Missing") || row.status.includes("未提出") ? "destructive" : "secondary"}>{row.status}</Badge>}
              className="rounded-none border-0 bg-background px-3 py-3 shadow-none"
            />
          ))}
        </div>
      ),
      footer:
        mode === "footer" ? (
          <>
            <span>{locale === "ja" ? "締め小計" : "Section subtotal"}</span>
            <span>{formatCurrency(subtotal, locale)}</span>
          </>
        ) : undefined,
    };
  });
}

function SectionListPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "footer" | "sticky" }) {
  const label = locale === "ja" ? "締め別 請求一覧" : "Invoices grouped by close month";
  const list = <SectionList sections={makeSections(locale, mode)} label={label} stickyHeaders={mode === "sticky"} />;

  return (
    <div className="w-full max-w-2xl rounded-lg border bg-card p-4">
      {mode === "sticky" ? <div className="max-h-72 overflow-auto rounded-md border">{list}</div> : list}
    </div>
  );
}

export default function SectionListDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/section-list", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.sectionList.title ?? "SectionList";
  const description = content?.description ?? metadata.sectionList.description ?? "";

  const usageCode =
    locale === "ja"
      ? `import { Badge, ListCard, SectionList, type SectionListSection } from "@gunjo/ui";

const sections: SectionListSection[] = [
  {
    key: "june",
    title: "2026年6月締め",
    sublabel: "3社",
    meta: "¥562,000",
    content: (
      <div className="divide-y divide-border/70">
        <ListCard title="青山商事" description="広告素材 / 確認済み" meta="¥248,000" status={<Badge variant="secondary">確認済み</Badge>} className="rounded-none border-0 bg-background px-3 py-3 shadow-none" />
        <ListCard title="北浜デザイン" description="LP制作 / レビュー中" meta="¥186,000" status={<Badge variant="secondary">レビュー中</Badge>} className="rounded-none border-0 bg-background px-3 py-3 shadow-none" />
      </div>
    ),
    footer: <><span>締め小計</span><span>¥562,000</span></>,
  },
];

export function InvoiceSectionList() {
  return (
    <div className="w-full max-w-2xl rounded-lg border bg-card p-4">
      <SectionList sections={sections} label="締め別 請求一覧" />
    </div>
  );
}`
      : `import { Badge, ListCard, SectionList, type SectionListSection } from "@gunjo/ui";

const sections: SectionListSection[] = [
  {
    key: "june",
    title: "June 2026 close",
    sublabel: "3 clients",
    meta: "$3,747",
    content: (
      <div className="divide-y divide-border/70">
        <ListCard title="Aoyama Trading" description="Campaign assets / approved" meta="$1,653" status={<Badge variant="secondary">Approved</Badge>} className="rounded-none border-0 bg-background px-3 py-3 shadow-none" />
        <ListCard title="Kitahama Design" description="Landing page / in review" meta="$1,240" status={<Badge variant="secondary">In review</Badge>} className="rounded-none border-0 bg-background px-3 py-3 shadow-none" />
      </div>
    ),
    footer: <><span>Section subtotal</span><span>$3,747</span></>,
  },
];

export function InvoiceSectionList() {
  return (
    <div className="w-full max-w-2xl rounded-lg border bg-card p-4">
      <SectionList sections={sections} label="Invoices grouped by close month" />
    </div>
  );
}`;

  const propsData = [
    { name: "sections", type: "SectionListSection[]", description: locale === "ja" ? "事前にグループ化したセクションです。groupBy と小計計算は呼び出し側が持ちます。" : "Pre-grouped sections. The caller owns groupBy and subtotal math." },
    { name: "stickyHeaders", type: "boolean", default: "false", description: locale === "ja" ? "スクロールコンテナ内で見出しを上部固定します。" : "Keeps section headers sticky inside the scroll container." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "グループ全体のアクセシブル名です。" : "Accessible name for the grouped list." },
    { name: "SectionListSection.title / sublabel", type: "ReactNode", description: locale === "ja" ? "見出しと補助説明です。" : "Heading and supporting label." },
    { name: "SectionListSection.meta", type: "ReactNode", description: locale === "ja" ? "見出し右側の集計表示です。" : "Right-aligned aggregate in the header." },
    { name: "SectionListSection.content", type: "ReactNode", description: locale === "ja" ? "呼び出し側が所有する行本文です。" : "Body rows owned by the caller." },
    { name: "SectionListSection.footer", type: "ReactNode", description: locale === "ja" ? "セクションごとの小計フッターです。" : "Optional per-section subtotal footer." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "SectionList", href: "/docs/components/section-list" }, { name: "ListCard", href: "/docs/components/list-card" }]}
      relatedComponents={[{ name: "Table", href: "/docs/components/table" }, { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <SectionListPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "grouped", title: locale === "ja" ? "グループ別" : "Grouped", description: locale === "ja" ? "月や荷主など、呼び出し側でまとめた区切りを表示します。" : "Displays caller-owned groups such as months or clients.", preview: <SectionListPreview locale={locale} />, code: usageCode, previewBodyWidth: "lg" },
            { key: "footer", title: locale === "ja" ? "小計付き" : "With subtotal", description: locale === "ja" ? "各セクションの footer に小計行を置けます。" : "Use footer for per-section subtotal rows.", preview: <SectionListPreview locale={locale} mode="footer" />, code: usageCode, previewBodyWidth: "lg" },
            { key: "sticky", title: locale === "ja" ? "固定見出し" : "Sticky headers", description: locale === "ja" ? "実際にスクロールする領域で stickyHeaders を使います。" : "Use stickyHeaders inside a real scrolling area.", preview: <SectionListPreview locale={locale} mode="sticky" />, code: usageCode.replace("<SectionList sections={sections}", "<div className=\"max-h-72 overflow-auto rounded-md border\"><SectionList stickyHeaders sections={sections").replace(" />\\n    </div>", " /></div>\\n    </div>"), previewBodyWidth: "lg" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
