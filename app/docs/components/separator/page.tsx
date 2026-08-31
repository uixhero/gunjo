"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Separator } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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

const semanticCodeByLocale = {
    ja: `import { Separator } from "@gunjo/ui";

export function SettingsSections() {
  return (
    <div className="w-full space-y-3">
      <p className="text-sm font-medium">アカウント</p>
      {/* 章が変わる区切り＝読み上げにも出す。 */}
      <Separator role="separator" aria-orientation="horizontal" />
      <p className="text-sm font-medium">通知</p>
    </div>
  );
}`,
    en: `import { Separator } from "@gunjo/ui";

export function SettingsSections() {
  return (
    <div className="w-full space-y-3">
      <p className="text-sm font-medium">Account</p>
      {/* A real section break — announce it too. */}
      <Separator role="separator" aria-orientation="horizontal" />
      <p className="text-sm font-medium">Notifications</p>
    </div>
  );
}`,
} as const;

const betweenRowsCodeByLocale = {
    ja: `import { Separator } from "@gunjo/ui";

const MEMBERS = [
  { id: "a", name: "受付", count: 3 },
  { id: "b", name: "調理", count: 5 },
  { id: "c", name: "配達", count: 2 },
];

export function MemberList() {
  return (
    <div className="w-full rounded-lg border">
      {MEMBERS.map((member, index) => (
        <div key={member.id}>
          {index > 0 ? <Separator /> : null}
          <div className="flex items-center justify-between px-4 py-2 text-sm">
            <span>{member.name}</span>
            <span className="text-muted-foreground">{member.count}人</span>
          </div>
        </div>
      ))}
    </div>
  );
}`,
    en: `import { Separator } from "@gunjo/ui";

const MEMBERS = [
  { id: "a", name: "Front desk", count: 3 },
  { id: "b", name: "Kitchen", count: 5 },
  { id: "c", name: "Delivery", count: 2 },
];

export function MemberList() {
  return (
    <div className="w-full rounded-lg border">
      {MEMBERS.map((member, index) => (
        <div key={member.id}>
          {index > 0 ? <Separator /> : null}
          <div className="flex items-center justify-between px-4 py-2 text-sm">
            <span>{member.name}</span>
            <span className="text-muted-foreground">{member.count}</span>
          </div>
        </div>
      ))}
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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: 区切り線（Separator）" : "UIXHERO: Separator (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/separator`,
                },
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
                        {
                            key: "semantic",
                            title: locale === "ja" ? "意味のある区切りとして読ませる" : "Announcing a real section break",
                            description: locale === "ja"
                                ? "既定では役割を持たないので読み上げに出ません。飾りではなく章の切れ目なら、呼ぶ側で role=\"separator\" を足します。見た目は変わりません。"
                                : "With no role of its own the rule is skipped by screen readers. When it marks a real section break rather than decoration, the caller adds role=\"separator\" — the look is unchanged.",
                            preview: (
                                <div className="w-full space-y-3">
                                    <p className="text-sm font-medium">{locale === "ja" ? "アカウント" : "Account"}</p>
                                    <Separator role="separator" aria-orientation="horizontal" className="w-full" />
                                    <p className="text-sm font-medium">{locale === "ja" ? "通知" : "Notifications"}</p>
                                </div>
                            ),
                            code: semanticCodeByLocale[locale],
                            previewBodyWidth: "sm",
                        },
                        {
                            key: "between-rows",
                            title: locale === "ja" ? "行と行のあいだだけに入れる" : "Only between rows",
                            description: locale === "ja"
                                ? "一覧で使うときは、行の数だけ引くのではなく先頭の行を飛ばします。末尾に線が余ると、続きがあるように見えます。"
                                : "In a list, skip the first row instead of drawing one rule per row — a trailing rule reads as if more rows follow.",
                            preview: (
                                <div className="w-full rounded-lg border">
                                    {[
                                        { id: "a", name: locale === "ja" ? "受付" : "Front desk", count: 3 },
                                        { id: "b", name: locale === "ja" ? "調理" : "Kitchen", count: 5 },
                                        { id: "c", name: locale === "ja" ? "配達" : "Delivery", count: 2 },
                                    ].map((member, index) => (
                                        <div key={member.id}>
                                            {index > 0 ? <Separator className="w-full" /> : null}
                                            <div className="flex items-center justify-between px-4 py-2 text-sm">
                                                <span>{member.name}</span>
                                                <span className="text-muted-foreground">
                                                    {locale === "ja" ? `${member.count}人` : member.count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                            code: betweenRowsCodeByLocale[locale],
                            previewBodyWidth: "sm",
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
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
