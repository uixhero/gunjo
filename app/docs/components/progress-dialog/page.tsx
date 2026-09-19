"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { ProgressDialogDemo } from "@/components/demos/ProgressWaitDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import overlayMetadata from "@design/overlay-metadata.json";
import { DocNote } from "@gunjo/ui";

export default function ProgressDialogDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const t = (ja: string, en: string) => (isJa ? ja : en);
    const content = getDocContent("components/progress-dialog", locale);
    const metadata = overlayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.progressDialog.title ?? "ProgressDialog";
    const description = content?.description ?? metadata.progressDialog.description ?? "";

    const usageCode = `import * as React from "react";
import { Badge, Button, ProgressDialog } from "@gunjo/ui";

const STEPS = ${t('["会議の前提を読み取っています", "発言を要点に分けています", "議事録の形に整えています"]', '["Reading the meeting context", "Sorting remarks into points", "Shaping the minutes"]')};
const SCENE = "/demos/progress-dialog/meeting-minutes.svg";
const SCENE_STILL = "/demos/progress-dialog/meeting-minutes-still.svg";

export function CreateMinutes() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [result, setResult] = React.useState("");
  const timer = React.useRef<number | null>(null);

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  };

  const start = () => {
    stop();
    setStep(0);
    setResult("");
    setOpen(true);
    let current = 0;
    timer.current = window.setInterval(() => {
      current += 1;
      if (current >= STEPS.length) {
        stop();
        setOpen(false);
        setResult("${t("議事録ができました。", "The minutes are ready.")}");
        return;
      }
      setStep(current);
    }, 2200);
  };

  const cancel = () => {
    stop();
    setOpen(false);
    setResult("${t("作成をやめました。入力内容は残っています。", "Stopped. Your input is still here.")}");
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Button onClick={start}>${t("議事録を作る", "Create minutes")}</Button>
      <p className="text-sm text-muted-foreground" role="status">{result}</p>
      <ProgressDialog
        variant="overlay"
        open={open}
        badge={<Badge variant="secondary">${t("AIで作成中", "Generating with AI")}</Badge>}
        title="${t("会議を議事録にまとめています", "Turning the meeting into minutes")}"
        description="${t("数十秒かかることがあります。この画面のままお待ちください。", "This can take a few dozen seconds. Please keep this screen open.")}"
        media={
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={SCENE_STILL} />
            <img src={SCENE} alt="" />
          </picture>
        }
        statusLabel="${t("いまの作業", "Now")}"
        status={STEPS[step]}
        onCancel={cancel}
        cancelLabel="${t("作成をやめる", "Stop")}"
        cancelNote="${t("やめても入力内容はこの画面に残ります。", "Your input stays on this screen if you stop.")}"
      />
    </div>
  );
}`;

    const asideCode = `import * as React from "react";
import { Badge, Button, ProgressDialog } from "@gunjo/ui";

const SCENE = "/demos/progress-dialog/trip-plan.svg";
const SCENE_STILL = "/demos/progress-dialog/trip-plan-still.svg";

export function WithSlot() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 6000);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setOpen(true)}>${t("旅の計画を作る", "Plan the trip")}</Button>
      <ProgressDialog
        variant="overlay"
        open={open}
        badge={<Badge variant="secondary">${t("AIで作成中", "Generating with AI")}</Badge>}
        title="${t("旅の計画を組み立てています", "Putting the trip plan together")}"
        media={
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={SCENE_STILL} />
            <img src={SCENE} alt="" />
          </picture>
        }
        statusLabel="${t("いまの作業", "Now")}"
        status="${t("移動の順番を考えています", "Working out the order of stops")}"
        aside={
          <div className="rounded-md border p-4 text-left text-sm">
            <p className="font-medium">${t("待っているあいだに", "While you wait")}</p>
            <p className="mt-1 text-muted-foreground">
              ${t("できあがった計画は、あとから一覧でも開けます。", "You can reopen the finished plan from the list later.")}
            </p>
          </div>
        }
        onCancel={() => setOpen(false)}
        cancelLabel="${t("作成をやめる", "Stop")}"
      />
    </div>
  );
}`;

    const knownCode = `import * as React from "react";
import { Button, ProgressDialog } from "@gunjo/ui";

const TOTAL = 5;
const SCENE = "/demos/progress-dialog/meeting-minutes.svg";
const SCENE_STILL = "/demos/progress-dialog/meeting-minutes-still.svg";

export function KnownCount() {
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      setDone((n) => {
        if (n + 1 >= TOTAL) {
          window.clearInterval(timer);
          setOpen(false);
          return 0;
        }
        return n + 1;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setOpen(true)}>${t("録音を読み込む", "Import recordings")}</Button>
      <ProgressDialog
        open={open}
        title="${t("録音を読み込んでいます", "Importing recordings")}"
        media={
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={SCENE_STILL} />
            <img src={SCENE} alt="" />
          </picture>
        }
        statusLabel="${t("いまの作業", "Now")}"
        status={\`${t("${done + 1} 件目の録音を読み込んでいます", "Reading recording ${done + 1}")}\`}
        value={done}
        max={TOTAL}
        valueText={\`${t("${TOTAL} 件中 ${done} 件完了", "${done} of ${TOTAL} recordings done")}\`}
        onCancel={() => setOpen(false)}
        cancelLabel="${t("読み込みをやめる", "Stop")}"
      />
    </div>
  );
}`;

    const noCancelCode = `import * as React from "react";
import { Button, ProgressDialog } from "@gunjo/ui";

const SCENE = "/demos/progress-dialog/meeting-minutes.svg";
const SCENE_STILL = "/demos/progress-dialog/meeting-minutes-still.svg";

export function NoCancel() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 4500);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setOpen(true)}>${t("議事録を作る", "Create minutes")}</Button>
      <ProgressDialog
        open={open}
        title="${t("会議を議事録にまとめています", "Turning the meeting into minutes")}"
        media={
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={SCENE_STILL} />
            <img src={SCENE} alt="" />
          </picture>
        }
        status="${t("議事録の形に整えています", "Shaping the minutes")}"
      />
    </div>
  );
}`;

    const reducedCode = `import * as React from "react";
import { Badge, Button, Label, ProgressDialog, Switch } from "@gunjo/ui";

const STEPS = ${t('["会議の前提を読み取っています", "発言を要点に分けています", "議事録の形に整えています"]', '["Reading the meeting context", "Sorting remarks into points", "Shaping the minutes"]')};
const SCENE = "/demos/progress-dialog/meeting-minutes.svg";
const SCENE_STILL = "/demos/progress-dialog/meeting-minutes-still.svg";

function CreateMinutes(props: { still?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [result, setResult] = React.useState("");
  const timer = React.useRef<number | null>(null);

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  };

  const start = () => {
    stop();
    setStep(0);
    setResult("");
    setOpen(true);
    let current = 0;
    timer.current = window.setInterval(() => {
      current += 1;
      if (current >= STEPS.length) {
        stop();
        setOpen(false);
        setResult("${t("議事録ができました。", "The minutes are ready.")}");
        return;
      }
      setStep(current);
    }, 2200);
  };

  const cancel = () => {
    stop();
    setOpen(false);
    setResult("${t("作成をやめました。入力内容は残っています。", "Stopped. Your input is still here.")}");
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Button onClick={start}>${t("議事録を作る", "Create minutes")}</Button>
      <p className="text-sm text-muted-foreground" role="status">{result}</p>
      <ProgressDialog
        variant="overlay"
        open={open}
        badge={<Badge variant="secondary">${t("AIで作成中", "Generating with AI")}</Badge>}
        title="${t("会議を議事録にまとめています", "Turning the meeting into minutes")}"
        description="${t("数十秒かかることがあります。この画面のままお待ちください。", "This can take a few dozen seconds. Please keep this screen open.")}"
        media={
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={SCENE_STILL} />
            <img src={props.still ? SCENE_STILL : SCENE} alt="" />
          </picture>
        }
        statusLabel="${t("いまの作業", "Now")}"
        status={STEPS[step]}
        onCancel={cancel}
        cancelLabel="${t("作成をやめる", "Stop")}"
        cancelNote="${t("やめても入力内容はこの画面に残ります。", "Your input stays on this screen if you stop.")}"
      />
    </div>
  );
}

export function ReduceMotionDemo() {
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (reduce) root.dataset.motion = "reduce";
    else delete root.dataset.motion;
  }, [reduce]);

  return (
    <div className="flex flex-col items-center gap-2">
      <CreateMinutes still={reduce} />
      <div className="flex items-center gap-2">
        <Switch id="reduce-motion" checked={reduce} onCheckedChange={setReduce} />
        <Label htmlFor="reduce-motion">${t("動きを減らす", "Reduce motion")}</Label>
      </div>
    </div>
  );
}`;

    const propsData = [
        { name: "variant", type: '"default" | "overlay"', default: '"default"', description: t("overlay は札・題・説明を絵の上に重ねます。既定は絵の下。", "overlay puts badge, title and description on the media; default puts them below.") },
        { name: "badge", type: "ReactNode", description: t("題の上の札（Badge など）。", "A label above the title, e.g. a Badge.") },
        { name: "open", type: "boolean", description: t("開いているか。", "Whether it is open.") },
        { name: "title", type: "ReactNode", description: t("題。ダイアログの名前として読み上げられます。", "Title; the dialog's accessible name.") },
        { name: "description", type: "ReactNode", description: t("題の下の説明。DialogDescription になります。", "Text under the title; the DialogDescription.") },
        { name: "status", type: "ReactNode", description: t("いまの状態を言葉で。読み上げ領域（role=\"status\"）に入ります。", "The current state in words, in a role=\"status\" region.") },
        { name: "statusLabel", type: "ReactNode", description: t("状態の上の小見出し。", "Small caption above the status.") },
        { name: "media", type: "ReactNode", description: t("16:9 の絵。img・svg・video など。", "A 16:9 visual: img, svg, video.") },
        { name: "value", type: "number", description: t("進み具合。分かるときだけ渡します。", "Completion, only when known.") },
        { name: "max", type: "number", default: "100", description: t("value の上限。", "Upper bound for value.") },
        { name: "valueText", type: "string", description: t("value の読み上げ文（例: 5 件中 3 件完了）。", "Spoken form of value, e.g. \"3 of 5 files\".") },
        { name: "aside", type: "ReactNode", description: t("状態の下に置く補助の枠。", "Slot below the status.") },
        { name: "onCancel", type: "() => void", description: t("渡すとキャンセルのボタンが出ます。", "Adds a cancel button.") },
        { name: "cancelLabel", type: "ReactNode", default: '"Cancel"', description: t("キャンセルのボタンの文字。", "Cancel button label.") },
        { name: "cancelNote", type: "ReactNode", description: t("ボタンの横の短い注記。", "Short note beside the button.") },
        { name: "portalContainer", type: "HTMLElement | null", description: t("ポータルで描画する先の要素。既定は document.body。", "Where to render. Defaults to document.body.") },
        { name: "className", type: "string", description: t("DialogContent に足すクラス。", "Extra classes for DialogContent.") },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            relatedComponents={[
                {
                    name: "ActionProgress",
                    href: "/docs/components/action-progress",
                    boundary: t("数秒で終わる処理向け。絵も補助の枠もキャンセルも無い。", "For work that ends in seconds; no visual, slot or cancel."),
                },
                {
                    name: "RouteProgress",
                    href: "/docs/components/route-progress",
                    boundary: t("ページの移動中に上端へ出す細いバー。画面を塞がない。", "A thin bar at the top while a page loads; blocks nothing."),
                },
                {
                    name: "Progress",
                    href: "/docs/components/progress",
                    boundary: t("バーだけ。画面の中に置き、操作は止めない。", "The bar alone, placed inline; it blocks nothing."),
                },
                {
                    name: "Dialog",
                    href: "/docs/components/dialog",
                    boundary: t("利用者が閉じられる、ふつうのダイアログ。", "An ordinary dialog the user can close."),
                },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="lg"
            >
                <ProgressDialogDemo />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={t("進み具合が分からないなら、数字を出しません", "No number when you do not know the progress")}
            >
                {t(
                    "value を渡さないと、バーは端から端へ流れるだけで、％も読み上げの値も出しません。経過時間から割合を作ると、止まっているのに進んで見えるためです。状態の文も、処理から本当に知らせが届いたときに替えてください。",
                    "Without value the bar only sweeps, with no percentage and no spoken value. A ratio made from elapsed time looks like progress even when the work has stalled. Change the status text only when your work actually reports a new step."
                )}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {t("状態とバリエーション", "States and variants")}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "aside",
                            title: t("補助の枠あり", "With a slot"),
                            description: t(
                                "aside に渡したものを、状態の下にそのまま置きます。",
                                "Whatever you pass to aside sits below the status as-is."
                            ),
                            preview: <ProgressDialogDemo variant="aside" />,
                            previewBodyWidth: "lg",
                            code: asideCode,
                        },
                        {
                            key: "known",
                            title: t("件数が分かるとき", "When the count is known"),
                            description: t(
                                "処理が「5 件中 3 件」のように数を返すなら、value と max を渡します。",
                                "If the work reports a count, pass value and max."
                            ),
                            preview: <ProgressDialogDemo variant="known" />,
                            previewBodyWidth: "lg",
                            code: knownCode,
                        },
                        {
                            key: "no-cancel",
                            title: t("キャンセルなし", "No cancel"),
                            description: t(
                                "onCancel を渡さない形です。やめられない処理に使います。",
                                "No onCancel: for work that cannot be stopped."
                            ),
                            preview: <ProgressDialogDemo variant="no-cancel" />,
                            previewBodyWidth: "lg",
                            code: noCancelCode,
                        },
                        {
                            key: "reduced-motion",
                            title: t("動きを減らす設定", "Reduced motion"),
                            description: t(
                                "流れるバーは止まり、全幅の淡い色の帯になります。絵は、呼び出し側が用意した止めた版の SVG に、picture の source で替えます。",
                                "The sweep stops and becomes a still, dimmed bar. The media swaps, via a picture source, to a still SVG you provide."
                            ),
                            preview: <ProgressDialogDemo motionToggle />,
                            previewBodyWidth: "lg",
                            code: reducedCode,
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
                        {t("設計の判断", "Design decisions")}
                    </h2>
                </div>
                <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                    <li>
                        <strong>{t("利用者の操作では閉じません。", "The user cannot dismiss it.")}</strong>
                        {t(
                            "Esc と外側のクリックでは閉じず、右上の閉じるボタンも出しません。うっかり閉じると、処理が続いているのか分からなくなるためです。",
                            " Escape and outside clicks do not close it, and there is no close button: closed by accident, the user cannot tell whether the work is still running."
                        )}
                    </li>
                    <li>
                        <strong>{t("進み具合は言葉で伝えます。", "Progress is told in words.")}</strong>
                        {t(
                            "絵は読み上げから外します。絵の動きだけでは、見えない人にも、動きを減らす設定にしている人にも伝わりません。",
                            " The visual is hidden from assistive tech; the current state goes into a live region as text. Motion alone reaches neither people who cannot see it nor people who have reduced motion."
                        )}
                    </li>
                    <li>
                        <strong>{t("中身が長いときは、中身だけがスクロールします。", "Long content scrolls on its own.")}</strong>
                        {t(
                            "キャンセルのボタンの行は、狭い画面でも下端に残ります。",
                            " The cancel row stays at the bottom, even on a narrow screen."
                        )}
                    </li>
                </ul>
            </section>
        </ComponentLayout>
    );
}
