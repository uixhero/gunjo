import type { Locale } from "@/lib/translations";
import type { BookStoreId } from "./book-promo";

/** 帯が画面に出す文字ぜんぶ。⭐ 言語を増やすときは、この形を1つ足すだけです。 */
export interface BookPromoStrings {
    /** 小見出し */
    eyebrow: string;
    /** 本のタイトル */
    title: string;
    /** 発売のキャッチ＋説明文 */
    lead: string;
    /** 販売先リンクの前に置く一言 */
    cta: string;
    /** 販売先のボタンの文字 */
    storeLabels: Record<BookStoreId, string>;
    /** 読み上げ用の補助。「◯◯」に店の名前が入る */
    newTabTitle: (storeName: string) => string;
    newTabNotice: string;
}

/**
 * ⛔⛔ ここが「フッター前の本の帯」の文言の唯一の置き場所です。
 *      実装（BookBanner.tsx / BookStoreLink.tsx）には1文字も文言を書かないこと。
 *
 * ⭐ 出どころ＝promotion/handoff/BOOK-BANNER-COPY.md の §3 gunjo.jp（名義＝GUNJO）。
 *    writing-review と check-voice を通した確定文言なので、⛔ ここで言い回しを直さないこと。
 *    （promotion/ は gunjo では gitignore＝この文書はリポジトリには入っていません）
 *
 * ⭐ 名義の規範（~/dev/new-4px/skills/brand-voice/）＝一人称なし（「私たち」「4px」を使わない）・
 *    用語は「コンポーネント」（⛔「部品」は禁止語）・「コールドテスト」は連載名なので残し、
 *    初出に括弧で言い換えを添える（下の lead の1文目がそれです）。
 *
 * ⚠️ uixhero.com では「発売のキャッチ」を項目として増やさず、説明文の先頭に付けました。
 *    ⭐ ここも同じ形です＝lead の1文目がキャッチ、2文目以降が説明文。
 */
const JA: BookPromoStrings = {
    /** 小見出し */
    eyebrow: "画面175枚の記録が本になりました",

    /**
     * 本のタイトル。
     * ⛔ サイトごとに変えないこと＝題は商品名で、Zenn と Amazon の商品ページにこの題で出ている。
     *    変えると押した先の題と食い違い、別の本に見えます（BOOK-BANNER-COPY.md §6）。
     */
    title: "あなたがAIにUIを作らせると、何が起きるか",

    /** 発売のキャッチ＋説明文（上のコメントのとおり、1つにまとめてあります） */
    lead:
        "コールドテスト（AIがどこまで画面を組めるかの検証）で作った175枚が、1冊の記録になりました。" +
        "予備知識ゼロのAIに、実在する業種の業務UIを175枚作らせ続けた記録。何が組めて、何が組めなかったか。" +
        "AIが作った画面には、足りないコンポーネントがありました。" +
        "そこから正式なコンポーネントになった26個を、作った順に載せています。",

    /** 販売先リンクの前に置く一言 */
    cta: "電子書籍・2026年8月刊。中身はどこで買っても同じで、買った店のアプリかブラウザで読めます。",

    /**
     * 販売先のボタンの文字。
     *
     * ⭐ 「〈店の名前〉で買う（〈その店の値段〉）」の1型に固定してあります＝店が増えても
     *    同じ形のボタンが1つ増えるだけで、ほかの文言は1文字も直りません（BOOK-BANNER-COPY.md §7）。
     * ⭐ 値段をラベルの中に置いているのは、店ごとに値段が違ってもその店の行だけ直せば済むため。
     *    ⛔ 説明文に「¥1,500」と1回だけ書く形にしないこと（1店だけ変わると文言ごと書き直しになる）。
     * ⚠️ 下2つはまだ出していない店（book-promo.ts の href が null）＝画面には出ません。
     *    URL を入れた日に文言を考えなくて済むように、同じ型で先に置いてあります。
     */
    storeLabels: {
        zenn: "Zennで買う（¥1,500）",
        amazon: "Amazonで買う（¥1,500）",
        apple_books: "Apple Booksで買う（¥1,500）",
        google_play_books: "Google Playで買う（¥1,500）",
    },

    /**
     * 読み上げ用の補助。⚠️ 「◯◯」に店の名前（book-promo.ts の name）が入ります。
     * ⚠️ ボタンの文字にも店の名前は入っていますが、title 属性はホバーで単独に読まれるため、
     *    ここにも名前を入れています。
     */
    newTabTitle: (storeName: string) => `${storeName} を新しいタブで開く`,
    newTabNotice: "（新しいタブで開く）",
};

/**
 * 言語ごとの文言。⭐⭐ **未設定（null）の言語には帯を出しません。**
 *
 * ⛔⛔ **英語はいま null＝英語の面（/en/**）に帯は出ません。**
 *    理由＝**本は日本語だけ**です。日本語の本を英語の読み手に売る導線を、いま置く理由がありません。
 *    ⛔ そして「日本語の帯を英語の面にそのまま出す」のはもっと悪い形です（#972 の初版がこれでした）。
 *
 * ⭐⭐ **英語を出す日にやることは、下の `en` に文言を入れること1つだけです。**
 *    帯・器・計測・面ごとの置き場所は1行も直りません（出す／出さないはこの表だけが決めます）。
 * ⛔⛔ そのとき**機械翻訳を入れないこと**＝上の日本語は writing-review と check-voice を通った
 *    確定文言で、英語も同じ重さが要ります。翻訳を出すなら
 *    ~/dev/new-4px/skills/translation-review/ の4段工程を通してから、ここに入れること。
 */
export const BOOK_PROMO_COPY: Record<Locale, BookPromoStrings | null> = {
    ja: JA,
    en: null,
};

/**
 * その面の言語の文言。⭐ 無ければ null ＝呼ぶ側は帯ごと出しません。
 *
 * ⭐⭐ 「英語かどうか」を**パスの文字列で判定しないこと**＝判定はロケールを持っている側
 *    （LocaleProvider）にあります。この関数は locale を受け取るだけなので、`app/en/` に面が
 *    増えても、その面は勝手にこちら側（帯を出さない側）に入ります。
 */
export function bookPromoCopyFor(locale: Locale): BookPromoStrings | null {
    return BOOK_PROMO_COPY[locale];
}
