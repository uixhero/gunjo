"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
  Button,
  DistributionBar,
  DocNote,
  Input,
  ListCard,
  PendingValue,
  PendingValueBadge,
  isPendingValueSettled,
  type PendingValueState,
} from "@gunjo/ui";

type Locale = "ja" | "en";

type Check = { id: string; name: string; state: PendingValueState; result: string };

const CHECKS_JA: Check[] = [
  { id: "dup", name: "重複した申し込み", state: "settled", result: "重なりなし" },
  { id: "existing", name: "有効な既存契約", state: "settled", result: "1件見つかりました" },
  { id: "licence", name: "運転免許証の照会", state: "pending", result: "写しが読み取れません" },
];

const CHECKS_EN: Check[] = [
  { id: "dup", name: "Duplicate application", state: "settled", result: "No overlap" },
  { id: "existing", name: "Existing policy in force", state: "settled", result: "One match found" },
  {
    id: "licence",
    name: "Driving licence lookup",
    state: "pending",
    result: "The scan is unreadable",
  },
];

function copyFor(locale: Locale) {
  return locale === "ja"
    ? {
        checks: CHECKS_JA,
        fieldLabel: "事故の場所",
        placeholder: "市区町村と交差点名など",
        asked: "聞き取りました",
        none: "無いと確認",
        unasked: "まだ聞いていません",
        unaskedNote: "空欄のままだと、聞き忘れなのか無いと答えられたのかが後から分かりません。",
        toNone: "「無いと確認」にする",
        toAsk: "聞き取りに戻す",
        noneBody: "場所は分からない、と確認しました。",
        fault: "過失割合",
        negotiating: "協議中",
        faultNote: "確定するまで、この割合で支払を進められません。",
        ours: "当方",
        theirs: "相手方",
        ratio: "割合",
        checked: "照合が済みました",
        unchecked: "まだ照合できていません",
        tally: (settled: number, rest: number) =>
          `照合が済んだ ${settled}件 ／ まだ済んでいない ${rest}件。破線とアイコンつきの文字で示すので、色を落としても読めます。`,
      }
    : {
        checks: CHECKS_EN,
        fieldLabel: "Where it happened",
        placeholder: "Town and nearest junction",
        asked: "Recorded",
        none: "Confirmed: none",
        unasked: "Not asked yet",
        unaskedNote:
          "Left blank, nobody can tell later whether the question was skipped or answered with a no.",
        toNone: "Mark as confirmed-none",
        toAsk: "Back to asking",
        noneBody: "The caller could not name the place, and we confirmed that.",
        fault: "Fault split",
        negotiating: "Under negotiation",
        faultNote: "Nothing can be paid on this split until it is settled.",
        ours: "Us",
        theirs: "Other party",
        ratio: "Split",
        checked: "Cross-check done",
        unchecked: "Cross-check not run yet",
        tally: (settled: number, rest: number) =>
          `${settled} checked, ${rest} still outstanding. The state rides on a dashed frame and an icon-and-text pill, so it survives greyscale.`,
      };
}

