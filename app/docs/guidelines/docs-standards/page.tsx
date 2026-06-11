import { GuidelinePage } from "../_GuidelinePage";

export default function DocsStandardsGuidelinePage() {
    return (
        <GuidelinePage
            badge={{ ja: "Guidelines", en: "Guidelines" }}
            title={{ ja: "ドキュメント基準", en: "Docs Standards" }}
            description={{
                ja: "コンポーネント docs を作る時に毎回確認する、preview、code、SSOT、言語、モバイル表示の基準です。",
                en: "Standards for component docs: preview, code, SSOT, language, and mobile behavior.",
            }}
            sections={[
                {
                    eyebrow: { ja: "Template", en: "Template" },
                    title: { ja: "ページ構成を揃える", en: "Keep page structure consistent" },
                    items: [
                        {
                            title: { ja: "docs preview", en: "Docs preview" },
                            body: {
                                ja: "ページ上部の preview は、そのコンポーネントの標準利用を示します。コンパクトすぎる幅や、実利用と違うデータで見せません。",
                                en: "The top preview should show the standard use of the component. Avoid overly compact widths or data that does not match real use.",
                            },
                        },
                        {
                            title: { ja: "状態とバリエーション", en: "States and variants" },
                            body: {
                                ja: "1項目ずつタイトル、説明、preview、code を持たせます。横並びで詰めたり、タイトルだけの列に戻したりしません。",
                                en: "Each item needs title, description, preview, and code. Do not compress them into ambiguous side-by-side blocks or title-only lists.",
                            },
                        },
                        {
                            title: { ja: "プロパティ / 使い方", en: "Props and usage" },
                            body: {
                                ja: "props は型だけでなく、何に使うか、初期値、注意点が伝わるようにします。使い方では責務と使い分けを説明します。",
                                en: "Props should communicate purpose, defaults, and cautions. Usage should explain responsibility and when to choose the component.",
                            },
                        },
                        {
                            title: { ja: "使用コンポーネント / 関連コンポーネント", en: "Used and related components" },
                            body: {
                                ja: "そのページで compose している GunjoUI コンポーネントと、迷いやすい近いコンポーネントを明示します。",
                                en: "Show which GunjoUI components are composed and which nearby components users may confuse it with.",
                            },
                        },
                    ],
                    steps: [
                        {
                            title: {
                                ja: "ページ上部で標準利用を見せる",
                                en: "Show standard usage at the top",
                            },
                            body: {
                                ja: "docs preview は、そのコンポーネントを初めて見る人が用途を理解できる標準例にします。",
                                en: "The top docs preview should be the standard example that explains the component's purpose.",
                            },
                        },
                        {
                            title: {
                                ja: "状態とバリエーションで例外を分ける",
                                en: "Split exceptions into states and variants",
                            },
                            body: {
                                ja: "empty、disabled、loading、mobile、compact、danger など、標準例に詰め込まない状態を個別に見せます。",
                                en: "Show empty, disabled, loading, mobile, compact, danger, and other non-default states separately.",
                            },
                        },
                        {
                            title: {
                                ja: "使い分けを本文で説明する",
                                en: "Explain selection rules in the body",
                            },
                            body: {
                                ja: "似たコンポーネントとの違い、どこまでが責務か、上位コンポーネントへ任せる範囲を明記します。",
                                en: "Explain differences from nearby components, responsibility boundaries, and what belongs to parent components.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Preview", en: "Preview" },
                    title: { ja: "docs preview を独立して確認する", en: "Verify docs preview independently" },
                    items: [
                        {
                            title: { ja: "embed と本文 preview は別物", en: "Embed and in-page previews are separate" },
                            body: {
                                ja: "上部の `/embed/<slug>` と本文内の states / variants は別の表示面です。片方が正しくても、もう片方の幅・高さ・overflow が正しいとは限りません。",
                                en: "The top `/embed/<slug>` and in-page states/variants are different surfaces. Passing one does not prove width, height, or overflow in the other.",
                            },
                        },
                        {
                            title: { ja: "FIT 幅を中身まで確認する", en: "Check FIT width inside the content" },
                            body: {
                                ja: "外側の iframe ではなく、preview 内の wrapper、直接の子、component root が意図した幅で広がっているか確認します。",
                                en: "Check the preview wrapper, direct child, and component root, not only the outer iframe.",
                            },
                        },
                        {
                            title: { ja: "高さで overlay を逃がさない", en: "Do not solve overlay clipping with height" },
                            body: {
                                ja: "Popover、Tooltip、Dropdown、Dialog が見切れる時は、overflow、portal、collision、container を確認します。固定高さ追加は最後の選択です。",
                                en: "When Popover, Tooltip, Dropdown, or Dialog clips, inspect overflow, portal, collision, and container behavior. Fixed height is a last resort.",
                            },
                        },
                        {
                            title: { ja: "preview 内で完結させる", en: "Keep examples inside the preview" },
                            body: {
                                ja: "モーダルやトーストなどは、ページ全体ではなく preview 内の体験として表示します。ユーザーがコンポーネントの一部と誤解しないようにします。",
                                en: "Modals and toasts should be scoped to the preview experience, not the entire docs page, so users do not mistake docs scaffolding for the component.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: {
                                ja: "Dropdown が見切れる",
                                en: "Dropdown is clipped",
                            },
                            avoid: {
                                ja: "preview に固定高さを足す",
                                en: "Add fixed preview height",
                            },
                            prefer: {
                                ja: "portal、collision、overflow、container を確認する",
                                en: "Inspect portal, collision, overflow, and container behavior",
                            },
                            reason: {
                                ja: "高さで逃げると別 preview で同じ問題が再発するため。",
                                en: "Height workarounds cause the same issue to recur in other previews.",
                            },
                        },
                        {
                            context: {
                                ja: "FIT が中身幅に合わない",
                                en: "FIT does not match content width",
                            },
                            avoid: {
                                ja: "個別 demo の `max-w-*` だけを触る",
                                en: "Only edit local demo `max-w-*` classes",
                            },
                            prefer: {
                                ja: "embed wrapper、direct child、component root の幅を確認する",
                                en: "Check embed wrapper, direct child, and component root width",
                            },
                            reason: {
                                ja: "docs preview と states preview は別の表示面だから。",
                                en: "Docs preview and states preview are separate surfaces.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Code", en: "Code" },
                    title: { ja: "コピーして使えるコードにする", en: "Make copied code usable" },
                    items: [
                        {
                            title: { ja: "表示データをコードに含める", en: "Include displayed data" },
                            body: {
                                ja: "チャート、テーブル、カード、リストは、preview に出ている値や配列を code に含めます。データがないコードは再利用できません。",
                                en: "Charts, tables, cards, and lists must include the values or arrays shown in preview. Code without data is not reusable.",
                            },
                        },
                        {
                            title: { ja: "状態変更を反映する", en: "Reflect state changes" },
                            body: {
                                ja: "シナリオ、入力、トグル、選択で preview が変わるなら、code もその状態管理を示します。",
                                en: "If scenarios, inputs, toggles, or selection change the preview, code should show that state handling.",
                            },
                        },
                        {
                            title: { ja: "disabled 理由や tooltip も含める", en: "Include disabled reasons and tooltips" },
                            body: {
                                ja: "UX に関わる補足説明は見た目の飾りではありません。tooltip、aria-label、エラー文言も code に含めます。",
                                en: "UX explanations are not decoration. Include tooltips, aria-labels, and error copy in code.",
                            },
                        },
                        {
                            title: { ja: "内部 demo だけで成立させない", en: "Do not depend on hidden demo state" },
                            body: {
                                ja: "docs 専用の隠れたデータや helper に依存しすぎると、コピーした利用者が再現できません。",
                                en: "If code depends on hidden docs-only data or helpers, copied usage cannot reproduce it.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: {
                                ja: "チャートの preview",
                                en: "Chart preview",
                            },
                            avoid: {
                                ja: "`<Chart />` だけのコード例",
                                en: "Code example with only `<Chart />`",
                            },
                            prefer: {
                                ja: "表示している data、legend、tooltip、state を含める",
                                en: "Include displayed data, legend, tooltip, and state",
                            },
                            reason: {
                                ja: "数値を変えられないコードはコピーしても使えないため。",
                                en: "Code is not reusable if users cannot change the displayed values.",
                            },
                        },
                        {
                            context: {
                                ja: "削除アクションの preview",
                                en: "Delete action preview",
                            },
                            avoid: {
                                ja: "クリック後に削除済み toast だけ出す",
                                en: "Only show a deleted toast after click",
                            },
                            prefer: {
                                ja: "操作前の AlertDialog と danger action を code に含める",
                                en: "Include pre-action AlertDialog and danger action in code",
                            },
                            reason: {
                                ja: "取り消せない操作は、消す前の確認が UX の一部だから。",
                                en: "For irreversible actions, pre-action confirmation is part of the UX.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Review", en: "Review" },
                    title: { ja: "完了前の確認", en: "Before calling it done" },
                    items: [
                        {
                            title: { ja: "日本語と英語の混在", en: "Mixed language" },
                            body: {
                                ja: "title、description、preview、code、tooltip、toast、empty state を locale ごとに確認します。",
                                en: "Check title, description, preview, code, tooltip, toast, and empty state per locale.",
                            },
                        },
                        {
                            title: { ja: "スマホ実機", en: "Mobile device" },
                            body: {
                                ja: "折り返し、横スクロール、input focus、overlay、toast、tooltip、チャート tooltip はスマホ実機で確認します。",
                                en: "Verify wrapping, horizontal scroll, input focus, overlays, toast, tooltip, and chart tooltip on a mobile device.",
                            },
                        },
                        {
                            title: { ja: "SSOT と export", en: "SSOT and export" },
                            body: {
                                ja: "`src/components/**` を変更したら、SSOT、generated variant keys、docs registry、public export の同期対象として扱います。",
                                en: "Changes under `src/components/**` are SSOT, generated variant key, docs registry, and public export concerns.",
                            },
                        },
                        {
                            title: { ja: "検証コマンド", en: "Verification commands" },
                            body: {
                                ja: "`design:verify`、`docs:audit:components`、`type-check`、`git diff --check` を変更範囲に応じて通します。",
                                en: "Run `design:verify`, `docs:audit:components`, `type-check`, and `git diff --check` as appropriate for the change.",
                            },
                        },
                    ],
                    checklist: [
                        {
                            title: {
                                ja: "上部 preview と states preview を別々に見た",
                                en: "Top preview and states preview were checked separately",
                            },
                            body: {
                                ja: "`/embed/<slug>` と本文内 preview の両方で、幅、高さ、overflow、overlay の出方を確認しています。",
                                en: "`/embed/<slug>` and in-page previews were checked for width, height, overflow, and overlay behavior.",
                            },
                        },
                        {
                            title: {
                                ja: "code が preview を再現できる",
                                en: "Code can reproduce the preview",
                            },
                            body: {
                                ja: "表示データ、状態、aria-label、tooltip、toast、disabled 理由が code に含まれています。",
                                en: "Displayed data, state, aria-labels, tooltips, toasts, and disabled reasons are present in code.",
                            },
                        },
                        {
                            title: {
                                ja: "ローカルな逃げ道で直していない",
                                en: "No local workaround hides the issue",
                            },
                            body: {
                                ja: "固定高さ、固定幅、隠し overflow で見た目だけを成立させていないか確認しています。",
                                en: "Fixed height, fixed width, or hidden overflow are not used only to make the visual pass.",
                            },
                        },
                        {
                            title: {
                                ja: "日英とスマホ実機を確認した",
                                en: "Locales and mobile were checked",
                            },
                            body: {
                                ja: "日本語と英語、スマホ実機、タブレット幅、長い文字列、ツールチップの見切れを確認しています。",
                                en: "Japanese, English, mobile device, tablet width, long labels, and tooltip clipping were checked.",
                            },
                        },
                    ],
                },
            ]}
        />
    );
}
