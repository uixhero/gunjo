"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { getCategoryVariantUnionType } from "@/lib/docs-spec";
import inputsMetadata from "@design/inputs-metadata.json";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

function SortButtonStatePreview({ initial = "none", disabled }: { initial?: SortButtonVariantKey; disabled?: boolean }) {
    const { locale } = useLocale();
    const [sort, setSort] = React.useState<SortButtonVariantKey>(initial);
    const button = (
        <SortButton
            value={sort}
            onSortChange={setSort}
            label={locale === "ja" ? "登録日" : "Date joined"}
            disabled={disabled}
            className="flex-row"
        />
    );

    return disabled ? (
        <DisabledReasonTooltip reason={locale === "ja" ? "一覧が固定表示のため並び替えできません。" : "Sorting is unavailable while the list order is locked."}>
            {button}
        </DisabledReasonTooltip>
    ) : (
        button
    );
}

export default function SortButtonDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/sort-button", locale);
    const sortVariantType = getCategoryVariantUnionType("inputs", "sortButton");
    const usageCode = `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function SortExample() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("none");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="${locale === "ja" ? "登録日" : "Date joined"}"
      className="flex-row"
    />
  );
}`;

    const propsData = [
        { name: "value", type: sortVariantType, default: '"none"', description: locale === "ja" ? "現在の並び替え方向です。" : "Current sort direction." },
        { name: "onSortChange", type: `(value: ${sortVariantType}) => void`, description: locale === "ja" ? "並び替え方向が変わった時に呼ばれます。" : "Called when the sort direction changes." },
        { name: "label", type: "string", default: '"Sort"', description: locale === "ja" ? "ボタンに表示するラベルです。" : "Visible button label." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "並び替えできない状態にします。理由はツールチップで補足します。" : "Disables sorting. Explain the reason with a tooltip." },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? inputsMetadata.sortButton.title}
            description={content?.description ?? inputsMetadata.sortButton.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "SortButton", href: "/docs/components/sort-button" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "FilterButton", href: "/docs/components/filter-button" },
                { name: "Table", href: "/docs/components/table" },
                { name: "Command", href: "/docs/components/command" },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto">
                <SortButtonStatePreview />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "none",
                            title: locale === "ja" ? "未指定" : "None",
                            description: locale === "ja" ? "クリックすると昇順、降順、未指定の順に切り替わります。" : "Click to cycle through ascending, descending, and none.",
                            preview: <SortButtonStatePreview />,
                            code: `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function UnsortedButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("none");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="${locale === "ja" ? "登録日" : "Date joined"}"
      className="flex-row"
    />
  );
}`,
                        },
                        {
                            key: "asc",
                            title: locale === "ja" ? "昇順" : "Ascending",
                            description: locale === "ja" ? "現在の並び替え方向をアイコンとラベルで示します。" : "The icon and label show the current direction.",
                            preview: <SortButtonStatePreview initial="asc" />,
                            code: `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function AscendingSortButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("asc");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="${locale === "ja" ? "登録日" : "Date joined"}"
      className="flex-row"
    />
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "並び替えできない理由はツールチップで伝えます。" : "Explain why sorting is unavailable with a tooltip.",
                            preview: <SortButtonStatePreview disabled />,
                            code: `import { SortButton, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0}>
      <SortButton disabled label="${locale === "ja" ? "登録日" : "Date joined"}" className="flex-row" />
    </span>
  </TooltipTrigger>
  <TooltipContent>${locale === "ja" ? "一覧が固定表示のため並び替えできません。" : "Sorting is unavailable while the list order is locked."}</TooltipContent>
</Tooltip>`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
