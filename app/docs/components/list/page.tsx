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
    const usageCode = codeByLocale[locale];

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
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="sm" previewHeight="auto">
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
                            <strong>順序があるかどうかで要素を変える。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'variant="ordered"'}</code> なら <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ol</code>、それ以外は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ul</code> を描きます。資料の1問目（順序に意味があるか）が、そのまま <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> に対応しています。番号は自分で描かず、ブラウザの番号付けに任せています。
                        </li>
                        <li>
                            <strong>しるしは1か所で決める。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">List</code> に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">marker</code> を渡すと、中の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ListItem</code> に配られます。項目ごとに書き直す必要はありません。しるしは点・丸・チェックの3つで、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">icon</code> を渡せば別のものにも替えられます。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">divided</code> を渡すと項目のあいだに線が入り、上端と下端の余白だけが落ちます。
                        </li>
                        <li>
                            <strong>押せる一覧・選べる一覧は、この部品ではない。</strong>資料は「押して操作するか」「複数選ぶか」で <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> や <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">checkbox</code> に分かれると書いています。GUNJO では押せる一覧は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ListCard</code>、選べる一覧は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Checkbox</code> を組んだ形で、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">List</code> は読むための一覧に絞っています。空になったときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">EmptyState</code> を置きます。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/list"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: リスト（List）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Order decides the element.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'variant="ordered"'}</code> renders <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ol</code>; anything else renders <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ul</code>. The first question in the article, whether the order carries meaning, maps straight onto <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code>. Numbers are left to the browser rather than drawn by hand.
                        </li>
                        <li>
                            <strong>The marker is set once.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">marker</code> to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">List</code> and it is handed down to every <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ListItem</code>, so nothing is repeated per row. The markers are dot, circle and check, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">icon</code> replaces them with anything else. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">divided</code> draws a rule between rows and trims the padding at the top and bottom edges.
                        </li>
                        <li>
                            <strong>Actionable and selectable lists are other components.</strong> The article splits lists by whether a row is pressed and whether several are selected, landing on <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> or <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">checkbox</code>. In GUNJO an actionable list is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ListCard</code> and a selectable one is composed with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Checkbox</code>, which leaves <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">List</code> for lists that are read. When it runs empty, put an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">EmptyState</code> there.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/list"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: List (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
