"use client";

import * as React from "react";
import { BottomActionBar, Button, Switch, Label, Badge } from "@gunjo/ui";

export function BottomActionBarDemo() {
  const [stack, setStack] = React.useState(false);
  const [called, setCalled] = React.useState(false);

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center gap-2">
        <Switch id="bab-stack" checked={stack} onCheckedChange={setStack} />
        <Label htmlFor="bab-stack" className="text-xs">stack（CTAを全幅で上に）</Label>
      </div>

      {/* a phone frame so the sticky bar reads as a dock */}
      <div className="relative h-72 overflow-hidden rounded-xl border bg-muted/30">
        <div className="h-full overflow-y-auto px-4 pb-28 pt-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">配車内容の確認</p>
          <p className="mt-1">乗車地：渋谷駅前 / 行き先：六本木ヒルズ</p>
          <p className="mt-3">車種：JPNタクシー・到着まで約4分</p>
          <p className="mt-3 text-xs">（スクロールしてもバーは下に固定）</p>
        </div>

        <BottomActionBar
          className="absolute inset-x-0"
          stack={stack}
          actions={
            <Button size="lg" onClick={() => setCalled((c) => !c)}>
              {called ? "配車をキャンセル" : "この内容で呼ぶ"}
            </Button>
          }
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">見積もり料金</span>
            <span className="text-base font-semibold tabular-nums text-foreground">
              ¥1,200〜 <Badge variant="info" className="ml-1 align-middle">到着 4分</Badge>
            </span>
          </div>
        </BottomActionBar>
      </div>

      <p className="text-xs text-muted-foreground">
        左に走行サマリ（料金/ETA）、右に主要CTA。safe-area-inset で home-indicator を回避。PageHeader（上）の対。
      </p>
    </div>
  );
}
