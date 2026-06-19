"use client"

import * as React from "react"
import { IconUpload as Upload, IconX as X, IconFileText as FileText, IconCircleCheck as CheckCircle, IconAlertCircle as AlertCircle } from "@tabler/icons-react";
import { cn } from "../../lib/utils"
import { TooltipButton } from "../inputs/TooltipButton"
import { Progress } from "../feedback/Progress"

export type FileUploaderFileStatus = "pending" | "uploading" | "complete" | "error"

export interface FileUploaderFileProgress {
    progress?: number
    status?: FileUploaderFileStatus
    error?: string
}

export type FileUploaderProgressResolver =
    | Record<string, FileUploaderFileProgress | undefined>
    | ((file: File, index: number) => FileUploaderFileProgress | undefined)

export interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: File[]
    onValueChange?: (files: File[]) => void
    maxFiles?: number
    maxSize?: number // in bytes
    accept?: Record<string, string[]>
    disabled?: boolean
    showFileList?: boolean
    fileProgress?: FileUploaderProgressResolver
    labels?: {
        browse?: React.ReactNode
        drop?: React.ReactNode
        maxSize?: (sizeMb: number) => React.ReactNode
        removeFile?: string
        fileTooLarge?: string
        fileTypeNotAccepted?: string
        progress?: (fileName: string) => string
        status?: Partial<Record<FileUploaderFileStatus, React.ReactNode>>
    }
}

interface FileState {
    file: File
    error?: string
}

export function getFileUploaderFileKey(file: File) {
    return `${file.name}:${file.size}:${file.lastModified}:${file.type}`
}

function getAcceptValue(accept?: Record<string, string[]>) {
    if (!accept) return undefined

    return Object.entries(accept)
        .flatMap(([mimeType, extensions]) => [mimeType, ...extensions])
        .join(",")
}

function fileMatchesAccept(file: File, accept?: Record<string, string[]>) {
    if (!accept || Object.keys(accept).length === 0) return true

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    return Object.entries(accept).some(([mimeType, extensions]) => {
        const normalizedExtensions = extensions.map((extension) => extension.toLowerCase())
        const extensionMatches = normalizedExtensions.some((extension) => fileName.endsWith(extension))
        if (extensionMatches) return true
        if (mimeType.endsWith("/*")) {
            return fileType.startsWith(`${mimeType.slice(0, -1)}`)
        }
        return fileType === mimeType
    })
}

function getProgressState(
    file: File,
    index: number,
    fileProgress?: FileUploaderProgressResolver
): FileUploaderFileProgress | undefined {
    if (!fileProgress) return undefined
    if (typeof fileProgress === "function") return fileProgress(file, index)

    return fileProgress[getFileUploaderFileKey(file)] ?? fileProgress[file.name]
}

function getStatusLabel(
    status: FileUploaderFileStatus,
    labels?: FileUploaderProps["labels"]
) {
    return labels?.status?.[status] ?? {
        pending: "Pending",
        uploading: "Uploading",
        complete: "Complete",
        error: "Error",
    }[status]
}

