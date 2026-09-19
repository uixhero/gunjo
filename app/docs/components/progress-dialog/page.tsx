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

/** The stand-in visual, shared by every snippet on this page. */
const MEDIA_CODE = `function Media() {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 via-muted to-background p-6">
      <div className="w-3/5 space-y-3 rounded-lg border bg-background/80 p-4 shadow-sm">
        <div className="h-3 w-2/3 rounded-full bg-primary/40" />
        <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
        <div className="h-2 w-5/6 rounded-full bg-muted-foreground/20" />
      </div>
    </div>
  );
}`;

export default function ProgressDialogDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const t = (ja: string, en: string) => (isJa ? ja : en);
    const content = getDocContent("components/progress-dialog", locale);
    const metadata = overlayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.progressDialog.title ?? "ProgressDialog";
    const description = content?.description ?? metadata.progressDialog.description ?? "";

    const usageCode = `import * as React from "react";
import { Button, ProgressDialog } from "@gunjo/ui";

const STEPS = ${t(
        '["資料を読み込んでいます", "構成を組み立てています", "仕上げています"]',
        '["Reading the material", "Building the outline", "Finishing up"]'
    )};

${MEDIA_CODE}

export function CreateDocument() {
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
        setResult("${t("できあがりました。", "Done.")}");
        return;
      }
      setStep(current);
    }, 2200);
  };

  const cancel = () => {
    stop();
    setOpen(false);
    setResult("${t("キャンセルしました。入力は残っています。", "Cancelled. Your input is still here.")}");
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <Button onClick={start}>${t("作成を始める", "Start")}</Button>
      <p className="min-h-5 text-sm text-muted-foreground" role="status">{result}</p>
      <ProgressDialog
        open={open}
        title="${t("資料を作成しています", "Creating your document")}"
        description="${t("数十秒かかることがあります。この画面のままお待ちください。", "This can take a few dozen seconds. Please keep this screen open.")}"
        media={<Media />}
        statusLabel="${t("いまの作業", "Now")}"
        status={STEPS[step]}
        onCancel={cancel}
        cancelLabel="${t("作成をやめる", "Stop")}"
        cancelNote="${t("やめても入力は残ります。", "Your input stays if you stop.")}"
      />
    </div>
  );
}`;

    const asideCode = `import * as React from "react";
import { Button, ProgressDialog } from "@gunjo/ui";

${MEDIA_CODE}

export function WithSlot() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 6000);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className="flex justify-center py-6">
      <Button onClick={() => setOpen(true)}>${t("作成を始める", "Start")}</Button>
      <ProgressDialog
        open={open}
        title="${t("資料を作成しています", "Creating your document")}"
        media={<Media />}
        statusLabel="${t("いまの作業", "Now")}"
        status="${t("構成を組み立てています", "Building the outline")}"
        aside={
          <div className="rounded-md border p-4 text-left text-sm">
            <p className="font-medium">${t("待っているあいだに", "While you wait")}</p>
            <p className="mt-1 text-muted-foreground">
              ${t("できあがった資料は、あとから一覧でも開けます。", "You can reopen the finished document from the list later.")}
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

${MEDIA_CODE}

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
    <div className="flex justify-center py-6">
      <Button onClick={() => setOpen(true)}>${t("作成を始める", "Start")}</Button>
      <ProgressDialog
        open={open}
        title="${t("資料を作成しています", "Creating your document")}"
        media={<Media />}
        statusLabel="${t("いまの作業", "Now")}"
        status={\`${t("${done + 1} 件目のファイルを読み込んでいます", "Reading file ${done + 1}")}\`}
        value={done}
        max={TOTAL}
        valueText={\`${t("${TOTAL} 件中 ${done} 件完了", "${done} of ${TOTAL} files done")}\`}
        onCancel={() => setOpen(false)}
        cancelLabel="${t("作成をやめる", "Stop")}"
      />
    </div>
  );
}`;

    const noCancelCode = `import * as React from "react";
import { Button, ProgressDialog } from "@gunjo/ui";

${MEDIA_CODE}

export function NoCancel() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 4500);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className="flex justify-center py-6">
      <Button onClick={() => setOpen(true)}>${t("作成を始める", "Start")}</Button>
      <ProgressDialog
        open={open}
        title="${t("資料を作成しています", "Creating your document")}"
        media={<Media />}
        status="${t("仕上げています", "Finishing up")}"
      />
    </div>
  );
}`;

    const reducedCode = `import * as React from "react";
import { Button, Label, ProgressDialog, Switch } from "@gunjo/ui";

const STEPS = ${t(
        '["資料を読み込んでいます", "構成を組み立てています", "仕上げています"]',
        '["Reading the material", "Building the outline", "Finishing up"]'
    )};

${MEDIA_CODE}

export function CreateDocument() {
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
        setResult("${t("できあがりました。", "Done.")}");
        return;
      }
      setStep(current);
    }, 2200);
  };

  const cancel = () => {
    stop();
    setOpen(false);
    setResult("${t("キャンセルしました。入力は残っています。", "Cancelled. Your input is still here.")}");
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <Button onClick={start}>${t("作成を始める", "Start")}</Button>
      <p className="min-h-5 text-sm text-muted-foreground" role="status">{result}</p>
      <ProgressDialog
        open={open}
        title="${t("資料を作成しています", "Creating your document")}"
        description="${t("数十秒かかることがあります。この画面のままお待ちください。", "This can take a few dozen seconds. Please keep this screen open.")}"
        media={<Media />}
        statusLabel="${t("いまの作業", "Now")}"
        status={STEPS[step]}
        onCancel={cancel}
        cancelLabel="${t("作成をやめる", "Stop")}"
        cancelNote="${t("やめても入力は残ります。", "Your input stays if you stop.")}"
      />
    </div>
  );
}

export function ReduceMotionDemo() {
  const [reduce, setReduce] = React.useState(false);

  // ${t("OS で動きを減らす設定（prefers-reduced-motion）にしたときの表示を、下の切り替えで確かめられます", "Check the reduced-motion look (prefers-reduced-motion) with the switch below")}
  React.useEffect(() => {
    const root = document.documentElement;
    if (reduce) root.dataset.motion = "reduce";
    else delete root.dataset.motion;
  }, [reduce]);

  return (
    <div className="flex flex-col items-center gap-2">
      <CreateDocument />
      <div className="flex items-center gap-2">
        <Switch id="reduce-motion" checked={reduce} onCheckedChange={setReduce} />
        <Label htmlFor="reduce-motion">${t("動きを減らす", "Reduce motion")}</Label>
      </div>
    </div>
  );
}`;

    const propsData = [
        { name: "open", type: "boolean", description: t("開いているか。", "Whether it is open.") },
        { name: "title", type: "ReactNode", description: t("題。DialogTitle になり、スクリーンリーダーはこれをダイアログの名前として読みます。", "Title, wired as the DialogTitle.") },
        { name: "description", type: "ReactNode", description: t("題の下の説明。DialogDescription になります。", "Text under the title; the DialogDescription.") },
        { name: "status", type: "ReactNode", description: t("いまの状態を言葉で。読み上げ領域（role=\"status\"）に入ります。", "The current state in words, in a role=\"status\" region.") },
        { name: "statusLabel", type: "ReactNode", description: t("状態の上の小見出し。", "Small caption above the status.") },
        { name: "media", type: "ReactNode", description: t("16:9 の絵。img・svg・video など。", "A 16:9 visual: img, svg, video.") },
        { name: "value", type: "number", description: t("進み具合。分かるときだけ渡します。", "Completion, only when known.") },
        { name: "max", type: "number", default: "100", description: t("value の上限。", "Upper bound for value.") },
        { name: "valueText", type: "string", description: t("value の読み上げ文（例: 5 件中 3 件完了）。", "Spoken form of value, e.g. \"3 of 5 files\".") },
        { name: "aside", type: "ReactNode", description: t("状態の下に置く補助の枠。", "Slot below the status.") },
        { name: "onCancel", type: "() => void", description: t("渡すとキャンセルのボタンが出ます。押すと呼ばれるだけで、処理を止めて open を false にするのは呼び出し側です。", "Adds a cancel button. Pressing it only calls this; stop the work and set open to false yourself.") },
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
                embedSrc="/embed/progress-dialog"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight={680}
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
                                "aside に渡したものを、状態の下にそのまま置きます。枠の中身と見た目は呼び出し側が決めます。",
                                "Whatever you pass to aside sits below the status as-is. Its content and look are yours."
                            ),
                            preview: null,
                            embedSrc: "/embed/progress-dialog?variant=aside",
                            previewHeight: 680,
                            previewBodyWidth: "lg",
                            code: asideCode,
                        },
                        {
                            key: "known",
                            title: t("件数が分かるとき", "When the count is known"),
                            description: t(
                                "処理が「5 件中 3 件」のように本当の数を返すなら value と max を渡します。バーは割合で伸び、読み上げは valueText を読みます。",
                                "If the work reports a real count, pass value and max. The bar fills by ratio and valueText is what gets spoken."
                            ),
                            preview: null,
                            embedSrc: "/embed/progress-dialog?variant=known",
                            previewHeight: 680,
                            previewBodyWidth: "lg",
                            code: knownCode,
                        },
                        {
                            key: "no-cancel",
                            title: t("キャンセルなし", "No cancel"),
                            description: t(
                                "onCancel を渡さないと、キャンセルのボタンは出ません。終わったときと失敗したときに、呼び出し側で閉じてください。",
                                "Without onCancel there is no cancel button. Close it yourself on success and on failure."
                            ),
                            preview: null,
                            embedSrc: "/embed/progress-dialog?variant=no-cancel",
                            previewHeight: 680,
                            previewBodyWidth: "lg",
                            code: noCancelCode,
                        },
                        {
                            key: "reduced-motion",
                            title: t("動きを減らす設定", "Reduced motion"),
                            description: t(
                                "流れるバーは止まり、全幅の淡い色の帯になります。状態の文、補助の枠、キャンセルはそのまま使えます。祖先に data-motion=\"reduce\" を付けても同じになります。",
                                "The sweep stops and becomes a still, dimmed bar. Status, slot and cancel keep working. An ancestor with data-motion=\"reduce\" does the same as the OS setting."
                            ),
                            preview: null,
                            embedSrc: "/embed/progress-dialog?variant=reduced-motion",
                            previewHeight: 680,
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
                            "絵は読み上げから外し、いまの状態は status の文として読み上げ領域に入れます。絵の動きだけでは、見えない人にも、動きを減らす設定にしている人にも伝わりません。",
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
