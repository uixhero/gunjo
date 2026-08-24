"use client";

import * as React from "react";
import {
  IconArrowsSplit,
  IconBan,
  IconCircleCheck,
  IconClock,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  DocNote,
  ListCard,
  SegmentedControl,
  StatusLevel,
  Switch,
  compareStatusLevel,
  highestStatusLevel,
  statusLevelStep,
  type StatusLevelStep,
} from "@gunjo/ui";

type Locale = "ja" | "en";

/** 軽い順に1回だけ書く。並べ替えも全体の導出もこの配列から引く。 */
const SERVICE_LEVELS_JA = [
  { value: "normal", label: "平常運転", tone: "success", icon: <IconCircleCheck /> },
  { value: "delay", label: "遅延", tone: "warning", icon: <IconClock /> },
  { value: "detour", label: "迂回", tone: "warning", icon: <IconArrowsSplit /> },
  { value: "suspended", label: "運休", tone: "destructive", icon: <IconBan /> },
] as const satisfies readonly StatusLevelStep[];

const SERVICE_LEVELS_EN = [
  { value: "normal", label: "On time", tone: "success", icon: <IconCircleCheck /> },
  { value: "delay", label: "Delayed", tone: "warning", icon: <IconClock /> },
  { value: "detour", label: "Detour", tone: "warning", icon: <IconArrowsSplit /> },
  { value: "suspended", label: "Suspended", tone: "destructive", icon: <IconBan /> },
] as const satisfies readonly StatusLevelStep[];

const CROWDING_LEVELS_JA = [
  { value: "empty", label: "空いています", tone: "success", icon: <IconUser /> },
  { value: "some", label: "やや混雑", tone: "warning", icon: <IconUsers /> },
  { value: "crowded", label: "混雑", tone: "destructive", icon: <IconUsersGroup /> },
] as const satisfies readonly StatusLevelStep[];

const CROWDING_LEVELS_EN = [
  { value: "empty", label: "Seats available", tone: "success", icon: <IconUser /> },
  { value: "some", label: "Filling up", tone: "warning", icon: <IconUsers /> },
  { value: "crowded", label: "Crowded", tone: "destructive", icon: <IconUsersGroup /> },
] as const satisfies readonly StatusLevelStep[];

const ROUTES_JA = [
  { id: "都06", name: "渋谷駅前〜新橋駅前", level: "delay", note: "約15分遅れ" },
  { id: "宿75", name: "新宿駅西口〜三宅坂", level: "detour", note: "迂回運行" },
  { id: "品98", name: "品川駅港南口〜大井競馬場前", level: "suspended", note: "一部区間運休" },
  { id: "東22", name: "東京駅丸の内北口〜錦糸町駅前", level: "normal", note: "平常運転" },
];

const ROUTES_EN = [
  { id: "06", name: "Shibuya — Shimbashi", level: "delay", note: "About 15 min behind" },
  { id: "75", name: "Shinjuku West — Miyakezaka", level: "detour", note: "Running a detour" },
  { id: "98", name: "Shinagawa — Oi Racecourse", level: "suspended", note: "Part of the route suspended" },
  { id: "22", name: "Tokyo Marunouchi — Kinshicho", level: "normal", note: "On time" },
];

function copyFor(locale: Locale) {
  return locale === "ja"
    ? {
        levels: SERVICE_LEVELS_JA as readonly StatusLevelStep[],
        crowding: CROWDING_LEVELS_JA as readonly StatusLevelStep[],
        routes: ROUTES_JA,
        pick: "いまのレベル",
        mono: "色を落として見る",
        monoHint: "彩度をゼロにしても、段バーで何段目かが数えられます。",
        overall: (label: React.ReactNode) => <>全体の運行状況は「{label}」です（いちばん重い段に合わせています）。</>,
        sorted: "重い順に並べ替えています。",
      }
    : {
        levels: SERVICE_LEVELS_EN as readonly StatusLevelStep[],
        crowding: CROWDING_LEVELS_EN as readonly StatusLevelStep[],
        routes: ROUTES_EN,
        pick: "Current level",
        mono: "Drop the colour",
        monoHint: "With saturation removed the bar still counts the steps.",
        overall: (label: React.ReactNode) => <>Line-wide status is “{label}” — the heaviest step present.</>,
        sorted: "Sorted heaviest first.",
      };
}

