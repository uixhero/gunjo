import type { Metadata } from "next";
import { Separator } from "@gunjo/ui";
import { ClaimsScreen } from "./ClaimsScreen";
import { officeName, adjusterName, todayLabel } from "./data";

export const metadata: Metadata = {
    title: "保険金請求・査定管理",
    description:
        "架空の保険会社「群青損害保険」のデモ画面。自動車保険の保険金請求の一覧・査定ワークフロー・査定明細・査定の確定（サインオフ）・高額案件の2名承認を、UIコンポーネント集 @gunjo/ui だけで組んだ動く見本です。",
};

export default function InsuranceDemoClaimsPage() {
    return (
        <>
            <header className="mb-6 space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span>{officeName}</span>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums">{todayLabel}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    保険金請求・査定管理
                </h1>
                <p className="text-sm text-muted-foreground">
                    自動車保険 損害サービス ・ 査定担当 {adjusterName}
                </p>
            </header>
            <Separator className="mb-6" />
            <ClaimsScreen />
        </>
    );
}
