"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { CopyButton } from "../inputs/CopyButton"

type CodeBlockTheme = "dark" | "light" | "muted"

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Code text to display. */
    code: string
    /** Optional filename shown in the header. If omitted, header is hidden. */
    filename?: string
    /** Language label shown next to the filename. */
    language?: string
    /** Show a copy-to-clipboard button. Default true. */
    copyable?: boolean
    /** Accessible label and tooltip for the copy button. */
    copyLabel?: string
    /** Label shown briefly after copying. */
    copiedLabel?: string
    /** Duration in milliseconds to keep the copied feedback visible. Default 5000. */
    copiedDuration?: number
    /** Show line numbers next to each line. */
    showLineNumbers?: boolean
    /** Apply lightweight syntax highlighting for common source tokens. */
    highlight?: boolean
    /** Allow users to edit the source inside the code block. */
    editable?: boolean
    /** Called when editable source changes. */
    onCodeChange?: (code: string) => void
    /** Select all source text when the code area is double-clicked. Default true. */
    selectOnDoubleClick?: boolean
    /** Visual theme for the code block surface. */
    theme?: CodeBlockTheme
}

const KEYWORDS = new Set([
    "as",
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "if",
    "import",
    "in",
    "interface",
    "let",
    "new",
    "null",
    "return",
    "switch",
    "true",
    "try",
    "type",
    "undefined",
    "var",
    "while",
])

