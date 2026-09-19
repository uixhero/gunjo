import type { Metadata } from "next";
import { PoliciesScreen } from "./PoliciesScreen";

export const metadata: Metadata = {
    title: "契約管理ダッシュボード",
    description:
        "架空の保険会社「群青損害保険」のデモ画面。保有契約の一覧・更新管理・失効リスク・募集人（保険を売る営業担当者）ごとの業績・保険料内訳を、UIコンポーネント集 @gunjo/ui だけで組んだ動く見本です。",
};

export default function InsuranceDemoPoliciesPage() {
    return <PoliciesScreen />;
}
