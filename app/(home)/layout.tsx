// トップページ（/）はクライアント部品なので、そこからは metadata を出せない。
// ルートグループ（URL には出ない）で囲って、canonical と OGP をここから出す。
// 題と説明文はサイト既定（app/layout.tsx）＝トップそのものの文言なので触らない。
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/page-metadata";

const URL = absoluteUrl("/");
const TITLE = "GunjoUI — Becoming blue.";
const DESCRIPTION =
    "群青 — A design system for designers and AI, in becoming. SSOT-driven React + Tailwind for rich, data-dense applications.";

export const metadata: Metadata = {
    alternates: { canonical: URL },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: URL,
        type: "website",
        siteName: "GunjoUI",
    },
    twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
