// 契約管理ダッシュボード — サンプルデータ（架空の保険会社「群青損害保険」東京中央支社 営業課）
// 個人情報は全て架空。証券番号・保険料・等級なども実在の契約とは一切関係ありません。

export type PolicyStatus = "active" | "expiring" | "renewing" | "lapsed" | "cancelled";
export type ProductKind = "auto" | "fire" | "accident" | "liability";
export type ContractType = "new" | "renewal";
export type PayMethod = "annual" | "monthly";
export type RenewalNoticeStatus = "not_sent" | "sent" | "responded" | "overdue";

export interface PremiumLine {
  label: string;
  /** 正の値は加算（基本/特約）、負の値は割引。 */
  amount: number;
  /** 種別: base=基本保険料, rider=特約, discount=割引 */
  kind: "base" | "rider" | "discount";
  note?: string;
}

export interface ClaimRecord {
  date: string; // ISO
  kind: string;
  amount: number;
  status: "支払済" | "査定中" | "不払い";
}

export interface Policy {
  id: string;
  policyNo: string; // 証券番号
  holder: string; // 契約者
  holderKana: string;
  product: ProductKind;
  productLabel: string; // 商品名（具体）
  status: PolicyStatus;
  contractType: ContractType;
  startDate: string; // 始期 ISO
  endDate: string; // 満期 ISO
  payMethod: PayMethod;
  annualPremium: number; // 年間保険料
  commissionRate: number; // 代理店手数料率
  grade?: number; // ノンフリート等級（自動車）
  agentId: string; // 担当募集人
  premiumLines: PremiumLine[];
  riders: string[]; // 特約名（補償内容サマリ）
  coverage: { label: string; value: string }[]; // 補償内容
  renewalNotice: RenewalNoticeStatus;
  claims: ClaimRecord[];
  daysToExpiry: number; // 満期までの日数（負=失効後）
}

export interface Agent {
  id: string;
  name: string;
  kana: string;
  role: string;
  registrationNo: string; // 募集人登録番号
  newCount: number; // 当月新規件数
  renewalCount: number; // 当月継続件数
  premiumMTD: number; // 当月保険料収入
  target: number; // 当月目標保険料
}

export const AGENTS: Agent[] = [
  {
    id: "a1",
    name: "高橋 美咲",
    kana: "たかはし みさき",
    role: "募集管理者",
    registrationNo: "00231458",
    newCount: 1,
    renewalCount: 2,
    premiumMTD: 98_000,
    target: 90_000,
  },
  {
    id: "a2",
    name: "佐藤 健一",
    kana: "さとう けんいち",
    role: "募集人",
    registrationNo: "00231460",
    newCount: 0,
    renewalCount: 1,
    premiumMTD: 45_600,
    target: 60_000,
  },
  {
    id: "a3",
    name: "渡辺 結衣",
    kana: "わたなべ ゆい",
    role: "募集人",
    registrationNo: "00231471",
    newCount: 2,
    renewalCount: 1,
    premiumMTD: 76_400,
    target: 60_000,
  },
  {
    id: "a4",
    name: "中村 大輔",
    kana: "なかむら だいすけ",
    role: "募集人（新人）",
    registrationNo: "00231488",
    newCount: 1,
    renewalCount: 0,
    premiumMTD: 24_000,
    target: 40_000,
  },
];

export function agentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export const PRODUCT_LABEL: Record<ProductKind, string> = {
  auto: "自動車保険",
  fire: "火災保険",
  accident: "傷害保険",
  liability: "賠償責任保険",
};

export const STATUS_LABEL: Record<PolicyStatus, string> = {
  active: "有効",
  expiring: "満期間近",
  renewing: "更新手続中",
  lapsed: "失効",
  cancelled: "解約",
};

export const RENEWAL_NOTICE_LABEL: Record<RenewalNoticeStatus, string> = {
  not_sent: "未送付",
  sent: "送付済",
  responded: "回答あり",
  overdue: "期限超過",
};