export const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
    (
        {
            className,
            value,
            onValueChange,
            maxFiles = 1,
            maxSize = 1024 * 1024 * 5,
            accept,
            disabled,
            showFileList = true,
            fileProgress,
            labels,
            ...props
        },
        ref
    ) => {
        const [dragActive, setDragActive] = React.useState(false)
        const [uncontrolledFiles, setUncontrolledFiles] = React.useState<FileState[]>([])
        const inputRef = React.useRef<HTMLInputElement>(null)
        const maxSizeMb = Math.round(maxSize / 1024 / 1024)
        const isControlled = value !== undefined

        const handleDrag = React.useCallback((e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true)
            } else if (e.type === "dragleave") {
                setDragActive(false)
            }
        }, [])

        const validateFile = React.useCallback((file: File): string | undefined => {
            if (file.size > maxSize) return labels?.fileTooLarge ?? "File too large"
            if (!fileMatchesAccept(file, accept)) return labels?.fileTypeNotAccepted ?? "File type not accepted"
            return undefined
        }, [accept, labels?.fileTooLarge, labels?.fileTypeNotAccepted, maxSize])

        const files = React.useMemo<FileState[]>(
            () => (
                isControlled
                    ? (value ?? []).map((file) => ({ file, error: validateFile(file) }))
                    : uncontrolledFiles
            ),
            [isControlled, uncontrolledFiles, validateFile, value]
        )

        const commitFiles = React.useCallback(
            (nextFiles: FileState[]) => {
                const boundedFiles = nextFiles.slice(0, maxFiles)
                if (!isControlled) setUncontrolledFiles(boundedFiles)
                onValueChange?.(boundedFiles.map((fileState) => fileState.file))
            },
            [isControlled, maxFiles, onValueChange]
        )

        const createFileStates = React.useCallback(
            (selectedFiles: File[]) => selectedFiles.map((file) => ({
                file,
                error: validateFile(file),
            })),
            [validateFile]
        )

        const handleDrop = React.useCallback(
            (e: React.DragEvent) => {
                e.preventDefault()
                e.stopPropagation()
                setDragActive(false)

                if (disabled) return

                const droppedFiles = Array.from(e.dataTransfer.files)
                if (droppedFiles && droppedFiles.length > 0) {
                    commitFiles([...files, ...createFileStates(droppedFiles)])
                }
            },
            [commitFiles, createFileStates, disabled, files]
        )

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            if (disabled || !e.target.files) return

            const selectedFiles = Array.from(e.target.files)
            commitFiles([...files, ...createFileStates(selectedFiles)])
            e.target.value = ""
        }

        const removeFile = (index: number) => {
            commitFiles(files.filter((_, i) => i !== index))
        }

        const acceptValue = getAcceptValue(accept)

        return (
            <div
                className={cn("grid w-full max-w-[640px] gap-4", className)}
                ref={ref}
                {...props}
                data-slot="file-uploader"
            >
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed transition-colors",
                        dragActive ? "border-primary-border bg-primary-subtle" : "border-muted-foreground/25 hover:bg-muted/50",
                        disabled && "opacity-60 cursor-not-allowed"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        multiple={maxFiles > 1}
                        accept={acceptValue}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center pt-5 pb-6 text-center",
                            disabled ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                        onClick={() => {
                            if (!disabled) inputRef.current?.click()
                        }}
                    >
                        <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                        <p className="mb-1 text-sm text-foreground">
                            <span className="font-semibold">{labels?.browse ?? "Click to upload"}</span>{" "}
                            {labels?.drop ?? "or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {labels?.maxSize?.(maxSizeMb) ?? `Max size ${maxSizeMb}MB`}
                        </p>
                    </div>
                </div>

                {showFileList && files.length > 0 && (
                    <div className="grid gap-2">
                        {files.map((fileState, index) => {
                            const progressState = getProgressState(fileState.file, index, fileProgress)
                            const error = progressState?.error ?? fileState.error
                            const status = error ? "error" : progressState?.status ?? "pending"
                            const progressValue = status === "complete"
                                ? 100
                                : Math.min(100, Math.max(0, progressState?.progress ?? 0))
                            const showProgress = progressState?.progress !== undefined || status === "uploading" || status === "complete"
                            const statusText = error ?? (showProgress || status !== "pending" ? getStatusLabel(status, labels) : null)
                            const Icon = status === "complete" ? CheckCircle : status === "error" ? AlertCircle : FileText

                            return (
                                <div key={`${getFileUploaderFileKey(fileState.file)}:${index}`} className="flex items-center gap-2 p-2 rounded-md border bg-background">
                                    <Icon className={cn("h-4 w-4", status === "error" ? "text-destructive" : status === "complete" ? "text-success-strong" : "text-primary")} />
                                    <div className="flex-1 min-w-0 grid gap-1">
                                        <div className="flex justify-between gap-3 text-xs">
                                            <span className="truncate font-medium">{fileState.file.name}</span>
                                            <span className="shrink-0 text-muted-foreground">{(fileState.file.size / 1024).toFixed(0)}KB</span>
                                        </div>
                                        {showProgress && (
                                            <Progress
                                                value={progressValue}
                                                className="h-1.5 w-full"
                                                aria-label={labels?.progress?.(fileState.file.name) ?? `${fileState.file.name} progress`}
                                            />
                                        )}
                                        {statusText && (
                                            <p className={cn("text-xs", status === "error" ? "text-destructive" : "text-muted-foreground")}>
                                                {statusText}
                                            </p>
                                        )}
                                    </div>
                                    <TooltipButton
                                        tooltip={labels?.removeFile ?? "Remove file"}
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeFile(index)}
                                        aria-label={labels?.removeFile ?? "Remove file"}
                                    >
                                        <X className="h-4 w-4" />
                                    </TooltipButton>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }
)
FileUploader.displayName = "FileUploader"
