"use client";

import * as React from "react";
import {
  AmountBreakdown,
  type AmountLine,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  MetadataList,
  PersonCell,
  Tag,
  Separator,
  EmptyState,
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  formatCurrency,
} from "@gunjo/ui";
import { IconFileText } from "@tabler/icons-react";
import {
  type Policy,
  type PremiumLine,
  agentById,
  PRODUCT_LABEL,
  RENEWAL_NOTICE_LABEL,
  formatJpDate,
} from "./data";
import { StatusBadge, RenewalNoticeBadge } from "./badges";

// 保険料の内訳: 基本保険料 ＋ 各特約 − 各割引 ＝ 年間保険料
// （割引はデータ上マイナス値。減算行として AmountBreakdown に渡す。）
function premiumAmountLines(lines: PremiumLine[]): AmountLine[] {
  const base = lines.filter((l) => l.kind === "base");
  const riders = lines.filter((l) => l.kind === "rider");
  const discounts = lines.filter((l) => l.kind === "discount");
  const toLine = (l: PremiumLine): AmountLine => ({
    label: l.label,
    amount: l.amount,
    kind: l.kind === "discount" ? "subtract" : "add",
    note: l.note,
  });

  const out: AmountLine[] = [
    { type: "heading", label: "基本保険料" },
    ...base.map(toLine),
  ];
  if (riders.length > 0) {
    out.push({ type: "heading", label: "特約・付帯" }, ...riders.map(toLine));
  }
  out.push({
    type: "subtotal",
    label: "保険料合計（加算）",
    amount: [...base, ...riders].reduce((s, l) => s + l.amount, 0),
  });
  if (discounts.length > 0) {
    out.push({ type: "heading", label: "割引" }, ...discounts.map(toLine));
  }
  return out;
}

export function PolicyDetailDrawer({
  policy,
  onClose,
}: {
  policy: Policy | null;
  onClose: () => void;
}) {
  const open = policy !== null;
  const agent = policy ? agentById(policy.agentId) : undefined;

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
      direction="right"
    >
      <DrawerContent
        side="right"
        className="w-[min(38rem,100vw)] max-w-[100vw]"
      >
        {policy ? (
          <div className="flex h-full flex-col overflow-hidden">
            <DrawerHeader className="border-b">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={policy.status} />
                <Tag variant="outline">{PRODUCT_LABEL[policy.product]}</Tag>
                <Tag variant="outline">
                  {policy.contractType === "new" ? "新規" : "継続"}
                </Tag>
              </div>
              <DrawerTitle className="mt-1 text-lg">{policy.holder} 様</DrawerTitle>
              <DrawerDescription>
                証券番号 {policy.policyNo} ・ {policy.productLabel}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">
                    契約概要
                  </TabsTrigger>
                  <TabsTrigger value="premium" className="flex-1">
                    保険料内訳
                  </TabsTrigger>
                  <TabsTrigger value="claims" className="flex-1">
                    事故・請求歴
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-4">
                  <div className="flex flex-col gap-5">
                    <section aria-labelledby="sec-contract">
                      <h3
                        id="sec-contract"
                        className="mb-2 text-sm font-semibold text-foreground"
                      >
                        契約情報
                      </h3>
                      <MetadataList
                        items={[
                          { label: "契約者", value: `${policy.holder}（${policy.holderKana}）` },
                          { label: "始期", value: formatJpDate(policy.startDate) },
                          { label: "満期", value: formatJpDate(policy.endDate) },
                          {
                            label: "支払方法",
                            value: policy.payMethod === "annual" ? "年払" : "月払",
                          },
                          ...(policy.grade !== undefined
                            ? [{ label: "ノンフリート等級", value: `${policy.grade}等級` }]
                            : []),
                          {
                            label: "年間保険料",
                            value: formatCurrency(policy.annualPremium),
                          },
                          {
                            label: "代理店手数料率",
                            value: `${(policy.commissionRate * 100).toFixed(0)}%`,
                          },
                        ]}
                      />
                    </section>

                    <section aria-labelledby="sec-coverage">
                      <h3
                        id="sec-coverage"
                        className="mb-2 text-sm font-semibold text-foreground"
                      >
                        補償内容
                      </h3>
                      <MetadataList
                        layout="horizontal"
                        items={policy.coverage.map((c) => ({
                          label: c.label,
                          value: c.value,
                        }))}
                      />
                    </section>

                    <section aria-labelledby="sec-riders">
                      <h3
                        id="sec-riders"
                        className="mb-2 text-sm font-semibold text-foreground"
                      >
                        付帯特約
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {policy.riders.map((r) => (
                          <Tag key={r}>{r}</Tag>
                        ))}
                      </div>
                    </section>

                    <Separator />

                    <section aria-labelledby="sec-agent">
                      <h3
                        id="sec-agent"
                        className="mb-2 text-sm font-semibold text-foreground"
                      >
                        担当募集人 ・ 更新状況
                      </h3>
                      {agent ? (
                        <PersonCell
                          name={agent.name}
                          secondary={agent.role}
                          tertiary={`募集人登録番号 ${agent.registrationNo}`}
                          trailing={<RenewalNoticeBadge status={policy.renewalNotice} />}
                        />
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        更新案内: {RENEWAL_NOTICE_LABEL[policy.renewalNotice]} ・ 満期まで{" "}
                        {policy.daysToExpiry >= 0
                          ? `${policy.daysToExpiry}日`
                          : `失効後 ${Math.abs(policy.daysToExpiry)}日`}
                      </p>
                    </section>
                  </div>
                </TabsContent>

                <TabsContent value="premium" className="p-4">
                  <AmountBreakdown
                    lines={premiumAmountLines(policy.premiumLines)}
                    total={{ label: "年間保険料", amount: policy.annualPremium }}
                    formula="年間保険料 ＝ 基本保険料 ＋ 特約 − 割引"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    ※ 上記は{policy.payMethod === "annual" ? "年払" : "月払（分割割増含む）"}
                    ベースの年間保険料です。実際の請求額は契約条件により変動します。
                  </p>
                </TabsContent>

                <TabsContent value="claims" className="p-4">
                  {policy.claims.length > 0 ? (
                    <Timeline>
                      {policy.claims.map((c, i) => (
                        <TimelineItem
                          key={i}
                          connector={i < policy.claims.length - 1}
                          variant={
                            c.status === "支払済"
                              ? "success"
                              : c.status === "査定中"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          <TimelineTime>{formatJpDate(c.date)}</TimelineTime>
                          <TimelineTitle>{c.kind}</TimelineTitle>
                          <TimelineDescription>
                            支払額 {c.amount > 0 ? formatCurrency(c.amount) : "—"} ・ {c.status}
                          </TimelineDescription>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  ) : (
                    <EmptyState
                      icon={<IconFileText className="h-6 w-6" />}
                      title="事故・請求歴はありません"
                      description="この契約には保険金請求の記録がありません。無事故継続中です。"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DrawerFooter className="border-t">
              <div className="flex flex-wrap gap-2">
                <Button className="flex-1">更新手続を開始</Button>
                <Button variant="outline" className="flex-1">
                  更新案内を送付
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost">閉じる</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
