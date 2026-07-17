"use client";

import * as React from "react";
import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Badge, Button } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const COPY_EN = {
    badge: "Stability policy",
    heading: "How we mark what's safe to depend on.",
    intro:
        "Every component in GunjoUI carries a stability label so adopters can tell at a glance which surfaces are production-ready and which are still finding their shape. The label appears next to the title on each component's docs page and in the JSON manifest at /api/specs/manifest.",
    levelsHeading: "Levels",
    levels: [
        {
            label: "Stable",
            variant: "default" as const,
            promise:
                "Public API frozen. Safe to depend on in production. Breaking changes require a major version bump (semver respected).",
            useFor:
                "Building production features. Pinning to a minor range is enough.",
        },
        {
            label: "Beta",
            variant: "secondary" as const,
            promise:
                "Feature-complete and used internally. The API may still adjust based on feedback. Patch bumps will not break, minor bumps might.",
            useFor:
                "Building features that can absorb a one-time migration. Pin to an exact version if you want certainty.",
        },
        {
            label: "Experimental",
            variant: "outline" as const,
            promise:
                "Shape and behavior may change between any release, including patch bumps. We're still learning what the right primitive looks like.",
            useFor:
                "Prototypes, internal tools, throwaway demos. Don't ship to revenue-critical surfaces yet.",
        },
    ],
    alphaHeading: "Where we are today",
    alphaBody:
        "GunjoUI is in beta (0.1.0-beta.1). Default stability for any component not explicitly classified is Experimental. As specific components stabilize, we'll graduate them upward — see the changelog for promotions.",
    promotionHeading: "How a component graduates",
    promotionBullets: [
        "Stable → at least one minor release in Beta with no breaking API change, plus a documented migration path for any prior shape.",
        "Beta → feature-complete, full prop coverage in /docs, a11y review passed, used in production by at least one consumer.",
        "Experimental → the default. Anything new starts here.",
    ],
    packageHeading: "Package version gates",
    packageIntro:
        "The labels above are per-component. The package version itself (alpha → beta → 1.0) moves on its own gates:",
    packageGates: [
        "0.0.x alpha — the API may change in any release, including prereleases. Unclassified components default to Experimental; the core set graduates to Beta as it stabilizes.",
        "0.1.0-beta.1 (now) — four gates: (1) no silent build-time footguns — the RSC function-prop class is caught by a next build CI gate and client formatters expose serializable alternatives (valueFormat / timeFormat …); (2) first impression complete — i18n (LocaleProvider), 44px touch targets, full /docs prop coverage; (3) semver discipline begins — breaking changes only in a minor, with a CHANGELOG entry and an @deprecated migration path; (4) first component-promotion wave — the core set graduates to Beta.",
        "1.0.0 — a Stable core (Beta for at least one minor with no breaking change, plus migration docs) used in production by at least one consumer, with any export-structure breaks (e.g. subpath exports) already consumed before 1.0.",
    ],
    cta: "Browse components",
};

