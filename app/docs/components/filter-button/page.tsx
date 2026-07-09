"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { FilterButton, Button, Badge, cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";

function getFilterOptions(locale: "ja" | "en") {
    return locale === "ja"
        ? [
            { label: "未対応", value: "todo" },
            { label: "進行中", value: "doing" },
            { label: "レビュー中", value: "review" },
            { label: "完了", value: "done" },
        ]
        : [
            { label: "Todo", value: "todo" },
            { label: "Doing", value: "doing" },
            { label: "Review", value: "review" },
            { label: "Done", value: "done" },
        ];
}

function FilterButtonPreviewSurface({
    children,
}: {
    children: (portalContainer: HTMLElement | null) => React.ReactNode;
}) {
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    return (
        <div ref={setPortalContainer} className="relative flex w-full items-center justify-center overflow-visible py-1">
            {children(portalContainer)}
        </div>
    );
}

const usageCode = `import { FilterButton } from "@gunjo/ui";
import { useState } from "react";

const options = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export function FilterExample() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <FilterButton
      title="Status"
      options={options}
      selectedValues={selected}
      onFilterChange={setSelected}
    />
  );
}`;

const selectedCodeByLocale = {
    en: `import { FilterButton } from "@gunjo/ui";

const options = [
  { label: "Todo", value: "todo" },
  { label: "Doing", value: "doing" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" },
];

export function SelectedFilter() {
  return (
    <FilterButton
      title="Status"
      options={options}
      selectedValues={new Set(["doing", "review"])}
      selectedLabel={(count) => \`\${count} filters selected\`}
    />
  );
}`,
    ja: `import { FilterButton } from "@gunjo/ui";

const options = [
  { label: "未対応", value: "todo" },
  { label: "進行中", value: "doing" },
  { label: "レビュー中", value: "review" },
  { label: "完了", value: "done" },
];

export function SelectedFilter() {
  return (
    <FilterButton
      title="ステータス"
      options={options}
      selectedValues={new Set(["doing", "review"])}
      selectedLabel={(count) => \`\${count}件選択中\`}
    />
  );
}`,
} as const;

const customContentCodeByLocale = {
    en: `import { FilterButton, Button } from "@gunjo/ui";
import { useState } from "react";

const tags = [
  { label: "Design", value: "design" },
  { label: "Docs", value: "docs" },
  { label: "Review", value: "review" },
  { label: "Blocked", value: "blocked" },
];

export function TagFilter() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["docs"]));

  return (
    <FilterButton
      title="Tags"
      selectedValues={selected}
      onFilterChange={setSelected}
      contentClassName="w-64 p-3"
    >
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selected.has(tag.value);
          return (
            <Button
              key={tag.value}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const next = new Set(selected);
                active ? next.delete(tag.value) : next.add(tag.value);
                setSelected(next);
              }}
            >
              {tag.label}
            </Button>
          );
        })}
      </div>
    </FilterButton>
  );
}`,
    ja: `import { FilterButton, Button } from "@gunjo/ui";
import { useState } from "react";

const tags = [
  { label: "デザイン", value: "design" },
  { label: "ドキュメント", value: "docs" },
  { label: "レビュー", value: "review" },
  { label: "保留", value: "blocked" },
];

export function TagFilter() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["docs"]));

  return (
    <FilterButton
      title="タグ"
      selectedValues={selected}
      onFilterChange={setSelected}
      selectedLabel={(count) => \`\${count}件のタグを選択中\`}
      contentClassName="w-64 p-3"
    >
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selected.has(tag.value);
          return (
            <Button
              key={tag.value}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const next = new Set(selected);
                active ? next.delete(tag.value) : next.add(tag.value);
                setSelected(next);
              }}
            >
              {tag.label}
            </Button>
          );
        })}
      </div>
    </FilterButton>
  );
}`,
} as const;

function InteractiveFilterPreview({ locale }: { locale: "ja" | "en" }) {
    const [selected, setSelected] = React.useState<Set<string>>(new Set());
    const options = getFilterOptions(locale);

    return (
        <FilterButtonPreviewSurface>
            {(portalContainer) => (
                <FilterButton
                    title={locale === "ja" ? "ステータス" : "Status"}
                    options={options}
                    selectedValues={selected}
                    onFilterChange={setSelected}
                    clearLabel={locale === "ja" ? "クリア" : "Clear"}
                    selectedLabel={(count) => locale === "ja" ? `${count}件選択中` : `${count} selected`}
                    portalContainer={portalContainer}
                />
            )}
        </FilterButtonPreviewSurface>
    );
}

