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
            { build: { en: "Resource rows × continuous time axis (lane-packed bars)", ja: "リソース行×連続時間軸（レーン詰めバー）" }, comp: "Gantt", slug: "gantt", when: { en: "production lines, room/vehicle timelines, project schedules. Bars are lane-packed within a row — NOT crossing diagonal paths. For a time×distance run diagram with crossing slopes (列車/バス運行図表) → Stringline.", ja: "生産ライン・設備/車両・工程。バーは行内でレーン詰め＝交差する斜線にはならない。時間×距離で斜線が交差する運行図表(列車/バス)は Stringline。" } },
            { build: { en: "Time × distance run diagram — diagonal run lines across stops (列車/バス運行図表 / ダイヤグラム / Marey / stringline)", ja: "時間×距離の運行図表＝停車駅を横切る斜めの運行線（列車/バス運行図表・ダイヤグラム・Marey）" }, comp: "Stringline", slug: "stringline", when: { en: "stops on the distance (y) axis, time on x, each run a diagonal polyline — slope=speed, converging lines=bunching/overtake. Bidirectional, now-line, planned(dashed)-vs-actual(solid), focusable runs. Rail/bus/tram/ferry dispatch & timetable diagrams. The view Gantt structurally can't draw (Gantt y=identity; Stringline y=distance so runs cross). NOT for air (no fixed track) → Gantt/ScheduleGrid.", ja: "停車駅=距離(y)軸・時間=x軸・各運行は斜めの線(傾き=速度・接近=続行/追越)。上下双方向・now-line・予実(計画破線/実績実線)・運行を選択可。鉄道/バス/路面/フェリーの運行・ダイヤ図表。Gantt が構造的に描けない図(Gantt は y=識別・Stringline は y=距離で交差可)。航空(固定軌道無し)は Gantt/ScheduleGrid。" } },
            { build: { en: "Pick a single date / range", ja: "日付・期間を選ぶ" }, comp: "DatePicker", slug: "date-picker", when: { en: "single date → DatePicker; a range → DateRangePicker. For an EXACT time (HH:mm) → TimePicker. For a delivery / 集荷 TIME BAND (午前中 / 12〜14時 / 14〜16時) → SegmentedControl or a RadioGroup of bands — NOT TimePicker (it is exact-time, not bands).", ja: "単一日は DatePicker・期間は DateRangePicker。正確な時刻(HH:mm)は TimePicker。配達/集荷の時間帯(午前中/12〜14時/14〜16時)は SegmentedControl か バンドの RadioGroup で、TimePicker ではない(TimePicker は正確時刻でバンドではない)。" } },
        ],
    },
    {
        title: { en: "Graphs, hierarchy & relationships", ja: "グラフ・階層・関係" },
        items: [
            { build: { en: "Directed graph with multi-parent / multi-child (genealogy, lineage, dependency, ETL)", ja: "多親・多子の有向グラフ（系譜・リネージ・依存・ETL）" }, comp: "LineageGraph", slug: "lineage-graph", when: { en: "the fan-in/fan-out a tree CANNOT draw.", ja: "ツリーで描けない合流/分岐。" } },
            { build: { en: "Single-parent tree (org chart, hierarchy)", ja: "単親ツリー（組織図・階層）" }, comp: "TreeView", slug: "tree-view", when: { en: "expand/collapse, one parent per node.", ja: "開閉・1ノード1親。" } },
            { build: { en: "File / folder tree", ja: "ファイル/フォルダツリー" }, comp: "FileTree", slug: "file-tree" },
            { build: { en: "Chronological events", ja: "時系列の出来事" }, comp: "Timeline", slug: "timeline" },
            { build: { en: "Transit line / route number chip in the line's brand colour (渋88 / JY / 丸ノ内線 / G — approach lists, route candidates, leg rows, run labels)", ja: "路線/系統番号のチップを路線のブランド色で（渋88 / JY / 丸ノ内線 / G＝接近案内・経路候補・区間行・運行ラベル）" }, comp: "LineChip", slug: "line-chip", when: { en: "filled with the line's hex brand colour, text auto-contrasts (black/white by luminance), label carries meaning (colour-independent). The IDENTITY chip — NOT Badge (status/semantic tone). Drop in ListCard's leading slot, route candidates, Stringline run labels. Omit color → neutral chip.", ja: "路線の hex ブランド色で塗りつぶし・文字は輝度で黒/白に自動コントラスト・ラベルが意味を担う(色非依存)。識別チップ＝Badge(状態/意味トーン)ではない。ListCard の leading・経路候補・Stringline 運行ラベルに。色省略で中立チップ。" } },
            { build: { en: "Trip / journey itinerary: mixed flight/hotel/activity items by day, or a 乗換 route (per-kind icon, rich content, tappable)", ja: "旅程/ジャーニー：便/ホテル/アクティビティを日別に、または乗換経路（種別アイコン・リッチ内容・tap）" }, comp: "Itinerary", slug: "itinerary", when: { en: "forward-looking travel plan — day grouping, per-item kind→icon+tone, content slot, onSelect. Richer than Timeline; the right call over RouteStops (delivery-locked 未配/配送中/予実).", ja: "未来の旅程＝日別グループ・項目ごとの種別アイコン/トーン・内容スロット・onSelect。Timeline より厚く、RouteStops(配送語彙 未配/配送中/予実 固定)より適切。" } },
            { build: { en: "Ordered stages with status + planned-vs-actual + delay — STATUS TRACKING / staged OPS PROGRESS (delivery / order / repair / baggage / ramp turnaround / any STD-watched process)", ja: "順序づいた段階（状態＋予実＋遅延）＝状態トラッキング/段階オペ進捗（配送/注文/修理/手荷物/ターンアラウンド/予実を見張る工程）" }, comp: "RouteStops", slug: "route-stops", when: { en: "numbered stages, per-stage status (pending/current/completed/delayed), aria-current, relabelable via statusLabels, per-stage actions. Two time modes: INTRADAY `plannedTime`/`actualTime` `\"HH:MM\"` + auto Delta (same-day delivery routes, ramp turnaround 到着→PBB→取卸→給油→搭載→出発); or a free-form per-stop `dateLabel` for a MULTI-DAY / multi-week dated timeline (貨物追跡 / 国際輸送 / 通関 / cross-dock — `5/12 輸出通関 → 5/16〜5/29 海上輸送 → 6/5 納品`). So consumer parcel & international shipment tracking belong here (use `dateLabel`), not just intraday. Prefer over Stepper (no timing/delta). A forward TRAVEL plan / 乗換 route → Itinerary (delivery labels mis-fit). Pure approval routing → ApprovalSteps.", ja: "番号付き段階・状態(pending/current/completed/delayed)・現在ステップ・statusLabels で再ラベル・段階ごとアクション。時刻は2モード＝当日の予実 plannedTime/actualTime \"HH:MM\"＋自動 Delta(当日配送・ターンアラウンド 到着→PBB→取卸→給油→搭載→出発)／日付跨ぎは per-stop の dateLabel で多日・多週の追跡(貨物追跡/国際輸送/通関/cross-dock＝5/12 輸出通関→5/16〜5/29 海上輸送→6/5 納品)。よって宅配追跡も国際輸送追跡もここ(dateLabel 使用)で当日に限らない。Stepper より適(タイミング/Delta 無し)。未来の旅程/乗換は Itinerary・純粋な承認は ApprovalSteps。" } },
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
            { build: { en: "The KPI summary strip every dashboard opens with (件数 / 金額 / 期限 / アラート)", ja: "ダッシュボード冒頭の KPI 指標行（件数/金額/期限/アラート）" }, comp: "StatGroup", slug: "stat-group", when: { en: "responsive grid of Card-wrapped Statistics. One metric → Statistic. NOT a ranking — for ordered best/worst use Leaderboard.", ja: "Card 包みの Statistic 群。単一は Statistic。順位ではない＝best/worst の番付は Leaderboard。" } },
            { build: { en: "Ranking / leaderboard / best-worst performers (売上 top-N, 事故率/赤字/苦情 ワースト, 系統別・営業所別・担当別)", ja: "ランキング/番付：best・worst（売上 top-N、事故率/赤字/苦情のワースト、系統別・営業所別・担当別）" }, comp: "Leaderboard", slug: "leaderboard", when: { en: "pre-ordered rows + rank chip + value bar + Delta. Caller orders (best-first or worst-first); rank = position. up-is-bad? deltaTones={{positive:'destructive'}}. NOT StatGroup (unordered KPI), NOT BarChart (chart, no rank), NOT ParetoChart (ABC cumulative-%).", ja: "事前順序付けの行＋ランクチップ＋値バー＋Delta。並びは呼び出し側（best/worst）＝ランクは位置。上昇＝悪い時は deltaTones で赤反転。StatGroup(無順序KPI)でも BarChart(順位なしチャート)でも ParetoChart(ABC累積%)でもない。" } },
            { build: { en: "Action-needed worklist / alert queue (失効防止・更新・満期, ダイヤ乱れ, アラート対応)", ja: "対応キュー：要対応の worklist（失効防止/更新/満期・ダイヤ乱れ・アラート対応）" }, comp: "ActionQueue", slug: "action-queue", when: { en: "severity-sorted rows (icon+tone, not colour-only) + kind chip + meta + actions. The dashboard's other half next to StatGroup. Single notice → Alert; ambient bell tray → NotificationCenter.", ja: "重大度ソートの行（アイコン＋トーン・色のみに非依存）＋種別チップ＋期日＋アクション。StatGroup と対。単発は Alert・常駐ベルは NotificationCenter。" } },
            { build: { en: "Single KPI", ja: "単一の指標" }, comp: "Statistic", slug: "statistic" },
            { build: { en: "Hero KPI card with delta/trend", ja: "差分/トレンド付き KPI ヒーローカード" }, comp: "AnalyticsCard", slug: "analytics-card" },
            { build: { en: "Points / balance / tier hero (loyalty, mileage, IC, membership rewards)", ja: "ポイント/残高/ランクのヒーロー（ロイヤリティ・マイル・IC・会員特典）" }, comp: "LoyaltySummaryCard", slug: "loyalty-summary-card", when: { en: "balance + tier badge + higher-is-better progress-to-next + expiry + action, with a brand gradient surface. The B2C loyalty hero — NOT StatGroup (flat KPI strip) or AnalyticsCard (trend card).", ja: "残高＋ランクバッジ＋次ランクへの進捗(higher-is-better)＋失効＋アクション・ブランドのグラデーション面。B2C ロイヤリティの華＝StatGroup(平らなKPI行)でも AnalyticsCard(トレンド)でもない。" } },
            { build: { en: "Capacity / occupancy / utilisation gauge", ja: "容量/稼働/充足のメーター" }, comp: "Meter", slug: "meter", when: { en: "value-vs-MAX bar (thresholds are fractions of max). Format money with formatValue={formatCurrency}. direction sets tone semantics. For value vs a NAMED limit in real units (拘束時間/SLA/過積載/残業 — 基準13h with a breach state) → LimitMonitor, NOT Meter (its target is reference-only and thresholds are fraction-of-max).", ja: "value÷MAX のバー(閾値は max の割合)。金額整形は formatValue={formatCurrency}・direction でトーン意味。実単位の名前付き上限 vs 値(拘束時間/SLA/過積載/残業＝基準13h で超過状態)は LimitMonitor で Meter ではない(target は参照のみ・閾値は max 割合)。" } },
            { build: { en: "Measured value vs a reference range (vitals, tolerance, 基準値 H/L)", ja: "測定値を基準範囲で判定（バイタル・公差・基準値 H/L）" }, comp: "ReferenceValue", slug: "reference-value", when: { en: "auto H/L/HH/LL flags, never color-only. flagValue() is the pure helper. For a NUMERIC range. For a DATE deadline → ExpiryBadge. For value vs a NAMED soft/hard LIMIT with a bar (拘束時間/SLA/quota) → LimitMonitor (ReferenceValue has the over-state but no bar/limit-line).", ja: "数値レンジ専用・H/L/HH/LL 自動。日付の有効期限は ExpiryBadge。名前付きソフト/ハード上限 vs 値でバー付き(拘束時間/SLA/quota)は LimitMonitor(ReferenceValue は超過状態はあるがバー/上限線が無い)。" } },
            { build: { en: "Value vs a NAMED regulatory limit with a bar + breach state (改善基準告示 拘束時間/連続運転/休息, SLA budget, quota, 過積載, 残業, rate limit)", ja: "値 vs 名前付き上限＝バー+超過状態（改善基準告示 拘束時間/連続運転/休息・SLA・quota・過積載・残業・レート制限）" }, comp: "LimitMonitor", slug: "limit-monitor", when: { en: "limits in the value's OWN units (基準13h / 上限16h), breach tone DERIVED from them (ok/near/over/critical), the limit drawn as a line, a bar showing how close/how far past. direction='floor' for must-stay-above (休息11h). pure classifyLimit(). The 4th value-vs-X sibling: ExpiryBadge=deadline, ReferenceValue=range, Meter=capacity, LimitMonitor=named limit. NOT Meter (fraction-of-max + reference-only target), NOT ReferenceValue (no bar/line).", ja: "上限は値の単位そのまま(基準13h/上限16h)・超過トーンはそこから導出(ok/near/over/critical)・上限を線で描画・どれだけ近い/超過かのバー。direction='floor' で下限(休息11h)。純関数 classifyLimit()。value-vs-X の4番目＝ExpiryBadge(期限)/ReferenceValue(範囲)/Meter(容量)/LimitMonitor(名前付き上限)。Meter(max割合+参照のみ target)でも ReferenceValue(バー/線無し)でもない。" } },
            { build: { en: "Date vs deadline — currency / expiry (licence, 資格, 適性診断, 健診, 車検, 保険, 認証, 点検 → 有効 / 期限間近 / 失効)", ja: "日付 vs 期限＝有効期限カレンシー（免許・資格・適性診断・健診・車検・保険・認証・点検→有効/期限間近/失効）" }, comp: "ExpiryBadge", slug: "expiry-badge", when: { en: "the date-domain sibling of Meter (capacity) and ReferenceValue (numeric range) — value vs a DEADLINE. Colour-safe state chip (icon+label) + date + 残N日/N日超過; pure classifyExpiry(date,{today,warnWithinDays}) → {state,days} mirrors flagValue(). Pass `today` for SSR determinism. NOT ReferenceValue (numeric-only).", ja: "Meter(容量)と ReferenceValue(数値レンジ)の日付ドメイン版＝値 vs 期限。色安全な状態チップ(アイコン+ラベル)+日付+残N日/N日超過・純関数 classifyExpiry(date,{today,warnWithinDays})→{state,days} が flagValue の対。SSR は today を渡す。ReferenceValue(数値専用)ではない。" } },
            { build: { en: "Signed change / +−", ja: "符号付き差分・増減" }, comp: "Delta", slug: "delta" },
            { build: { en: "Money derivation: labeled lines − deductions = total (請求 / 見積 / 査定 / 支払 / 精算 / 控除 / 給与明細)", ja: "金額の導出：明細 − 控除 = 合計（請求/見積/査定/支払/精算/控除/給与明細）" }, comp: "AmountBreakdown", slug: "amount-breakdown", when: { en: "READ-ONLY breakdown to a total, with subtotals + formula. NOTE: it DISPLAYS the amounts you pass — it does NOT sum them. Editable entry grid → EditableDataTable. A list of transactions GROUPED by date/客先 with per-group subtotals → SectionList.", ja: "確定済みの金額導出（小計・数式つき）。金額は渡した値を表示するだけで合算はしない。編集入力は EditableDataTable。日付/客先でグループ化し各グループ小計のある取引一覧は SectionList。" } },
            { build: { en: "List GROUPED into sections with per-group subtotals (利用明細 / 取引履歴 by month, 請求 by 締め/客先, statement, ledger by date)", ja: "セクションにグループ化＋各グループ小計のリスト（利用明細/取引履歴を月別・請求を締め/客先別・明細書・台帳を日付別）" }, comp: "SectionList", slug: "section-list", when: { en: "groupBy + a section header (title + sublabel + right-aligned group aggregate) + an optional per-group subtotal footer. Body-agnostic — drop in ListCards (mobile history), a Table (desktop invoices), or signed ledger rows; the caller owns the grouping + subtotal math + cross-group selection. The spine every history/利用明細/取引履歴/statement/invoice-by-客先 screen hand-rolls. NOT StatusBoard.groups (status tiles), NOT Itinerary.days (trip timeline), NOT a flat DataTable (no grouping/subtotal).", ja: "groupBy＋セクション見出し(title+sublabel+右寄せ集計)＋任意のグループ小計フッター。本文非依存＝ListCard(モバイル履歴)/Table(デスクトップ請求)/符号付き台帳行を入れる・グルーピングと小計計算とクロスグループ選択は呼び出し側。履歴/利用明細/取引履歴/明細書/客先別請求 の手組みの背骨。StatusBoard.groups(状態タイル)/Itinerary.days(旅程)/フラットな DataTable(グループ/小計なし)ではない。" } },
        ],
    },
    {
        title: { en: "Lists, results & tables", ja: "リスト・結果・表" },
        items: [
            { build: { en: "Tappable list/result/status entry: search results, route/product comparison, status lists (運行状況/在庫/端末), order/incident rows", ja: "tappable なリスト/結果/ステータス項目：検索結果・経路/商品比較・運行状況/在庫/端末の一覧・注文/障害の行" }, comp: "ListCard", slug: "list-card", when: { en: "leading + title + secondary + tags + status pill + meta + chevron; ≥44px tap target, severity accent. This is the MOBILE / tappable-card list. NAVIGATION rows (onSelect = aria-pressed). For PICK-ONE-OF-MANY (plan / ticket / payment) → RadioCard. For a DESKTOP information-dense operator list (a fleet / asset / order grid — sortable, many columns, per-row meters/actions) → DataTable / ActionDataTable, NOT ListCard. NOT PersonCell (people), NOT RouteStops (delivery stops).", ja: "先頭＋タイトル＋副次＋タグ＋ステータス＋meta＋chevron。≥44px・重大度アクセント。これは モバイル/tappable カードの一覧。ナビ行(onSelect=aria-pressed)。1つを選ぶ(プラン/きっぷ/支払)は RadioCard。デスクトップの情報密度が高い業務一覧(機材/資産/注文グリッド=ソート・多列・行ごとのMeter/操作)は DataTable/ActionDataTable で、ListCard ではない。PersonCell(人)/RouteStops(配送停) でもない。" } },
            { build: { en: "Settings / account / マイページ nav row — `[icon] label … current value [›]` that opens a detail or navigates (お支払い方法, 送付方法, 通知, プロフィール)", ja: "設定/アカウント/マイページのナビ行＝`[アイコン] ラベル … 現在値 [›]` で詳細を開く/遷移（お支払い方法・送付方法・通知・プロフィール）" }, comp: "NavRow", slug: "nav-row", when: { en: "flush row, leading icon + label + description + right-aligned value + trailing chevron; with onSelect it's a NAVIGATION/disclosure button (aria-haspopup, NOT aria-pressed). Group in SettingGroup (rounded container + hairline dividers). NOT ListCard — ListCard.onSelect is aria-pressed (a TOGGLE/selected-state), the wrong a11y for a row that opens a detail. A static control row → NavRow with a Switch/Badge in trailing (no onSelect).", ja: "flush 行＝先頭アイコン＋ラベル＋説明＋右寄せ現在値＋末尾 chevron。onSelect でナビ/ディスクロージャーの button(aria-haspopup・aria-pressed ではない)。SettingGroup で丸角＋ハイライン区切り。ListCard ではない＝ListCard.onSelect は aria-pressed(トグル/選択状態)で、詳細を開く行には a11y 的に誤り。静的な操作行は NavRow の trailing に Switch/Badge(onSelect 無し)。" } },
            { build: { en: "Priced selectable choice card — pick ONE (plan / ticket / shipping option / payment method)", ja: "価格つき選択カード—1つを選ぶ（プラン/きっぷ/配送/支払方法）" }, comp: "RadioCard", slug: "radio-card", when: { en: "RadioGroup single-select role=radio + keyboard, wearing a card body: tags + title + area/period + dominant price + おトク hook + check/ring. The B2C purchase/plan-picker atom — single-select with correct a11y, NOT ListCard (its onSelect is an aria-pressed toggle, an a11y smell for pick-one).", ja: "RadioGroup の単一選択(role=radio+キーボード)＋カード本体：タグ＋タイトル＋エリア/期間＋強調価格＋おトク＋チェック。B2C 購入/プラン選択の原子＝ListCard(onSelect は aria-pressed トグルで pick-one には a11y 的に不適)でなくこちら。" } },
            { build: { en: "Scrollable single-select category chip bar (place/list finder nav: 施設カテゴリ, ジャンル, エリア)", ja: "横スクロールの単一選択カテゴリ chip バー（施設/一覧ファインダーのナビ：施設カテゴリ/ジャンル/エリア）" }, comp: "FilterChips", slug: "filter-chips", when: { en: "many categories, horizontally scrollable, filled active chip, arrow-key roving, hidden scrollbar — the consumer place-finder nav (空港/駅施設, 食べログ, retail). 2–4 equal segments → SegmentedControl; popover faceted filter → FilterButton.", ja: "多カテゴリ・横スクロール・塗りつぶし active・矢印キー・スクロールバー非表示＝消費者ファインダーのナビ(空港/駅施設・食べログ・小売)。2-4等幅は SegmentedControl・ポップオーバー多面は FilterButton。" } },
            { build: { en: "Small inline single-select toggle (旅客区分 大人/小児, 支払い 現金/IC/QR, 片道/往復, 出発/到着, 個人/法人, 日/週/月)", ja: "小さいインライン単一選択トグル（旅客区分 大人/小児・支払い 現金/IC/QR・片道/往復・出発/到着・個人/法人・日/週/月）" }, comp: "SegmentedControl", slug: "segmented-control", when: { en: "2–4 EQUAL-WIDTH segments on a recessed track, active one raised; role=radiogroup + arrow keys; onValueChange is a single string. The mobile either/or switch. NOT ToggleGroup (general content-fit, single-OR-multi, union callback — needs CSS to fake equal width), NOT RadioCard (large priced choice card), NOT Tabs (content-panel nav).", ja: "凹んだトラックに2-4等幅セグメント・active が浮く・role=radiogroup＋矢印キー・onValueChange は単一 string。モバイルの either/or 切替。ToggleGroup(汎用・content-fit・単/複両用・union 型・等幅は CSS で偽装)でも RadioCard(大きな価格付き選択カード)でも Tabs(コンテンツ切替)でもない。" } },
            { build: { en: "Interactive seat / spot picker (2-D grid with aisles, per-seat state/type/fee, multi-select)", ja: "操作可能な座席/区画ピッカー（通路つき2Dグリッド・座席ごとの状態/種別/料金・複数選択）" }, comp: "SeatMap", slug: "seat-map", when: { en: "airline / 新幹線 seats, cinema, stadium, event hall, restaurant tables. Controlled selectedIds + onToggle + maxSelectable, grid a11y. Read-only intensity grid → HeatmapChart.", ja: "航空/新幹線の座席・映画・スタジアム・イベント・レストラン卓。selectedIds+onToggle+maxSelectable・grid a11y。読み取り専用の強度は HeatmapChart。" } },
            { build: { en: "MOBILE app bar / page header (back + title + action, sticky, ≥44px, notch-safe)", ja: "モバイル app-bar / ページヘッダー（戻る＋タイトル＋アクション・sticky・≥44px・ノッチ対応）" }, comp: "PageHeader", slug: "page-header", when: { en: "the per-page top bar a consumer PHONE screen needs — onBack, title/subtitle, actions, safe-area, left/center title. PHONE ONLY — for a DESKTOP console / dashboard title bar use Header (+ HeaderBrand / HeaderActions), NOT this.", ja: "消費者のスマホ画面に要る上部バー＝onBack・title/subtitle・actions・safe-area・左/中央寄せ。スマホ専用＝デスクトップの業務コンソール/ダッシュボードの見出しバーは Header(+HeaderBrand/HeaderActions)・これではない。" } },
            { build: { en: "Sticky bottom action bar (running summary + primary CTA) — checkout / ride / booking / food", ja: "下部固定アクションバー（走行サマリ＋主要CTA）＝決済/配車/予約/注文" }, comp: "BottomActionBar", slug: "bottom-action-bar", when: { en: "the bottom dock every transactional/real-time consumer screen ends with — children = the running summary (合計/到着まで○分/件数), actions = the CTA (呼ぶ/支払う/予約), sticky bottom + safe-area-inset (home indicator). The bookend to PageHeader (top). `stack` for a full-width CTA above the summary. NOT StatusBar (a fixed-width desktop status strip).", ja: "取引/リアルタイム消費者画面が下で終わるドック＝children に走行サマリ(合計/到着まで○分/件数)・actions に CTA(呼ぶ/支払う/予約)・下部固定+safe-area-inset(ホームインジケータ回避)。PageHeader(上)の対。stack で CTA を全幅で上に。StatusBar(固定幅のデスクトップ状態帯)ではない。" } },
            { build: { en: "DESKTOP console / dashboard title bar (brand + title + actions, full-width chrome)", ja: "デスクトップ業務コンソール/ダッシュボードの見出しバー（ブランド＋タイトル＋アクション・全幅クローム）" }, comp: "Header", slug: "header", when: { en: "the top chrome of a dispatch / monitoring / analytics console — HeaderBrand + a title + HeaderActions. The desktop counterpart to PageHeader (which is phone-only); reach here for any wall-mounted / desk ops screen, not the mobile app-bar.", ja: "配車/監視/分析コンソールの上部クローム＝HeaderBrand＋タイトル＋HeaderActions。PageHeader(スマホ専用)のデスクトップ版・壁掛け/デスクの業務画面はこちらでモバイル app-bar ではない。" } },
            { build: { en: "Sortable / paginated / filterable table that becomes cards on mobile", ja: "ソート/ページング/絞り込み・モバイルでカード化する表" }, comp: "DataTable", slug: "data-table", when: { en: "pass renderCard for the mobile card fallback. For a touch-first consumer list → ListCard. For DESKTOP row-selection + bulk action (案件→車両一括割当 / 一括承認 / 一括処理 / select N → act) → ActionDataTable (selectedIds + onSelectionChange + bulkActions[] + checkbox column), NOT a hand-rolled checkbox column on DataTable. For mobile MULTI-SELECT + bulk action (経費まとめDL / 一括) → ListCard (Checkbox in `leading`) + BottomActionBar (選択中N件 + CTA).", ja: "renderCard でモバイルはカード崩し。消費者向けの tap リストは ListCard。デスクトップの行選択+一括操作(案件→車両一括割当/一括承認/一括処理/N件選択→実行)は ActionDataTable(selectedIds+onSelectionChange+bulkActions[]+チェックボックス列)で、DataTable にチェックボックス列を手組みしない。モバイルの複数選択+一括操作(経費まとめDL/一括)は ListCard(leading に Checkbox)+BottomActionBar(選択中N件+CTA)。" } },
            { build: { en: "Operator data table with per-row actions / row selection + bulk actions (案件一括割当, 一括承認, 一括ステータス変更)", ja: "業務データ表＝行アクション/行選択+一括操作（案件一括割当・一括承認・一括ステータス変更）" }, comp: "ActionDataTable", slug: "action-data-table", when: { en: "DataTable + a checkbox column, controlled selectedIds + onSelectionChange, a select-all header, and bulkActions[] that act on the selected set (dispatch: select unassigned loads → 車両に一括割当). The desktop 'select N rows → act' workflow — don't hand-roll selection on DataTable. Per-row inline actions only (no bulk) → DataTable with an actions column.", ja: "DataTable＋チェックボックス列・制御 selectedIds+onSelectionChange・全選択ヘッダ・選択集合に効く bulkActions[]（配車：未割当案件を選択→車両に一括割当）。デスクトップの『N行選択→実行』ワークフロー＝DataTable に選択を手組みしない。行ごとのインライン操作だけ(一括なし)は DataTable に操作列。" } },
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
            { build: { en: "Star rating — DISPLAY only (read-out of an average ★4.92, review count)", ja: "星評価＝表示専用（平均★4.92・件数の読み出し）" }, comp: "Rating", slug: "rating", when: { en: "role=img, value/max/reviewCount/showValue. DISPLAY ONLY — no onChange/focusable stars. For a rating INPUT (post-ride 評価, レビュー投稿: tap/keyboard to SET stars) compose a star radiogroup (focusable buttons + arrow keys + ≥44px) — a first-class RatingInput is proposed in #406; do NOT wire onChange onto Rating, it has none.", ja: "role=img・value/max/reviewCount/showValue。表示専用＝onChange も focusable star も無い。評価の入力(乗車後評価・レビュー投稿でタップ/キーボードで★を選ぶ)は星の radiogroup を構成(focusable ボタン+矢印キー+≥44px)・専用 RatingInput は #406 で提案中・Rating に onChange を付けようとしない(存在しない)。" } },
            { build: { en: "Day × time-band intensity (READ-ONLY value-by-colour)", ja: "曜日×時間帯の強度（読み取り専用・値の色塗り）" }, comp: "HeatmapChart", slug: "heatmap-chart", when: { en: "read-only intensity GRID (matrix). For an INTERACTIVE seat/spot picker → SeatMap. NOT a single qualitative level pill (混雑度/在庫/レベル) — that's Badge+icon+tone (see below), not a grid.", ja: "読み取り専用の強度グリッド(行列)。操作可能な座席選択は SeatMap。単一の定性レベル表示(混雑度/在庫/レベル)は別＝Badge+icon+tone(下記)でグリッドではない。" } },
            { build: { en: "Qualitative status / level pill (空いています / やや混雑 / 混雑, 在庫 多/少, 鮮度, 信号レベル, pass/detected/fail)", ja: "定性ステータス/レベル表示（空いています/やや混雑/混雑・在庫 多/少・鮮度・信号レベル・合否ゲート）" }, comp: "Badge", slug: "badge", when: { en: "an ordered 2–4 level state shown as one pill — use Badge with a leading `icon` + a semantic variant (success/warning/destructive) so meaning never rides on colour alone. NOT HeatmapChart (that's a read-only intensity GRID). A dedicated StatusLevel/QualitativeStatus primitive (levels[] → tone+icon+colour-safe label) is proposed in #376; until then compose Badge.", ja: "順序づいた2〜4レベルを1つのピルで＝Badge に leading icon ＋ semantic variant(success/warning/destructive)・色のみに依存しない。HeatmapChart(読み取り専用の強度グリッド)ではない。専用の StatusLevel/QualitativeStatus(levels[]→トーン+アイコン+色安全ラベル)は #376 で提案中・当面は Badge で構成。" } },
            { build: { en: "Live entity status BOARD (fleet / equipment / spots — many labeled entities, each a status + location, problems pop, grouped)", ja: "稼働状態盤（車両/機器/区画＝多数のエンティティ・各々 状態＋場所・故障が目立つ・グループ化）" }, comp: "StatusBoard", slug: "status-board", when: { en: "the dispatch/monitoring board: tile grid of entities, colour-safe status pill + tone accent, fault-first sort, group-by-zone with per-group problem count, onSelect. taxi 配車盤 / 駅務 機器盤 / ramp GSE / factory OEE. NOT Gantt (rows×time), NOT DataTable (sortable row grid), NOT HeatmapChart (read-only value-by-colour matrix) — this is a spatial board of selectable status entities.", ja: "配車/監視の盤＝エンティティのタイルグリッド・色安全な状態ピル+トーン・故障優先ソート・エリア別グループ+要対応件数・onSelect。タクシー配車盤/駅務機器盤/ランプGSE/工場OEE。Gantt(行×時間)/DataTable(ソート表)/HeatmapChart(読み取り専用の色塗り行列)ではない＝選択可能な状態エンティティの空間的な盤。" } },
            { build: { en: "Single-bar distribution / calibration", ja: "1本バーの分布・キャリブレーション" }, comp: "DistributionBar", slug: "distribution-bar" },
            { build: { en: "Gauge", ja: "ゲージ" }, comp: "GaugeChart", slug: "gauge-chart" },
        ],
    },
    {
        title: { en: "Approval, sign-off & records", ja: "承認・署名・記録" },
        items: [
            { build: { en: "Multi-stage approval workflow (advance / send-back / reject)", ja: "多段承認ワークフロー（進める/差戻し/却下）" }, comp: "ApprovalWorkflow", slug: "approval-workflow", when: { en: "ringi / expense / review / 内定 / 交付 routing with sign-off.", ja: "稟議/経費/審査/内定/交付。" } },
            { build: { en: "Approval progress display", ja: "承認ステップ表示" }, comp: "ApprovalSteps", slug: "approval-steps" },
            { build: { en: "Multi-step wizard / form progress (対象選択 → 確認 → 完了)", ja: "多段ウィザード/フォームの進捗（対象選択 → 確認 → 完了）" }, comp: "Stepper", slug: "stepper", when: { en: "the step indicator for a checkout / refund / signup / application flow — steps[] of {label,state}, horizontal variant tuned for 375px. The progress display only; you own the wizard state + bottom action bar. Not approval routing (ApprovalSteps) or status tracking (RouteStops).", ja: "決済/払戻し/登録/申込フローの段階表示＝steps[] の {label,state}・横並びは375px最適化。表示のみ(状態とボトムバーは自前)。承認は ApprovalSteps、状態追跡は RouteStops。" } },
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
            { build: { en: "Barcode scan / staged scan flow (OPERATOR captures a code)", ja: "バーコードスキャン・段階スキャン（事業者がコードを読み取る）" }, comp: "ScanInput / ScanGate", slug: "scan-input", when: { en: "the cashier/handler side. To DISPLAY a code to show (boarding pass / coupon / member card) → TicketStub.", ja: "レジ/係員側＝読み取る。提示する券面(搭乗券/クーポン/会員証)は TicketStub。" } },
            { build: { en: "Scannable pass / ticket / coupon / member card to SHOW (barcode/QR + stub券面)", ja: "提示用の券面（搭乗券/eチケット/クーポン/会員証）＝バーコード/QR＋ミシン目" }, comp: "TicketStub", slug: "ticket-stub", when: { en: "value + format (code128/qr) + human-readable label + perforation notch + a content slot (OD-pair/discount/tier). The consumer mirror of ScanInput (display vs capture). Pass `code` for a real scannable barcode.", ja: "value＋format(code128/qr)＋可読ラベル＋ミシン目＋内容スロット(OD/割引/ランク)。ScanInput の消費者側ミラー(提示 vs 読取)。実スキャンは code で差替。" } },
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
