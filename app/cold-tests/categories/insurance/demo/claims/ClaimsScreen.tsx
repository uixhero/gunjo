"use client"

import * as React from "react"
import type { ColumnDef } from "@gunjo/ui"
import {
  IconAlertTriangle,
  IconClockExclamation,
  IconShieldCheck,
  IconFileText,
  IconCamera,
  IconCertificate,
} from "@tabler/icons-react"
import {
  AmountBreakdown,
  StatGroup,
  DataTable,
  PersonCell,
  Badge,
  Banner,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
  MetadataList,
  DistributionBar,
  ApprovalWorkflow,
  CoSign,
  CoSignBadge,
  SignedRecord,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Select,
  CheckList,
  formatCurrency,
  type WorkflowValue,
  type CoSignValue,
  type SignedRecordValue,
} from "@gunjo/ui"
import {
  claims as seedClaims,
  STAGES,
  HIGH_VALUE_THRESHOLD,
  computeAssessed,
  adjusterId,
  adjusterName,
  kpis,
  type Claim,
  type ClaimStatus,
} from "./data"

// ── ステータス → Badge variant（色だけに依存させず icon + ラベルで意味を担保） ──
const STATUS_VARIANT: Record<ClaimStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  受付: "secondary",
  損害調査中: "info",
  査定中: "info",
  承認待ち: "warning",
  承認済: "success",
  支払済: "success",
  否認: "destructive",
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
}

const yen = (n: number) => formatCurrency(n)

// ── KPI ストリップ（StatGroup） ──
function KpiStrip() {
  return (
    <StatGroup
      cols={{ base: 2, md: 4 }}
      items={[
        { label: "本日の新規請求", value: `${kpis.newToday}件` },
        { label: "査定中", value: `${kpis.inProgress}件` },
        {
          label: "承認待ち",
          value: `${kpis.awaitingApproval}件`,
          hint: kpis.awaitingApproval > 0 ? "要対応" : undefined,
        },
        { label: "今月の支払保険金", value: yen(kpis.paidThisMonth) },
        { label: "平均査定日数", value: `${kpis.avgDays}日` },
        {
          label: "SLA超過",
          value: `${kpis.slaBreached}件`,
          change: kpis.slaBreached > 0 ? "期限超過" : undefined,
          trend: "up",
          tone: "negative",
        },
        {
          label: "要注意フラグ",
          value: `${kpis.flagged}件`,
          change: kpis.flagged > 0 ? "不正調査" : undefined,
          trend: "up",
          tone: "negative",
        },
      ]}
    />
  )
}

// ── 査定明細：請求額 − 過失相殺 − 免責 = 査定額 の内訳 ──
function AssessmentBreakdown({ claim }: { claim: Claim }) {
  const { faultDeduction, deductible, assessed } = computeAssessed(
    claim.adjustment,
    claim.claimedAmount
  )
  const a = claim.adjustment

  const damageItems = [
    a.damageKind === "全損"
      ? { label: "車両時価額（全損）", value: yen(a.marketValue) }
      : { label: "修理費見積", value: yen(a.repairCost) },
    a.towing > 0 ? { label: "レッカー費用", value: yen(a.towing) } : null,
    a.rentalCar > 0 ? { label: "代車費用", value: yen(a.rentalCar) } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-2 text-sm font-semibold">損害内容</h4>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant={a.damageKind === "全損" ? "destructive" : "outline"}>
            {a.damageKind}
          </Badge>
          <span className="text-xs text-muted-foreground">
            過失割合 {a.faultRatio}% ／ 免責 {yen(a.deductible)}
          </span>
        </div>
        <MetadataList items={damageItems} variant="compact" />
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">補償ごとの認定額</h4>
        <DistributionBar
          showLegend
          totalLabel="認定額"
          formatValue={(v) => yen(v)}
          segments={a.coverages.map((c) => ({
            label: `${c.kind}（請求 ${yen(c.claimed)}）`,
            value: c.assessed,
          }))}
        />
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">査定額の算定</h4>
        <AmountBreakdown
          lines={[
            { label: "請求額", amount: claim.claimedAmount },
            {
              label: `過失相殺（${a.faultRatio}%）`,
              amount: faultDeduction,
              kind: faultDeduction > 0 ? "subtract" : "add",
            },
            {
              label: "免責金額",
              amount: deductible,
              kind: deductible > 0 ? "subtract" : "add",
            },
          ]}
          total={{ label: "査定額", amount: assessed }}
          formula="査定額 ＝ 請求額 − 過失相殺 − 免責金額"
        />
      </div>
    </div>
  )
}

const DOC_ICON: Record<string, React.ReactNode> = {
  交通事故証明書: <IconCertificate className="h-4 w-4" />,
  修理見積書: <IconFileText className="h-4 w-4" />,
  損傷写真: <IconCamera className="h-4 w-4" />,
}

