import * as React from "react"
import {
    IconChevronLeft as ChevronLeft,
    IconChevronLeftPipe as ChevronLeftPipe,
    IconChevronRight as ChevronRight,
    IconChevronRightPipe as ChevronRightPipe,
    IconDots as MoreHorizontal,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils"
import { ButtonProps } from "../inputs/Button"
import { buttonVariants } from "../inputs/ButtonVariants"


const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex flex-col w-full justify-center", className)}
        {...props}
    />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
    />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
    isActive?: boolean
} & Pick<ButtonProps, "size"> &
    React.ComponentProps<"a">

type PaginationDirectionProps = React.ComponentProps<typeof PaginationLink> & {
    label?: React.ReactNode
}

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            "aria-disabled:pointer-events-none aria-disabled:opacity-50",
            className
        )}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationFirst = ({
    className,
    children,
    label = "First",
    ...props
}: PaginationDirectionProps) => (
    <PaginationLink
        aria-label="Go to first page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeftPipe className="h-4 w-4" />
        <span>{children ?? label}</span>
    </PaginationLink>
)
PaginationFirst.displayName = "PaginationFirst"

const PaginationPrevious = ({
    className,
    children,
    label = "Previous",
    ...props
}: PaginationDirectionProps) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        <span>{children ?? label}</span>
    </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
    className,
    children,
    label = "Next",
    ...props
}: PaginationDirectionProps) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>{children ?? label}</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationLast = ({
    className,
    children,
    label = "Last",
    ...props
}: PaginationDirectionProps) => (
    <PaginationLink
        aria-label="Go to last page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>{children ?? label}</span>
        <ChevronRightPipe className="h-4 w-4" />
    </PaginationLink>
)
PaginationLast.displayName = "PaginationLast"

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
}
