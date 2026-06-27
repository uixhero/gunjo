"use client";

import * as React from "react";
import { PageHeader, Button, Badge } from "@gunjo/ui";
import { IconRefresh, IconX } from "@tabler/icons-react";

export function PageHeaderDemo() {
  const [log, setLog] = React.useState("—");

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border">
      <PageHeader
        title="手荷物追跡"
        subtitle="ヤマダ クロウ 様・ABC123"
        onBack={() => setLog("戻る")}
        actions={
          <Button size="icon" variant="ghost" aria-label="更新" onClick={() => setLog("更新")}>
            <IconRefresh className="size-5" />
          </Button>
        }
      />
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted-foreground">
          ← 戻る / 更新 をタップ：<span className="font-medium text-foreground">{log}</span>
        </p>
        <PageHeader
          title="予約の確認"
          align="center"
          sticky={false}
          onBack={() => setLog("戻る(中央寄せ)")}
          actions={
            <Button size="icon" variant="ghost" aria-label="閉じる" onClick={() => setLog("閉じる")}>
              <IconX className="size-5" />
            </Button>
          }
          className="rounded-lg border"
        />
        <p className="text-xs text-muted-foreground">↑ align=&quot;center&quot;（iOS 風・中央タイトル）。上は既定の左寄せ・sticky。</p>
        <Badge variant="secondary">戻る/アクションは 44px のタッチ標的</Badge>
      </div>
    </div>
  );
}
