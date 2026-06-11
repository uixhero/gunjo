"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Button, EmptyState, Icon } from "@gunjo/ui";
import { IconAlertTriangle, IconFolderOpen, IconSearch } from "@tabler/icons-react";

const codeByLocale = {
    ja: `import { Button, EmptyState, Icon } from "@gunjo/ui";
import { IconFolderOpen } from "@tabler/icons-react";

export function Example() {
  return (
    <EmptyState
      icon={<Icon icon={IconFolderOpen} size="md" />}
      title="プロジェクトがありません"
      description="最初のプロジェクトを作成すると、環境とメンバーをまとめて管理できます。"
      action={<Button size="sm">プロジェクトを作成</Button>}
    />
  );
}`,
    en: `import { Button, EmptyState, Icon } from "@gunjo/ui";
import { IconFolderOpen } from "@tabler/icons-react";

export function Example() {
  return (
    <EmptyState
      icon={<Icon icon={IconFolderOpen} size="md" />}
      title="No projects yet"
      description="Create your first project to manage environments and members together."
      action={<Button size="sm">Create project</Button>}
    />
  );
}`,
} as const;

const usageCodeByLocale = {
    ja: `import { EmptyState } from "@gunjo/ui";

export function SearchEmpty() {
  return (
    <EmptyState
      title="一致する結果がありません"
      description="検索条件を変更するか、フィルターを解除してください。"
    />
  );
}`,
    en: `import { EmptyState } from "@gunjo/ui";

export function SearchEmpty() {
  return (
    <EmptyState
      title="No matching results"
      description="Change your search terms or clear the active filters."
    />
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "icon", type: "ReactNode", description: "タイトルの上に表示する補助アイコンです。" },
        { name: "title", type: "ReactNode", required: true, description: "空状態の見出しです。" },
        { name: "description", type: "ReactNode", description: "原因や次の行動を短く説明する本文です。" },
        { name: "action", type: "ReactNode", description: "作成、再試行、解除などの主要操作です。" },
        { name: "children", type: "ReactNode", description: "補足リンクや追加アクションを配置する領域です。" },
    ],
    en: [
        { name: "icon", type: "ReactNode", description: "Optional icon shown above the title." },
        { name: "title", type: "ReactNode", required: true, description: "Heading for the empty state." },
        { name: "description", type: "ReactNode", description: "Short explanation of the cause or next action." },
        { name: "action", type: "ReactNode", description: "Primary action such as create, retry, or clear filters." },
        { name: "children", type: "ReactNode", description: "Additional links or secondary actions." },
    ],
} as const;

export default function EmptyStatePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/empty-state", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.emptyState.title;
    const description = content?.description ?? meta.emptyState.description;
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "EmptyState", href: "/docs/components/empty-state" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "SearchInput", href: "/docs/components/search-input" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <EmptyState
                    icon={<Icon icon={IconFolderOpen} size="md" />}
                    title={locale === "ja" ? "プロジェクトがありません" : "No projects yet"}
                    description={locale === "ja" ? "最初のプロジェクトを作成すると、環境とメンバーをまとめて管理できます。" : "Create your first project to manage environments and members together."}
                    action={<Button size="sm">{locale === "ja" ? "プロジェクトを作成" : "Create project"}</Button>}
                    className="w-full"
                />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "no-results",
                            title: locale === "ja" ? "検索結果なし" : "No results",
                            description: locale === "ja"
                                ? "検索やフィルターの実行結果が 0 件だったことを伝え、解除操作を近くに置きます。"
                                : "Use this when search or filters completed successfully but returned zero rows.",
                            preview: (
                                <EmptyState
                                    icon={<Icon icon={IconSearch} size="md" />}
                                    title={locale === "ja" ? "一致する結果がありません" : "No matching results"}
                                    description={locale === "ja" ? "検索条件を変更するか、フィルターを解除してください。" : "Change your search terms or clear the active filters."}
                                    action={<Button size="sm" variant="outline">{locale === "ja" ? "フィルターを解除" : "Clear filters"}</Button>}
                                    className="w-full"
                                />
                            ),
                            code: usageCode,
                        },
                        {
                            key: "first-run",
                            title: locale === "ja" ? "初回状態" : "First run",
                            description: locale === "ja"
                                ? "まだデータがない理由と、最初に取るべき操作を明確にします。"
                                : "Explain why the page is empty and provide one clear first action.",
                            preview: (
                                <EmptyState
                                    icon={<Icon icon={IconFolderOpen} size="md" />}
                                    title={locale === "ja" ? "まだ素材がありません" : "No assets yet"}
                                    description={locale === "ja" ? "素材をアップロードすると、一覧と検索で管理できます。" : "Upload assets to manage them in the library and search."}
                                    action={<Button size="sm">{locale === "ja" ? "アップロード" : "Upload"}</Button>}
                                    className="w-full"
                                />
                            ),
                            code,
                        },
                        {
                            key: "error",
                            title: locale === "ja" ? "読み込み失敗" : "Failed load",
                            description: locale === "ja"
                                ? "データ取得に失敗した場合は、原因と再試行操作を同じ面に置きます。"
                                : "When data cannot load, keep the reason and retry action on the same surface.",
                            preview: (
                                <EmptyState
                                    icon={<Icon icon={IconAlertTriangle} size="md" className="text-destructive" />}
                                    title={locale === "ja" ? "データを読み込めませんでした" : "Couldn't load data"}
                                    description={locale === "ja" ? "ネットワークを確認してから、もう一度試してください。" : "Check the network and try again."}
                                    action={<Button size="sm" variant="outline">{locale === "ja" ? "再試行" : "Retry"}</Button>}
                                    className="w-full"
                                />
                            ),
                            code: locale === "ja"
                                ? `import { Button, EmptyState, Icon } from "@gunjo/ui";
import { IconAlertTriangle } from "@tabler/icons-react";

export function FailedLoad() {
  return (
    <EmptyState
      icon={<Icon icon={IconAlertTriangle} size="md" className="text-destructive" />}
      title="データを読み込めませんでした"
      description="ネットワークを確認してから、もう一度試してください。"
      action={<Button size="sm" variant="outline">再試行</Button>}
    />
  );
}`
                                : `import { Button, EmptyState, Icon } from "@gunjo/ui";
import { IconAlertTriangle } from "@tabler/icons-react";

export function FailedLoad() {
  return (
    <EmptyState
      icon={<Icon icon={IconAlertTriangle} size="md" className="text-destructive" />}
      title="Couldn't load data"
      description="Check the network and try again."
      action={<Button size="sm" variant="outline">Retry</Button>}
    />
  );
}`,
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
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
