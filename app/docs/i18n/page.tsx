"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
    LocaleProvider,
    SearchInput,
    DataTable,
    ToggleGroup,
    ToggleGroupItem,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";

// i18n / LocaleProvider guide. Dogfoods @gunjo/ui's LocaleProvider with a live
// en/ja toggle so reviewers can see the built-in strings flip in place. The kit
// defaults its shadcn-derived strings to English; this page shows the one-switch
// localization added in #326, plus the instance-override props from #558.

type DemoRow = { name: string };

const demoColumns: ColumnDef<DemoRow>[] = [{ accessorKey: "name", header: "Name" }];

const usageCode = `import { LocaleProvider } from "@gunjo/ui"

// Wrap the app once. locale="ja" switches every built-in string;
// with no provider mounted, components keep their English default.
<LocaleProvider locale="ja">
  <App />
</LocaleProvider>`;

const overrideCode = `// Precedence: per-instance prop > provider bundle > built-in default.
<LocaleProvider locale="ja">
  {/* follows the provider → 検索… */}
  <SearchInput />
  {/* instance prop wins → stays fixed */}
  <SearchInput placeholder="固定プレースホルダ" />
</LocaleProvider>`;

export default function I18nPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [demo, setDemo] = React.useState<"en" | "ja">("ja");

    const propsData = [
        {
            name: "locale",
            type: '"en" | "ja"',
            default: '"en"',
            description: isJa
                ? "有効なロケール。組み込みバンドル（en/ja）を選びます。既定は en（＝プロバイダ未マウント時と同じ後方互換の挙動）。"
                : "Active locale; selects the built-in en/ja bundle. Defaults to en — the same backward-compatible behavior as mounting no provider.",
        },
        {
            name: "strings",
            type: "Partial<LocaleStrings>",
            description: isJa
                ? "選択中バンドルの上に、個別の文字列だけを上書きします（例: 独自の「該当なし」文言）。per-instance の component prop はこれより優先されます。"
                : "Override individual strings on top of the selected bundle (e.g. a custom empty-state wording). Per-instance component props still win over this.",
        },
        {
            name: "useLocale()",
            type: "() => { locale, strings }",
            description: isJa
                ? "有効なロケールと文字列バンドルを読むフック。プロバイダ未マウントでも en バンドルを返し、決して throw しません。"
                : "Hook to read the active locale + string bundle. Returns the en bundle when no provider is mounted; never throws.",
        },
        {
            name: "useLocaleStrings()",
            type: "() => LocaleStrings",
            description: isJa
                ? "有効な文字列バンドルだけを読むショートカット。"
                : "Convenience hook: the active string bundle only.",
        },
    ];

    return (
        <div className="space-y-10">
            <header className="space-y-3">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {isJa ? "国際化 (i18n)" : "Internationalization (i18n)"}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {isJa
                        ? "GunjoUI は日本語ブランドのキットですが、shadcn 由来の一部の組み込み文字列（DataTable の「No results.」/ 検索プレースホルダ / ページャなど）は英語が既定です。LocaleProvider を一度かぶせるだけで、それらをまとめて切り替えられます。"
                        : "GunjoUI is a Japanese-brand kit, but several built-in strings inherited from shadcn (DataTable's “No results.”, search placeholders, pager labels…) default to English. Wrap the tree once with LocaleProvider to switch them all at once."}
                </p>
            </header>

            <section className="space-y-4">
                <h2
                    id="live"
                    className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight"
                >
                    {isJa ? "ライブデモ" : "Live demo"}
                </h2>
                <p className="text-muted-foreground">
                    {isJa
                        ? "ロケールを切り替えると、下の実コンポーネントの組み込み文字列がその場で入れ替わります（アプリの再読み込みは不要）。"
                        : "Toggle the locale and the built-in strings in the real components below flip in place — no app reload."}
                </p>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                        {isJa ? "デモのロケール" : "Demo locale"}
                    </span>
                    <ToggleGroup
                        type="single"
                        value={demo}
                        disallowEmpty
                        onValueChange={(value) => {
                            if (value === "en" || value === "ja") setDemo(value);
                        }}
                        aria-label={isJa ? "デモのロケール" : "Demo locale"}
                    >
                        <ToggleGroupItem value="en">English</ToggleGroupItem>
                        <ToggleGroupItem value="ja">日本語</ToggleGroupItem>
                    </ToggleGroup>
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                        {`locale="${demo}"`}
                    </code>
                </div>

                <LocaleProvider locale={demo}>
                    <div className="space-y-6 rounded-lg border border-border bg-card p-4 sm:p-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                {isJa ? "検索入力（searchPlaceholder）" : "Search input (searchPlaceholder)"}
                            </p>
                            <SearchInput />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                {isJa
                                    ? "データテーブルの空表示（noResults / filterPlaceholder / ページャ）"
                                    : "DataTable empty state (noResults / filterPlaceholder / pager)"}
                            </p>
                            <DataTable
                                columns={demoColumns}
                                data={[]}
                                filter={{ columnId: "name" }}
                            />
                        </div>
                    </div>
                </LocaleProvider>

                <CodeBlock code={usageCode} />
            </section>

            <section className="space-y-4">
                <h2
                    id="precedence"
                    className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight"
                >
                    {isJa ? "優先順位（上書き）" : "Precedence (overrides)"}
                </h2>
                <p className="text-muted-foreground">
                    {isJa
                        ? "解決順は「インスタンスの prop ＞ プロバイダのバンドル ＞ 組み込み既定」。個別インスタンスで文言を渡すと、プロバイダの言語より優先されます。下の2つ目の入力はロケールを切り替えても固定のままです。"
                        : "Resolution order is: per-instance prop > provider bundle > built-in default. Passing a string on a single instance wins over the provider’s language. The second input below stays fixed as you toggle the locale."}
                </p>
                <LocaleProvider locale={demo}>
                    <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 sm:p-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                {isJa ? "プロバイダに従う" : "Follows the provider"}
                            </p>
                            <SearchInput />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                {isJa ? "インスタンス prop が優先" : "Instance prop wins"}
                            </p>
                            <SearchInput placeholder={isJa ? "固定プレースホルダ" : "Fixed placeholder"} />
                        </div>
                    </div>
                </LocaleProvider>
                <CodeBlock code={overrideCode} />
            </section>

            <section className="space-y-4">
                <h2
                    id="coverage"
                    className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight"
                >
                    {isJa ? "カバー範囲" : "Coverage"}
                </h2>
                <p className="text-muted-foreground">
                    {isJa
                        ? "LocaleProvider は横断的な組み込み文字列（noResults・検索/絞り込みプレースホルダ・rowsPerPage・previous/next・close/open・コマンド空表示など）を en/ja で提供します。DataTable / Combobox / SearchInput / CommandPalette / SearchableAccordion / MediaPickerDialog / Dialog / Sheet / Modal / PageAside / Accordion などが読み取ります。"
                        : "LocaleProvider supplies the cross-cutting built-in strings (noResults, search/filter placeholders, rowsPerPage, previous/next, close/open, command empty, …) in en/ja. DataTable, Combobox, SearchInput, CommandPalette, SearchableAccordion, MediaPickerDialog, Dialog, Sheet, Modal, PageAside, and Accordion read them."}
                </p>
                <p className="text-muted-foreground">
                    {isJa
                        ? "部品固有の文言（ActionQueue の重大度ラベル、EventCalendar の月見出し / 日ラベル書式、ScanGate の手順ラベル、TicketStub のコード alt など）は、グローバルバンドルではなく各コンポーネントのインスタンス上書き prop（severityLabels / formatMonthTitle / formatDayLabel / stepsLabel / formatCodeAlt）で上書きします。既定は日本語のままです。"
                        : "Component-specific wording (ActionQueue severity labels, EventCalendar month title / day formatters, ScanGate steps label, TicketStub code alt, …) is overridden per instance (severityLabels / formatMonthTitle / formatDayLabel / stepsLabel / formatCodeAlt) rather than through the global bundle; those defaults stay Japanese."}
                </p>
            </section>

            <section className="space-y-4">
                <h2
                    id="api"
                    className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight"
                >
                    {isJa ? "API" : "API"}
                </h2>
                <PropsTable data={propsData} />
            </section>
        </div>
    );
}
