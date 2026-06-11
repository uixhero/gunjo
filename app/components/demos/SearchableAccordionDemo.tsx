"use client";

import * as React from "react";
import { SearchableAccordion, type SearchableAccordionItem } from "@gunjo/ui";

const itemsJa: SearchableAccordionItem[] = [
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

const itemsEn: SearchableAccordionItem[] = [
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

export function SearchableAccordionDemo({ locale = "ja" }: { locale?: "ja" | "en" }) {
    const [searchValue, setSearchValue] = React.useState("");
    const items = locale === "ja" ? itemsJa : itemsEn;

    return (
        <SearchableAccordion
            className="w-full max-w-2xl"
            items={items}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            categories={[
                { id: "account", label: locale === "ja" ? "アカウント" : "Account" },
                { id: "team", label: locale === "ja" ? "チーム" : "Team" },
                { id: "security", label: locale === "ja" ? "セキュリティ" : "Security" },
            ]}
            label={locale === "ja" ? "ヘルプ項目" : "Help topics"}
            description={locale === "ja" ? "検索語とカテゴリで項目を絞り込みます。" : "Filter items by search term and category."}
            labels={{
                searchPlaceholder: locale === "ja" ? "項目を検索..." : "Search topics...",
                clearSearchLabel: locale === "ja" ? "検索語を消去" : "Clear search",
                allCategoryLabel: locale === "ja" ? "すべて" : "All",
                resultCountLabel: (visible, total) =>
                    locale === "ja" ? `${visible} / ${total} 件を表示` : `Showing ${visible} of ${total}`,
                clearFiltersLabel: locale === "ja" ? "条件をクリア" : "Clear filters",
                emptyTitle: locale === "ja" ? "一致する項目がありません" : "No matching topics",
                emptyDescription: locale === "ja" ? "検索語やカテゴリを変更してください。" : "Change the search term or category.",
                expandLabel: locale === "ja" ? "表示中の項目をすべて開く" : "Open visible items",
                collapseLabel: locale === "ja" ? "表示中の項目をすべて閉じる" : "Close visible items",
            }}
        />
    );
}
