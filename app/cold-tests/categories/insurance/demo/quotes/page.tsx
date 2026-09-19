import type { Metadata } from "next";
import { PlannedScreenView } from "../_lib/PlannedScreenView";

export const metadata: Metadata = {
    title: "見積作成（準備中）",
    description:
        "架空の保険会社「群青損害保険」のデモの準備中ページ。保険料の見積を作る画面で、業務の流れ「契約のライフサイクル」の最初のステップに当たります。連載「コールドテスト」の今後の回で出題予定です。",
};

export default function InsuranceDemoQuotesPage() {
    return <PlannedScreenView slug="quotes" />;
}
