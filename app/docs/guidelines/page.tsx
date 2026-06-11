import { GuidelinePage } from "./_GuidelinePage";

export default function GuidelinesOverviewPage() {
    return (
        <GuidelinePage
            badge={{ ja: "Guidelines", en: "Guidelines" }}
            title={{ ja: "ガイドライン概要", en: "Guidelines Overview" }}
            description={{
                ja: "GunjoUI を使う時、作る時、docs に残す時の判断基準をまとめます。はじめにが導入の入口なら、ガイドラインは実装とレビューの基準です。",
                en: "Decision rules for using, building, and documenting GunjoUI. Introduction is the adoption entry point; guidelines are the implementation and review criteria.",
            }}
            sections={[
                {
                    eyebrow: { ja: "Information architecture", en: "Information architecture" },
                    title: {
                        ja: "はじめにとガイドラインの分担",
                        en: "How introduction and guidelines differ",
                    },
                    body: {
                        ja: "近い内容に見えますが、読む目的を分けます。はじめには GunjoUI を理解して採用するための入口、ガイドラインは日々の実装判断を揃えるための基準です。",
                        en: "They are related, but they serve different reading goals. Introduction helps people understand and adopt GunjoUI; guidelines align everyday implementation decisions.",
                    },
                    items: [
                        {
                            title: { ja: "はじめに", en: "Introduction" },
                            body: {
                                ja: "プロジェクト概要、導入、AI 連携、採用ガイド、移行手順、依存関係、変更履歴など、使い始めるための情報を置きます。",
                                en: "Project overview, adoption, AI handoff, migration, dependencies, changelog, and other entry material belong there.",
                            },
                        },
                        {
                            title: { ja: "ガイドライン", en: "Guidelines" },
                            body: {
                                ja: "コンポーネント選定、文言、アクセシビリティ、docs preview、SSOT、レビュー時の確認など、品質判断に使う基準を置きます。",
                                en: "Component choice, writing, accessibility, docs preview, SSOT, and review criteria belong here.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: { ja: "新しく使い始める人", en: "New adopter" },
                            avoid: {
                                ja: "ガイドラインから読み始める",
                                en: "Start from guidelines",
                            },
                            prefer: {
                                ja: "はじめに、導入、テーマ、採用ガイドを読む",
                                en: "Read Introduction, Installation, Theming, and Adoption Guide",
                            },
                            reason: {
                                ja: "先に前提と導入手順を揃える必要があるため。",
                                en: "They need context and setup before decision rules.",
                            },
                        },
                        {
                            context: { ja: "実装で迷っている人", en: "Implementer deciding UI" },
                            avoid: {
                                ja: "近い見た目を app 側で作る",
                                en: "Build a local visual lookalike",
                            },
                            prefer: {
                                ja: "ガイドラインで責務を確認し、既存コンポーネントを compose する",
                                en: "Use guidelines to choose responsibility and compose existing components",
                            },
                            reason: {
                                ja: "GunjoUI と docs の品質を同じ基準で保つため。",
                                en: "This keeps GunjoUI and docs quality aligned.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Decision flow", en: "Decision flow" },
                    title: {
                        ja: "判断の順番",
                        en: "Decision order",
                    },
                    body: {
                        ja: "迷った時は、見た目の近さではなく、責務・再利用範囲・検証可能性の順に判断します。",
                        en: "When in doubt, decide by responsibility, reuse scope, and verifiability rather than visual similarity.",
                    },
                    items: [
                        {
                            title: { ja: "1. 既存コンポーネントで表現できるか", en: "1. Can an existing component express it?" },
                            body: {
                                ja: "`@gunjo/ui` 本体、近い docs、patterns の利用例を確認します。既存で成立するなら compose して使います。",
                                en: "Check `@gunjo/ui`, nearby docs, and pattern examples. Compose existing components when possible.",
                            },
                        },
                        {
                            title: { ja: "2. 本体に戻すべき挙動か", en: "2. Should the behavior move into the component?" },
                            body: {
                                ja: "tooltip、disabled 理由、overlay containment、mobile input など複数箇所で必要な挙動は本体で直します。",
                                en: "Shared behavior such as tooltips, disabled reasons, overlay containment, and mobile input focus belongs in the component layer.",
                            },
                        },
                        {
                            title: { ja: "3. SSOT と同期できているか", en: "3. Is it aligned with the SSOT?" },
                            body: {
                                ja: "variant、docs registry、export、design sync の対象かを確認します。手で見た目だけ増やして終わりにしません。",
                                en: "Check variants, docs registry, exports, and design sync. Do not add only local visual styling.",
                            },
                        },
                        {
                            title: { ja: "4. preview と code が同じことを伝えるか", en: "4. Do preview and code describe the same thing?" },
                            body: {
                                ja: "表示データ、状態変更、ツールチップ、トースト、エラー、空状態まで、コピーして再現できるコードにします。",
                                en: "Displayed data, state changes, tooltips, toasts, errors, and empty states should be reproducible from copied code.",
                            },
                        },
                    ],
                    steps: [
                        {
                            title: {
                                ja: "目的を分類する",
                                en: "Classify the purpose",
                            },
                            body: {
                                ja: "導入情報なのか、実装判断なのか、ユーザー向け文言なのか、検証基準なのかを先に分けます。",
                                en: "First decide whether the content is adoption info, implementation decision, user-facing copy, or verification criteria.",
                            },
                        },
                        {
                            title: {
                                ja: "責務のあるページへ置く",
                                en: "Place it in the responsible page",
                            },
                            body: {
                                ja: "導入ははじめに、判断は設計思想、選定はコンポーネント選定、表示文言は文言設計へ寄せます。",
                                en: "Adoption goes to Introduction, decisions to Principles, selection to Component Usage, and visible copy to Voice & Tone.",
                            },
                        },
                        {
                            title: {
                                ja: "ページ内で使える形まで具体化する",
                                en: "Make it actionable on the page",
                            },
                            body: {
                                ja: "抽象論で終わらせず、判断例、チェックリスト、コードや preview の確認観点まで落とします。",
                                en: "Do not stop at abstract guidance. Include examples, checklists, and code/preview verification points.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Guide map", en: "Guide map" },
                    title: {
                        ja: "各ページの役割",
                        en: "What each guide covers",
                    },
                    items: [
                        {
                            title: { ja: "設計思想", en: "Design Principles" },
                            body: {
                                ja: "GunjoUI 全体の優先順位、SSOT、どこに直すか、issue に分ける判断を扱います。",
                                en: "Priority order, SSOT, where fixes belong, and when to split work into issues.",
                            },
                        },
                        {
                            title: { ja: "コンポーネント選定", en: "Component Usage" },
                            body: {
                                ja: "似ているコンポーネントの責務を分け、Button / Link / Dialog / Drawer / Tooltip などを選ぶ基準を扱います。",
                                en: "Responsibility boundaries for similar components such as Button, Link, Dialog, Drawer, and Tooltip.",
                            },
                        },
                        {
                            title: { ja: "アクセシビリティ", en: "Accessibility" },
                            body: {
                                ja: "キーボード、フォーカス、支援技術、モバイル実機、コントラスト、状態伝達の確認基準を扱います。",
                                en: "Keyboard, focus, assistive technology, mobile, contrast, and state communication criteria.",
                            },
                        },
                        {
                            title: { ja: "ドキュメント基準", en: "Docs Standards" },
                            body: {
                                ja: "docs preview、状態とバリエーション、コード例、SSOT、言語、検証コマンドの基準を扱います。",
                                en: "Docs preview, states and variants, code examples, SSOT, language, and verification standards.",
                            },
                        },
                        {
                            title: { ja: "文言設計", en: "Voice & Tone" },
                            body: {
                                ja: "操作文言、エラー、空状態、無効化、日英の粒度、画像代替テキストなど、実際に画面へ出る言葉を扱います。",
                                en: "User-facing copy for actions, errors, empty states, disabled states, locale parity, and image alt text.",
                            },
                        },
                    ],
                    checklist: [
                        {
                            title: {
                                ja: "読み手が次に読むページを判断できる",
                                en: "Readers can choose the next page",
                            },
                            body: {
                                ja: "概要だけ読んでも、導入・設計思想・文言・docs 基準のどこへ進むべきか分かる状態にします。",
                                en: "After the overview, readers should know whether to open adoption, principles, writing, or docs standards.",
                            },
                        },
                        {
                            title: {
                                ja: "各ページが説明だけで終わっていない",
                                en: "Each page goes beyond explanation",
                            },
                            body: {
                                ja: "判断フロー、判断例、確認チェックのいずれかを持ち、レビュー時に参照できる形にします。",
                                en: "Each page should include a flow, examples, or checklist that is useful during review.",
                            },
                        },
                    ],
                },
            ]}
        />
    );
}
