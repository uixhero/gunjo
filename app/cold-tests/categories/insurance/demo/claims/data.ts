// 自動車保険 保険金請求・査定管理 — ドメインモデルとサンプルデータ
// 損害サービス（アジャスター）が 受付→査定→支払 の一連を回す画面のための型とデータ。

export const todayLabel = "2026年6月26日（金）"
export const branchName = "群青損害保険"
export const officeName = "東京中央 損害サービスセンター"
export const adjusterName = "相川 健司"
export const adjusterId = "ADJ-1042" // ログイン中アジャスターのID（CoSign の主担当者ガードに使う）

// 査定状況（請求一覧で使うステータス）
export type ClaimStatus =
  | "受付"
  | "損害調査中"
  | "査定中"
  | "承認待ち"
  | "承認済"
  | "支払済"
  | "否認"

// 事故種別
export type AccidentType = "車両事故" | "対物" | "対人" | "単独"

// 損害区分
export type DamageKind = "分損" | "全損"

// 査定ワークフローの段階ID（受付→損害調査→一次査定→二次査定→承認→支払）
export type StageId =
  | "受付"
  | "損害調査"
  | "一次査定"
  | "二次査定"
  | "承認"
  | "支払"

export interface CoverageBreakdown {
  /** 補償区分 */
  kind: "対人" | "対物" | "車両"
  /** その補償での請求額（円） */
  claimed: number
  /** 過失相殺後の認定額（円） */
  assessed: number
}

export interface ClaimDocument {
  name: string
  required: boolean
  received: boolean
}

export interface AdjustmentDetail {
  damageKind: DamageKind
  /** 修理費見積（分損時） */
  repairCost: number
  /** 全損時の車両時価額 */
  marketValue: number
  /** レッカー費用 */
  towing: number
  /** 代車費用 */
  rentalCar: number
  /** 契約者の過失割合（0–100 %） */
  faultRatio: number
  /** 免責金額（車両保険の自己負担） */
  deductible: number
  /** 補償ごとの内訳 */
  coverages: CoverageBreakdown[]
}

export interface PolicyInfo {
  /** 等級（ノンフリート等級 1–20） */
  grade: number
  /** 事故有係数適用期間（年） */
  accidentCoeffYears: number
  /** 主な補償（表示用） */
  coverages: string[]
  /** 過去3年の請求回数 */
  priorClaims: number
}

export interface WorkflowRecord {
  actor: string
  at: string
  comment?: string
}

export interface FraudFlag {
  level: "high" | "medium"
  label: string
  detail: string
}

export interface Claim {
  id: string
  /** 証券番号 */
  policyNo: string
  /** 契約者名 */
  policyholder: string
  /** 契約者かな（PersonCell secondary） */
  policyholderKana: string
  /** 事故相手（対物・対人時） */
  counterparty?: string
  /** 車種 */
  vehicle: string
  /** ナンバー */
  plate: string
  /** 事故日（ISO） */
  accidentDate: string
  /** 受付日（ISO） */
  receivedDate: string
  accidentType: AccidentType
  /** 請求額（円） */
  claimedAmount: number
  /** 査定額（円）。未査定なら null。 */
  assessedAmount: number | null
  status: ClaimStatus
  /** 担当査定者 */
  assignee: string
  /** 経過日数 */
  elapsedDays: number
  /** SLA（標準処理日数） */
  slaDays: number
  /** 事故概要 */
  summary: string
  policy: PolicyInfo
  adjustment: AdjustmentDetail
  documents: ClaimDocument[]
  /** ワークフロー現在地 */
  currentStage: StageId
  /** 全体ステータス */
  workflowStatus: "in-progress" | "approved" | "rejected"
  /** 段階ごとのサインオフ記録 */
  records: Partial<Record<StageId, WorkflowRecord>>
  fraudFlags: FraudFlag[]
}

// 高額しきい値（これを超えると二次査定 + 2名承認が必要）
export const HIGH_VALUE_THRESHOLD = 1_000_000

/** 査定額 = 請求額 − 過失相殺 − 免責。負にはしない。 */
export function computeAssessed(a: AdjustmentDetail, claimed: number): {
  faultDeduction: number
  deductible: number
  assessed: number
} {
  const faultDeduction = Math.round((claimed * a.faultRatio) / 100)
  const assessed = Math.max(claimed - faultDeduction - a.deductible, 0)
  return { faultDeduction, deductible: a.deductible, assessed }
}

export const STAGES: { id: StageId; label: string }[] = [
  { id: "受付", label: "受付" },
  { id: "損害調査", label: "損害調査" },
  { id: "一次査定", label: "一次査定" },
  { id: "二次査定", label: "二次査定（高額）" },
  { id: "承認", label: "承認" },
  { id: "支払", label: "支払" },
]

