"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Separator } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Separator } from "@gunjo/ui";

export function Example() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">公開設定</p>
      <Separator />
      <p className="text-sm text-muted-foreground">公開前に内容を確認してください。</p>
    </div>
  );
}`,
    en: `import { Separator } from "@gunjo/ui";

export function Example() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Publish settings</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Review the content before publishing.</p>
    </div>
  );
}`,
} as const;

const verticalCodeByLocale = {
    ja: `import { Separator } from "@gunjo/ui";

export function ToolbarMeta() {
  return (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>下書き</span>
      <Separator orientation="vertical" />
      <span>最終更新 5分前</span>
    </div>
  );
}`,
    en: `import { Separator } from "@gunjo/ui";

export function ToolbarMeta() {
  return (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Draft</span>
      <Separator orientation="vertical" />
      <span>Updated 5 min ago</span>
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "区切り線の向きです。" },
        { name: "className", type: "string", description: "horizontal は親幅いっぱいに広がります。長さは外側の max-w-* や className で制約します。" },
    ],
    en: [
        { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Separator orientation." },
        { name: "className", type: "string", description: "Horizontal separators fill their parent. Constrain length with an outer max-w-* wrapper or className." },
    ],
} as const;

export default function SeparatorPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/separator", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const usageCode = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.separator.title}
            description={content?.description ?? meta.separator.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Separator", href: "/docs/components/separator" },
            ]}
            relatedComponents={[
                { name: "Spacer", href: "/docs/components/spacer" },
                { name: "Card", href: "/docs/components/card" },
                { name: "Table", href: "/docs/components/table" },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="sm" previewHeight="auto">
                <div className="w-full space-y-3">
                    <p className="text-sm font-medium">{locale === "ja" ? "公開設定" : "Publish settings"}</p>
                    <Separator className="w-full" />
                    <p className="text-sm text-muted-foreground">{locale === "ja" ? "公開前に内容を確認してください。" : "Review the content before publishing."}</p>
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "vertical",
                            title: locale === "ja" ? "垂直" : "Vertical",
                            description: locale === "ja"
                                ? "ツールバーやメタ情報の短い区切りには vertical を使います。"
                                : "Use vertical separators between short toolbar or metadata items.",
                            preview: (
                                <div className="flex h-5 items-center gap-3 text-sm">
                                    <span>{locale === "ja" ? "下書き" : "Draft"}</span>
                                    <Separator orientation="vertical" />
                                    <span>{locale === "ja" ? "最終更新 5分前" : "Updated 5 min ago"}</span>
                                </div>
                            ),
                            code: verticalCodeByLocale[locale],
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
                            <strong>既定では読み上げに出ない。</strong>資料は「見た目だけの線は読み上げから飛ばす」「意味のある区切りだけ役割を持たせる」と書いています。GUNJO の Separator は素の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">div</code> を1本描くだけで、役割を持ちません。役割の無い <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">div</code> は読み上げに出ないので、飾りとしては初めから正しい形です。意味のある区切りにしたいときだけ、呼ぶ側で役割を足します。
                        </li>
                        <li>
                            <strong>向きは2つしかなく、その名前は生成物から来る。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">orientation</code> は横と縦の2つで、この鍵は設計の元データから生成された <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SeparatorVariantKey</code> です。既定も生成物の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">separatorDefaultVariantKey</code> から取っています。ソースだけを直しても元データとずれない形にするためで、3つ目の向きを足すには元データの側から変えることになります。
                        </li>
                        <li>
                            <strong>縦線は高さを 1.5rem に決め打ちしてある。</strong>資料は「垂直の区切りはほぼ常に飾り」と書いています。GUNJO の縦線は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-6</code> 固定で、親の高さいっぱいには伸びません。パンくずやメタ情報の並びで、文字の高さに添えて置くのが想定の使い方で、画面を左右に仕切る線としては作っていません。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/separator"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: 区切り線（Separator）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>By default it is invisible to screen readers.</strong> The article asks that purely visual rules be skipped by assistive technology and that only meaningful breaks carry a role. GUNJO renders a plain <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">div</code> with no role at all, and a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">div</code> with no role is already skipped, so the decorative case is correct out of the box. A caller who means a real semantic break adds the role.
                        </li>
                        <li>
                            <strong>There are exactly two orientations, and their names are generated.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">orientation</code> is horizontal or vertical, and those keys come from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SeparatorVariantKey</code>, generated from the design source; the default comes from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">separatorDefaultVariantKey</code>. Editing the React source alone therefore cannot drift from the source of truth, and a third orientation would have to start there.
                        </li>
                        <li>
                            <strong>The vertical rule is fixed at 1.5rem.</strong> The article says a vertical separator is nearly always decorative. GUNJO pins it to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-6</code> rather than stretching to the parent, because it is meant to sit beside text in a breadcrumb or a metadata row, not to divide a layout into columns.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/separator"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Separator (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
