"use client";

import * as React from "react";
import Link from "next/link";
import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Card,
    CardContent,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LocalNav } from "@/components/layout/TableOfContents";
import gallery from "@/data/cold-test-gallery.json";

interface GalleryEntry {
    round: number;
    slug: string;
    category: string;
    score: string;
    title: string;
    shots: { desktop: boolean };
}
interface GalleryShape {
    count: number;
    categories: string[];
    entries: GalleryEntry[];
}
const galleryData = gallery as GalleryShape;
const ROUND_COUNT = galleryData.count;
const INDUSTRY_COUNT = galleryData.categories.length;

function scoreOf(score: string): number {
    return parseFloat(score.replace(/^[^\d.]+/, "")) || 0;
}

// Hero mosaic — one strong screen per industry, so the strip reads as
// "many real industries, actually built." Derived from the snapshot (highest
// score per category, desktop shot required) so it never goes stale as the
// series grows. Capped so the strip stays a band, not a second gallery.
const HERO_TILES: GalleryEntry[] = (() => {
    const bestPerCategory = new Map<string, GalleryEntry>();
    for (const e of galleryData.entries) {
        if (!e.shots.desktop) continue;
        const current = bestPerCategory.get(e.category);
        if (!current || scoreOf(e.score) > scoreOf(current.score)) {
            bestPerCategory.set(e.category, e);
        }
    }
    // Order by the gallery's own category order for a stable, sensible sweep.
    const ordered: GalleryEntry[] = [];
    for (const cat of galleryData.categories) {
        const pick = bestPerCategory.get(cat);
        if (pick) ordered.push(pick);
    }
    return ordered.slice(0, 8);
})();

// Components called out in the flagship soushuuhen as the ones that
// crystallised during the cold-test run. Linked to their docs pages so
// readers can see what they ended up looking like.
const CRYSTALLISED = [
    { name: "Stringline", note: "鉄道/バスの時間×距離 運行図表" },
    { name: "StatusBoard", note: "配車盤・機器盤" },
    { name: "Leaderboard", note: "ベスト/ワースト・順位表" },
    { name: "ExpiryBadge", note: "有効期限の状態 Badge" },
    { name: "LimitMonitor", note: "値 vs 名前付き上限（拘束時間・在庫など）" },
    { name: "SegmentedControl", note: "大人/小児・個人/法人 など二者択一の切替" },
    { name: "NavRow", note: "設定リストの行" },
    { name: "LineChip", note: "路線色＋自動コントラスト" },
    { name: "OriginDestination", note: "出発→到着の A→B 横並び" },
    { name: "SectionList", note: "請求の締め別グループ＋小計" },
    { name: "DocumentRow", note: "DL ボタンを独立させた書類行" },
    { name: "MatchCard", note: "二者間ペアリング（会社×制度など）" },
    { name: "CompanyCell", note: "組織版の identity セル" },
];

