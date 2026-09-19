"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { RightRailDemo } from "@/components/demos/RightRailDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { RightRail } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const codeByLocale = {
    ja: `import { Badge, RightRail } from "@gunjo/ui"

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

export function DesktopRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4" aria-label="主コンテンツ">
        <p className="max-w-xl text-sm text-muted-foreground">
          主コンテンツの右側に、参照用の補助情報を固定幅で並べます。
        </p>
      </main>

      <RightRail width="w-72" aria-label="右レールの補助情報">
        <div className="space-y-5 p-4">
          <PageLinks />
          <PageStatus />
        </div>
      </RightRail>
    </div>
  )
}`,
    en: `import { Badge, RightRail } from "@gunjo/ui"

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

export function DesktopRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4" aria-label="Main content">
        <p className="max-w-xl text-sm text-muted-foreground">
          Supporting information sits beside the main content in a fixed-width rail.
        </p>
      </main>

      <RightRail width="w-72" aria-label="Right rail supporting information">
        <div className="space-y-5 p-4">
          <PageLinks />
          <PageStatus />
        </div>
      </RightRail>
    </div>
  )
}`,
};

const statusCodeByLocale = {
    ja: `import { Badge, RightRail } from "@gunjo/ui"

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

export function StatusRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">公開前確認</h3>
      </main>
      <RightRail width="w-72">
        <div className="space-y-5 p-4">
          <PageStatus />
        </div>
      </RightRail>
    </div>
  )
}`,
    en: `import { Badge, RightRail } from "@gunjo/ui"

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

export function StatusRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">Release review</h3>
      </main>
      <RightRail width="w-72">
        <div className="space-y-5 p-4">
          <PageStatus />
        </div>
      </RightRail>
    </div>
  )
}`,
};

const linksCodeByLocale = {
    ja: `import { Badge, RightRail } from "@gunjo/ui"

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

export function LinksRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">仕様ページ</h3>
      </main>
      <RightRail width="w-72">
        <div className="space-y-5 p-4">
          <RelatedLinks />
          <PageLinks />
        </div>
      </RightRail>
    </div>
  )
}`,
    en: `import { Badge, RightRail } from "@gunjo/ui"

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

export function LinksRightRail() {
  return (
    <div className="flex min-h-[360px] min-w-[680px] overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">Spec page</h3>
      </main>
      <RightRail width="w-72">
        <div className="space-y-5 p-4">
          <RelatedLinks />
          <PageLinks />
        </div>
      </RightRail>
    </div>
  )
}`,
};

const REVISIONS = [
    { id: "r12", ja: "10:42 白石が公開前確認を通した", en: "10:42 Shiraishi passed the release check" },
    { id: "r11", ja: "10:20 中村が図版を差し替えた", en: "10:20 Nakamura swapped the diagram" },
    { id: "r10", ja: "09:58 白石が見出しを直した", en: "09:58 Shiraishi rewrote the heading" },
    { id: "r09", ja: "09:31 中村が本文を足した", en: "09:31 Nakamura added body copy" },
    { id: "r08", ja: "09:04 白石が下書きを作った", en: "09:04 Shiraishi created the draft" },
    { id: "r07", ja: "前日 18:22 中村が構成を決めた", en: "Yesterday 18:22 Nakamura set the outline" },
    { id: "r06", ja: "前日 17:40 白石が担当を割り当てた", en: "Yesterday 17:40 Shiraishi assigned owners" },
    { id: "r05", ja: "前日 16:05 中村が題材を提案した", en: "Yesterday 16:05 Nakamura proposed the topic" },
];

/** レールの中だけをスクロールさせる形。min-h-0 があるので中身が伸びても本文は押されない。 */
function ScrollingRightRailDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="w-full overflow-x-auto rounded-md border bg-background">
            <div className="flex min-w-[680px]">
                <main className="min-w-0 flex-1 space-y-3 bg-muted/30 p-4">
                    <h3 className="text-base font-semibold">{isJa ? "仕様ページ" : "Spec page"}</h3>
                    <p className="max-w-xl text-sm text-muted-foreground">
                        {isJa
                            ? "更新の記録が何十件あっても、本文の側は動きません。伸びるのはレールの中だけです。"
                            : "However long the revision list grows, the main column does not move — only the rail scrolls."}
                    </p>
                </main>
                <RightRail width="w-56" aria-label={isJa ? "更新の記録" : "Revision history"}>
                    <div className="border-b border-border p-3">
                        <h4 className="text-sm font-semibold">{isJa ? "更新の記録" : "Revision history"}</h4>
                    </div>
                    <ul className="max-h-48 min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
                        {REVISIONS.map((item) => (
                            <li key={item.id} className="rounded-sm px-2 py-1.5 text-xs text-muted-foreground">
                                {isJa ? item.ja : item.en}
                            </li>
                        ))}
                    </ul>
                </RightRail>
            </div>
        </div>
    );
}

