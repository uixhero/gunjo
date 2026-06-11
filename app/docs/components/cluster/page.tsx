"use client";

import { Badge, Button, Cluster } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const tagsByLocale = {
    en: ["Design", "React", "Docs", "Responsive", "Accessibility", "SSOT", "Preview"],
    ja: ["設計", "React", "ドキュメント", "レスポンシブ", "アクセシビリティ", "SSOT", "プレビュー"],
} as const;

const codeByLocale = {
    en: `import { Badge, Cluster } from "@gunjo/ui";

const tags = ["Design", "React", "Docs", "Responsive", "Accessibility"];

export function TagCluster() {
  return (
    <Cluster gap={2} align="center" justify="start">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </Cluster>
  );
}`,
    ja: `import { Badge, Cluster } from "@gunjo/ui";

const tags = ["設計", "React", "ドキュメント", "レスポンシブ", "アクセシビリティ"];

export function TagCluster() {
  return (
    <Cluster gap={2} align="center" justify="start">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </Cluster>
  );
}`,
} as const;

const actionCodeByLocale = {
    en: `import { Button, Cluster } from "@gunjo/ui";

export function ToolbarActions() {
  return (
    <Cluster gap={2} justify="end">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </Cluster>
  );
}`,
    ja: `import { Button, Cluster } from "@gunjo/ui";

export function ToolbarActions() {
  return (
    <Cluster gap={2} justify="end">
      <Button variant="outline">キャンセル</Button>
      <Button>保存</Button>
    </Cluster>
  );
}`,
} as const;

export default function ClusterPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8", default: "2", description: "子要素同士の余白です。" },
            { name: "align", type: '"start" | "center" | "end" | "baseline"', default: '"center"', description: "折り返し行の交差軸方向の揃え方です。" },
            { name: "justify", type: '"start" | "center" | "end" | "between"', default: '"start"', description: "主軸方向の揃え方です。右寄せ操作群では end を使います。" },
            { name: "className", type: "string", description: "追加の className です。" },
        ]
        : [
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8", default: "2", description: "Spacing between children." },
            { name: "align", type: '"start" | "center" | "end" | "baseline"', default: '"center"', description: "Cross-axis alignment across wrapped rows." },
            { name: "justify", type: '"start" | "center" | "end" | "between"', default: '"start"', description: "Main-axis alignment. Use end for right-aligned action groups." },
            { name: "className", type: "string", description: "Additional class names." },
        ];

    return (
        <ComponentLayout
            title={meta.cluster.title}
            description={meta.cluster.description}
            usedComponents={[
                { name: "Cluster", href: "/docs/components/cluster" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "HStack", href: "/docs/components/h-stack" },
                { name: "VStack", href: "/docs/components/v-stack" },
                { name: "Grid", href: "/docs/components/grid" },
                { name: "Tag", href: "/docs/components/tag" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/cluster" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="md">
                <div className="w-full rounded-lg border bg-background p-4">
                    <Cluster gap={2}>
                        {tagsByLocale[locale].map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </Cluster>
                </div>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <div className="space-y-8">
                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "折り返しタグ" : "Wrapping tags"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja"
                                    ? "タグや短いバッジが増えた時に、行をまたいで自然に折り返します。"
                                    : "Let tags and short badges wrap naturally when the list grows."}
                            </p>
                        </div>
                        <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="md" previewHeight="auto">
                            <div className="w-full rounded-lg border bg-background p-4">
                                <Cluster gap={2}>
                                    {tagsByLocale[locale].map((tag) => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </Cluster>
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "右寄せ操作" : "Right-aligned actions"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja"
                                    ? "フォームやフッターで、キャンセルと保存などの操作を右端にまとめます。"
                                    : "Group cancel and save actions at the end of a form or footer."}
                            </p>
                        </div>
                        <ComponentPreview code={actionCodeByLocale[locale]} codeBlock={<CodeBlock code={actionCodeByLocale[locale]} />} previewBodyWidth="md" previewHeight="auto">
                            <div className="w-full rounded-lg border bg-background p-4">
                                <Cluster gap={2} justify="end">
                                    <Button variant="outline">{locale === "ja" ? "キャンセル" : "Cancel"}</Button>
                                    <Button>{locale === "ja" ? "保存" : "Save"}</Button>
                                </Cluster>
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "中央揃え" : "Centered row"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja"
                                    ? "短い状態ラベルや補助情報を中央に揃えて表示します。"
                                    : "Center short status labels or supporting metadata."}
                            </p>
                        </div>
                        <ComponentPreview code={`<Cluster justify="center" gap={3}>{/* items */}</Cluster>`} codeBlock={<CodeBlock code={`<Cluster justify="center" gap={3}>{/* items */}</Cluster>`} />} previewBodyWidth="md" previewHeight="auto">
                            <div className="w-full rounded-lg border bg-background p-4">
                                <Cluster gap={3} justify="center">
                                    <Badge>{locale === "ja" ? "選択中" : "Selected"}</Badge>
                                    <Badge variant="secondary">{locale === "ja" ? "レビュー中" : "Reviewing"}</Badge>
                                </Cluster>
                            </div>
                        </ComponentPreview>
                    </section>
                </div>
            </section>

            <section className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </section>
        </ComponentLayout>
    );
}
