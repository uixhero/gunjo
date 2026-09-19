"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { SearchableAccordionDemo } from "@/components/demos/SearchableAccordionDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { SearchableAccordion, type SearchableAccordionItem } from "@gunjo/ui";
import * as React from "react";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const baseItemsJa: SearchableAccordionItem[] = [
    {
        id: "billing",
        title: "請求先情報はどこで変更できますか？",
        body: "ワークスペース設定の請求から、請求先、支払い方法、請求メールの送信先を変更できます。",
        category: "account",
        keywords: ["請求", "支払い", "メール"],
    },
    {
        id: "invites",
        title: "メンバー招待が届かない場合は？",
        body: "迷惑メール、招待リンクの有効期限、許可ドメインを確認してください。",
        category: "team",
        keywords: ["招待", "メンバー", "チーム"],
    },
    {
        id: "mfa",
        title: "二要素認証を必須にできますか？",
        body: "管理者はセキュリティ設定から、全メンバーに二要素認証を必須化できます。",
        category: "security",
        keywords: ["2FA", "認証", "セキュリティ"],
    },
];

const baseItemsEn: SearchableAccordionItem[] = [
    {
        id: "billing",
        title: "Where can I change billing details?",
        body: "Open workspace billing settings to update the billing contact, payment method, and invoice recipients.",
        category: "account",
        keywords: ["billing", "payment", "invoice"],
    },
    {
        id: "invites",
        title: "What should I check when invites do not arrive?",
        body: "Check spam folders, invite-link expiration, and allowed domains before sending a new invite.",
        category: "team",
        keywords: ["invite", "member", "team"],
    },
    {
        id: "mfa",
        title: "Can I require two-factor authentication?",
        body: "Admins can require two-factor authentication for all members from security settings.",
        category: "security",
        keywords: ["2FA", "auth", "security"],
    },
];

function buildCode(locale: "ja" | "en", withCategories = true, defaultSearchValue = "") {
    const items = locale === "ja" ? baseItemsJa : baseItemsEn;
    const copy = locale === "ja"
        ? {
            account: "アカウント",
            team: "チーム",
            security: "セキュリティ",
            searchPlaceholder: "項目を検索...",
            clearSearchLabel: "検索語を消去",
            allCategoryLabel: "すべて",
            clearFiltersLabel: "条件をクリア",
            emptyTitle: "一致する項目がありません",
            emptyDescription: "検索語やカテゴリを変更してください。",
        }
        : {
            account: "Account",
            team: "Team",
            security: "Security",
            searchPlaceholder: "Search topics...",
            clearSearchLabel: "Clear search",
            allCategoryLabel: "All",
            clearFiltersLabel: "Clear filters",
            emptyTitle: "No matching topics",
            emptyDescription: "Change the search term or category.",
        };
    // ⭐ 見本の中にそのまま書き出す式。定数なので大文字で置く。
    const RESULT_COUNT_EXPR = locale === "ja"
        ? 'visible + " / " + total + " 件を表示"'
        : '"Showing " + visible + " of " + total';

    return withCategories
        ? `import * as React from "react";
import { SearchableAccordion, type SearchableAccordionItem } from "@gunjo/ui";

const items: SearchableAccordionItem[] = ${JSON.stringify(items, null, 2)};

const categories = [
  { id: "account", label: ${JSON.stringify(copy.account)} },
  { id: "team", label: ${JSON.stringify(copy.team)} },
  { id: "security", label: ${JSON.stringify(copy.security)} },
];

export function HelpAccordion() {
  const [searchValue, setSearchValue] = React.useState(${JSON.stringify(defaultSearchValue)});

  return (
    <SearchableAccordion
      items={items}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      categories={categories}
      labels={{
        searchPlaceholder: ${JSON.stringify(copy.searchPlaceholder)},
        clearSearchLabel: ${JSON.stringify(copy.clearSearchLabel)},
        allCategoryLabel: ${JSON.stringify(copy.allCategoryLabel)},
        resultCountLabel: (visible, total) => ${RESULT_COUNT_EXPR},
        clearFiltersLabel: ${JSON.stringify(copy.clearFiltersLabel)},
        emptyTitle: ${JSON.stringify(copy.emptyTitle)},
        emptyDescription: ${JSON.stringify(copy.emptyDescription)},
      }}
    />
  );
}`
        : `import * as React from "react";
import { SearchableAccordion, type SearchableAccordionItem } from "@gunjo/ui";

const items: SearchableAccordionItem[] = ${JSON.stringify(items, null, 2)};

export function HelpAccordion() {
  const [searchValue, setSearchValue] = React.useState(${JSON.stringify(defaultSearchValue)});

  return (
    <SearchableAccordion
      items={items}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      showCategoryTabs={false}
      labels={{
        searchPlaceholder: ${JSON.stringify(copy.searchPlaceholder)},
        clearSearchLabel: ${JSON.stringify(copy.clearSearchLabel)},
        allCategoryLabel: ${JSON.stringify(copy.allCategoryLabel)},
        resultCountLabel: (visible, total) => ${RESULT_COUNT_EXPR},
        clearFiltersLabel: ${JSON.stringify(copy.clearFiltersLabel)},
        emptyTitle: ${JSON.stringify(copy.emptyTitle)},
        emptyDescription: ${JSON.stringify(copy.emptyDescription)},
      }}
    />
  );
}`;
}

