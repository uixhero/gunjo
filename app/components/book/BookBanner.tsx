import { Card, CardTitle } from "@gunjo/ui";
import { availableBookStores, BOOK_COVER, isBookBannerVisible } from "@/lib/book-promo";
import { BOOK_PROMO_COPY } from "@/lib/book-promo-copy";
import { BookStoreLink } from "./BookStoreLink";

const TITLE_ID = "book-promo-title";

/**
 * フッターの手前に置く、有料本への導線。
 *
 * ⛔⛔ **横幅の器をここに持たせないこと。** この帯は自分がどの面に出ているかを知りません
 *    （トップ・コールドテストの回・docs で本文の幅が違います）。器は面を知っている側＝
 *    BookBannerSlot.tsx が外から巻きます。
 *    ⚠️ 「同じ幅の値を書く」ではなく「同じ器を通す」こと。値で写すと必ずずれます。
 *
 * ⛔ 文言をここに書かないこと＝正は app/lib/book-promo-copy.ts。
 * ⛔ 販売先をここに書かないこと＝正は app/lib/book-promo.ts。
 *
 * ⭐ 地は @gunjo/ui の Card をそのまま通しています（`border` + `bg-card` + `shadow-sm`）。
 *    ⛔ ここで `bg-secondary` / `bg-muted` に塗り替えないこと。gunjo のトークンは
 *       暗い側で `--border` と `--secondary` / `--muted` が同じ値（217.2 32.6% 17.5%）なので、
 *       塗ってしまうと Card の枠線が暗い側だけ消え、2つのテーマで形が食い違います。
 *       `bg-card` なら明るい側（白 対 214 32% 91%）でも暗い側（222.2 84% 4.9% 対 217.2 32.6% 17.5%）でも
 *       枠線が立ちます。同じ理由で、中のボタンも `outline` ではなく `primary`（塗り）です。
 *
 * ⚠️⚠️ **表紙の影を Tailwind の既製の影（`shadow-sm` / `-md` / `-lg`）に替えないこと。**
 *    既製の影は3つとも下向きだけ（`shadow-sm` は `0 1px 2px`、`-md`／`-lg` は spread が負）で、
 *    **影が上辺より上に出ません**。ところが溶けるのは上辺です。
 *    以下すべて 2026-09-12 実測・1280px 描画・上辺の外 1px の地を横 84px ぶん平均した値:
 *      影なし          … 地 rgb(255,255,255)・表紙の上辺 rgb(251,239,227)＝**1.13:1**
 *      `shadow-md`     … 地 rgb(254,254,254)＝**1.12:1**（⚠️ 1階調しか動かない＝効いていません）
 *      いまの形        … 地 rgb(201,201,202)＝**1.46:1**
 *    ⭐ 効いているのは **オフセット0の環境光**（`0 0 8px`）です。これだけが上辺の外側を暗くします。
 *    ⛔ 枠線で解かないこと（明るい側でしか見えない線になります・上の段落と同じ理由）。
 *    ⚠️ ぼかしを詰める（`0 0 3px`）と縁が硬くなって線に見えます＝それは上で捨てた形です。
 *
 * ⭐⭐ **影は明るい側だけです**（`dark:shadow-none`）。
 *    暗い側では表紙 rgb(251,239,227) が地 rgb(2,8,23) に対して **17.68:1**（実測）＝
 *    そもそも影が要りません。⛔ `dark:shadow-none` を外さないこと＝色は `--foreground` を
 *    見ているので、暗い側では**白に反転して表紙が光ります**。
 *    ⭐ 色をトークン（`--foreground`）で持ち、幾何（オフセット0のぼかし）だけを直に書く形は、
 *       Sidebar.tsx や chart-tooltip.tsx と同じ扱いです＝
 *       design/policy/hardcoded-color-class-exceptions.json に理由つきで登録してあります。
 *    ⛔ `hsl(var(--foreground) / …)` に置き換えないこと＝暗い側で白に反転し、表紙が光ります。
 *
 * ⭐ 表紙の alt は空です。すぐ横に同じ文字（本のタイトル）が見出しとして出ているため、
 *    alt を入れると読み上げが同じことを2回言います。表紙は飾りの扱い。
 *
 * ⛔ 左端の縦の色帯（border-left / inset shadow / absolute left-0 の細い帯）を足さないこと
 *    ＝gunjo.jp の UI 共通の禁止事項（CLAUDE.md）。
 */
export function BookBanner() {
    if (!isBookBannerVisible()) return null;

    const stores = availableBookStores();

    return (
        <aside aria-labelledby={TITLE_ID} className="py-10 sm:py-14">
            <Card className="p-5 sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7 lg:flex-1">
                        {/* eslint-disable-next-line @next/next/no-img-element -- 本文中の画像と同じ素の img
                            （app 内の内容画像はどれも素の img です）。@gunjo/ui の Img は読み込み中を
                            JS で opacity-0 にするので、JS が無いと表紙が出ないままになります。 */}
                        <img
                            src={BOOK_COVER.src}
                            alt=""
                            width={BOOK_COVER.width}
                            height={BOOK_COVER.height}
                            loading="lazy"
                            decoding="async"
                            className="h-auto w-24 shrink-0 self-start rounded-md shadow-[0_0_8px_hsl(var(--foreground)/0.45),0_6px_14px_-3px_hsl(var(--foreground)/0.28)] dark:shadow-none sm:w-28"
                        />

                        <div className="min-w-0">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground">
                                {BOOK_PROMO_COPY.eyebrow}
                            </p>

                            <CardTitle as="h2" id={TITLE_ID} className="mt-1.5 text-lg leading-snug sm:text-xl">
                                {BOOK_PROMO_COPY.title}
                            </CardTitle>

                            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                                {BOOK_PROMO_COPY.lead}
                            </p>
                        </div>
                    </div>

                    {/* 販売先。横に余裕があるときは右端へ寄せて、読む列と押す列を分ける。
                        ⭐ ボタンは flex-wrap で折り返します＝店が4つに増えても横1列に詰め込みません
                           （いちばん長い「Google Playで買う（¥1,500）」は狭い画面で折り返します）。 */}
                    <div className="shrink-0 lg:w-64">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            {BOOK_PROMO_COPY.cta}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {stores.map((store) => (
                                <BookStoreLink
                                    key={store.id}
                                    id={store.id}
                                    name={store.name}
                                    label={BOOK_PROMO_COPY.storeLabels[store.id]}
                                    href={store.href}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </aside>
    );
}
