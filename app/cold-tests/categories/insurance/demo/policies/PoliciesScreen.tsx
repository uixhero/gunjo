"use client";

import * as React from "react";
import type { ColumnDef } from "@gunjo/ui";
import {
  StatGroup,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  DataTable,
  PersonCell,
  RelationshipRow,
  Badge,
  Tag,
  Meter,
  Separator,
  SearchInput,
  Select,
  Button,
  EmptyState,
  formatCurrency,
  formatPercent,
} from "@gunjo/ui";
import {
  IconAlertTriangle,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  POLICIES,
  AGENTS,
  agentById,
  PRODUCT_LABEL,
  type Policy,
  type PolicyStatus,
  type ProductKind,
  formatJpDate,
} from "./data";
import { StatusBadge, RenewalNoticeBadge } from "./badges";
import { PolicyDetailDrawer } from "./PolicyDetailDrawer";

const STATUS_FILTERS: { value: PolicyStatus | "all"; label: string }[] = [
  { value: "all", label: "すべての状態" },
  { value: "active", label: "有効" },
  { value: "expiring", label: "満期間近" },
  { value: "renewing", label: "更新手続中" },
  { value: "lapsed", label: "失効" },
  { value: "cancelled", label: "解約" },
];

const PRODUCT_FILTERS: { value: ProductKind | "all"; label: string }[] = [
  { value: "all", label: "全商品種別" },
  { value: "auto", label: "自動車保険" },
  { value: "fire", label: "火災保険" },
  { value: "accident", label: "傷害保険" },
  { value: "liability", label: "賠償責任保険" },
];

