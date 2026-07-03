"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconSearch as Search } from "@tabler/icons-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Button,
} from "@gunjo/ui"
import { navigation } from "@/lib/navigation"
import { cn } from "@gunjo/ui"
import { useLocale } from "@/components/providers/LocaleProvider"

// Top-level site pages that live outside the generated docs navigation —
// listed here so ⌘K can reach them (see issue #477).
const siteGroup = {
    title: "Site",
    items: [{ title: "Cold Tests", href: "/cold-tests" }],
}

export function CommandMenu({ overlay = false }: { overlay?: boolean }) {
    const router = useRouter()
    const { locale, t } = useLocale()
    const [open, setOpen] = React.useState(false)
    const isJa = locale === "ja"

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 transition-colors",
                    overlay && "gunjo-header-search-overlay"
                )}
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">
                    {isJa ? "ドキュメントを検索..." : "Search documentation..."}
                </span>
                <span className="inline-flex lg:hidden">
                    {isJa ? "検索..." : "Search..."}
                </span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder={isJa ? "コマンドまたは検索語を入力..." : "Type a command or search..."} />
                <CommandList>
                    <CommandEmpty>{isJa ? "一致する結果がありません。" : "No results found."}</CommandEmpty>
                    {[siteGroup, ...navigation].map((group) => (
                        <CommandGroup key={group.title} heading={t(group.title)}>
                            {group.items.map((navItem) => {
                                if ('disabled' in navItem && navItem.disabled) return null;
                                return (
                                    <CommandItem
                                        key={navItem.href}
                                        value={`${navItem.title} ${t(navItem.title)}`}
                                        onSelect={() => {
                                            runCommand(() => router.push(navItem.href as string))
                                        }}
                                    >
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                            <Search className="h-3 w-3" />
                                        </div>
                                        {t(navItem.title)}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    )
}
