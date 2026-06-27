"use client";

import * as React from "react";
import Link from "next/link";
import { Container, Badge, Separator } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

type T = { en: string; ja: string };
interface Entry {
    build: T; // what you're building (+ search terms)
    comp: string; // component / helper name
    slug?: string; // docs slug (omit for helpers without a page)
    when?: T; // "use this when" disambiguation
}
interface Group {
    title: T;
    intro?: T;
    items: Entry[];
}

const GROUPS: Group[] = [
    {
        title: { en: "Scheduling & time", ja: "スケジュール・時間" },
        intro: {
            en: "The most-confused family — pick by the shape of your data.",
            ja: "最も取り違えられる族。データの形で選ぶ。",
        },
        items: [
            {
                build: { en: "Discrete matrix: timetable / shift roster / booking grid / availability (rows × columns, one thing per cell)", ja: "離散マトリクス：時間割／シフト表／予約グリッド／可用性（行×列・1セル1件）" },
                comp: "ScheduleGrid",
                slug: "schedule-grid",
                when: { en: "staff×days, 卓×time, 利用者×care item. NOT sortable list data (→ DataTable) or value-by-color (→ HeatmapChart).", ja: "スタッフ×曜日・卓×時間・利用者×ケア項目。ソート表は DataTable、値の色塗りは HeatmapChart。" },
            },
            { build: { en: "Month calendar with events on dates", ja: "月カレンダー＋日付にイベント" }, comp: "EventCalendar", slug: "event-calendar", when: { en: "editorial/content calendar, bookings — chips on day cells.", ja: "編集/コンテンツカレンダー・予約。日セルにチップ。" } },
            { build: { en: "Week time-grid with overlap-packed events", ja: "週の時刻グリッド（重なりを横に詰める）" }, comp: "WeekView", slug: "week-view", when: { en: "appointments/interviews by time-of-day across a week.", ja: "面接/予定を時刻×曜日で。" } },
            { build: { en: "Resource rows × continuous time axis (lane-packed bars)", ja: "リソース行×連続時間軸（レーン詰めバー）" }, comp: "Gantt", slug: "gantt", when: { en: "production lines, room/vehicle timelines, project schedules. Bars are lane-packed within a row — NOT crossing diagonal paths. A 列車運行図表 / stringline / Marey (time×distance, crossing slopes) is not yet covered.", ja: "生産ライン・設備/車両・工程。バーは行内でレーン詰め＝交差する斜線(列車運行図表/ダイヤグラム/Marey)は未対応。" } },
            { build: { en: "Pick a single date / range", ja: "日付・期間を選ぶ" }, comp: "DatePicker", slug: "date-picker" },
        ],
    },
    {
        title: { en: "Graphs, hierarchy & relationships", ja: "グラフ・階層・関係" },
        items: [
            { build: { en: "Directed graph with multi-parent / multi-child (genealogy, lineage, dependency, ETL)", ja: "多親・多子の有向グラフ（系譜・リネージ・依存・ETL）" }, comp: "LineageGraph", slug: "lineage-graph", when: { en: "the fan-in/fan-out a tree CANNOT draw.", ja: "ツリーで描けない合流/分岐。" } },
            { build: { en: "Single-parent tree (org chart, hierarchy)", ja: "単親ツリー（組織図・階層）" }, comp: "TreeView", slug: "tree-view", when: { en: "expand/collapse, one parent per node.", ja: "開閉・1ノード1親。" } },
            { build: { en: "File / folder tree", ja: "ファイル/フォルダツリー" }, comp: "FileTree", slug: "file-tree" },
            { build: { en: "Chronological events", ja: "時系列の出来事" }, comp: "Timeline", slug: "timeline" },
            { build: { en: "Ordered stops with status + planned-vs-actual + delay — NODE-centric (the stop carries the info): 配送ルート / 工程フロー / 行路", ja: "順序づいた各停の連なり（状態＋予実＋遅延）＝ノード中心（停が情報を持つ）：配送ルート/工程フロー/行路" }, comp: "RouteStops", slug: "route-stops", when: { en: "numbered stops, per-stop status, auto Delta, aria-current. NOT a transit 乗換案内 itinerary — that is LEG-centric (the line BETWEEN stops carries 種別/方面/番線/colour) and is not yet covered. Approval-style sequence → ApprovalSteps.", ja: "番号付き各停・状態・予実Delta・現在ステップ。乗換案内の経路は別物＝レグ中心（停の間の路線が種別/方面/番線/色を持つ）で未対応。承認系の順序は ApprovalSteps。" } },
        ],
    },
    {
        title: { en: "People", ja: "人・関係" },
        items: [
            { build: { en: "Identity cell: avatar + name + role/dept + status", ja: "人物セル：アバター＋氏名＋役職/部署＋状態" }, comp: "PersonCell", slug: "person-cell", when: { en: "directory rows, assignee pickers, comment attributions, approver rows.", ja: "名簿行・担当ピッカー・コメント・承認者行。" } },
            { build: { en: "Two people side by side (manager↔report, 担当↔利用者)", ja: "2人を並べる（上司↔部下・担当↔利用者）" }, comp: "RelationshipRow", slug: "relationship-row", when: { en: "the pairing in 1on1, mentor↔mentee, care assignments.", ja: "1on1・メンター・ケア担当の組。" } },
            { build: { en: "Stacked avatar cluster", ja: "アバターの集合" }, comp: "AvatarGroup", slug: "avatar-group" },
        ],
    },
    {
        title: { en: "Summary, metrics & values", ja: "サマリ・指標・値" },
        items: [
            { build: { en: "The KPI summary strip every dashboard opens with (件数 / 金額 / 期限 / アラート)", ja: "ダッシュボード冒頭の KPI 指標行（件数/金額/期限/アラート）" }, comp: "StatGroup", slug: "stat-group", when: { en: "responsive grid of Card-wrapped Statistics. One metric → Statistic.", ja: "Card 包みの Statistic 群。単一は Statistic。" } },
            { build: { en: "Action-needed worklist / alert queue (失効防止・更新・満期, ダイヤ乱れ, アラート対応)", ja: "対応キュー：要対応の worklist（失効防止/更新/満期・ダイヤ乱れ・アラート対応）" }, comp: "ActionQueue", slug: "action-queue", when: { en: "severity-sorted rows (icon+tone, not colour-only) + kind chip + meta + actions. The dashboard's other half next to StatGroup. Single notice → Alert; ambient bell tray → NotificationCenter.", ja: "重大度ソートの行（アイコン＋トーン・色のみに非依存）＋種別チップ＋期日＋アクション。StatGroup と対。単発は Alert・常駐ベルは NotificationCenter。" } },
            { build: { en: "Single KPI", ja: "単一の指標" }, comp: "Statistic", slug: "statistic" },
            { build: { en: "Hero KPI card with delta/trend", ja: "差分/トレンド付き KPI ヒーローカード" }, comp: "AnalyticsCard", slug: "analytics-card" },
            { build: { en: "Capacity / occupancy / utilisation gauge", ja: "容量/稼働/充足のメーター" }, comp: "Meter", slug: "meter", when: { en: "value-vs-max bar. Format money in the readout with formatValue={formatCurrency}. direction sets the tone semantics (judgment vs neutral fill).", ja: "value÷max のバー。読み上げの金額整形は formatValue={formatCurrency}。direction でトーンの意味（判断 vs 中立）が変わる。" } },
            { build: { en: "Measured value vs a reference range (vitals, tolerance, 基準値 H/L)", ja: "測定値を基準範囲で判定（バイタル・公差・基準値 H/L）" }, comp: "ReferenceValue", slug: "reference-value", when: { en: "auto H/L/HH/LL flags, never color-only. flagValue() is the pure helper.", ja: "H/L/HH/LL を自動・色だけに非依存。flagValue() は純関数。" } },
            { build: { en: "Signed change / +−", ja: "符号付き差分・増減" }, comp: "Delta", slug: "delta" },
            { build: { en: "Money derivation: labeled lines − deductions = total (請求 / 見積 / 査定 / 支払 / 精算 / 控除 / 給与明細)", ja: "金額の導出：明細 − 控除 = 合計（請求/見積/査定/支払/精算/控除/給与明細）" }, comp: "AmountBreakdown", slug: "amount-breakdown", when: { en: "READ-ONLY breakdown to a total, with subtotals + formula. Editable entry grid → EditableDataTable.", ja: "確定済みの金額導出（小計・数式つき）。編集入力は EditableDataTable。" } },
        ],
    },
    {
        title: { en: "Lists, results & tables", ja: "リスト・結果・表" },
        items: [
            { build: { en: "Tappable list/result/status entry: search results, route/product comparison, status lists (運行状況/在庫/端末), order/incident rows", ja: "tappable なリスト/結果/ステータス項目：検索結果・経路/商品比較・運行状況/在庫/端末の一覧・注文/障害の行" }, comp: "ListCard", slug: "list-card", when: { en: "leading + title + secondary + tags + status pill + meta + chevron; ≥44px tap target, severity accent, selected state. The B2C 'list of things' primitive — NOT PersonCell (people), NOT RouteStops (delivery stops), NOT DataTable (admin grid).", ja: "先頭＋タイトル＋副次＋タグ＋ステータス＋meta＋chevron。≥44px・重大度アクセント・選択状態。B2C の『物の一覧』＝PersonCell(人)でも RouteStops(配送停)でも DataTable(管理表)でもない。" } },
            { build: { en: "Sortable / paginated / filterable table that becomes cards on mobile", ja: "ソート/ページング/絞り込み・モバイルでカード化する表" }, comp: "DataTable", slug: "data-table", when: { en: "pass renderCard for the mobile card fallback. For a touch-first consumer list → ListCard.", ja: "renderCard でモバイルはカード崩し。消費者向けの tap リストは ListCard。" } },
            { build: { en: "EDITABLE line items with column-aligned totals (data entry)", ja: "編集できる明細・列揃え合計（データ入力）" }, comp: "EditableDataTable", slug: "editable-data-table", when: { en: "cells are inputs / add-remove rows. For a READ-ONLY money total → AmountBreakdown.", ja: "セルが入力・行追加削除。確定済みの金額導出は AmountBreakdown。" } },
            { build: { en: "Plain table primitives", ja: "素の表プリミティブ" }, comp: "Table", slug: "table" },
        ],
    },
    {
        title: { en: "Charts & analytics", ja: "チャート・分析" },
        items: [
            { build: { en: "Trend over time", ja: "推移" }, comp: "LineChart", slug: "line-chart", when: { en: "referenceValue draws a budget/target line. Tiny inline → SparklineChart.", ja: "referenceValue で予算/目標線。極小は SparklineChart。" } },
            { build: { en: "Bars / stacked bars", ja: "棒・積み上げ棒" }, comp: "StackedBarChart", slug: "stacked-bar-chart" },
            { build: { en: "ABC analysis / Pareto (top items + cumulative 80%)", ja: "ABC分析・パレート（上位＋累積80%）" }, comp: "ParetoChart", slug: "pareto-chart", when: { en: "one component with a built-in cumulative-% axis — don't fake it with two overlaid charts.", ja: "累積%軸が内蔵。2チャート重ねで偽装しない。" } },
            { build: { en: "Composition / share (donut)", ja: "構成比（ドーナツ）" }, comp: "LabeledDonutCard", slug: "labeled-donut-card", when: { en: "donut + center total + callouts. Bare donut → DonutChart (showLegend); LabeledDonutCard uses showCallouts.", ja: "ドーナツ＋中央合計＋コールアウト。素は DonutChart（showLegend）。LabeledDonutCard は showCallouts。" } },
            { build: { en: "Multi-axis radar (360° / multi-rater)", ja: "多軸レーダー（360度/多面評価）" }, comp: "RadarChart", slug: "radar-chart" },
            { build: { en: "Day × time-band intensity", ja: "曜日×時間帯の強度" }, comp: "HeatmapChart", slug: "heatmap-chart" },
            { build: { en: "Single-bar distribution / calibration", ja: "1本バーの分布・キャリブレーション" }, comp: "DistributionBar", slug: "distribution-bar" },
            { build: { en: "Gauge", ja: "ゲージ" }, comp: "GaugeChart", slug: "gauge-chart" },
        ],
    },
    {
        title: { en: "Approval, sign-off & records", ja: "承認・署名・記録" },
        items: [
            { build: { en: "Multi-stage approval workflow (advance / send-back / reject)", ja: "多段承認ワークフロー（進める/差戻し/却下）" }, comp: "ApprovalWorkflow", slug: "approval-workflow", when: { en: "ringi / expense / review / 内定 / 交付 routing with sign-off.", ja: "稟議/経費/審査/内定/交付。" } },
            { build: { en: "Approval progress display", ja: "承認ステップ表示" }, comp: "ApprovalSteps", slug: "approval-steps" },
            { build: { en: "Signed / locked / append-only legal record (確定後は追記のみ)", ja: "署名・ロック・追記のみの法的記録（確定後は追記のみ）" }, comp: "SignedRecord", slug: "signed-record", when: { en: "discharge summaries, 介護記録, ケアプラン交付 — sign locks read-only, corrections via addenda.", ja: "退院サマリ・介護記録・ケアプラン交付。署名でロック・修正は追記。" } },
            { build: { en: "Two-person verification / double-check", ja: "2人確認・ダブルチェック" }, comp: "CoSign", slug: "co-sign", when: { en: "maker-checker with same-person guard (与薬, 人事確定, 明細確定).", ja: "同一人物ガード付き（与薬・人事確定・明細確定）。" } },
        ],
    },
    {
        title: { en: "Boards", ja: "ボード" },
        items: [
            { build: { en: "Columns of cards: pipeline / KDS / task board / queue", ja: "カード列のボード：パイプライン/KDS/タスク/キュー" }, comp: "KanbanBoard", slug: "kanban-board", when: { en: "items grouped into stage columns; cards are activatable.", ja: "ステージ列にカードを束ね、選択可能。" } },
        ],
    },
    {
        title: { en: "Input, scanning & money", ja: "入力・スキャン・金額" },
        items: [
            { build: { en: "Money input (¥)", ja: "金額入力（¥）" }, comp: "CurrencyInput", slug: "currency-input" },
            { build: { en: "Format yen / number / percent (ja-JP, JPY by default)", ja: "円/数値/％の整形（ja-JP・JPY 既定）" }, comp: "formatCurrency / formatNumber / formatPercent", when: { en: "no Intl boilerplate; pass to a component's formatValue prop.", ja: "Intl 不要。formatValue prop にも渡せる。" } },
            { build: { en: "Barcode scan / staged scan flow", ja: "バーコードスキャン・段階スキャン" }, comp: "ScanInput / ScanGate", slug: "scan-input" },
            { build: { en: "Checklist with check + label + a11y name", ja: "チェックリスト（チェック＋ラベル＋読み上げ名）" }, comp: "CheckList", slug: "check-list" },
        ],
    },
];

