"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { EditableField, Toast, type ToastType } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";

const codeByLocale = {
    en: `import * as React from "react";
import { EditableField } from "@gunjo/ui";

export function Example() {
  const [title, setTitle] = React.useState("Campaign_Hero_2026");

  return (
    <EditableField
      label="Title"
      value={title}
      onSave={setTitle}
      labels={{ edit: "Edit", save: "Save", cancel: "Cancel" }}
    />
  );
}`,
    ja: `import * as React from "react";
import { EditableField } from "@gunjo/ui";

export function Example() {
  const [title, setTitle] = React.useState("Campaign_Hero_2026");

  return (
    <EditableField
      label="タイトル"
      value={title}
      onSave={setTitle}
      labels={{ edit: "編集", save: "保存", cancel: "キャンセル" }}
    />
  );
}`,
} as const;

const propsByLocale = {
    en: [
        { name: "label", type: "ReactNode", description: "Field label shown above the read/edit surface." },
        { name: "value", type: "string", description: "Committed value displayed in read mode." },
        { name: "onSave", type: "(value: string) => void | Promise<void>", description: "Enables edit mode and receives the trimmed draft when Save is clicked. If it rejects, edit mode stays open." },
        { name: "labels", type: "{ edit?: string; save?: string; cancel?: string }", description: "Accessible and visible labels for the edit controls." },
        { name: "error", type: "ReactNode", description: "Inline error feedback shown below the field." },
        { name: "minRows / maxRows", type: "number", description: "Controls the auto-growing textarea height. Defaults to 1 / 3." },
        { name: "placeholder", type: "string", description: "Text shown when the value is empty." },
    ],
    ja: [
        { name: "label", type: "ReactNode", description: "読み取り/編集サーフェスの上に表示するラベルです。" },
        { name: "value", type: "string", description: "読み取り状態で表示する確定済みの値です。" },
        { name: "onSave", type: "(value: string) => void | Promise<void>", description: "編集モードを有効にし、保存クリック時に trim 済みの入力値を受け取ります。reject すると編集状態を維持します。" },
        { name: "labels", type: "{ edit?: string; save?: string; cancel?: string }", description: "編集操作のアクセシブル名と表示ラベルです。" },
        { name: "error", type: "ReactNode", description: "フィールド下に表示するインラインエラーです。" },
        { name: "minRows / maxRows", type: "number", description: "自動伸縮する textarea の高さを制御します。標準は 1 / 3 です。" },
        { name: "placeholder", type: "string", description: "値が空のときに表示するテキストです。" },
    ],
} as const;

function FeedbackEditableField({
    locale,
    multiline = false,
    fail = false,
}: {
    locale: "ja" | "en";
    multiline?: boolean;
    fail?: boolean;
}) {
    const [value, setValue] = React.useState(
        multiline
            ? locale === "ja"
                ? "SNS配信用のメインビジュアル。保存時は必ずフィードバックを返します。"
                : "Main visual for social distribution. Saving always returns feedback."
            : "Campaign_Hero_2026"
    );
    const [error, setError] = React.useState<string | undefined>();
    const [feedback, setFeedback] = React.useState<{ message: string; type: ToastType } | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [previewSurface, setPreviewSurface] = React.useState<HTMLElement | null>(null);
    const labels = locale === "ja"
        ? { edit: "編集", save: "保存", cancel: "キャンセル" }
        : { edit: "Edit", save: "Save", cancel: "Cancel" };

    React.useEffect(() => {
        const surface = rootRef.current?.closest("[data-doc-component-preview-surface]");
        setPreviewSurface(surface instanceof HTMLElement ? surface : null);
    }, []);

    const handleSave = async (nextValue: string) => {
        if (fail) {
            const message = locale === "ja"
                ? "保存に失敗しました。接続を確認してもう一度お試しください。"
                : "Could not save. Check your connection and try again.";
            setError(message);
            setFeedback({ message, type: "error" });
            throw new Error("EditableField save failed");
        }

        setValue(nextValue);
        setError(undefined);
        setFeedback({
            message: locale === "ja" ? "保存しました。" : "Saved.",
            type: "success",
        });
    };

    return (
        <>
            <div ref={rootRef} className="grid w-full gap-3">
                <EditableField
                    label={multiline ? (locale === "ja" ? "メモ" : "Note") : (locale === "ja" ? "タイトル" : "Title")}
                    value={value}
                    onSave={handleSave}
                    labels={labels}
                    minRows={multiline ? 2 : 1}
                    maxRows={multiline ? 3 : 3}
                    error={error}
                />
            </div>
            {feedback && previewSurface ? createPortal(
                <div className="pointer-events-none absolute right-4 top-4 z-20 flex w-[calc(100%-2rem)] max-w-sm justify-end">
                    <Toast
                        message={feedback.message}
                        type={feedback.type}
                        isVisible
                        onClose={() => setFeedback(null)}
                        duration={2200}
                        placement="inline"
                        className="pointer-events-auto !w-full shadow-lg"
                    />
                </div>,
                previewSurface
            ) : null}
        </>
    );
}

