"use client";

import Link from "next/link";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
} from "@gunjo/ui";
import {
    IconAlertTriangle as TriangleAlert,
    IconArrowRight as ArrowRight,
    IconBell as Bell,
    IconCircleCheck as BadgeCheck,
    IconColumns3 as Columns3,
    IconCompass as Compass,
    IconLayoutNavbar as LayoutPanelTop,
    IconListCheck as ListChecks,
    IconStack2 as Layers3,
} from "@tabler/icons-react";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { navigation } from "@/lib/navigation";

type CategoryName = "Feedback" | "Navigation" | "Overlay" | "Layout";

type LocalizedText = {
    ja: string;
    en: string;
};

type OverviewLink = {
    title: LocalizedText;
    description: LocalizedText;
    href: string;
};

type CategoryCopy = {
    title: LocalizedText;
    eyebrow: LocalizedText;
    description: LocalizedText;
    badge: LocalizedText;
    scopeTitle: LocalizedText;
    scope: LocalizedText;
    ruleTitle: LocalizedText;
    rules: LocalizedText[];
    decisionTitle: LocalizedText;
    decisions: LocalizedText[];
    startTitle: LocalizedText;
    startDescription: LocalizedText;
    startItems: OverviewLink[];
    avoidTitle: LocalizedText;
    avoidDescription: LocalizedText;
    avoids: LocalizedText[];
    patternTitle: LocalizedText;
    patternDescription: LocalizedText;
    icon: typeof Bell;
};

