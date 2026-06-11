"use client";

import { Button, Input, Label, VStack } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const codeByLocale = {
    en: `import { Button, Input, Label, VStack } from "@gunjo/ui";

export function AccountFormStack() {
  return (
    <VStack gap={4} className="w-full max-w-sm rounded-md border bg-background p-4">
      <VStack gap={2}>
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Gunjo UI" className="w-full" />
      </VStack>
      <VStack gap={2}>
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue="team@example.com" className="w-full" />
      </VStack>
      <Button className="self-start">Save</Button>
    </VStack>
  );
}`,
    ja: `import { Button, Input, Label, VStack } from "@gunjo/ui";

export function AccountFormStack() {
  return (
    <VStack gap={4} className="w-full max-w-sm rounded-md border bg-background p-4">
      <VStack gap={2}>
        <Label htmlFor="name">名前</Label>
        <Input id="name" defaultValue="Gunjo UI" className="w-full" />
      </VStack>
      <VStack gap={2}>
        <Label htmlFor="email">メール</Label>
        <Input id="email" defaultValue="team@example.com" className="w-full" />
      </VStack>
      <Button className="self-start">保存</Button>
    </VStack>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        form: codeByLocale.en,
        center: `import { VStack } from "@gunjo/ui";

export function CenteredStack() {
  return (
    <VStack align="center" gap={3} className="rounded-md border bg-background p-4 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">G</div>
      <div>
        <p className="font-medium">Centered stack</p>
        <p className="text-sm text-muted-foreground">Useful for compact empty states.</p>
      </div>
    </VStack>
  );
}`,
        between: `import { Button, VStack } from "@gunjo/ui";

export function ReviewQueueStack() {
  return (
    <VStack justify="between" className="h-44 rounded-md border bg-background p-4">
      <div>
        <p className="font-medium">Review queue</p>
        <p className="text-sm text-muted-foreground">12 items waiting</p>
      </div>
      <Button size="sm">Open queue</Button>
    </VStack>
  );
}`,
        end: `import { Button, VStack } from "@gunjo/ui";

export function EndAlignedStack() {
  return (
    <VStack align="end" gap={3} className="w-full max-w-sm rounded-md border bg-background p-4 text-right">
      <div>
        <p className="font-medium">Billing update</p>
        <p className="text-sm text-muted-foreground">Align actions and short copy to the right edge.</p>
      </div>
      <Button size="sm">Confirm</Button>
    </VStack>
  );
}`,
        inline: `import { VStack } from "@gunjo/ui";

export function InlineStack() {
  return (
    <VStack inline gap={1} align="start" className="rounded-md border bg-muted/40 p-3">
      <span className="text-sm font-medium">Inline stack</span>
      <span className="text-xs text-muted-foreground">Fits inside text-like flows.</span>
    </VStack>
  );
}`,
    },
    ja: {
        form: codeByLocale.ja,
        center: `import { VStack } from "@gunjo/ui";

export function CenteredStack() {
  return (
    <VStack align="center" gap={3} className="rounded-md border bg-background p-4 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">G</div>
      <div>
        <p className="font-medium">中央揃え</p>
        <p className="text-sm text-muted-foreground">小さな空状態に向いています。</p>
      </div>
    </VStack>
  );
}`,
        between: `import { Button, VStack } from "@gunjo/ui";

export function ReviewQueueStack() {
  return (
    <VStack justify="between" className="h-44 rounded-md border bg-background p-4">
      <div>
        <p className="font-medium">確認キュー</p>
        <p className="text-sm text-muted-foreground">12件が待機中</p>
      </div>
      <Button size="sm">キューを開く</Button>
    </VStack>
  );
}`,
        end: `import { Button, VStack } from "@gunjo/ui";

export function EndAlignedStack() {
  return (
    <VStack align="end" gap={3} className="w-full max-w-sm rounded-md border bg-background p-4 text-right">
      <div>
        <p className="font-medium">請求情報の更新</p>
        <p className="text-sm text-muted-foreground">短い説明と操作を右端に揃えます。</p>
      </div>
      <Button size="sm">確認</Button>
    </VStack>
  );
}`,
        inline: `import { VStack } from "@gunjo/ui";

export function InlineStack() {
  return (
    <VStack inline gap={1} align="start" className="rounded-md border bg-muted/40 p-3">
      <span className="text-sm font-medium">インラインスタック</span>
      <span className="text-xs text-muted-foreground">テキストに近い流れの中で使えます。</span>
    </VStack>
  );
}`,
    },
} as const;

export default function VStackPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12", default: "2", description: "子要素間の余白です。" },
            { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "横方向の揃え方です。" },
            { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', default: '"start"', description: "縦方向の配置方法です。" },
            { name: "inline", type: "boolean", default: "false", description: "inline-flex として描画します。" },
        ]
        : [
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12", default: "2", description: "Spacing between children." },
            { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "Cross-axis alignment." },
            { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', default: '"start"', description: "Main-axis distribution." },
            { name: "inline", type: "boolean", default: "false", description: "Renders as inline-flex." },
        ];

    return (
        <ComponentLayout
            title={locale === "ja" ? "垂直スタック" : meta.vStack.title}
            description={locale === "ja" ? "フォーム、カード、説明ブロックなどを縦方向に積み、余白・揃え・高さ内の配置を制御します。" : meta.vStack.description}
            usedComponents={[{ name: "VStack", href: "/docs/components/v-stack" }]}
            relatedComponents={[
                { name: "HStack", href: "/docs/components/h-stack" },
                { name: "Cluster", href: "/docs/components/cluster" },
                { name: "Container", href: "/docs/components/container" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/v-stack" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="md">
                <VStack gap={4} className="w-full max-w-sm rounded-md border bg-background p-4">
                    <VStack gap={2}>
                        <Label htmlFor="vstack-name">{locale === "ja" ? "名前" : "Name"}</Label>
                        <Input id="vstack-name" defaultValue="Gunjo UI" className="w-full" />
                    </VStack>
                    <VStack gap={2}>
                        <Label htmlFor="vstack-email">{locale === "ja" ? "メール" : "Email"}</Label>
                        <Input id="vstack-email" defaultValue="team@example.com" className="w-full" />
                    </VStack>
                    <Button className="self-start">{locale === "ja" ? "保存" : "Save"}</Button>
                </VStack>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <div className="space-y-8">
                    {[
                        {
                            key: "form",
                            title: locale === "ja" ? "フォーム項目" : "Form fields",
                            description: locale === "ja" ? "ラベル、入力、操作を縦方向に積みます。" : "Stack labels, inputs, and actions vertically.",
                            code: stateCodeByLocale[locale].form,
                            preview: (
                                <VStack gap={4} className="w-full max-w-sm rounded-md border bg-background p-4">
                                    <VStack gap={2}>
                                        <Label htmlFor="vstack-state-name">{locale === "ja" ? "名前" : "Name"}</Label>
                                        <Input id="vstack-state-name" defaultValue="Gunjo UI" className="w-full" />
                                    </VStack>
                                    <VStack gap={2}>
                                        <Label htmlFor="vstack-state-email">{locale === "ja" ? "メール" : "Email"}</Label>
                                        <Input id="vstack-state-email" defaultValue="team@example.com" className="w-full" />
                                    </VStack>
                                    <Button className="self-start">{locale === "ja" ? "保存" : "Save"}</Button>
                                </VStack>
                            ),
                        },
                        {
                            key: "center",
                            title: locale === "ja" ? "中央揃え" : "Centered",
                            description: locale === "ja" ? "短い説明や空状態を中央にまとめます。" : "Center compact descriptions or empty states.",
                            code: stateCodeByLocale[locale].center,
                            preview: (
                                <VStack align="center" gap={3} className="rounded-md border bg-background p-4 text-center">
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">G</div>
                                    <div>
                                        <p className="font-medium">{locale === "ja" ? "中央揃え" : "Centered stack"}</p>
                                        <p className="text-sm text-muted-foreground">{locale === "ja" ? "小さな空状態に向いています。" : "Useful for compact empty states."}</p>
                                    </div>
                                </VStack>
                            ),
                        },
                        {
                            key: "between",
                            title: locale === "ja" ? "上下に分離" : "Space between",
                            description: locale === "ja" ? "カード内で内容と操作を上下に分けます。" : "Separate content and action in a fixed-height card.",
                            code: stateCodeByLocale[locale].between,
                            preview: (
                                <VStack justify="between" className="h-44 rounded-md border bg-background p-4">
                                    <div>
                                        <p className="font-medium">{locale === "ja" ? "確認キュー" : "Review queue"}</p>
                                        <p className="text-sm text-muted-foreground">{locale === "ja" ? "12件が待機中" : "12 items waiting"}</p>
                                    </div>
                                    <Button size="sm">{locale === "ja" ? "キューを開く" : "Open queue"}</Button>
                                </VStack>
                            ),
                        },
                        {
                            key: "end",
                            title: locale === "ja" ? "右揃え" : "End aligned",
                            description: locale === "ja" ? "短い説明と操作を右端に揃えます。" : "Align short copy and actions to the right edge.",
                            code: stateCodeByLocale[locale].end,
                            preview: (
                                <VStack align="end" gap={3} className="w-full max-w-sm rounded-md border bg-background p-4 text-right">
                                    <div>
                                        <p className="font-medium">{locale === "ja" ? "請求情報の更新" : "Billing update"}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {locale === "ja" ? "短い説明と操作を右端に揃えます。" : "Align actions and short copy to the right edge."}
                                        </p>
                                    </div>
                                    <Button size="sm">{locale === "ja" ? "確認" : "Confirm"}</Button>
                                </VStack>
                            ),
                        },
                        {
                            key: "inline",
                            title: locale === "ja" ? "インライン" : "Inline",
                            description: locale === "ja" ? "小さな説明ブロックを inline-flex として扱います。" : "Use inline-flex for compact explanatory blocks.",
                            code: stateCodeByLocale[locale].inline,
                            preview: (
                                <VStack inline gap={1} align="start" className="rounded-md border bg-muted/40 p-3">
                                    <span className="text-sm font-medium">{locale === "ja" ? "インラインスタック" : "Inline stack"}</span>
                                    <span className="text-xs text-muted-foreground">{locale === "ja" ? "テキストに近い流れの中で使えます。" : "Fits inside text-like flows."}</span>
                                </VStack>
                            ),
                        },
                    ].map((item) => (
                        <section key={item.key} className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <ComponentPreview code={item.code} codeBlock={<CodeBlock code={item.code} />} previewBodyWidth="md" previewHeight="auto">
                                {item.preview}
                            </ComponentPreview>
                        </section>
                    ))}
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
