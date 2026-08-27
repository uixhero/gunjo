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
    const isJa = locale === "ja";
    const usageCode = isJa
        ? `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function DateJoinedSortButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("none");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="登録日"
      className="flex-row"
    />
  );
}`
        : `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function DateJoinedSortButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("none");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="Date joined"
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
                            code: isJa
                                ? `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function UnsortedButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("none");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="登録日"
      className="flex-row"
    />
  );
}`
                                : `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function UnsortedButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("none");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="Date joined"
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
                            code: isJa
                                ? `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function AscendingSortButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("asc");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="登録日"
      className="flex-row"
    />
  );
}`
                                : `import * as React from "react";
import { SortButton, type SortButtonVariantKey } from "@gunjo/ui";

export function AscendingSortButton() {
  const [sort, setSort] = React.useState<SortButtonVariantKey>("asc");

  return (
    <SortButton
      value={sort}
      onSortChange={setSort}
      label="Date joined"
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
                            code: isJa
                                ? `import {
  SortButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function LockedSortButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <SortButton disabled label="登録日" className="flex-row" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        一覧が固定表示のため並び替えできません。
      </TooltipContent>
    </Tooltip>
  );
}`
                                : `import {
  SortButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function LockedSortButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <SortButton disabled label="Date joined" className="flex-row" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Sorting is unavailable while the list order is locked.
      </TooltipContent>
    </Tooltip>
  );
}`,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>押すたびに3つの状態を回す。</strong>昇順・降順・並べ替えなし、を1つのボタンで回します。資料は「1つのボタンに1つの動詞」を求めていますが、並べ替えは切り替えなので、ボタンを3つ並べるより1つを回すほうが場所を取りません。いまの状態は3種類のアイコンで出しています。
                        </li>
                        <li>
                            <strong>いまの状態を読み上げに伝えるところは、まだ書いていません。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> も <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-sort</code> も付いていないので、画面を見ていない人にはラベルの「並べ替え」までしか届きません。表の見出しで使うときは、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-sort</code> を持つ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DataTable</code> の見出しを使ってください。この部品を単体で直すか、表の見出し専用にするかは、まだ決めていません。
                        </li>
                        <li>
                            <strong>既定は控えめな見た目にした。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> の既定は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ghost</code>、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sm</code> です。資料は「Primary は1画面に1つまで」を挙げています。並べ替えは画面の主役ではないので、ツールバーの中で目立たない側に置きました。ラベルは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> で差し替えられます。
                            <br />
                            一般のボタンの設計は UIXHERO の「ボタン」にあります。{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/button"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: ボタン（Button）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>One button cycles three states.</strong> Ascending, descending and unsorted rotate through a single button. The article asks for one verb per button, but sorting is a toggle, and one rotating control takes less room than three side by side. The current state is shown by three distinct icons.
                        </li>
                        <li>
                            <strong>Announcing the current state to assistive technology is not written yet.</strong> There is no <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> and no <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-sort</code>, so someone not looking at the screen only hears the label. For table headers, use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DataTable</code>&rsquo;s header, which does set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-sort</code>. Whether this component should gain that itself or be scoped to table headers is still undecided.
                        </li>
                        <li>
                            <strong>The default surface is deliberately quiet.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> defaults to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ghost</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code> to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sm</code>. The article allows one primary per screen, and sorting is not the star of any of them, so it sits on the quiet side of a toolbar. The label is replaceable through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code>.
                            <br />
                            The general design of buttons is covered by UIXHERO&rsquo;s button article.{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/button"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Button (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
