"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    FileUploader,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    Progress,
    Spinner,
} from "@gunjo/ui";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

const labelsByLocale = {
    ja: {
        browse: "ファイルを選択",
        drop: "またはドラッグ＆ドロップ",
        removeFile: "ファイルを削除",
        fileTooLarge: "ファイルサイズが上限を超えています",
        maxSize: (sizeMb: number) => `最大 ${sizeMb}MB`,
    },
    en: {
        browse: "Click to upload",
        drop: "or drag and drop",
        removeFile: "Remove file",
        fileTooLarge: "File too large",
        maxSize: (sizeMb: number) => `Max size ${sizeMb}MB`,
    },
} as const;

function UploadStatusCard({
    locale,
    status,
}: {
    locale: "ja" | "en";
    status: "loading" | "success" | "error";
}) {
    if (status === "loading") {
        return (
            <div className="grid gap-3 rounded-md border bg-background p-3 text-sm">
                <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="font-medium">{locale === "ja" ? "アップロード中" : "Uploading"}</span>
                    <span className="ml-auto text-xs text-muted-foreground">68%</span>
                </div>
                <Progress value={68} className="h-2 w-full" />
            </div>
        );
    }

    if (status === "success") {
        return (
            <Alert className="w-full">
                <IconCircleCheck className="h-4 w-4" aria-hidden="true" />
                <div>
                    <AlertTitle>{locale === "ja" ? "アップロード完了" : "Upload complete"}</AlertTitle>
                    <AlertDescription>
                        {locale === "ja" ? "3件のファイルを追加しました。" : "3 files were added."}
                    </AlertDescription>
                </div>
            </Alert>
        );
    }

    return (
        <Alert variant="destructive" className="w-full">
            <IconAlertTriangle className="h-4 w-4" aria-hidden="true" />
            <div>
                <AlertTitle>{locale === "ja" ? "アップロード失敗" : "Upload failed"}</AlertTitle>
                <AlertDescription>
                    {locale === "ja" ? "ファイルサイズが上限を超えています。" : "The file exceeds the allowed size."}
                </AlertDescription>
            </div>
        </Alert>
    );
}

export default function FileUploaderPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/file-uploader", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const labels = labelsByLocale[locale];
    const disabledReason = locale === "ja"
        ? "ストレージ容量を確認するまでアップロードを停止しています。"
        : "Uploads are paused until storage capacity is confirmed.";

    const code = `import { FileUploader, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export function FileUploaderDemo() {
  return (
    <FormGroup className="w-full max-w-md">
      <FormLabel>${locale === "ja" ? "添付ファイル" : "Attachments"}</FormLabel>
      <FormControl>
        <FileUploader
          onValueChange={(files) => console.log(files)}
          maxFiles={3}
          maxSize={5 * 1024 * 1024}
          labels={{
            browse: "${labels.browse}",
            drop: "${labels.drop}",
            removeFile: "${labels.removeFile}",
            fileTooLarge: "${labels.fileTooLarge}",
            maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
          }}
        />
      </FormControl>
      <FormDescription>
        ${locale === "ja" ? "画像や資料を追加できます。" : "Drop files here or browse from your device."}
      </FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FileUploader, FormControl, FormGroup, FormLabel } from "@gunjo/ui";

export function ImageUploader() {
  return (
    <FormGroup className="w-full max-w-md">
      <FormLabel>${locale === "ja" ? "画像" : "Images"}</FormLabel>
      <FormControl>
        <FileUploader
          onValueChange={(files) => console.log(files)}
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
          }}
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "onValueChange",
            type: "(files: File[]) => void",
            description: locale === "ja" ? "ファイルが選択またはドロップされた時に呼ばれます。" : "Callback when files are selected or dropped.",
            default: "-",
        },
        {
            name: "maxFiles",
            type: "number",
            description: locale === "ja" ? "選択できる最大ファイル数です。" : "Maximum number of files allowed.",
            default: "1",
        },
        {
            name: "maxSize",
            type: "number",
            description: locale === "ja" ? "1ファイルあたりの最大サイズをバイト数で指定します。" : "Maximum file size in bytes.",
            default: "5242880 (5MB)",
        },
        {
            name: "accept",
            type: "Record<string, string[]>",
            description: locale === "ja" ? "受け付けるファイル形式です。種類ごとに拡張子を指定します。" : "File types to accept in react-dropzone format.",
            default: "-",
        },
        {
            name: "disabled",
            type: "boolean",
            description: locale === "ja" ? "アップロード操作を無効化します。" : "Disables uploader interaction.",
            default: "false",
        },
        {
            name: "labels",
            type: "{ browse?: ReactNode; drop?: ReactNode; maxSize?: (sizeMb: number) => ReactNode; removeFile?: string; fileTooLarge?: string }",
            description: locale === "ja" ? "ドロップゾーン、削除ボタン、エラーの文言を差し替えます。" : "Overrides dropzone, remove button, and validation labels.",
            default: "-",
        },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? metadata.fileUploader.title}
            description={content?.description ?? metadata.fileUploader.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "FileUploader", href: "/docs/components/file-uploader" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Spinner", href: "/docs/components/spinner" },
                { name: "Alert", href: "/docs/components/alert" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "MediaPickerDialog", href: "/docs/components/media-picker-dialog" },
                { name: "AssetCard", href: "/docs/components/asset-card" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/file-uploader"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="md"
            >
                <FormGroup className="w-full max-w-md">
                    <FormLabel>{locale === "ja" ? "添付ファイル" : "Attachments"}</FormLabel>
                    <FormControl>
                        <FileUploader
                            onValueChange={(files) => console.log(files)}
                            maxFiles={3}
                            labels={labels}
                        />
                    </FormControl>
                    <FormDescription>
                        {locale === "ja" ? "画像や資料を追加できます。" : "Drop files here or browse from your device."}
                    </FormDescription>
                </FormGroup>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "標準" : "Default",
                            description:
                                locale === "ja"
                                    ? "ドロップゾーン全体でクリック選択とドラッグ＆ドロップを受け付けます。"
                                    : "The whole dropzone accepts click-to-browse and drag-and-drop input.",
	                            preview: <FileUploader labels={labels} maxFiles={3} />,
	                            previewHeight: 260,
	                            code,
                        },
                        {
                            key: "image-only",
                            title: locale === "ja" ? "画像のみ" : "Images only",
                            description:
                                locale === "ja"
                                    ? "画像だけを受け付けるアップローダーとして使えます。"
                                    : "Use accept to constrain the uploader to image files.",
	                            preview: (
	                                <FileUploader
                                    labels={labels}
                                    maxFiles={5}
                                    maxSize={10 * 1024 * 1024}
                                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
	                                />
	                            ),
	                            previewHeight: 260,
	                            code: usageCode,
                        },
                        {
                            key: "loading",
                            title: locale === "ja" ? "アップロード中" : "Uploading",
                            description:
                                locale === "ja"
                                    ? "処理中は進捗、読み込みアイコン、状態テキストを同じ領域に表示します。"
                                    : "During upload, show progress, Spinner, and status text in the same area.",
                            preview: (
                                <div className="grid w-full max-w-md gap-3">
                                    <FileUploader labels={labels} maxFiles={3} />
                                    <UploadStatusCard locale={locale} status="loading" />
                                </div>
                            ),
                            previewHeight: 320,
                            code: `import { FileUploader, Progress, Spinner } from "@gunjo/ui";

