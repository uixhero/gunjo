import * as React from "react";
import { MatchCard, CompanyCell, Button, type MatchFactor } from "@gunjo/ui";
import { IconBuildingFactory2, IconCoin } from "@tabler/icons-react";

// The two sides are DIFFERENT kinds — a company and a subsidy program. Entity-agnostic.
const FACTORS: MatchFactor[] = [
  { label: "対象事業者", value: "◎", tone: "success", detail: "中小・製造業 → 対象" },
  { label: "業種要件", value: "○", tone: "success" },
  { label: "従業員規模", value: "○", tone: "success", detail: "48名 ≤ 上限" },
  { label: "設備投資要件", value: "△", tone: "warning", detail: "見積追加が必要" },
  { label: "加点項目", value: "◎", tone: "success", detail: "賃上げ表明あり" },
];

export function MatchCardDemo() {
  return (
    <div className="w-full max-w-md">
      <MatchCard
        label="協栄精密工業 × ものづくり補助金 の適合"
        left={
          <CompanyCell
            name="協栄精密工業"
            secondary="製造業・愛知"
            logo={<IconBuildingFactory2 className="size-5" />}
          />
        }
        right={
          <CompanyCell
            name="ものづくり補助金"
            secondary="設備投資・上限1,250万円"
            logo={<IconCoin className="size-5" />}
          />
        }
        score={
          <>
            <span className="text-lg font-bold tabular-nums text-foreground">92%</span>
            <span className="text-[10px] text-muted-foreground">適合度</span>
          </>
        }
        factors={FACTORS}
        factorsLabel="申請要件の適合"
        actions={
          <>
            <Button variant="outline" size="sm">詳細を見る</Button>
            <Button variant="primary" size="sm">申請を準備する</Button>
          </>
        }
      />
    </div>
  );
}
