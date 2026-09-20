"use client";

import { track } from "@vercel/analytics";
import { IconExternalLink } from "@tabler/icons-react";
import { Button, Icon } from "@gunjo/ui";
import {
    APP_PROMO_EVENT,
    APP_PROMO_STORE,
    appStoreHref,
    type PromoApp,
} from "@/lib/app-promo";
import type { AppPromoStrings } from "@/lib/app-promo-copy";

/**
 * アプリの告知の中の「App Store へ行くリンク」1本。
 *
 * ⭐ 計測の中身（イベント名・値・なぜ outbound_click ではないか）は app/lib/app-promo.ts に
 *    まとめてあります。⛔ ここでイベント名を直に書かないこと。
 * ⛔ リンクの出し分け（審査中はふつうの頁・通ったらウィジェットの頁）もここで書かないこと
 *    ＝正は appStoreHref()。
 * ⛔ 文言をここに書かないこと＝正は app/lib/app-promo-copy.ts。
 *
 * ⭐ 塗りのボタン（`primary`）です＝本の帯の販売先リンクと同じ。2枚が縦に並ぶ面で、
 *    押す場所の見た目が2通りにならないようにしています。
 *
 * ⛔⛔ **`shrink-0` を外さないこと。** フレックスの子は既定で min-content まで縮みますが、
 *    **日本語は1文字ごとに改行できるので min-content が「1文字ぶん」**になります＝狭い列に
 *    置かれると、ボタンが1文字幅まで潰れて札が枠の外へ出ます（issue #874 と同じ型。
 *    `@gunjo/ui` の `Banner` も PR #1018 で同じ直しをしています）。
 *    ⭐ `shrink-0` があると、そうなったとき**潰れずに溢れる**ので、横あふれの検査で捕まります
 *       ＝黙って壊れるのではなく、落ちて分かる形になります。
 */
export function AppStoreLink({
    app,
    copy,
    placement,
    variant = "primary",
}: {
    app: PromoApp;
    copy: AppPromoStrings;
    /** 計測の `placement`。正は app/lib/app-promo.ts の定数 */
    placement: string;
    variant?: "primary" | "outline";
}) {
    return (
        <Button asChild variant={variant} className="shrink-0">
            <a
                href={appStoreHref(app)}
                target="_blank"
                rel="noopener noreferrer"
                title={copy.newTabTitle}
                onClick={() =>
                    track(APP_PROMO_EVENT, {
                        app: app.id,
                        store: APP_PROMO_STORE,
                        placement,
                    })
                }
            >
                {copy.storeLabel}
                <Icon icon={IconExternalLink} size="sm" className="shrink-0 opacity-70" />
                <span className="sr-only">{copy.newTabNotice}</span>
            </a>
        </Button>
    );
}