// ── 請求 detail のドリルイン本体（Sheet 内） ──
function ClaimDetail({
  claim,
  workflow,
  onWorkflowChange,
  coSign,
  onCoSign,
  signed,
  onSignedChange,
}: {
  claim: Claim
  workflow: WorkflowValue
  onWorkflowChange: (v: WorkflowValue) => void
  coSign?: CoSignValue
  onCoSign: (v: CoSignValue) => void
  signed: SignedRecordValue
  onSignedChange: (v: SignedRecordValue) => void
}) {
  const isHighValue = claim.claimedAmount >= HIGH_VALUE_THRESHOLD
  const slaBreached = claim.elapsedDays > claim.slaDays
  const allDocsReceived = claim.documents
    .filter((d) => d.required)
    .every((d) => d.received)

  // 高額案件は CoSign（2名承認）が完了するまで「承認」段階へ進めない
  const canAdvance = isHighValue ? Boolean(coSign) : true

  return (
    <div className="space-y-5">
      {/* 不正・要注意フラグ */}
      {claim.fraudFlags.map((f, i) => (
        <Banner
          key={i}
          variant={f.level === "high" ? "destructive" : "warning"}
          icon={<IconAlertTriangle className="h-4 w-4" />}
        >
          <span className="font-medium">要注意（{f.label}）</span>：{f.detail}
        </Banner>
      ))}
      {slaBreached && claim.status !== "支払済" && claim.status !== "否認" && (
        <Banner variant="warning" icon={<IconClockExclamation className="h-4 w-4" />}>
          SLA超過：経過 {claim.elapsedDays}日（標準 {claim.slaDays}日）
        </Banner>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="assessment">査定明細</TabsTrigger>
          <TabsTrigger value="docs">必要書類</TabsTrigger>
          <TabsTrigger value="workflow">査定・承認</TabsTrigger>
        </TabsList>

        {/* ── 概要 + 契約照会 ── */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">事故概要</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{claim.summary}</p>
            </CardContent>
          </Card>

          <div>
            <h4 className="mb-2 text-sm font-semibold">事故・請求情報</h4>
            <MetadataList
              layout="horizontal"
              items={[
                { label: "証券番号", value: claim.policyNo },
                { label: "事故種別", value: claim.accidentType },
                { label: "事故日", value: claim.accidentDate },
                { label: "受付日", value: claim.receivedDate },
                { label: "車種", value: claim.vehicle },
                { label: "登録番号", value: claim.plate },
                { label: "請求額", value: yen(claim.claimedAmount) },
                {
                  label: "経過日数",
                  value: `${claim.elapsedDays}日 / SLA ${claim.slaDays}日`,
                },
              ]}
            />
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">契約照会</h4>
            <div className="rounded-lg border p-3">
              <PersonCell
                name={claim.policyholder}
                secondary={claim.policyholderKana}
                tertiary={`証券 ${claim.policyNo}`}
                trailing={<Badge variant="outline">{claim.policy.grade}等級</Badge>}
              />
              <Separator className="my-3" />
              <MetadataList
                variant="compact"
                items={[
                  { label: "ノンフリート等級", value: `${claim.policy.grade}等級` },
                  {
                    label: "事故有係数適用期間",
                    value: `${claim.policy.accidentCoeffYears}年`,
                  },
                  { label: "過去3年の請求回数", value: `${claim.policy.priorClaims}回` },
                  { label: "主な補償", value: claim.policy.coverages.join("・") },
                ]}
              />
            </div>
          </div>

          {claim.counterparty && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">事故相手</h4>
              <div className="rounded-lg border p-3">
                <PersonCell
                  name={claim.counterparty}
                  secondary={
                    claim.accidentType === "対人" ? "人身被害あり" : "物損のみ"
                  }
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── 査定明細 ── */}
        <TabsContent value="assessment" className="pt-4">
          <AssessmentBreakdown claim={claim} />
        </TabsContent>

        {/* ── 必要書類 ── */}
        <TabsContent value="docs" className="space-y-3 pt-4">
          <CheckList
            items={claim.documents.map((d, i) => ({
              id: `${claim.id}-doc-${i}`,
              label: (
                <span className="flex items-center gap-2">
                  {DOC_ICON[d.name] ?? <IconFileText className="h-4 w-4" />}
                  {d.name}
                  {d.required && (
                    <Badge variant="outline" className="ml-1">
                      必須
                    </Badge>
                  )}
                </span>
              ),
              description: d.received ? "受領済" : "未着",
              checked: d.received,
              disabled: true,
            }))}
          />
          {!allDocsReceived && (
            <Banner variant="warning" icon={<IconAlertTriangle className="h-4 w-4" />}>
              必須書類が未着です。承認段階へ進む前に揃える必要があります。
            </Banner>
          )}
        </TabsContent>

        {/* ── 査定ワークフロー + サインオフ + 2名承認 ── */}
        <TabsContent value="workflow" className="space-y-5 pt-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">査定ワークフロー</h4>
            <ApprovalWorkflow
              stages={STAGES.map((s) => ({ id: s.id, label: s.label }))}
              value={workflow}
              onChange={onWorkflowChange}
              actor={adjusterName}
              stateLabels={{
                pending: "未着手",
                current: "対応中",
                approved: "完了",
                rejected: "却下",
                skipped: "対象外",
              }}
              canAdvance={canAdvance && allDocsReceived}
              advanceHint={
                !allDocsReceived
                  ? "必須書類が未着です"
                  : isHighValue && !coSign
                    ? "高額案件のため2名承認（下部）が必要です"
                    : undefined
              }
            />
          </div>

          {/* 高額案件 → 2名承認（CoSign） */}
          {isHighValue && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-sm font-semibold">2名承認（高額案件）</h4>
                <CoSignBadge value={coSign} />
                <Badge variant="warning" icon={<IconShieldCheck className="h-3.5 w-3.5" />}>
                  請求額 {yen(claim.claimedAmount)}
                </Badge>
              </div>
              <CoSign
                primaryId={safeAdjusterId(adjusterId)}
                requireReason
                value={coSign}
                onSign={onCoSign}
                attestations={[
                  { id: "doc", label: "必要書類を確認した" },
                  { id: "amount", label: "査定額の算定根拠を確認した" },
                  { id: "fraud", label: "不正・要注意フラグを精査した" },
                ]}
              />
            </div>
          )}

          {/* 査定確定（サインオフ・確定後ロック） */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">査定確定（サインオフ）</h4>
            <SignedRecord
              value={signed}
              onChange={onSignedChange}
              signerId={adjusterName}
              canSign={allDocsReceived && (!isHighValue || Boolean(coSign))}
            >
              {({ readOnly }) => (
                <div className="space-y-2 text-sm">
                  <p className="font-medium">査定結果サマリー</p>
                  <MetadataList
                    variant="compact"
                    items={[
                      { label: "請求額", value: yen(claim.claimedAmount) },
                      {
                        label: "査定額",
                        value: yen(
                          computeAssessed(claim.adjustment, claim.claimedAmount).assessed
                        ),
                      },
                      { label: "担当査定者", value: adjusterName },
                      { label: "確定状態", value: readOnly ? "確定（ロック済）" : "下書き" },
                    ]}
                  />
                </div>
              )}
            </SignedRecord>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// CoSign の primaryId に渡す値（空ガード）
function safeAdjusterId(id: string) {
  return id || "UNKNOWN"
}

// ── 画面トップ：請求一覧 + ドリルイン Sheet ──
export function ClaimsScreen() {
  const [statusFilter, setStatusFilter] = React.useState<"all" | ClaimStatus>("all")
  const [selected, setSelected] = React.useState<Claim | null>(null)

  // ドリルインで進めた状態を id ごとに保持
  const [workflows, setWorkflows] = React.useState<Record<string, WorkflowValue>>(() =>
    Object.fromEntries(
      seedClaims.map((c) => [
        c.id,
        {
          currentStageId: c.currentStage,
          status: c.workflowStatus,
          records: Object.fromEntries(
            Object.entries(c.records).map(([k, v]) => [
              k,
              { actor: v.actor, at: v.at, comment: v.comment },
            ])
          ),
        } satisfies WorkflowValue,
      ])
    )
  )
  const [coSigns, setCoSigns] = React.useState<Record<string, CoSignValue>>({})
  const [signedRecords, setSignedRecords] = React.useState<Record<string, SignedRecordValue>>(
    () =>
      Object.fromEntries(
        seedClaims.map((c) => [
          c.id,
          {
            status: c.status === "支払済" || c.status === "承認済" ? "signed" : "draft",
            signedBy: c.records.承認?.actor,
            addenda: [],
          } satisfies SignedRecordValue,
        ])
      )
  )

  const filtered = React.useMemo(
    () =>
      statusFilter === "all"
        ? seedClaims
        : seedClaims.filter((c) => c.status === statusFilter),
    [statusFilter]
  )

  const columns = React.useMemo<ColumnDef<Claim>[]>(
    () => [
      {
        accessorKey: "id",
        header: "請求番号",
        cell: ({ row }) => {
          const c = row.original
          const slaBreached =
            c.elapsedDays > c.slaDays && c.status !== "支払済" && c.status !== "否認"
          return (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-medium tabular-nums">
                {c.id}
                {c.fraudFlags.length > 0 && (
                  <IconAlertTriangle
                    className="h-3.5 w-3.5 text-destructive"
                    aria-label="要注意フラグあり"
                  />
                )}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{c.policyNo}</div>
              {slaBreached && (
                <Badge
                  variant="warning"
                  className="mt-1"
                  icon={<IconClockExclamation className="h-3 w-3" />}
                >
                  SLA超過 {c.elapsedDays}日
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "policyholder",
        header: "契約者",
        cell: ({ row }) => {
          const c = row.original
          return (
            <PersonCell
              size="sm"
              name={c.policyholder}
              secondary={c.vehicle}
              tertiary={`事故日 ${c.accidentDate}`}
            />
          )
        },
      },
      {
        accessorKey: "accidentType",
        header: "事故種別",
        cell: ({ row }) => <Badge variant="outline">{row.original.accidentType}</Badge>,
      },
      {
        accessorKey: "claimedAmount",
        header: "請求額",
        cell: ({ row }) => {
          const c = row.original
          const high = c.claimedAmount >= HIGH_VALUE_THRESHOLD
          return (
            <div className="text-right tabular-nums">
              <div className="font-medium">{yen(c.claimedAmount)}</div>
              {high && (
                <Badge variant="info" className="mt-1">
                  高額
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "査定状況",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "assignee",
        header: "担当査定者",
        cell: ({ row }) => {
          const a = row.original.assignee
          return a === "未割当" ? (
            <Badge variant="secondary">未割当</Badge>
          ) : (
            <PersonCell size="sm" name={a} />
          )
        },
      },
    ],
    []
  )

  const active = selected
  const activeWorkflow = active ? workflows[active.id] : undefined

  return (
    <div className="space-y-6">
      <KpiStrip />

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">請求一覧</CardTitle>
          <div className="w-44">
            <Select
              aria-label="査定状況で絞り込み"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | ClaimStatus)}
            >
              <option value="all">すべての状況</option>
              <option value="受付">受付</option>
              <option value="損害調査中">損害調査中</option>
              <option value="査定中">査定中</option>
              <option value="承認待ち">承認待ち</option>
              <option value="承認済">承認済</option>
              <option value="支払済">支払済</option>
              <option value="否認">否認</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            filter={{ columnId: "policyholder", placeholder: "契約者名で検索…" }}
            pageSize={10}
            onRowClick={(row) => setSelected(row)}
            renderCard={(c) => {
              const slaBreached =
                c.elapsedDays > c.slaDays && c.status !== "支払済" && c.status !== "否認"
              return (
                <button
                  type="button"
                  onClick={() => setSelected(c)}
                  className="w-full space-y-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium tabular-nums">{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <PersonCell
                    size="sm"
                    name={c.policyholder}
                    secondary={c.vehicle}
                    tertiary={`${c.accidentType} ／ 事故日 ${c.accidentDate}`}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">請求額</span>
                    <span className="font-medium tabular-nums">{yen(c.claimedAmount)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.claimedAmount >= HIGH_VALUE_THRESHOLD && (
                      <Badge variant="info">高額</Badge>
                    )}
                    {slaBreached && (
                      <Badge
                        variant="warning"
                        icon={<IconClockExclamation className="h-3 w-3" />}
                      >
                        SLA超過 {c.elapsedDays}日
                      </Badge>
                    )}
                    {c.fraudFlags.length > 0 && (
                      <Badge
                        variant="destructive"
                        icon={<IconAlertTriangle className="h-3 w-3" />}
                      >
                        要注意
                      </Badge>
                    )}
                  </div>
                </button>
              )
            }}
            labels={{
              filterPlaceholder: "契約者名で検索…",
              noResults: "該当する請求はありません",
              previous: "前へ",
              next: "次へ",
              rowsPerPage: "表示件数",
              paginationSummary: (from, to, total) => `${total}件中 ${from}–${to}件`,
            }}
          />
        </CardContent>
      </Card>

      {/* 請求 detail ドリルイン */}
      <Sheet open={active !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          side="right"
          closeLabel="閉じる"
          className="w-full overflow-y-auto sm:max-w-xl"
        >
          {active && activeWorkflow && (
            <>
              <SheetHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <SheetTitle className="tabular-nums">{active.id}</SheetTitle>
                  <StatusBadge status={active.status} />
                </div>
                <SheetDescription>
                  {active.policyholder} ／ {active.vehicle} ／ {active.accidentType}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <ClaimDetail
                  claim={active}
                  workflow={activeWorkflow}
                  onWorkflowChange={(v) =>
                    setWorkflows((prev) => ({ ...prev, [active.id]: v }))
                  }
                  coSign={coSigns[active.id]}
                  onCoSign={(v) => setCoSigns((prev) => ({ ...prev, [active.id]: v }))}
                  signed={signedRecords[active.id]}
                  onSignedChange={(v) =>
                    setSignedRecords((prev) => ({ ...prev, [active.id]: v }))
                  }
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