export function UploadingState() {
  return (
    <div className="grid gap-3">
      <FileUploader maxFiles={3} />
      <div className="grid gap-3 rounded-md border p-3 text-sm">
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>${locale === "ja" ? "アップロード中" : "Uploading"}</span>
          <span className="ml-auto">68%</span>
        </div>
        <Progress value={68} className="h-2 w-full" />
      </div>
    </div>
  );
}`,
                        },
                        {
                            key: "success",
                            title: locale === "ja" ? "成功" : "Success",
                            description:
                                locale === "ja"
                                    ? "アップロード後は成功状態を明示し、追加された件数を伝えます。"
                                    : "After upload, confirm success and tell the user how many files were added.",
                            preview: (
                                <div className="grid w-full max-w-md gap-3">
                                    <FileUploader labels={labels} maxFiles={3} />
                                    <UploadStatusCard locale={locale} status="success" />
                                </div>
                            ),
                            previewHeight: 320,
                            code: `import { Alert, AlertDescription, AlertTitle, FileUploader } from "@gunjo/ui";

export function UploadSuccessState() {
  return (
    <div className="grid gap-3">
      <FileUploader maxFiles={3} />
      <Alert>
        <AlertTitle>${locale === "ja" ? "アップロード完了" : "Upload complete"}</AlertTitle>
        <AlertDescription>${locale === "ja" ? "3件のファイルを追加しました。" : "3 files were added."}</AlertDescription>
      </Alert>
    </div>
  );
}`,
                        },
                        {
                            key: "error",
                            title: locale === "ja" ? "失敗" : "Failure",
                            description:
                                locale === "ja"
                                    ? "失敗時は警告表示で、何が失敗したかを明確にします。"
                                    : "On failure, use a destructive Alert to explain what failed.",
                            preview: (
                                <div className="grid w-full max-w-md gap-3">
                                    <FileUploader labels={labels} maxFiles={3} />
                                    <UploadStatusCard locale={locale} status="error" />
                                </div>
                            ),
                            previewHeight: 320,
                            code: `import { Alert, AlertDescription, AlertTitle, FileUploader } from "@gunjo/ui";

export function UploadFailureState() {
  return (
    <div className="grid gap-3">
      <FileUploader maxFiles={3} />
      <Alert variant="destructive">
        <AlertTitle>${locale === "ja" ? "アップロード失敗" : "Upload failed"}</AlertTitle>
        <AlertDescription>${locale === "ja" ? "ファイルサイズが上限を超えています。" : "The file exceeds the allowed size."}</AlertDescription>
      </Alert>
    </div>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "アップロードできない状態では操作を無効化し、ツールチップで理由を補足します。"
                                    : "Use disabled when uploads are unavailable, and explain the reason with a Tooltip.",
	                            preview: (
                                    <DisabledReasonTooltip fullWidth reason={disabledReason} className="max-w-md">
                                        <FileUploader labels={labels} disabled />
                                    </DisabledReasonTooltip>
                                ),
	                            previewHeight: 260,
	                            code: `import { FileUploader, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledUploader() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div tabIndex={0}>
          <FileUploader disabled />
        </div>
      </TooltipTrigger>
      <TooltipContent>${disabledReason}</TooltipContent>
    </Tooltip>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </div>

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
        </ComponentLayout>
    );
}
