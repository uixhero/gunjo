"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const formFieldVariants = cva("flex flex-col gap-1.5 p-4")
const formGroupVariants = cva(
    "flex flex-col gap-1.5 p-0 [&_[data-slot=combobox]]:!w-full [&_[data-slot=date-picker]]:!w-full [&_[data-slot=date-range-picker]]:!w-full [&_[data-slot=editable-field]]:!w-full [&_[data-slot=file-uploader]]:!w-full [&_[data-slot=form-control]]:w-full [&_[data-slot=input]]:!w-full [&_[data-slot=input-otp]]:!w-full [&_[data-slot=mention]]:!w-full [&_[data-slot=number-input]]:!w-full [&_[data-slot=password-group]]:!w-full [&_[data-slot=password-input]]:!w-full [&_[data-slot=phone-input]]:!w-full [&_[data-slot=postal-code-input]]:!w-full [&_[data-slot=range-slider]]:!w-full [&_[data-slot=search-input]]:!w-full [&_[data-slot=select-control]]:!w-full [&_[data-slot=slider]]:!w-full [&_[data-slot=tag-input]]:!w-full [&_[data-slot=textarea]]:!w-full [&_[data-slot=time-picker]]:!w-full"
)

interface FormFieldContextValue {
    /** id applied to the control (so FormLabel's htmlFor matches). */
    id: string
    /**
     * id of the `FormDescription`, or `undefined` when the field renders none.
     * `FormControl` only wires `aria-describedby` to it when defined, so a
     * description-less field never references a non-existent id.
     */
    descriptionId?: string
    messageId: string
    error?: React.ReactNode
    required?: boolean
}

/** Recursively check whether `children` contains an element of `type`. */
function containsElementType(children: React.ReactNode, type: React.ElementType): boolean {
    let found = false
    React.Children.forEach(children, (child) => {
        if (found || !React.isValidElement(child)) return
        if (child.type === type) {
            found = true
            return
        }
        const nested = (child.props as { children?: React.ReactNode }).children
        if (nested) found = containsElementType(nested, type)
    })
    return found
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

/**
 * Read the current field's wiring (control id, description/message ids, error,
 * required) inside a `FormField`. Returns `null` outside one.
 */
export function useFormField() {
    return React.useContext(FormFieldContext)
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Field error. When set, `FormControl`'s control is marked `aria-invalid`
     * and `aria-describedby` the message, and `FormMessage` renders it with
     * `role="alert"`. Omit (or `undefined`/`false`) for a valid field.
     */
    error?: React.ReactNode
    /** Marks the field required — `FormLabel` shows `*`, the control gets `aria-required`. */
    required?: boolean
    /** Base id for the control (auto-generated when omitted). */
    id?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    ({ className, error, required, id: idProp, ...props }, ref) => {
        const reactId = React.useId()
        const id = idProp ?? `${reactId}-control`
        // Only reserve a description id when a FormDescription is actually
        // rendered — otherwise FormControl would point aria-describedby at a
        // non-existent id (a11y defect surfaced by cold-test #32). (#175)
        const hasDescription = containsElementType(props.children, FormDescription)
        const value = React.useMemo<FormFieldContextValue>(
            () => ({
                id,
                descriptionId: hasDescription ? `${reactId}-description` : undefined,
                messageId: `${reactId}-message`,
                error,
                required,
            }),
            [id, reactId, error, required, hasDescription]
        )
        return (
            <FormFieldContext.Provider value={value}>
                <div ref={ref} className={cn(formFieldVariants(), className)} {...props} data-slot="form-field" />
            </FormFieldContext.Provider>
        )
    }
)
FormField.displayName = "FormField"

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn(formGroupVariants(), className)} {...props} data-slot="form-group" />
    )
)
FormGroup.displayName = "FormGroup"

export interface FormLabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
    ({ className, children, htmlFor, ...props }, ref) => {
        const field = useFormField()
        return (
            <label
                ref={ref}
                htmlFor={htmlFor ?? field?.id}
                className={cn(
                    "text-sm font-medium leading-none text-foreground",
                    field?.error && "text-destructive",
                    className
                )}
                {...props}
                data-slot="form-label"
            >
                {children}
                {field?.required ? (
                    <span aria-hidden="true" className="ml-0.5 text-destructive">*</span>
                ) : null}
            </label>
        )
    }
)
FormLabel.displayName = "FormLabel"

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
    ({ className, children, ...props }, ref) => {
        const field = useFormField()
        let content: React.ReactNode = children
        if (field && React.isValidElement(children)) {
            const childProps = children.props as Record<string, unknown>
            const describedBy =
                [
                    field.descriptionId,
                    field.error ? field.messageId : undefined,
                    childProps["aria-describedby"] as string | undefined,
                ]
                    .filter(Boolean)
                    .join(" ") || undefined
            content = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
                id: (childProps.id as string | undefined) ?? field.id,
                "aria-describedby": describedBy,
                "aria-invalid": field.error ? true : childProps["aria-invalid"],
                "aria-required": field.required || childProps["aria-required"] || undefined,
            })
        }
        return (
            <div ref={ref} className={cn(className)} {...props} data-slot="form-control">
                {content}
            </div>
        )
    }
)
FormControl.displayName = "FormControl"

export interface FormDescriptionProps
    extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    FormDescriptionProps
>(({ className, id, ...props }, ref) => {
    const field = useFormField()
    return (
        <p
            ref={ref}
            id={id ?? field?.descriptionId}
            className={cn("text-xs font-normal text-muted-foreground", className)}
            {...props}
            data-slot="form-description"
        />
    )
})
FormDescription.displayName = "FormDescription"

export interface FormMessageProps
    extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
    ({ className, children, id, ...props }, ref) => {
        const field = useFormField()
        const body = field?.error ?? children
        if (!body) return null
        return (
            <p
                ref={ref}
                id={id ?? field?.messageId}
                role="alert"
                className={cn("text-xs font-medium text-destructive", className)}
                {...props}
                data-slot="form-message"
            >
                {body}
            </p>
        )
    }
)
FormMessage.displayName = "FormMessage"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
    ({ className, ...props }, ref) => (
        <form ref={ref} className={cn("flex flex-col gap-4", className)} {...props} data-slot="form" />
    )
)
Form.displayName = "Form"

export {
    Form,
    FormField,
    FormGroup,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    formFieldVariants,
    formGroupVariants,
}
