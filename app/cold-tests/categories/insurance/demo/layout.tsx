import type { Metadata } from "next";
import { DemoShell } from "./_lib/DemoShell";
import { FICTIONAL_COMPANY } from "./_lib/fictional";

export const metadata: Metadata = {
    title: {
        template: `%s | ${FICTIONAL_COMPANY}（架空のデモ） | GunjoUI`,
        default: `${FICTIONAL_COMPANY}（架空の保険会社デモ） | GunjoUI`,
    },
    description:
        "架空の保険会社「群青損害保険」の業務アプリを、UIコンポーネント集 @gunjo/ui だけで組んだ動く見本。契約管理、保険金請求・査定、保険金支払・精算の3画面。実在の会社・商品とは関係ありません。",
};

export default function InsuranceDemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DemoShell>{children}</DemoShell>;
}