export const claims: Claim[] = [
  {
    id: "CLM-2026-04821",
    policyNo: "JPA-2025-7741920",
    policyholder: "田中 美咲",
    policyholderKana: "たなか みさき",
    counterparty: "株式会社山田運送",
    vehicle: "トヨタ プリウス (ZVW60)",
    plate: "品川 330 さ 28-15",
    accidentDate: "2026-06-09",
    receivedDate: "2026-06-10",
    accidentType: "対物",
    claimedAmount: 487_000,
    assessedAmount: null,
    status: "査定中",
    assignee: "相川 健司",
    elapsedDays: 17,
    slaDays: 14,
    summary:
      "交差点右折時、対向直進の相手車両（トラック）と接触。相手車両の左前部および当方右前部フェンダーを損傷。人身被害なし。",
    policy: {
      grade: 16,
      accidentCoeffYears: 0,
      coverages: ["対人無制限", "対物無制限", "車両保険(一般)", "弁護士費用特約"],
      priorClaims: 1,
    },
    adjustment: {
      damageKind: "分損",
      repairCost: 412_000,
      marketValue: 0,
      towing: 22_000,
      rentalCar: 53_000,
      faultRatio: 30,
      deductible: 50_000,
      coverages: [
        { kind: "対物", claimed: 180_000, assessed: 126_000 },
        { kind: "車両", claimed: 307_000, assessed: 164_900 },
      ],
    },
    documents: [
      { name: "交通事故証明書", required: true, received: true },
      { name: "修理見積書", required: true, received: true },
      { name: "損傷写真", required: true, received: true },
      { name: "相手方との示談状況確認書", required: true, received: false },
    ],
    currentStage: "一次査定",
    workflowStatus: "in-progress",
    records: {
      受付: { actor: "受付AI", at: "2026-06-10 09:12" },
      損害調査: { actor: "海老原 亮", at: "2026-06-14 16:40", comment: "現車確認済。修理工場見積を精査。" },
    },
    fraudFlags: [],
  },
  {
    id: "CLM-2026-04790",
    policyNo: "JPA-2024-6620084",
    policyholder: "佐々木 大輔",
    policyholderKana: "ささき だいすけ",
    vehicle: "日産 セレナ (C28)",
    plate: "横浜 503 む 11-08",
    accidentDate: "2026-06-02",
    receivedDate: "2026-06-03",
    accidentType: "単独",
    claimedAmount: 1_320_000,
    assessedAmount: null,
    status: "承認待ち",
    assignee: "相川 健司",
    elapsedDays: 24,
    slaDays: 21,
    summary:
      "高速道路走行中、路面凍結によりスリップしガードレールに衝突。フロント全体およびエアバッグ展開。修理費が時価額に接近し全損判定の可能性。",
    policy: {
      grade: 12,
      accidentCoeffYears: 1,
      coverages: ["対人無制限", "対物無制限", "車両保険(一般)", "車両新価特約"],
      priorClaims: 0,
    },
    adjustment: {
      damageKind: "全損",
      repairCost: 1_480_000,
      marketValue: 1_320_000,
      towing: 38_000,
      rentalCar: 0,
      faultRatio: 0,
      deductible: 100_000,
      coverages: [{ kind: "車両", claimed: 1_320_000, assessed: 1_220_000 }],
    },
    documents: [
      { name: "交通事故証明書", required: true, received: true },
      { name: "修理見積書", required: true, received: true },
      { name: "損傷写真", required: true, received: true },
      { name: "車検証（時価額確認）", required: true, received: true },
    ],
    currentStage: "二次査定",
    workflowStatus: "in-progress",
    records: {
      受付: { actor: "受付AI", at: "2026-06-03 08:30" },
      損害調査: { actor: "海老原 亮", at: "2026-06-08 11:20", comment: "全損判定。時価額1,320,000円で確定。" },
      一次査定: { actor: "相川 健司", at: "2026-06-19 14:05", comment: "全損・過失0%。新価特約適用検討。" },
    },
    fraudFlags: [],
  },
  {
    id: "CLM-2026-04855",
    policyNo: "JPA-2025-7890011",
    policyholder: "渡辺 翔太",
    policyholderKana: "わたなべ しょうた",
    counterparty: "鈴木 一郎",
    vehicle: "ホンダ N-BOX (JF5)",
    plate: "練馬 580 あ 99-21",
    accidentDate: "2026-06-21",
    receivedDate: "2026-06-22",
    accidentType: "対人",
    claimedAmount: 2_450_000,
    assessedAmount: null,
    status: "損害調査中",
    assignee: "相川 健司",
    elapsedDays: 5,
    slaDays: 30,
    summary:
      "駐車場出口で歩行者と接触。被害者は右足骨折で全治8週間の診断。治療費・休業損害・慰謝料を含む対人賠償案件。",
    policy: {
      grade: 7,
      accidentCoeffYears: 2,
      coverages: ["対人無制限", "対物無制限", "人身傷害5,000万"],
      priorClaims: 2,
    },
    adjustment: {
      damageKind: "分損",
      repairCost: 0,
      marketValue: 0,
      towing: 0,
      rentalCar: 0,
      faultRatio: 80,
      deductible: 0,
      coverages: [{ kind: "対人", claimed: 2_450_000, assessed: 1_960_000 }],
    },
    documents: [
      { name: "交通事故証明書", required: true, received: true },
      { name: "診断書", required: true, received: true },
      { name: "休業損害証明書", required: true, received: false },
      { name: "治療費明細", required: true, received: false },
    ],
    currentStage: "損害調査",
    workflowStatus: "in-progress",
    records: {
      受付: { actor: "受付AI", at: "2026-06-22 10:05" },
    },
    fraudFlags: [
      {
        level: "high",
        label: "短期多発",
        detail: "過去13か月で3件目の請求。直近の対人請求から4か月以内。",
      },
    ],
  },
  {
    id: "CLM-2026-04702",
    policyNo: "JPA-2023-5510077",
    policyholder: "高橋 由紀",
    policyholderKana: "たかはし ゆき",
    counterparty: "合同会社グリーン物流",
    vehicle: "スバル フォレスター (SK)",
    plate: "なにわ 302 か 45-67",
    accidentDate: "2026-05-18",
    receivedDate: "2026-05-19",
    accidentType: "対物",
    claimedAmount: 318_000,
    assessedAmount: 222_600,
    status: "承認済",
    assignee: "森田 彩",
    elapsedDays: 39,
    slaDays: 14,
    summary:
      "後退時に駐車中の相手車両に接触。当方リアバンパーおよび相手車両ドアパネルを損傷。",
    policy: {
      grade: 18,
      accidentCoeffYears: 0,
      coverages: ["対人無制限", "対物無制限", "車両保険(エコノミー)"],
      priorClaims: 0,
    },
    adjustment: {
      damageKind: "分損",
      repairCost: 280_000,
      marketValue: 0,
      towing: 0,
      rentalCar: 38_000,
      faultRatio: 30,
      deductible: 0,
      coverages: [{ kind: "対物", claimed: 318_000, assessed: 222_600 }],
    },
    documents: [
      { name: "交通事故証明書", required: true, received: true },
      { name: "修理見積書", required: true, received: true },
      { name: "損傷写真", required: true, received: true },
    ],
    currentStage: "承認",
    workflowStatus: "approved",
    records: {
      受付: { actor: "受付AI", at: "2026-05-19 09:00" },
      損害調査: { actor: "海老原 亮", at: "2026-05-22 13:30" },
      一次査定: { actor: "森田 彩", at: "2026-05-26 10:15", comment: "過失30%・免責なしで認定。" },
      承認: { actor: "課長 大野 直樹", at: "2026-05-28 17:00", comment: "認定額222,600円で承認。" },
    },
    fraudFlags: [],
  },
  {
    id: "CLM-2026-04610",
    policyNo: "JPA-2022-4410203",
    policyholder: "山本 健一",
    policyholderKana: "やまもと けんいち",
    vehicle: "マツダ CX-5 (KF)",
    plate: "札幌 300 さ 12-34",
    accidentDate: "2026-05-04",
    receivedDate: "2026-05-05",
    accidentType: "車両事故",
    claimedAmount: 96_000,
    assessedAmount: 46_000,
    status: "支払済",
    assignee: "森田 彩",
    elapsedDays: 53,
    slaDays: 14,
    summary: "飛び石によるフロントガラス破損。ガラス交換のみ。",
    policy: {
      grade: 20,
      accidentCoeffYears: 0,
      coverages: ["対人無制限", "対物無制限", "車両保険(一般)"],
      priorClaims: 1,
    },
    adjustment: {
      damageKind: "分損",
      repairCost: 96_000,
      marketValue: 0,
      towing: 0,
      rentalCar: 0,
      faultRatio: 0,
      deductible: 50_000,
      coverages: [{ kind: "車両", claimed: 96_000, assessed: 46_000 }],
    },
    documents: [
      { name: "修理見積書", required: true, received: true },
      { name: "損傷写真", required: true, received: true },
    ],
    currentStage: "支払",
    workflowStatus: "approved",
    records: {
      受付: { actor: "受付AI", at: "2026-05-05 08:40" },
      損害調査: { actor: "森田 彩", at: "2026-05-06 09:00" },
      一次査定: { actor: "森田 彩", at: "2026-05-07 11:00" },
      承認: { actor: "課長 大野 直樹", at: "2026-05-08 15:30" },
      支払: { actor: "経理 川村 さおり", at: "2026-05-12 10:00", comment: "口座振込完了。" },
    },
    fraudFlags: [],
  },
  {
    id: "CLM-2026-04888",
    policyNo: "JPA-2025-7799120",
    policyholder: "中村 京子",
    policyholderKana: "なかむら きょうこ",
    vehicle: "レクサス RX (TALA15)",
    plate: "横浜 300 す 77-99",
    accidentDate: "2026-06-24",
    receivedDate: "2026-06-25",
    accidentType: "単独",
    claimedAmount: 880_000,
    assessedAmount: null,
    status: "受付",
    assignee: "未割当",
    elapsedDays: 2,
    slaDays: 21,
    summary:
      "縁石への乗り上げによりホイール・サスペンション・アンダーカバーを損傷。単独事故。",
    policy: {
      grade: 6,
      accidentCoeffYears: 3,
      coverages: ["対人無制限", "対物無制限", "車両保険(一般)"],
      priorClaims: 3,
    },
    adjustment: {
      damageKind: "分損",
      repairCost: 880_000,
      marketValue: 0,
      towing: 28_000,
      rentalCar: 0,
      faultRatio: 0,
      deductible: 100_000,
      coverages: [{ kind: "車両", claimed: 880_000, assessed: 780_000 }],
    },
    documents: [
      { name: "交通事故証明書", required: true, received: false },
      { name: "修理見積書", required: true, received: true },
      { name: "損傷写真", required: true, received: true },
    ],
    currentStage: "受付",
    workflowStatus: "in-progress",
    records: {
      受付: { actor: "受付AI", at: "2026-06-25 18:22" },
    },
    fraudFlags: [
      {
        level: "medium",
        label: "高頻度請求",
        detail: "等級6・事故有係数3年。過去3年で3件の車両保険請求。",
      },
    ],
  },
  {
    id: "CLM-2026-04501",
    policyNo: "JPA-2021-3320991",
    policyholder: "小林 茂",
    policyholderKana: "こばやし しげる",
    counterparty: "個人（無保険）",
    vehicle: "スズキ ワゴンR (MH85)",
    plate: "名古屋 580 え 33-12",
    accidentDate: "2026-04-12",
    receivedDate: "2026-04-13",
    accidentType: "対物",
    claimedAmount: 640_000,
    assessedAmount: null,
    status: "否認",
    assignee: "相川 健司",
    elapsedDays: 75,
    slaDays: 14,
    summary:
      "申告内容と損傷形状が一致せず。複数の修理工場で見積額に大幅な乖離。調査の結果、事故状況の不自然さを確認。",
    policy: {
      grade: 4,
      accidentCoeffYears: 3,
      coverages: ["対人無制限", "対物無制限", "車両保険(一般)"],
      priorClaims: 4,
    },
    adjustment: {
      damageKind: "分損",
      repairCost: 640_000,
      marketValue: 0,
      towing: 0,
      rentalCar: 0,
      faultRatio: 0,
      deductible: 50_000,
      coverages: [{ kind: "車両", claimed: 640_000, assessed: 0 }],
    },
    documents: [
      { name: "交通事故証明書", required: true, received: false },
      { name: "修理見積書", required: true, received: true },
      { name: "損傷写真", required: true, received: true },
    ],
    currentStage: "一次査定",
    workflowStatus: "rejected",
    records: {
      受付: { actor: "受付AI", at: "2026-04-13 12:00" },
      損害調査: { actor: "特別調査課 藤井 誠", at: "2026-04-25 16:00", comment: "事故状況に不自然な点あり。SIU照会。" },
      一次査定: { actor: "相川 健司", at: "2026-05-02 10:30", comment: "事故証明なし・損傷不一致のため否認。" },
    },
    fraudFlags: [
      {
        level: "high",
        label: "損傷不一致・多発",
        detail: "申告と損傷が不整合。過去3年で4件の請求。SIU（特別調査課）照会済。",
      },
    ],
  },
]

// KPI（本日のサマリー指標）
export const kpis = {
  newToday: 2,
  inProgress: claims.filter((c) =>
    ["受付", "損害調査中", "査定中"].includes(c.status)
  ).length,
  awaitingApproval: claims.filter((c) => c.status === "承認待ち").length,
  paidThisMonth: claims
    .filter((c) => c.status === "支払済" || c.status === "承認済")
    .reduce((s, c) => s + (c.assessedAmount ?? 0), 0),
  avgDays: 14,
  slaBreached: claims.filter((c) => c.elapsedDays > c.slaDays && c.status !== "支払済" && c.status !== "否認").length,
  flagged: claims.filter((c) => c.fraudFlags.length > 0).length,
}
