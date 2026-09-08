"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

function TabsExample({ withCounts = false, controlled = false }: { withCounts?: boolean; controlled?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [value, setValue] = React.useState("overview");

    if (controlled) {
        return (
            <Tabs value={value} onValueChange={setValue} className="w-full max-w-2xl">
                <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
                    <TabsTrigger value="overview">{isJa ? "概要" : "Overview"}</TabsTrigger>
                    <TabsTrigger value="activity">{isJa ? "アクティビティ" : "Activity"}</TabsTrigger>
                    <TabsTrigger value="settings">{isJa ? "設定" : "Settings"}</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="text-sm text-muted-foreground">
                    {isJa ? "現在選択中のタブは「概要」です。" : "The selected tab is Overview."}
                </TabsContent>
                <TabsContent value="activity" className="text-sm text-muted-foreground">
                    {isJa ? "最近の更新やコメントを確認します。" : "Review recent updates and comments."}
                </TabsContent>
                <TabsContent value="settings" className="text-sm text-muted-foreground">
                    {isJa ? "通知や権限の設定を変更します。" : "Change notification and permission settings."}
                </TabsContent>
            </Tabs>
        );
    }

    return (
        <Tabs defaultValue="overview" className="w-full max-w-2xl">
            <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
                <TabsTrigger value="overview">{isJa ? "概要" : "Overview"}</TabsTrigger>
                <TabsTrigger value="activity" className={withCounts ? "gap-2" : undefined}>
                    {isJa ? "アクティビティ" : "Activity"}
                    {withCounts ? <Badge variant="secondary">12</Badge> : null}
                </TabsTrigger>
                <TabsTrigger value="settings" className={withCounts ? "gap-2" : undefined}>
                    {isJa ? "設定" : "Settings"}
                    {withCounts ? <Badge variant="secondary">3</Badge> : null}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{isJa ? "プロジェクト概要" : "Project overview"}</p>
                <p>{isJa ? "タブで関連する内容を切り替えます。" : "Switch between related sections without leaving the page."}</p>
            </TabsContent>
            <TabsContent value="activity" className="text-sm text-muted-foreground">
                {isJa ? "最新の変更履歴を表示します。" : "Recent activity appears here."}
            </TabsContent>
            <TabsContent value="settings" className="text-sm text-muted-foreground">
                {isJa ? "プロジェクト設定を表示します。" : "Project settings appear here."}
            </TabsContent>
        </Tabs>
    );
}

function UnderlineTabsExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <Tabs defaultValue="preview" className="w-full max-w-2xl border-0">
            <TabsList className="min-h-0 w-full justify-start overflow-x-auto overflow-y-hidden rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                    value="preview"
                    className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-colors data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    {isJa ? "プレビュー" : "Preview"}
                </TabsTrigger>
                <TabsTrigger
                    value="code"
                    className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-colors data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    {isJa ? "コード" : "Code"}
                </TabsTrigger>
                <TabsTrigger
                    value="history"
                    className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-colors data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    {isJa ? "履歴" : "History"}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="px-0 text-sm text-muted-foreground">
                {isJa ? "サイト内のプレビュー切り替えと同じ下線タイプです。" : "Underline tabs match the preview switcher used across the site."}
            </TabsContent>
            <TabsContent value="code" className="px-0 text-sm text-muted-foreground">
                {isJa ? "コードや設定など、隣接する作業面を切り替えます。" : "Switch adjacent working surfaces such as code or settings."}
            </TabsContent>
            <TabsContent value="history" className="px-0 text-sm text-muted-foreground">
                {isJa ? "履歴や変更差分を同じ領域で確認します。" : "Review history and changes in the same area."}
            </TabsContent>
        </Tabs>
    );
}

const codeByLocale = {
    ja: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-2xl">
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="activity">アクティビティ</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-1 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">プロジェクト概要</p>
        <p>タブで関連する内容を切り替えます。</p>
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        最新の変更履歴を表示します。
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        プロジェクト設定を表示します。
      </TabsContent>
    </Tabs>
  )
}`,
    en: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-2xl">
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-1 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Project overview</p>
        <p>Switch between related sections without leaving the page.</p>
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        Recent activity appears here.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Project settings appear here.
      </TabsContent>
    </Tabs>
  )
}`,
};

