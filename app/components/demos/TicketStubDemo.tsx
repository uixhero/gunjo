"use client";

import * as React from "react";
import { TicketStub, Badge, Separator, ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

export function TicketStubDemo() {
  const [face, setFace] = React.useState<"boarding" | "coupon">("boarding");

  return (
    <div className="w-full max-w-xs space-y-3">
      <ToggleGroup type="single" value={face} onValueChange={(v) => v && setFace(v as "boarding" | "coupon")} variant="outline" size="sm" disallowEmpty>
        <ToggleGroupItem value="boarding">搭乗券</ToggleGroupItem>
        <ToggleGroupItem value="coupon">クーポン</ToggleGroupItem>
      </ToggleGroup>

      {face === "boarding" ? (
        <TicketStub value="NH106-X7K2QM-18K" format="qr" codeLabel="X7K2QM">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">NH106 ✈ ANA</span>
            <Badge variant="info">ビジネス</Badge>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">HND</div>
              <div className="text-xs text-muted-foreground">17:05</div>
            </div>
            <div className="px-2 text-muted-foreground">→</div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums leading-none">LAX</div>
              <div className="text-xs text-muted-foreground">10:55</div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>座席 <span className="font-medium text-foreground">18K</span></span>
            <span>搭乗口 <span className="font-medium text-foreground">62</span></span>
            <span>搭乗 <span className="font-medium text-foreground">16:25</span></span>
          </div>
        </TicketStub>
      ) : (
        <TicketStub value="CPN-NEWDAYS-3X-887412" codeLabel="887412">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">NewDays ポイント3倍</span>
            <Badge variant="warning">期間限定</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">対象：駅ナカ NewDays 全店・〜2026/06/30・レジでご提示ください</p>
        </TicketStub>
      )}
    </div>
  );
}
