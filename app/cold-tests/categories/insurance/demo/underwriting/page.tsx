import type { Metadata } from "next";
import { PlannedScreenView } from "../_lib/PlannedScreenView";

export const metadata: Metadata = {
    title: "引受査定（準備中）",
    description:
        "架空の保険会社「群青損害保険」のデモの準備中ページ。申し込みを引き受けるかどうかを審査する画面で、業務の流れ「契約のライフサイクル」で申し込みの次のステップに当たります。連載「コールドテスト」の今後の回で出題予定です。",
};

export default function InsuranceDemoUnderwritingPage() {
    return <PlannedScreenView slug="underwriting" />;
}