export default function SearchableAccordionPage() {
    const { locale, sectionLabels } = useLocale();
    const metadata = displayMetadata as Record<string, { title: string; description: string }>;
    const items = locale === "ja" ? baseItemsJa : baseItemsEn;
    const usageCode = buildCode(locale, true);
    const noCategoriesCode = buildCode(locale, false);
    const emptyCode = buildCode(locale, true, locale === "ja" ? "契約更新" : "renewal");

    return (
        <ComponentLayout
            title={metadata.searchableAccordion.title}
            description={metadata.searchableAccordion.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "SearchableAccordion", href: "/docs/components/searchable-accordion" },
                { name: "AccordionGroup", href: "/docs/components/accordion-group" },
                { name: "SearchInput", href: "/docs/components/search-input" },
                { name: "Tabs", href: "/docs/components/tabs" },
                { name: "EmptyState", href: "/docs/components/empty-state" },
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            relatedComponents={[
                { name: "AccordionGroup", href: "/docs/components/accordion-group" },
                { name: "SearchInput", href: "/docs/components/search-input" },
                { name: "FilterButton", href: "/docs/components/filter-button" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: アコーディオン（Accordion）" : "UIXHERO: Accordion (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/accordion`,
                    relation: "nearest",
                },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/searchable-accordion"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="lg"
            >
                <SearchableAccordionDemo locale={locale} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-categories",
                            title: locale === "ja" ? "カテゴリ付き" : "With categories",
                            description: locale === "ja" ? "検索語とカテゴリタブで FAQ やヘルプ項目を絞り込みます。" : "Filter FAQ or help items by search term and category tabs.",
                            preview: <SearchableAccordionDemo locale={locale} />,
                            previewBodyWidth: "lg",
                            code: usageCode,
                        },
                        {
                            key: "without-categories",
                            title: locale === "ja" ? "検索のみ" : "Search only",
                            description: locale === "ja" ? "カテゴリが不要な短い一覧では検索だけを表示します。" : "Use only search when categories are unnecessary.",
                            preview: (
                                <SearchableAccordion
                                    className="w-full max-w-2xl"
                                    items={items}
                                    showCategoryTabs={false}
                                    labels={{
                                        searchPlaceholder: locale === "ja" ? "項目を検索..." : "Search topics...",
                                        clearSearchLabel: locale === "ja" ? "検索語を消去" : "Clear search",
                                        resultCountLabel: (visible, total) =>
                                            locale === "ja" ? `${visible} / ${total} 件を表示` : `Showing ${visible} of ${total}`,
                                    }}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: noCategoriesCode,
                        },
                        {
                            key: "empty",
                            title: locale === "ja" ? "該当なし" : "No results",
                            description: locale === "ja" ? "一致する項目がない場合は EmptyState と条件クリアを表示します。" : "When nothing matches, show EmptyState and a clear-filters action.",
                            preview: (
                                <SearchableAccordion
                                    className="w-full max-w-2xl"
                                    items={items}
                                    defaultSearchValue={locale === "ja" ? "契約更新" : "renewal"}
                                    categories={[
                                        { id: "account", label: locale === "ja" ? "アカウント" : "Account" },
                                        { id: "team", label: locale === "ja" ? "チーム" : "Team" },
                                        { id: "security", label: locale === "ja" ? "セキュリティ" : "Security" },
                                    ]}
                                    labels={{
                                        searchPlaceholder: locale === "ja" ? "項目を検索..." : "Search topics...",
                                        clearSearchLabel: locale === "ja" ? "検索語を消去" : "Clear search",
                                        allCategoryLabel: locale === "ja" ? "すべて" : "All",
                                        resultCountLabel: (visible, total) =>
                                            locale === "ja" ? `${visible} / ${total} 件を表示` : `Showing ${visible} of ${total}`,
                                        clearFiltersLabel: locale === "ja" ? "条件をクリア" : "Clear filters",
                                        emptyTitle: locale === "ja" ? "一致する項目がありません" : "No matching topics",
                                        emptyDescription: locale === "ja" ? "検索語やカテゴリを変更してください。" : "Change the search term or category.",
                                    }}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: emptyCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        {
                            name: "items",
                            type: "SearchableAccordionItem[]",
                            description: locale === "ja" ? "表示する accordion 項目です。検索用に category / keywords / searchText を渡せます。" : "Accordion items. Provide category, keywords, or searchText for filtering.",
                        },
                        {
                            name: "searchValue / defaultSearchValue / onSearchValueChange",
                            type: "string / (value) => void",
                            description: locale === "ja" ? "検索語の controlled / uncontrolled API です。" : "Controlled or uncontrolled search-term API.",
                        },
                        {
                            name: "categoryValue / defaultCategoryValue / onCategoryValueChange",
                            type: "string / (value) => void",
                            description: locale === "ja" ? "カテゴリタブの controlled / uncontrolled API です。" : "Controlled or uncontrolled category API.",
                        },
                        {
                            name: "openValue / defaultOpenValue / onOpenValueChange",
                            type: "string[] / (value) => void",
                            description: locale === "ja" ? "開いている項目の controlled / uncontrolled API です。" : "Controlled or uncontrolled open item API.",
                        },
                        {
                            name: "labels",
                            type: "SearchableAccordionLabels",
                            description: locale === "ja" ? "検索、件数、該当なし、全展開操作の文言です。" : "Copy for search, result counts, empty state, and expand controls.",
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[420px] overflow-auto rounded-md border bg-muted font-mono text-sm">
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
                            <strong>探す手段を2つ重ねた。</strong>検索の文字と分類のタブを両方持ち、両方を満たす項目だけを出します。資料はアコーディオンの核を「何を隠すか」に置いていますが、項目が数十件になると「隠した中から探す」が要るので、そこを部品に足しました。件数は「12 / 48」の形で常に出します。
                        </li>
                        <li>
                            <strong>開閉は複数同時にできる形にした。</strong>資料は「FAQ は複数展開が向く」と書いています。この部品は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AccordionGroup</code> を使い、いま見えている項目だけをまとめて開く・閉じるボタンを持ちます。絞り込んだ結果に対してだけ効くので、隠れている項目が勝手に開くことはありません。
                        </li>
                        <li>
                            <strong>0件のときに手当てを出す。一方、既定で開く項目はまだ決めていません。</strong>一致が無いときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">EmptyState</code> を出し、絞り込みが効いているときだけ「条件を消す」ボタンを添えます。資料が挙げている「最もよく参照される1〜2項目を既定で開いておく」は<strong>まだ書いていません</strong>。いまは全部閉じた状態から始まり、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">defaultOpenValue</code> を呼ぶ側が渡さなければ何も開きません。
                            <br />
                            一般のアコーディオンの設計は UIXHERO の「アコーディオン」にあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Two ways to narrow, stacked.</strong> A search box and category tabs both apply, and only items matching both are shown. The article&rsquo;s core question is what to hide; once a list runs to dozens of items, finding things inside the hidden part becomes its own problem, so that was built in. The count is always visible as a ratio.
                        </li>
                        <li>
                            <strong>Multiple panels may be open at once.</strong> The article notes that FAQs suit multi-expand. This uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AccordionGroup</code> and adds buttons that open or close only the items currently visible, so filtered-out items are never expanded behind your back.
                        </li>
                        <li>
                            <strong>The empty state is handled; a default-open item is not decided yet.</strong> With no matches it renders an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">EmptyState</code>, offering a clear-filters button only when a filter is actually active. The article&rsquo;s advice to leave the one or two most-consulted items open by default is <strong>not written yet</strong>: everything starts closed unless the caller passes <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">defaultOpenValue</code>.
                            <br />
                            The general design of accordions is covered by UIXHERO&rsquo;s accordion article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
