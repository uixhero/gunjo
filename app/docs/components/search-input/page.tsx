"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { SearchInputDemo } from "@/components/demos/SearchInputDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, SearchInput } from "@gunjo/ui";
import * as React from "react";

function SearchInputStatePreview({
    disabled,
    clearable = true,
    initialValue = "",
}: {
    disabled?: boolean;
    clearable?: boolean;
    initialValue?: string;
}) {
    const { locale } = useLocale();
    const [value, setValue] = React.useState(initialValue);
    const field = (
        <SearchInput
            id="search-state"
            value={value}
            onValueChange={setValue}
            placeholder={locale === "ja" ? "キーワードを入力" : "Search keyword"}
            clearable={clearable}
            clearLabel={locale === "ja" ? "検索語をクリア" : "Clear search"}
            disabled={disabled}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="search-state">{locale === "ja" ? "素材検索" : "Asset search"}</FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "検索インデックスの更新中です。" : "The search index is currently updating."}>
                        {field}
                    </DisabledReasonTooltip>
                ) : (
                    field
                )}
            </FormControl>
            <FormDescription>
                {disabled
                    ? locale === "ja"
                        ? "更新が完了すると検索できます。"
                        : "Search will be available after indexing finishes."
                    : value
                        ? locale === "ja"
                            ? `検索語: "${value}"`
                            : `query: "${value}"`
                        : locale === "ja"
                            ? "入力した検索語は即時に反映されます。"
                            : "The query updates as you type."}
            </FormDescription>
        </FormGroup>
    );
}

export default function SearchInputPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/search-input", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;

    const code = locale === "ja"
        ? `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
} from "@gunjo/ui";

export function SearchInputDemo() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="component-search">検索</FormLabel>
      <FormControl>
        <SearchInput
          id="component-search"
          value={value}
          onValueChange={setValue}
          placeholder="コンポーネントを検索..."
          clearLabel="検索語をクリア"
        />
      </FormControl>
      <FormDescription>
        {value ? \`検索語: "\${value}"\` : "入力すると検索語が反映され、クリアボタンで消せます。"}
      </FormDescription>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
} from "@gunjo/ui";

export function SearchInputDemo() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="component-search">Search</FormLabel>
      <FormControl>
        <SearchInput
          id="component-search"
          value={value}
          onValueChange={setValue}
          placeholder="Search components..."
          clearLabel="Clear search"
        />
      </FormControl>
      <FormDescription>
        {value ? \`query: "\${value}"\` : "Type to search; clear with x"}
      </FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = locale === "ja"
        ? `import * as React from "react";
import { FormControl, FormGroup, FormLabel, SearchInput } from "@gunjo/ui";