export const POLICIES: Policy[] = [
  {
    id: "p1",
    policyNo: "AOB-2024-008812",
    holder: "山田 太郎",
    holderKana: "やまだ たろう",
    product: "auto",
    productLabel: "トータルパーソナル自動車保険",
    status: "expiring",
    contractType: "renewal",
    startDate: "2024-07-15",
    endDate: "2026-07-15",
    payMethod: "annual",
    annualPremium: 32_400,
    commissionRate: 0.16,
    grade: 16,
    agentId: "a1",
    premiumLines: [
      { label: "基本保険料（対人・対物無制限）", amount: 82_000, kind: "base" },
      { label: "人身傷害補償特約（5,000万円）", amount: 12_600, kind: "rider" },
      { label: "弁護士費用特約", amount: 2_900, kind: "rider" },
      { label: "ノンフリート等級割引（16等級 −63%）", amount: -53_500, kind: "discount" },
      { label: "ゴールド免許割引", amount: -8_900, kind: "discount" },
      { label: "証券割引（Web約款）", amount: -2_700, kind: "discount" },
    ],
    riders: ["人身傷害5,000万", "弁護士費用特約", "対物超過修理費用"],
    coverage: [
      { label: "対人賠償", value: "無制限" },
      { label: "対物賠償", value: "無制限" },
      { label: "車両保険", value: "一般・150万円" },
      { label: "免責金額", value: "5万-10万円" },
    ],
    renewalNotice: "sent",
    claims: [{ date: "2023-11-02", kind: "車両単独事故", amount: 184_000, status: "支払済" }],
    daysToExpiry: 18,
  },
  {
    id: "p2",
    policyNo: "AOB-2023-004471",
    holder: "鈴木 花子",
    holderKana: "すずき はなこ",
    product: "fire",
    productLabel: "すまいの保険（戸建・H構造）",
    status: "active",
    contractType: "renewal",
    startDate: "2023-10-01",
    endDate: "2028-10-01",
    payMethod: "annual",
    annualPremium: 41_200,
    commissionRate: 0.13,
    agentId: "a2",
    premiumLines: [
      { label: "建物保険料（2,400万円）", amount: 38_500, kind: "base" },
      { label: "家財保険料（600万円）", amount: 9_800, kind: "rider" },
      { label: "水災補償特約", amount: 6_400, kind: "rider" },
      { label: "地震保険料（建物・家財）", amount: 18_700, kind: "rider" },
      { label: "長期一括割引（5年契約）", amount: -28_900, kind: "discount" },
      { label: "ノンスモーカー割引", amount: -3_300, kind: "discount" },
    ],
    riders: ["水災補償", "地震保険50%", "個人賠償1億円"],
    coverage: [
      { label: "建物", value: "2,400万円" },
      { label: "家財", value: "600万円" },
      { label: "地震保険", value: "建物1,200万・家財300万" },
      { label: "免責", value: "なし" },
    ],
    renewalNotice: "not_sent",
    claims: [],
    daysToExpiry: 826,
  },
  {
    id: "p3",
    policyNo: "AOB-2025-001190",
    holder: "田中 一郎",
    holderKana: "たなか いちろう",
    product: "auto",
    productLabel: "トータルパーソナル自動車保険",
    status: "renewing",
    contractType: "renewal",
    startDate: "2024-06-30",
    endDate: "2026-06-30",
    payMethod: "monthly",
    annualPremium: 97_600,
    commissionRate: 0.16,
    grade: 11,
    agentId: "a1",
    premiumLines: [
      { label: "基本保険料（対人・対物無制限）", amount: 96_000, kind: "base" },
      { label: "車両保険（一般・200万円）", amount: 38_200, kind: "rider" },
      { label: "弁護士費用特約", amount: 2_900, kind: "rider" },
      { label: "ノンフリート等級割引（11等級 −47%）", amount: -38_400, kind: "discount" },
      { label: "新車割引", amount: -3_200, kind: "discount" },
      { label: "分割払手数料（月払）", amount: 2_100, kind: "rider" },
    ],
    riders: ["車両200万", "弁護士費用特約", "ロードサービス"],
    coverage: [
      { label: "対人賠償", value: "無制限" },
      { label: "対物賠償", value: "無制限" },
      { label: "車両保険", value: "一般・200万円" },
      { label: "運転者範囲", value: "本人・配偶者限定" },
    ],
    renewalNotice: "responded",
    claims: [{ date: "2025-03-18", kind: "追突事故（被害）", amount: 0, status: "査定中" }],
    daysToExpiry: 3,
  },
  {
    id: "p4",
    policyNo: "AOB-2022-009003",
    holder: "伊藤 良子",
    holderKana: "いとう りょうこ",
    product: "accident",
    productLabel: "傷害総合保険（家族型）",
    status: "lapsed",
    contractType: "renewal",
    startDate: "2024-05-20",
    endDate: "2025-05-20",
    payMethod: "annual",
    annualPremium: 28_900,
    commissionRate: 0.18,
    agentId: "a3",
    premiumLines: [
      { label: "基本保険料（死亡・後遺障害1,000万円）", amount: 24_000, kind: "base" },
      { label: "入院日額特約（6,000円）", amount: 6_800, kind: "rider" },
      { label: "天災危険補償特約", amount: 1_900, kind: "rider" },
      { label: "family割引（家族型）", amount: -3_800, kind: "discount" },
    ],
    riders: ["入院日額6,000円", "天災危険補償", "携行品損害"],
    coverage: [
      { label: "死亡・後遺障害", value: "1,000万円" },
      { label: "入院", value: "日額6,000円" },
      { label: "通院", value: "日額3,000円" },
      { label: "対象", value: "本人・配偶者・子" },
    ],
    renewalNotice: "overdue",
    claims: [],
    daysToExpiry: -38,
  },
  {
    id: "p5",
    policyNo: "AOB-2024-006650",
    holder: "小林 製作所",
    holderKana: "こばやし せいさくしょ",
    product: "liability",
    productLabel: "施設賠償責任保険（製造業）",
    status: "active",
    contractType: "renewal",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    payMethod: "annual",
    annualPremium: 152_000,
    commissionRate: 0.11,
    agentId: "a1",
    premiumLines: [
      { label: "施設賠償基本保険料", amount: 118_000, kind: "base" },
      { label: "生産物賠償責任特約（PL）", amount: 64_000, kind: "rider" },
      { label: "受託者賠償責任特約", amount: 12_000, kind: "rider" },
      { label: "優良割引（無事故3年）", amount: -38_000, kind: "discount" },
      { label: "複数契約割引", amount: -4_000, kind: "discount" },
    ],
    riders: ["生産物賠償（PL）", "受託者賠償", "管理財物特約"],
    coverage: [
      { label: "対人・対物（1事故）", value: "5億円" },
      { label: "生産物賠償", value: "1億円" },
      { label: "免責金額", value: "10万円" },
      { label: "保険期間", value: "2年" },
    ],
    renewalNotice: "not_sent",
    claims: [],
    daysToExpiry: 552,
  },
  {
    id: "p6",
    policyNo: "AOB-2023-007781",
    holder: "加藤 健",
    holderKana: "かとう けん",
    product: "auto",
    productLabel: "トータルパーソナル自動車保険",
    status: "expiring",
    contractType: "renewal",
    startDate: "2024-07-25",
    endDate: "2026-07-25",
    payMethod: "annual",
    annualPremium: 14_800,
    commissionRate: 0.16,
    grade: 20,
    agentId: "a3",
    premiumLines: [
      { label: "基本保険料（対人・対物無制限）", amount: 74_000, kind: "base" },
      { label: "弁護士費用特約", amount: 2_900, kind: "rider" },
      { label: "ノンフリート等級割引（20等級 −63%）", amount: -46_600, kind: "discount" },
      { label: "ゴールド免許割引", amount: -8_100, kind: "discount" },
      { label: "ASV割引（自動ブレーキ）", amount: -7_400, kind: "discount" },
    ],
    riders: ["弁護士費用特約", "対物超過修理費用"],
    coverage: [
      { label: "対人賠償", value: "無制限" },
      { label: "対物賠償", value: "無制限" },
      { label: "車両保険", value: "なし" },
      { label: "運転者年齢", value: "35歳以上補償" },
    ],
    renewalNotice: "sent",
    claims: [],
    daysToExpiry: 28,
  },
  {
    id: "p7",
    policyNo: "AOB-2021-003320",
    holder: "吉田 みどり",
    holderKana: "よしだ みどり",
    product: "fire",
    productLabel: "マンション総合保険",
    status: "active",
    contractType: "renewal",
    startDate: "2024-09-01",
    endDate: "2027-09-01",
    payMethod: "annual",
    annualPremium: 22_800,
    commissionRate: 0.13,
    agentId: "a2",
    premiumLines: [
      { label: "建物保険料（800万円）", amount: 16_400, kind: "base" },
      { label: "家財保険料（400万円）", amount: 7_200, kind: "rider" },
      { label: "個人賠償責任特約（1億円）", amount: 1_800, kind: "rider" },
      { label: "オール電化割引", amount: -1_600, kind: "discount" },
      { label: "長期契約割引（3年）", amount: -1_000, kind: "discount" },
    ],
    riders: ["個人賠償1億円", "破損・汚損"],
    coverage: [
      { label: "建物（専有部分）", value: "800万円" },
      { label: "家財", value: "400万円" },
      { label: "個人賠償", value: "1億円" },
      { label: "免責", value: "1万円" },
    ],
    renewalNotice: "not_sent",
    claims: [{ date: "2024-12-08", kind: "給排水設備の水漏れ", amount: 92_000, status: "支払済" }],
    daysToExpiry: 432,
  },
  {
    id: "p8",
    policyNo: "AOB-2025-002204",
    holder: "松本 翔",
    holderKana: "まつもと しょう",
    product: "auto",
    productLabel: "トータルパーソナル自動車保険",
    status: "active",
    contractType: "new",
    startDate: "2025-04-10",
    endDate: "2026-04-10",
    payMethod: "monthly",
    annualPremium: 145_600,
    commissionRate: 0.16,
    grade: 6,
    agentId: "a3",
    premiumLines: [
      { label: "基本保険料（対人・対物無制限）", amount: 124_000, kind: "base" },
      { label: "車両保険（一般・180万円）", amount: 42_000, kind: "rider" },
      { label: "人身傷害補償特約（3,000万円）", amount: 9_800, kind: "rider" },
      { label: "ノンフリート等級割引（6等級 −19%）", amount: -33_600, kind: "discount" },
      { label: "分割払手数料（月払）", amount: 3_400, kind: "rider" },
    ],
    riders: ["車両180万", "人身傷害3,000万", "ロードサービス"],
    coverage: [
      { label: "対人賠償", value: "無制限" },
      { label: "対物賠償", value: "無制限" },
      { label: "車両保険", value: "一般・180万円" },
      { label: "運転者年齢", value: "21歳以上補償" },
    ],
    renewalNotice: "not_sent",
    claims: [],
    daysToExpiry: 287,
  },
  {
    id: "p9",
    policyNo: "AOB-2022-005518",
    holder: "井上 雅彦",
    holderKana: "いのうえ まさひこ",
    product: "accident",
    productLabel: "ゴルファー保険",
    status: "cancelled",
    contractType: "renewal",
    startDate: "2024-08-01",
    endDate: "2025-08-01",
    payMethod: "annual",
    annualPremium: 9_800,
    commissionRate: 0.2,
    agentId: "a4",
    premiumLines: [
      { label: "基本保険料", amount: 11_200, kind: "base" },
      { label: "ホールインワン費用特約", amount: 1_400, kind: "rider" },
      { label: "Web申込割引", amount: -2_800, kind: "discount" },
    ],
    riders: ["賠償責任1億円", "用品損害", "ホールインワン費用"],
    coverage: [
      { label: "賠償責任", value: "1億円" },
      { label: "傷害死亡・後遺障害", value: "300万円" },
      { label: "ゴルフ用品", value: "30万円" },
      { label: "ホールインワン費用", value: "30万円" },
    ],
    renewalNotice: "not_sent",
    claims: [],
    daysToExpiry: 35,
  },
  {
    id: "p10",
    policyNo: "AOB-2024-008090",
    holder: "木村 さやか",
    holderKana: "きむら さやか",
    product: "auto",
    productLabel: "トータルパーソナル自動車保険",
    status: "expiring",
    contractType: "renewal",
    startDate: "2024-07-08",
    endDate: "2026-07-08",
    payMethod: "annual",
    annualPremium: 60_600,
    commissionRate: 0.16,
    grade: 14,
    agentId: "a4",
    premiumLines: [
      { label: "基本保険料（対人・対物無制限）", amount: 88_000, kind: "base" },
      { label: "車両保険（一般・120万円）", amount: 31_000, kind: "rider" },
      { label: "ノンフリート等級割引（14等級 −60%）", amount: -47_500, kind: "discount" },
      { label: "ゴールド免許割引", amount: -8_200, kind: "discount" },
      { label: "新規証券割引", amount: -2_700, kind: "discount" },
    ],
    riders: ["車両120万", "対物超過修理費用"],
    coverage: [
      { label: "対人賠償", value: "無制限" },
      { label: "対物賠償", value: "無制限" },
      { label: "車両保険", value: "一般・120万円" },
      { label: "運転者範囲", value: "本人・家族" },
    ],
    renewalNotice: "sent",
    claims: [],
    daysToExpiry: 11,
  },
];

// 年間保険料は内訳から導出（表とドロワーの内訳が必ず一致するように）
export function premiumTotal(p: Policy): number {
  return p.premiumLines.reduce((s, l) => s + l.amount, 0);
}

// 日付ユーティリティ（決定的フォーマット — SSR/CSR で一致させる）
export function formatJpDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
}