export default function EditableFieldPage() {
    const { locale, sectionLabels } = useLocale();
    const [title, setTitle] = React.useState("Campaign_Hero_2026");
    const [note, setNote] = React.useState(
        locale === "ja"
            ? "SNS配信用のメインビジュアル。長いメモは最大3行まで広がり、それ以上はフィールド内でスクロールします。"
            : "Main visual for social distribution. Long notes grow to three rows, then scroll inside the field."
    );
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const content = getDocContent("components/editable-field", locale);

    React.useEffect(() => {
        setNote(
            locale === "ja"
                ? "SNS配信用のメインビジュアル。長いメモは最大3行まで広がり、それ以上はフィールド内でスクロールします。"
                : "Main visual for social distribution. Long notes grow to three rows, then scroll inside the field."
        );
    }, [locale]);

    const labels = locale === "ja"
        ? { edit: "編集", save: "保存", cancel: "キャンセル" }
        : { edit: "Edit", save: "Save", cancel: "Cancel" };

    return (
        <ComponentLayout
            title={content?.title ?? metadata.editableField.title}
            description={content?.description ?? metadata.editableField.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "Toast", href: "/docs/components/toast" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "FormField", href: "/docs/components/form" },
                { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
            ]}
        >
            <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="sm">
                <div className="grid w-full max-w-sm gap-4">
                    <EditableField
                        label={locale === "ja" ? "タイトル" : "Title"}
                        value={title}
                        onSave={setTitle}
                        labels={labels}
                    />
                    <EditableField
                        label={locale === "ja" ? "メモ" : "Note"}
                        value={note}
                        onSave={setNote}
                        labels={labels}
                    />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "single-line",
                            title: locale === "ja" ? "1行フィールド" : "Single-line field",
                            description:
                                locale === "ja"
                                    ? "タイトルやファイル名のように短い値を、保存・キャンセル付きで編集します。"
                                    : "Use for short values such as titles or file names with explicit save and cancel actions.",
	                            preview: (
	                                <div className="w-full max-w-sm">
                                    <EditableField
                                        label={locale === "ja" ? "タイトル" : "Title"}
                                        value={title}
                                        onSave={setTitle}
                                        labels={labels}
                                    />
                                </div>
                            ),
                            code: codeByLocale[locale],
                        },
                        {
                            key: "multi-line",
                            title: locale === "ja" ? "複数行フィールド" : "Multi-line field",
                            description:
                                locale === "ja"
                                    ? "メモや説明文は最大行数を指定し、表示時も編集時も同じ高さで扱います。"
                                    : "Use minRows and maxRows for notes or descriptions so read and edit mode keep the same footprint.",
                            preview: (
                                <div className="w-full max-w-sm">
                                    <EditableField
                                        label={locale === "ja" ? "メモ" : "Note"}
                                        value={note}
                                        onSave={setNote}
                                        labels={labels}
                                        minRows={2}
                                        maxRows={3}
                                    />
	                                </div>
	                            ),
	                            previewHeight: 220,
	                            code: `import * as React from "react";
import { EditableField } from "@gunjo/ui";

export function NotesField() {
  const [note, setNote] = React.useState("${locale === "ja" ? "SNS配信用のメインビジュアル。" : "Main visual for social distribution."}");

  return (
    <EditableField
      label="${locale === "ja" ? "メモ" : "Note"}"
      value={note}
      onSave={setNote}
      minRows={2}
      maxRows={3}
    />
  );
}`,
                        },
                        {
                            key: "save-feedback",
                            title: locale === "ja" ? "保存フィードバック" : "Save feedback",
                            description:
                                locale === "ja"
                                    ? "保存後は通知で成功を伝え、編集した値が読み取り状態に反映されます。"
                                    : "After saving, a Toast confirms success and the committed value appears in read mode.",
                            preview: (
                                <div className="w-full max-w-sm">
                                    <FeedbackEditableField locale={locale} />
                                </div>
                            ),
                            previewHeight: 180,
                            code: `import * as React from "react";
import { EditableField, useToast } from "@gunjo/ui";

export function EditableFieldWithFeedback() {
  const { showToast } = useToast();
  const [value, setValue] = React.useState("Campaign_Hero_2026");

  return (
    <EditableField
      label="${locale === "ja" ? "タイトル" : "Title"}"
      value={value}
      onSave={(nextValue) => {
        setValue(nextValue);
        showToast("${locale === "ja" ? "保存しました。" : "Saved."}", "success");
      }}
    />
  );
}`,
                        },
                        {
                            key: "save-error",
                            title: locale === "ja" ? "保存失敗" : "Save failure",
                            description:
                                locale === "ja"
                                    ? "保存に失敗したら編集状態を保ち、通知とエラーテキストで理由を返します。"
                                    : "When saving fails, keep edit mode open and return the reason through Toast plus inline error text.",
                            preview: (
                                <div className="flex min-h-[160px] w-full max-w-sm items-start">
                                    <FeedbackEditableField locale={locale} multiline fail />
                                </div>
                            ),
                            previewHeight: 240,
                            code: `import * as React from "react";
import { EditableField, useToast } from "@gunjo/ui";

export function EditableFieldErrorState() {
  const { showToast } = useToast();
  const [error, setError] = React.useState<string>();

  return (
    <EditableField
      label="${locale === "ja" ? "メモ" : "Note"}"
      value="${locale === "ja" ? "保存失敗時のメモ。" : "Note with a failing save."}"
      error={error}
      onSave={async () => {
        const message = "${locale === "ja" ? "保存に失敗しました。" : "Could not save."}";
        setError(message);
        showToast(message, "error");
        throw new Error(message);
      }}
    />
  );
}`,
                        },
                        {
                            key: "empty",
                            title: locale === "ja" ? "空の値" : "Empty value",
                            description:
                                locale === "ja"
                                    ? "値が空の場合は、未入力時の表示で入力対象を示します。"
                                    : "When the value is empty, use placeholder text to clarify the expected content.",
                            preview: (
                                <div className="w-full max-w-sm">
                                    <EditableField
                                        label={locale === "ja" ? "代替テキスト" : "Alt text"}
                                        value=""
                                        onSave={() => {}}
                                        labels={labels}
                                        placeholder={locale === "ja" ? "説明を追加" : "Add a description"}
                                    />
                                </div>
                            ),
                            code: `import { EditableField } from "@gunjo/ui";

export function EmptyEditableField() {
  return (
    <EditableField
      label="${locale === "ja" ? "代替テキスト" : "Alt text"}"
      value=""
      onSave={(value) => console.log(value)}
      placeholder="${locale === "ja" ? "説明を追加" : "Add a description"}"
    />
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </div>
        </ComponentLayout>
    );
}
