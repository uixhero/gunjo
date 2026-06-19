import * as React from "react"
import { cn } from "../../lib/utils"

interface AuthTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    logo?: React.ReactNode
    quote?: string
    quoteAuthor?: string
    children: React.ReactNode // The form
}

export function AuthTemplate({
    children,
    logo,
    quote,
    quoteAuthor,
    className,
    ...props
}: AuthTemplateProps) {
    return (
        <div className={cn("relative flex h-fit min-h-screen w-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0", className)} {...props}>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-background dark:border-r lg:flex">
                <div className="absolute inset-0 bg-foreground" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    {logo || (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-6 w-6"
                            >
                                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                            </svg>
                            Acme Inc
                        </>
                    )}
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;{quote || "This library has saved me infinite hours. I can build rich apps faster than ever before."}&rdquo;
                        </p>
                        <footer className="text-sm">{quoteAuthor || "Sofia Davis"}</footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex h-full w-full items-center justify-center p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6 sm:w-[350px]">
                    {children}
                </div>
            </div>
        </div>
    )
}