function SelectedFilterPreview({ locale }: { locale: "ja" | "en" }) {
    const options = getFilterOptions(locale);

    return (
        <FilterButtonPreviewSurface>
            {(portalContainer) => (
                <FilterButton
                    title={locale === "ja" ? "ステータス" : "Status"}
                    options={options}
                    selectedValues={new Set(["doing", "review"])}
                    selectedLabel={(count) => locale === "ja" ? `${count}件選択中` : `${count} selected`}
                    portalContainer={portalContainer}
                />
            )}
        </FilterButtonPreviewSurface>
    );
}

function CustomContentFilterPreview({ locale }: { locale: "ja" | "en" }) {
    const [selected, setSelected] = React.useState<Set<string>>(new Set(["docs"]));
    const tags = locale === "ja"
        ? [
            { label: "デザイン", value: "design" },
            { label: "ドキュメント", value: "docs" },
            { label: "レビュー", value: "review" },
            { label: "保留", value: "blocked" },
        ]
        : [
            { label: "Design", value: "design" },
            { label: "Docs", value: "docs" },
            { label: "Review", value: "review" },
            { label: "Blocked", value: "blocked" },
        ];

    return (
        <FilterButtonPreviewSurface>
            {(portalContainer) => (
                <FilterButton
                    title={locale === "ja" ? "タグ" : "Tags"}
                    selectedValues={selected}
                    onFilterChange={setSelected}
                    selectedLabel={(count) => locale === "ja" ? `${count}件のタグを選択中` : `${count} tags selected`}
                    contentClassName="w-64 p-3"
                    portalContainer={portalContainer}
                >
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => {
                                const active = selected.has(tag.value);
                                return (
                                    <Button
                                        key={tag.value}
                                        type="button"
                                        variant={active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                            const next = new Set(selected);
                                            if (active) {
                                                next.delete(tag.value);
                                            } else {
                                                next.add(tag.value);
                                            }
                                            setSelected(next);
                                        }}
                                    >
                                        {tag.label}
                                    </Button>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                            <span>{locale === "ja" ? `${selected.size}件選択中` : `${selected.size} selected`}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setSelected(new Set())}
                            >
                                {locale === "ja" ? "クリア" : "Clear"}
                            </Button>
                        </div>
                    </div>
                </FilterButton>
            )}
        </FilterButtonPreviewSurface>
    );
}

