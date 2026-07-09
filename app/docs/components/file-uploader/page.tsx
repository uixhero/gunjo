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
import { useState } from "react";

const labelsByLocale = {
    ja: {
        browse: "ファイルを選択",
        drop: "またはドラッグ＆ドロップ",
        removeFile: "ファイルを削除",
        fileTooLarge: "ファイルサイズが上限を超えています",
        fileTypeNotAccepted: "対応していないファイル形式です",
        maxSize: (sizeMb: number) => `最大 ${sizeMb}MB`,
    },
    en: {
        browse: "Click to upload",
        drop: "or drag and drop",
        removeFile: "Remove file",
        fileTooLarge: "File too large",
        fileTypeNotAccepted: "File type not accepted",
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
    const [attachments, setAttachments] = useState<File[]>([]);
    const disabledReason = locale === "ja"
        ? "ストレージ容量を確認するまでアップロードを停止しています。"
        : "Uploads are paused until storage capacity is confirmed.";

    const code = `import { FileUploader, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";
import { useState } from "react";

export function FileUploaderDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FormGroup className="w-full max-w-md">
      <FormLabel>${locale === "ja" ? "添付ファイル" : "Attachments"}</FormLabel>
      <FormControl>
        <FileUploader
          value={files}
          onValueChange={setFiles}
          maxFiles={3}
          maxSize={5 * 1024 * 1024}
          labels={{
            browse: "${labels.browse}",
            drop: "${labels.drop}",
            removeFile: "${labels.removeFile}",
            fileTooLarge: "${labels.fileTooLarge}",
            fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
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

    const usageCode = `import { FileUploader, FormControl, FormGroup, FormLabel, Progress } from "@gunjo/ui";
import { useState } from "react";

export function ImageUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const progressByName: Record<string, number> = {};

  return (
    <FormGroup className="w-full max-w-md">
      <FormLabel>${locale === "ja" ? "画像" : "Images"}</FormLabel>
      <FormControl>
        <FileUploader
          value={files}
          onValueChange={setFiles}
          showFileList={false}
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
          }}
        />
      </FormControl>
      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map((file) => (
            <div key={file.name} className="grid gap-1 rounded-md border p-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="truncate font-medium">{file.name}</span>
                <span className="text-muted-foreground">
                  {progressByName[file.name] ?? 0}%
                </span>
              </div>
              <Progress value={progressByName[file.name] ?? 0} className="h-2" />
            </div>
          ))}
        </div>
      )}
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "value",
            type: "File[]",
            description: locale === "ja" ? "選択済みファイルを親で管理する controlled 値です。" : "Controlled file list owned by the parent.",
            default: "-",
        },
        {
            name: "onValueChange",
            type: "(files: File[]) => void",
            description: locale === "ja" ? "選択、ドロップ、削除後の累積ファイル配列で呼ばれます。" : "Called with the accumulated file list after select, drop, or remove.",
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
            name: "showFileList",
            type: "boolean",
            description: locale === "ja" ? "内部ファイル一覧を表示するかを指定します。外部リストや独自進捗を描画する場合は false にします。" : "Whether to render the internal file list. Set false when rendering a custom list or upload progress outside.",
            default: "true",
        },
        {
            name: "fileProgress",
            type: "Record<string, FileUploaderFileProgress> | (file, index) => FileUploaderFileProgress",
            description: locale === "ja" ? "利用側が管理するファイルごとの進捗、状態、エラーを内部リストに表示します。" : "Displays caller-owned progress, status, and error state in the internal file list.",
            default: "-",
        },
        {
            name: "labels",
            type: "{ browse?: ReactNode; drop?: ReactNode; maxSize?: (sizeMb: number) => ReactNode; removeFile?: string; fileTooLarge?: string; fileTypeNotAccepted?: string; progress?: (fileName: string) => string; status?: Partial<Record<FileUploaderFileStatus, ReactNode>> }",
            description: locale === "ja" ? "ドロップゾーン、削除ボタン、検証、進捗表示の文言を差し替えます。" : "Overrides dropzone, remove button, validation, and progress labels.",
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
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
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
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <FormGroup className="w-full max-w-md">
                    <FormLabel>{locale === "ja" ? "添付ファイル" : "Attachments"}</FormLabel>
                    <FormControl>
                        <FileUploader
                            value={attachments}
                            onValueChange={setAttachments}
                            maxFiles={3}
                            maxSize={5 * 1024 * 1024}
                            labels={labels}
                            fileProgress={(file, index) => attachments.length > 0 ? {
                                progress: index === 0 ? 68 : 24,
                                status: "uploading",
                            } : undefined}
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
                            code: `import { FileUploader } from "@gunjo/ui";

<FileUploader
  maxFiles={3}
  labels={{
    browse: "${labels.browse}",
    drop: "${labels.drop}",
    removeFile: "${labels.removeFile}",
    fileTooLarge: "${labels.fileTooLarge}",
    fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
    maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
  }}
/>`,
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
                            code: `import { FileUploader } from "@gunjo/ui";

<FileUploader
  maxFiles={5}
  maxSize={10 * 1024 * 1024}
  accept={{
    "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  }}
  labels={{
    browse: "${labels.browse}",
    drop: "${labels.drop}",
    removeFile: "${labels.removeFile}",
    fileTooLarge: "${labels.fileTooLarge}",
    fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
    maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
  }}
/>`,
                        },
                        {
                            key: "loading",
                            title: locale === "ja" ? "アップロード中" : "Uploading",
                            description:
                                locale === "ja"
                                    ? "アップロード処理は利用側で管理し、内部リストには fileProgress を渡すか showFileList=false で独自リストを描画します。"
                                    : "Upload work is caller-owned: pass fileProgress to the internal list or set showFileList=false and render a custom list.",
                            preview: (
                                <div className="grid w-full max-w-md gap-3">
                                    <FileUploader labels={labels} maxFiles={3} showFileList={false} />
                                    <UploadStatusCard locale={locale} status="loading" />
                                </div>
                            ),
                            code: `import { FileUploader, Progress, Spinner } from "@gunjo/ui";
import { useState } from "react";

export function UploadingState() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="grid gap-3">
      <FileUploader
        value={files}
        onValueChange={setFiles}
        maxFiles={3}
        showFileList={false}
        labels={{
          browse: "${labels.browse}",
          drop: "${labels.drop}",
          removeFile: "${labels.removeFile}",
          fileTooLarge: "${labels.fileTooLarge}",
          fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
          maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
        }}
      />
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
                            code: `import { Alert, AlertDescription, AlertTitle, FileUploader } from "@gunjo/ui";
import { useState } from "react";

export function UploadSuccessState() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="grid gap-3">
      <FileUploader
        value={files}
        onValueChange={setFiles}
        maxFiles={3}
        labels={{
          browse: "${labels.browse}",
          drop: "${labels.drop}",
          removeFile: "${labels.removeFile}",
          fileTooLarge: "${labels.fileTooLarge}",
          fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
          maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
        }}
      />
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
                            code: `import { Alert, AlertDescription, AlertTitle, FileUploader } from "@gunjo/ui";
import { useState } from "react";

export function UploadFailureState() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="grid gap-3">
      <FileUploader
        value={files}
        onValueChange={setFiles}
        maxFiles={3}
        labels={{
          browse: "${labels.browse}",
          drop: "${labels.drop}",
          removeFile: "${labels.removeFile}",
          fileTooLarge: "${labels.fileTooLarge}",
          fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
          maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
        }}
      />
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
                            code: `import { FileUploader, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledUploader() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div tabIndex={0}>
          <FileUploader
            disabled
            labels={{
              browse: "${labels.browse}",
              drop: "${labels.drop}",
              removeFile: "${labels.removeFile}",
              fileTooLarge: "${labels.fileTooLarge}",
              fileTypeNotAccepted: "${labels.fileTypeNotAccepted}",
              maxSize: (sizeMb) => \`${locale === "ja" ? "最大 " : "Max size "}\${sizeMb}MB\`,
            }}
          />
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
