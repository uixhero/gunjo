"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { PageAsideDemo } from "@/components/demos/PageAsideDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";

const codeByLocale = {
    ja: `import { Badge, PageAside } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "概要" },
  { id: "quality", label: "品質指標" },
  { id: "release", label: "公開前確認" },
]

const pageStatuses = [
  { label: "状態", value: "公開前確認", tone: "default" },
  { label: "最終更新", value: "5分前", tone: "secondary" },
  { label: "レビュー", value: "2件対応待ち", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">ページ内</h3>
      <nav aria-label="ページ内リンク">
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
      <h3 className="text-sm font-semibold">ページステータス</h3>
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
}

export function DocsPageWithAside() {
  return (
    <PageAside
      title="補助情報"
      asideLabel="ページの補助情報"
      contentLabel="主コンテンツ"
      mobileDescription="狭い画面では、右レールの内容を本文内で開閉します。"
      openLabel="補助情報を開く"
      closeLabel="補助情報を閉じる"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <AsideContent />}
    >
      <h3 className="text-base font-semibold">分析レポート</h3>
      <p className="max-w-xl text-sm text-muted-foreground">
        広い画面では補助情報を右側へ、狭い画面では本文内の折りたたみ領域へ配置します。
      </p>
      <section id="overview" className="rounded-md border bg-background p-3">
        <h4 className="text-sm font-semibold">概要</h4>
      </section>
    </PageAside>
  )
}`,
    en: `import { Badge, PageAside } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "Overview" },
  { id: "quality", label: "Quality metrics" },
  { id: "release", label: "Release checks" },
]

const pageStatuses = [
  { label: "Status", value: "Pre-release", tone: "default" },
  { label: "Updated", value: "5 min ago", tone: "secondary" },
  { label: "Review", value: "2 pending", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">On this page</h3>
      <nav aria-label="Page sections">
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
      <h3 className="text-sm font-semibold">Page status</h3>
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
}

export function DocsPageWithAside() {
  return (
    <PageAside
      title="Supporting information"
      asideLabel="Page supporting information"
      contentLabel="Main content"
      mobileDescription="On narrow screens, the right-rail content collapses inside the content area."
      openLabel="Open supporting information"
      closeLabel="Close supporting information"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <AsideContent />}
    >
      <h3 className="text-base font-semibold">Analytics report</h3>
      <p className="max-w-xl text-sm text-muted-foreground">
        Place supporting information on the right on wide screens and in a collapsible content block on narrow screens.
      </p>
      <section id="overview" className="rounded-md border bg-background p-3">
        <h4 className="text-sm font-semibold">Overview</h4>
      </section>
    </PageAside>
  )
}`,
};

const statusCodeByLocale = {
    ja: `import { Badge, PageAside } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "概要" },
  { id: "quality", label: "品質指標" },
  { id: "release", label: "公開前確認" },
]

const pageStatuses = [
  { label: "状態", value: "公開前確認", tone: "default" },
  { label: "最終更新", value: "5分前", tone: "secondary" },
  { label: "レビュー", value: "2件対応待ち", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">ページ内</h3>
      <nav aria-label="ページ内リンク">
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
      <h3 className="text-sm font-semibold">ページステータス</h3>
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
}

export function PageStatusAside() {
  return (
    <PageAside
      title="補助情報"
      asideLabel="ページの補助情報"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <PageStatus />}
    >
      <h3 className="text-base font-semibold">公開前確認</h3>
      <p className="text-sm text-muted-foreground">
        ページ状態だけを補助領域にまとめます。
      </p>
    </PageAside>
  )
}`,
    en: `import { Badge, PageAside } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "Overview" },
  { id: "quality", label: "Quality metrics" },
  { id: "release", label: "Release checks" },
]

const pageStatuses = [
  { label: "Status", value: "Pre-release", tone: "default" },
  { label: "Updated", value: "5 min ago", tone: "secondary" },
  { label: "Review", value: "2 pending", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">On this page</h3>
      <nav aria-label="Page sections">
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
      <h3 className="text-sm font-semibold">Page status</h3>
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
}

export function PageStatusAside() {
  return (
    <PageAside
      title="Supporting information"
      asideLabel="Page supporting information"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <PageStatus />}
    >
      <h3 className="text-base font-semibold">Release review</h3>
      <p className="text-sm text-muted-foreground">
        Keep page status in the supporting region.
      </p>
    </PageAside>
  )
}`,
};