const countsCodeByLocale = {
    ja: `import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

export function TabsWithCounts() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-2xl">
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="activity" className="gap-2">
          アクティビティ
          <Badge variant="secondary">12</Badge>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          設定
          <Badge variant="secondary">3</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        タブで関連する内容を切り替えます。
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        最新の変更履歴を表示します。
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        プロジェクト設定を表示します。
      </TabsContent>
    </Tabs>
  )
}`,
    en: `import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

export function TabsWithCounts() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-2xl">
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity" className="gap-2">
          Activity
          <Badge variant="secondary">12</Badge>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          Settings
          <Badge variant="secondary">3</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Switch between related sections without leaving the page.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        Recent activity appears here.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Project settings appear here.
      </TabsContent>
    </Tabs>
  )
}`,
};

const controlledCodeByLocale = {
    ja: `import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

export function ControlledTabs() {
  const [value, setValue] = React.useState("overview")

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full max-w-2xl">
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="activity">アクティビティ</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        現在選択中のタブは「概要」です。
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        最近の更新やコメントを確認します。
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        通知や権限の設定を変更します。
      </TabsContent>
    </Tabs>
  )
}`,
    en: `import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

export function ControlledTabs() {
  const [value, setValue] = React.useState("overview")

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full max-w-2xl">
      <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        The selected tab is Overview.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        Review recent updates and comments.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Change notification and permission settings.
      </TabsContent>
    </Tabs>
  )
}`,
};

const underlineCodeByLocale = {
    ja: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

const underlineTriggerClass =
  "relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-colors data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"

export function UnderlineTabs() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-2xl border-0">
      <TabsList className="min-h-0 w-full justify-start overflow-x-auto overflow-y-hidden rounded-none border-b bg-transparent p-0">
        <TabsTrigger value="preview" className={underlineTriggerClass}>
          プレビュー
        </TabsTrigger>
        <TabsTrigger value="code" className={underlineTriggerClass}>
          コード
        </TabsTrigger>
        <TabsTrigger value="history" className={underlineTriggerClass}>
          履歴
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="px-0 text-sm text-muted-foreground">
        サイト内のプレビュー切り替えと同じ下線タイプです。
      </TabsContent>
      <TabsContent value="code" className="px-0 text-sm text-muted-foreground">
        コードや設定など、隣接する作業面を切り替えます。
      </TabsContent>
      <TabsContent value="history" className="px-0 text-sm text-muted-foreground">
        履歴や変更差分を同じ領域で確認します。
      </TabsContent>
    </Tabs>
  )
}`,
    en: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui"

const underlineTriggerClass =
  "relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-colors data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"

export function UnderlineTabs() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-2xl border-0">
      <TabsList className="min-h-0 w-full justify-start overflow-x-auto overflow-y-hidden rounded-none border-b bg-transparent p-0">
        <TabsTrigger value="preview" className={underlineTriggerClass}>
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" className={underlineTriggerClass}>
          Code
        </TabsTrigger>
        <TabsTrigger value="history" className={underlineTriggerClass}>
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="px-0 text-sm text-muted-foreground">
        Underline tabs match the preview switcher used across the site.
      </TabsContent>
      <TabsContent value="code" className="px-0 text-sm text-muted-foreground">
        Switch adjacent working surfaces such as code or settings.
      </TabsContent>
      <TabsContent value="history" className="px-0 text-sm text-muted-foreground">
        Review history and changes in the same area.
      </TabsContent>
    </Tabs>
  )
}`,
};