export function PoliciesScreen() {
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<PolicyStatus | "all">("all");
  const [productFilter, setProductFilter] = React.useState<ProductKind | "all">("all");
  const [selected, setSelected] = React.useState<Policy | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim();
    return POLICIES.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (productFilter !== "all" && p.product !== productFilter) return false;
      if (q && !`${p.holder}${p.holderKana}${p.policyNo}${p.productLabel}`.includes(q))
        return false;
      return true;
    });
  }, [query, statusFilter, productFilter]);

  // --- サマリ指標 -----------------------------------------------------------
  const activeBook = POLICIES.filter(
    (p) => p.status !== "lapsed" && p.status !== "cancelled"
  );
  const premiumMTD = AGENTS.reduce((s, a) => s + a.premiumMTD, 0);
  const targetMTD = AGENTS.reduce((s, a) => s + a.target, 0);
  // 手数料は当月の入金ではなく、保有契約（年間保険料 × 手数料率）から出す
  // 年間見込の概算。当月収入と桁を並べると誤読するため年間で見せる。
  const commissionAnnual = Math.round(
    activeBook.reduce((s, p) => s + p.annualPremium * p.commissionRate, 0)
  );
  const expiringThisMonth = POLICIES.filter(
    (p) => p.daysToExpiry >= 0 && p.daysToExpiry <= 30
  );
  const lapseRisk = POLICIES.filter(
    (p) =>
      (p.status === "expiring" && p.renewalNotice !== "responded" && p.daysToExpiry <= 20) ||
      p.renewalNotice === "overdue"
  );
  const renewable = POLICIES.filter(
    (p) => p.status === "expiring" || p.status === "renewing"
  );
  const renewedOrResponded = renewable.filter(
    (p) => p.status === "renewing" || p.renewalNotice === "responded"
  );
  const renewalRate = renewable.length
    ? renewedOrResponded.length / renewable.length
    : 0;

  // --- 列定義 ---------------------------------------------------------------
  const columns: ColumnDef<Policy>[] = [
    {
      accessorKey: "holder",
      header: "契約者 / 証券番号",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <PersonCell
            name={p.holder}
            secondary={p.policyNo}
            tertiary={p.holderKana}
            avatarClassName="bg-info-subtle text-info-subtle-foreground"
            size="sm"
          />
        );
      },
    },
    {
      accessorKey: "productLabel",
      header: "商品種別",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Tag variant="outline">{PRODUCT_LABEL[row.original.product]}</Tag>
          <span className="text-xs text-muted-foreground">{row.original.productLabel}</span>
        </div>
      ),
    },
    {
      accessorKey: "annualPremium",
      header: "保険料(年間)",
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          <div className="font-medium">{formatCurrency(row.original.annualPremium)}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.payMethod === "annual" ? "年払" : "月払"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "始期〜満期",
      cell: ({ row }) => {
        const p = row.original;
        const soon = p.daysToExpiry >= 0 && p.daysToExpiry <= 30;
        const lapsed = p.daysToExpiry < 0;
        return (
          <div className="text-xs">
            <div className="tabular-nums text-muted-foreground">
              {formatJpDate(p.startDate)} 〜 {formatJpDate(p.endDate)}
            </div>
            <div
              className={
                lapsed
                  ? "font-medium text-destructive"
                  : soon
                    ? "font-medium text-warning"
                    : "text-muted-foreground"
              }
            >
              {lapsed
                ? `失効後 ${Math.abs(p.daysToExpiry)}日`
                : `満期まで ${p.daysToExpiry}日`}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "状態",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "agent",
      header: "担当募集人",
      cell: ({ row }) => {
        const a = agentById(row.original.agentId);
        return a ? (
          <PersonCell name={a.name} secondary={a.role} size="sm" />
        ) : null;
      },
    },
    {
      id: "chevron",
      header: "",
      cell: () => (
        <IconChevronRight
          className="h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
      ),
    },
  ];

  return (
    <div>
      {/* ヘッダー（画面ローカル）— 会社名は共有シェル側に出る */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">
            代理店ポータル ・ 募集管理者: 高橋 美咲
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            契約管理ダッシュボード
          </h1>
        </div>
        <Button>新規契約を登録</Button>
      </header>

      <Separator className="mb-6" />

      {/* サマリ指標（KPI ストリップ） */}
      <section aria-label="サマリ指標" className="mb-6">
        <StatGroup
          cols={{ base: 2, md: 3 }}
          items={[
            {
              label: "保有契約数",
              value: `${activeBook.length}件`,
              hint: `全${POLICIES.length}件中`,
            },
            {
              label: "保険料収入(当月)",
              value: formatCurrency(premiumMTD),
              change: formatPercent(premiumMTD / targetMTD - 1, { signed: true }),
              trend: premiumMTD >= targetMTD ? "up" : "down",
              hint: "対目標",
            },
            {
              label: "代理店手数料(年間見込)",
              value: formatCurrency(commissionAnnual),
              hint: "保有契約ベースの概算",
            },
            {
              label: "今月満期",
              value: `${expiringThisMonth.length}件`,
              hint: "30日以内",
            },
            {
              label: "更新率",
              value: formatPercent(renewalRate),
              trend: renewalRate >= 0.8 ? "up" : "flat",
              hint: "満期間近・手続中ベース",
            },
            {
              label: "失効リスク",
              value: `${lapseRisk.length}件`,
              change: lapseRisk.length > 0 ? "要対応" : "なし",
              trend: lapseRisk.length > 0 ? "down" : "flat",
              tone: lapseRisk.length > 0 ? "negative" : "neutral",
            },
          ]}
        />
      </section>

      {/* 更新管理（act-now サーフェス） */}
      <section aria-labelledby="renewal-heading" className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
              <CardTitle id="renewal-heading">更新管理 ・ 失効リスク</CardTitle>
            </div>
            <CardDescription>
              満期30日以内・更新案内未対応の契約。早めの更新案内で失効を防ぎます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expiringThisMonth.length > 0 ? (
              <ul className="flex flex-col divide-y divide-border/70">
                {expiringThisMonth
                  .slice()
                  .sort((a, b) => a.daysToExpiry - b.daysToExpiry)
                  .map((p) => {
                    const a = agentById(p.agentId);
                    const urgent = p.daysToExpiry <= 14 && p.renewalNotice !== "responded";
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(p)}
                          className="flex w-full flex-wrap items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
                        >
                          <div className="min-w-0 flex-1">
                            <PersonCell
                              name={p.holder}
                              secondary={`${PRODUCT_LABEL[p.product]} ・ ${p.policyNo}`}
                              tertiary={a ? `担当: ${a.name}` : undefined}
                              size="sm"
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={urgent ? "destructive" : "warning"}
                              icon={<IconAlertTriangle />}
                            >
                              満期まで {p.daysToExpiry}日
                            </Badge>
                            <RenewalNoticeBadge status={p.renewalNotice} />
                            <span className="tabular-nums text-sm font-medium text-foreground">
                              {formatCurrency(p.annualPremium)}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <EmptyState
                title="満期間近の契約はありません"
                description="30日以内に満期を迎える契約はありません。"
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* 保有契約一覧 */}
      <section aria-labelledby="book-heading" className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="book-heading" className="text-lg font-semibold text-foreground">
            保有契約一覧
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onValueChange={setQuery}
              placeholder="契約者・証券番号で検索"
              aria-label="契約を検索"
              className="w-56"
            />
            <Select
              aria-label="状態で絞り込み"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PolicyStatus | "all")}
            >
              {STATUS_FILTERS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select
              aria-label="商品種別で絞り込み"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value as ProductKind | "all")}
            >
              {PRODUCT_FILTERS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          filter={null}
          pageSize={10}
          onRowClick={(p) => setSelected(p)}
          renderCard={(p) => {
            const a = agentById(p.agentId);
            return (
              <button
                type="button"
                onClick={() => setSelected(p)}
                className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-2">
                  <PersonCell
                    name={p.holder}
                    secondary={p.policyNo}
                    size="sm"
                    avatarClassName="bg-info-subtle text-info-subtle-foreground"
                  />
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Tag variant="outline">{PRODUCT_LABEL[p.product]}</Tag>
                  <span className="tabular-nums text-sm font-medium">
                    {formatCurrency(p.annualPremium)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="tabular-nums">満期 {formatJpDate(p.endDate)}</span>
                  <span>{a ? `担当 ${a.name}` : ""}</span>
                </div>
              </button>
            );
          }}
        />
      </section>

      {/* 代理店業績 + 募集人↔担当契約 */}
      <section aria-labelledby="perf-heading" className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle id="perf-heading">代理店業績（当月）</CardTitle>
            <CardDescription>
              保険料収入 {formatCurrency(premiumMTD)} / 目標 {formatCurrency(targetMTD)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Meter
              label="当月目標達成率"
              value={premiumMTD}
              max={targetMTD}
              direction="fill-is-good"
              unit="円"
              formatValue={(v) => formatCurrency(v)}
            />
            <Separator />
            <div className="flex flex-col gap-4">
              {AGENTS.map((a) => (
                <div key={a.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <PersonCell name={a.name} secondary={a.role} size="sm" />
                    <span className="tabular-nums text-sm font-medium">
                      {formatCurrency(a.premiumMTD)}
                    </span>
                  </div>
                  <Meter
                    value={a.premiumMTD}
                    max={a.target}
                    direction="higher-is-better"
                    target={a.target}
                    size="sm"
                    label={`新規${a.newCount} / 継続${a.renewalCount}件`}
                    formatValue={(v) => formatCurrency(v)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>募集人 ↔ 担当契約</CardTitle>
            <CardDescription>
              満期間近・失効リスク契約と担当募集人の対応関係。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {[...renewable, ...POLICIES.filter((p) => p.status === "lapsed")]
                .slice(0, 6)
                .map((p) => {
                  const a = agentById(p.agentId);
                  if (!a) return null;
                  return (
                    <li key={p.id}>
                      <RelationshipRow
                        from={{ name: a.name, secondary: a.role, size: "sm" }}
                        to={{
                          name: p.holder,
                          secondary: PRODUCT_LABEL[p.product],
                          size: "sm",
                          avatarClassName: "bg-info-subtle text-info-subtle-foreground",
                        }}
                        relationshipLabel="担当"
                        trailing={<StatusBadge status={p.status} />}
                      />
                    </li>
                  );
                })}
            </ul>
          </CardContent>
        </Card>
      </section>

      <PolicyDetailDrawer policy={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