export default function ByUseCasePage() {
    const { locale } = useLocale();
    const t = (x: T) => (locale === "ja" ? x.ja : x.en);

    return (
        <Container className="py-8">
            <header className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {locale === "ja" ? "ユースケース別（逆引き）" : "By use case (reverse lookup)"}
                </h1>
                <p className="max-w-2xl text-muted-foreground">
                    {locale === "ja"
                        ? "「何を作りたいか」から正しいコンポーネントを引く。名前だけでは見つけにくい部品（ABC分析→ParetoChart、シフト表→ScheduleGrid、署名記録→SignedRecord 等）を、作るものの言葉で。"
                        : "Find the right component from what you're building — including the ones whose names don't shout their use case (ABC analysis → ParetoChart, shift roster → ScheduleGrid, signed record → SignedRecord)."}
                </p>
            </header>

            <div className="space-y-10">
                {GROUPS.map((g) => (
                    <section key={g.title.en}>
                        <div className="mb-3 flex items-baseline gap-3">
                            <h2 className="text-lg font-semibold tracking-tight">{t(g.title)}</h2>
                            {g.intro ? <span className="text-sm text-muted-foreground">{t(g.intro)}</span> : null}
                        </div>
                        <div className="overflow-hidden rounded-lg border">
                            {g.items.map((it, i) => (
                                <div
                                    key={it.comp}
                                    className={`grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-4 ${
                                        i > 0 ? "border-t" : ""
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm text-foreground">{t(it.build)}</p>
                                        {it.when ? (
                                            <p className="mt-0.5 text-xs text-muted-foreground">{t(it.when)}</p>
                                        ) : null}
                                    </div>
                                    <div className="shrink-0">
                                        {it.slug ? (
                                            <Link href={`/docs/components/${it.slug}`} className="inline-block focus:outline-none">
                                                <Badge variant="outline" className="font-mono hover:bg-muted">
                                                    {it.comp}
                                                </Badge>
                                            </Link>
                                        ) : (
                                            <Badge variant="secondary" className="font-mono">
                                                {it.comp}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <Separator className="my-10" />
            <p className="text-sm text-muted-foreground">
                {locale === "ja"
                    ? "見つからないユースケースは GitHub Issue へ。各コンポーネントの JSDoc は「これに使う／これには使わない」を明記しています。"
                    : "Missing a use case? Open a GitHub issue. Every component's JSDoc states what it's for — and what it's not."}
            </p>
        </Container>
    );
}
