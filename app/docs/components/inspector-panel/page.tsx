"use client";

import { Button, HStack, Input, InspectorField, InspectorPanel, InspectorSection, Switch } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const codeByLocale = {
    en: `import {
  Button,
  HStack,
  Input,
  InspectorField,
  InspectorPanel,
  InspectorSection,
  Switch,
} from "@gunjo/ui";

export function ShapeInspector() {
  return (
    <InspectorPanel
      title="Rectangle 1"
      className="h-[420px] w-[320px] rounded-lg border shadow-sm"
      footer={
        <HStack justify="between" className="w-full">
          <Button variant="ghost" size="sm">Reset</Button>
          <Button size="sm">Apply</Button>
        </HStack>
      }
    >
      <InspectorSection title="Layout">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
          <InspectorField label="X"><Input defaultValue="24" className="h-8 w-full min-w-0" /></InspectorField>
          <InspectorField label="Y"><Input defaultValue="48" className="h-8 w-full min-w-0" /></InspectorField>
          <InspectorField label="W"><Input defaultValue="240" className="h-8 w-full min-w-0" /></InspectorField>
          <InspectorField label="H"><Input defaultValue="160" className="h-8 w-full min-w-0" /></InspectorField>
        </div>
      </InspectorSection>
      <InspectorSection title="Appearance">
        <InspectorField label="Fill"><Input defaultValue="Primary" className="h-8 w-full min-w-0" /></InspectorField>
        <HStack justify="between">
          <span className="text-xs text-foreground">Visible</span>
          <Switch defaultChecked />
        </HStack>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
    ja: `import {
  Button,
  HStack,
  Input,
  InspectorField,
  InspectorPanel,
  InspectorSection,
  Switch,
} from "@gunjo/ui";

export function ShapeInspector() {
  return (
    <InspectorPanel
      title="長方形 1"
      className="h-[420px] w-[320px] rounded-lg border shadow-sm"
      footer={
        <HStack justify="between" className="w-full">
          <Button variant="ghost" size="sm">リセット</Button>
          <Button size="sm">適用</Button>
        </HStack>
      }
    >
      <InspectorSection title="レイアウト">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
          <InspectorField label="X"><Input defaultValue="24" className="h-8 w-full min-w-0" /></InspectorField>
          <InspectorField label="Y"><Input defaultValue="48" className="h-8 w-full min-w-0" /></InspectorField>
          <InspectorField label="W"><Input defaultValue="240" className="h-8 w-full min-w-0" /></InspectorField>
          <InspectorField label="H"><Input defaultValue="160" className="h-8 w-full min-w-0" /></InspectorField>
        </div>
      </InspectorSection>
      <InspectorSection title="外観">
        <InspectorField label="塗り"><Input defaultValue="Primary" className="h-8 w-full min-w-0" /></InspectorField>
        <HStack justify="between">
          <span className="text-xs text-foreground">表示</span>
          <Switch defaultChecked />
        </HStack>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        compact: `import {
  InspectorField,
  InspectorPanel,
  InspectorSection,
  Input,
} from "@gunjo/ui";

export function TextLayerInspector() {
  return (
    <InspectorPanel
      title="Text layer"
      className="h-[320px] w-[280px] rounded-lg border"
    >
      <InspectorSection title="Typography">
        <InspectorField label="Font size">
          <Input defaultValue="16" className="h-8 w-full min-w-0" />
        </InspectorField>
        <InspectorField label="Weight">
          <Input defaultValue="Medium" className="h-8 w-full min-w-0" />
        </InspectorField>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
        customHeader: `import {
  Button,
  HStack,
  InspectorField,
  InspectorPanel,
  InspectorSection,
  Input,
} from "@gunjo/ui";

export function ImageSettingsInspector() {
  return (
    <InspectorPanel
      className="h-[360px] w-[320px] rounded-lg border"
      header={
        <HStack justify="between" className="border-b bg-muted/30 px-4 py-3">
          <span className="text-sm font-semibold">Image settings</span>
          <Button size="sm" variant="outline">Replace</Button>
        </HStack>
      }
    >
      <InspectorSection title="Asset">
        <InspectorField label="File name">
          <Input defaultValue="hero-cover.jpg" className="h-8 w-full min-w-0" />
        </InspectorField>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
        footerless: `import {
  InspectorPanel,
  InspectorSection,
} from "@gunjo/ui";

export function ReadOnlyMetadataInspector() {
  return (
    <InspectorPanel
      title="Read-only metadata"
      className="h-[280px] w-[320px] rounded-lg border"
    >
      <InspectorSection title="Details">
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Type</dt>
            <dd>PNG</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Size</dt>
            <dd>2.4 MB</dd>
          </div>
        </dl>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
    },
    ja: {
        compact: `import {
  InspectorField,
  InspectorPanel,
  InspectorSection,
  Input,
} from "@gunjo/ui";

export function TextLayerInspector() {
  return (
    <InspectorPanel
      title="テキストレイヤー"
      className="h-[320px] w-[280px] rounded-lg border"
    >
      <InspectorSection title="タイポグラフィ">
        <InspectorField label="文字サイズ">
          <Input defaultValue="16" className="h-8 w-full min-w-0" />
        </InspectorField>
        <InspectorField label="太さ">
          <Input defaultValue="Medium" className="h-8 w-full min-w-0" />
        </InspectorField>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
        customHeader: `import {
  Button,
  HStack,
  InspectorField,
  InspectorPanel,
  InspectorSection,
  Input,
} from "@gunjo/ui";

export function ImageSettingsInspector() {
  return (
    <InspectorPanel
      className="h-[360px] w-[320px] rounded-lg border"
      header={
        <HStack justify="between" className="border-b bg-muted/30 px-4 py-3">
          <span className="text-sm font-semibold">画像設定</span>
          <Button size="sm" variant="outline">差し替え</Button>
        </HStack>
      }
    >
      <InspectorSection title="アセット">
        <InspectorField label="ファイル名">
          <Input defaultValue="hero-cover.jpg" className="h-8 w-full min-w-0" />
        </InspectorField>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
        footerless: `import {
  InspectorPanel,
  InspectorSection,
} from "@gunjo/ui";

export function ReadOnlyMetadataInspector() {
  return (
    <InspectorPanel
      title="読み取り専用メタデータ"
      className="h-[280px] w-[320px] rounded-lg border"
    >
      <InspectorSection title="詳細">
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">形式</dt>
            <dd>PNG</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">サイズ</dt>
            <dd>2.4 MB</dd>
          </div>
        </dl>
      </InspectorSection>
    </InspectorPanel>
  );
}`,
    },
} as const;

function ShapeInspectorPreview() {
    const { locale } = useLocale();
    return (
        <InspectorPanel
            title={locale === "ja" ? "長方形 1" : "Rectangle 1"}
            className="h-[420px] w-[320px] rounded-lg border shadow-sm"
            footer={
                <HStack justify="between" className="w-full">
                    <Button variant="ghost" size="sm">{locale === "ja" ? "リセット" : "Reset"}</Button>
                    <Button size="sm">{locale === "ja" ? "適用" : "Apply"}</Button>
                </HStack>
            }
        >
            <InspectorSection title={locale === "ja" ? "レイアウト" : "Layout"}>
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                    <InspectorField label="X"><Input defaultValue="24" className="h-8 w-full min-w-0" /></InspectorField>
                    <InspectorField label="Y"><Input defaultValue="48" className="h-8 w-full min-w-0" /></InspectorField>
                    <InspectorField label="W"><Input defaultValue="240" className="h-8 w-full min-w-0" /></InspectorField>
                    <InspectorField label="H"><Input defaultValue="160" className="h-8 w-full min-w-0" /></InspectorField>
                </div>
            </InspectorSection>
            <InspectorSection title={locale === "ja" ? "外観" : "Appearance"}>
                <InspectorField label={locale === "ja" ? "塗り" : "Fill"}><Input defaultValue="Primary" className="h-8 w-full min-w-0" /></InspectorField>
                <HStack justify="between">
                    <span className="text-xs text-foreground">{locale === "ja" ? "表示" : "Visible"}</span>
                    <Switch defaultChecked />
                </HStack>
            </InspectorSection>
        </InspectorPanel>
    );
}

export default function InspectorPanelPage() {
    const { locale } = useLocale();
    const usageCode = codeByLocale[locale];
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "title", type: "string", description: "標準ヘッダーに表示するタイトルです。" },
            { name: "header", type: "React.ReactNode", description: "title の代わりに描画するカスタムヘッダーです。" },
            { name: "footer", type: "React.ReactNode", description: "下部に固定表示する操作領域です。" },
            { name: "children", type: "React.ReactNode", description: "セクションやフィールドを含む本文です。" },
            { name: "className", type: "string", description: "サイズや枠線などを調整する追加 className です。" },
        ]
        : [
            { name: "title", type: "string", description: "Title rendered in the default header." },
            { name: "header", type: "React.ReactNode", description: "Custom header rendered instead of title." },
            { name: "footer", type: "React.ReactNode", description: "Fixed action area at the bottom of the panel." },
            { name: "children", type: "React.ReactNode", description: "Panel body with sections and fields." },
            { name: "className", type: "string", description: "Additional class names for sizing or border treatment." },
        ];

    return (
        <ComponentLayout
            title={locale === "ja" ? "インスペクター" : meta.inspectorPanel.title}
            description={locale === "ja" ? "選択中の対象に紐づくプロパティを、セクションとフィールドで閲覧・編集するパネルです。" : meta.inspectorPanel.description}
            usedComponents={[
                { name: "InspectorPanel", href: "/docs/components/inspector-panel" },
                { name: "InspectorSection", href: "/docs/components/inspector-panel" },
                { name: "InspectorField", href: "/docs/components/inspector-panel" },
            ]}
            relatedComponents={[
                { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
                { name: "FloatingPanel", href: "/docs/components/floating-panel" },
                { name: "Input", href: "/docs/components/inputs" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: インスペクターパネル（Inspector Panel）" : "UIXHERO: Inspector Panel (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/inspector-panel`,
                },
            ]}
        >
            <ComponentPreview embedSrc="/embed/inspector-panel" code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md" previewHeight="auto">
                <ShapeInspectorPreview />
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default-panel",
                            title: locale === "ja" ? "標準表示" : "Default panel",
                            description: locale === "ja" ? "ヘッダー、本文、フッター操作を持つプロパティ編集パネルです。" : "A property editing panel with header, body, and footer actions.",
                            code: usageCode,
                            previewBodyWidth: "md",
                            preview: (
                                <ShapeInspectorPreview />
                            ),
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja" ? "小さなサイドパネルで少数の設定を扱います。" : "Use a smaller side panel for a short set of settings.",
                            code: stateCodeByLocale[locale].compact,
                            previewBodyWidth: "md",
                            preview: (
                                <InspectorPanel title={locale === "ja" ? "テキストレイヤー" : "Text layer"} className="h-[320px] w-[280px] rounded-lg border">
                                    <InspectorSection title={locale === "ja" ? "タイポグラフィ" : "Typography"}>
                                        <InspectorField label={locale === "ja" ? "文字サイズ" : "Font size"}><Input defaultValue="16" className="h-8 w-full min-w-0" /></InspectorField>
                                        <InspectorField label={locale === "ja" ? "太さ" : "Weight"}><Input defaultValue="Medium" className="h-8 w-full min-w-0" /></InspectorField>
                                    </InspectorSection>
                                </InspectorPanel>
                            ),
                        },
                        {
                            key: "custom-header",
                            title: locale === "ja" ? "カスタムヘッダー" : "Custom header",
                            description: locale === "ja" ? "ヘッダー内に補助操作を置きたい場合は header を差し替えます。" : "Replace the header when it needs supporting actions.",
                            code: stateCodeByLocale[locale].customHeader,
                            previewBodyWidth: "md",
                            preview: (
                                <InspectorPanel
                                    className="h-[360px] w-[320px] rounded-lg border"
                                    header={
                                        <HStack justify="between" className="border-b bg-muted/30 px-4 py-3">
                                            <span className="text-sm font-semibold">{locale === "ja" ? "画像設定" : "Image settings"}</span>
                                            <Button size="sm" variant="outline">{locale === "ja" ? "差し替え" : "Replace"}</Button>
                                        </HStack>
                                    }
                                >
                                    <InspectorSection title={locale === "ja" ? "アセット" : "Asset"}>
                                        <InspectorField label={locale === "ja" ? "ファイル名" : "File name"}>
                                            <Input defaultValue="hero-cover.jpg" className="h-8 w-full min-w-0" />
                                        </InspectorField>
                                    </InspectorSection>
                                </InspectorPanel>
                            ),
                        },
                        {
                            key: "without-footer",
                            title: locale === "ja" ? "フッターなし" : "Without footer",
                            description: locale === "ja" ? "読み取り専用の補助情報では、フッター操作を省略できます。" : "Omit footer actions for read-only supporting information.",
                            code: stateCodeByLocale[locale].footerless,
                            previewBodyWidth: "md",
                            preview: (
                                <InspectorPanel title={locale === "ja" ? "読み取り専用メタデータ" : "Read-only metadata"} className="h-[280px] w-[320px] rounded-lg border">
                                    <InspectorSection title={locale === "ja" ? "詳細" : "Details"}>
                                        <dl className="grid gap-2 text-sm">
                                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{locale === "ja" ? "形式" : "Type"}</dt><dd>PNG</dd></div>
                                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{locale === "ja" ? "サイズ" : "Size"}</dt><dd>2.4 MB</dd></div>
                                        </dl>
                                    </InspectorSection>
                                </InspectorPanel>
                            ),
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>縦に流れるのは真ん中だけ。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorPanel</code> は題の行・中身・脚の3段で、流れるのは中身だけです。長い設定を下まで見ても、何を選んでいるかを示す題の行と、下の操作は動きません。横には流れないようにしてあります。
                        </li>
                        <li>
                            <strong>ラベルは列で揃えず、上に積む。</strong>資料はラベルの列幅を64pxのように揃えることを勧めています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorField</code> はラベルを入力欄の上に置く形にしました。日本語のラベルは長さの幅が大きく、固定の列にすると折り返すか切れるからです。上に積めば、ラベルの長さに関係なく入力欄の左端が揃います。
                        </li>
                        <li>
                            <strong>3段に分けて、平らに並べない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorPanel</code>（枠）・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorSection</code>（群の見出し）・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorField</code>（1つの値）の3つに分かれています。設定を平らに並べず、意味のまとまりごとに <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorSection</code> で区切ります。選んだものが変わったら遅れなく差し替える、という判断は資料に書いてあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Only the middle scrolls.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorPanel</code> is three bands: title row, body, footer. Only the body scrolls, so the row that says what is selected and the controls at the bottom stay put however long the settings run. Horizontal scrolling is closed off.
                        </li>
                        <li>
                            <strong>Labels stack above the field instead of sharing a column.</strong> The article recommends a shared label column of a fixed width such as 64px. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorField</code> puts the label above the control instead, because Japanese labels vary a lot in length and a fixed column either wraps them or clips them. Stacking keeps the left edge of every field aligned whatever the label length.
                        </li>
                        <li>
                            <strong>Three levels, so nothing is a flat list.</strong> The parts are <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorPanel</code> for the frame, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorSection</code> for a group heading, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorField</code> for a single value. Properties are grouped by meaning with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">InspectorSection</code> rather than listed flat. Swapping the contents the instant the selection changes is covered in the article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
