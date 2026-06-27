"use client";

import * as React from "react";
import { Itinerary, Badge, type ItineraryDay } from "@gunjo/ui";
import { IconPlane, IconBuildingPavilion, IconMapPin, IconBeach } from "@tabler/icons-react";

const DAYS: ItineraryDay[] = [
  {
    label: "1日目",
    sublabel: "6月27日(土)・東京 → ホノルル",
    items: [
      {
        time: "21:55 発 → 10:25 着（現地）",
        icon: <IconPlane className="size-4" />,
        tone: "primary",
        title: "NH182 羽田(HND) → ホノルル(HNL)",
        description: "往路・所要 約7時間30分・座席 32K",
        trailing: <Badge variant="info">往路</Badge>,
        onSelect: () => {},
      },
      {
        time: "チェックイン 15:00",
        icon: <IconBuildingPavilion className="size-4" />,
        tone: "success",
        title: "ハイアット リージェンシー ワイキキ",
        description: "3泊・予約番号 RZ8K4P",
        onSelect: () => {},
      },
    ],
  },
  {
    label: "2日目",
    sublabel: "6月28日(日)・ホノルル",
    items: [
      {
        time: "08:00 集合",
        icon: <IconMapPin className="size-4" />,
        tone: "warning",
        title: "ダイヤモンドヘッド 登山ツアー",
        description: "送迎あり・所要 約3時間",
        onSelect: () => {},
      },
      {
        time: "終日",
        icon: <IconBeach className="size-4" />,
        tone: "muted",
        title: "フリータイム（ワイキキビーチ）",
        description: "自由行動",
      },
    ],
  },
];

export function ItineraryDemo() {
  return (
    <div className="w-full max-w-md">
      <Itinerary days={DAYS} />
    </div>
  );
}