// PascalCase → kebab-case, matching docSlugFor used in RoundDetailView.
function docSlugFor(name: string): string {
    return name
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

export function WhyView() {
    const { locale, pages } = useLocale();
    const t = pages.coldTests;
    const tw = t.why;
    const isJa = locale === "ja";

    return (
        <div className="container py-10 md:py-12">
            <article className="mx-auto w-full max-w-3xl space-y-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/cold-tests">{t.label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{tw.breadcrumbLabel}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <header className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {tw.label}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {tw.heading}
                    </h1>
                    <p className="max-w-2xl text-lg text-muted-foreground">{tw.subtitle}</p>
                    <LocalNav />
                </header>

                {/* Hero mosaic — one strong screen per industry. Each tile links
                    to that round's detail page. Decorative-but-navigable, so it
                    sits between the header and the prose rather than inside a
                    titled section (kept out of the TOC). */}
                {HERO_TILES.length > 0 && (
                    <div
                        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                        aria-label={isJa ? "代表的な画面" : "Representative screens"}
                    >
                        {HERO_TILES.map((tile) => (
                            <Link
                                key={tile.round}
                                href={`/cold-tests/${tile.round}`}
                                className="group block overflow-hidden rounded-md border border-border/60 bg-card transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={`#${tile.round} ${tile.title}`}
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-muted/40">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`/cold-test-shots/${tile.slug}.desktop.webp`}
                                        alt={`${tile.title} preview`}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.03]"
                                    />
                                </div>
                                <div className="truncate px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                    {t.categories[tile.category] ?? tile.category}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Body sections — long-form prose, primary JA with a thin EN
                    variant. Wrapped in semantic <section> with h2 for the TOC. */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa ? "出発点" : "Where it started"}
                    </h2>
                    {isJa ? (
                        <p className="leading-7 text-foreground">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">@gunjo/ui</code>{" "}
                            を公開したとき、私は「AI から使えるように設計した」と書きました。typed entry point、
                            機械可読な metadata、AI-handoff ドキュメント。エージェントが「眺める」のではなく
                            「読んで、そのまま使う」ための面を、最初から組み込んだつもりでした。
                            でも、それはあくまで主張にすぎません。
                            <strong>言葉にするだけなら、誰にでもできます</strong>。
                            だから、本当にそうなのかを確かめてみることにしました。
                        </p>
                    ) : (
                        <p className="leading-7 text-foreground">
                            When I shipped{" "}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">@gunjo/ui</code>{" "}
                            I claimed it was &quot;designed for AI to use&quot; — typed entry point, machine-readable
                            metadata, an AI-handoff doc surface built in from day one. Anyone can write that on a
                            landing page. So I tested it.
                        </p>
                    )}
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa ? "1ラウンドの作法" : "How a round works"}
                    </h2>
                    <ol className="ml-5 list-decimal space-y-2 text-foreground">
                        <li className="leading-7">
                            {isJa
                                ? "まず、文脈ゼロの AI に「あなたは群青を初めて使うエンジニアです。この業種のこの画面を、できるだけ群青の部品で作ってください」とお願いします。"
                                : "Spin up a context-free AI: 'You're an engineer who has never seen Gunjo before. Build this industry's screen using Gunjo components as much as possible.'"}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "AI には、公開ドキュメント（gunjo.jp）と npm パッケージの中身だけを頼りに、実データの画面を組んでもらいます。ソースコードは見せません。"
                                : "The AI builds with realistic data using only gunjo.jp docs and the npm package contents. Source code never shown."}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "そのうえで、「この部品が無かったので手で組みました」「索引はこの部品を勧めてきましたが、用途には合いませんでした」と、正直に報告してもらいます。"
                                : "Ask the AI to honestly report what was hand-rolled, where the discovery index pointed at the wrong primitive, where the docs misled."}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "こうして集まった「手で組んだ跡」を見ていきます。3つの別々の画面で、それぞれ独立に同じものが手組みされていたら（これを 3-confirm と呼んでいます）、それは本当に欠けている部品だと考えます。"
                                : "Collect the hand-rolled traces. When the same shape is independently re-built across three separate screens (3-confirm), it's a real gap."}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "そこで初めてデザインシステムに正式に追加し、SSOT（.pen / synthetic spec）まで反映して、その回を記事にまとめます。"
                                : "Ship the component, close the SSOT loop (.pen or synthetic spec), and write the round up."}
                        </li>
                    </ol>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa
                            ? "3-confirm — 1回・2回では作らない"
                            : "3-confirm — never build on the first hit"}
                    </h2>
                    {isJa ? (
                        <p className="leading-7 text-foreground">
                            私たちは「同じ穴が3回出てくるまで待つ」ようにしています。1回目はまだ起票するだけ、
                            2回目は索引やドキュメントを調整するだけにとどめ、3回目になって初めて部品をつくります。
                            <strong>その形が本当に安定するのを見届けたい</strong>からです。
                            急いで結晶化させると、API がひとつの用途に狭く固まってしまいます。たとえば{" "}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">MatchCard</code>{" "}
                            は、3回目（補助金マッチング＝会社×制度という<strong>異なる種類どうしのペア</strong>）が決め手になりました。
                            もし1〜2回目（同じ種類どうしのペア）の時点でつくっていたら、「会社×会社」に固定してしまっていたかもしれません。
                            異なる種類のペアに出会ったからこそ、「left/right はどんなエンティティでもよい」という設計にたどり着けたのです。
                            3回目は、数を合わせるためではなく、<strong>仕様を最終的に見極めるため</strong>の回でした。
                        </p>
                    ) : (
                        <p className="leading-7 text-foreground">
                            Wait until the same gap shows up three times. First hit: file an issue. Second hit: nudge
                            the docs / discovery index. Third hit: build. The wait lets the shape stabilise — building
                            too early locks the API around a single use-case.{" "}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">MatchCard</code>{" "}
                            became real on the third sighting (a subsidy-matching screen pairing{" "}
                            <em>company × programme</em> — heterogeneous entities). The first two were same-type pairs;
                            building then would have hard-coded a company-vs-company shape. The heterogeneous third
                            forced &quot;left/right are arbitrary entities,&quot; which is the real contract.
                        </p>
                    )}
                </section>

                <section className="space-y-4">
                    {/* No count in the heading: CRYSTALLISED.length is how many
                        cards we chose to highlight here, NOT the total number of
                        components that crystallised — stating it as "結晶化したN
                        部品" would read as the total and drift / mislead. */}
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa ? "結晶化した部品（抜粋）" : "What crystallised (highlights)"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isJa
                            ? `${ROUND_COUNT} 画面を通るなかで、3-confirm を満たして実装された新しい部品の一部です。名前をクリックすると、それぞれのドキュメントへ移動します。`
                            : `A subset of the new primitives that crossed the 3-confirm bar across ${ROUND_COUNT} rounds. Click any name to open its docs.`}
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {CRYSTALLISED.map((c) => (
                            <li key={c.name}>
                                <Link
                                    href={`/docs/components/${docSlugFor(c.name)}`}
                                    className="group flex items-start gap-3 rounded-md border border-border/60 bg-muted/20 p-3 transition-colors hover:border-primary-border hover:bg-muted/40"
                                >
                                    <code className="font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                        {c.name}
                                    </code>
                                    <span className="flex-1 text-xs text-muted-foreground">
                                        {c.note}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa
                            ? "AI を「正直者の検査装置」として"
                            : "The AI as an honest probe"}
                    </h2>
                    {isJa ? (
                        <p className="leading-7 text-foreground">
                            文脈ゼロの AI が「<strong>この部品は無い</strong>」と書いたとき、それは
                            「<strong>本当に無い</strong>」ことの、かなり強い証拠になります。
                            人が「なんとなく足りない気がする」と言うより、ずっと確かな手がかりです。
                            この AI にとっては手元のドキュメントだけが世界のすべてで、過去の経験や思い込みで隙間を埋めることができないからです。
                            手で組まれた跡は、<strong>設計の穴を正確に映した地図</strong>のようなもの。
                            その地図をたどっていくと、「これは本当に群青の側の問題なのか」「それとも AI の理解が足りなかっただけなのか」を、落ち着いて切り分けられます。
                        </p>
                    ) : (
                        <p className="leading-7 text-foreground">
                            When a context-free AI writes <strong>&quot;this primitive doesn&apos;t exist&quot;</strong>,
                            that&apos;s strong evidence the gap is real — stronger than a designer hand-waving
                            &quot;feels like something&apos;s missing.&quot; The AI has only the docs in front of it; it
                            can&apos;t fill blanks from experience or bias. The hand-rolled traces are the precise map of
                            the design holes.
                        </p>
                    )}
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa
                            ? `${ROUND_COUNT} 画面が示したこと`
                            : `What ${ROUND_COUNT} rounds proved`}
                    </h2>
                    <ul className="space-y-2 text-foreground">
                        <li className="leading-7">
                            <strong>{isJa ? "「完走」と言えるのは、toB と toC が同じ厚みになったときだけ。" : "A mode is 'done' only when toB and toC have equal weight."}</strong>{" "}
                            {isJa
                                ? "事業者側だけ作って満足してしまうと、穴は消費者側に集まります。実際、タクシーは事業者側を6枚作っても新しい部品はゼロでしたが、利用者側を6枚掘ると7部品以上が出てきました。"
                                : "Stop at operator-side and the gaps cluster on the consumer side. Taxi toB across 6 screens produced zero new primitives; taxi toC across 6 screens produced 7+."}
                        </li>
                        <li className="leading-7">
                            <strong>{isJa ? "「これは作るべきだ」という根拠には、強さの段階がある。" : "Build evidence has a strength ladder."}</strong>{" "}
                            {isJa
                                ? "いちばん弱いのは「部品が無くて手で組んだ」。次が「索引が間違った部品を勧めてきた」。そして最も強いのが「既存部品では HTML の構造上どうしても無理」というケースで、これには反論の余地がほとんどありません。"
                                : "Missing primitive → discovery index misleads → existing primitive is structurally impossible (e.g. button-in-button on a card). The last tier is unarguable."}
                        </li>
                        <li className="leading-7">
                            <strong>{isJa ? "床が成熟するほど、部品を作ってから再発見されるまでの距離が縮む。" : "As the floor matures, build-to-rediscovery distance shrinks."}</strong>{" "}
                            {isJa
                                ? "初期は、作った部品が次に独立して再発見されるまで17回も離れていました。それが終盤には2回（ほとんど連続）にまで縮みました。新しい画面は「新しい部品を生む場」というより、「既存の部品が思わぬ文脈で使い回される場」へと変わっていったのです。"
                                : "Early on, a freshly built primitive was independently rediscovered 17 rounds later. Late on, the gap shrank to 2 — the floor stops generating new gaps and starts proving reuse."}
                        </li>
                        <li className="leading-7">
                            <strong>{isJa ? "業界の壁は、思っていたより薄い。" : "Industry borders are thin."}</strong>{" "}
                            {isJa
                                ? `${INDUSTRY_COUNT} 業種・運輸5モードを通ってみると、共通の床（汎用的な UI）に業界ならではの部品を少し重ねるだけで、その多くを組むことができました。業界ごとの作法はもちろんありますが、UI の部品レベルでは業界を越えて使い回されることが多いのです。`
                                : `Across ${INDUSTRY_COUNT} industries and five transport modes, generic UI + a thin layer of industry primitives covered most cases. Industry-specific conventions exist but rarely demand industry-specific UI primitives.`}
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa ? "ここから先" : "Where to go from here"}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/cold-tests"
                            className="inline-flex items-center gap-2 rounded-md border border-primary-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            {tw.ctaGalleryLabel}
                            <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground">
                                {ROUND_COUNT}
                            </Badge>
                        </Link>
                        <Link
                            href="/showcase"
                            className="inline-flex items-center gap-2 rounded-md border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-border hover:text-primary"
                        >
                            {tw.ctaComponentsLabel}
                        </Link>
                    </div>
                </section>

                <Card className="border-border/70">
                    <CardContent className="space-y-2 px-6 py-5">
                        <p className="text-sm text-muted-foreground">
                            {isJa
                                ? "業界別の扉ページ（医療・運輸・金融…）は順次追加予定です。"
                                : "Per-industry overview pages are being added in stages."}
                        </p>
                    </CardContent>
                </Card>
            </article>
        </div>
    );
}
