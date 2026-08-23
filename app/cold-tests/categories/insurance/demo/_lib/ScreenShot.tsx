"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Skeleton, cn } from "@gunjo/ui";

/**
 * 画面一覧に置く実画面のサムネイル。`public/insurance-demo-shots/` の
 * `<slug>.<light|dark>.webp` を、いまのテーマに合わせて出し分ける。
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