const linksCodeByLocale = {
    ja: `import { Badge, PageAside } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "概要" },
  { id: "quality", label: "品質指標" },
  { id: "release", label: "公開前確認" },
]

const pageStatuses = [
  { label: "状態", value: "公開前確認", tone: "default" },
  { label: "最終更新", value: "5分前", tone: "secondary" },
  { label: "レビュー", value: "2件対応待ち", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">ページ内</h3>
      <nav aria-label="ページ内リンク">
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
      <h3 className="text-sm font-semibold">ページステータス</h3>
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
}

const relatedLinks = [
  { label: "公開チェックリスト", href: "#" },
  { label: "変更履歴", href: "#" },
  { label: "担当チーム", href: "#" },
]

function RelatedLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">関連リンク</h3>
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
      title="補助情報"
      asideLabel="ページの補助情報"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => (
        <div className="space-y-5">
          <RelatedLinks />
          <PageLinks />
        </div>
      )}
    >
      <h3 className="text-base font-semibold">仕様ページ</h3>
      <p className="text-sm text-muted-foreground">
        関連資料やページ内リンクを補助領域にまとめます。
      </p>
    </PageAside>
  )
}`,
    en: `import { Badge, PageAside } from "@gunjo/ui"

const pageLinks = [
  { id: "overview", label: "Overview" },
  { id: "quality", label: "Quality metrics" },
  { id: "release", label: "Release checks" },
]

const pageStatuses = [
  { label: "Status", value: "Pre-release", tone: "default" },
  { label: "Updated", value: "5 min ago", tone: "secondary" },
  { label: "Review", value: "2 pending", tone: "secondary" },
]

function PageLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">On this page</h3>
      <nav aria-label="Page sections">
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
      <h3 className="text-sm font-semibold">Page status</h3>
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
}

const relatedLinks = [
  { label: "Release checklist", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Owner team", href: "#" },
]

function RelatedLinks() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">Related links</h3>
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
      title="Supporting information"
      asideLabel="Page supporting information"
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => (
        <div className="space-y-5">
          <RelatedLinks />
          <PageLinks />
        </div>
      )}
    >
      <h3 className="text-base font-semibold">Spec page</h3>
      <p className="text-sm text-muted-foreground">
        Collect related references and page links in the supporting region.
      </p>
    </PageAside>
  )
}`,
};

const narrowCodeByLocale = {
    ja: `import { Badge, PageAside } from "@gunjo/ui"

const pageStatuses = [
  { label: "状態", value: "公開前確認", tone: "default" },
  { label: "最終更新", value: "5分前", tone: "secondary" },
  { label: "レビュー", value: "2件対応待ち", tone: "secondary" },
]

function PageStatus() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">ページステータス</h3>
      <dl className="space-y-1">
        {pageStatuses.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
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

export function NarrowPageAside() {
  return (
    <PageAside
      title="補助情報"
      asideLabel="ページの補助情報"
      contentLabel="主コンテンツ"
      mobileDescription="狭い画面では、右レールの内容を本文内で開閉します。"
      openLabel="補助情報を開く"
      closeLabel="補助情報を閉じる"
      // 既定は開いた状態。長い補助情報は defaultOpen={false} で畳んで始めます。
      defaultOpen
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <PageStatus />}
    >
      <h3 className="text-base font-semibold">分析レポート</h3>
      <p className="max-w-xl text-sm text-muted-foreground">
        広い画面では右側のレール、狭い画面では本文の中の開閉になります。
      </p>
    </PageAside>
  )
}`,
    en: `import { Badge, PageAside } from "@gunjo/ui"

const pageStatuses = [
  { label: "Status", value: "Pre-release", tone: "default" },
  { label: "Updated", value: "5 min ago", tone: "secondary" },
  { label: "Review", value: "2 pending", tone: "secondary" },
]

function PageStatus() {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">Page status</h3>
      <dl className="space-y-1">
        {pageStatuses.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
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

export function NarrowPageAside() {
  return (
    <PageAside
      title="Supporting information"
      asideLabel="Page supporting information"
      contentLabel="Main content"
      mobileDescription="On narrow screens the rail content collapses inside the content area."
      openLabel="Open supporting information"
      closeLabel="Close supporting information"
      // Open by default; pass defaultOpen={false} to start a long aside collapsed.
      defaultOpen
      contentClassName="space-y-4 bg-muted/30 p-4"
      renderAside={() => <PageStatus />}
    >
      <h3 className="text-base font-semibold">Analytics report</h3>
      <p className="max-w-xl text-sm text-muted-foreground">
        A rail on wide screens, a disclosure inside the content on narrow ones.
      </p>
    </PageAside>
  )
}`,
};

export default function PageAsideDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const usageCode = codeByLocale[locale];
    const statusCode = statusCodeByLocale[locale];
    const linksCode = linksCodeByLocale[locale];

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
            <ComponentPreview embedSrc="/embed/page-aside" code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto">
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
                        {
                            key: "narrow",
                            title: isJa ? "狭い画面のとき" : "On a narrow screen",
                            description: isJa
                                ? "lg 未満では右のレールが消え、本文の先頭の開閉領域になります。開閉は details と summary そのままなので、見出しの順番を乱さず、開いているかどうかも読み上げに伝わります。長い補助情報は defaultOpen={false} で畳んで始められます。"
                                : "Below lg the rail disappears and the aside becomes a disclosure at the top of the content. It is a native details/summary, so it adds no out-of-order heading and its open state is announced. Start a long aside collapsed with defaultOpen={false}.",
                            preview: <PageAsideDemo />,
                            embedSrc: "/embed/page-aside",
                            previewBodyWidth: "sm",
                            fitViewport: "mobile",
                            previewHeight: "auto",
                            code: narrowCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={[
                    { name: "title", type: "ReactNode", description: isJa ? "モバイルのアコーディオン見出しと補助領域のラベル。" : "Heading for the mobile accordion and supporting region." },
                    { name: "renderAside", type: "() => ReactNode", description: isJa ? "右レールと折りたたみ領域に表示する補助情報を返します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。JSX を返すため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" : "Returns the supporting information rendered in the rail and collapsible area. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Render props return JSX (no serializable alternative) — wrap in a \"use client\" component to pass from an RSC. (#338)" },
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
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
