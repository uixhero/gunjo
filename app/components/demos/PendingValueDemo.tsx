"use client";

import * as React from "react";
import {
  Button,
  DistributionBar,
  Input,
  ListCard,
  PendingValue,
  PendingValueBadge,
  isPendingValueSettled,
  type PendingValueState,
} from "@gunjo/ui";

const CHECKS: { id: string; name: string; state: PendingValueState; result: string }[] = [
  { id: "dup", name: "重複した申し込み", state: "settled", result: "重なりなし" },
  { id: "existing", name: "有効な既存契約", state: "settled", result: "1件見つかりました" },
  { id: "licence", name: "運転免許証の照会", state: "pending", result: "写しが読み取れません" },
];

export function PendingValueDemo() {
  const [place, setPlace] = React.useState("");
  const [asked, setAsked] = React.useState(true);

  // 打てば「聞き取った」、消せば「まだ聞いていない」。「無いと確認」は別の状態。
  const placeState: PendingValueState = !asked
    ? "settled"
    : place.trim().length > 0
      ? "settled"
      : "pending";

  const settledChecks = CHECKS.filter((c) => isPendingValueSettled(c.state));

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* 入力欄を包む — 破線か実線かが第一の見分け。色ではない。 */}
      <PendingValue
        id="demo-place"
        state={placeState}
        label={<label htmlFor="demo-place-input">事故の場所</label>}
        statusLabel={
          placeState === "settled" ? (asked ? "聞き取りました" : "無いと確認") : "まだ聞いていません"
        }
        note={
          placeState === "pending"
            ? "空欄のままだと、聞き忘れなのか無いと答えられたのかが後から分かりません。"
            : undefined
        }
        actions={
          <Button type="button" size="xs" variant="outline" onClick={() => setAsked((v) => !v)}>
            {asked ? "「無いと確認」にする" : "聞き取りに戻す"}
          </Button>
        }
      >
        {({ describedBy }) =>
          asked ? (
            <Input
              id="demo-place-input"
              aria-describedby={describedBy}
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="市区町村と交差点名など"
            />
          ) : (
            <p className="text-sm text-foreground">場所は分からない、と確認しました。</p>
          )
        }
      </PendingValue>

      {/* 値そのものを包む — 確定したら枠は消える。 */}
      <PendingValue
        state="provisional"
        frame="unsettled"
        label="過失割合"
        statusLabel="協議中"
        tone="warning"
        note="確定するまで、この割合で支払を進められません。"
      >
        <DistributionBar
          segments={[
            { label: "当方", value: 70, color: "primary" },
            { label: "相手方", value: 30, color: "muted" },
          ]}
          showLegend
          totalLabel="割合"
          formatValue={(v) => `${v}%`}
        />
      </PendingValue>

      {/* 行の中では枠ではなくバッジだけ。 */}
      <div className="flex flex-col gap-2">
        {CHECKS.map((check) => (
          <ListCard
            key={check.id}
            title={check.name}
            description={check.result}
            status={
              <PendingValueBadge
                state={check.state}
                size="sm"
                label={check.state === "settled" ? "照合が済みました" : "まだ照合できていません"}
              />
            }
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        照合が済んだ {settledChecks.length}件 ／ まだ済んでいない {CHECKS.length - settledChecks.length}件。
        破線とアイコンつきの文字で示すので、色を落としても読めます。
      </p>
    </div>
  );
}