const COPY_JA = {
    badge: "安定性ポリシー",
    heading: "本番依存していい線引きを明示しています。",
    intro:
        "GunjoUI の各コンポーネントには安定性ラベルが付与されていて、本番採用していい場所と、まだ形が動く場所を一目で見分けられます。ラベルは各コンポーネントの docs ページのタイトル横と、`/api/specs/manifest` の JSON に出てきます。",
    levelsHeading: "レベル",
    levels: [
        {
            label: "Stable",
            variant: "default" as const,
            promise:
                "公開 API は固定済み。本番依存しても安全。破壊的変更にはメジャーバージョン昇格が必要（semver 準拠）。",
            useFor:
                "本番機能を作るとき。マイナーバージョンの範囲で固定すれば十分です。",
        },
        {
            label: "Beta",
            variant: "secondary" as const,
            promise:
                "機能としては完成し、社内利用も進んでいます。フィードバック次第で API は調整される可能性があります。パッチバンプでは壊れませんが、マイナーで壊れることがあります。",
            useFor:
                "1 度の移行コストを許容できる機能。確実性が必要なら exact version で固定してください。",
        },
        {
            label: "Experimental",
            variant: "outline" as const,
            promise:
                "形と振る舞いが任意のリリース（パッチも含む）で変わる可能性があります。まだ正しい primitive を探っている段階です。",
            useFor:
                "プロトタイプ、社内ツール、使い捨てデモ。売上に直結する画面にはまだ載せないでください。",
        },
    ],
    alphaHeading: "現状",
    alphaBody:
        "GunjoUI は beta（0.1.0-beta.1）です。明示的に分類されていないコンポーネントのデフォルトは Experimental になります。個別のコンポーネントが安定したら段階的に格上げ — 昇格内容は changelog を参照。",
    promotionHeading: "昇格条件",
    promotionBullets: [
        "Stable → Beta で最低 1 マイナー期間 API 破壊的変更ゼロ、過去の形からの移行ドキュメント完備。",
        "Beta → 機能完成、/docs の Props 完全カバー、a11y レビュー通過、本番採用 1 件以上。",
        "Experimental → デフォルト。新規はここから始まります。",
    ],
    packageHeading: "パッケージ版の昇格ゲート",
    packageIntro:
        "上のラベルは部品ごとの分類です。パッケージ自体のバージョン（alpha → beta → 1.0）は、別の 4 点ゲートで進みます:",
    packageGates: [
        "0.0.x alpha — API は任意のリリース（プレリリース含む）で変わりえます。未分類の部品は既定で Experimental、コアは安定次第 Beta へ昇格。",
        "0.1.0-beta.1（現在）— 4 点ゲート: (1) サイレントな build 時 footgun ゼロ — RSC の関数prop クラスを next build の CI ゲートで捕捉し、client の formatter は serializable 代替（valueFormat / timeFormat 等）を提供。(2) 第一印象の完成 — i18n（LocaleProvider）、44px タッチ標的、/docs の Props 完全カバー。(3) semver 規律の開始 — 破壊的変更はマイナーのみ・CHANGELOG 記載＋@deprecated 移行パス。(4) 部品昇格の第一波 — コアが Beta へ。",
        "1.0.0 — Stable なコア（Beta で最低 1 マイナー期間 破壊ゼロ＋移行ドキュメント）が本番採用 1 件以上で使われ、export 構造の破壊（例: subpath export）は 1.0 前に消化済み。",
    ],
    cta: "コンポーネント一覧へ",
};

export default function StabilityPage() {
    const { locale } = useLocale();
    const copy = locale === "ja" ? COPY_JA : COPY_EN;

    return (
        <div className="container max-w-3xl py-12 space-y-12">
            <header className="space-y-4">
                <Badge variant="outline">{copy.badge}</Badge>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {copy.heading}
                </h1>
                <p className="text-lg text-muted-foreground">{copy.intro}</p>
            </header>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.levelsHeading}
                </h2>
                <div className="space-y-4">
                    {copy.levels.map((level) => (
                        <div
                            key={level.label}
                            className="space-y-2 rounded-lg border border-border/40 p-5"
                        >
                            <div className="flex items-center gap-3">
                                <Badge variant={level.variant}>{level.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{level.promise}</p>
                            <p className="text-sm">
                                <span className="font-medium">
                                    {locale === "ja" ? "向いている用途：" : "Use it for: "}
                                </span>
                                <span className="text-muted-foreground">{level.useFor}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3 rounded-xl border border-accent-foreground/20 bg-accent/40 p-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.alphaHeading}
                </h2>
                <p className="text-sm text-muted-foreground">{copy.alphaBody}</p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.promotionHeading}
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {copy.promotionBullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                            <span aria-hidden="true">—</span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.packageHeading}
                </h2>
                <p className="text-sm text-muted-foreground">{copy.packageIntro}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {copy.packageGates.map((b, i) => (
                        <li key={i} className="flex gap-2">
                            <span aria-hidden="true">—</span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <div>
                <Button asChild variant="outline">
                    <Link href="/showcase">
                        {copy.cta}
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
