"use client"

import * as React from "react"
import type { ColumnDef } from "@gunjo/ui"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  ApprovalSteps,
  Badge,
  Button,
  Card,
  CoSign,
  type CoSignValue,
  DataTable,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  MetadataList,
  PersonCell,
  Select,
  Separator,
  StatGroup,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Timeline,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  formatCurrency,
} from "@gunjo/ui"

import { PaymentDerivation } from "./PaymentDerivation"
import {
  type PaymentCase,
  type PaymentStatus,
  PAYMENT_CASES,
  STATUS_ORDER,
  STATUS_TONE,
  COVERAGE_TONE,
  officerId,
} from "./data"

const yen = (n: number) => formatCurrency(n)

function dueLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function daysUntil(iso: string): number {
  const today = new Date("2026-06-26T00:00:00")
  const d = new Date(iso + "T00:00:00")
  return Math.round((d.getTime() - today.getTime()) / 86_400_000)
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={STATUS_TONE[status]}>{status}</Badge>
}

/** 支払予定日セル：期日が近い / 超過を色で示す（テキストでも明示）。 */
function DueCell({ iso }: { iso: string }) {
  const n = daysUntil(iso)
  const overdue = n < 0
  const soon = n >= 0 && n <= 2
  const tone = overdue
    ? "text-destructive font-semibold"
    : soon
      ? "text-warning font-semibold"
      : "text-foreground"
  const suffix = overdue ? `（${-n}日超過）` : n === 0 ? "（本日）" : `（あと${n}日）`
  return (
    <span className={"tabular-nums text-sm " + tone}>
      {dueLabel(iso)}
      <span className="ml-1 text-xs font-normal text-muted-foreground">{suffix}</span>
    </span>
  )
}

