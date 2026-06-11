"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { PageAsideDemo } from "@/components/demos/PageAsideDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";

export default function PageAsideDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const sharedCode = `import { Badge, PageAside } from "@gunjo/ui"

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
}

function AsideContent() {
  return (
    <div className="space-y-5">
      <PageLinks />
      <PageStatus />
    </div>
  )
}`;
    const code = `${sharedCode}

export function DocsPageWithAside() {
  return (
    <PageAside
      title="${isJa ? "補助情報" : "Supporting information"}"
      asideLabel="${isJa ? "ページの補助情報" : "Page supporting information"}"
      contentLabel="${isJa ? "主コンテンツ" : "Main content"}"
      mobileDescription="${isJa ? "狭い画面では、右レールの内容を本文内で開閉します。" : "On narrow screens, the right-rail content collapses inside the content area."}"
      openLabel="${isJa ? "補助情報を開く" : "Open supporting information"}"
      closeLabel="${isJa ? "補助情報を閉じる" : "Close supporting information"}"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <AsideContent />}
    >
      <h3 className="text-base font-semibold">${isJa ? "分析レポート" : "Analytics report"}</h3>
      <p className="max-w-xl text-sm text-muted-foreground">
        ${isJa ? "広い画面では補助情報を右側へ、狭い画面では本文内の折りたたみ領域へ配置します。" : "Place supporting information on the right on wide screens and in a collapsible content block on narrow screens."}
      </p>
      <section id="overview" className="rounded-md border bg-background p-3">
        <h4 className="text-sm font-semibold">${isJa ? "概要" : "Overview"}</h4>
      </section>
    </PageAside>
  )
}`;
    const statusCode = `${sharedCode}

export function PageStatusAside() {
  return (
    <PageAside
      title="${isJa ? "補助情報" : "Supporting information"}"
      asideLabel="${isJa ? "ページの補助情報" : "Page supporting information"}"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <PageStatus />}
    >
      <h3 className="text-base font-semibold">${isJa ? "公開前確認" : "Release review"}</h3>
      <p className="text-sm text-muted-foreground">
        ${isJa ? "ページ状態だけを補助領域にまとめます。" : "Keep page status in the supporting region."}
      </p>
    </PageAside>
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

export function RelatedLinksAside() {
  return (
    <PageAside
      title="${isJa ? "補助情報" : "Supporting information"}"
      asideLabel="${isJa ? "ページの補助情報" : "Page supporting information"}"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => (
        <div className="space-y-5">
          <RelatedLinks />
          <PageLinks />
        </div>
      )}
    >
      <h3 className="text-base font-semibold">${isJa ? "仕様ページ" : "Spec page"}</h3>
      <p className="text-sm text-muted-foreground">
        ${isJa ? "関連資料やページ内リンクを補助領域にまとめます。" : "Collect related references and page links in the supporting region."}
      </p>
    </PageAside>
  )
}`;

    return (
        <ComponentLayout
            title={isJa ? "ページ補助" : navigationMetadata.pageAside.title}
            description={isJa
                ? "本文を読みながら参照するページ内リンク、ページステータス、関連リンクを、広い画面では右レール、狭い画面では本文内の折りたたみ領域へ配置します。"
                : navigationMetadata.pageAside.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "PageAside", href: "/docs/components/page-aside" },
                { name: "RightRail", href: "/docs/components/right-rail" },
                { name: "Accordion", href: "/docs/components/accordion" },
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            relatedComponents={[
                { name: "DocumentPager", href: "/docs/components/document-pager" },
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "TextLink", href: "/docs/components/text-link" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/page-aside" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto">
                <PageAsideDemo />
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
                            description: isJa ? "公開状態、最終更新、レビュー状況など、ページを読みながら確認したい情報をまとめます。" : "Group status such as release state, last update, and review progress.",
                            preview: <PageAsideDemo variant="status" />,
                            embedSrc: "/embed/page-aside?variant=status",
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: statusCode,
                        },
                        {
                            key: "links",
                            title: isJa ? "関連リンク" : "Related links",
                            description: isJa ? "本文の流れから外したい関連資料やページ内リンクを補助領域にまとめます。" : "Collect related references and page links outside the main reading flow.",
                            preview: <PageAsideDemo variant="links" />,
                            embedSrc: "/embed/page-aside?variant=links",
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
                    { name: "title", type: "ReactNode", description: isJa ? "モバイルのアコーディオン見出しと補助領域のラベル。" : "Heading for the mobile accordion and supporting region." },
                    { name: "renderAside", type: "() => ReactNode", description: isJa ? "右レールと折りたたみ領域に表示する補助情報を返します。" : "Returns the supporting information rendered in the rail and collapsible area." },
                    { name: "children", type: "ReactNode", description: isJa ? "主コンテンツ領域に表示する本文。" : "Main content rendered in the content area." },
                    { name: "width", type: "string", default: "\"w-72\"", description: isJa ? "デスクトップ時の RightRail 幅を指定する Tailwind クラス。" : "Tailwind width class for the desktop RightRail." },
                    { name: "defaultOpen", type: "boolean", default: "true", description: isJa ? "狭い画面で補助情報を初期表示するか。" : "Whether the supporting information starts open on narrow screens." },
                    { name: "mobileDescription", type: "ReactNode", description: isJa ? "狭い画面の折りたたみ領域に表示する補足説明。" : "Helper description shown inside the narrow-screen collapsible area." },
                    { name: "contentClassName", type: "string", description: isJa ? "本文領域に追加するクラス。" : "Additional classes for the content area." },
                    { name: "railClassName", type: "string", description: isJa ? "デスクトップの RightRail に追加するクラス。" : "Additional classes for the desktop RightRail." },
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
