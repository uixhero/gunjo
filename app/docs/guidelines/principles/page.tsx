import { GuidelinePage } from "../_GuidelinePage";

export default function PrinciplesGuidelinePage() {
    return (
        <GuidelinePage
            badge={{ ja: "Guidelines", en: "Guidelines" }}
            title={{ ja: "設計思想", en: "Design Principles" }}
            description={{
                ja: "GunjoUI をどう判断して使うかの上位方針です。はじめにが導入・採用の入口だとすると、このページは実装やレビューで迷った時の判断軸です。",
                en: "The high-level decision rules for using and evolving GunjoUI. Introduction explains adoption; this page explains how to decide when implementing and reviewing UI.",
            }}
            sections={[
                {
                    eyebrow: { ja: "Scope", en: "Scope" },
                    title: { ja: "はじめにとガイドラインの役割", en: "Introduction and guidelines have different jobs" },
                    body: {
                        ja: "はじめには、GunjoUI が何で、どう導入し、どの内部資料へ進むかを示します。ガイドラインは、実装時に何を優先し、どのコンポーネントを選び、どこまでを本体に戻すかを決めるための場所です。",
                        en: "Introduction explains what GunjoUI is, how to adopt it, and where to go next. Guidelines explain what to prioritize, which component to choose, and when behavior belongs back in the system.",
                    },
                    items: [
                        {
                            title: { ja: "はじめに: 採用と入口", en: "Introduction: adoption and entry points" },
                            body: {
                                ja: "インストール、テーマ、AI 連携、採用ガイド、移行手順、依存関係など、プロジェクトを理解して使い始めるための情報を置きます。",
                                en: "Keep installation, theming, AI handoff, adoption, migration, and dependencies there: the material needed to understand and start using the project.",
                            },
                        },
                        {
                            title: { ja: "ガイドライン: 判断とレビュー", en: "Guidelines: decisions and review" },
                            body: {
                                ja: "Button と TextLink の違い、overlay の扱い、docs preview の基準、アクセシビリティの確認など、実装品質を揃えるための考え方を置きます。",
                                en: "Keep decisions there: Button vs TextLink, overlay behavior, docs preview standards, accessibility checks, and similar quality rules.",
                            },
                        },
                    ],
                    note: {
                        ja: "この分担が曖昧になると、導入資料にレビュー基準が混ざり、ガイドラインに採用手順が混ざります。読む目的が違うため、近い内容でも置き場を分けます。",
                        en: "When this boundary is unclear, adoption material starts carrying review rules and guidelines start carrying setup steps. Keep them separate because the reading goal differs.",
                    },
                },
                {
                    eyebrow: { ja: "Priority", en: "Priority" },
                    title: { ja: "優先順位", en: "Priority order" },
                    body: {
                        ja: "GunjoUI はデザインシステムなので、その場の見た目よりも、再利用できる責務と検証できる状態を優先します。",
                        en: "GunjoUI is a design system, so reusable responsibility and verifiable behavior take priority over local visual fixes.",
                    },
                    items: [
                        {
                            title: { ja: "既存コンポーネントを先に使う", en: "Use existing components first" },
                            body: {
                                ja: "新しい UI を作る前に、`src/components/**`、近い docs page、patterns の利用例を確認します。既存で表現できるなら compose して使います。",
                                en: "Before building UI, inspect `src/components/**`, nearby docs pages, and patterns. If existing components can express it, compose them.",
                            },
                        },
                        {
                            title: { ja: "一時的な見た目合わせを避ける", en: "Avoid temporary visual matching" },
                            body: {
                                ja: "app 側で似た CSS を書いて終わると、SSOT と実装がずれます。足りない挙動は本体コンポーネント、slot、variant、または issue に戻します。",
                                en: "Local CSS lookalikes drift from the SSOT. Missing behavior should become a component change, slot, variant, or issue.",
                            },
                        },
                        {
                            title: { ja: "コードとプレビューを仕様として扱う", en: "Treat code and preview as the spec" },
                            body: {
                                ja: "表示だけ整っていても、コード例がコピーして使えないなら docs として不十分です。preview、code、SSOT、export が同じ意図を示す必要があります。",
                                en: "A polished preview is not enough if copied code is incomplete. Preview, code, SSOT, and exports must describe the same behavior.",
                            },
                        },
                        {
                            title: { ja: "モバイルと長い文言を先に疑う", en: "Assume mobile and long content will break" },
                            body: {
                                ja: "狭い幅、長いラベル、フォーカス、スクロール、ツールチップ、オーバーレイは破綻しやすいので、標準状態だけで完了にしません。",
                                en: "Narrow width, long labels, focus, scrolling, tooltips, and overlays break easily. Do not stop at the default state.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: {
                                ja: "見た目だけ似た UI が必要",
                                en: "A visually similar UI is needed",
                            },
                            avoid: {
                                ja: "app 側で一回限りの CSS を書く",
                                en: "Write one-off CSS in the app",
                            },
                            prefer: {
                                ja: "既存コンポーネントで compose し、足りない責務は本体に戻す",
                                en: "Compose existing components and move missing responsibility into the library",
                            },
                            reason: {
                                ja: "docs / patterns / downstream app で同じ品質を保つため。",
                                en: "This preserves quality across docs, patterns, and downstream apps.",
                            },
                        },
                        {
                            context: {
                                ja: "preview だけ崩れている",
                                en: "Only the preview is broken",
                            },
                            avoid: {
                                ja: "そのページだけ高さや幅を足す",
                                en: "Add page-local width or height",
                            },
                            prefer: {
                                ja: "embed、preview helper、component root のどこで縮んでいるか確認する",
                                en: "Inspect embed, preview helper, and component root sizing",
                            },
                            reason: {
                                ja: "同じ問題が別ページで再発するのを防ぐため。",
                                en: "This prevents the same issue from recurring on other pages.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Ownership", en: "Ownership" },
                    title: { ja: "どこに直すか", en: "Where a fix belongs" },
                    items: [
                        {
                            title: { ja: "再利用される挙動は `src/components`", en: "Reusable behavior belongs in `src/components`" },
                            body: {
                                ja: "tooltip、disabled 理由、overlay の containment、input のフォーカスなど、複数ページで必要なものは GunjoUI 本体で直します。",
                                en: "Tooltip behavior, disabled reasons, overlay containment, and input focus behavior should be fixed in GunjoUI itself when shared.",
                            },
                        },
                        {
                            title: { ja: "表示面の問題は docs helper", en: "Preview-surface problems belong in docs helpers" },
                            body: {
                                ja: "FIT 幅、embed preview、states / variants の wrapper、preview 内 toast などは page-local ではなく docs helper の責務を疑います。",
                                en: "FIT width, embed preview wrappers, states/variants surfaces, and preview-local toast behavior should be checked in docs helpers before page-local fixes.",
                            },
                        },
                        {
                            title: { ja: "情報設計は navigation / docs content", en: "Information architecture belongs in navigation and docs content" },
                            body: {
                                ja: "サイドバー、パンくず、カテゴリ名、overview の内容はコンポーネント本体ではなく、navigation と docs content の設計として扱います。",
                                en: "Sidebar, breadcrumbs, category names, and overview content belong to navigation and docs content, not individual components.",
                            },
                        },
                        {
                            title: { ja: "大きい判断は issue に残す", en: "Track larger decisions in issues" },
                            body: {
                                ja: "カラー再設計、カテゴリ整理、pattern の公開範囲など、1 PR で閉じない判断は issue 化し、暫定対応の範囲を明記します。",
                                en: "Color redesign, category IA, and pattern release scope should be tracked in issues when they cannot be completed in one PR.",
                            },
                        },
                    ],
                    steps: [
                        {
                            title: {
                                ja: "利用箇所が複数あるか確認する",
                                en: "Check whether it appears in multiple places",
                            },
                            body: {
                                ja: "複数ページで必要なら本体コンポーネント、1ページ固有なら docs / pattern 側の composition として扱います。",
                                en: "If multiple pages need it, fix the component. If it is page-specific, treat it as docs or pattern composition.",
                            },
                        },
                        {
                            title: {
                                ja: "SSOT の変更対象か確認する",
                                en: "Check whether the SSOT changes",
                            },
                            body: {
                                ja: "variant、props、export、docs registry に影響する場合は、手作業だけでなく sync / verify の対象にします。",
                                en: "If variants, props, exports, or docs registry are affected, include sync and verify instead of only hand editing.",
                            },
                        },
                        {
                            title: {
                                ja: "分けるべき作業は issue にする",
                                en: "Split larger work into an issue",
                            },
                            body: {
                                ja: "カラー再設計やカテゴリ IA のように広範囲へ波及する作業は、暫定対応と本対応を分けます。",
                                en: "For broad work such as color redesign or category IA, separate temporary handling from the full change.",
                            },
                        },
                    ],
                    checklist: [
                        {
                            title: {
                                ja: "page-local fix で終わっていない",
                                en: "The fix is not only page-local",
                            },
                            body: {
                                ja: "再利用される挙動は `src/components/**`、表示面の共通問題は docs helper に戻しています。",
                                en: "Reusable behavior is handled in `src/components/**`; shared preview issues are handled in docs helpers.",
                            },
                        },
                        {
                            title: {
                                ja: "SSOT と export の影響を確認した",
                                en: "SSOT and export impact was checked",
                            },
                            body: {
                                ja: "コンポーネント本体を触った場合、design sync、generated keys、docs registry、public export を確認しています。",
                                en: "When component source changes, design sync, generated keys, docs registry, and public exports are checked.",
                            },
                        },
                    ],
                },
            ]}
        />
    );
}
