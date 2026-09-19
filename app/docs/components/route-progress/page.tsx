"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { RouteProgressDemo } from "@/components/demos/ProgressWaitDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import feedbackMetadata from "@design/feedback-metadata.json";
import { DocNote } from "@gunjo/ui";

export default function RouteProgressDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const t = (ja: string, en: string) => (isJa ? ja : en);
    const content = getDocContent("components/route-progress", locale);
    const metadata = feedbackMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.routeProgress.title ?? "RouteProgress";
    const description = content?.description ?? metadata.routeProgress.description ?? "";

    const usageCode = `import * as React from "react";
import { Button, RouteProgress } from "@gunjo/ui";

export function NextPage() {
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  // ${t("本物のアプリでは、ページの読み込みが終わったところで loading を false にします", "In a real app, set loading to false when the page has loaded")}
  const go = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setPage((n) => n + 1);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {loading ? <RouteProgress label="${t("ページを読み込み中", "Loading page")}" /> : null}
      <p className="text-sm font-medium">${t("いまは {page} ページ目", "You are on page {page}")}</p>
      <Button onClick={go}>${t("次のページへ移る", "Go to next page")}</Button>
    </div>
  );
}`;

    const loadingBoundaryCode = `// ${t("Next.js の app/loading.tsx の例", "Next.js app/loading.tsx")}
"use client";

import { RouteProgress } from "@gunjo/ui";

export default function Loading() {
  return (
    <>
      <RouteProgress label="${t("ページを読み込み中", "Loading page")}" />
      <p className="p-6 text-sm text-muted-foreground">${t("ページを読み込んでいます。", "Loading the page.")}</p>
    </>
  );
}`;

    const containerCode = `import * as React from "react";
import { Button, RouteProgress } from "@gunjo/ui";

export function ReloadingPanel() {
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const go = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setPage((n) => n + 1);
    }, 2500);
  };

  return (
    <div className="w-full max-w-md py-6">
      <div className="relative overflow-hidden rounded-lg border p-4" aria-busy={loading}>
        {loading ? <RouteProgress placement="container" label="${t("ページを読み込み中", "Loading page")}" /> : null}
        <p className="text-sm font-medium">${t("一覧 {page} ページ目", "List, page {page}")}</p>
        <p className="mt-1 text-sm text-muted-foreground">${t("この枠の中だけが読み込み直されます。", "Only this panel reloads.")}</p>
        <Button className="mt-4" size="sm" onClick={go}>
          ${t("次のページ", "Next page")}
        </Button>
      </div>
    </div>
  );
}`;

    const reducedCode = `import * as React from "react";
import { Button, Label, RouteProgress, Switch } from "@gunjo/ui";

export function NextPage() {
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  // ${t("本物のアプリでは、ページの読み込みが終わったところで loading を false にします", "In a real app, set loading to false when the page has loaded")}
  const go = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setPage((n) => n + 1);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {loading ? <RouteProgress label="${t("ページを読み込み中", "Loading page")}" /> : null}
      <p className="text-sm font-medium">${t("いまは {page} ページ目", "You are on page {page}")}</p>
      <Button onClick={go}>${t("次のページへ移る", "Go to next page")}</Button>
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
      <NextPage />
      <div className="flex items-center gap-2">
        <Switch id="reduce-motion" checked={reduce} onCheckedChange={setReduce} />
        <Label htmlFor="reduce-motion">${t("動きを減らす", "Reduce motion")}</Label>
      </div>
    </div>
  );
}`;

    const propsData = [
        {
            name: "placement",
            type: '"viewport" | "container"',
            default: '"viewport"',
            description: t("viewport は画面の上端、container は位置指定した親の上端。", "viewport pins to the window top; container to a positioned parent."),
        },
        { name: "label", type: "string", default: '"Loading"', description: t("読み上げる名前。", "Accessible name.") },
        { name: "className", type: "string", description: t("外側の枠に足すクラス。", "Extra classes for the wrapper.") },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "Progress", href: "/docs/components/progress" }]}
            relatedComponents={[
                {
                    name: "Progress",
                    href: "/docs/components/progress",
                    boundary: t("バーそのもの。画面の中に置く。", "The bar itself, placed inline."),
                },
                {
                    name: "ActionProgress",
                    href: "/docs/components/action-progress",
                    boundary: t("保存や送信のあいだ画面を塞ぐダイアログ。", "A dialog that blocks the screen while saving or sending."),
                },
                {
                    name: "Skeleton",
                    href: "/docs/components/skeleton",
                    boundary: t("中身の輪郭を先に見せる。バーは出さない。", "Shows the shape of content first; no bar."),
                },
                {
                    name: "ProgressDialog",
                    href: "/docs/components/progress-dialog",
                    boundary: t("長い処理を待つダイアログ。絵とキャンセルを持つ。", "A long-wait dialog with a visual and a cancel."),
                },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/route-progress"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight={320}
                previewBodyWidth="lg"
            >
                <RouteProgressDemo />
            </ComponentPreview>

            <DocNote variant="note" heading={t("描いているあいだだけ出ます", "It shows only while rendered")}>
                {t(
                    "開始や終了を知らせる関数はありません。読み込み中だけ描画し、終わったら描画をやめてください。",
                    "There are no start or finish functions. Render it only while loading and stop rendering it when done."
                )}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {t("状態とバリエーション", "States and variants")}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "container",
                            title: t("枠の中だけ", "Inside a panel"),
                            description: t(
                                "placement=\"container\" で、位置指定した親の上端に出ます。一覧の枠だけを読み込み直すときに使います。",
                                "placement=\"container\" pins it to a positioned parent, for a panel that reloads on its own."
                            ),
                            preview: null,
                            embedSrc: "/embed/route-progress?variant=container",
                            previewHeight: 320,
                            previewBodyWidth: "lg",
                            code: containerCode,
                        },
                        {
                            key: "loading-boundary",
                            title: t("読み込み中の画面に置く", "In a loading boundary"),
                            description: t(
                                "Next.js なら app/loading.tsx に置くだけで、ページの移動中に上端へ出ます。プレビューは読み込み中のまま止めてあります。",
                                "In Next.js, drop it into app/loading.tsx and it shows at the top during navigation. The preview stays in the loading state."
                            ),
                            preview: null,
                            embedSrc: "/embed/route-progress?variant=boundary",
                            previewHeight: 320,
                            previewBodyWidth: "lg",
                            code: loadingBoundaryCode,
                        },
                        {
                            key: "reduced-motion",
                            title: t("動きを減らす設定", "Reduced motion"),
                            description: t(
                                "流れが止まり、上端に淡い色の帯が残ります。",
                                "The sweep stops and a still, dimmed band stays at the top."
                            ),
                            preview: null,
                            embedSrc: "/embed/route-progress?variant=reduced-motion",
                            previewHeight: 320,
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
                        <strong>{t("進み具合（％）を持ちません。", "No percentage.")}</strong>
                        {t(
                            "ページの読み込みは、どこまで進んだかを返しません。伸びていくバーにすると、止まっているのに進んで見えます。",
                            " Page loads do not report how far along they are. A growing bar would look like progress even when stalled."
                        )}
                    </li>
                    <li>
                        <strong>{t("フレームワークに依存しません。", "No framework dependency.")}</strong>
                        {t(
                            "ルーターのイベントを購読しません。いつ描くかは呼び出し側が決めます。",
                            " It subscribes to no router events; the caller decides when to render it."
                        )}
                    </li>
                    <li>
                        <strong>{t("画面を塞ぎません。", "It blocks nothing.")}</strong>
                        {t(
                            "pointer-events を切ってあるので、下の画面はそのまま触れます。",
                            " pointer-events are off, so the page underneath stays usable."
                        )}
                    </li>
                </ul>
            </section>
        </ComponentLayout>
    );
}
