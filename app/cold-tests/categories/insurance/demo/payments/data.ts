// 自動車保険 保険金支払・精算管理 — ダミーデータ（架空）
// 群青損害保険株式会社 / 損害サービス部 自動車保険金支払課

export const insurerName = "群青損害保険株式会社"
export const deptName = "損害サービス部 自動車保険金支払課"
export const branchName = "東京中央損害サービスセンター"
export const officerName = "支払担当：宮本 さやか"
export const officerId = "miyamoto.s"
export const todayLabel = "2026年6月26日（金）"

/** 補償種別 */
export type Coverage = "対人" | "対物" | "車両"

/** 支払状態 */
export type PaymentStatus =
  | "査定確定"
  | "支払承認待ち"
  | "承認済"
  | "振込手配中"
  | "支払済"
  | "保留"

export const STATUS_ORDER: PaymentStatus[] = [
  "査定確定",
  "支払承認待ち",
  "承認済",
  "振込手配中",
  "支払済",
  "保留",
]

/** 支払先区分 */
export type PayeeKind = "契約者" | "修理工場" | "被害者(対物)" | "被害者(対人)"

/** 内訳の一行（認定損害額の構成・控除など） */
export interface DerivationLine {
  /** 表示ラベル（例: 修理費 / 過失相殺 / 免責金額） */
  label: string
  /** 円。控除はマイナス（過失相殺・免責・既払金）。 */
  amount: number
  /** 補足（例: 過失割合 20%、内払 2回） */
  note?: string
  /** 行種別：加算項目 / 控除項目 */
  kind: "addition" | "deduction"
}

/** 補償ごとの支払導出（認定損害額 − 過失相殺 − 免責 − 既払金 = 今回支払額） */
export interface CoverageDerivation {
  coverage: Coverage
  /** 認定損害額の内訳（修理費・全損時価・レッカー・代車 など） */
  damages: DerivationLine[]
  /** 控除（過失相殺・免責金額・既払金/内払） */
  deductions: DerivationLine[]
  /** 支払先 */
  payee: { kind: PayeeKind; name: string; bank: string }
}

/** 支払履歴（内払を含む） */
export interface PaymentHistoryItem {
  date: string
  label: string
  amount: number
  by: string
}

/** 承認ステップ */
export interface ApprovalRecord {
  label: string
  state: "pending" | "current" | "approved" | "rejected" | "skipped"
  actor?: string
  timestamp?: string
  comment?: string
}

export interface PaymentCase {
  id: string
  /** 証券番号 */
  policyNo: string
  /** 事故受付番号 */
  claimNo: string
  /** 契約者 */
  policyholder: string
  /** 支払先（一覧の代表表示） */
  payeeLabel: string
  /** 主たる補償種別（一覧の代表表示） */
  coverages: Coverage[]
  status: PaymentStatus
  /** 今回支払額（全補償合計） */
  payAmount: number
  /** 支払予定日 ISO */
  dueDate: string
  /** 担当者表示名 */
  assignee: string
  assigneeRole: string
  /** 高額フラグ（2名承認対象） */
  highValue: boolean
  /** 事故概要 */
  accident: {
    date: string
    place: string
    summary: string
    /** 契約者過失割合（%） */
    faultPercent: number
  }
  derivations: CoverageDerivation[]
  approvals: ApprovalRecord[]
  history: PaymentHistoryItem[]
}

/** 補償の今回支払額 = 認定額合計 − 控除合計 */
export function coverageNet(d: CoverageDerivation): number {
  const dmg = d.damages.reduce((s, l) => s + l.amount, 0)
  const ded = d.deductions.reduce((s, l) => s + l.amount, 0) // amounts are negative
  return dmg + ded
}

/** 案件の支払総額 = 各補償の今回支払額の合計 */
export function caseTotal(c: PaymentCase): number {
  return c.derivations.reduce((s, d) => s + coverageNet(d), 0)
}

export const STATUS_TONE: Record<
  PaymentStatus,
  "default" | "secondary" | "info" | "success" | "warning" | "destructive" | "outline"
> = {
  査定確定: "secondary",
  支払承認待ち: "warning",
  承認済: "info",
  振込手配中: "info",
  支払済: "success",
  保留: "destructive",
}

export const COVERAGE_TONE: Record<Coverage, "info" | "warning" | "secondary"> = {
  対人: "warning",
  対物: "info",
  車両: "secondary",
}

