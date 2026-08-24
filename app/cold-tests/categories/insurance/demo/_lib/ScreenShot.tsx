"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Skeleton, cn } from "@gunjo/ui";

/**
 * 画面一覧に置く実画面のサムネイル。`public/insurance-demo-shots/` の
 * `<slug>.<light|dark>.webp`（600px）と `.lg.webp`（1400px）を、いまのテーマと
 * 画面の解像度に合わせて出し分ける。
 * 撮影は `npm run insurance-demo:shots`（scripts/capture-insurance-demo-shots.mjs）。
 *
 * ページ固有グルー。⚠️ 同じ形の「テーマ連動サムネイル」は app/showcase・
 * app/patterns・app/cold-tests にもあり、これで4つ目＝@gunjo/ui 候補として
 * #887 で追跡する（このPRで部品化しないのは、src/components/** を触ると
 * 設計元・生成物・ドリフト検査まで同じPRで更新する必要があり、図版の
 * 差し替えより範囲がはるかに広くなるため）。
 */
export function ScreenShot({
    slug,
    alt,
    unavailableLabel,
}: {
    slug: string;
    alt: string;
    unavailableLabel: string;
}) {
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [loaded, setLoaded] = React.useState(false);
    const [errored, setErrored] = React.useState(false);
    // next-themes はプロバイダがクライアントで載るまで undefined を返すので、
    // mounted フラグで守り、ハイドレーション前は dark に寄せる
    // （ドキュメントサイトの既存のサムネイルと同じ扱い）。
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const mode: "light" | "dark" =
        mounted && resolvedTheme === "light" ? "light" : "dark";
    const src = `/insurance-demo-shots/${slug}.${mode}.webp`;
    // 600px（カード）と 1400px（retina）の2段。cold-test の図版と同じ段組みで、
    // 向こうは表示幅ごとに段を決め打ちしている（RoundDetailView の
    // desktopInlineSrc が .lg を直接指す）。ここはカードの幅が
    // auto-fill で変わるので、段をブラウザに選ばせる。
    const srcSet = `${src} 600w, /insurance-demo-shots/${slug}.${mode}.lg.webp 1400w`;

    // 画像がすでにブラウザのキャッシュにあると、マウント時点で onLoad は
    // 発火済み＝loaded が true にならない。img.complete から同期する。
    React.useEffect(() => {
        setLoaded(false);
        setErrored(false);
        const node = imgRef.current;
        if (!node) return;
        if (node.complete) {
            if (node.naturalWidth > 0) setLoaded(true);
            else setErrored(true);
        }
    }, [src]);

    return (
        <div className="relative block h-44 overflow-hidden border-b border-border/60 bg-muted/40">
            {!loaded && !errored && (
                <Skeleton className="absolute inset-0 h-full w-full" />
            )}
            {errored ? (
                <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                    {unavailableLabel}
                </div>
            ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    ref={imgRef}
                    src={src}
                    srcSet={srcSet}
                    /* 枠は h-44（176px）固定で object-cover なので、描かれる画像の
                       幅は枠の幅ではなく「176px × 元画像の縦横比」以上になる。
                       実測（2026-08-23・DPR2）で 304〜356px＝必要な実画素は
                       609〜712 で、600px 版はどの幅でも足りていなかった。
                       360px と書いて DPR1 なら 600w・DPR2 以上なら 1400w を
                       選ばせる。 */
                    sizes="360px"
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    onError={() => setErrored(true)}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "h-full w-full object-cover object-top transition-opacity duration-200",
                        loaded ? "opacity-100" : "opacity-0"
                    )}
                />
            )}
        </div>
    );
}
