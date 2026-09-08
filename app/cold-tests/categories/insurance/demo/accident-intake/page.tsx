import type { Metadata } from "next";
import { PlannedScreenView } from "../_lib/PlannedScreenView";

export const metadata: Metadata = {
    title: "事故受付（準備中）",
    description:
        "架空の保険会社「群青損害保険」のデモの準備中ページ。事故の連絡を受け付ける画面で、業務の流れ「事故処理」の最初のステップに当たります。連載「コールドテスト」の今後の回で出題予定です。",
};

export default function InsuranceDemoAccidentIntakePage() {
    return <PlannedScreenView slug="accident-intake" />;
}
