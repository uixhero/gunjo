"use client";

import * as React from "react";
import { Badge, Button, DesktopPageHeader } from "@gunjo/ui";

export function DesktopPageHeaderDemo({ locale = "ja" }: { locale?: "ja" | "en" }) {
  const [saved, setSaved] = React.useState(false);
  const isJa = locale === "ja";

  return (
    <DesktopPageHeader
      eyebrow={isJa ? "群青交通　東京営業所" : "Gunjo Transit · Tokyo depot"}
      title={isJa ? "車両管理・整備コンソール" : "Fleet maintenance console"}
      subtitle={
        isJa
          ? "稼働状況、車検・保険の期限、入庫予定を一元管理"
          : "Track availability, inspection and insurance deadlines, and workshop plans"
      }
      actions={
        <>
          {saved && <Badge variant="success">{isJa ? "保存済み" : "Saved"}</Badge>}
          <Button size="sm" variant="outline" onClick={() => setSaved(true)}>
            {isJa ? "更新を保存" : "Save updates"}
          </Button>
        </>
      }
    />
  );
}
