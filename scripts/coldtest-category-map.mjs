/**
 * Round number → industry category (JA name) map, shared by
 * scripts/build-coldtest-gallery.mjs and scripts/aggregate-coldtest-primitives.mjs.
 *
 * The series ran roughly industry-by-industry; explicit exceptions
 * (out-of-block rounds, toC interleaving) are listed individually. Ported
 * verbatim from gunjo-test/app/gallery/_data.ts; keep in sync when the cold-
 * test series adds more rounds.
 */

/** Display order of industry categories (also used by the gallery UI). */
export const CATEGORIES = [
    "基盤UI・汎用",
    "金融",
    "会計・給与",
    "小売・EC",
    "物流・倉庫",
    "医療・ヘルスケア",
    "不動産",
    "製造",
    "教育",
    "公共・行政",
    "メディア・出版",
    "人材・HR・採用",
    "介護・福祉",
    "飲食・レストラン",
    "保険",
    "運輸：鉄道",
    "運輸：航空",
    "運輸：バス",
    "運輸：タクシー",
    "運輸：トラック",
    "建設・建築",
];

export function categoryOf(round) {
    if (round === 31) return "小売・EC";
    if (round <= 30) return "基盤UI・汎用";
    if (round <= 36) return "金融";
    if (round <= 41) return "会計・給与";
    if (round <= 46) return "小売・EC";
    if (round <= 52) return "物流・倉庫";
    if (round <= 59) return "医療・ヘルスケア";
    if (round <= 63) return "不動産";
    if (round <= 69) return "製造";
    if (round <= 74) return "教育";
    if (round <= 79) return "公共・行政";
    if (round <= 82) return "メディア・出版";
    if (round <= 88) return "人材・HR・採用";
    if (round <= 93) return "介護・福祉";
    if (round <= 98) return "飲食・レストラン";
    if (round <= 105) return "保険";
    if (round === 117) return "運輸：鉄道";
    if (round === 118) return "小売・EC";
    if (round === 119) return "運輸：鉄道";
    if (round === 120) return "運輸：鉄道";
    if (round === 121) return "運輸：鉄道";
    if (round === 128) return "運輸：鉄道";
    if (round === 129) return "運輸：鉄道";
    if (round === 130) return "運輸：航空";
    if (round === 131) return "運輸：航空";
    if (round === 132) return "運輸：鉄道";
    if (round === 133) return "運輸：鉄道";
    if (round === 134) return "運輸：航空";
    if (round === 135) return "運輸：航空";
    if (round === 136) return "運輸：バス";
    if (round === 137) return "運輸：バス";
    if (round === 138) return "運輸：バス";
    if (round === 139) return "運輸：バス";
    if (round === 140) return "運輸：バス";
    if (round === 141) return "運輸：タクシー";
    if (round === 142) return "運輸：タクシー";
    if (round === 143) return "運輸：タクシー";
    if (round === 144) return "運輸：タクシー";
    if (round === 145) return "運輸：タクシー";
    if (round === 146) return "運輸：タクシー";
    if (round === 147) return "運輸：タクシー";
    if (round === 148) return "運輸：タクシー";
    if (round === 149) return "運輸：タクシー";
    if (round === 150) return "運輸：タクシー";
    if (round === 151) return "運輸：タクシー";
    if (round === 152) return "運輸：タクシー";
    if (round === 153) return "運輸：バス";
    if (round === 154) return "運輸：バス";
    if (round === 155) return "運輸：バス";
    if (round === 156) return "運輸：バス";
    if (round === 157) return "運輸：バス";
    if (round === 158) return "運輸：バス";
    if (round === 159) return "運輸：トラック";
    if (round === 160) return "運輸：トラック";
    if (round === 161) return "運輸：トラック";
    if (round === 162) return "運輸：トラック";
    if (round === 163) return "運輸：トラック";
    if (round === 164) return "運輸：トラック";
    if (round === 165) return "運輸：トラック";
    if (round === 166) return "運輸：トラック";
    if (round === 167) return "運輸：トラック";
    if (round === 168) return "運輸：トラック";
    if (round === 169) return "運輸：鉄道";
    if (round === 170) return "運輸：鉄道";
    if (round === 171) return "会計・給与";
    if (round === 172) return "金融";
    if (round === 173) return "金融";
    if (round === 174) return "建設・建築";
    if (round === 175) return "建設・建築";
    if (round <= 111) return "運輸：鉄道";
    return "運輸：航空";
}
