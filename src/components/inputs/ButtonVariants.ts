import { cva, type VariantProps } from "class-variance-authority"
import type { ButtonVariantKey } from "./generated/variant-keys"
import { buttonDefaultVariantKey } from "./generated/default-variant-keys"

const buttonVariantClasses: Record<ButtonVariantKey, string> = {
    default:
        "bg-foreground text-background shadow hover:bg-foreground/90",
    primary:
        "bg-primary-strong text-primary-strong-foreground shadow-sm hover:bg-primary-strong",
    info:
        "bg-info-strong text-info-strong-foreground shadow-sm hover:bg-info-strong",
    success:
        "bg-success-strong text-success-strong-foreground shadow-sm hover:bg-success-strong",
    warning:
        "bg-warning-strong text-warning-strong-foreground shadow-sm hover:bg-warning-strong",
    destructive:
        "bg-destructive-strong text-destructive-strong-foreground shadow-sm hover:bg-destructive-strong",
    outline:
        "border border-border bg-transparent shadow-sm hover:bg-muted hover:text-foreground",
    secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "bg-transparent hover:bg-muted hover:text-foreground",
    link: "bg-transparent text-foreground underline underline-offset-4 hover:underline",
}

export const buttonVariants = cva(
    "inline-flex items-center justify-center w-fit gap-2 rounded-lg rounded-[var(--radius)] text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: buttonVariantClasses,
            size: {
                xs: "h-7 rounded-md px-2 text-xs",
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                xl: "h-11 rounded-md px-10 text-base",
                // 44px tap target at default density — the touch-safe size for
                // mobile / consumer (toC) screens (WCAG 2.5.5). Unlike `xl`
                // (44px but oversized padding/type), `touch` reads as a normal
                // button. `icon-touch` is its icon-only twin. (#362)
                touch: "h-11 px-4 py-2",
                icon: "h-9 w-9",
                "icon-touch": "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: buttonDefaultVariantKey,
            size: "default",
        },
    }
)

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>