export function AssetSearchField() {
  const [query, setQuery] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="search">検索</FormLabel>
      <FormControl>
        <SearchInput
          id="search"
          value={query}
          onValueChange={setQuery}
          clearLabel="検索語をクリア"
        />
      </FormControl>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import { FormControl, FormGroup, FormLabel, SearchInput } from "@gunjo/ui";

export function AssetSearchField() {
  const [query, setQuery] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="search">Search</FormLabel>
      <FormControl>
        <SearchInput
          id="search"
          value={query}
          onValueChange={setQuery}
          clearLabel="Clear search"
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        { name: "value", type: "string", description: locale === "ja" ? "外部から渡す検索語です。" : "Controlled search query." },
        { name: "onValueChange", type: "(value: string) => void", description: locale === "ja" ? "検索語が変わった時に呼ばれます。" : "Called when the query changes." },
        { name: "clearable", type: "boolean", default: "true", description: locale === "ja" ? "入力済みの時にクリアボタンを表示します。" : "Shows a clear button when the query is not empty." },
        { name: "clearLabel", type: "string", default: "'Clear search'", description: locale === "ja" ? "クリアボタンの支援技術向けラベルです。" : "Accessible label for the clear button." },
        { name: "placeholder", type: "string", default: "'Search...'", description: locale === "ja" ? "未入力時に表示する補助テキストです。" : "Placeholder text." },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? metadata.searchInput.title}
            description={content?.description ?? metadata.searchInput.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "SearchInput", href: "/docs/components/search-input" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Button", href: "/docs/components/button" },
                { name: "FormGroup", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "Combobox", href: "/docs/components/combobox" },
                { name: "Command", href: "/docs/components/command" },
                { name: "FilterButton", href: "/docs/components/filter-button" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
                <SearchInputDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-clear",
                            title: locale === "ja" ? "クリア可能" : "Clearable",
                            description: locale === "ja" ? "入力済みの時だけクリアボタンを表示します。" : "Shows a clear button only while a query is present.",
                            preview: <SearchInputStatePreview initialValue={locale === "ja" ? "バナー" : "banner"} />,
                            code: locale === "ja"
                                ? `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
} from "@gunjo/ui";

export function ClearableSearchInput() {
  const [value, setValue] = React.useState("バナー");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="asset-search">素材検索</FormLabel>
      <FormControl>
        <SearchInput
          id="asset-search"
          value={value}
          onValueChange={setValue}
          placeholder="キーワードを入力"
          clearLabel="検索語をクリア"
        />
      </FormControl>
      <FormDescription>
        {value ? \`検索語: "\${value}"\` : "入力した検索語は即時に反映されます。"}
      </FormDescription>
    </FormGroup>
  );
}`
                                : `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
} from "@gunjo/ui";

export function ClearableSearchInput() {
  const [value, setValue] = React.useState("banner");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="asset-search">Asset search</FormLabel>
      <FormControl>
        <SearchInput
          id="asset-search"
          value={value}
          onValueChange={setValue}
          placeholder="Search keyword"
          clearLabel="Clear search"
        />
      </FormControl>
      <FormDescription>
        {value ? \`query: "\${value}"\` : "The query updates as you type."}
      </FormDescription>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "without-clear",
                            title: locale === "ja" ? "クリアボタンなし" : "Without clear button",
                            description: locale === "ja" ? "候補やフィルター側でリセットする検索欄では、クリアボタンを非表示にできます。" : "Hide the clear button when reset is handled elsewhere.",
                            preview: <SearchInputStatePreview clearable={false} initialValue={locale === "ja" ? "画像" : "image"} />,
                            code: locale === "ja"
                                ? `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
} from "@gunjo/ui";

export function SearchWithoutClearButton() {
  const [value, setValue] = React.useState("画像");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="asset-search">素材検索</FormLabel>
      <FormControl>
        <SearchInput
          id="asset-search"
          value={value}
          onValueChange={setValue}
          clearable={false}
          placeholder="キーワードを入力"
        />
      </FormControl>
      <FormDescription>
        {value ? \`検索語: "\${value}"\` : "入力した検索語は即時に反映されます。"}
      </FormDescription>
    </FormGroup>
  );
}`
                                : `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
} from "@gunjo/ui";

export function SearchWithoutClearButton() {
  const [value, setValue] = React.useState("image");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="asset-search">Asset search</FormLabel>
      <FormControl>
        <SearchInput
          id="asset-search"
          value={value}
          onValueChange={setValue}
          clearable={false}
          placeholder="Search keyword"
        />
      </FormControl>
      <FormDescription>
        {value ? \`query: "\${value}"\` : "The query updates as you type."}
      </FormDescription>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "検索できない理由はツールチップと補足文で伝えます。" : "Explain why search is unavailable with a tooltip and helper text.",
                            preview: <SearchInputStatePreview disabled initialValue={locale === "ja" ? "処理中" : "indexing"} />,
                            code: locale === "ja"
                                ? `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function LockedAssetSearchField() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="asset-search">素材検索</FormLabel>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <SearchInput
                id="asset-search"
                disabled
                value="処理中"
                placeholder="キーワードを入力"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>検索インデックスの更新中です。</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>
        更新が完了すると検索できます。
      </FormDescription>
    </FormGroup>
  );
}`
                                : `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  SearchInput,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function LockedAssetSearchField() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="asset-search">Asset search</FormLabel>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <SearchInput
                id="asset-search"
                disabled
                value="indexing"
                placeholder="Search keyword"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>The search index is currently updating.</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>
        Search will be available after indexing finishes.
      </FormDescription>
    </FormGroup>
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
        </ComponentLayout>
    );
}