function StatusLevelPreview({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const copy = copyFor(locale);
  const levels = copy.levels;
  const [value, setValue] = React.useState<string>("detour");
  const [mono, setMono] = React.useState(false);

  const sorted = React.useMemo(
    () => [...copy.routes].sort((a, b) => compareStatusLevel(levels, b.level, a.level)),
    [copy.routes, levels]
  );
  const overall = highestStatusLevel(levels, copy.routes.map((r) => r.level));
  const overallStep = statusLevelStep(levels, overall);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {!compact ? (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
          <SegmentedControl
            aria-label={copy.pick}
            size="sm"
            options={levels.map((l) => ({ value: l.value, label: l.label }))}
            value={value}
            onValueChange={setValue}
          />
          <div className="flex items-center justify-between gap-3">
            <StatusLevel levels={levels} value={value} size="lg" />
            <Switch checked={mono} onCheckedChange={setMono} label={copy.mono} />
          </div>
          <p className="text-xs text-muted-foreground">{copy.monoHint}</p>
        </div>
      ) : null}

      <div className={mono ? "grayscale" : undefined}>
        <div className="flex flex-col gap-2">
          {sorted.map((route) => (
            <ListCard
              key={route.id}
              leading={<Badge variant="outline">{route.id}</Badge>}
              title={route.name}
              description={route.note}
              severity={statusLevelStep(levels, route.level)?.tone === "destructive" ? "critical" : undefined}
              status={<StatusLevel levels={levels} value={route.level} />}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {copy.overall(overallStep?.label)} {copy.sorted}
        </p>
      </div>
    </div>
  );
}

export default function StatusLevelDocPage() {
  const { locale, sectionLabels } = useLocale();
  const isJa = locale === "ja";
  const content = getDocContent("components/status-level", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.statusLevel.title ?? "StatusLevel";
  const description = content?.description ?? metadata.statusLevel.description ?? "";
  const copy = copyFor(locale);

  const usageCode = isJa
    ? `import { ListCard, StatusLevel, compareStatusLevel, highestStatusLevel } from "@gunjo/ui";

// 段は軽い順に1回だけ書く。並べ替えも全体の導出もこの配列から引く。
const SERVICE_LEVELS = [
  { value: "normal", label: "平常運転", tone: "success" },
  { value: "delay", label: "遅延", tone: "warning" },
  { value: "detour", label: "迂回", tone: "warning" },
  { value: "suspended", label: "運休", tone: "destructive" },
] as const;

const ROUTES = [
  { id: "ke96", name: "品96 品川駅港南口〜八潮パークタウン", note: "平常どおり", level: "normal" },
  { id: "ke98", name: "品98 品川駅港南口〜大井競馬場前", note: "工事のため迂回", level: "detour" },
  { id: "ke99", name: "品99 品川駅高輪口〜五反田駅", note: "終日運休", level: "suspended" },
] as const;

export function ServiceStatusList() {
  // 重い順（運休が上）。
  const sorted = [...ROUTES].sort((a, b) => compareStatusLevel(SERVICE_LEVELS, b.level, a.level));
  // 全体の運行状況＝いちばん重い段。
  const overall = highestStatusLevel(SERVICE_LEVELS, ROUTES.map((r) => r.level));

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((route) => (
        <ListCard
          key={route.id}
          title={route.name}
          description={route.note}
          status={<StatusLevel levels={SERVICE_LEVELS} value={route.level} />}
        />
      ))}
      <p>全体：<StatusLevel levels={SERVICE_LEVELS} value={overall} /></p>
    </div>
  );
}`
    : `import { ListCard, StatusLevel, compareStatusLevel, highestStatusLevel } from "@gunjo/ui";

// Write the scale once, lightest first. Sorting and the roll-up read the same array.
const SERVICE_LEVELS = [
  { value: "normal", label: "On time", tone: "success" },
  { value: "delay", label: "Delayed", tone: "warning" },
  { value: "detour", label: "Detour", tone: "warning" },
  { value: "suspended", label: "Suspended", tone: "destructive" },
] as const;

const ROUTES = [
  { id: "ke96", name: "Route 96 — Shinagawa to Yashio Park Town", note: "Running to schedule", level: "normal" },
  { id: "ke98", name: "Route 98 — Shinagawa to Oi Racecourse", note: "Detoured around roadworks", level: "detour" },
  { id: "ke99", name: "Route 99 — Shinagawa to Gotanda", note: "Suspended all day", level: "suspended" },
] as const;

export function ServiceStatusList() {
  // Heaviest first.
  const sorted = [...ROUTES].sort((a, b) => compareStatusLevel(SERVICE_LEVELS, b.level, a.level));
  // Line-wide status = the heaviest step present.
  const overall = highestStatusLevel(SERVICE_LEVELS, ROUTES.map((r) => r.level));

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((route) => (
        <ListCard
          key={route.id}
          title={route.name}
          description={route.note}
          status={<StatusLevel levels={SERVICE_LEVELS} value={route.level} />}
        />
      ))}
      <p>Overall: <StatusLevel levels={SERVICE_LEVELS} value={overall} /></p>
    </div>
  );
}`;

  const propsData = [
    {
      name: "levels",
      type: "readonly StatusLevelStep[]",
      description: isJa
        ? "段の定義です。軽い順（低い端から高い端へ）に並べます。index 0 が1段目になります。"
        : "The scale, written from the low end to the high end. Index 0 is step 1.",
    },
    {
      name: "value",
      type: "string | null | undefined",
      description: isJa
        ? "いまの段です。levels に無い値のときは unknownLabel を表示します。"
        : "The current step. A value outside levels renders unknownLabel.",
    },
    {
      name: "showBar",
      type: "boolean",
      default: "true",
      description: isJa
        ? "段バーを表示します。色を落としても段が読めるのはこのバーです。"
        : "Shows the step bar — what keeps the level readable without colour.",
    },
    {
      name: "showLabel",
      type: "boolean",
      default: "true",
      description: isJa
        ? "文字チップを表示します。false にするとバーだけになり、ラベルは読み上げにだけ残ります。"
        : "Shows the text chip. When false only the bar renders and the label stays for screen readers.",
    },
    {
      name: "barPosition",
      type: '"start" | "end"',
      default: '"end"',
      description: isJa ? "段バーをチップの前後どちらに置くかです。" : "Places the step bar before or after the chip.",
    },
    {
      name: "size",
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      description: isJa ? "チップと段バーの大きさです。" : "Scale of the chip and the step bar.",
    },
    {
      name: "formatPosition",
      type: "(position, total, step) => string",
      description: isJa
        ? "読み上げ用の位置の言い回しです。既定は「4段階中 3段目」です。"
        : "Screen-reader wording for the position. Defaults to the Japanese N段階中M段目 form.",
    },
    {
      name: "unknownLabel",
      type: "ReactNode",
      default: '"—"',
      description: isJa ? "value が段に無いときの表示です。" : "Rendered when value is not one of levels.",
    },
    {
      name: "chipClassName",
      type: "string",
      description: isJa ? "チップだけに足す className です。一覧の幅そろえに使います。" : "Class applied to the chip only, for aligning status columns.",
    },
    {
      name: "barClassName",
      type: "string",
      description: isJa ? "段バーだけに足す className です。" : "Class applied to the step bar only.",
    },
    {
      name: "statusLevelIndex",
      type: "(levels, value) => number",
      description: isJa ? "いま何番目かを返す純関数です（見つからないときは -1）。" : "Pure helper returning the position, or -1 when the value is off the scale.",
    },
    {
      name: "compareStatusLevel",
      type: "(levels, a, b) => number",
      description: isJa ? "並べ替え用の比較関数です。軽い順に並びます。" : "Comparator for sorting, ascending (lightest first).",
    },
    {
      name: "highestStatusLevel",
      type: "(levels, values) => value | undefined",
      description: isJa ? "いちばん重い段を返します。全体の状況の導出に使います。" : "Returns the heaviest step present — the roll-up derivation.",
    },
    {
      name: "statusLevelStep",
      type: "(levels, value) => StatusLevelStep | undefined",
      description: isJa ? "その段の定義そのものを返します。tone やラベルを引くのに使います。" : "Returns the step object, for reading its tone or label.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "StatusLevel", href: "/docs/components/status-level" },
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "SegmentedControl", href: "/docs/components/segmented-control" },
        { name: "Switch", href: "/docs/components/switch" },
      ]}
      relatedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Stepper", href: "/docs/components/stepper" },
        { name: "ExpiryBadge", href: "/docs/components/expiry-badge" },
        { name: "Meter", href: "/docs/components/meter" },
      ]}
    >
      <ComponentPreview
        code={usageCode}
        codeBlock={<CodeBlock code={usageCode} />}
        sectionLabels={sectionLabels}
        previewHeight="auto"
        previewBodyWidth="md"
      >
        <StatusLevelPreview locale={locale} />
      </ComponentPreview>

      <DocNote
        variant="note"
        heading={isJa ? "Badge との境界 — 順序があるなら StatusLevel、無いなら Badge" : "The Badge boundary — order means StatusLevel, no order means Badge"}
      >
        {isJa ? (
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>順序のある段</strong>（平常運転 &lt; 遅延 &lt; 迂回 &lt; 運休、低 &lt; 中 &lt; 高 &lt; 緊急、空いています &lt;
              やや混雑 &lt; 混雑、good &lt; watch &lt; bad）＝<strong>StatusLevel</strong>。段の重さに順番があり、
              並べ替えや「いちばん重い段」の導出が要るものです。
            </li>
            <li>
              <strong>順序のない状態</strong>（支払済／請求中、下書き／公開、空車／出動中／整備中）＝<strong>Badge</strong>。
              どれが上か決まっていないので、段バーを付けると嘘になります。
            </li>
            <li>
              <strong>工程の位置</strong>（受付 → 審査 → 完了、空席 → 着席 → 会計）＝<strong>Stepper</strong>・
              <strong>ApprovalSteps</strong>・<strong>RouteStops</strong>。順に進みますが、進むほど重くなるわけではありません。
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>Ranked steps</strong> (on time &lt; delayed &lt; detour &lt; suspended; low &lt; medium &lt; high &lt;
              urgent; good &lt; watch &lt; bad) — use <strong>StatusLevel</strong>. The states have a weight order, and you
              need sorting or a “heaviest step” roll-up.
            </li>
            <li>
              <strong>Unordered states</strong> (paid / invoiced, draft / published, available / dispatched / in service) — use{" "}
              <strong>Badge</strong>. Nothing outranks anything, so a step bar would be a lie.
            </li>
            <li>
              <strong>Position in a process</strong> (received → reviewed → done) — use <strong>Stepper</strong>,{" "}
              <strong>ApprovalSteps</strong> or <strong>RouteStops</strong>. Those advance without getting heavier.
            </li>
          </ul>
        )}
      </DocNote>

      <DocNote variant="warning" heading={isJa ? "tone は順序を運びません" : "Tone does not carry the order"}>
        {isJa
          ? "順序を運ぶのは段バーです。tone はその段の重さで、意味トーンは薄いピル3つ（info / success / warning）と塗りつぶし1つ（destructive）＝重さの違う4つでしかなく、段の数だけ用意されていません。同じ tone を2段で使っても、段バーが何段目かを示します。"
          : "The bar carries the order; tone only carries weight. The semantic scale is three subtle pills (info / success / warning) plus one filled tone (destructive) — four weights, not a ladder — so two steps may legitimately share a tone. The bar still shows which step you are on."}
      </DocNote>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {isJa ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "all-steps",
              title: isJa ? "段のすべて" : "Every step",
              description: isJa
                ? "3段の混雑と4段の運行状況。段バーが同じ規則で伸びます。"
                : "A three-step crowding scale and a four-step service scale, filling by the same rule.",
              preview: (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {copy.crowding.map((l) => (
                      <StatusLevel key={l.value} levels={copy.crowding} value={l.value} />
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {copy.levels.map((l) => (
                      <StatusLevel key={l.value} levels={copy.levels} value={l.value} />
                    ))}
                  </div>
                </div>
              ),
              code: isJa
                ? `import { StatusLevel } from "@gunjo/ui";

const CROWDING_LEVELS = [
  { value: "empty", label: "空いています", tone: "success" },
  { value: "some", label: "やや混雑", tone: "warning" },
  { value: "crowded", label: "混雑", tone: "destructive" },
] as const;

const SERVICE_LEVELS = [
  { value: "normal", label: "平常運転", tone: "success" },
  { value: "delay", label: "遅延", tone: "warning" },
  { value: "detour", label: "迂回", tone: "warning" },
  { value: "suspended", label: "運休", tone: "destructive" },
] as const;

export function AllSteps() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={CROWDING_LEVELS} value="empty" />
        <StatusLevel levels={CROWDING_LEVELS} value="some" />
        <StatusLevel levels={CROWDING_LEVELS} value="crowded" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={SERVICE_LEVELS} value="normal" />
        <StatusLevel levels={SERVICE_LEVELS} value="suspended" />
      </div>
    </div>
  );
}`
                : `import { StatusLevel } from "@gunjo/ui";

const CROWDING_LEVELS = [
  { value: "empty", label: "Quiet", tone: "success" },
  { value: "some", label: "Filling up", tone: "warning" },
  { value: "crowded", label: "Crowded", tone: "destructive" },
] as const;

const SERVICE_LEVELS = [
  { value: "normal", label: "On time", tone: "success" },
  { value: "delay", label: "Delayed", tone: "warning" },
  { value: "detour", label: "Detour", tone: "warning" },
  { value: "suspended", label: "Suspended", tone: "destructive" },
] as const;

export function AllSteps() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={CROWDING_LEVELS} value="empty" />
        <StatusLevel levels={CROWDING_LEVELS} value="some" />
        <StatusLevel levels={CROWDING_LEVELS} value="crowded" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={SERVICE_LEVELS} value="normal" />
        <StatusLevel levels={SERVICE_LEVELS} value="suspended" />
      </div>
    </div>
  );
}`,
            },
            {
              key: "greyscale",
              title: isJa ? "色を落としたとき" : "With the colour dropped",
              description: isJa
                ? "彩度をゼロにしても段バーは数えられます。読み上げには「4段階中 3段目」が乗ります。"
                : "Saturation removed, the bar is still countable. Screen readers get the position as words.",
              preview: (
                <div className="grayscale">
                  <div className="flex flex-wrap items-center gap-3">
                    {copy.levels.map((l) => (
                      <StatusLevel key={l.value} levels={copy.levels} value={l.value} />
                    ))}
                  </div>
                </div>
              ),
              code: isJa
                ? `import { StatusLevel } from "@gunjo/ui";

const CROWDING_LEVELS = [
  { value: "empty", label: "空いています", tone: "success" },
  { value: "some", label: "やや混雑", tone: "warning" },
  { value: "crowded", label: "混雑", tone: "destructive" },
] as const;

const SERVICE_LEVELS = [
  { value: "normal", label: "平常運転", tone: "success" },
  { value: "delay", label: "遅延", tone: "warning" },
  { value: "detour", label: "迂回", tone: "warning" },
  { value: "suspended", label: "運休", tone: "destructive" },
] as const;

export function WithoutColour() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grayscale">
        <StatusLevel levels={SERVICE_LEVELS} value="detour" />
      </div>
    </div>
  );
}`
                : `import { StatusLevel } from "@gunjo/ui";

const CROWDING_LEVELS = [
  { value: "empty", label: "Quiet", tone: "success" },
  { value: "some", label: "Filling up", tone: "warning" },
  { value: "crowded", label: "Crowded", tone: "destructive" },
] as const;

const SERVICE_LEVELS = [
  { value: "normal", label: "On time", tone: "success" },
  { value: "delay", label: "Delayed", tone: "warning" },
  { value: "detour", label: "Detour", tone: "warning" },
  { value: "suspended", label: "Suspended", tone: "destructive" },
] as const;

export function WithoutColour() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grayscale">
        <StatusLevel levels={SERVICE_LEVELS} value="detour" />
      </div>
    </div>
  );
}`,
            },
            {
              key: "sizes",
              title: isJa ? "大きさと並び" : "Sizes and layout",
              description: isJa
                ? "sm / default / lg と、段バーの位置、バーだけの密な形です。"
                : "sm / default / lg, the bar position, and the bar-only dense form.",
              preview: (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusLevel levels={copy.levels} value="delay" size="sm" />
                    <StatusLevel levels={copy.levels} value="delay" />
                    <StatusLevel levels={copy.levels} value="delay" size="lg" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusLevel levels={copy.levels} value="suspended" barPosition="start" />
                    <StatusLevel levels={copy.levels} value="suspended" showLabel={false} />
                    <StatusLevel levels={copy.levels} value="unknown-value" />
                  </div>
                </div>
              ),
              code: isJa
                ? `import { StatusLevel } from "@gunjo/ui";

const CROWDING_LEVELS = [
  { value: "empty", label: "空いています", tone: "success" },
  { value: "some", label: "やや混雑", tone: "warning" },
  { value: "crowded", label: "混雑", tone: "destructive" },
] as const;

const SERVICE_LEVELS = [
  { value: "normal", label: "平常運転", tone: "success" },
  { value: "delay", label: "遅延", tone: "warning" },
  { value: "detour", label: "迂回", tone: "warning" },
  { value: "suspended", label: "運休", tone: "destructive" },
] as const;

export function SizesAndLayout() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={SERVICE_LEVELS} value="delay" size="sm" />
        <StatusLevel levels={SERVICE_LEVELS} value="delay" />
        <StatusLevel levels={SERVICE_LEVELS} value="delay" size="lg" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={SERVICE_LEVELS} value="suspended" barPosition="start" />
        <StatusLevel levels={SERVICE_LEVELS} value="suspended" showLabel={false} />
        <StatusLevel levels={SERVICE_LEVELS} value="unknown-value" />
      </div>
    </div>
  );
}`
                : `import { StatusLevel } from "@gunjo/ui";

const CROWDING_LEVELS = [
  { value: "empty", label: "Quiet", tone: "success" },
  { value: "some", label: "Filling up", tone: "warning" },
  { value: "crowded", label: "Crowded", tone: "destructive" },
] as const;

const SERVICE_LEVELS = [
  { value: "normal", label: "On time", tone: "success" },
  { value: "delay", label: "Delayed", tone: "warning" },
  { value: "detour", label: "Detour", tone: "warning" },
  { value: "suspended", label: "Suspended", tone: "destructive" },
] as const;

export function SizesAndLayout() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={SERVICE_LEVELS} value="delay" size="sm" />
        <StatusLevel levels={SERVICE_LEVELS} value="delay" />
        <StatusLevel levels={SERVICE_LEVELS} value="delay" size="lg" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusLevel levels={SERVICE_LEVELS} value="suspended" barPosition="start" />
        <StatusLevel levels={SERVICE_LEVELS} value="suspended" showLabel={false} />
        <StatusLevel levels={SERVICE_LEVELS} value="unknown-value" />
      </div>
    </div>
  );
}`,
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
            {isJa ? "設計の判断" : "Design decisions"}
          </h2>
        </div>
        {isJa ? (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>色だけで段を伝えない。</strong>段バーを常に出しているのは、彩度をゼロにしても
              「何段目か」を数えられるようにするためです。コールドテストで繰り返し出た粗さで、
              UIXHERO の記事にも実例が載っています。
              <br />
              <a
                className="underline underline-offset-4"
                href="https://www.uixhero.com/blog/ai-generated-ui-29-failures#28-状態の違いが色だけに乗る"
                target="_blank"
                rel="noreferrer"
              >
                AIが作った画面で、実際に起きた29の失敗 — 28. 状態の違いが、色だけに乗る
              </a>
            </li>
            <li>
              <strong>段の定義は1か所だけに書く。</strong>並べ替えも「いちばん重い段」の導出も同じ
              配列から引きます。定義が2か所に分かれると、片方が必ず古くなります。
            </li>
            <li>
              <strong>色に頼らない伝え方の考え方</strong>は資料にまとめてあります。
              <br />
              <a
                className="underline underline-offset-4"
                href="https://www.uixhero.com/resources/ui-design/color-independence"
                target="_blank"
                rel="noreferrer"
              >
                色だけに頼らない
              </a>
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Never let colour alone carry the step.</strong> The step bar is always visible so
              that the reading of &ldquo;which step is this?&rdquo; survives with saturation at zero.
              This is a recurring finding in our cold tests, with worked examples written up on
              UIXHERO.
              <br />
              <a
                className="underline underline-offset-4"
                href="https://www.uixhero.com/blog/ai-generated-ui-29-failures#28-状態の違いが色だけに乗る"
                target="_blank"
                rel="noreferrer"
              >
                29 failures we found in AI-generated screens — no. 28, state carried by colour alone
              </a>
            </li>
            <li>
              <strong>Declare the scale in exactly one place.</strong> Sorting and the roll-up both read
              the same array. Split the definition in two and one half will go stale.
            </li>
            <li>
              <strong>The wider reasoning</strong> on communicating without relying on colour:
              <br />
              <a
                className="underline underline-offset-4"
                href="https://www.uixhero.com/resources/ui-design/color-independence"
                target="_blank"
                rel="noreferrer"
              >
                Not relying on colour alone
              </a>
            </li>
          </ul>
        )}
      </section>
    </ComponentLayout>
  );
}
