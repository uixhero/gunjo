"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Button, Progress } from "@gunjo/ui";
import { useEffect, useState } from "react";

function ProgressExample({
    label,
    value,
    max = 100,
    helper,
    valueLabel,
}: {
    label: string;
    value: number;
    max?: number;
    helper: string;
    valueLabel?: string;
}) {
    return (
        <div className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{valueLabel ?? `${value}%`}</span>
            </div>
            <Progress value={value} max={max} className="h-2 w-full" label={label} valueText={valueLabel ?? `${value}%`} />
            <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
    );
}

type DynamicProgressStatus = "running" | "paused" | "failed" | "complete";

function DynamicProgressExample({ locale }: { locale: "en" | "ja" }) {
    const [value, setValue] = useState(28);
    const [status, setStatus] = useState<DynamicProgressStatus>("running");
    const isJa = locale === "ja";

    useEffect(() => {
        if (status !== "running") return;

        const timer = window.setInterval(() => {
            setValue((current) => {
                const next = Math.min(100, current + 4);
                if (next >= 100) {
                    window.clearInterval(timer);
                    setStatus("complete");
                }
                return next;
            });
        }, 700);

        return () => window.clearInterval(timer);
    }, [status]);

    const remainingFiles = Math.max(0, Math.ceil((100 - value) / 16));
    const statusText = {
        running: isJa ? `残り ${remainingFiles} ファイルを処理しています。` : `Processing ${remainingFiles} remaining files.`,
        paused: isJa ? "アップロードを一時停止しています。" : "Upload is paused.",
        failed: isJa ? "接続が切れました。再試行してください。" : "Connection lost. Retry the upload.",
        complete: isJa ? "すべてのファイルを処理しました。" : "All files were processed.",
    }[status];

    return (
        <div className="w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{isJa ? "ファイルアップロード" : "File upload"}</span>
                <span className="text-muted-foreground">{value}%</span>
            </div>
            <Progress
                value={value}
                className="h-2 w-full"
                aria-label={isJa ? "ファイルアップロード進捗" : "File upload progress"}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {statusText}
            </p>
            <div className="flex flex-wrap gap-2">
                {status === "running" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => setStatus("paused")}>
                        {isJa ? "一時停止" : "Pause"}
                    </Button>
                ) : null}
                {status === "paused" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => setStatus("running")}>
                        {isJa ? "再開" : "Resume"}
                    </Button>
                ) : null}
                {status !== "complete" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => setStatus("failed")}>
                        {isJa ? "失敗を再現" : "Simulate failure"}
                    </Button>
                ) : null}
                {status === "failed" || status === "complete" ? (
                    <Button
                        type="button"
                        variant={status === "failed" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => {
                            setValue(20);
                            setStatus("running");
                        }}
                    >
                        {isJa ? "やり直す" : "Retry"}
                    </Button>
                ) : null}
            </div>
        </div>
    );
}

export default function ProgressPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { Progress } from "@gunjo/ui"

export function UploadProgress() {
  const value = 66

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">${isJa ? "アップロード" : "Upload"}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress
        value={value}
        className="h-2 w-full"
        aria-label="${isJa ? "アップロード進捗" : "Upload progress"}"
      />
      <p className="text-xs text-muted-foreground">
        ${isJa ? "残り 4 ファイルを処理しています。" : "Processing 4 remaining files."}
      </p>
    </div>
  )
}`;

    const usageCode = code;

    const lowCode = code
        .replace("const value = 66", "const value = 18")
        .replace(isJa ? "残り 4 ファイルを処理しています。" : "Processing 4 remaining files.", isJa ? "キューを準備しています。" : "Preparing the queue.");
    const completeCode = code
        .replace("const value = 66", "const value = 100")
        .replace(isJa ? "残り 4 ファイルを処理しています。" : "Processing 4 remaining files.", isJa ? "すべてのファイルを処理しました。" : "All files were processed.");
    const maxCode = `import { Progress } from "@gunjo/ui"

export function StorageProgress() {
  const used = 42
  const capacity = 64

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">${isJa ? "ストレージ" : "Storage"}</span>
        <span className="text-muted-foreground">
          {used} / {capacity} GB
        </span>
      </div>
      <Progress
        value={used}
        max={capacity}
        className="h-2 w-full"
        aria-label="${isJa ? "ストレージ使用量" : "Storage usage"}"
      />
      <p className="text-xs text-muted-foreground">
        ${isJa ? "最大値が 100 以外の場合は max を指定します。" : "Use max when the range is not 0 to 100."}
      </p>
    </div>
  )
}`;

    const dynamicCode = `import { Button, Progress } from "@gunjo/ui"
import { useEffect, useState } from "react"

type ProgressStatus = "running" | "paused" | "failed" | "complete"

