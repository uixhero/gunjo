import { GuidelinePage } from "../_GuidelinePage";

export default function ComponentUsageGuidelinePage() {
    return (
        <GuidelinePage
            badge={{ ja: "Guidelines", en: "Guidelines" }}
            title={{ ja: "コンポーネント選定", en: "Component Usage" }}
            description={{
                ja: "似ている UI の責務を分け、どのコンポーネントを選ぶべきかを判断するためのガイドです。見た目の近さではなく、ユーザーの目的と状態の持ち方で選びます。",
                en: "A guide for separating responsibilities between similar UI patterns. Choose by user intent and state ownership, not by visual similarity alone.",
            }}
            sections={[
                {
                    eyebrow: { ja: "Actions", en: "Actions" },
                    title: { ja: "操作コンポーネントの選び方", en: "Choosing action components" },
                    body: {
                        ja: "操作は、状態を変えるのか、移動するのか、補足情報を出すのかで選びます。",
                        en: "Choose action components by whether they change state, navigate, or reveal supporting information.",
                    },
                    items: [
                        {
                            title: { ja: "Button", en: "Button" },
                            body: {
                                ja: "保存、送信、削除、検索、開くなど、現在の画面やデータの状態を変える操作に使います。外部ページへの移動を Button に見せかけません。",
                                en: "Use for actions that change the current view or data: save, submit, delete, search, open. Do not disguise navigation as a button.",
                            },
                        },
                        {
                            title: { ja: "TextLink", en: "TextLink" },
                            body: {
                                ja: "別ページ、外部資料、詳細ページへ移動する時に使います。`target=\"_blank\"` には外部タブアイコンと支援技術向けラベルを付けます。",
                                en: "Use for navigation to pages, external resources, or details. `target=\"_blank\"` needs an external-tab icon and assistive label.",
                            },
                        },
                        {
                            title: { ja: "TooltipButton", en: "TooltipButton" },
                            body: {
                                ja: "アイコンだけのボタン、状態切替、危険操作、意味が曖昧な操作には、見た目より先に説明をセットで用意します。",
                                en: "Use for icon-only, toggle, destructive, or ambiguous actions where the explanation is part of the control.",
                            },
                        },
                        {
                            title: { ja: "CopyButton", en: "CopyButton" },
                            body: {
                                ja: "クリップボード操作専用です。コピー対象、成功、失敗、ラベル付き / アイコンのみの違いが preview と code に出る必要があります。",
                                en: "Use only for clipboard actions. The value, success, failure, and label/icon variants must be visible in preview and code.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: {
                                ja: "外部資料を開く",
                                en: "Open an external resource",
                            },
                            avoid: {
                                ja: "Button でリンクのように見せる",
                                en: "Use Button as a link",
                            },
                            prefer: {
                                ja: "TextLink + 外部タブアイコン + 補足ラベル",
                                en: "TextLink with external-tab icon and assistive label",
                            },
                            reason: {
                                ja: "移動はリンク、状態変更はボタンに分けるため。",
                                en: "Navigation and state-changing actions must remain distinct.",
                            },
                        },
                        {
                            context: {
                                ja: "保存できない理由を伝える",
                                en: "Explain why save is unavailable",
                            },
                            avoid: {
                                ja: "disabled の見た目だけにする",
                                en: "Only show a disabled visual state",
                            },
                            prefer: {
                                ja: "disabled control を wrapper に入れ、Tooltip で理由を出す",
                                en: "Wrap the disabled control and show the reason with Tooltip",
                            },
                            reason: {
                                ja: "ユーザーが次に何をすればよいか判断できるため。",
                                en: "Users can understand the next action.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Disclosure", en: "Disclosure" },
                    title: { ja: "情報を一時的に出す UI", en: "Temporary disclosure UI" },
                    items: [
                        {
                            title: { ja: "Tooltip", en: "Tooltip" },
                            body: {
                                ja: "短い説明、disabled 理由、アイコンの意味に使います。中にボタンや選択肢を置くなら Tooltip ではありません。",
                                en: "Use for short explanations, disabled reasons, and icon meanings. If it contains buttons or choices, it is not a tooltip.",
                            },
                        },
                        {
                            title: { ja: "Popover", en: "Popover" },
                            body: {
                                ja: "補足情報、軽い選択、短い設定に使います。選択した結果があるなら、トリガーや周辺表示にも反映します。",
                                en: "Use for supporting information, light choices, or short settings. If a choice is made, reflect it on the trigger or nearby state.",
                            },
                        },
                        {
                            title: { ja: "DropdownMenu", en: "DropdownMenu" },
                            body: {
                                ja: "コマンドのリストに使います。情報カードや長い説明を入れるなら Popover や Dialog を検討します。",
                                en: "Use for command lists. If content needs rich descriptions or card-like information, consider Popover or Dialog.",
                            },
                        },
                        {
                            title: { ja: "HoverCard", en: "HoverCard" },
                            body: {
                                ja: "リンク先や人物、ファイルなどの概要を見せる用途です。タッチ端末ではタップで開く導線と閉じ方を確認します。",
                                en: "Use for previews of links, people, or files. On touch devices, verify tap-to-open and close behavior.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: {
                                ja: "アイコンの意味だけを説明する",
                                en: "Explain an icon",
                            },
                            avoid: {
                                ja: "Popover にボタンや状態を入れる",
                                en: "Use Popover with buttons and state",
                            },
                            prefer: {
                                ja: "Tooltip で短く説明する",
                                en: "Use Tooltip for a short explanation",
                            },
                            reason: {
                                ja: "操作を含まない短い補足だから。",
                                en: "It is short supporting copy with no interaction.",
                            },
                        },
                        {
                            context: {
                                ja: "軽い設定をその場で変える",
                                en: "Change a light setting inline",
                            },
                            avoid: {
                                ja: "DropdownMenu に説明文とフォームを詰める",
                                en: "Pack explanatory text and fields into DropdownMenu",
                            },
                            prefer: {
                                ja: "Popover で状態を持ち、選択結果をトリガーに反映する",
                                en: "Use Popover with state and reflect selection on the trigger",
                            },
                            reason: {
                                ja: "情報と選択を同じ小さな面で扱うため。",
                                en: "It combines supporting information and a small choice.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Overlays", en: "Overlays" },
                    title: { ja: "画面の上に出す UI", en: "UI that sits over the page" },
                    items: [
                        {
                            title: { ja: "Dialog / AlertDialog", en: "Dialog / AlertDialog" },
                            body: {
                                ja: "短いフォームや確認に使います。削除など取り消せない操作は、操作前に AlertDialog で確認します。",
                                en: "Use for short forms and confirmations. Destructive or irreversible actions should confirm before the action with AlertDialog.",
                            },
                        },
                        {
                            title: { ja: "Drawer / Sheet", en: "Drawer / Sheet" },
                            body: {
                                ja: "現在の画面文脈を残したまま、補助操作や詳細設定を出す時に使います。Dialog と同じ内容を横から出すだけにしません。",
                                en: "Use when the current page context should remain visible while showing supporting tasks or settings. Do not use it as a sideways Dialog clone.",
                            },
                        },
                        {
                            title: { ja: "Modal", en: "Modal" },
                            body: {
                                ja: "複数ステップ、タブ、広い本文など、Dialog より構成が大きいブロックに使います。小さな確認だけなら AlertDialog に寄せます。",
                                en: "Use for larger blocks such as multi-step flows, tabs, or broad content. Simple confirmation belongs in AlertDialog.",
                            },
                        },
                        {
                            title: { ja: "MediaLightbox / MediaPickerDialog", en: "MediaLightbox / MediaPickerDialog" },
                            body: {
                                ja: "メディア閲覧と選択は分けます。閲覧は画像中心、選択は一覧・状態・確定操作を中心に設計します。",
                                en: "Separate viewing from picking. Viewing centers media; picking centers lists, state, and confirmation.",
                            },
                        },
                    ],
                    checklist: [
                        {
                            title: {
                                ja: "開く理由が明確",
                                en: "The reason to open it is clear",
                            },
                            body: {
                                ja: "Dialog、Drawer、Sheet、Modal のどれを使うかを、サイズではなく文脈保持・作業量・確認の強さで選んでいます。",
                                en: "Dialog, Drawer, Sheet, and Modal are chosen by context retention, task size, and confirmation strength, not just size.",
                            },
                        },
                        {
                            title: {
                                ja: "閉じ方とフォーカス復帰を確認した",
                                en: "Close behavior and focus return are verified",
                            },
                            body: {
                                ja: "Escape、閉じるボタン、外側クリック、保存後の挙動、フォーカス復帰を確認しています。",
                                en: "Escape, close button, outside click, post-save behavior, and focus return are checked.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Data", en: "Data" },
                    title: { ja: "データ表示の選び方", en: "Choosing data display" },
                    items: [
                        {
                            title: { ja: "Table と DataTable", en: "Table and DataTable" },
                            body: {
                                ja: "静的な比較は Table。検索、並び替え、ページング、選択、行アクションが必要なら DataTable を使います。",
                                en: "Use Table for static comparison. Use DataTable when search, sort, pagination, selection, or row actions are needed.",
                            },
                        },
                        {
                            title: { ja: "List / MetadataList / Timeline", en: "List / MetadataList / Timeline" },
                            body: {
                                ja: "同質の項目は List、属性の集合は MetadataList、時系列の進行や履歴は Timeline に分けます。",
                                en: "Use List for homogeneous items, MetadataList for attributes, and Timeline for progress or history over time.",
                            },
                        },
                        {
                            title: { ja: "Chart と Statistic", en: "Chart and Statistic" },
                            body: {
                                ja: "単一の現在値は Statistic。比較、推移、構成比、分布を読むなら chart を選び、データ定義を code に含めます。",
                                en: "Use Statistic for a single current value. Use charts for comparison, trend, composition, or distribution, and include the data definition in code.",
                            },
                        },
                        {
                            title: { ja: "Card", en: "Card" },
                            body: {
                                ja: "ひとまとまりの情報や操作を区切る時に使います。ページセクション全体をカード化したり、カードの中にカードを重ねたりしません。",
                                en: "Use Card to group one coherent item or action. Do not turn whole page sections into cards or nest cards inside cards.",
                            },
                        },
                    ],
                    steps: [
                        {
                            title: {
                                ja: "対象が単一値か集合かを分ける",
                                en: "Separate single values from collections",
                            },
                            body: {
                                ja: "単一の現在値は Statistic、項目集合は List、属性集合は MetadataList、行列は Table / DataTable にします。",
                                en: "Single current values use Statistic, item collections use List, attributes use MetadataList, and matrices use Table/DataTable.",
                            },
                        },
                        {
                            title: {
                                ja: "操作があるか確認する",
                                en: "Check whether interaction is needed",
                            },
                            body: {
                                ja: "検索、並び替え、選択、ページング、行アクションがあるなら DataTable を選びます。",
                                en: "Use DataTable when search, sorting, selection, pagination, or row actions are needed.",
                            },
                        },
                        {
                            title: {
                                ja: "コピー可能なデータを含める",
                                en: "Include copyable data",
                            },
                            body: {
                                ja: "docs では、表示している配列や値が code に含まれているか確認します。",
                                en: "In docs, verify that arrays and values shown in preview are included in code.",
                            },
                        },
                    ],
                },
            ]}
        />
    );
}
