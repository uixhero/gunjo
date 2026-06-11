"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, List, ListItem } from "@gunjo/ui";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

const codeByLocale = {
    ja: `import { List, ListItem } from "@gunjo/ui";

export function Example() {
  return (
    <List spacing="loose">
      <ListItem>要件を確認する</ListItem>
      <ListItem>必要な入力を揃える</ListItem>
      <ListItem marker="check">保存して共有する</ListItem>
    </List>
  );
}`,
    en: `import { List, ListItem } from "@gunjo/ui";

export function Example() {
  return (
    <List spacing="loose">
      <ListItem>Review the requirements</ListItem>
      <ListItem>Collect the required inputs</ListItem>
      <ListItem marker="check">Save and share</ListItem>
    </List>
  );
}`,
} as const;

const listPropsByLocale = {
    ja: [
        { name: "variant", type: "\"unordered\" | \"ordered\" | \"none\"", default: "\"unordered\"", description: "リストの意味と標準マーカーの扱いを指定します。" },
        { name: "marker", type: "\"dot\" | \"circle\" | \"check\" | \"number\" | \"none\"", default: "\"dot\"", description: "各項目に使う標準マーカーです。" },
        { name: "spacing", type: "\"default\" | \"tight\" | \"loose\"", default: "\"default\"", description: "項目間の縦余白です。" },
        { name: "divided", type: "boolean", default: "false", description: "項目間に区切り線を表示します。設定一覧や確認リストの静的な行表現に使います。" },
    ],
    en: [
        { name: "variant", type: "\"unordered\" | \"ordered\" | \"none\"", default: "\"unordered\"", description: "Semantic list type and default marker behavior." },
        { name: "marker", type: "\"dot\" | \"circle\" | \"check\" | \"number\" | \"none\"", default: "\"dot\"", description: "Default marker used for each item." },
        { name: "spacing", type: "\"default\" | \"tight\" | \"loose\"", default: "\"default\"", description: "Vertical spacing between items." },
        { name: "divided", type: "boolean", default: "false", description: "Adds dividers between items for static settings or review rows." },
    ],
} as const;

const itemPropsByLocale = {
    ja: [
        { name: "marker", type: "\"dot\" | \"circle\" | \"check\" | \"number\" | \"none\"", description: "項目ごとにマーカーを上書きします。" },
        { name: "icon", type: "ReactNode", description: "任意のアイコンをマーカーとして表示します。" },
        { name: "children", type: "ReactNode", required: true, description: "リスト項目の本文です。" },
    ],
    en: [
        { name: "marker", type: "\"dot\" | \"circle\" | \"check\" | \"number\" | \"none\"", description: "Overrides the marker for this item." },
        { name: "icon", type: "ReactNode", description: "Custom icon used as the item marker." },
        { name: "children", type: "ReactNode", required: true, description: "Item content." },
    ],
} as const;