const categoryCopy: Record<CategoryName, CategoryCopy> = {
    Feedback: {
        title: { ja: "フィードバックの概要", en: "Feedback Overview" },
        eyebrow: { ja: "フィードバック", en: "Feedback" },
        description: {
            ja: "処理結果、進行状況、注意、完了をユーザーへ返すためのコンポーネント群です。通知の強さ、表示時間、操作を求めるかどうかで使い分けます。",
            en: "Feedback components communicate results, progress, attention, and completion. Choose by urgency, duration, and whether the user must act.",
        },
        badge: { ja: "カテゴリ概要", en: "Category overview" },
        scopeTitle: { ja: "このカテゴリの責務", en: "Category responsibility" },
        scope: {
            ja: "ページや操作の結果を、ユーザーが次に判断できる粒度で返します。永続表示、短時間表示、進行中表示を混ぜずに選びます。",
            en: "Return results at a level that helps the user decide what to do next. Keep persistent, temporary, and in-progress feedback distinct.",
        },
        ruleTitle: { ja: "フィードバック系の共通ルール", en: "Shared feedback rules" },
        rules: [
            {
                ja: "状態色だけで意味を伝えず、タイトルや説明で何が起きたかを明示します。",
                en: "Do not rely on status color alone. Pair it with clear titles and descriptions.",
            },
            {
                ja: "操作できない状態や失敗時は、理由と次の行動を近くに置きます。",
                en: "When something is unavailable or failed, place the reason and next action nearby.",
            },
        ],
        decisionTitle: { ja: "迷いやすい使い分け", en: "Decision points" },
        decisions: [
            {
                ja: "ページ内に残す注意は Alert、画面上部の横長通知は Banner、短時間の完了通知は Toast を使います。",
                en: "Use Alert for inline persistent messages, Banner for page-wide notices, and Toast for short-lived confirmations.",
            },
            {
                ja: "単純な進捗は Progress、進捗に状態や操作が伴う場合は ProgressWidget を使います。",
                en: "Use Progress for simple completion values and ProgressWidget when status and actions travel with the progress.",
            },
        ],
        startTitle: { ja: "最初に確認するページ", en: "Start with these" },
        startDescription: {
            ja: "通知の強さと表示時間を決める時に、まず確認するコンポーネントです。",
            en: "Start here when deciding feedback strength and how long it should remain visible.",
        },
        startItems: [
            {
                title: { ja: "アラート", en: "Alert" },
                description: {
                    ja: "ページ内に残す注意、成功、失敗、補足を表示します。",
                    en: "Persistent inline messages for warnings, success, errors, and context.",
                },
                href: "/docs/components/alert",
            },
            {
                title: { ja: "トースト", en: "Toast" },
                description: {
                    ja: "操作直後の短い完了通知や軽い失敗通知に使います。",
                    en: "Short-lived confirmations and lightweight failure feedback after an action.",
                },
                href: "/docs/components/toast",
            },
            {
                title: { ja: "進捗ウィジェット", en: "ProgressWidget" },
                description: {
                    ja: "処理中の説明、完了、失敗、再試行の導線をまとめます。",
                    en: "Combines progress, state text, completion, failure, and retry actions.",
                },
                href: "/docs/components/progress-widget",
            },
        ],
        avoidTitle: { ja: "避ける使い方", en: "Avoid" },
        avoidDescription: {
            ja: "フィードバックは目立たせるだけでなく、次に何をすべきかを伝える必要があります。",
            en: "Feedback should not only stand out. It needs to explain what happened and what to do next.",
        },
        avoids: [
            {
                ja: "色だけで成功、警告、失敗を伝える。",
                en: "Communicating success, warning, or failure by color alone.",
            },
            {
                ja: "破壊的な操作や復旧不能な操作を Toast だけで済ませる。",
                en: "Using only a Toast for destructive or irreversible actions.",
            },
            {
                ja: "処理中の残り作業や失敗理由を、進捗バーから切り離して遠くに置く。",
                en: "Separating remaining work or failure reasons far from the progress indicator.",
            },
        ],
        patternTitle: { ja: "パターンで確認する場面", en: "Where patterns validate it" },
        patternDescription: {
            ja: "フォーム送信、メディア操作、チャット、管理画面など、複数コンポーネントを組み合わせた場面で通知の強さと位置を確認します。",
            en: "Patterns validate feedback strength and placement across forms, media operations, chat, and admin workflows.",
        },
        icon: Bell,
    },
    Navigation: {
        title: { ja: "ナビゲーションの概要", en: "Navigation Overview" },
        eyebrow: { ja: "ナビゲーション", en: "Navigation" },
        description: {
            ja: "ページ移動、階層、現在地、前後関係、主要導線を扱うコンポーネント群です。移動先の範囲と、ユーザーが今どこにいるかを示す必要性で選びます。",
            en: "Navigation components handle movement, hierarchy, location, sequence, and primary routes. Choose by destination scope and how much orientation the user needs.",
        },
        badge: { ja: "カテゴリ概要", en: "Category overview" },
        scopeTitle: { ja: "このカテゴリの責務", en: "Category responsibility" },
        scope: {
            ja: "画面、階層、ページ内の位置、前後関係を整理し、ユーザーが迷わず移動できるようにします。",
            en: "Organize screens, hierarchy, in-page location, and sequence so users can move without losing context.",
        },
        ruleTitle: { ja: "ナビゲーション系の共通ルール", en: "Shared navigation rules" },
        rules: [
            {
                ja: "現在地、移動先、無効な移動理由を見た目だけでなくテキストや aria 属性でも伝えます。",
                en: "Expose current location, destinations, and disabled movement reasons through text and ARIA, not styling alone.",
            },
            {
                ja: "プレビュー内のリンクは意図しないページ遷移を起こさず、遷移確認のフィードバックを返します。",
                en: "Preview links should avoid accidental page navigation and return confirmation feedback instead.",
            },
        ],
        decisionTitle: { ja: "迷いやすい使い分け", en: "Decision points" },
        decisions: [
            {
                ja: "階層の現在地は Breadcrumb、横断的なページ移動は NavigationMenu、補助的な前後移動は DocumentPager を使います。",
                en: "Use Breadcrumb for hierarchy, NavigationMenu for cross-page routes, and DocumentPager for previous/next movement.",
            },
            {
                ja: "アプリ全体の領域移動は AppRail や Sidebar、ページ内の視点切り替えは Tabs を使います。",
                en: "Use AppRail or Sidebar for application sections, and Tabs for switching views inside the current page.",
            },
        ],
        startTitle: { ja: "最初に確認するページ", en: "Start with these" },
        startDescription: {
            ja: "どの範囲を移動させるのかで、最初に見るページが変わります。",
            en: "Start from the component that matches the scope of movement.",
        },
        startItems: [
            {
                title: { ja: "パンくず", en: "Breadcrumb" },
                description: {
                    ja: "階層の現在地と、上位ページへ戻る導線を示します。",
                    en: "Shows hierarchy and a route back to parent pages.",
                },
                href: "/docs/components/breadcrumb",
            },
            {
                title: { ja: "サイドバー", en: "Sidebar" },
                description: {
                    ja: "アプリやドキュメントの主要カテゴリを、常時見える領域として配置します。",
                    en: "Persistent navigation for primary application or documentation sections.",
                },
                href: "/docs/components/sidebar",
            },
            {
                title: { ja: "コマンドパレット", en: "CommandPalette" },
                description: {
                    ja: "移動と操作を検索から実行できる補助導線です。",
                    en: "Search-driven access to navigation and actions.",
                },
                href: "/docs/components/command-palette",
            },
        ],
        avoidTitle: { ja: "避ける使い方", en: "Avoid" },
        avoidDescription: {
            ja: "ナビゲーションは移動できることだけでなく、現在地と戻り方を失わないことが重要です。",
            en: "Navigation needs to preserve location and recovery paths, not only provide links.",
        },
        avoids: [
            {
                ja: "現在地の表示を色や背景だけに頼る。",
                en: "Relying only on color or background to show the current location.",
            },
            {
                ja: "ページ内の切り替えにグローバルナビゲーションを使う。",
                en: "Using global navigation for local view switching.",
            },
            {
                ja: "docs プレビュー内で、リンククリックにより実際にページ遷移させる。",
                en: "Allowing docs preview links to navigate away from the preview context.",
            },
        ],
        patternTitle: { ja: "パターンで確認する場面", en: "Where patterns validate it" },
        patternDescription: {
            ja: "ドキュメントサイト、メディアライブラリ、ダッシュボードのような複数領域を持つ画面で、現在地と移動導線を確認します。",
            en: "Patterns validate orientation and movement across documentation, media library, and dashboard surfaces.",
        },
        icon: Compass,
    },
    Overlay: {
        title: { ja: "オーバーレイの概要", en: "Overlay Overview" },
        eyebrow: { ja: "オーバーレイ", en: "Overlay" },
        description: {
            ja: "現在の画面の上に、一時的な情報、操作、確認、選択肢を重ねるコンポーネント群です。閉じ方、背景との関係、操作の重要度で使い分けます。",
            en: "Overlay components place temporary information, actions, confirmations, and choices above the current screen. Choose by dismissal behavior, background relationship, and interaction weight.",
        },
        badge: { ja: "カテゴリ概要", en: "Category overview" },
        scopeTitle: { ja: "このカテゴリの責務", en: "Category responsibility" },
        scope: {
            ja: "現在の画面を離れずに、一時的な選択、補足、確認、編集を行うための表示面を提供します。",
            en: "Provide temporary surfaces for choices, context, confirmation, and editing without leaving the current screen.",
        },
        ruleTitle: { ja: "オーバーレイ系の共通ルール", en: "Shared overlay rules" },
        rules: [
            {
                ja: "docs プレビューではページ全体ではなく、プレビュー内の文脈に収まる表示を優先します。",
                en: "Docs previews should keep overlays scoped to the preview context instead of taking over the whole page.",
            },
            {
                ja: "見切れは高さ追加で隠さず、配置、ポータル、collision、overflow の責務を確認します。",
                en: "Do not hide clipping with extra height. Check placement, portal, collision, and overflow responsibilities.",
            },
        ],
        decisionTitle: { ja: "迷いやすい使い分け", en: "Decision points" },
        decisions: [
            {
                ja: "確認や破壊的操作は AlertDialog、フォームや詳細編集は Dialog/Modal、補助パネルは Sheet/Drawer を使います。",
                en: "Use AlertDialog for confirmations, Dialog/Modal for forms and editing, and Sheet/Drawer for supplemental panels.",
            },
            {
                ja: "軽い補足は Tooltip/HoverCard、短い設定や選択は Popover/DropdownMenu/ContextMenu を使います。",
                en: "Use Tooltip/HoverCard for lightweight context and Popover/DropdownMenu/ContextMenu for compact choices.",
            },
        ],
        startTitle: { ja: "最初に確認するページ", en: "Start with these" },
        startDescription: {
            ja: "重ねる情報の重さ、閉じ方、入力を伴うかどうかで選び始めます。",
            en: "Start by deciding how heavy the surface is, how it dismisses, and whether it contains input.",
        },
        startItems: [
            {
                title: { ja: "ダイアログ", en: "Dialog" },
                description: {
                    ja: "短いフォーム、設定、詳細確認を現在画面の上で扱います。",
                    en: "Forms, settings, and short details above the current screen.",
                },
                href: "/docs/components/dialog",
            },
            {
                title: { ja: "確認ダイアログ", en: "AlertDialog" },
                description: {
                    ja: "破壊的操作や戻せない操作の前に確認を求めます。",
                    en: "Explicit confirmation before destructive or irreversible actions.",
                },
                href: "/docs/components/alert-dialog",
            },
            {
                title: { ja: "ポップオーバー", en: "Popover" },
                description: {
                    ja: "軽い設定、選択、補足情報をトリガーの近くに置きます。",
                    en: "Lightweight settings, choices, and context near a trigger.",
                },
                href: "/docs/components/popover",
            },
        ],
        avoidTitle: { ja: "避ける使い方", en: "Avoid" },
        avoidDescription: {
            ja: "オーバーレイは表示位置と閉じ方が UX の大半を決めます。見切れやページ全体への漏れを放置しません。",
            en: "Overlay UX depends on placement and dismissal. Do not leave clipping or page-wide leakage unresolved.",
        },
        avoids: [
            {
                ja: "見切れをプレビュー高さの追加だけで隠す。",
                en: "Hiding clipping only by adding preview height.",
            },
            {
                ja: "モーダルやシートを docs プレビュー外のページ全体へ漏らす。",
                en: "Letting modals or sheets escape the docs preview into the whole page.",
            },
            {
                ja: "アイコンだけの閉じる、コピー、共有などにツールチップを付けない。",
                en: "Leaving icon-only close, copy, or share actions without tooltips.",
            },
        ],
        patternTitle: { ja: "パターンで確認する場面", en: "Where patterns validate it" },
        patternDescription: {
            ja: "実画面に近いフレームの中で、モーダル、シート、メニュー、ツールチップがページ全体へ漏れずに動くか確認します。",
            en: "Patterns validate whether modals, sheets, menus, and tooltips stay scoped inside realistic application frames.",
        },
        icon: Layers3,
    },
    Layout: {
        title: { ja: "レイアウトの概要", en: "Layout Overview" },
        eyebrow: { ja: "レイアウト", en: "Layout" },
        description: {
            ja: "余白、比率、並び、スクロール、リサイズ、作業面など、コンテンツを配置する土台を作るコンポーネント群です。情報そのものより、配置と可変領域の責務を扱います。",
            en: "Layout components define spacing, ratio, alignment, scrolling, resizing, and work surfaces. They own placement and responsive regions rather than the content itself.",
        },
        badge: { ja: "カテゴリ概要", en: "Category overview" },
        scopeTitle: { ja: "このカテゴリの責務", en: "Category responsibility" },
        scope: {
            ja: "情報を直接表現するのではなく、余白、比率、並び、スクロール、可変領域の土台を安定させます。",
            en: "Stabilize spacing, ratio, alignment, scrolling, and resizable regions rather than representing information directly.",
        },
        ruleTitle: { ja: "レイアウト系の共通ルール", en: "Shared layout rules" },
        rules: [
            {
                ja: "固定高さや固定幅で見た目だけを合わせず、実際の用途に合う可変領域を設計します。",
                en: "Avoid matching appearances with fixed dimensions alone. Design flexible regions that match the actual use case.",
            },
            {
                ja: "フォームやパネルの中身は、GunjoUI の Input や関連コンポーネントを compose して使います。",
                en: "Compose form and panel contents from GunjoUI inputs and related primitives.",
            },
        ],
        decisionTitle: { ja: "迷いやすい使い分け", en: "Decision points" },
        decisions: [
            {
                ja: "単純な横並びは HStack/Cluster、縦方向のまとまりは VStack、面全体の幅制御は Container を使います。",
                en: "Use HStack/Cluster for horizontal grouping, VStack for vertical grouping, and Container for page width control.",
            },
            {
                ja: "作業面は SpatialCanvas、デバイス確認は DeviceFrame、サイズ変更が必要な領域は Resizable を使います。",
                en: "Use SpatialCanvas for work surfaces, DeviceFrame for device previews, and Resizable for adjustable regions.",
            },
        ],
        startTitle: { ja: "最初に確認するページ", en: "Start with these" },
        startDescription: {
            ja: "並び、幅、比率、スクロール、作業面のどれを決めたいかで入口を選びます。",
            en: "Start from the layout primitive that matches alignment, width, ratio, scrolling, or work-surface needs.",
        },
        startItems: [
            {
                title: { ja: "コンテナ", en: "Container" },
                description: {
                    ja: "ページやセクションの最大幅と余白を揃えます。",
                    en: "Controls page and section width with consistent outer spacing.",
                },
                href: "/docs/components/container",
            },
            {
                title: { ja: "クラスター", en: "Cluster" },
                description: {
                    ja: "折り返しを含む横並びのまとまりを作ります。",
                    en: "Creates wrapping horizontal groups with stable spacing.",
                },
                href: "/docs/components/cluster",
            },
            {
                title: { ja: "空間キャンバス", en: "SpatialCanvas" },
                description: {
                    ja: "カード、ノード、範囲選択などを置く作業面を作ります。",
                    en: "A work surface for cards, nodes, selection regions, and spatial editing.",
                },
                href: "/docs/components/spatial-canvas",
            },
        ],
        avoidTitle: { ja: "避ける使い方", en: "Avoid" },
        avoidDescription: {
            ja: "レイアウトは後から中身が変わる前提で、固定値ではなく意図した制約で安定させます。",
            en: "Layout should remain stable as content changes by using intentional constraints instead of brittle fixed values.",
        },
        avoids: [
            {
                ja: "docs プレビューを成立させるためだけに固定高さを足す。",
                en: "Adding fixed height only to make a docs preview look passable.",
            },
            {
                ja: "フォーム項目や入力欄を one-off styling で作り、Input 系コンポーネントを使わない。",
                en: "Building form fields with one-off styling instead of composing GunjoUI input components.",
            },
            {
                ja: "スクロール領域とページ全体のスクロール責務を混ぜる。",
                en: "Mixing the responsibility of local scroll regions with the whole page scroll.",
            },
        ],
        patternTitle: { ja: "パターンで確認する場面", en: "Where patterns validate it" },
        patternDescription: {
            ja: "デバイス幅、作業面、パネル、サイドバー、フォームなどを組み合わせた時に、固定値に頼らず破綻しないか確認します。",
            en: "Patterns validate device widths, work surfaces, panels, sidebars, and forms without relying on brittle fixed dimensions.",
        },
        icon: LayoutPanelTop,
    },
};

