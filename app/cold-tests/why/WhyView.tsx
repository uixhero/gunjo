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

interface GalleryShape {
    count: number;
    categories: string[];
}
const galleryData = gallery as GalleryShape;
const ROUND_COUNT = galleryData.count;
const INDUSTRY_COUNT = galleryData.categories.length;

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

                {/* Body sections — long-form prose, primary JA with a thin EN
                    variant. Wrapped in semantic <section> with h2 for the TOC. */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isJa ? "出発点" : "Where it started"}
                    </h2>
                    {isJa ? (
                        <p className="leading-7 text-foreground">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">@gunjo/ui</code>{" "}
                            を作るとき、僕は「AI から使えるように設計した」と書きました。typed entry point、
                            機械可読 metadata、AI-handoff ドキュメント ── エージェントが「眺める」のではなく
                            「読んで、使う」ための面を最初から組み込んだ、と。でもそれはただの主張です。
                            <strong>書くだけなら誰でも書ける</strong>。だから確かめました。
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
                                ? "文脈ゼロの AI に「あなたは群青を初めて使うエンジニアです。この業種のこの画面を、できるだけ群青の部品で作ってください」と頼む。"
                                : "Spin up a context-free AI: 'You're an engineer who has never seen Gunjo before. Build this industry's screen using Gunjo components as much as possible.'"}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "AI は公開ドキュメント（gunjo.jp）と npm パッケージの中身だけで、実データの画面を組む。ソースは見せない。"
                                : "The AI builds with realistic data using only gunjo.jp docs and the npm package contents. Source code never shown."}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "AI に「この部品が無いから手組みした」「索引はこの部品を勧めたが用途に合わない」と正直に報告させる。"
                                : "Ask the AI to honestly report what was hand-rolled, where the discovery index pointed at the wrong primitive, where the docs misled."}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "その手組みの跡を集める。3つの別々の画面で独立に同じものが手組みされたら（3-confirm）、それは本当に要る部品だと確定。"
                                : "Collect the hand-rolled traces. When the same shape is independently re-built across three separate screens (3-confirm), it's a real gap."}
                        </li>
                        <li className="leading-7">
                            {isJa
                                ? "デザインシステムに正式に build し、SSOT（.pen / synthetic spec）まで完結させて記事にする。"
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
                            「同じ穴が3回出るまで待つ」。1回目は gap として起票するだけ、2回目で索引や docs を調整するだけ、
                            3回目で初めて build trigger になる。
                            <strong>形が安定するのを見届けるため</strong>です。早すぎる結晶化は API を狭く固める。
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">MatchCard</code>{" "}
                            は3回目（補助金マッチング＝会社×制度の<strong>異種ペア</strong>）が決定打でした。
                            もし1〜2回目（同種×同種）で作っていたら「会社×会社固定」で作ってしまったかもしれない。
                            異種ペアが「left/right を任意エンティティにする」決断を強制した。
                            3-confirm の3回目は、build の数合わせでなく
                            <strong>仕様の最終確定</strong>です。
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
                            ? `${ROUND_COUNT} 画面のうち、3-confirm を通って実装された新部品の一部です。クリックで個別ドキュメントへ。`
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
                            cold な AI が「<strong>この部品は無い</strong>」と書く時、それは
                            「<strong>本当に無い</strong>」の強い証拠になります。
                            人間が「足りない気がする」と言うより signal は強い。
                            なぜなら AI は手元のドキュメントだけが世界の全てで、過去の経験や偏見で補完できないから。
                            手組みした跡は <strong>設計の穴の正確な地図</strong>。その地図をたどると、
                            「これは本当に gunjo/ui の問題だ」と「これは AI の理解不足だ」を切り分けられる。
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
                            <strong>{isJa ? "完走は toB と toC が対称になること。" : "A mode is 'done' only when toB and toC have equal weight."}</strong>{" "}
                            {isJa
                                ? "事業者側だけ作って終わりにすると、消費者側に穴が集まる。タクシー toB を6枚作っても新部品ゼロ、toC を6枚掘ると7部品以上が出た。"
                                : "Stop at operator-side and the gaps cluster on the consumer side. Taxi toB across 6 screens produced zero new primitives; taxi toC across 6 screens produced 7+."}
                        </li>
                        <li className="leading-7">
                            <strong>{isJa ? "build 根拠には強さの階段がある。" : "Build evidence has a strength ladder."}</strong>{" "}
                            {isJa
                                ? "部品が無い（穴）→ 索引が間違った部品を勧める（誤誘導）→ 既存部品では HTML 構造上不可能（最強）。後者は反論の余地が無い。"
                                : "Missing primitive → discovery index misleads → existing primitive is structurally impossible (e.g. button-in-button on a card). The last tier is unarguable."}
                        </li>
                        <li className="leading-7">
                            <strong>{isJa ? "床が成熟するほど build→検証の距離が縮む。" : "As the floor matures, build-to-rediscovery distance shrinks."}</strong>{" "}
                            {isJa
                                ? "初期は17回離れて再発見されていた部品が、終盤は2回（ほぼ連続）になった。新画面は「新部品を生む」より「既存部品が想定外の文脈で再利用される」が主になる。"
                                : "Early on, a freshly built primitive was independently rediscovered 17 rounds later. Late on, the gap shrank to 2 — the floor stops generating new gaps and starts proving reuse."}
                        </li>
                        <li className="leading-7">
                            <strong>{isJa ? "業界の壁は薄い。" : "Industry borders are thin."}</strong>{" "}
                            {isJa
                                ? `${INDUSTRY_COUNT} 業種・運輸5モードを通って、共通の床（汎用 UI）+ 業界 primitives の重ね合わせで多くが組めた。業界固有の作法は確かにあるが、UI primitive レベルでは越境して再利用される。`
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
