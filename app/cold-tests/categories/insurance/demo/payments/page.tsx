import type { Metadata } from "next";
import { Separator } from "@gunjo/ui";
import { PaymentsScreen } from "./PaymentsScreen";
import { deptName, branchName, officerName, todayLabel } from "./data";

export const metadata: Metadata = {
    title: "保険金支払・精算管理",
    description:
        "架空の保険会社「群青損害保険」のデモ画面。保険金支払の一覧・支払明細（認定損害額 − 過失相殺 − 免責金額 − 既払金 = 今回支払額）・承認の流れ・高額案件の2名承認・振込手配を、UIコンポーネント集 @gunjo/ui だけで組んだ動く見本です。",
};

export default function InsuranceDemoPaymentsPage() {
    return (
        <>
            <header className="mb-6 space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span>{deptName}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    保険金支払・精算管理
                </h1>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span>{branchName}</span>
                    <span aria-hidden>·</span>
                    <span>{officerName}</span>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums">{todayLabel}</span>
                </div>
            </header>
            <Separator className="mb-6" />
            <PaymentsScreen />
        </>
    );
}
