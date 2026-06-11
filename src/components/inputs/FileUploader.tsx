"use client"

import * as React from "react"
import { IconUpload as Upload, IconX as X, IconFileText as FileText, IconCircleCheck as CheckCircle, IconAlertCircle as AlertCircle } from "@tabler/icons-react";
import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Progress } from "../feedback/Progress"

export interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    onValueChange?: (files: File[]) => void
    maxFiles?: number
    maxSize?: number // in bytes
    accept?: Record<string, string[]>
    disabled?: boolean
    labels?: {
        browse?: React.ReactNode
        drop?: React.ReactNode
        maxSize?: (sizeMb: number) => React.ReactNode
        removeFile?: string
        fileTooLarge?: string
    }
}

interface FileState {
    file: File
    progress: number
    status: "pending" | "uploading" | "complete" | "error"
    error?: string
}

export const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
    ({ className, onValueChange, maxFiles = 1, maxSize = 1024 * 1024 * 5, accept, disabled, labels, ...props }, ref) => {
        const [dragActive, setDragActive] = React.useState(false)
        const [files, setFiles] = React.useState<FileState[]>([])
        const inputRef = React.useRef<HTMLInputElement>(null)
        const maxSizeMb = Math.round(maxSize / 1024 / 1024)

        const handleDrag = React.useCallback((e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true)
            } else if (e.type === "dragleave") {
                setDragActive(false)
            }
        }, [])

        const validateFile = (file: File): string | undefined => {
            if (file.size > maxSize) return labels?.fileTooLarge ?? "File too large"
            // Simple check, in real app use proper mime matching
            return undefined
        }

        const handleDrop = React.useCallback(
            (e: React.DragEvent) => {
                e.preventDefault()
                e.stopPropagation()
                setDragActive(false)

                if (disabled) return

                const droppedFiles = Array.from(e.dataTransfer.files)
                if (droppedFiles && droppedFiles.length > 0) {
                    const newFiles = droppedFiles.map(file => ({
                        file,
                        progress: 0,
                        status: "pending" as const,
                        error: validateFile(file)
                    }))
                    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
                    onValueChange?.(droppedFiles)
                }
            },
            [disabled, maxFiles, maxSize, onValueChange]
        )

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            if (disabled || !e.target.files) return

            const selectedFiles = Array.from(e.target.files)
            const newFiles = selectedFiles.map(file => ({
                file,
                progress: 0,
                status: "pending" as const,
                error: validateFile(file)
            }))
            setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
            onValueChange?.(selectedFiles)
        }

        const removeFile = (index: number) => {
            setFiles(prev => prev.filter((_, i) => i !== index))
        }

        // Simulate upload for visual effect if needed, or consumer handles it.
        // For this UI component, we just accept the files.

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
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center cursor-pointer" onClick={() => inputRef.current?.click()}>
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

                {files.length > 0 && (
                    <div className="grid gap-2">
                        {files.map((fileState, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded-md border bg-background">
                                <FileText className="h-4 w-4 text-primary" />
                                <div className="flex-1 min-w-0 grid gap-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="truncate font-medium">{fileState.file.name}</span>
                                        <span className="text-muted-foreground">{(fileState.file.size / 1024).toFixed(0)}KB</span>
                                    </div>
                                    {/* Progress Simulation would go here */}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => removeFile(index)}
                                    aria-label={labels?.removeFile ?? "Remove file"}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
)
FileUploader.displayName = "FileUploader"
