"use client";

import * as React from "react";
import { NavRow, SettingGroup, Switch, Badge } from "@gunjo/ui";
import { IconCreditCard, IconMail, IconShieldCheck } from "@tabler/icons-react";

export function NavRowDemo() {
  const [pushOn, setPushOn] = React.useState(true);
  const [last, setLast] = React.useState<string | null>(null);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <SettingGroup label="お支払い">
        <NavRow
          icon={<IconCreditCard className="size-5" />}
          label="お支払い方法"
          value="口座振替"
          opensDialog
          onSelect={() => setLast("お支払い方法")}
        />
        <NavRow
          icon={<IconMail className="size-5" />}
          label="請求書の送付方法"
          description="毎月の請求書をどう受け取るか"
          value="Web（メール通知）"
          opensDialog
          onSelect={() => setLast("請求書の送付方法")}
        />
      </SettingGroup>

      <SettingGroup label="通知・セキュリティ">
        {/* Static control row — a Switch in trailing (no onSelect → not a button). */}
        <NavRow
          label="配達前プッシュ通知"
          description="お届け予定をプッシュでお知らせ"
          trailing={<Switch checked={pushOn} onCheckedChange={setPushOn} aria-label="配達前プッシュ通知" />}
        />
        <NavRow
          icon={<IconShieldCheck className="size-5" />}
          label="二段階認証"
          trailing={<Badge variant="success">有効</Badge>}
          onSelect={() => setLast("二段階認証")}
        />
      </SettingGroup>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {last ? `「${last}」を開く（ナビゲーション＝aria-haspopup, トグルではない）` : `プッシュ=${pushOn ? "ON" : "OFF"}・行をタップで詳細へ。`}
      </p>
    </div>
  );
}
