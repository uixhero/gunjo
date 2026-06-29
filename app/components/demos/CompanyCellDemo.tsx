import * as React from "react";
import { CompanyCell } from "@gunjo/ui";
import { IconBuildingFactory2, IconCoin } from "@tabler/icons-react";

export function CompanyCellDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <CompanyCell
        name="協栄精密工業株式会社"
        secondary="製造業（金属加工）・愛知県"
        logo={<IconBuildingFactory2 className="size-5" />}
      />
      {/* No logo → square initial tile (vs PersonCell's round avatar). */}
      <CompanyCell name="ものづくり補助金" secondary="設備投資・補助上限 1,250万円" />
      <CompanyCell
        name="さくらIT導入支援"
        secondary="サービス業・東京都"
        size="lg"
        logo={<IconCoin className="size-6" />}
      />
      <CompanyCell name="小規模事業者持続化補助金" secondary="販路開拓・補助率 2/3" size="sm" />
    </div>
  );
}
