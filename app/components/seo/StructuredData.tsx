/**
 * JSON-LD を `<script type="application/ld+json">` として書き出すサーバー部品。
 *
 * `/docs/**`・`/patterns/**`・`/showcase` はページ本体が `"use client"` なので、
 * ルートごとの `layout.tsx`（`npm run design:sync:seo-layouts` が作る）から
 * 呼びます。描画される見た目は変わりません（`<script>` は表示されない）。
 */
import { pageStructuredData, serializeJsonLd, type JsonLdNode } from "@/lib/seo/structured-data";

export function JsonLdScript({ node }: { node: JsonLdNode }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
        />
    );
}

export function StructuredData({ path }: { path: string }) {
    const nodes = pageStructuredData(path);
    if (nodes.length === 0) return null;
    return (
        <>
            {nodes.map((node, index) => (
                <JsonLdScript key={index} node={node} />
            ))}
        </>
    );
}