export function DynamicUploadProgress() {
  const [value, setValue] = useState(28)
  const [status, setStatus] = useState<ProgressStatus>("running")

  useEffect(() => {
    if (status !== "running") return

    const timer = window.setInterval(() => {
      setValue((current) => {
        const next = Math.min(100, current + 4)
        if (next >= 100) {
          window.clearInterval(timer)
          setStatus("complete")
        }
        return next
      })
    }, 700)

    return () => window.clearInterval(timer)
  }, [status])

  const remainingFiles = Math.max(0, Math.ceil((100 - value) / 16))
  const statusText = {
    running: ${isJa ? "`残り ${remainingFiles} ファイルを処理しています。`" : "`Processing ${remainingFiles} remaining files.`"},
    paused: "${isJa ? "アップロードを一時停止しています。" : "Upload is paused."}",
    failed: "${isJa ? "接続が切れました。再試行してください。" : "Connection lost. Retry the upload."}",
    complete: "${isJa ? "すべてのファイルを処理しました。" : "All files were processed."}",
  }[status]

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">${isJa ? "ファイルアップロード" : "File upload"}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress
        value={value}
        className="h-2 w-full"
        aria-label="${isJa ? "ファイルアップロード進捗" : "File upload progress"}"
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {statusText}
      </p>
      <div className="flex flex-wrap gap-2">
        {status === "running" ? (
          <Button type="button" variant="outline" size="sm" onClick={() => setStatus("paused")}>
            ${isJa ? "一時停止" : "Pause"}
          </Button>
        ) : null}
        {status === "paused" ? (
          <Button type="button" variant="outline" size="sm" onClick={() => setStatus("running")}>
            ${isJa ? "再開" : "Resume"}
          </Button>
        ) : null}
        {status !== "complete" ? (
          <Button type="button" variant="outline" size="sm" onClick={() => setStatus("failed")}>
            ${isJa ? "失敗を再現" : "Simulate failure"}
          </Button>
        ) : null}
        {status === "failed" || status === "complete" ? (
          <Button
            type="button"
            variant={status === "failed" ? "secondary" : "outline"}
            size="sm"
            onClick={() => {
              setValue(20)
              setStatus("running")
            }}
          >
            ${isJa ? "やり直す" : "Retry"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}`;

    const propsData = [
        {
            name: "value",
            type: "number",
            default: "0",
            description: isJa ? "現在の進捗値です。" : "Current progress value.",
        },
        {
            name: "max",
            type: "number",
            default: "100",
            description: isJa ? "進捗の最大値です。value は max に対する割合で表示されます。" : "Maximum value used to calculate the displayed percentage.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "進捗バーのサイズや余白を調整するクラスです。" : "Additional class names for sizing or spacing the bar.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.progress.title}
            description={feedbackMetadata.progress.description}
            usedComponents={[
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "ProgressWidget", href: "/docs/components/progress-widget" },
                { name: "Spinner", href: "/docs/components/spinner" },
                { name: "Skeleton", href: "/docs/components/skeleton" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <ProgressExample
                    label={isJa ? "アップロード" : "Upload"}
                    value={66}
                    helper={isJa ? "残り 4 ファイルを処理しています。" : "Processing 4 remaining files."}
                />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "in-progress",
                            title: isJa ? "進行中" : "In progress",
                            description: isJa ? "割合と補足文を近くに置いて、何の進捗かを明確にします。" : "Place the percentage and helper copy near the bar so the task is clear.",
                            preview: (
                                <ProgressExample
                                    label={isJa ? "アップロード" : "Upload"}
                                    value={66}
                                    helper={isJa ? "残り 4 ファイルを処理しています。" : "Processing 4 remaining files."}
                                />
                            ),
                            previewBodyWidth: "md",
                            code,
                        },
                        {
                            key: "dynamic",
                            title: isJa ? "動的な進捗" : "Dynamic progress",
                            description: isJa
                                ? "Progress は現在値を描画します。進行、停止、失敗、再試行などの処理状態は親側で管理し、近くのテキストと操作で伝えます。"
                                : "Progress renders the current value. The parent owns running, paused, failed, and retry states and communicates them with nearby text and actions.",
                            preview: <DynamicProgressExample locale={locale} />,
                            previewBodyWidth: "md",
                            code: dynamicCode,
                        },
                        {
                            key: "low",
                            title: isJa ? "開始直後" : "Early progress",
                            description: isJa ? "値が小さい場合もバーの高さと横幅は変えず、レイアウトを保ちます。" : "Keep the same bar size when the value is low.",
                            preview: (
                                <ProgressExample
                                    label={isJa ? "アップロード" : "Upload"}
                                    value={18}
                                    helper={isJa ? "キューを準備しています。" : "Preparing the queue."}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: lowCode,
                        },
                        {
                            key: "complete",
                            title: isJa ? "完了" : "Complete",
                            description: isJa ? "完了状態も同じコンポーネントで表し、文言で処理が終わったことを伝えます。" : "Use the same component and communicate completion through the label.",
                            preview: (
                                <ProgressExample
                                    label={isJa ? "アップロード" : "Upload"}
                                    value={100}
                                    helper={isJa ? "すべてのファイルを処理しました。" : "All files were processed."}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: completeCode,
                        },
                        {
                            key: "custom-max",
                            title: isJa ? "最大値を指定" : "Custom max",
                            description: isJa ? "容量や件数など、100以外の単位では max を指定します。" : "Use max for units such as capacity or item counts.",
                            preview: (
                                <ProgressExample
                                    label={isJa ? "ストレージ" : "Storage"}
                                    value={42}
                                    max={64}
                                    valueLabel="42 / 64 GB"
                                    helper={isJa ? "最大値が 100 以外の場合は max を指定します。" : "Use max when the range is not 0 to 100."}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: maxCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props ?? "Props"}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage ?? "Usage"}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
