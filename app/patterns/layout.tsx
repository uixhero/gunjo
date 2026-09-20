// /patterns の面のクロームは pathname と router を読むのでクライアント側
// （PatternsChrome）。metadata はサーバー側からしか出せないので、この layout を
// サーバー部品のまま残して、クロームは子として描く。
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { PatternsChrome } from "./PatternsChrome";

export const metadata: Metadata = pageMetadata("/patterns");

export default function PatternsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PatternsChrome>{children}</PatternsChrome>;
}