const scrollingCodeByLocale = {
    ja: `import { RightRail } from "@gunjo/ui"

const revisions = [
  { id: "r12", label: "10:42 白石が公開前確認を通した" },
  { id: "r11", label: "10:20 中村が図版を差し替えた" },
  { id: "r10", label: "09:58 白石が見出しを直した" },
  { id: "r09", label: "09:31 中村が本文を足した" },
  { id: "r08", label: "09:04 白石が下書きを作った" },
  { id: "r07", label: "前日 18:22 中村が構成を決めた" },
  { id: "r06", label: "前日 17:40 白石が担当を割り当てた" },
  { id: "r05", label: "前日 16:05 中村が題材を提案した" },
]

export function RevisionRail() {
  return (
    <div className="flex overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">仕様ページ</h3>
      </main>
      <RightRail width="w-56" aria-label="更新の記録">
        <div className="border-b border-border p-3">
          <h4 className="text-sm font-semibold">更新の記録</h4>
        </div>
        {/* 上限と overflow-y-auto を渡した欄だけが伸び縮みします。
            RightRail 自体が min-h-0 を持つので、外側で高さを決めている
            画面では max-h-* を外し、flex-1 だけで同じ形になります。 */}
        <ul className="max-h-48 min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {revisions.map((item) => (
            <li key={item.id} className="rounded-sm px-2 py-1.5 text-xs text-muted-foreground">
              {item.label}
            </li>
          ))}
        </ul>
      </RightRail>
    </div>
  )
}`,
    en: `import { RightRail } from "@gunjo/ui"

const revisions = [
  { id: "r12", label: "10:42 Shiraishi passed the release check" },
  { id: "r11", label: "10:20 Nakamura swapped the diagram" },
  { id: "r10", label: "09:58 Shiraishi rewrote the heading" },
  { id: "r09", label: "09:31 Nakamura added body copy" },
  { id: "r08", label: "09:04 Shiraishi created the draft" },
  { id: "r07", label: "Yesterday 18:22 Nakamura set the outline" },
  { id: "r06", label: "Yesterday 17:40 Shiraishi assigned owners" },
  { id: "r05", label: "Yesterday 16:05 Nakamura proposed the topic" },
]

export function RevisionRail() {
  return (
    <div className="flex overflow-x-auto rounded-md border bg-background">
      <main className="min-w-0 flex-1 bg-muted/30 p-4">
        <h3 className="text-base font-semibold">Spec page</h3>
      </main>
      <RightRail width="w-56" aria-label="Revision history">
        <div className="border-b border-border p-3">
          <h4 className="text-sm font-semibold">Revision history</h4>
        </div>
        {/* Only the region given a cap and overflow-y-auto scrolls. RightRail
            carries min-h-0, so on a screen whose layout already has a definite
            height you can drop max-h-* and keep flex-1 alone. */}
        <ul className="max-h-48 min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {revisions.map((item) => (
            <li key={item.id} className="rounded-sm px-2 py-1.5 text-xs text-muted-foreground">
              {item.label}
            </li>
          ))}
        </ul>
      </RightRail>
    </div>
  )
}`,
};

export default function RightRailDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const usageCode = codeByLocale[locale];
    const statusCode = statusCodeByLocale[locale];
    const linksCode = linksCodeByLocale[locale];
    const scrollingCode = scrollingCodeByLocale[locale];

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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: ライトレール（Right Rail）" : "UIXHERO: Right Rail (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/right-rail`,
                },
            ]}
        >
            <ComponentPreview embedSrc="/embed/right-rail" code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto">
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
                        {
                            key: "scrolling",
                            title: isJa ? "レールの中だけをスクロールさせる" : "Scrolling inside the rail",
                            description: isJa
                                ? "RightRail は h-full と min-h-0 を持つ縦並びの箱なので、中の欄に上限と overflow-y-auto を渡すと、そこだけがスクロールします。更新の記録が何十件になっても本文の高さは変わりません。幅は width で狭められます（ここでは w-56）。"
                                : "RightRail is an h-full column carrying min-h-0, so a region given a cap and overflow-y-auto is the only thing that scrolls — the main column keeps its height however long the list gets. width narrows the rail; w-56 here.",
                            preview: <ScrollingRightRailDemo />,
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: scrollingCode,
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
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>幅を props で1つだけ持たせた。</strong>資料は「Right Rail の幅はメインの3分の1以下」を挙げています。GUNJO は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">width</code> を Tailwind のクラス文字列として受け取り、既定を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">w-64</code>（256px）にしました。比率ではなく固定幅にしたのは、レールに載せるもの（目次・関連情報・補足）が横に広がってもほとんど得をしないからです。
                        </li>
                        <li>
                            <strong>貼り付き（sticky）は部品に入れていない。</strong>資料は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sticky</code> での固定を挙げていますが、貼り付く相手はレールそのものではなく外側のレイアウトです。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RightRail</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-full</code> の縦並びの箱で、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min-h-0</code> を持つのでこの中だけをスクロールさせられます。貼り付かせるかどうかは、置く側が決めます。
                        </li>
                        <li>
                            <strong>狭い画面での並べ替えは持っていません。</strong>資料は「モバイルでは Right Rail を本文の下に移す」を挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RightRail</code> にその切り替えは入っていないので、いまは親側で <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">flex-col lg:flex-row</code> のように組み替えることになります。ここは部品に上げる余地が残っている場所です。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>One prop for the width, and that is all.</strong> The article asks that a right rail stay under a third of the main column. GUNJO takes <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">width</code> as a Tailwind class string and defaults to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">w-64</code> (256px). A fixed width rather than a ratio, because what goes in a rail (a table of contents, related links, small notes) gains almost nothing from extra horizontal space.
                        </li>
                        <li>
                            <strong>Stickiness is not in the component.</strong> The article recommends <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sticky</code> positioning, but the thing that sticks is the surrounding layout, not the rail itself. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RightRail</code> is an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-full</code> column with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min-h-0</code>, so it can scroll on its own; whether it sticks is decided by whoever places it.
                        </li>
                        <li>
                            <strong>Reflowing on narrow screens is not handled.</strong> The article asks that the rail move below the main content on mobile. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RightRail</code> has no such switch, so for now the parent does it with something like <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">flex-col lg:flex-row</code>. This is a gap that could reasonably move into the component later.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