function FilterStateSummary({ locale }: { locale: "ja" | "en" }) {
    const states = [
        {
            label: "default",
            description: locale === "ja" ? "選択がなく、メニューも閉じている通常状態。" : "Default state with no selected values and a closed menu.",
            className: "border-dashed",
        },
        {
            label: "popover",
            description: locale === "ja" ? "メニューを開いて、選択候補を確認している状態。" : "Open state while reviewing available filter options.",
            className: "border-primary-border bg-primary-subtle text-primary-subtle-foreground",
        },
        {
            label: "selected",
            description: locale === "ja" ? "選択件数のバッジを持つ、条件適用済みの状態。" : "Selected state with a count badge on the trigger.",
            className: "border-primary bg-primary-subtle text-primary-subtle-foreground",
        },
    ];

    return (
        <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-3">
            {states.map((state) => (
                <div
                    key={state.label}
                    className="grid gap-3 rounded-md bg-background p-3 sm:grid-cols-[8rem_minmax(9rem,auto)_minmax(0,1fr)] sm:items-center"
                >
                    <div className="min-w-0">
                        <Badge variant="outline" className="font-mono text-[11px]">
                            {state.label}
                        </Badge>
                    </div>
                    <div
                        className={cn(
                            "inline-flex h-9 w-40 max-w-full items-center justify-between gap-2 justify-self-start rounded-md border px-3 py-2 text-sm font-medium",
                            state.className
                        )}
                    >
                        {locale === "ja" ? "フィルター" : "Filter"}
                        {state.label === "selected" ? (
                            <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                                2
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground sm:pl-1">
                        {state.description}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function FilterButtonDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/filter-button", locale);
    const title = content?.title ?? inputsMetadata.filterButton.title;
    const description = content?.description ?? inputsMetadata.filterButton.description;
    const localizedUsageCode = locale === "ja"
        ? `import { FilterButton } from "@gunjo/ui";
import { useState } from "react";

const options = [
  { label: "未対応", value: "todo" },
  { label: "進行中", value: "doing" },
  { label: "完了", value: "done" },
];

export function FilterExample() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <FilterButton
      title="ステータス"
      options={options}
      selectedValues={selected}
      onFilterChange={setSelected}
      clearLabel="クリア"
      selectedLabel={(count) => \`\${count}件選択中\`}
    />
  );
}`
        : usageCode;

    const propsData = [
        { name: "title", type: "string", description: locale === "ja" ? "ボタンに表示するラベルです。" : "Button label.", default: '"Filter"' },
        { name: "icon", type: "ReactNode", description: locale === "ja" ? "任意の先頭アイコンです。未指定時はフィルターアイコンを表示します。" : "Optional leading icon. Defaults to the filter icon." },
        { name: "options", type: "FilterOption[]", description: locale === "ja" ? "標準リスト表示に使う選択肢です。" : "List of filter options for the default list menu." },
        { name: "selectedValues", type: "Set<string>", description: locale === "ja" ? "現在選択されている値です。件数バッジと選択済み状態に使われます。" : "Currently selected values. Drives the count badge and selected state.", required: true },
        { name: "onFilterChange", type: "(values: Set<string>) => void", description: locale === "ja" ? "選択値が変わった時に呼ばれます。" : "Callback fired when the selection changes.", required: true },
        { name: "clearLabel", type: "string", description: locale === "ja" ? "メニュー内のクリアアクションのラベルです。" : "Label for the clear action inside the menu.", default: '"Clear filters"' },
        { name: "selectedLabel", type: "(count: number) => string", description: locale === "ja" ? "件数バッジの読み上げ用ラベルを生成します。" : "Builds the aria-label for the count badge." },
        { name: "contentClassName", type: "string", description: locale === "ja" ? "開いたメニューに追加するスタイル用クラスです。" : "Class name applied to the popover panel." },
        { name: "contentAlign", type: '"start" | "center" | "end"', description: locale === "ja" ? "ポップオーバーの横位置です。" : "Horizontal alignment for the popover content.", default: '"start"' },
        { name: "portalContainer", type: "HTMLElement | null", description: locale === "ja" ? "擬似ブラウザや入れ子の表示領域に閉じ込めたい時の表示先です。" : "Optional portal container for framed previews or nested surfaces." },
        { name: "children", type: "ReactNode", description: locale === "ja" ? "色、タグ、評価など、標準リスト以外の独自フィルター UI です。" : "Custom filter UI such as color swatches, tags, rating controls, or ranges." },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "FilterButton", href: "/docs/components/filter-button" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Popover", href: "/docs/components/popover" },
                { name: "Command", href: "/docs/components/command" },
            ]}
            relatedComponents={[
                { name: "SortButton", href: "/docs/components/sort-button" },
                { name: "Select", href: "/docs/components/select" },
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "RangeSlider", href: "/docs/components/range-slider" },
                { name: "TagInput", href: "/docs/components/tag-input" },
            ]}
        >
            <ComponentPreview
                code={localizedUsageCode}
                codeBlock={<CodeBlock code={localizedUsageCode} />}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <InteractiveFilterPreview locale={locale} />
            </ComponentPreview>

            <section className="space-y-4">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {locale === "ja"
                            ? "フィルターボタンの見た目は、見た目の種類ではなく、未選択、メニュー表示中、選択済みという実行時の状態から決まります。プロパティの前に、状態ごとの見え方と使い分けを確認します。"
                            : "FilterButton visuals are derived from runtime state rather than a variant prop: default, popover/open, and selected. Review these states before the prop contract."}
                    </p>
                </div>
                <FilterStateSummary locale={locale} />
                <ComponentDemoStates
                    states={[
                        {
                            key: "interactive",
                            title: locale === "ja" ? "未選択から選択する" : "Interactive default state",
                            description:
                                locale === "ja"
                                    ? "未選択状態からメニューを開き、複数条件を選択します。選択されると件数バッジが表示されます。"
                                    : "Start from the default state, open the menu, and select multiple conditions. The count badge appears once values are selected.",
                            preview: <InteractiveFilterPreview locale={locale} />,
                            code: localizedUsageCode,
                        },
                        {
                            key: "selected",
                            title: locale === "ja" ? "選択済み" : "Selected state",
                            description:
                                locale === "ja"
                                    ? "選択値がある時は選択済み状態になり、ボタン上に件数バッジを表示します。"
                                    : "When values are selected, the trigger switches to the selected state and shows the count badge.",
                            preview: <SelectedFilterPreview locale={locale} />,
                            code: selectedCodeByLocale[locale],
                        },
                        {
                            key: "custom-content",
                            title: locale === "ja" ? "カスタムメニュー" : "Custom menu content",
                            description:
                                locale === "ja"
                                    ? "内容を差し替えると、色、タグ、容量範囲など、標準リスト以外のフィルター UI を配置できます。"
                                    : "Pass children when a filter needs color swatches, tags, size ranges, or other non-list controls.",
                            preview: <CustomContentFilterPreview locale={locale} />,
                            code: customContentCodeByLocale[locale],
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {locale === "ja" ? "プロパティ" : sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {locale === "ja" ? "使い方" : sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={localizedUsageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={localizedUsageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
