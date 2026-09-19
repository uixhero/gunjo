import type { Metadata } from "next";
import { EntryOverview } from "./EntryOverview";

export const metadata: Metadata = {
    title: "業務の全体像と画面一覧",
    description:
        "架空の保険会社「群青損害保険」のデモの入口。契約のライフサイクルと事故処理の2つの業務フローに「契約管理」「保険金請求・査定」「保険金支払・精算」の3画面を対応づけ、準備中の画面とこの見本の来歴も掲載しています。",
};

// デモの入口 — 業務フロー図・画面一覧・来歴。扉ページの見本カードはここに着地する。
export default function InsuranceDemoIndexPage() {
    return <EntryOverview />;
}
