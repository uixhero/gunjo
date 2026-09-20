import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Card, CardTitle, Icon } from "@gunjo/ui";
import { APP_PROMO_PLACEMENT_BANNER, PROMO_APPS } from "@/lib/app-promo";
import type { AppPromoStrings } from "@/lib/app-promo-copy";
import { AppStoreLink } from "./AppStoreLink";

const TITLE_ID = "app-promo-title";

/**
 * フッターの手前、本の帯の下に並ぶ「GUNJO で作ったアプリ」の帯。
 *
 * ⛔⛔ **横幅の器をここに持たせないこと。** 本の帯（BookBanner.tsx）とまったく同じ理由で、
 *    この帯も自分がどの面に出ているかを知りません。器は面を知っている側＝
 *    app/components/promo/PromoBannerSlot.tsx が外から巻きます。
 * ⛔ 文言をここに書かないこと＝正は app/lib/app-promo-copy.ts。
 * ⛔ 言語をここで選ばないこと＝`copy` で外から渡ります（選ぶのは PromoBannerSlot）。
 * ⛔ 出すか出さないかもここで決めないこと＝旗を読むのは PromoBannerSlot（app/lib/app-promo.ts）。
 *
 * ⭐⭐ **地は本の帯とそろえて `Card`（`bg-card`）です。** 申し送り §4 はアプリの夜空
 *    （`#070A16`）を地に指定していますが、gunjo はトークンの外の色を入れられません
 *    （独自トークンの拡張は禁止）。⭐ そのうえで実害はありません＝gunjo の暗い側の
 *    `--card` は `222.2 84% 4.9%` ＝ **#020817**、申し送りの #070A16 とは
 *    RGB で (5, 2, 1) しか違わず、暗い側ではそのままアプリの夜空の地になります。
 *    ⚠️ 明るい側は白のままです（アプリは夜の一色なので「ダークだけで作る」案でしたが、
 *    gunjo で明暗を片方だけ固定する形は既存にありません。同じ場所に縦に並ぶ本の帯が
 *    明暗で切り替わるので、片方だけ固定すると2枚の地が食い違います）。
 * ⛔ `bg-secondary` / `bg-muted` に塗り替えないこと＝暗い側で `--border` と同じ値になり、
 *    Card の枠線が消えます（BookBanner.tsx に実測つきの説明があります）。
 *
 * ⭐ アイコンに `border border-border` を1本入れてあります。アプリのアイコンは四隅まで夜空
 *    （暗い）ので、暗い側では地（#020817）に溶けます。⛔ 影で解かないこと＝影の色は
 *    `--foreground` を見るので、暗い側では白に反転してアイコンが光ります（本の表紙と同じ罠）。
 *
 * ⭐ アイコンの alt は空です。すぐ横に同じ文字（アプリの名前）が見出しとして出ます。
 *
 * ⛔ 左端の縦の色帯（border-left / inset shadow / absolute left-0 の細い帯）を足さないこと
 *    ＝gunjo.jp の UI 共通の禁止事項（CLAUDE.md）。
 */
export function AppPromoBanner({ copy }: { copy: AppPromoStrings }) {
    // ⚠️ いまは1件です。2件目が出たら、この帯ではなくトップの節（HomeAppsSection）が一覧を持ちます
    //    ＝帯はフッター前の1枠なので、並べる場所ではありません。
    const app = PROMO_APPS[0];
    if (!app) return null;

    return (
        <aside aria-labelledby={TITLE_ID}>
            <Card className="p-5 sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7 lg:flex-1">
                        {/* eslint-disable-next-line @next/next/no-img-element -- 本文中の画像と同じ素の img
                            （app 内の内容画像はどれも素の img です）。@gunjo/ui の Img は読み込み中を
                            JS で opacity-0 にするので、JS が無いとアイコンが出ないままになります。 */}
                        <img
                            src={app.icon.src}
                            alt=""
                            width={app.icon.width}
                            height={app.icon.height}
                            loading="lazy"
                            decoding="async"
                            className="h-auto w-16 shrink-0 self-start rounded-2xl border border-border sm:w-20"
                        />

                        <div className="min-w-0">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground">
                                {copy.eyebrow}
                            </p>

                            <CardTitle as="h2" id={TITLE_ID} className="mt-1.5 text-lg leading-snug sm:text-xl">
                                {copy.name}
                            </CardTitle>

                            <p className="mt-1.5 text-sm font-medium leading-relaxed">
                                {copy.tagline}
                            </p>

                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {copy.bannerLead}
                            </p>
                        </div>
                    </div>

                    {/* 押す列。⭐ 本の帯と同じ `lg:w-64` ＝2枚が縦に並んだとき、押す場所の左端がそろいます。 */}
                    <div className="shrink-0 lg:w-64">
                        <div className="flex flex-wrap gap-2">
                            <AppStoreLink app={app} copy={copy} placement={APP_PROMO_PLACEMENT_BANNER} />
                        </div>
                        <Link
                            href={app.docsHref}
                            className="mt-3 inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {copy.docsLabel}
                            <Icon icon={IconArrowUpRight} size="sm" className="shrink-0" />
                        </Link>
                    </div>
                </div>
            </Card>
        </aside>
    );
}
