import type { Metadata } from "next";
import { PlannedScreenView } from "../_lib/PlannedScreenView";

export const metadata: Metadata = {
    title: "立件・損害調査（準備中）",
    description:
        "架空の保険会社「群青損害保険」のデモの準備中ページ。受け付けた事故の連絡を案件として登録し、損害を調べる画面で、業務の流れ「事故処理」で受付の次のステップに当たります。連載「コールドテスト」の今後の回で出題予定です。",
};

export default function InsuranceDemoInvestigationsPage() {
    return <PlannedScreenView slug="investigations" />;
}