export function CategoryOverviewPage({ category }: { category: CategoryName }) {
    const { locale, bilingual } = useLocale();
    const copy = categoryCopy[category];
    const Icon = copy.icon;
    const isJa = locale === "ja";
    const section = navigation.find((item) => item.title === category);
    const items =
        section?.items.filter((item) => !item.title.endsWith(" Overview")) ?? [];

    return (
        <div className="space-y-10" data-doc-category-overview="true">
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {copy.eyebrow[locale]}
                    </span>
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {copy.title[locale]}
                    </h1>
                    <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                        {copy.description[locale]}
                    </p>
                    <Badge variant="secondary">{copy.badge[locale]}</Badge>
                </div>
            </header>

            <section className="space-y-4">
                <div className="space-y-1 border-b pb-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "コンポーネント一覧" : "Components"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isJa
                            ? "各コンポーネントの詳細ページへ移動して、プレビュー、コード、プロパティを確認できます。"
                            : "Open each component page to review its preview, code, and props."}
                    </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    {items.map((item) => {
                        const slug = item.href.split("/").filter(Boolean).at(-1);
                        const doc = slug ? getDocContent(`components/${slug}`, locale) : undefined;
                        const label = bilingual(item.title);
                        return (
                            <Card key={item.href} className="overflow-hidden">
                                <CardContent className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <h3 className="text-base font-semibold">{label.primary}</h3>
                                            {label.secondary !== label.primary ? (
                                                <span className="text-xs text-muted-foreground">{label.secondary}</span>
                                            ) : null}
                                        </div>
                                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                            {doc?.description ??
                                                (isJa
                                                    ? "このカテゴリに含まれるコンポーネントです。"
                                                    : "A component in this category.")}
                                        </p>
                                    </div>
                                    <Button asChild variant="outline" className="justify-self-start md:justify-self-end">
                                        <Link href={item.href}>
                                            {isJa ? "詳細を見る" : "Open docs"}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            <section className="space-y-2 border-b pb-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {isJa ? "補足情報" : "Supplemental information"}
                </h2>
                <p className="text-muted-foreground">
                    {isJa
                        ? "一覧でコンポーネントを選んだあとに確認する、カテゴリ全体の責務、共通ルール、使い分けです。"
                        : "Category responsibility, shared rules, and decision points to review after choosing the relevant component."}
                </p>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{copy.scopeTitle[locale]}</CardTitle>
                        <CardDescription>{copy.scope[locale]}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isJa ? "このページの使い方" : "How to use this page"}
                        </CardTitle>
                        <CardDescription>
                            {isJa
                                ? "まずカテゴリの責務を確認し、迷いやすい使い分けから該当コンポーネントへ移動します。"
                                : "Start with the category responsibility, then use the decision points to open the matching component."}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{copy.patternTitle[locale]}</CardTitle>
                        <CardDescription>{copy.patternDescription[locale]}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full justify-between">
                            <Link href="/patterns">
                                {isJa ? "パターンを見る" : "Open patterns"}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{copy.ruleTitle[locale]}</CardTitle>
                        <CardDescription>
                            {isJa
                                ? "カテゴリ内で共通して守るべき判断基準です。"
                                : "Shared criteria to keep the category coherent."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                        {copy.rules.map((rule) => (
                            <div key={rule.en} className="flex gap-2">
                                <Columns3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p>{rule[locale]}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{copy.decisionTitle[locale]}</CardTitle>
                        <CardDescription>
                            {isJa
                                ? "似ているコンポーネントを選ぶ時の入口です。"
                                : "Starting points for choosing between similar components."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                        {copy.decisions.map((decision) => (
                            <div key={decision.en} className="flex gap-2">
                                <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p>{decision[locale]}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-primary" />
                            {copy.startTitle[locale]}
                        </CardTitle>
                        <CardDescription>{copy.startDescription[locale]}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {copy.startItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-md border border-border bg-card p-4 transition-colors hover:border-primary-border hover:bg-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 space-y-1">
                                        <h3 className="font-semibold text-foreground">
                                            {item.title[locale]}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {item.description[locale]}
                                        </p>
                                    </div>
                                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TriangleAlert className="h-5 w-5 text-warning" />
                            {copy.avoidTitle[locale]}
                        </CardTitle>
                        <CardDescription>{copy.avoidDescription[locale]}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                        {copy.avoids.map((avoid) => (
                            <div key={avoid.en} className="flex gap-2">
                                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p>{avoid[locale]}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <Separator />
        </div>
    );
}