export function PaymentsScreen() {
  const [statusFilter, setStatusFilter] = React.useState<PaymentStatus | "all">("all")
  const [selected, setSelected] = React.useState<PaymentCase | null>(null)
  const [open, setOpen] = React.useState(false)
  const [coSign, setCoSign] = React.useState<Record<string, CoSignValue>>({})
  const [confirmCase, setConfirmCase] = React.useState<PaymentCase | null>(null)

  const rows = React.useMemo(
    () =>
      statusFilter === "all"
        ? PAYMENT_CASES
        : PAYMENT_CASES.filter((c) => c.status === statusFilter),
    [statusFilter]
  )

  // --- サマリー指標 ---
  const metrics = React.useMemo(() => {
    const todayDue = PAYMENT_CASES.filter((c) => daysUntil(c.dueDate) === 0).length
    const monthTotal = PAYMENT_CASES.filter(
      (c) => c.status === "支払済"
    ).reduce((s, c) => s + c.payAmount, 0)
    const awaiting = PAYMENT_CASES.filter((c) => c.status === "支払承認待ち").length
    const arranging = PAYMENT_CASES.filter((c) => c.status === "振込手配中").length
    const highValue = PAYMENT_CASES.filter(
      (c) => c.highValue && c.status !== "支払済"
    ).length
    const pendingTotal = PAYMENT_CASES.filter(
      (c) => c.status !== "支払済" && c.status !== "保留"
    ).reduce((s, c) => s + c.payAmount, 0)
    return { todayDue, monthTotal, awaiting, arranging, highValue, pendingTotal }
  }, [])

  function openCase(c: PaymentCase) {
    setSelected(c)
    setOpen(true)
  }

  const columns: ColumnDef<PaymentCase>[] = [
    {
      accessorKey: "policyNo",
      header: "証券番号 / 契約者",
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="min-w-0">
            <div className="font-mono text-xs text-muted-foreground">{c.policyNo}</div>
            <div className="truncate text-sm font-medium text-foreground">
              {c.policyholder}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "payeeLabel",
      header: "支払先",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.original.payeeLabel}</span>
      ),
    },
    {
      id: "coverages",
      header: "補償",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.coverages.map((cov) => (
            <Badge key={cov} variant={COVERAGE_TONE[cov]}>
              {cov}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "payAmount",
      header: "今回支払額",
      cell: ({ row }) => (
        <div className="text-right">
          <span className="tabular-nums text-sm font-semibold text-foreground">
            {yen(row.original.payAmount)}
          </span>
          {row.original.highValue ? (
            <Badge variant="warning" className="ml-2">
              高額・2名承認
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "支払予定日",
      cell: ({ row }) => <DueCell iso={row.original.dueDate} />,
    },
    {
      accessorKey: "status",
      header: "状態",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "assignee",
      header: "担当",
      cell: ({ row }) => (
        <PersonCell
          size="sm"
          name={row.original.assignee}
          secondary={row.original.assigneeRole}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* サマリー指標 */}
      <StatGroup
        cols={{ base: 2, md: 3, lg: 6 }}
        items={[
          { label: "本日の支払予定", value: `${metrics.todayDue} 件` },
          {
            label: "承認待ち",
            value: `${metrics.awaiting} 件`,
            hint: metrics.awaiting > 0 ? "要対応" : undefined,
            tone: metrics.awaiting > 0 ? "negative" : "neutral",
          },
          { label: "振込手配中", value: `${metrics.arranging} 件` },
          {
            label: "高額案件",
            value: `${metrics.highValue} 件`,
            hint: "2名承認対象",
            tone: metrics.highValue > 0 ? "negative" : "neutral",
          },
          { label: "未払・支払予定額", value: yen(metrics.pendingTotal) },
          { label: "今月支払総額", value: yen(metrics.monthTotal) },
        ]}
      />

      {/* フィルタ */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xs">
            <Select
              label="状態で絞り込み"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as PaymentStatus | "all")
              }
            >
              <option value="all">すべて（{PAYMENT_CASES.length} 件）</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {s}（{PAYMENT_CASES.filter((c) => c.status === s).length} 件）
                </option>
              ))}
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            行を選択すると支払明細・承認・振込手配を確認できます。
          </p>
        </div>
      </Card>

      {/* 支払一覧 */}
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        onRowClick={openCase}
        filter={{ columnId: "policyNo", placeholder: "証券番号・契約者で検索…" }}
        labels={{
          filterPlaceholder: "証券番号・契約者で検索…",
          noResults: "該当する支払案件はありません。",
          rowsPerPage: "表示件数",
        }}
        renderCard={(c) => (
          <button
            type="button"
            onClick={() => openCase(c)}
            className="block w-full rounded-lg border border-border bg-card p-4 text-left focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-xs text-muted-foreground">
                  {c.policyNo}
                </div>
                <div className="truncate text-sm font-medium text-foreground">
                  {c.policyholder}
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {c.coverages.map((cov) => (
                <Badge key={cov} variant={COVERAGE_TONE[cov]}>
                  {cov}
                </Badge>
              ))}
              {c.highValue ? <Badge variant="warning">高額・2名承認</Badge> : null}
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <span className="text-lg font-bold tabular-nums text-foreground">
                {yen(c.payAmount)}
              </span>
              <DueCell iso={c.dueDate} />
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              支払先：{c.payeeLabel}
            </p>
          </button>
        )}
      />

      {/* 支払 detail ドロワー */}
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent side="right" className="w-full sm:w-[34rem] sm:max-w-[calc(100%-2rem)]">
          {selected ? (
            <PaymentDetail
              paymentCase={selected}
              coSign={coSign[selected.id]}
              onCoSign={(v) =>
                setCoSign((prev) => ({ ...prev, [selected.id]: v }))
              }
              onArrange={() => setConfirmCase(selected)}
            />
          ) : null}
        </DrawerContent>
      </Drawer>

      {/* 振込手配の確定（破壊的・要確認） */}
      <AlertDialog
        open={confirmCase !== null}
        onOpenChange={(o) => {
          if (!o) setConfirmCase(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>振込手配を確定しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmCase
                ? `${confirmCase.policyholder} 様（${confirmCase.policyNo}）への支払 ${yen(
                    confirmCase.payAmount
                  )} を振込手配します。確定後、支払明細は確定ロックされます。`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => setConfirmCase(null)}>
              振込手配を確定する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PaymentDetail({
  paymentCase: c,
  coSign,
  onCoSign,
  onArrange,
}: {
  paymentCase: PaymentCase
  coSign?: CoSignValue
  onCoSign: (v: CoSignValue) => void
  onArrange: () => void
}) {
  const needsCoSign = c.highValue
  const canArrange =
    c.status === "承認済" || (c.status === "支払承認待ち" && (!needsCoSign || !!coSign))

  return (
    <div className="flex h-full flex-col">
      <DrawerHeader className="border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <DrawerTitle className="truncate">
              {c.policyholder} 様 — 支払明細
            </DrawerTitle>
            <DrawerDescription className="font-mono text-xs">
              {c.policyNo} ／ 受付 {c.claimNo}
            </DrawerDescription>
          </div>
          <StatusBadge status={c.status} />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">支払総額</span>
          <span className="text-xl font-bold tabular-nums text-foreground">
            {yen(c.payAmount)}
          </span>
        </div>
      </DrawerHeader>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="derivation" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="derivation" className="flex-1">
              支払明細
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex-1">
              事故概要
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex-1">
              承認・振込
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              支払履歴
            </TabsTrigger>
          </TabsList>

          <TabsContent value="derivation" className="mt-4">
            <PaymentDerivation paymentCase={c} />
          </TabsContent>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <MetadataList
              items={[
                { label: "事故日", value: c.accident.date },
                { label: "事故場所", value: c.accident.place },
                { label: "契約者過失割合", value: `${c.accident.faultPercent}%` },
                { label: "補償種別", value: c.coverages.join("・") },
                { label: "支払予定日", value: c.dueDate },
              ]}
            />
            <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed text-foreground">
              {c.accident.summary}
            </div>
            <Separator />
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                支払先
              </p>
              <div className="space-y-2">
                {c.derivations.map((d) => (
                  <div
                    key={d.coverage}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2"
                  >
                    <PersonCell
                      size="sm"
                      name={d.payee.name}
                      secondary={d.payee.bank}
                      trailing={<Badge variant={COVERAGE_TONE[d.coverage]}>{d.payee.kind}</Badge>}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approval" className="mt-4 space-y-4">
            <ApprovalSteps steps={c.approvals} />

            {needsCoSign ? (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  高額案件 — 2名承認（ダブルチェック）
                </p>
                <CoSign
                  primaryId={officerId}
                  value={coSign}
                  requireReason={false}
                  attestations={[
                    { id: "amount", label: "支払額と控除（過失相殺・免責・既払金）を確認した" },
                    { id: "payee", label: "支払先口座・振込予定日を確認した" },
                  ]}
                  onSign={onCoSign}
                  signerLabel="承認者ID（2人目・課長以上）"
                />
              </div>
            ) : null}

            <Separator />

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                disabled={!canArrange}
                onClick={onArrange}
              >
                振込手配を確定する
              </Button>
              {!canArrange ? (
                <p className="text-xs text-muted-foreground">
                  {c.status === "保留"
                    ? "保留中（過失協議中）のため手配できません。"
                    : needsCoSign && !coSign
                      ? "高額案件です。2名目の承認後に手配できます。"
                      : "承認後に手配できます。"}
                </p>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Timeline>
              {c.history.map((h, i) => (
                <TimelineItem key={i} variant={i === c.history.length - 1 ? "active" : "muted"}>
                  <TimelineTime>{h.date}</TimelineTime>
                  <TimelineTitle>{h.label}</TimelineTitle>
                  <TimelineDescription>
                    {h.amount > 0 ? `${yen(h.amount)} ／ ` : ""}
                    担当：{h.by}
                  </TimelineDescription>
                </TimelineItem>
              ))}
            </Timeline>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t border-border p-4">
        <DrawerClose asChild>
          <Button variant="outline" className="w-full">
            閉じる
          </Button>
        </DrawerClose>
      </div>
    </div>
  )
}
