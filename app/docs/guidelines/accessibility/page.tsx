import { GuidelinePage } from "../_GuidelinePage";

export default function AccessibilityGuidelinePage() {
    return (
        <GuidelinePage
            badge={{ ja: "Guidelines", en: "Guidelines" }}
            title={{ ja: "アクセシビリティ", en: "Accessibility" }}
            description={{
                ja: "GunjoUI の UI が、キーボード、支援技術、モバイル実機、低コントラスト環境で破綻しないための確認基準です。",
                en: "Accessibility checks that keep GunjoUI usable with keyboard, assistive technology, mobile devices, and low-contrast environments.",
            }}
            sections={[
                {
                    eyebrow: { ja: "Keyboard", en: "Keyboard" },
                    title: { ja: "キーボードで完結する", en: "Keyboard complete" },
                    items: [
                        {
                            title: { ja: "開閉と選択", en: "Open, close, and select" },
                            body: {
                                ja: "Dialog、Popover、Menu、Combobox、Command は、Tab / Shift+Tab / Enter / Space / Escape / Arrow で自然に操作できる必要があります。",
                                en: "Dialog, Popover, Menu, Combobox, and Command must work naturally with Tab, Shift+Tab, Enter, Space, Escape, and Arrow keys.",
                            },
                        },
                        {
                            title: { ja: "フォーカスを戻す", en: "Return focus" },
                            body: {
                                ja: "オーバーレイを閉じた後は、原則として開いたトリガーへフォーカスを戻します。ユーザーの現在地を奪いません。",
                                en: "After closing an overlay, focus should generally return to the trigger. Do not steal the user's place.",
                            },
                        },
                        {
                            title: { ja: "フォーカスリングを隠さない", en: "Do not hide focus rings" },
                            body: {
                                ja: "見た目のために outline を消す場合は、同等以上に見える focus-visible 表現を用意します。",
                                en: "If visual design removes outline, provide an equally visible focus-visible treatment.",
                            },
                        },
                        {
                            title: { ja: "スクロール領域の中でも操作できる", en: "Work inside scroll areas" },
                            body: {
                                ja: "固定ヘッダー、プレビュー iframe、fake browser、ScrollArea 内でも、フォーカスが見切れず操作できるか確認します。",
                                en: "Verify focus remains visible and operable inside fixed headers, preview iframes, fake browsers, and ScrollArea.",
                            },
                        },
                    ],
                    checklist: [
                        {
                            title: {
                                ja: "キーボードだけで閉じられる",
                                en: "Can close with keyboard only",
                            },
                            body: {
                                ja: "Escape、閉じるボタン、キャンセル操作が keyboard で到達・実行できます。",
                                en: "Escape, close button, and cancel actions are reachable and operable by keyboard.",
                            },
                        },
                        {
                            title: {
                                ja: "フォーカスが見切れない",
                                en: "Focus is not clipped",
                            },
                            body: {
                                ja: "ScrollArea、iframe preview、fake browser、overlay 内で focus ring が親の overflow に負けていません。",
                                en: "Focus rings are not clipped by ScrollArea, iframe preview, fake browser, or overlay containers.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Labels", en: "Labels" },
                    title: { ja: "意味を伝える", en: "Communicate meaning" },
                    items: [
                        {
                            title: { ja: "アイコンだけに依存しない", en: "Do not rely on icons alone" },
                            body: {
                                ja: "アイコンのみ、状態切替、削除、外部タブ、閉じる、コピーなどは tooltip と aria-label の意味を揃えます。",
                                en: "Icon-only, toggle, delete, external-tab, close, and copy controls need aligned tooltip and aria-label text.",
                            },
                        },
                        {
                            title: { ja: "無効理由を説明する", en: "Explain disabled reasons" },
                            body: {
                                ja: "disabled control は、なぜ使えないかを tooltip で説明します。disabled 要素が hover / focus を受けない場合は wrapper を trigger にします。",
                                en: "Disabled controls must explain why. If the disabled element cannot receive hover/focus, make a wrapper the tooltip trigger.",
                            },
                        },
                        {
                            title: { ja: "外部リンクを明示する", en: "Mark external links" },
                            body: {
                                ja: "`target=\"_blank\"` のリンクには外部タブアイコンと支援技術向け補足を付けます。",
                                en: "`target=\"_blank\"` links need an external-tab icon and assistive text.",
                            },
                        },
                        {
                            title: { ja: "状態を色だけで伝えない", en: "Do not use color as the only signal" },
                            body: {
                                ja: "成功、警告、危険、選択、現在地は、文言、アイコン、形、ラベル、aria 属性でも伝えます。",
                                en: "Success, warning, danger, selection, and current location should also be conveyed by copy, icon, shape, label, or ARIA.",
                            },
                        },
                    ],
                    examples: [
                        {
                            context: {
                                ja: "アイコンのみの閉じるボタン",
                                en: "Icon-only close button",
                            },
                            avoid: {
                                ja: "X アイコンだけを置く",
                                en: "Render only an X icon",
                            },
                            prefer: {
                                ja: "aria-label と Tooltip を同じ意味で付ける",
                                en: "Add matching aria-label and Tooltip text",
                            },
                            reason: {
                                ja: "見た目だけでは操作の意味が伝わらないため。",
                                en: "The visual icon alone does not communicate the action.",
                            },
                        },
                        {
                            context: {
                                ja: "無効な共有ボタン",
                                en: "Disabled share button",
                            },
                            avoid: {
                                ja: "グレーアウトだけにする",
                                en: "Only gray it out",
                            },
                            prefer: {
                                ja: "なぜ共有できないか、どうすれば有効になるかを tooltip で伝える",
                                en: "Explain why sharing is unavailable and how to enable it in a tooltip",
                            },
                            reason: {
                                ja: "無効理由は状態ではなく情報として必要なため。",
                                en: "The reason is required information, not merely visual state.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Mobile", en: "Mobile" },
                    title: { ja: "モバイル実機で確認する", en: "Verify on mobile devices" },
                    items: [
                        {
                            title: { ja: "入力でズームさせない", en: "Avoid input focus zoom" },
                            body: {
                                ja: "input / textarea / select / command input は、モバイルで実効 16px 以上にし、フォーカス時のブラウザズームを避けます。",
                                en: "Inputs, textareas, selects, and command inputs need an effective 16px font size on mobile to avoid browser zoom.",
                            },
                        },
                        {
                            title: { ja: "タップ状態を見せる", en: "Show tapped state" },
                            body: {
                                ja: "チャート、リスト、タイムラインなど、タップ対象と tooltip の位置がずれる UI では選択状態やハイライトを表示します。",
                                en: "For charts, lists, and timelines where tooltip position may drift, show selected or highlighted state.",
                            },
                        },
                        {
                            title: { ja: "ツールチップを追従させすぎない", en: "Do not let tooltips follow scroll awkwardly" },
                            body: {
                                ja: "タップで出した tooltip は読み終わるまで残してよいが、スクロール中に不自然についてくる場合は閉じる・再配置する挙動を検討します。",
                                en: "Tap-opened tooltips may persist, but if they awkwardly follow scroll, close or reposition them.",
                            },
                        },
                        {
                            title: { ja: "横スクロールの空状態を読めるようにする", en: "Keep empty states readable in horizontal scroll" },
                            body: {
                                ja: "Table / DataTable の空状態は、狭い幅でもメッセージが読める配置にします。",
                                en: "Table and DataTable empty states must remain readable on narrow widths and horizontal scroll.",
                            },
                        },
                    ],
                    steps: [
                        {
                            title: {
                                ja: "実機で入力にフォーカスする",
                                en: "Focus inputs on a device",
                            },
                            body: {
                                ja: "親ではなく実際の input / textarea / select の computed font-size を確認します。",
                                en: "Check computed font size on the actual input, textarea, or select, not only the parent.",
                            },
                        },
                        {
                            title: {
                                ja: "タップ後の状態を読む",
                                en: "Read the state after tap",
                            },
                            body: {
                                ja: "chart、tooltip、popover、toast が、タップした対象と視覚的に結びついているか確認します。",
                                en: "Verify charts, tooltips, popovers, and toasts remain visually connected to the tapped target.",
                            },
                        },
                        {
                            title: {
                                ja: "スクロール中の挙動を見る",
                                en: "Check behavior while scrolling",
                            },
                            body: {
                                ja: "タップで開いた tooltip や overlay が、スクロール時に画面へ不自然に追従しないか確認します。",
                                en: "Check that tap-opened tooltips or overlays do not follow scroll awkwardly.",
                            },
                        },
                    ],
                },
                {
                    eyebrow: { ja: "Contrast", en: "Contrast" },
                    title: { ja: "読める配色にする", en: "Use readable color pairs" },
                    items: [
                        {
                            title: { ja: "文字を載せる面は subtle を基本にする", en: "Use subtle surfaces for text" },
                            body: {
                                ja: "Alert、Banner、Toast など文字を載せる semantic 面は、`*-subtle` と `*-subtle-foreground` の組み合わせを基本にします。",
                                en: "Semantic text surfaces such as Alert, Banner, and Toast should use `*-subtle` with `*-subtle-foreground`.",
                            },
                        },
                        {
                            title: { ja: "strong は CTA や強い操作に使う", en: "Reserve strong for strong actions" },
                            body: {
                                ja: "`*-strong` は Button や強い CTA のための色です。長文の背景や通知面に不用意に使いません。",
                                en: "`*-strong` is for Button and strong CTA treatment. Avoid using it behind long text or notification surfaces.",
                            },
                        },
                    ],
                    checklist: [
                        {
                            title: {
                                ja: "semantic pair を使っている",
                                en: "Uses semantic pairs",
                            },
                            body: {
                                ja: "Alert / Banner / Toast は `*-subtle` と `*-subtle-foreground` の組み合わせを使い、直値や濃い背景を避けています。",
                                en: "Alert, Banner, and Toast use `*-subtle` with `*-subtle-foreground`, avoiding raw values or strong surfaces.",
                            },
                        },
                        {
                            title: {
                                ja: "色以外でも状態がわかる",
                                en: "State is clear without color",
                            },
                            body: {
                                ja: "アイコン、ラベル、文言、aria 属性で、成功・警告・危険・現在地・選択状態を補っています。",
                                en: "Icons, labels, copy, and ARIA support success, warning, danger, current location, and selection state.",
                            },
                        },
                    ],
                },
            ]}
        />
    );
}