export const PAYMENT_CASES: PaymentCase[] = [
  {
    id: "PMT-2026-04821",
    policyNo: "GAP-018-552-7741",
    claimNo: "26-A-118842",
    policyholder: "髙橋 健一",
    payeeLabel: "オートサービス品川（修理工場）",
    coverages: ["車両", "対物"],
    status: "支払承認待ち",
    payAmount: 0, // 計算で上書き
    dueDate: "2026-06-30",
    assignee: "宮本 さやか",
    assigneeRole: "支払担当",
    highValue: false,
    accident: {
      date: "2026-05-18",
      place: "東京都品川区 国道15号 交差点",
      summary:
        "信号待ち停車中に後続車へ追突され、被保険車両（トヨタ ハリアー）後部および相手車両前部を損傷。",
      faultPercent: 20,
    },
    derivations: [
      {
        coverage: "車両",
        damages: [
          { label: "修理費（リアバンパー・バックドア板金塗装）", amount: 412_000, kind: "addition" },
          { label: "レッカー費用", amount: 28_000, kind: "addition" },
          { label: "代車費用（5日 × 5,500円）", amount: 27_500, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: -93_500, note: "過失割合 20%", kind: "deduction" },
          { label: "免責金額（車両：1回目0円）", amount: 0, note: "0円免責特約", kind: "deduction" },
          { label: "既払金（内払）", amount: 0, kind: "deduction" },
        ],
        payee: {
          kind: "修理工場",
          name: "オートサービス品川株式会社",
          bank: "みずほ銀行 品川支店 普通 1882043",
        },
      },
      {
        coverage: "対物",
        damages: [
          { label: "相手車両 修理費", amount: 186_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: -37_200, note: "当方過失 20%", kind: "deduction" },
          { label: "免責金額", amount: 0, kind: "deduction" },
          { label: "既払金（内払）", amount: 0, kind: "deduction" },
        ],
        payee: {
          kind: "被害者(対物)",
          name: "佐久間 良子",
          bank: "三井住友銀行 大井町支店 普通 0775521",
        },
      },
    ],
    approvals: [
      { label: "支払額確定（査定）", state: "approved", actor: "査定担当：青木 拓真", timestamp: "2026/06/24 14:20" },
      { label: "一次承認（係長）", state: "current", actor: "係長：森田 直樹" },
      { label: "振込手配", state: "pending" },
      { label: "支払完了", state: "pending" },
    ],
    history: [
      { date: "2026/06/24", label: "査定確定・支払額算定", amount: 0, by: "青木 拓真" },
    ],
  },
  {
    id: "PMT-2026-04795",
    policyNo: "GAP-018-440-1190",
    claimNo: "26-A-117560",
    policyholder: "渡辺 美咲",
    payeeLabel: "渡辺 美咲（契約者）",
    coverages: ["車両"],
    status: "査定確定",
    payAmount: 0,
    dueDate: "2026-07-02",
    assignee: "宮本 さやか",
    assigneeRole: "支払担当",
    highValue: true,
    accident: {
      date: "2026-05-09",
      place: "神奈川県横浜市 首都高速湾岸線",
      summary:
        "単独事故により被保険車両（レクサス RX）が中央分離帯に衝突し全損。修理見積が車両時価額を上回り全損認定。",
      faultPercent: 100,
    },
    derivations: [
      {
        coverage: "車両",
        damages: [
          { label: "全損時価額（車両保険金額の範囲内）", amount: 3_180_000, kind: "addition" },
          { label: "全損時 臨時費用保険金", amount: 150_000, kind: "addition" },
          { label: "レッカー費用", amount: 46_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: 0, note: "単独事故・車両保険のため適用なし", kind: "deduction" },
          { label: "免責金額（車両：1回目）", amount: -100_000, note: "10万円免責", kind: "deduction" },
          { label: "既払金（内払 1回）", amount: -300_000, note: "2026/06/05 内払", kind: "deduction" },
        ],
        payee: {
          kind: "契約者",
          name: "渡辺 美咲",
          bank: "三菱UFJ銀行 横浜駅前支店 普通 2204417",
        },
      },
    ],
    approvals: [
      { label: "支払額確定（査定）", state: "approved", actor: "査定担当：青木 拓真", timestamp: "2026/06/26 10:05" },
      { label: "一次承認（係長）", state: "pending" },
      { label: "二次承認（課長・高額）", state: "pending" },
      { label: "振込手配", state: "pending" },
      { label: "支払完了", state: "pending" },
    ],
    history: [
      { date: "2026/06/05", label: "内払（生活立替分）", amount: 300_000, by: "宮本 さやか" },
      { date: "2026/06/26", label: "全損認定・支払額算定", amount: 0, by: "青木 拓真" },
    ],
  },
  {
    id: "PMT-2026-04760",
    policyNo: "GAP-018-301-8842",
    claimNo: "26-A-116021",
    policyholder: "中村 大輔",
    payeeLabel: "市川 総合病院（対人・治療費）",
    coverages: ["対人"],
    status: "承認済",
    payAmount: 0,
    dueDate: "2026-06-29",
    assignee: "宮本 さやか",
    assigneeRole: "支払担当",
    highValue: false,
    accident: {
      date: "2026-04-21",
      place: "千葉県市川市 県道6号",
      summary:
        "右折時に直進してきた自転車と接触し、相手方が負傷（全治3週間）。対人賠償により治療費・休業損害・慰謝料を支払う。",
      faultPercent: 80,
    },
    derivations: [
      {
        coverage: "対人",
        damages: [
          { label: "治療費（市川総合病院）", amount: 248_000, kind: "addition" },
          { label: "休業損害（12日）", amount: 156_000, kind: "addition" },
          { label: "入通院慰謝料", amount: 290_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: -138_800, note: "被害者過失 20%", kind: "deduction" },
          { label: "免責金額", amount: 0, note: "対人賠償は免責なし", kind: "deduction" },
          { label: "既払金（仮渡金）", amount: -100_000, note: "2026/05/12 仮渡金", kind: "deduction" },
        ],
        payee: {
          kind: "被害者(対人)",
          name: "市川総合病院 / 久保田 修",
          bank: "千葉銀行 市川支店 普通 3390215",
        },
      },
    ],
    approvals: [
      { label: "支払額確定（査定）", state: "approved", actor: "査定担当：林 真由", timestamp: "2026/06/22 16:40" },
      { label: "一次承認（係長）", state: "approved", actor: "係長：森田 直樹", timestamp: "2026/06/25 09:12" },
      { label: "振込手配", state: "current" },
      { label: "支払完了", state: "pending" },
    ],
    history: [
      { date: "2026/05/12", label: "仮渡金", amount: 100_000, by: "林 真由" },
      { date: "2026/06/22", label: "支払額算定", amount: 0, by: "林 真由" },
      { date: "2026/06/25", label: "一次承認", amount: 0, by: "森田 直樹" },
    ],
  },
  {
    id: "PMT-2026-04733",
    policyNo: "GAP-018-220-4471",
    claimNo: "26-A-115004",
    policyholder: "小林 由美子",
    payeeLabel: "カーリペア八王子（修理工場）",
    coverages: ["対物", "車両"],
    status: "振込手配中",
    payAmount: 0,
    dueDate: "2026-06-28",
    assignee: "宮本 さやか",
    assigneeRole: "支払担当",
    highValue: false,
    accident: {
      date: "2026-05-30",
      place: "東京都八王子市 駐車場内",
      summary:
        "駐車場でのバック時に隣接車両および施設フェンスへ接触。相手車両（対物）と被保険車両（車両保険）を損傷。",
      faultPercent: 100,
    },
    derivations: [
      {
        coverage: "対物",
        damages: [
          { label: "相手車両 修理費", amount: 142_000, kind: "addition" },
          { label: "フェンス修繕費（施設管理者）", amount: 38_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: 0, note: "当方過失 100%", kind: "deduction" },
          { label: "免責金額", amount: 0, kind: "deduction" },
          { label: "既払金（内払）", amount: 0, kind: "deduction" },
        ],
        payee: {
          kind: "被害者(対物)",
          name: "相手方 2先（按分）",
          bank: "（各支払先口座へ按分振込）",
        },
      },
      {
        coverage: "車両",
        damages: [
          { label: "修理費（左クォーター板金）", amount: 168_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: 0, note: "車両保険のため適用なし", kind: "deduction" },
          { label: "免責金額（車両：1回目）", amount: -50_000, note: "5万円免責", kind: "deduction" },
          { label: "既払金（内払）", amount: 0, kind: "deduction" },
        ],
        payee: {
          kind: "修理工場",
          name: "カーリペア八王子",
          bank: "きらぼし銀行 八王子支店 普通 0042118",
        },
      },
    ],
    approvals: [
      { label: "支払額確定（査定）", state: "approved", actor: "査定担当：青木 拓真", timestamp: "2026/06/20 11:30" },
      { label: "一次承認（係長）", state: "approved", actor: "係長：森田 直樹", timestamp: "2026/06/23 13:05" },
      { label: "振込手配", state: "current", actor: "支払担当：宮本 さやか" },
      { label: "支払完了", state: "pending" },
    ],
    history: [
      { date: "2026/06/20", label: "支払額算定", amount: 0, by: "青木 拓真" },
      { date: "2026/06/23", label: "一次承認", amount: 0, by: "森田 直樹" },
    ],
  },
  {
    id: "PMT-2026-04688",
    policyNo: "GAP-018-117-9930",
    claimNo: "26-A-113770",
    policyholder: "斎藤 浩二",
    payeeLabel: "斎藤 浩二（契約者）",
    coverages: ["車両"],
    status: "支払済",
    payAmount: 0,
    dueDate: "2026-06-20",
    assignee: "宮本 さやか",
    assigneeRole: "支払担当",
    highValue: false,
    accident: {
      date: "2026-04-02",
      place: "埼玉県さいたま市 市道",
      summary: "飛び石によりフロントガラスが破損。車両保険（ガラス単独事故・等級据置）で修理費を支払い。",
      faultPercent: 0,
    },
    derivations: [
      {
        coverage: "車両",
        damages: [
          { label: "フロントガラス交換費用", amount: 88_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺", amount: 0, kind: "deduction" },
          { label: "免責金額", amount: 0, note: "ガラス特約・免責なし", kind: "deduction" },
          { label: "既払金（内払）", amount: 0, kind: "deduction" },
        ],
        payee: {
          kind: "契約者",
          name: "斎藤 浩二",
          bank: "埼玉りそな銀行 浦和支店 普通 1102883",
        },
      },
    ],
    approvals: [
      { label: "支払額確定（査定）", state: "approved", actor: "査定担当：林 真由", timestamp: "2026/06/12 10:00" },
      { label: "一次承認（係長）", state: "approved", actor: "係長：森田 直樹", timestamp: "2026/06/16 09:40" },
      { label: "振込手配", state: "approved", actor: "支払担当：宮本 さやか", timestamp: "2026/06/18 15:20" },
      { label: "支払完了", state: "approved", actor: "システム", timestamp: "2026/06/20 09:00" },
    ],
    history: [
      { date: "2026/06/12", label: "支払額算定", amount: 0, by: "林 真由" },
      { date: "2026/06/18", label: "振込手配", amount: 0, by: "宮本 さやか" },
      { date: "2026/06/20", label: "振込完了", amount: 88_000, by: "システム" },
    ],
  },
  {
    id: "PMT-2026-04650",
    policyNo: "GAP-018-090-2218",
    claimNo: "26-A-112388",
    policyholder: "藤田 翔太",
    payeeLabel: "（支払先確認中）",
    coverages: ["対物", "対人"],
    status: "保留",
    payAmount: 0,
    dueDate: "2026-07-05",
    assignee: "宮本 さやか",
    assigneeRole: "支払担当",
    highValue: true,
    accident: {
      date: "2026-05-25",
      place: "東京都世田谷区 環状8号",
      summary:
        "進路変更時に併走車と接触、相手方搭乗者が負傷。過失割合について相手方と協議中のため支払額未確定。求償可能性あり。",
      faultPercent: 60,
    },
    derivations: [
      {
        coverage: "対人",
        damages: [
          { label: "治療費（暫定）", amount: 320_000, kind: "addition" },
          { label: "慰謝料（暫定）", amount: 210_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺（協議中・暫定）", amount: -212_000, note: "暫定過失 40%（協議中）", kind: "deduction" },
          { label: "免責金額", amount: 0, kind: "deduction" },
          { label: "既払金（内払）", amount: 0, kind: "deduction" },
        ],
        payee: {
          kind: "被害者(対人)",
          name: "（確認中）",
          bank: "（確認中）",
        },
      },
      {
        coverage: "対物",
        damages: [
          { label: "相手車両 修理費（暫定）", amount: 240_000, kind: "addition" },
        ],
        deductions: [
          { label: "過失相殺（協議中・暫定）", amount: -96_000, note: "暫定過失 40%（協議中）", kind: "deduction" },
          { label: "免責金額", amount: 0, kind: "deduction" },
          { label: "求償見込（相手保険会社）", amount: 0, note: "求償手続き予定", kind: "deduction" },
        ],
        payee: {
          kind: "被害者(対物)",
          name: "（確認中）",
          bank: "（確認中）",
        },
      },
    ],
    approvals: [
      { label: "支払額確定（査定）", state: "rejected", actor: "査定担当：青木 拓真", timestamp: "2026/06/26 17:10", comment: "過失割合が相手方と協議中。確定後に再算定。" },
      { label: "一次承認（係長）", state: "skipped" },
      { label: "二次承認（課長・高額）", state: "skipped" },
      { label: "振込手配", state: "pending" },
      { label: "支払完了", state: "pending" },
    ],
    history: [
      { date: "2026/06/26", label: "保留（過失協議中）", amount: 0, by: "青木 拓真" },
    ],
  },
]

// payAmount を導出値で確定
for (const c of PAYMENT_CASES) {
  c.payAmount = caseTotal(c)
}
