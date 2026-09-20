// `/patterns` の索引だけを囲むルートグループ（URL には出ない）。
//
// なぜ要るか: `app/patterns/layout.tsx` は `/patterns/**` の全ページを囲むので、
// そこから索引の構造化データを出すと、下の各画面にも「これは /patterns だ」と
// いう node が付いてしまう。索引のページ本体は `"use client"` で自分では出せない
// ので、索引だけを囲むこの層から出す。トップ（`app/(home)`）と同じ形。
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = pageMetadata("/patterns");

export default function PatternsIndexLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <StructuredData path="/patterns" />
            {children}
        </>
    );
}