export default function TabsPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const usageCode = codeByLocale[locale];
    const countsCode = countsCodeByLocale[locale];
    const controlledCode = controlledCodeByLocale[locale];
    const underlineCode = underlineCodeByLocale[locale];

    return (
        <ComponentLayout
            title={navigationMetadata.tabs.title}
            description={navigationMetadata.tabs.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Tabs", href: "/docs/components/tabs" },
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            relatedComponents={[
                { name: "NavigationMenu", href: "/docs/components/navigation-menu" },
                { name: "Command", href: "/docs/components/command" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: タブ（Tabs）" : "UIXHERO: Tabs (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/tabs`,
                },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewBodyWidth="lg" previewHeight="auto">
                <TabsExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-counts",
                            title: isJa ? "件数付き" : "With counts",
                            description: isJa ? "未読数や保留件数をタブ名の横に表示します。" : "Show unread or pending counts directly in tab triggers.",
                            preview: <TabsExample withCounts />,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                            code: countsCode,
                        },
                        {
                            key: "controlled",
                            title: isJa ? "状態管理あり" : "Controlled",
                            description: isJa ? "選択中のタブを URL やアプリ state と同期したい場合は value を制御します。" : "Control value when tabs need to sync with app state or the URL.",
                            preview: <TabsExample controlled />,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                            code: controlledCode,
                        },
                        {
                            key: "underline",
                            title: isJa ? "下線タイプ" : "Underline",
                            description: isJa ? "ページ内のプレビュー切り替えのように、背景を持たず下線で現在地を示します。" : "Use an underline instead of a filled background for page-level switching.",
                            preview: <UnderlineTabsExample />,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                            code: underlineCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "Tabs.defaultValue", type: "string", description: isJa ? "初期表示で選択するタブの value。" : "Initial active tab value." },
                        { name: "Tabs.value", type: "string", description: isJa ? "制御コンポーネントとして扱う場合の現在値。" : "Current value for controlled tabs." },
                        { name: "Tabs.onValueChange", type: "(value: string) => void", description: isJa ? "選択タブが変わった時に呼ばれます。" : "Called when the selected tab changes." },
                        { name: "Tabs.className", type: "string", description: isJa ? "Tabs はデフォルトで親幅いっぱいに広がります。幅は外側または Tabs 自身の max-w-* で制約します。" : "Tabs fills its parent by default. Constrain width with an outer wrapper or max-w-* on Tabs." },
                        { name: "TabsList", type: "div", description: isJa ? "関連するトリガーをまとめるリスト。" : "List wrapper for related triggers." },
                        { name: "TabsTrigger.value", type: "string", description: isJa ? "対応する TabsContent と一致させる値。" : "Value matched with the corresponding TabsContent." },
                        { name: "TabsContent.value", type: "string", description: isJa ? "対応する TabsTrigger と一致させる値。" : "Value matched with the corresponding TabsTrigger." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
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
                            <strong>入りきらないときは、折り返さずに横へ流す。</strong>資料は「2行以上の多段タブ」を禁止に挙げ、同時に「横スクロールが必須になるほどの本数」も崩れた形に挙げています。GUNJO は前者を避けるほうを選び、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">TabsList</code> を横スクロールにしました。日本語のラベルは英語より横に長くなりやすく、折り返すか削るかしかない作りだと、どちらを選んでも読めなくなるからです。ラベルは決して省略しません。
                        </li>
                        <li>
                            <strong>流せるが、つまみは見せない。</strong>横スクロールのつまみは Firefox と WebKit の両方で隠してあります。タブの帯の中に細い横棒が増えると、選ばれているタブの下線と見分けが付かなくなるためです。左端のタブに戻れるように左寄せから始め、収まる幅のときだけ中央に寄せます。
                        </li>
                        <li>
                            <strong>縦向きは見た目ごと入れ替える。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">orientation</code> に縦を渡すと、土台の Radix が付ける印を手がかりに、枠線とカードの見た目を捨てて左の柱と本文の2列になります（#165）。呼ぶ側が <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code> で作り直さずに済ませるためで、資料の「タブの中にタブを作らない」を守ったまま、項目の多い画面を柱で表せます。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>When they do not fit, they scroll sideways rather than wrap.</strong> The article forbids tab bars that wrap onto a second row, and also lists needing horizontal scroll as a sign of too many tabs. GUNJO chose to avoid the first: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">TabsList</code> scrolls horizontally. Japanese labels run wider than English ones, and a bar that can only wrap or truncate becomes unreadable either way. Labels are never truncated.
                        </li>
                        <li>
                            <strong>It scrolls, but the scrollbar is hidden.</strong> The horizontal thumb is suppressed in both Firefox and WebKit, because another thin bar inside the tab strip is easily confused with the underline of the selected tab. The list starts left aligned so the first tab stays reachable, and only centres when everything fits.
                        </li>
                        <li>
                            <strong>Vertical orientation swaps the whole look.</strong> Pass a vertical <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">orientation</code> and the component reads the marker Radix sets, drops the bordered card treatment, and becomes a left rail plus content (#165). That saves callers from rebuilding it in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code>, and lets a screen with many sections use a rail while still honouring the article rule against tabs inside tabs.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