function PendingValuePreview({ locale }: { locale: Locale }) {
  const copy = copyFor(locale);
  const [place, setPlace] = React.useState("");
  const [asked, setAsked] = React.useState(true);

  // 打てば「聞き取った」、消せば「まだ聞いていない」。「無いと確認」は別の状態。
  const placeState: PendingValueState = !asked || place.trim().length > 0 ? "settled" : "pending";
  const settledChecks = copy.checks.filter((check) => isPendingValueSettled(check.state));

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <PendingValue
        id="doc-place"
        state={placeState}
        label={<label htmlFor="doc-place-input">{copy.fieldLabel}</label>}
        statusLabel={placeState === "settled" ? (asked ? copy.asked : copy.none) : copy.unasked}
        note={placeState === "pending" ? copy.unaskedNote : undefined}
        actions={
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={() => setAsked((v) => !v)}
          >
            {asked ? copy.toNone : copy.toAsk}
          </Button>
        }
      >
        {({ describedBy }) =>
          asked ? (
            <Input
              id="doc-place-input"
              aria-describedby={describedBy}
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder={copy.placeholder}
            />
          ) : (
            <p className="text-sm text-foreground">{copy.noneBody}</p>
          )
        }
      </PendingValue>

      <PendingValue
        state="provisional"
        frame="unsettled"
        label={copy.fault}
        statusLabel={copy.negotiating}
        tone="warning"
        note={copy.faultNote}
      >
        <DistributionBar
          segments={[
            { label: copy.ours, value: 70, color: "primary" },
            { label: copy.theirs, value: 30, color: "muted" },
          ]}
          showLegend
          totalLabel={copy.ratio}
          formatValue={(v) => `${v}%`}
        />
      </PendingValue>

      <div className="flex flex-col gap-2">
        {copy.checks.map((check) => (
          <ListCard
            key={check.id}
            title={check.name}
            description={check.result}
            status={
              <PendingValueBadge
                state={check.state}
                size="sm"
                label={isPendingValueSettled(check.state) ? copy.checked : copy.unchecked}
              />
            }
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {copy.tally(settledChecks.length, copy.checks.length - settledChecks.length)}
      </p>
    </div>
  );
}

const USAGE_JA = `import * as React from "react";
import { Button, Input, PendingValue, type PendingValueState } from "@gunjo/ui";

export function AccidentPlaceField() {
  const [place, setPlace] = React.useState("");
  const [asked, setAsked] = React.useState(true);

  // 空欄には2つの意味がある。打てば「聞き取った」、
  // 「無いと確認」は別の答えなので、同じ空欄に畳まない。
  const state: PendingValueState =
    !asked || place.trim().length > 0 ? "settled" : "pending";

  return (
    <PendingValue
      id="place"
      state={state}
      label={<label htmlFor="place-input">事故の場所</label>}
      statusLabel={
        state === "settled"
          ? asked
            ? "聞き取りました"
            : "無いと確認"
          : "まだ聞いていません"
      }
      note={
        state === "pending"
          ? "空欄のままだと、聞き忘れなのか無いと答えられたのかが後から分かりません。"
          : undefined
      }
      actions={
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() => setAsked((v) => !v)}
        >
          {asked ? "「無いと確認」にする" : "聞き取りに戻す"}
        </Button>
      }
    >
      {({ describedBy }) =>
        asked ? (
          <Input
            id="place-input"
            aria-describedby={describedBy}
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="市区町村と交差点名など"
          />
        ) : (
          <p className="text-sm">場所は分からない、と確認しました。</p>
        )
      }
    </PendingValue>
  );
}`;

const USAGE_EN = `import * as React from "react";
import { Button, Input, PendingValue, type PendingValueState } from "@gunjo/ui";

export function AccidentPlaceField() {
  const [place, setPlace] = React.useState("");
  const [asked, setAsked] = React.useState(true);

  // A blank field carries two different meanings. Typing settles it;
  // "confirmed: none" is a different answer, so do not fold them together.
  const state: PendingValueState =
    !asked || place.trim().length > 0 ? "settled" : "pending";

  return (
    <PendingValue
      id="place"
      state={state}
      label={<label htmlFor="place-input">Where it happened</label>}
      statusLabel={
        state === "settled"
          ? asked
            ? "Recorded"
            : "Confirmed: none"
          : "Not asked yet"
      }
      note={
        state === "pending"
          ? "Left blank, nobody can tell later whether the question was " +
            "skipped or answered with a no."
          : undefined
      }
      actions={
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() => setAsked((v) => !v)}
        >
          {asked ? "Mark as confirmed-none" : "Back to asking"}
        </Button>
      }
    >
      {({ describedBy }) =>
        asked ? (
          <Input
            id="place-input"
            aria-describedby={describedBy}
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Town and nearest junction"
          />
        ) : (
          <p className="text-sm">
            The caller could not name the place, and we confirmed that.
          </p>
        )
      }
    </PendingValue>
  );
}`;

const STATES_CODE_JA = `import { PendingValue, PENDING_VALUE_STATES } from "@gunjo/ui";

const WORDING = {
  pending: "まだ照合できていません",
  provisional: "協議中です",
  settled: "照合が済みました",
} as const;

const NOTE = {
  pending: "毎時00分の自動照合の結果を待っています。",
  provisional: "相手方の回答を待っています。まだ支払には進めません。",
  settled: "8月23日 09:14 に自動照合で確認しました。",
} as const;

export function EveryState() {
  return (
    <div className="flex flex-col gap-3">
      {PENDING_VALUE_STATES.map((state) => (
        <PendingValue
          key={state}
          state={state}
          label="有効な既存契約"
          statusLabel={WORDING[state]}
          note={NOTE[state]}
        >
          <p className="text-sm">同じ契約者の有効な契約が1件あります。</p>
        </PendingValue>
      ))}
    </div>
  );
}`;

const STATES_CODE_EN = `import { PendingValue, PENDING_VALUE_STATES } from "@gunjo/ui";

const WORDING = {
  pending: "Cross-check not run yet",
  provisional: "Under negotiation",
  settled: "Cross-check done",
} as const;

const NOTE = {
  pending: "Waiting for the hourly automatic run.",
  provisional: "Waiting on the other party. Nothing can be paid yet.",
  settled: "Confirmed by the automatic run at 09:14 on 23 August.",
} as const;

export function EveryState() {
  return (
    <div className="flex flex-col gap-3">
      {PENDING_VALUE_STATES.map((state) => (
        <PendingValue
          key={state}
          state={state}
          label="Existing policy in force"
          statusLabel={WORDING[state]}
          note={NOTE[state]}
        >
          <p className="text-sm">One policy in force for the same holder.</p>
        </PendingValue>
      ))}
    </div>
  );
}`;

const GREYSCALE_CODE_JA = `import { PendingValue, PendingValueBadge } from "@gunjo/ui";

export function WithoutColour() {
  return (
    <div className="grayscale flex flex-col gap-3">
      <PendingValue state="pending" label="事故の場所" statusLabel="まだ聞いていません">
        <p className="text-sm">—</p>
      </PendingValue>
      <PendingValue state="settled" label="事故の日時" statusLabel="聞き取りました">
        <p className="text-sm">8月21日 10:42</p>
      </PendingValue>
      <div className="flex flex-wrap gap-2">
        <PendingValueBadge state="pending" size="sm" label="まだ照合できていません" />
        <PendingValueBadge state="provisional" size="sm" label="協議中" />
        <PendingValueBadge state="settled" size="sm" label="照合が済みました" />
      </div>
    </div>
  );
}`;

const GREYSCALE_CODE_EN = `import { PendingValue, PendingValueBadge } from "@gunjo/ui";

export function WithoutColour() {
  return (
    <div className="grayscale flex flex-col gap-3">
      <PendingValue state="pending" label="Where it happened" statusLabel="Not asked yet">
        <p className="text-sm">—</p>
      </PendingValue>
      <PendingValue state="settled" label="When it happened" statusLabel="Recorded">
        <p className="text-sm">21 August, 10:42</p>
      </PendingValue>
      <div className="flex flex-wrap gap-2">
        <PendingValueBadge state="pending" size="sm" label="Cross-check not run yet" />
        <PendingValueBadge state="provisional" size="sm" label="Under negotiation" />
        <PendingValueBadge state="settled" size="sm" label="Cross-check done" />
      </div>
    </div>
  );
}`;

const FRAME_CODE_JA = `import { DistributionBar, ListCard, PendingValue, PendingValueBadge } from "@gunjo/ui";

const CHECKS = [
  { id: "dup", name: "重複した申し込み", state: "settled", result: "重なりなし" },
  { id: "licence", name: "運転免許証の照会", state: "pending", result: "写しが読み取れません" },
] as const;

export function FrameModes() {
  return (
    <div className="flex flex-col gap-4">
      {/* frame="unsettled" — 確定したら枠は消える。図や数字をその場で飾るとき。 */}
      <PendingValue
        state="provisional"
        frame="unsettled"
        label="過失割合"
        statusLabel="協議中"
        tone="warning"
        note="確定するまで、この割合で支払を進められません。"
      >
        <DistributionBar
          segments={[
            { label: "当方", value: 70, color: "primary" },
            { label: "相手方", value: 30, color: "muted" },
          ]}
          showLegend
          totalLabel="割合"
          valueFormat="integer"
        />
      </PendingValue>

      {/* 行の中では枠ではなくバッジだけ。 */}
      {CHECKS.map((check) => (
        <ListCard
          key={check.id}
          title={check.name}
          description={check.result}
          status={
            <PendingValueBadge
              state={check.state}
              size="sm"
              label={check.state === "settled" ? "照合が済みました" : "まだ照合できていません"}
            />
          }
        />
      ))}
    </div>
  );
}`;

const FRAME_CODE_EN = `import { DistributionBar, ListCard, PendingValue, PendingValueBadge } from "@gunjo/ui";

const CHECKS = [
  { id: "dup", name: "Duplicate application", state: "settled", result: "No overlap" },
  {
    id: "licence",
    name: "Driving licence lookup",
    state: "pending",
    result: "The scan is unreadable",
  },
] as const;

export function FrameModes() {
  return (
    <div className="flex flex-col gap-4">
      {/* frame="unsettled" leaves nothing behind once settled,
          for decorating a chart in place. */}
      <PendingValue
        state="provisional"
        frame="unsettled"
        label="Fault split"
        statusLabel="Under negotiation"
        tone="warning"
        note="Nothing can be paid on this split until it is settled."
      >
        <DistributionBar
          segments={[
            { label: "Us", value: 70, color: "primary" },
            { label: "Other party", value: 30, color: "muted" },
          ]}
          showLegend
          totalLabel="Split"
          valueFormat="integer"
        />
      </PendingValue>

      {/* Inside a row the pill stands alone — a frame would be wrong there. */}
      {CHECKS.map((check) => (
        <ListCard
          key={check.id}
          title={check.name}
          description={check.result}
          status={
            <PendingValueBadge
              state={check.state}
              size="sm"
              label={
                check.state === "settled" ? "Cross-check done" : "Cross-check not run yet"
              }
            />
          }
        />
      ))}
    </div>
  );
}`;

export default function PendingValueDocPage() {
  const { locale, sectionLabels } = useLocale();
  const isJa = locale === "ja";
  const content = getDocContent("components/pending-value", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.pendingValue.title ?? "PendingValue";
  const description = content?.description ?? metadata.pendingValue.description ?? "";
  const copy = copyFor(locale);

  const usageCode = isJa ? USAGE_JA : USAGE_EN;

  const propsData = [
    {
      name: "state",
      type: '"pending" | "provisional" | "settled"',
      default: '"pending"',
      description: isJa
        ? "確定のぐあいです。pending は中身がまだ無い、provisional は中身はあるが確定していない、settled は確定した、です。既定が pending なので、渡し忘れても確定したようには見えません。"
        : "How settled it is. pending means nothing is there yet, provisional means there is a value but it is not final, settled means it is fixed. The default is pending, so a forgotten prop never reads as confirmed.",
    },
    {
      name: "label",
      type: "ReactNode",
      description: isJa
        ? "項目名です。バッジの左に出ます。入力欄を包むときは <label htmlFor> を渡します。"
        : "The item's name, shown to the left of the pill. Pass a <label htmlFor> when you wrap a form control.",
    },
    {
      name: "statusLabel",
      type: "ReactNode",
      description: isJa
        ? "バッジの文字です。「なぜ確定していないか」を書きます。省略すると 未確定 / 暫定 / 確定 になります。"
        : "The pill wording — say why it is not settled. Defaults to 未確定 / 暫定 / 確定.",
    },
    {
      name: "note",
      type: "ReactNode",
      description: isJa
        ? "確定していないあいだ何ができないか、確定したなら いつ誰が。id を渡すと aria-describedby につながります。"
        : "What being unsettled blocks, or when and by whom it was settled. Wired to aria-describedby when id is set.",
    },
    {
      name: "actions",
      type: "ReactNode",
      description: isJa
        ? "注記の下に置くボタンです。「無いと確認」「分からない」「まだに戻す」など、逃げ道を並べます。"
        : "Buttons under the note — the escape hatches such as confirmed-none, don't know, or back to pending.",
    },
    {
      name: "frame",
      type: '"always" | "unsettled" | "none"',
      default: '"always"',
      description: isJa
        ? "枠を描く条件です。always は未確定なら破線・確定なら実線で、列に並べても外形がそろいます。unsettled は確定したら枠を描きません。"
        : "When to draw the frame. always is dashed while unsettled and solid once settled, keeping one outline down a column. unsettled draws nothing once settled.",
    },
    {
      name: "tone",
      type: "SemanticTone",
      description: isJa
        ? "バッジのトーンです。既定は pending / provisional が中立、settled が success です。急かす必要が本当にあるときだけ渡します。"
        : "Pill tone. Neutral for pending and provisional, success for settled. Pass one only when the screen really must escalate.",
    },
    {
      name: "hideBadge",
      type: "boolean",
      default: "false",
      description: isJa
        ? "バッジを出しません。自分で PendingValueBadge を別の場所に置くときに使います。"
        : "Hides the pill, for when you place a PendingValueBadge yourself.",
    },
    {
      name: "size",
      type: '"sm" | "default"',
      default: '"default"',
      description: isJa ? "枠の余白とバッジの大きさです。" : "Frame padding and pill scale.",
    },
    {
      name: "children",
      type: "ReactNode | ((context) => ReactNode)",
      description: isJa
        ? "中身です。関数を渡すと { statusId, noteId, describedBy } を受け取れるので、包んだ入力欄に aria-describedby をつなげられます。"
        : "The content. Pass a function to receive { statusId, noteId, describedBy } and wire aria-describedby onto the control you wrapped.",
    },
    {
      name: "PendingValueBadge",
      type: "{ state, label, icon, tone, size }",
      description: isJa
        ? "バッジ単体です。表の升目や一覧の行のように、枠を描くと邪魔になるところで使います。"
        : "The pill on its own, for a table cell or list row where a frame would be wrong.",
    },
    {
      name: "pendingValueLabel",
      type: "(state) => string",
      description: isJa ? "その状態の既定の語（未確定 / 暫定 / 確定）を返します。" : "Returns the default wording for a state.",
    },
    {
      name: "isPendingValueSettled",
      type: "(state) => boolean",
      description: isJa
        ? "settled のときだけ true です。「済んだN件 / まだN件」に分けるときに使います。"
        : "True only for settled — the predicate behind splitting a list into done and outstanding.",
    },
    {
      name: "PENDING_VALUE_STATES",
      type: "readonly PendingValueState[]",
      description: isJa ? "状態を確定していない順に並べた配列です。" : "Every state, least settled first.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "PendingValue", href: "/docs/components/pending-value" },
        { name: "DistributionBar", href: "/docs/components/distribution-bar" },
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "Input", href: "/docs/components/input" },
        { name: "Button", href: "/docs/components/button" },
      ]}
      relatedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "StatusLevel", href: "/docs/components/status-level" },
        { name: "ExpiryBadge", href: "/docs/components/expiry-badge" },
        { name: "EmptyState", href: "/docs/components/empty-state" },
        { name: "ApprovalSteps", href: "/docs/components/approval-steps" },
      ]}
    >
      <ComponentPreview
        code={usageCode}
        codeBlock={<CodeBlock code={usageCode} />}
        sectionLabels={sectionLabels}
        previewHeight="auto"
        previewBodyWidth="md"
      >
        <PendingValuePreview locale={locale} />
      </ComponentPreview>

      <DocNote
        variant="note"
        heading={
          isJa
            ? "空欄には2つの意味がある — どちらなのかを持たせる"
            : "A blank field means two different things — carry which one"
        }
      >
        {isJa ? (
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>値がまだ無い</strong>（まだ聞いていない・まだ照合していない・根拠がそろっていない）＝
              <strong>pending</strong>。作業の残りです。
            </li>
            <li>
              <strong>値はあるが確定していない</strong>（案・暫定・協議中・概算）＝<strong>provisional</strong>。
              数字は出せますが、それで先へ進めてはいけない段です。
            </li>
            <li>
              <strong>確定した</strong>＝<strong>settled</strong>。「無いと確認した」も答えなので、
              こちらに入ります。⚠️ 空欄に戻さないでください。
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>Nothing is there yet</strong> (not asked, not cross-checked, evidence not gathered) —{" "}
              <strong>pending</strong>. This is outstanding work.
            </li>
            <li>
              <strong>There is a value but it is not final</strong> (a proposal, an estimate, under negotiation) —{" "}
              <strong>provisional</strong>. You can show the number; you cannot act on it.
            </li>
            <li>
              <strong>Settled</strong> — <strong>settled</strong>. &ldquo;Confirmed: none&rdquo; is an answer too, so it
              belongs here. Do not send it back to being blank.
            </li>
          </ul>
        )}
      </DocNote>

      <DocNote
        variant="warning"
        heading={
          isJa
            ? "未確定は重大度ではありません"
            : "Not-yet-settled is not a severity"
        }
      >
        {isJa
          ? "SemanticTone は「どれくらいまずいか」の一本道で、確からしさの軸を持ちません。だから未確定を既存のトーンに載せると、成功に見えるか注意に見えるかのどちらかになります。この部品の pending と provisional は既定で中立です。未完了は間違いではないからで、警告色で塗ると聞き取りの画面が急かす画面に変わります。トーンを渡すのは、その画面で本当に止める必要があるときだけにしてください。"
          : "SemanticTone is a single how-bad axis with no room for how-certain, so an unsettled value pushed onto it ends up looking either successful or alarming. Here pending and provisional are neutral by default: unfinished is not wrong, and painting it warning turns a hearing form into a nag. Pass tone only when that screen genuinely has to stop someone."}
      </DocNote>

      <DocNote
        variant="note"
        heading={isJa ? "近い部品との境目" : "Where the neighbours start"}
      >
        {isJa ? (
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>順序のある段</strong>（空いています &lt; やや混雑 &lt; 混雑）＝<strong>StatusLevel</strong>。
              確定のぐあいには重さの順がありません。
            </li>
            <li>
              <strong>工程の位置</strong>（受付 → 審査 → 完了）＝<strong>Stepper</strong>・
              <strong>ApprovalSteps</strong>。1本の流れに全部が乗るときです。
            </li>
            <li>
              <strong>一覧そのものが空</strong>＝<strong>EmptyState</strong>。こちらは項目ごとの空です。
            </li>
            <li>
              <strong>日付 対 期限</strong>＝<strong>ExpiryBadge</strong>。同じ「X 対 Y」の一族で、
              こちらは「値 対 確定」です。
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>A ranked scale</strong> (quiet &lt; filling up &lt; crowded) — <strong>StatusLevel</strong>.
              Settledness has no weight order.
            </li>
            <li>
              <strong>Position in a process</strong> (received → reviewed → done) — <strong>Stepper</strong> or{" "}
              <strong>ApprovalSteps</strong>, for when everything rides one flow.
            </li>
            <li>
              <strong>The whole list is empty</strong> — <strong>EmptyState</strong>. This one is per item.
            </li>
            <li>
              <strong>A date against a deadline</strong> — <strong>ExpiryBadge</strong>. Same &ldquo;X vs Y&rdquo;
              family; this is value vs settled.
            </li>
          </ul>
        )}
      </DocNote>

      <section className="space-y-4">
        <h2
          className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
          id="states"
        >
          {isJa ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "every-state",
              title: isJa ? "3つの状態" : "All three states",
              description: isJa
                ? "未確定と暫定は破線、確定は実線。第一の見分けは色ではなく線です。"
                : "Pending and provisional are dashed, settled is solid. The first cue is the line, not the colour.",
              preview: (
                <div className="flex w-full max-w-md flex-col gap-3">
                  <PendingValue
                    state="pending"
                    label={isJa ? "有効な既存契約" : "Existing policy in force"}
                    statusLabel={copy.unchecked}
                    note={
                      isJa
                        ? "毎時00分の自動照合の結果を待っています。"
                        : "Waiting for the hourly automatic run."
                    }
                  >
                    <p className="text-sm text-muted-foreground">—</p>
                  </PendingValue>
                  <PendingValue
                    state="provisional"
                    label={isJa ? "有効な既存契約" : "Existing policy in force"}
                    statusLabel={copy.negotiating}
                    note={
                      isJa
                        ? "相手方の回答を待っています。まだ支払には進めません。"
                        : "Waiting on the other party. Nothing can be paid yet."
                    }
                  >
                    <p className="text-sm">
                      {isJa ? "同じ契約者の有効な契約が1件あります。" : "One policy in force for the same holder."}
                    </p>
                  </PendingValue>
                  <PendingValue
                    state="settled"
                    label={isJa ? "有効な既存契約" : "Existing policy in force"}
                    statusLabel={copy.checked}
                    note={
                      isJa
                        ? "8月23日 09:14 に自動照合で確認しました。"
                        : "Confirmed by the automatic run at 09:14 on 23 August."
                    }
                  >
                    <p className="text-sm">
                      {isJa ? "同じ契約者の有効な契約が1件あります。" : "One policy in force for the same holder."}
                    </p>
                  </PendingValue>
                </div>
              ),
              code: isJa ? STATES_CODE_JA : STATES_CODE_EN,
            },
            {
              key: "greyscale",
              title: isJa ? "色を落としたとき" : "With the colour dropped",
              description: isJa
                ? "彩度をゼロにしても、破線か実線か・アイコンつきの文字で読めます。"
                : "With saturation at zero the dashed-or-solid line and the icon-and-text pill still read.",
              preview: (
                <div className="grayscale flex w-full max-w-md flex-col gap-3">
                  <PendingValue
                    state="pending"
                    label={copy.fieldLabel}
                    statusLabel={copy.unasked}
                  >
                    <p className="text-sm text-muted-foreground">—</p>
                  </PendingValue>
                  <PendingValue
                    state="settled"
                    label={isJa ? "事故の日時" : "When it happened"}
                    statusLabel={copy.asked}
                  >
                    <p className="text-sm">{isJa ? "8月21日 10:42" : "21 August, 10:42"}</p>
                  </PendingValue>
                  <div className="flex flex-wrap gap-2">
                    <PendingValueBadge state="pending" size="sm" label={copy.unchecked} />
                    <PendingValueBadge state="provisional" size="sm" label={copy.negotiating} />
                    <PendingValueBadge state="settled" size="sm" label={copy.checked} />
                  </div>
                </div>
              ),
              code: isJa ? GREYSCALE_CODE_JA : GREYSCALE_CODE_EN,
            },
            {
              key: "frames",
              title: isJa ? "枠の描き方と、バッジ単体" : "Frame modes, and the pill alone",
              description: isJa
                ? "図や数字をその場で飾るなら frame=\"unsettled\"、一覧の行なら PendingValueBadge です。"
                : 'Use frame="unsettled" to decorate a chart in place, and PendingValueBadge inside a list row.',
              preview: (
                <div className="flex w-full max-w-md flex-col gap-4">
                  <PendingValue
                    state="provisional"
                    frame="unsettled"
                    label={copy.fault}
                    statusLabel={copy.negotiating}
                    tone="warning"
                    note={copy.faultNote}
                  >
                    <DistributionBar
                      segments={[
                        { label: copy.ours, value: 70, color: "primary" },
                        { label: copy.theirs, value: 30, color: "muted" },
                      ]}
                      showLegend
                      totalLabel={copy.ratio}
                      valueFormat="integer"
                    />
                  </PendingValue>
                  {copy.checks.slice(0, 2).map((check) => (
                    <ListCard
                      key={check.id}
                      title={check.name}
                      description={check.result}
                      status={
                        <PendingValueBadge
                          state={check.state}
                          size="sm"
                          label={isPendingValueSettled(check.state) ? copy.checked : copy.unchecked}
                        />
                      }
                    />
                  ))}
                </div>
              ),
              code: isJa ? FRAME_CODE_JA : FRAME_CODE_EN,
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2
          className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
          id="props"
        >
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
              <strong>状態を色に載せない。</strong>第一の見分けは破線か実線かで、バッジは必ずアイコンと文字が対に
              なります。彩度をゼロにしても読めることを、状態とバリエーションの2番目で確かめられます。
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
            <li>
              <strong>確からしさの軸を、重さの軸から切り離した。</strong>未確定を SemanticTone に載せると、
              成功か注意のどちらかに化けます。別の prop にしたので、同じ画面で「重大だがもう確定した」と
              「軽いがまだ未確定」を同時に出せます。
            </li>
            <li>
              <strong>既定を pending にした。</strong>渡し忘れたときに確定して見えるより、未確定に見えて
              画面で気づけるほうが安全だからです。
            </li>
            <li>
              <strong>状態を3つに固定し、語は呼び手に預けた。</strong>コールドテストの3画面はそれぞれ
              2値・4値・3値を手組みしていましたが、割れていたのは語（まだ聞いていない／まだ照合していない／
              まだ決まっていない）のほうで、形は同じでした。だから語は <code>statusLabel</code> で渡します。
            </li>
            <li>
              <strong>この形の記事はまだ書いていません。</strong>「値が無い理由が2通りあると、空欄では足りなくなる」
              の解説は UIXHERO に未掲載です（#910）。いまの根拠は、独立した3つのコールドテスト
              — 申込受付（まだ照合していない）・事故受付（まだ聞いていない）・損害調査（過失割合が未確定）
              — で、うち2つが独立に破線の枠へ行き着いたことです。
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Never put the state on colour.</strong> The first cue is dashed versus solid, and the pill
              always pairs an icon with text. The second demo above is the greyscale proof.
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
            <li>
              <strong>Keep how-certain off the how-bad axis.</strong> Folded into SemanticTone, an unsettled value
              turns into either success or warning. As its own prop, one screen can show &ldquo;severe but
              settled&rdquo; next to &ldquo;minor and still open&rdquo;.
            </li>
            <li>
              <strong>Default to pending.</strong> A forgotten prop that reads as unsettled is visible on screen;
              one that reads as confirmed is not.
            </li>
            <li>
              <strong>Three states, but the wording belongs to the caller.</strong> The three cold-test screens
              hand-rolled two, four, and three states — what differed was the wording (not asked / not
              cross-checked / not agreed), not the shape. So the wording arrives through <code>statusLabel</code>.
            </li>
            <li>
              <strong>The article for this one is not written yet.</strong> The write-up of &ldquo;when a value can
              be missing for two different reasons, blank is not enough&rdquo; is still to come on UIXHERO (issue #910).
              The evidence today is three independent cold tests — an application desk, an accident intake, and a
              loss survey — two of which independently arrived at the same dashed frame.
            </li>
          </ul>
        )}
      </section>
    </ComponentLayout>
  );
}
