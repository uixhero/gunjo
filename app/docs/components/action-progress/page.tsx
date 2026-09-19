"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { ActionProgressDemo, ActionProgressTimingFigure } from "@/components/demos/ProgressWaitDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import feedbackMetadata from "@design/feedback-metadata.json";
import { DocNote } from "@gunjo/ui";

export default function ActionProgressDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const t = (ja: string, en: string) => (isJa ? ja : en);
    const content = getDocContent("components/action-progress", locale);
    const metadata = feedbackMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.actionProgress.title ?? "ActionProgress";
    const description = content?.description ?? metadata.actionProgress.description ?? "";

    const usageCode = `import * as React from "react";
import { ActionProgress, Button } from "@gunjo/ui";

export function SaveSettings() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [pending, setPending] = React.useState(false);
  const [saved, setSaved] = React.useState(0);

  // ${t("本物のアプリでは、保存の要求が終わったところで pending（open に渡す値）を false にします", "In a real app, set pending to false when the save request settles")}
  const save = (ms: number) => {
    if (pending) return;
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setSaved((n) => n + 1);
    }, ms);
  };

  return (
    // ${t("開いたダイアログの高さ（実測 135〜155px）を先に取り、ボタンとダイアログを同じマスに重ねます", "Reserve the open dialog's height (measured 135–155px) and stack the buttons and the dialog in one cell")}
    <div ref={setContainer} className="relative grid min-h-[155px] w-full place-items-center [&>*]:[grid-area:1/1]">
      <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => save(2000)}>${t("保存する（2秒）", "Save (2 s)")}</Button>
        <Button variant="outline" onClick={() => save(200)}>
          ${t("保存する（0.2秒）", "Save (0.2 s)")}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground" role="status">
        {pending ? "${t("保存しています", "Saving")}" : saved > 0 ? \`${t("保存しました（${saved} 回）", "Saved (${saved})")}\` : ""}
      </p>
      </div>
      <ActionProgress
        portalContainer={container}
        open={pending}
        title="${t("保存しています", "Saving")}"
        description="${t("終わるとこの画面に戻ります。", "You will return to this screen when it is done.")}"
      />
    </div>
  );
}`;

    const justAfterCode = `import * as React from "react";
import { ActionProgress, Button } from "@gunjo/ui";

export function JustAfterSave() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [pending, setPending] = React.useState(false);
  const [saved, setSaved] = React.useState(0);

  // ${t("本物のアプリでは、保存の要求が終わったところで pending（open に渡す値）を false にします", "In a real app, set pending to false when the save request settles")}
  const save = (ms: number) => {
    if (pending) return;
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setSaved((n) => n + 1);
    }, ms);
  };

  return (
    // ${t("開いたダイアログの高さ（実測 135〜155px）を先に取り、ボタンとダイアログを同じマスに重ねます", "Reserve the open dialog's height (measured 135–155px) and stack the buttons and the dialog in one cell")}
    <div ref={setContainer} className="relative grid min-h-[155px] w-full place-items-center [&>*]:[grid-area:1/1]">
      <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => save(450)}>${t("0.45秒で終わる保存", "Save (0.45 s)")}</Button>
      </div>
      <p className="text-sm text-muted-foreground" role="status">
        {pending ? "${t("保存しています", "Saving")}" : saved > 0 ? \`${t("保存しました（${saved} 回）", "Saved (${saved})")}\` : ""}
      </p>
      </div>
      <ActionProgress
        portalContainer={container}
        open={pending}
        title="${t("保存しています", "Saving")}"
        description="${t("終わるとこの画面に戻ります。", "You will return to this screen when it is done.")}"
      />
    </div>
  );
}`;

    const formCode = `import * as React from "react";
import { Button, FormActionProgress, Input, Label } from "@gunjo/ui";

export function ProfileForm() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [saved, setSaved] = React.useState(0);

  return (
    <div ref={setContainer} className="relative grid min-h-[155px] w-full place-items-center [&>*]:[grid-area:1/1]">
      <div className="flex w-full flex-col items-center gap-4">
      <form
        className="flex w-full max-w-sm flex-col gap-3 text-left"
        action={async () => {
          // ${t("ここでサーバーへ送ります（例では1.5秒待つだけ）", "Send to the server here (the example just waits 1.5 s)")}
          await new Promise((resolve) => window.setTimeout(resolve, 1500));
          setSaved((n) => n + 1);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="action-progress-name">${t("表示名", "Display name")}</Label>
          <Input id="action-progress-name" name="name" defaultValue="${t("青木", "Aoki")}" />
        </div>
        <Button type="submit">${t("送信する", "Submit")}</Button>
        <FormActionProgress
          portalContainer={container}
          title="${t("送信しています", "Sending")}"
          description="${t("終わるとこの画面に戻ります。", "You will return to this screen when it is done.")}"
        />
      </form>
      <p className="text-sm text-muted-foreground" role="status">
        {saved > 0 ? \`${t("送信しました（${saved} 回）", "Sent (${saved})")}\` : ""}
      </p>
      </div>
    </div>
  );
}`;

    const reducedCode = `import * as React from "react";
import { ActionProgress, Button, Label, Switch } from "@gunjo/ui";

export function SaveSettings() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [pending, setPending] = React.useState(false);
  const [saved, setSaved] = React.useState(0);

  // ${t("本物のアプリでは、保存の要求が終わったところで pending（open に渡す値）を false にします", "In a real app, set pending to false when the save request settles")}
  const save = (ms: number) => {
    if (pending) return;
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setSaved((n) => n + 1);
    }, ms);
  };

  return (
    // ${t("開いたダイアログの高さ（実測 135〜155px）を先に取り、ボタンとダイアログを同じマスに重ねます", "Reserve the open dialog's height (measured 135–155px) and stack the buttons and the dialog in one cell")}
    <div ref={setContainer} className="relative grid min-h-[155px] w-full place-items-center [&>*]:[grid-area:1/1]">
      <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => save(2000)}>${t("保存する（2秒）", "Save (2 s)")}</Button>
        <Button variant="outline" onClick={() => save(200)}>
          ${t("保存する（0.2秒）", "Save (0.2 s)")}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground" role="status">
        {pending ? "${t("保存しています", "Saving")}" : saved > 0 ? \`${t("保存しました（${saved} 回）", "Saved (${saved})")}\` : ""}
      </p>
      </div>
      <ActionProgress
        portalContainer={container}
        open={pending}
        title="${t("保存しています", "Saving")}"
        description="${t("終わるとこの画面に戻ります。", "You will return to this screen when it is done.")}"
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
      <SaveSettings />
      <div className="flex items-center gap-2">
        <Switch id="reduce-motion" checked={reduce} onCheckedChange={setReduce} />
        <Label htmlFor="reduce-motion">${t("動きを減らす", "Reduce motion")}</Label>
      </div>
    </div>
  );
}`;

    const propsData = [
        { name: "open", type: "boolean", description: t("処理中か。delayMs を過ぎても true のときだけダイアログが出ます。", "Whether work is pending. Shows only if still pending after delayMs.") },
        { name: "minVisibleMs", type: "number", default: "500", description: t("一度出たら、open が false になってもこの時間は出しておきます。", "Once shown, stays at least this long.") },
        { name: "title", type: "ReactNode", description: t("何をしているか。DialogTitle になります。", "What is happening; the DialogTitle.") },
        { name: "description", type: "ReactNode", description: t("題の下の一文。", "One line under the title.") },
        { name: "icon", type: "ReactNode", description: t("既定の Spinner の代わりに置く絵。", "Replaces the default Spinner.") },
        { name: "delayMs", type: "number", default: "350", description: t("出すまで待つ時間（ミリ秒）。", "Wait before showing, in ms.") },
        { name: "portalContainer", type: "HTMLElement | null", description: t("描く先の要素。渡すと、その中に並べて描きます。", "Where to render; the dialog sits in its flow.") },
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
                { name: "Spinner", href: "/docs/components/spinner" },
            ]}
            relatedComponents={[
                {
                    name: "ProgressDialog",
                    href: "/docs/components/progress-dialog",
                    boundary: t("数十秒以上かかる処理向け。絵・補助の枠・キャンセルを持つ。", "For long work, with a visual, a slot and a cancel."),
                },
                {
                    name: "Button",
                    href: "/docs/components/button",
                    boundary: t("loading はボタンの中だけ。画面は塞がない。", "loading stays inside the button; the screen stays usable."),
                },
                {
                    name: "RouteProgress",
                    href: "/docs/components/route-progress",
                    boundary: t("ページの移動中に上端へ出す細いバー。", "A thin bar at the top while a page loads."),
                },
                {
                    name: "Spinner",
                    href: "/docs/components/spinner",
                    boundary: t("回る印だけ。待つ時間もダイアログも持たない。", "The spinning mark alone; no delay, no dialog."),
                },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                embedSrc="/embed/action-progress"
                previewBodyWidth="lg"
            >
                <ActionProgressDemo />
            </ComponentPreview>

            <DocNote variant="note" heading={t("既定の 350ms より早く終われば、何も出ません", "Nothing appears if the work ends within the default 350ms")}>
                {t(
                    "2秒のほうを押すとダイアログが出て、0.2秒のほうを押しても何も出ません。",
                    "The 2-second save shows the dialog; the 0.2-second save shows nothing."
                )}
            </DocNote>

            <ActionProgressTimingFigure />

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {t("状態とバリエーション", "States and variants")}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "just-after",
                            title: t("待つ時間の直後に終わるとき", "When it ends just after the wait"),
                            description: t(
                                "0.45秒で終わる保存です。350ms で出たダイアログは、処理が終わっても 500ms は消えません。",
                                "A save that ends in 0.45 s. The dialog shown at 350ms stays for 500ms even though the work is done."
                            ),
                            preview: null,
                            embedSrc: "/embed/action-progress?variant=just-after",
                            previewBodyWidth: "lg",
                            code: justAfterCode,
                        },
                        {
                            key: "form",
                            title: t("フォームの送信", "Form submission"),
                            description: t(
                                "FormActionProgress は、置かれた form の送信中だけ出ます。pending の状態を自分で持たなくて済みます（React 19 の useFormStatus）。",
                                "FormActionProgress follows the pending state of the form it sits in, so you keep no pending state yourself (React 19 useFormStatus)."
                            ),
                            preview: null,
                            embedSrc: "/embed/action-progress?variant=form",
                            previewBodyWidth: "lg",
                            code: formCode,
                        },
                        {
                            key: "reduced-motion",
                            title: t("動きを減らす設定", "Reduced motion"),
                            description: t(
                                "バーと回る印が止まります。",
                                "The sweep and the spinner stop."
                            ),
                            preview: null,
                            embedSrc: "/embed/action-progress?variant=reduced-motion",
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
                <p className="text-sm text-muted-foreground">
                    {t(
                        "FormActionProgress は、ActionProgress の props のうち open 以外をすべて受け取ります。",
                        "FormActionProgress takes every ActionProgress prop except open (it reads the form's pending state instead)."
                    )}
                </p>
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
                        <strong>{t("既定では 350ms 待って出し、出たら 500ms は消しません。", "By default it waits 350ms, then stays at least 500ms.")}</strong>
                        {t(
                            "一瞬だけ出て消えると、画面がちらつくためです。",
                            " A dialog that appears and vanishes makes the screen flicker."
                        )}
                    </li>
                    <li>
                        <strong>{t("％は出しません。", "No percentage.")}</strong>
                        {t(
                            "短い処理は途中の割合を返しません。流れるバーは「動いている」だけを伝えます。",
                            " Short work reports no ratio; the sweep says only that something is running."
                        )}
                    </li>
                    <li>
                        <strong>{t("open を false にしたときだけ閉じます。", "It closes only when open turns false.")}</strong>
                        {t(
                            "Esc や外側のクリックで閉じられると、処理中なのに送信のボタンをもう一度押せてしまい、二重に送られます。",
                            " If Escape or an outside click closed it, the submit button could be pressed again mid-request and the form would be sent twice."
                        )}
                    </li>
                </ul>
            </section>
        </ComponentLayout>
    );
}
