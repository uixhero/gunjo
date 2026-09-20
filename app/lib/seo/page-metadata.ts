/**
 * `/docs/**`・`/patterns/**`・`/showcase` のページごとの metadata。
 *
 * これらのページは本体が `"use client"` なので、ページ自身からは `metadata` を
 * 出せません（クライアント側の部品は metadata を出せない）。そこでルートごとに
 * 素通しの `layout.tsx` を置き、そこからここを呼びます。layout 群は
 * `npm run design:sync:seo-layouts` が作り、`design:verify` が取りこぼしを見ます。
 *
 * 出すものはコールドテストの回（`app/cold-tests/[round]/page.tsx`）と同じ形＝
 * 題・説明文・canonical・OGP・Twitter カード。
 *
 * hreflang は「対応する英語の URL があるページ」にだけ付きます。gunjo.jp で
 * 英語の URL を持つのはコールドテスト（`/en/cold-tests/**`）だけで、docs と
 * パターンとショーケースは同じ URL で言語を切り替える作りなので、対になる
 * URL がありません＝ここでは hreflang を出しません（出すと存在しない URL を
 * 指すことになる）。
 */
import type { Metadata } from "next";
import { curatedCopy } from "./curated-copy";
import generatedCopy from "./page-copy.generated.json";

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

const GENERATED: Record<string, { title?: string; description?: string }> = (
    generatedCopy as { pages: Record<string, { title?: string; description?: string }> }
).pages;

export interface PageCopy {
    title: string;
    description: string;
}

/** 題と説明文。元データから引き、足りない分は生成済みの写しで埋める。 */
export function resolvePageCopy(path: string): PageCopy | null {
    const curated = curatedCopy(path);
    const fallback = GENERATED[path];
    const title = curated.title ?? fallback?.title ?? null;
    const description = curated.description ?? fallback?.description ?? null;
    if (!title || !description) return null;
    return { title, description };
}

export function absoluteUrl(path: string): string {
    return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** canonical と OGP だけを組む（題と説明文を外から渡す面のため）。 */
export function baseMetadata(path: string, copy: PageCopy): Metadata {
    const url = absoluteUrl(path);
    return {
        title: copy.title,
        description: copy.description,
        alternates: { canonical: url },
        openGraph: {
            title: copy.title,
            description: copy.description,
            url,
            type: "website",
            siteName: "GunjoUI",
        },
        twitter: {
            card: "summary",
            title: copy.title,
            description: copy.description,
        },
    };
}

/**
 * ルートごとの `layout.tsx` から呼ぶ入口。題か説明文が取れないページは
 * 何も出さず、トップの既定値を引き継ぎます（`design:verify:seo-metadata`
 * がそこで落ちるので、取りこぼしは CI で分かります）。
 */
export function pageMetadata(path: string): Metadata {
    const copy = resolvePageCopy(path);
    if (!copy) return {};
    return baseMetadata(path, copy);
}