const TOKEN_PATTERN =
    /(\/\/.*$|\/\*[\s\S]*?\*\/|`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/gm

const themeClasses: Record<
    CodeBlockTheme,
    {
        root: string
        header: string
        meta: string
        badge: string
        button: string
        surface: string
        lineNumber: string
        textarea: string
        keyword: string
        string: string
        comment: string
        number: string
        identifier: string
    }
> = {
    dark: {
        root: "border-[hsl(var(--pure-white)/0.14)] bg-[hsl(var(--pure-black))] text-[hsl(var(--pure-white))]",
        header: "border-[hsl(var(--pure-white)/0.14)] bg-[hsl(var(--pure-black))]",
        meta: "text-[hsl(var(--pure-white)/0.7)]",
        badge: "border-[hsl(var(--pure-white)/0.2)] bg-[hsl(var(--pure-white)/0.08)] text-[hsl(var(--pure-white)/0.84)]",
        button: "text-[hsl(var(--pure-white)/0.7)] hover:bg-[hsl(var(--pure-white)/0.1)] hover:text-[hsl(var(--pure-white))]",
        surface: "bg-[hsl(var(--pure-black))]",
        lineNumber: "border-[hsl(var(--pure-white)/0.16)] text-[hsl(var(--pure-white)/0.45)]",
        textarea: "text-[hsl(var(--pure-white))] caret-[hsl(var(--pure-white))] placeholder:text-[hsl(var(--pure-white)/0.45)]",
        keyword: "text-info",
        string: "text-success",
        comment: "text-[hsl(var(--pure-white)/0.55)]",
        number: "text-warning",
        identifier: "text-[hsl(var(--pure-white))]",
    },
    light: {
        root: "border-border bg-background text-foreground",
        header: "border-border bg-muted/40",
        meta: "text-muted-foreground",
        badge: "border-border bg-background text-muted-foreground",
        button: "text-muted-foreground hover:bg-muted hover:text-foreground",
        surface: "bg-background",
        lineNumber: "border-border text-muted-foreground",
        textarea: "text-foreground caret-foreground placeholder:text-muted-foreground",
        keyword: "text-info",
        string: "text-success",
        comment: "text-muted-foreground",
        number: "text-warning",
        identifier: "text-foreground",
    },
    muted: {
        root: "border-border bg-muted/40 text-foreground",
        header: "border-border bg-muted/60",
        meta: "text-muted-foreground",
        badge: "border-border bg-background/70 text-muted-foreground",
        button: "text-muted-foreground hover:bg-background/80 hover:text-foreground",
        surface: "bg-muted/20",
        lineNumber: "border-border text-muted-foreground",
        textarea: "text-foreground caret-foreground placeholder:text-muted-foreground",
        keyword: "text-info",
        string: "text-success",
        comment: "text-muted-foreground",
        number: "text-warning",
        identifier: "text-foreground",
    },
}

function renderHighlightedLine(line: string, theme: (typeof themeClasses)[CodeBlockTheme]) {
    const nodes: React.ReactNode[] = []
    let cursor = 0
    const pattern = new RegExp(TOKEN_PATTERN)
    let match: RegExpExecArray | null

    while ((match = pattern.exec(line)) !== null) {
        const token = match[0]
        const start = match.index
        if (start > cursor) {
            nodes.push(line.slice(cursor, start))
        }

        let className = theme.identifier
        if (token.startsWith("//") || token.startsWith("/*")) {
            className = theme.comment
        } else if (token.startsWith("\"") || token.startsWith("'") || token.startsWith("`")) {
            className = theme.string
        } else if (/^\d/.test(token)) {
            className = theme.number
        } else if (KEYWORDS.has(token) || line.slice(0, start).endsWith("<") || line.slice(0, start).endsWith("</")) {
            className = theme.keyword
        }

        nodes.push(
            <span key={`${start}-${token}`} className={className}>
                {token}
            </span>
        )
        cursor = start + token.length
    }

    if (cursor < line.length) {
        nodes.push(line.slice(cursor))
    }

    return nodes.length ? nodes : " "
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
    (
        {
            className,
            code,
            filename,
            language,
            copyable = true,
            copyLabel = "Copy code",
            copiedLabel = "Copied",
            copiedDuration = 5000,
            showLineNumbers = false,
            highlight = false,
            editable = false,
            onCodeChange,
            selectOnDoubleClick = true,
            theme = "dark",
            ...props
        },
        ref
    ) => {
        const [internalCode, setInternalCode] = React.useState(code)
        const codeRef = React.useRef<HTMLElement>(null)
        const textareaRef = React.useRef<HTMLTextAreaElement>(null)
        const showHeader = !!filename || !!language
        const styles = themeClasses[theme]
        const currentCode = onCodeChange ? code : internalCode
        const lines = currentCode.split("\n")

        React.useEffect(() => {
            setInternalCode(code)
        }, [code])

        const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const nextCode = event.target.value
            setInternalCode(nextCode)
            onCodeChange?.(nextCode)
        }

        const handleSelectAll = () => {
            if (!selectOnDoubleClick) return

            if (editable) {
                textareaRef.current?.select()
                return
            }

            const codeElement = codeRef.current
            if (!codeElement || !window.getSelection) return

            const range = document.createRange()
            range.selectNodeContents(codeElement)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "overflow-hidden rounded-md border",
                    styles.root,
                    className
                )}
                {...props}
            >
                {showHeader || copyable ? (
                    <div className={cn("flex items-center justify-between gap-3 border-b px-3 py-2 text-xs", styles.header)}>
                        <div className={cn("flex min-w-0 items-center gap-2", styles.meta)}>
                            {language ? (
                                <span className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase", styles.badge)}>
                                    {language}
                                </span>
                            ) : null}
                            {filename ? <span className="truncate font-mono">{filename}</span> : null}
                        </div>
                        {copyable ? (
                            <CopyButton
                                value={currentCode}
                                copyLabel={copyLabel}
                                copiedLabel={copiedLabel}
                                copiedDuration={copiedDuration}
                                variant="label"
                                className={cn(
                                    "h-7 shrink-0 rounded-md px-2 text-xs",
                                    styles.button
                                )}
                            />
                        ) : null}
                    </div>
                ) : null}
                {editable ? (
                    <div className={cn("flex overflow-hidden", styles.surface)} onDoubleClick={handleSelectAll}>
                        {showLineNumbers ? (
                            <div
                                aria-hidden="true"
                                className={cn(
                                    "select-none border-r px-3 py-4 text-right font-mono text-sm leading-relaxed",
                                    styles.lineNumber
                                )}
                            >
                                {lines.map((_, index) => (
                                    <div key={index}>{index + 1}</div>
                                ))}
                            </div>
                        ) : null}
                        <textarea
                            ref={textareaRef}
                            value={currentCode}
                            onChange={handleCodeChange}
                            spellCheck={false}
                            className={cn(
                                "min-h-[11rem] flex-1 resize-y bg-transparent p-4 font-mono text-sm leading-relaxed outline-none",
                                styles.textarea
                            )}
                            aria-label={filename ?? language ?? "Code"}
                        />
                    </div>
                ) : (
                    <pre
                        className={cn("overflow-x-auto p-4 text-sm leading-relaxed", styles.surface)}
                        onDoubleClick={handleSelectAll}
                    >
                        <code ref={codeRef} className="font-mono">
                            {showLineNumbers
                                ? lines.map((line, index) => (
                                      <span key={index} className="table-row">
                                          <span
                                              aria-hidden="true"
                                              className={cn(
                                                  "table-cell select-none border-r pr-3 text-right",
                                                  styles.lineNumber
                                              )}
                                          >
                                              {index + 1}
                                          </span>
                                          <span className="table-cell whitespace-pre pl-3">
                                              {highlight ? renderHighlightedLine(line, styles) : line || " "}
                                          </span>
                                      </span>
                                  ))
                                : lines.map((line, index) => (
                                      <span key={index} className="block whitespace-pre">
                                          {highlight ? renderHighlightedLine(line, styles) : line || " "}
                                      </span>
                                  ))}
                        </code>
                    </pre>
                )}
            </div>
        )
    }
)
CodeBlock.displayName = "CodeBlock"

export { CodeBlock }