export default function ListDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/list", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.list.title;
    const description = content?.description ?? meta.list.description;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "List", href: "/docs/components/list" },
                { name: "ListItem", href: "/docs/components/list" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "Card", href: "/docs/components/card" },
            ]}
            relatedComponents={[
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "Checkbox", href: "/docs/components/checkbox" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="sm" previewHeight="auto">
                <List spacing="loose" className="w-full">
                    <ListItem>{locale === "ja" ? "要件を確認する" : "Review the requirements"}</ListItem>
                    <ListItem>{locale === "ja" ? "必要な入力を揃える" : "Collect the required inputs"}</ListItem>
                    <ListItem marker="check">{locale === "ja" ? "保存して共有する" : "Save and share"}</ListItem>
                </List>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "check",
                            title: locale === "ja" ? "チェック項目" : "Checklist",
                            description: locale === "ja"
                                ? "完了済みや確認済みの項目を静的なマーカーとして明確にします。"
                                : "Use check markers as static markers for completed or confirmed items.",
                            preview: (
                                <List marker="check" spacing="default" className="w-full max-w-sm">
                                    <ListItem>{locale === "ja" ? "レビュー済み" : "Reviewed"}</ListItem>
                                    <ListItem>{locale === "ja" ? "検証済み" : "Validated"}</ListItem>
                                    <ListItem>{locale === "ja" ? "共有済み" : "Shared"}</ListItem>
                                </List>
                            ),
                            code: locale === "ja"
                                ? `import { List, ListItem } from "@gunjo/ui";

export function ReviewedItems() {
  return (
    <List marker="check">
      <ListItem>レビュー済み</ListItem>
      <ListItem>検証済み</ListItem>
      <ListItem>共有済み</ListItem>
    </List>
  );
}`
                                : `import { List, ListItem } from "@gunjo/ui";

export function ReviewedItems() {
  return (
    <List marker="check">
      <ListItem>Reviewed</ListItem>
      <ListItem>Validated</ListItem>
      <ListItem>Shared</ListItem>
    </List>
  );
}`,
                        },
                        {
                            key: "ordered",
                            title: locale === "ja" ? "順序付き" : "Ordered",
                            description: locale === "ja"
                                ? "手順や優先順位を示す場合は ordered を使います。"
                                : "Use ordered lists for steps or priority.",
                            preview: (
                                <List variant="ordered" spacing="tight" className="w-full max-w-sm">
                                    <ListItem>{locale === "ja" ? "ファイルを選ぶ" : "Choose files"}</ListItem>
                                    <ListItem>{locale === "ja" ? "内容を確認する" : "Review details"}</ListItem>
                                    <ListItem>{locale === "ja" ? "アップロードする" : "Upload"}</ListItem>
                                </List>
                            ),
                            code: locale === "ja"
                                ? `import { List, ListItem } from "@gunjo/ui";

export function OrderedSteps() {
  return (
    <List variant="ordered" spacing="tight">
      <ListItem>ファイルを選ぶ</ListItem>
      <ListItem>内容を確認する</ListItem>
      <ListItem>アップロードする</ListItem>
    </List>
  );
}`
                                : `import { List, ListItem } from "@gunjo/ui";

export function OrderedSteps() {
  return (
    <List variant="ordered" spacing="tight">
      <ListItem>Choose files</ListItem>
      <ListItem>Review details</ListItem>
      <ListItem>Upload</ListItem>
    </List>
  );
}`,
                        },
                        {
                            key: "divided",
                            title: locale === "ja" ? "区切り線付き" : "Divided",
                            description: locale === "ja"
                                ? "行ごとの情報を区切って見せたい静的なリストに使います。"
                                : "Use dividers when static rows need clearer separation.",
                            preview: (
                                <List marker="none" divided className="w-full max-w-sm">
                                    <ListItem>{locale === "ja" ? "公開前チェック" : "Pre-publish check"}</ListItem>
                                    <ListItem>{locale === "ja" ? "アクセシビリティ確認" : "Accessibility review"}</ListItem>
                                    <ListItem>{locale === "ja" ? "変更履歴を更新" : "Update changelog"}</ListItem>
                                </List>
                            ),
                            code: locale === "ja"
                                ? `import { List, ListItem } from "@gunjo/ui";

export function DividedList() {
  return (
    <List marker="none" divided>
      <ListItem>公開前チェック</ListItem>
      <ListItem>アクセシビリティ確認</ListItem>
      <ListItem>変更履歴を更新</ListItem>
    </List>
  );
}`
                                : `import { List, ListItem } from "@gunjo/ui";

export function DividedList() {
  return (
    <List marker="none" divided>
      <ListItem>Pre-publish check</ListItem>
      <ListItem>Accessibility review</ListItem>
      <ListItem>Update changelog</ListItem>
    </List>
  );
}`,
                        },
                        {
                            key: "custom-icon",
                            title: locale === "ja" ? "任意アイコン" : "Custom icon",
                            description: locale === "ja"
                                ? "項目ごとに意味が違う場合は icon で個別のマーカーを渡します。"
                                : "Pass an icon when each item needs its own visual marker.",
                            preview: (
                                <List variant="none" spacing="default" className="w-full max-w-sm">
                                    <ListItem icon={<Icon icon={IconArrowRight} size="sm" />}>{locale === "ja" ? "次の画面へ進む" : "Continue to the next screen"}</ListItem>
                                    <ListItem icon={<Icon icon={IconCheck} size="sm" className="text-success" />}>{locale === "ja" ? "保存済み" : "Saved"}</ListItem>
                                </List>
                            ),
                            code: locale === "ja"
                                ? `import { Icon, List, ListItem } from "@gunjo/ui";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

export function CustomIconList() {
  return (
    <List variant="none">
      <ListItem icon={<Icon icon={IconArrowRight} size="sm" />}>次の画面へ進む</ListItem>
      <ListItem icon={<Icon icon={IconCheck} size="sm" className="text-success" />}>保存済み</ListItem>
    </List>
  );
}`
                                : `import { Icon, List, ListItem } from "@gunjo/ui";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

export function CustomIconList() {
  return (
    <List variant="none">
      <ListItem icon={<Icon icon={IconArrowRight} size="sm" />}>Continue to the next screen</ListItem>
      <ListItem icon={<Icon icon={IconCheck} size="sm" className="text-success" />}>Saved</ListItem>
    </List>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="usage-boundary" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "使い分け" : "Usage boundary"}
                </h2>
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <Card>
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-sm">
                                {locale === "ja" ? "List が扱うこと" : "What List owns"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <CardDescription>
                                {locale === "ja"
                                    ? "List は ul / ol の意味、マーカー、余白、静的な区切り線を扱います。check は完了状態を保存する操作ではなく、説明用のマーカーです。"
                                    : "List owns ul / ol semantics, markers, spacing, and static dividers. A check marker describes a completed item; it does not store or toggle completion state."}
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-sm">
                                {locale === "ja" ? "別コンポーネントにすること" : "What belongs elsewhere"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <CardDescription>
                                {locale === "ja"
                                    ? "TODO や完了操作が必要な行は Checkbox や Toggle を含む checkable な composition として設計します。List の marker だけで操作状態を表現しません。"
                                    : "Todo rows and completion actions should be designed as checkable compositions with Checkbox or Toggle behavior. Do not represent interactive state with List markers alone."}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "List のプロパティ" : "List props"}
                </h2>
                <PropsTable data={listPropsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <h2 id="list-item-props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "ListItem のプロパティ" : "ListItem props"}
                </h2>
                <PropsTable data={itemPropsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
