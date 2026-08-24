"use client"

// 支払明細（最重要）— 認定損害額 − 過失相殺 − 免責 − 既払金 = 今回支払額
// 内訳の意味論（見出し・小計・符号付き控除・強調合計・計算式）は
// AmountBreakdown に載せる。補償バッジ・支払先・補償横断の総計は画面グルー。

import { AmountBreakdown, Badge, formatCurrency, type AmountLine } from "@gunjo/ui"

import {
  type CoverageDerivation,
  type DerivationLine,
  type PaymentCase,
  COVERAGE_TONE,
  caseTotal,
  coverageNet,
} from "./data"

const yen = (n: number) => formatCurrency(n)

// 控除はデータ上マイナス値。0 の控除（適用なし）は減算表示にしない。
function toAmountLine(line: DerivationLine): AmountLine {
  const isDeduction = line.kind === "deduction" && line.amount !== 0
  return {
    label: line.label,
    amount: line.amount,
    kind: isDeduction ? "subtract" : "add",
    note: line.note ? `（${line.note}）` : undefined,
  }
}

function CoverageLedger({ d }: { d: CoverageDerivation }) {
  const dmgTotal = d.damages.reduce((s, l) => s + l.amount, 0)
  const net = coverageNet(d)

  const lines: AmountLine[] = [
    { type: "heading", label: "認定損害額" },
    ...d.damages.map(toAmountLine),
    { type: "subtotal", label: "認定損害額 小計", amount: dmgTotal },
    { type: "heading", label: "控除（過失相殺・免責・既払金）" },
    ...d.deductions.map(toAmountLine),
  ]

  return (
    <section
      className="rounded-lg border border-border bg-card p-4"
      aria-label={`${d.coverage} 支払明細`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={COVERAGE_TONE[d.coverage]}>{d.coverage}</Badge>
          <span className="text-sm font-medium text-foreground">補償の支払導出</span>
        </div>
        <span className="text-xs text-muted-foreground">支払先：{d.payee.kind}</span>
      </div>

      <AmountBreakdown
        lines={lines}
        total={{ label: `${d.coverage}：今回支払額`, amount: net }}
      />

      <p className="mt-2 text-xs text-muted-foreground">
        支払先：{d.payee.name} ／ {d.payee.bank}
      </p>
    </section>
  )
}

export function PaymentDerivation({ paymentCase }: { paymentCase: PaymentCase }) {
  const total = caseTotal(paymentCase)

  return (
    <div className="space-y-4">
      {/* 計算式の明示 */}
      <div
        className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
        aria-label="支払額の計算式"
      >
        <span className="font-medium text-foreground">今回支払額</span>
        {" ＝ 認定損害額 − 過失相殺 − 免責金額 − 既払金（内払）"}
      </div>

      {paymentCase.derivations.map((d) => (
        <CoverageLedger key={d.coverage} d={d} />
      ))}

      {/* 補償横断の支払総額（強調） */}
      <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-foreground/80 bg-card px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">支払総額</p>
          <p className="text-xs text-muted-foreground">
            {paymentCase.derivations.length} 補償の今回支払額合計
          </p>
        </div>
        <span className="text-2xl font-bold tabular-nums text-foreground">
          {yen(total)}
        </span>
      </div>
    </div>
  )
}
