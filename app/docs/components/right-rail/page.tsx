"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { RightRailDemo } from "@/components/demos/RightRailDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";

export default function RightRailDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const sharedCode = `import { Badge, RightRail } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "${isJa ? "概要" : "Overview"}" },
  { id: "quality", label: "${isJa ? "品質指標" : "Quality metrics"}" },
  { id: "release", label: "${isJa ? "公開前確認" : "Release checks"}" },
]

const pageStatuses = [
  { label: "${isJa ? "状態" : "Status"}", value: "${isJa ? "公開前確認" : "Pre-release"}", tone: "default" },
  { label: "${isJa ? "最終更新" : "Updated"}", value: "${isJa ? "5分前" : "5 min ago"}", tone: "secondary" },
  { label: "${isJa ? "レビュー" : "Review"}", value: "${isJa ? "2件対応待ち" : "2 pending"}", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">${isJa ? "ページ内" : "On this page"}</h3>
      <nav aria-label="${isJa ? "ページ内リンク" : "Page sections"}">
        <ul className="space-y-1">
          {pageLinks.map((item) => (
            <li key={item.id}>
              <a className="block rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" href={\`#\${item.id}\`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}

function PageStatus() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">${isJa ? "ページステータス" : "Page status"}</h3>
      <dl className="space-y-2">
        {pageStatuses.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="shrink-0 text-xs font-medium">
              {item.tone === "default" ? <Badge>{item.value}</Badge> : item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}`;
    const code = `${sharedCode}

export function DesktopRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4" aria-label="${isJa ? "主コンテンツ" : "Main content"}">
        <p className="max-w-xl text-sm text-muted-foreground">
          ${isJa ? "主コンテンツの右側に、参照用の補助情報を固定幅で並べます。" : "Supporting information sits beside the main content in a fixed-width rail."}
        </p>
      </main>

      <RightRail width="w-72" aria-label="${isJa ? "右レールの補助情報" : "Right rail supporting information"}">
        <div className="space-y-5 p-4">
          <PageLinks />
          <PageStatus />
        </div>
      </RightRail>
    </div>
  )
}`;
    const statusCode = `${sharedCode}

export function StatusRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">${isJa ? "公開前確認" : "Release review"}</h3>
      </main>
      <RightRail width="w-72">
        <div className="space-y-5 p-4">
          <PageStatus />
        </div>
      </RightRail>
    </div>
  )
}`;
    const linksCode = `${sharedCode}

const relatedLinks = [
  { label: "${isJa ? "公開チェックリスト" : "Release checklist"}", href: "#" },
  { label: "${isJa ? "変更履歴" : "Changelog"}", href: "#" },
  { label: "${isJa ? "担当チーム" : "Owner team"}", href: "#" },
]

function RelatedLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">${isJa ? "関連リンク" : "Related links"}</h3>
      <ul className="space-y-1">
        {relatedLinks.map((item) => (
          <li key={item.label}>
            <a href={item.href} onClick={(event) => event.preventDefault()} className="block rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function LinksRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">${isJa ? "仕様ページ" : "Spec page"}</h3>
      </main>
      <RightRail width="w-72">
        <div className="space-y-5 p-4">
          <RelatedLinks />
          <PageLinks />
        </div>
      </RightRail>
    </div>
  )
}`;

    return (
        <ComponentLayout
            title={isJa ? "右レール" : navigationMetadata.rightRail.title}
            description={isJa
                ? "デスクトップで、主コンテンツの右側に補助情報を置くためのレールです。狭い画面で同じ補助情報を本文内に折りたたむ場合は PageAside を使います。"
                : navigationMetadata.rightRail.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "RightRail", href: "/docs/components/right-rail" },
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            relatedComponents={[
                { name: "PageAside", href: "/docs/components/page-aside" },
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "DocumentPager", href: "/docs/components/document-pager" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/right-rail" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto">
                <RightRailDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "status",
                            title: isJa ? "ページステータス" : "Page status",
                            description: isJa ? "公開状態、最終更新、レビュー状況など、右側で常に参照したい情報をまとめます。" : "Group status such as release state, last update, and review progress.",
                            preview: <RightRailDemo variant="status" />,
                            embedSrc: "/embed/right-rail?variant=status",
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: statusCode,
                        },
                        {
                            key: "links",
                            title: isJa ? "関連リンク" : "Related links",
                            description: isJa ? "本文の流れから外したい関連資料やページ内リンクを右側にまとめます。" : "Collect related references and page links outside the main reading flow.",
                            preview: <RightRailDemo variant="links" />,
                            embedSrc: "/embed/right-rail?variant=links",
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: linksCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={[
                    { name: "width", type: "string", default: "\"w-64\"", description: isJa ? "デスクトップ時のレール幅を指定する Tailwind クラス。" : "Tailwind width class for the desktop rail." },
                    { name: "className", type: "string", description: isJa ? "境界線、背景、高さなどを調整する追加クラス。" : "Additional classes for borders, background, and height." },
                    { name: "children", type: "ReactNode", description: isJa ? "ページ内リンク、ページステータス、関連リンクなどの補助コンテンツ。" : "Supporting content such as page links, page status, or related links." },
                ]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
